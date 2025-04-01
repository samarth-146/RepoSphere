const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

async function Commit(message) {
    const repoPath = path.resolve(process.cwd(), '.Sphere');
    const commitPath = path.join(repoPath, 'commits');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        const id = uuidv4(); // Generate a unique commit ID
        const idPath = path.join(commitPath, id);

        // Create a new commit directory
        await fs.mkdir(idPath, { recursive: true });

        // Get all files in the staging area
        const files = await fs.readdir(stagingPath);
        if (files.length === 0) {
            console.log("No files in staging area to commit.");
            return;
        }
        console.log('Committing files:', files);

        for (let file of files) {
            const filePath = path.join(stagingPath, file);
            const commitFilePath = path.join(idPath, file);

            // Move (not just copy) the file from staging to commit directory
            await fs.rename(filePath, commitFilePath);
        }

        // Write the commit metadata
        await fs.writeFile(
            path.join(idPath, 'commit.json'),
            JSON.stringify({ message: message, date: new Date().toISOString() })
        );

        console.log(`Commit "${id}" created successfully with message: "${message}"`);
    } catch (e) {
        console.error('Error while committing the files:', e);
    }
}

module.exports = Commit;
