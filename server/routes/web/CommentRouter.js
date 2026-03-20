var express = require('express');
const CommentController = require('../../controllers/web/CommentController');

var CommentRouter = express.Router();

// 获取评论列表 - 无需登录
CommentRouter.get('/webapi/comment/list', CommentController.getList)
CommentRouter.get('/webapi/comment/list/:newsId', CommentController.getList)

// 发布评论 - 需要用户登录
CommentRouter.post('/webapi/comment/add', CommentController.add)

// 删除评论 - 需要用户登录（只能删除自己的评论）
CommentRouter.delete('/webapi/comment/:id', CommentController.del)

module.exports = CommentRouter;
