const express=require('express');
const repoRouter=express.Router();
const repoController=require('../controllers/repoController');

repoRouter.get('/repo/all',repoController.getAllRepositories);
repoRouter.get('/repo/files/:userId/:repoId',repoController.getRepoContent);
repoRouter.get('/repo/:userId/:repoId/:fileName',repoController.fetchFileContent);
repoRouter.get('/repo/all/:uid',repoController.userRepositories);
repoRouter.get('/repo/:id',repoController.userRepository);
repoRouter.get('/repo/name/:name',repoController.repoName);
repoRouter.post('/starred/:repoid/:userid',repoController.starredRepository);
repoRouter.delete('/starred/:repoid/:userid',repoController.removeStarredRepository);
repoRouter.patch('/repo/visibility/:id',repoController.toggleVisibility);
repoRouter.post('/repo',repoController.createRepository);
repoRouter.delete('/repo/:id',repoController.deleteRepository);


module.exports=repoRouter;





