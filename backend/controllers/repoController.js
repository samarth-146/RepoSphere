const mongoose = require('mongoose');
const Repository = require('../models/Repository');
const User = require('../models/User');
const Issue = require('../models/Issue');

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
    userRepository,
    toggleVisibility,
    deleteRepository,
    repoName,
    createRepository,
    starredRepository,
    removeStarredRepository
};
