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
        console.log('Staging files:', files);

        for (let file of files) {
            const filePath = path.join(stagingPath, file);

            // Copy the file to the commit directory
            await fs.copyFile(filePath, path.join(idPath, file));
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
