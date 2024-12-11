const express=require('express');
const userRouter=express.Router();
const userController=require('../controllers/userController');


userRouter.get('/alluser',userController.getAllUsers);
userRouter.post('/signin',userController.login);
userRouter.post('/signup',userController.signup);
userRouter.get('/profile/:id',userController.getProfile);
userRouter.put('/:id',userController.updateProfile);
userRouter.delete('/:id',userController.deleteProfile);


module.exports=userRouter;