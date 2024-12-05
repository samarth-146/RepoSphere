const express=require('express');
const issueRouter=express.Router();

const issueController=require('../controllers/issueController');

issueRouter.get('/issue/repo',issueController.getIssueUsingRepo);
issueRouter.get('/issue/:id',issueController.getIssueUsingId);
issueRouter.post('/issue',issueController.createIssue);
issueRouter.put('/issue/:id',issueController.updateIssue);
issueRouter.delete('/issue',issueController.deleteIssue);

module.exports=issueRouter;

