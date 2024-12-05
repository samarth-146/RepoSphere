const express=require('express');
const userRouter=express.Router();
const userController=require('../controllers/userController');


userRouter.get('/alluser',userController.getAllUsers);
userRouter.post('/signin',userController.login);
userRouter.post('/signup',userController.signup);
userRouter.get('/profile',userController.getProfile);
userRouter.put('/updateProfile',userController.updateProfile);
userRouter.delete('/deleteProfile',userController.deleteProfile);


module.exports=userRouter;