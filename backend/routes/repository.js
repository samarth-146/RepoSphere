const express=require('express');
const repoRouter=express.Router();
const repoController=require('../controllers/repoController');

repoRouter.get('/repo/all',repoController.getAllRepositories);
repoRouter.get('/repo/all/:uid',repoController.userRepositories);
repoRouter.get('/repo/:id',repoController.userRepository);
repoRouter.get('/repo/name/:name',repoController.repoName);
repoRouter.patch('/repo/visibility/:id',repoController.toggleVisibility);
repoRouter.post('/repo',repoController.createRepository);
repoRouter.delete('/repo/:id',repoController.deleteRepository);

module.exports=repoRouter;





