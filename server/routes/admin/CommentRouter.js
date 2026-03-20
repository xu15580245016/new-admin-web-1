var express = require('express');
const CommentController = require('../../controllers/admin/CommentController');

var CommentRouter = express.Router();

CommentRouter.get('/adminapi/comment/list', CommentController.getList)
CommentRouter.put('/adminapi/comment/audit', CommentController.audit)
CommentRouter.delete('/adminapi/comment/list/:id', CommentController.delList)

module.exports = CommentRouter;
