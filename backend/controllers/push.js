const fs = require('fs').promises;
const path = require('path');
const { S3, S3_BUCKET } = require('../config/aws-config');

async function Push() {
    const repoPath = path.resolve(process.cwd(), '.Sphere');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        // Load repository config to get email and repository name
        const config = JSON.parse(await fs.readFile(path.join(repoPath, 'config.json')));
        const { email, repository } = config;

        if (!email || !repository) {
            console.error('Email or repository name is missing in .Sphere/config.json.');
            return;
        }

        // Get the list of commit directories
        const commitDirs = await fs.readdir(commitsPath);
        if (commitDirs.length === 0) {
            console.log('No commits found to push.');
            return;
        }

        // Fetch modification times and sort commits based on the latest modified folder
        const commitDirsWithStats = await Promise.all(
            commitDirs.map(async (dir) => {
                const fullPath = path.join(commitsPath, dir);
                const stats = await fs.stat(fullPath);
                return { dir, mtime: stats.mtime };
            })
        );

        // Sort in descending order (latest modified first)
        commitDirsWithStats.sort((a, b) => b.mtime - a.mtime);

        // Pick the latest commit based on modification time
        const latestCommit = commitDirsWithStats[0]?.dir;
        if (!latestCommit) {
            console.log('No valid commit found to push.');
            return;
        }

        const latestCommitPath = path.join(commitsPath, latestCommit);
        const files = await fs.readdir(latestCommitPath);

        for (const file of files) {
            const filePath = path.join(latestCommitPath, file);
            const fileContent = await fs.readFile(filePath);

            const params = {
                Bucket: S3_BUCKET,
                Key: `${email}/${repository}/commits/${latestCommit}/${file}`,
                Body: fileContent,
            };

            await S3.upload(params).promise();
        }

        console.log(`Successfully pushed latest commit '${latestCommit}' for repository '${repository}'.`);
    } catch (e) {
        console.error('Error while pushing the files:', e);
    }
}

module.exports = Push;
