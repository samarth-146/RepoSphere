//Create a new issue
const mongoose=require('mongoose');
const Issue=require('../models/Issue');
const Repository=require('../models/Repository');

const createIssue=async(req,res)=>{
    try{
        const {title,descritpion,repoId}=req.body;
        if(!title||!descritpion||!repoId){
           return res.status(400).json({message:"Something is missing"});
        }
        const isValid=await Repository.findById(repoId);
        if(!isValid){
            return res.status(400).json({message:"Repository doesn't exist"});
        }
        const newIssue=new Issue({
            title:title,
            description:descritpion,
            repository:repoId,
        });
        await newIssue.save();
        res.status(201).json(newIssue);
    }catch(e){
        console.error(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

//All the issues associated with the repo
const getAllIssue=async(req,res)=>{
    try{
        const repoId=req.params.id;
        const allIssues=await Issue.find({repository:repoId}).populate("repository");
        if(!allIssues){
            res.status(404).json({message:"No issues found"});
        }
        res.status(200).json(allIssues);
    }catch(e){
        console.error(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

//Single Issue
const getIssueUsingId=async(req,res)=>{
    try{
        const issueId=req.params.id;
        const issue=await Issue.findById(issueId).populate("repository");
        if(!issue){
            return res.status(404).json({message:"Issue doesn't exist"});
        }
        res.status(200).json(issue);
    }catch(e){
        console.error(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

//Update issue
const updateIssue=async(req,res)=>{
    try{
        const {title,description}=req.body;
        const issueId=req.params.id;
        const issue=await Issue.findById(issueId);
        if(!issue){
            return res.status(404).json({message:"Issue doesn't exist"});
        }
        let updatedValue;
        if(title && description){
            updatedValue=await Issue.updateOne({_id:issueId},{title:title,description:description});
        }
        else if(title){
            updatedValue=await Issue.updateOne({_id:issueId},{title:title});
        }
        else{
            updatedValue=await Issue.updateOne({_id:issueId},{description:description});
        }
        res.status(200).json(updatedValue);
    }catch(e){
        console.error(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

//Delete issue
const deleteIssue=async(req,res)=>{
    try{
        const issueId=req.params.id;
        const issue=await Issue.findById(issueId);
        if(!issue){
            return res.status(404).json({message:"Issue doesn't exist"});
        }
        const deleted=await Issue.deleteOne({_id:issueId});
        res.status(200).json({message:"Issue deleted successfully"});
    }catch(e){
        console.error(e);
        res.status(500).json({message:"Internal Server Error"});
    }
}

module.exports={
    createIssue,
    getIssueUsingId,
    getAllIssue,
    updateIssue,
    deleteIssue,
}