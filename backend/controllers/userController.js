const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { storage } = require('../config/cloudinary-config');
const upload = multer({ storage });




dotenv.config();

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) {
        return res.status(404).json({ message: "No records are found" });
    }
    res.status(200).json(users);
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const userId = user._id;
        res.status(200).json({ message: "Logged in successfully", id: userId, token: token });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const checkUsername = await User.findOne({ username });
        const checkEmail = await User.findOne({ email });
        if (checkUsername) {
            return res.status(400).json({ message: "Username already exist" });
        }
        if (checkEmail) {
            return res.status(403).json({ message: "Email already exist" });
        }
        const newUser = new User({
            username: username,
            email: email,
            password: password
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        const id = newUser._id;
        res.status(201).json({ message: "User created successfully", token, id });
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}


const addProfilePic = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const url = req.file.path;
        const filename = req.file.filename;
        user.image = { url, filename };
        await user.save();
        res.status(200).json({ message: "Profile added successfully" });
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getprofilePic = async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User doesn't exist" });
    }
    const profilepic={url:user.image.url,filename:user.image.filename};
    res.status(200).json(profilepic);
}

const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("Profile doesn't exist");
        }
        res.status(200).json(user);
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);
        let { email, password } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json("User doesn't exist");
        }
        if (email && password) {
            password = await bcrypt.hash(password, 10);
            const updatedUser = await User.updateOne({ email: user.email }, { email: email, password: password });
            res.status(200).json({ message: "Data is updated successfully", updatedUser });
        }
        else if (email) {
            console.log("Email is called");
            console.log(user);

            const updatedUser = await User.updateOne({ email: user.email }, { email: email });
            res.status(200).json({ message: "Data is updated successfully", updatedUser });
        }
        else {
            password = await bcrypt.hash(password, 10);
            const updatedUser = await User.updateOne({ email: user.email }, { password: password });
            res.status(200).json({ message: "Data is updated successfully", updatedUser });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getStarredRepository = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate("starred_repositories");
        if (!user) {
            return res.status(404).json("User doesn't exist");
        }
        res.status(200).json(user.starred_repositories);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        const deleteted = await User.deleteOne({ _id: userId });
        res.status(200).json({ message: "User deleted successfully", deleteted });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = {
    getAllUsers,
    login,
    signup,
    getProfile,
    updateProfile,
    deleteProfile,
    getStarredRepository,
    addProfilePic,
    getprofilePic
}