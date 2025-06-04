const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

async function Commit(message) {
    const repoPath = path.resolve(process.cwd(), '.Sphere');
    const commitPath = path.join(repoPath, 'commits');
    const stagingPath = path.join(repoPath, 'staging');

    try {
        const id = uuidv4(); 
        const idPath = path.join(commitPath, id);

        await fs.mkdir(idPath, { recursive: true });

        const files = await fs.readdir(stagingPath);
        if (files.length === 0) {
            console.log("No files in staging area to commit.");
            return;
        }
        for (let file of files) {
            const filePath = path.join(stagingPath, file);
            const commitFilePath = path.join(idPath, file);

            await fs.copyFile(filePath, commitFilePath);
        }

        const metadata = {
            message,
            date: new Date().toISOString(),
            files: files
        };
        await fs.writeFile(
            path.join(idPath, 'commit.json'),
            JSON.stringify(metadata, null, 2)
        );


        console.log(`Commit "${id}" created successfully with message: "${message}"`);
    } catch (e) {
        console.error('Error while committing the files:', e);
    }
}

module.exports = Commit;
