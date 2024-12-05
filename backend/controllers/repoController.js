const getAllRepositories=(req,res)=>{
    console.log("Repo");
};

const createRepository=(req,res)=>{
    console.log("Create");
}

//Get all repo for a user
const userRepositories=(req,res)=>{
    console.log("Repo");
};

//Get particular repo for a user
const userRepository=(req,res)=>{
    console.log("Repo");
};

const repoName=(req,res)=>{
    console.log("Repo Name");
}

const toggleVisibility=(req,res)=>{
    console.log("Repo");
};

const deleteRepository=(req,res)=>{
    console.log("Delete");
};

module.exports={
    getAllRepositories,
    userRepositories,
    userRepository,
    toggleVisibility,
    deleteRepository,
    repoName,
    createRepository,
};
