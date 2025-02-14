const fs = require('fs').promises;
const path = require('path');
const User=require('../models/User');
const Repository=require('../models/Repository');
const dotenv = require('dotenv');
const connectDB=require('../db');
const mongoose=require('mongoose')

dotenv.config();

async function Init(email, repositoryName) {
    if (!email || !repositoryName) {
        console.error('Email and repository name are required to initialize.');
        return;
    }
    await connectDB();

    const user=await User.findOne({email:email});
    if(!user){
        console.error("User doesn't exist");
        await mongoose.disconnect();
        return;
    }
    const repo=await Repository.findOne({name:repositoryName,owner:user._id});
    if(!repo){
        console.log("Repository doesn't exist");
        await mongoose.disconnect();
        return;
    }

    const repoPath = path.resolve(process.cwd(), '.Sphere');
    const commitPath = path.join(repoPath, 'commits');

    try{
        await fs.access(repoPath);
        console.log("Repository is already initialized");
        await mongoose.disconnect();
        return;
    }catch(e){
    }

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitPath, { recursive: true });

        const configData = {
            bucket: 'S3',
            email: email,
            repository: repositoryName,
        };

        await fs.writeFile(path.join(repoPath, 'config.json'), JSON.stringify(configData));
        console.log(`Initialized repository '${repositoryName}' for user '${email}' successfully.`);
    } catch (e) {
        console.error('Error while initializing:', e);
    }
    finally{
        await mongoose.disconnect();
    }
}

module.exports = Init;
