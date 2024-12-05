//Create a new issue
const createIssue=(req,res)=>{
    res.send("Create");
}

//All the issues associated with the repo
const getIssueUsingRepo=(req,res)=>{
    res.send("Get Repo");
}

//Single Isse
const getIssueUsingId=(req,res)=>{
    res.send("Get Repo");
}

//Update issue
const updateIssue=(req,res)=>{
    res.send("Update");
}

//Delete issue
const deleteIssue=(req,res)=>{
    res.send("Delete");
}

module.exports={
    createIssue,
    getIssueUsingId,
    getIssueUsingRepo,
    updateIssue,
    deleteIssue,
}