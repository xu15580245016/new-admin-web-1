var express = require('express');
const CommentController = require('../../controllers/admin/CommentController');
var CommentRouter = express.Router();

// 管理端评论路由
CommentRouter.get('/adminapi/comment/list', CommentController.getList);
CommentRouter.put('/adminapi/comment/status', CommentController.updateStatus);
CommentRouter.delete('/adminapi/comment/delete/:_id', CommentController.delete);

module.exports = CommentRouter;
