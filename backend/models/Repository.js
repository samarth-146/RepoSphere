const mongoose=require('mongoose');
const {Schema}=mongoose;

const repoSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        default:"",
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    visibility:{
        type:String,
        enum:["private","public"],
        default:"public",
        required:true,
    },
});

repoSchema.index({ owner: 1, name: 1 }, { unique: true });

const Repository=mongoose.model("Repository",repoSchema);

module.exports=Repository;