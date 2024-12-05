const mongoose=require('mongoose');
const {Schema}=mongoose;

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    repositories:[
        {
            type:Schema.Types.ObjectId,
            ref:"Repository",
        }
    ],
    starred_repositories:[
        {
            type:Schema.Types.ObjectId,
            ref:"Repository",
        }
    ],
    followed_users:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    issues:[
        {
            type:Schema.Types.ObjectId,
            ref:"Issue",
        }
    ]
});

const User=mongoose.model("User",userSchema);
module.exports=User;