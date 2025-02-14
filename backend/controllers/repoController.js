const mongoose = require('mongoose');
const Repository = require('../models/Repository');
const User = require('../models/User');
const Issue = require('../models/Issue');
const {S3,S3_BUCKET}=require('../config/aws-config');

const getAllRepositories = async (req, res) => {
    try {
        const repositories = await Repository.find().populate("owner").populate("issues");
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
        const params = {
            Bucket: S3_BUCKET,
            Prefix: `${user.email}/${repo.name}/commits/`,
        };
        const data = await S3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.json([]); // No commits found
        }

        const commits = {};
        const latestFiles = new Map(); // Map to store the latest version of each file

        for (const item of data.Contents) {
            const fileKey = item.Key;
            const parts = fileKey.split('/');
            const commitId = parts[parts.length - 2]; // Extract commit ID
            const fileName = parts.pop();

            if (!commits[commitId]) {
                commits[commitId] = {
                    id: commitId,
                    files: [],
                    commitMessage: 'No commit message found', // Default
                    date: null,
                };
            }

            if (fileName === 'commit.json') {
                try {
                    // Fetch commit.json to get the commit message
                    const commitParams = { Bucket: S3_BUCKET, Key: fileKey };
                    const commitData = await S3.getObject(commitParams).promise();
                    const commitJson = JSON.parse(commitData.Body.toString('utf-8'));

                    commits[commitId].commitMessage = commitJson.message || 'No commit message';
                    commits[commitId].date = commitJson.date;
                } catch (error) {
                    console.error(`Error fetching commit.json for commit ${commitId}:`, error);
                }
            } else {
                // If the file is newer, update the map (keep the most recent version)
                if (!latestFiles.has(fileName) || new Date(item.LastModified) > new Date(latestFiles.get(fileName).lastModified)) {
                    latestFiles.set(fileName, {
                        fileName,
                        key: fileKey,
                        lastModified: item.LastModified,
                        size: item.Size,
                        commitId: commitId, // Store which commit the file belongs to
                        commitMessage: commits[commitId]?.commitMessage || "No commit message",
                        commitDate: commits[commitId]?.date || "Unknown date"
                    });
                }
            }
        }

        // Convert latestFiles map to an array and return only the latest version of each file
        res.json([...latestFiles.values()]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const fetchFileContent = async (req, res) => {
    const { userId, repoId, fileName } = req.params;
    const user = await User.find({_id:userId});
    const repo = await Repository.find({_id:repoId});
    try {

        if (!user[0]) return res.status(404).json({ message: "User doesn't exist" });
        if (!repo[0]) return res.status(404).json({ message: "Repository doesn't exist" });

        const params = { Bucket: S3_BUCKET, Prefix: `${user[0].email}/${repo[0].name}/commits/` };
        const data = await S3.listObjectsV2(params).promise();

        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ message: "No commits found" });
        }

        // 🔥 Group Files by commit id
        const commitFolders = new Map();
        for (const item of data.Contents) {
            const parts = item.Key.split('/');
            const commitId = parts[parts.length - 2];
            if (!commitFolders.has(commitId)) {
                commitFolders.set(commitId, []);
            }
            commitFolders.get(commitId).push(item);
        }
        const latestCommitId = [...commitFolders.keys()].pop();
        const latestCommitFiles = commitFolders.get(latestCommitId);

        // 🔥 Find the requested file in the latest commit
        const fileObject = latestCommitFiles.find(file => file.Key.endsWith(`/${fileName}`));

        if (!fileObject) {
            return res.status(404).json({ message: "File not found in the latest commit" });
        }

        // 🔥 Fetch file content
        const fileParams = { Bucket: S3_BUCKET, Key: fileObject.Key };
        const fileData = await S3.getObject(fileParams).promise();
        const fileContent = fileData.Body.toString('utf-8');

        res.json({ fileName, content: fileContent, commitId: latestCommitId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const createRepository = async (req, res) => {
    try {
        const { name, description, owner, visibility } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
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

//Get all repo for a user
const userRepositories = async (req, res) => {
    try {
        const userId = req.params.uid;
        const repository = await Repository.find({ owner: userId }).populate("owner").populate("issues");
        if (!repository) {
            return res.status(404).json({ message: "No repositories found" })
        }
        res.status(200).json(repository);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Get particular repo by repoid
const userRepository = async (req, res) => {
    try {
        const repoId = req.params.id;
        const repository = await Repository.findById(repoId).populate("owner").populate("issues");
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
        const repository = await Repository.find({ name: repoName }).populate("owner").populate("issues");
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
    try{
        const repoId = req.params.repoid;
        const userId = req.params.userid;
        const repo = await Repository.findById(repoId);
        let user = await User.findById(userId);
        if (!repo || !user) {
            return res.status(404).json({ message: "Repository or User doesn't exist" });
        }
        user.starred_repositories=user.starred_repositories.filter((ele)=>ele._id!=repoId);
        await user.save();
        res.status(200).json("Repository is unmarked");
    }catch(e){
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
        const deleted = await Repository.deleteOne({ _id: repoId });
        res.status(200).json({ message: "Repository is deleted successfully" });
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
