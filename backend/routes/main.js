const express=require('express');
const mainRouter=express.Router();

const userRoute=require('./user');
const repoRouter = require('./repository');
const issueRouter = require('./issue');

mainRouter.use('/user',userRoute);
mainRouter.use('/',repoRouter);
mainRouter.use('/',issueRouter);

mainRouter.get('/',(req,res)=>{
    res.send("Sent");
});

module.exports=mainRouter