var express = require('express');
const CommentController = require('../../controllers/web/CommentController');

var CommentAuthRouter = express.Router();

// 发布评论 - 需要用户登录
CommentAuthRouter.post('/webapi/comment/add', CommentController.add)

// 删除评论 - 需要用户登录（只能删除自己的评论）
CommentAuthRouter.delete('/webapi/comment/:id', CommentController.del)

module.exports = CommentAuthRouter;
