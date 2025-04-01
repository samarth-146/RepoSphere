const mongoose=require('mongoose');
const {Schema}=mongoose;
const bcrypt=require('bcrypt');

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
    image:{
        url:{
            type:String,
            default:""
        },
        filename:{
            type:String,
            default:"",
        },
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
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); 
    this.password = await bcrypt.hash(this.password, 10); 
    next();
  });
  

const User=mongoose.model("User",userSchema);
module.exports=User;