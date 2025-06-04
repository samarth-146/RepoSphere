const mongoose = require('mongoose');
const Repository = require('../models/Repository');
const User = require('../models/User');
const Issue = require('../models/Issue');
const { S3, S3_BUCKET } = require('../config/aws-config');

const getAllRepositories = async (req, res) => {
    try {
        const repositories = await Repository.find().populate("owner");
        if (!repositories)
            return res.status(404).json({ message: "No results found" });
        res.status(200).json(repositories);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getRepoContent = async (req, res) => {
    const { userId, repoId } = req.params;

    const user = await User.findById(userId);
    const repo = await Repository.findById(repoId);

    if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    if (!repo) {
        return res.status(404).json({ message: "Repository doesn't exist" });
    }

    try {
        const prefix = `${user.email}/${repo.name}/commits/`;
        const params = { Bucket: S3_BUCKET, Prefix: prefix };
        const data = await S3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.json([]); 
        }

        const commitsMeta = {}; 
        const fileVersions = new Map(); 

        for (const item of data.Contents) {
            if (item.Key.endsWith("commit.json")) {
                const parts = item.Key.split('/');
                const commitId = parts[parts.length - 2];
                try {
                    const commitObj = await S3.getObject({
                        Bucket: S3_BUCKET,
                        Key: item.Key
                    }).promise();
                    const metadata = JSON.parse(commitObj.Body.toString('utf-8'));
                    commitsMeta[commitId] = {
                        message: metadata.message || "No commit message",
                        date: metadata.date || "Unknown date"
                    };
                } catch (error) {
                    console.error(`Error reading commit.json for ${item.Key}`, error);
                }
            }
        }

        for (const item of data.Contents) {
            if (item.Key.endsWith("commit.json")) continue;

            const parts = item.Key.split('/');
            const commitId = parts[parts.length - 2];
            const fileName = parts[parts.length - 1];
            const lastModified = new Date(item.LastModified);

            const existing = fileVersions.get(fileName);
            if (!existing || lastModified > new Date(existing.lastModified)) {
                fileVersions.set(fileName, {
                    fileName,
                    key: item.Key,
                    lastModified,
                    size: item.Size,
                    commitId
                });
            }
        }

        const fileOriginMap = new Map();

        for (const item of data.Contents) {
            if (item.Key.endsWith("commit.json")) continue;

            const parts = item.Key.split('/');
            const commitId = parts[parts.length - 2];
            const fileName = parts[parts.length - 1];
            const lastModified = new Date(item.LastModified);

            if (!fileOriginMap.has(fileName)) {
                fileOriginMap.set(fileName, {
                    commitId,
                    message: commitsMeta[commitId]?.message || 'No commit message',
                    date: commitsMeta[commitId]?.date || 'Unknown date'
                });
            } else {
                const existing = fileOriginMap.get(fileName);
                if (lastModified < new Date(fileVersions.get(fileName).lastModified)) {
                    fileOriginMap.set(fileName, {
                        commitId,
                        message: commitsMeta[commitId]?.message || 'No commit message',
                        date: commitsMeta[commitId]?.date || 'Unknown date'
                    });
                }
            }
        }

        const result = [];
        for (const [fileName, fileInfo] of fileVersions.entries()) {
            const origin = fileOriginMap.get(fileName);
            result.push({
                fileName,
                key: fileInfo.key,
                lastModified: fileInfo.lastModified,
                size: fileInfo.size,
                commitId: origin.commitId,
                commitMessage: origin.message,
                commitDate: origin.date
            });
        }

        return res.json(result);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const fetchFileContent = async (req, res) => {
    const { userId, repoId, fileName } = req.params;

    try {
        const user = await User.findById(userId);
        const repo = await Repository.findById(repoId);

        if (!user) return res.status(404).json({ message: "User doesn't exist" });
        if (!repo) return res.status(404).json({ message: "Repository doesn't exist" });

        const prefix = `${user.email}/${repo.name}/commits/`;
        const params = { Bucket: S3_BUCKET, Prefix: prefix };
        const data = await S3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No commits found" });
        }

        const commitFolders = new Map();
        for (const item of data.Contents) {
            const parts = item.Key.split('/');
            const commitId = parts[parts.length - 2];
            if (!commitFolders.has(commitId)) {
                commitFolders.set(commitId, []);
            }
            commitFolders.get(commitId).push(item);
        }

        let latestFile = null;

        for (const [commitId, files] of commitFolders.entries()) {
            for (const file of files) {
                if (file.Key.endsWith(`/${fileName}`)) {
                    if (
                        !latestFile ||
                        new Date(file.LastModified) > new Date(latestFile.LastModified)
                    ) {
                        latestFile = { ...file, commitId };
                    }
                }
            }
        }

        if (!latestFile) {
            return res.status(404).json({ message: "File not found in any commit" });
        }

        const fileParams = {
            Bucket: S3_BUCKET,
            Key: latestFile.Key
        };
        const fileData = await S3.getObject(fileParams).promise();
        const fileContent = fileData.Body.toString('utf-8');

        const metadataKey = `${user.email}/${repo.name}/commits/${latestFile.commitId}/commit.json`;
        const metadataData = await S3.getObject({ Bucket: S3_BUCKET, Key: metadataKey }).promise();
        const metadata = JSON.parse(metadataData.Body.toString('utf-8'));

        return res.json({
            fileName,
            content: fileContent,
            commitId: latestFile.commitId,
            message: metadata.message,
            date: metadata.date
        });

    } catch (error) {
        console.error("Error fetching file content:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


const createRepository = async (req, res) => {
    try {
        const { name, description, owner, visibility } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Repository name is required" });
        }
        if (!owner) {
            return res.status(400).json({ message: "User id is required" });
        }
        const user = await User.findById(owner);
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist" });
        }
        const existRepo = await Repository.findOne({ name: name, owner: owner });
        if (existRepo) {
            return res.status(400).json({ message: "Repository name is already taken" });
        }
        const newRepo = new Repository({
            name: name,
            description: description,
            owner: owner,
            visibility: visibility,
        })
        const data = await newRepo.save();
        user.repositories.push(data._id);
        await user.save();
        res.status(201).json({ message: "Repository is created", data });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const userRepositories = async (req, res) => {
    try {
        const userId = req.params.uid;
        const repository = await Repository.find({ owner: userId }).populate("owner");
        if (!repository) {
            return res.status(404).json({ message: "No repositories found" })
        }
        res.status(200).json(repository);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const userRepository = async (req, res) => {
    try {
        const repoId = req.params.id;
        const repository = await Repository.findById(repoId).populate("owner");
        if (!repository) {
            return res.status(404).json({ message: "No repository found" });
        }
        res.status(200).json(repository);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const repoName = async (req, res) => {
    try {
        const repoName = req.params.name;
        const repository = await Repository.find({ name: repoName }).populate("owner");
        if (!repository) {
            return res.status(404).json({ message: "No repository found" });
        }
        res.status(200).json(repository);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const starredRepository = async (req, res) => {
    try {
        const repoId = req.params.repoid;
        const userId = req.params.userid;
        const repo = await Repository.findById(repoId);
        let user = await User.findById(userId);
        if (!repo || !user) {
            return res.status(404).json({ message: "Repository or User doesn't exist" });
        }
        if (user.starred_repositories.includes(repo._id)) {
            return res.status(400).json({ message: "Repository already starred" });
        }
        user.starred_repositories.push(repo._id);
        user = await user.save();
        res.status(200).json(user);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const removeStarredRepository = async (req, res) => {
    try {
        const repoId = req.params.repoid;
        const userId = req.params.userid;
        const repo = await Repository.findById(repoId);
        let user = await User.findById(userId);
        if (!repo || !user) {
            return res.status(404).json({ message: "Repository or User doesn't exist" });
        }
        user.starred_repositories = user.starred_repositories.filter((ele) => ele._id != repoId);
        await user.save();
        res.status(200).json("Repository is unmarked");
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const toggleVisibility = async (req, res) => {
    try {
        const repoId = req.params.id;
        const repository = await Repository.findById(repoId);
        if (!repository) {
            return res.status(404).json({ message: "No repository found" });
        }
        const visibility = repository.visibility;
        let updatedToggle;
        if (visibility == "private") {
            updatedToggle = await Repository.updateOne({ _id: repoId }, { visibility: "public" });
        }
        else {
            updatedToggle = await Repository.updateOne({ _id: repoId }, { visibility: "private" });
        }
        res.status(200).json({ message: "Visibility changed successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteRepository = async (req, res) => {
    try {
        const repoId = req.params.id;

        const repository = await Repository.findById(repoId);
        if (!repository) {
            return res.status(404).json({ message: "No repository found" });
        }

        const updatedUsers = await User.updateMany(
            { repositories: repoId },
            { $pull: { repositories: repoId, starred_repositories: repoId } }
        );

        console.log("Updated Users:", updatedUsers);

        await Repository.deleteOne({ _id: repoId });

        res.status(200).json({ message: "Repository deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


module.exports = {
    getAllRepositories,
    userRepositories,
    fetchFileContent,
    userRepository,
    toggleVisibility,
    deleteRepository,
    repoName,
    createRepository,
    starredRepository,
    removeStarredRepository,
    getRepoContent
};
