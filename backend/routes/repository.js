const express=require('express');
const repoRouter=express.Router();
const repoController=require('../controllers/repoController');

repoRouter.get('/repo/all',repoController.getAllRepositories);
repoRouter.get('/repo',repoController.userRepositories);
repoRouter.get('/repo/:id',repoController.userRepository);
repoRouter.get('/repo/:name',repoController.repoName);
repoRouter.patch('/repo/visibility',repoController.toggleVisibility);
repoRouter.post('/repo',repoController.createRepository);
repoRouter.delete('/repo',repoController.deleteRepository);

module.exports=repoRouter;





