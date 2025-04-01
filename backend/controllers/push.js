const fs = require('fs').promises;
const path = require('path');
const { S3, S3_BUCKET } = require('../config/aws-config');

async function Push() {
    const repoPath = path.resolve(process.cwd(), '.Sphere');
    const commitsPath = path.join(repoPath, 'commits');
    const pushedCommitsPath = path.join(repoPath, 'pushed_commits.json');

    try {
        // Load repository config
        const config = JSON.parse(await fs.readFile(path.join(repoPath, 'config.json')));
        const { email, repository } = config;

        if (!email || !repository) {
            console.error('Email or repository name is missing in .Sphere/config.json.');
            return;
        }

        // Get all commit directories
        let commitDirs = await fs.readdir(commitsPath);
        if (commitDirs.length === 0) {
            console.log('No commits found to push.');
            return;
        }

        // Load previously pushed commits
        let pushedCommits = new Set();
        try {
            const pushedCommitsData = await fs.readFile(pushedCommitsPath, 'utf-8');
            pushedCommits = new Set(JSON.parse(pushedCommitsData));
        } catch (err) {
            // If file doesn't exist, assume no commits were pushed before
        }

        // Filter out already pushed commits
        commitDirs = commitDirs.filter(commit => !pushedCommits.has(commit));

        if (commitDirs.length === 0) {
            console.log('No new commits to push.');
            return;
        }

        for (const commitId of commitDirs) {
            const commitPath = path.join(commitsPath, commitId);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `${email}/${repository}/commits/${commitId}/${file}`,
                    Body: fileContent,
                };

                await S3.upload(params).promise();
            }

            // Mark this commit as pushed
            pushedCommits.add(commitId);
        }

        // Save the updated pushed commits list
        await fs.writeFile(pushedCommitsPath, JSON.stringify([...pushedCommits]));

        console.log('Successfully pushed all new commits.');
    } catch (e) {
        console.error('Error while pushing the files:', e);
    }
}

module.exports = Push;
