const mongoose=require('mongoose');
const {Schema}=mongoose;

const repoSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    content:[
        {
            type:String
        }
    ],
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    visibility:{
        type:String,
        enum:["private","public"],
        required:true,
    },
    issues:[
        {
            type:Schema.Types.ObjectId,
            ref:"Issue",
        }
    ]
});

const Repository=mongoose.model("Repository",repoSchema);

module.exports=Repository;