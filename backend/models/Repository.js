const mongoose=require('mongoose');
const {Schema}=mongoose;

const repoSchema=new Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    description:{
        type:String,
        default:"",
    },
    content:[
        {
            type:String,
            default:[]
        }
    ],
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
    issues:[
        {
            type:Schema.Types.ObjectId,
            ref:"Issue",
            default:[],
        }
    ]
});

const Repository=mongoose.model("Repository",repoSchema);

module.exports=Repository;