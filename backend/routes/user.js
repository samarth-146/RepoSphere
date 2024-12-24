const express=require('express');
const userRouter=express.Router();
const multer=require('multer');
const {storage}=require('../config/cloudinary-config');
const upload = multer({storage});
const userController=require('../controllers/userController');


userRouter.get('/alluser',userController.getAllUsers);
userRouter.post('/signin',userController.login);
userRouter.post('/signup',userController.signup);
userRouter.post('/profile/:id',upload.single('image'),userController.addProfilePic);
userRouter.get('/profile/:id',userController.getProfile);
userRouter.get('/profilepic/:id',userController.getprofilePic);
userRouter.get('/starred/:id',userController.getStarredRepository);
userRouter.put('/:id',userController.updateProfile);
userRouter.delete('/:id',userController.deleteProfile);


module.exports=userRouter;