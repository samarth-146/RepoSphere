const getAllUsers=(req,res)=>{
    res.send("Get All Users");
};
const login=(req,res)=>{
    res.send("Logged in");
}
const signup=(req,res)=>{
    res.send("Sign up");
}
const getProfile=(req,res)=>{
    res.send("Profile Detail");
}
const updateProfile=(req,res)=>{
    res.send("Profile Detail");
}
const deleteProfile=(req,res)=>{
    res.send("Profile Detail");
}
module.exports={
    getAllUsers,
    login,
    signup,
    getProfile,
    updateProfile,
    deleteProfile
}