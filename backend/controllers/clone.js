const fs = require('fs').promises;
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
const mongoose = require('mongoose');
const User = require('../models/User');
const Repository = require('../models/Repository');
const connectDB = require('../db');
const {S3,S3_BUCKET}=require('../config/aws-config');

dotenv.config();



async function Clone(email, password, repositoryName) {
    if (!email || !repositoryName || !password) {
        console.error('Email, password, and repository name are required.');
        return;
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
        console.error("User doesn't exist");
        await mongoose.disconnect();
        return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        console.error("Incorrect password");
        await mongoose.disconnect();
        return;
    }

    const repo = await Repository.findOne({ name: repositoryName, owner: user._id });
    if (!repo) {
        console.error("Repository doesn't exist");
        await mongoose.disconnect();
        return;
    }

    const repoPath = path.resolve(process.cwd(), '.Sphere');
    const commitPath = path.join(repoPath, 'commits');

    try {
        await fs.access(repoPath);
        console.log("Repository already initialized");
        await mongoose.disconnect();
        return;
    } catch (e) {
    }

    try {
        await fs.mkdir(commitPath, { recursive: true });

        const configData = {
            bucket: S3_BUCKET,
            email,
            repository: repositoryName,
        };

        await fs.writeFile(path.join(repoPath, 'config.json'), JSON.stringify(configData));
        console.log(`Initialized repository '${repositoryName}' for user '${email}'.`);

        // Download all commit
        const prefix = `${email}/${repositoryName}/commits/`;
        const listedObjects = await S3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: prefix,
        }).promise();

        if (!listedObjects.Contents.length) {
            console.log("No commits found for this repository.");
            return;
        }

        // Download all commit folders to .Sphere/commits
        for (const obj of listedObjects.Contents) {
            const relativePath = obj.Key.replace(prefix, '');
            const localPath = path.join(commitPath, relativePath);
            const dir = path.dirname(localPath);
            await fs.mkdir(dir, { recursive: true });

            const fileData = await S3.getObject({
                Bucket: S3_BUCKET,
                Key: obj.Key,
            }).promise();

            await fs.writeFile(localPath, fileData.Body);
            console.log(`Downloaded: ${relativePath}`);
        }

        // Find the latest commit.json based on timestamp
        const commitJsonObjects = listedObjects.Contents.filter(obj => obj.Key.endsWith('commit.json'));

        let latestCommit = null;
        let latestDate = 0;

        for (const obj of commitJsonObjects) {
            const commitData = await S3.getObject({
                Bucket: S3_BUCKET,
                Key: obj.Key,
            }).promise();

            const commitJson = JSON.parse(commitData.Body.toString('utf-8'));
            const commitDate = new Date(commitJson.date).getTime();

            if (commitDate > latestDate) {
                latestDate = commitDate;
                latestCommit = {
                    path: obj.Key.substring(0, obj.Key.lastIndexOf('/')),
                    files: commitJson.files
                };
            }
        }

        // Restore latest commit files to working directory
        if (latestCommit && latestCommit.files.length > 0) {
            for (const file of latestCommit.files) {
                const fileKey = `${latestCommit.path}/${file}`;
                const fileData = await S3.getObject({
                    Bucket: S3_BUCKET,
                    Key: fileKey,
                }).promise();

                const localFilePath = path.join(process.cwd(), file);
                await fs.mkdir(path.dirname(localFilePath), { recursive: true });
                await fs.writeFile(localFilePath, fileData.Body);
                console.log(`Extracted file to working directory: ${file}`);
            }
        } else {
            console.log("No valid commit found to extract files.");
        }

    } catch (e) {
        console.error("Error during cloning:", e.message);
    } finally {
        await mongoose.disconnect();
    }
}

module.exports = Clone;
