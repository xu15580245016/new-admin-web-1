var express = require('express');
const CommentController = require('../../controllers/web/CommentController');
var CommentRouter = express.Router();

// Web端接口前缀: /webapi/

// 获取新闻评论列表 - 无需登录
CommentRouter.get('/webapi/comment/list/:newsId', CommentController.getList);

// 发布评论 - 需要用户登录
CommentRouter.post('/webapi/comment/add', CommentController.add);

// 删除评论 - 本人或管理员
CommentRouter.delete('/webapi/comment/delete/:id', CommentController.delete);

module.exports = CommentRouter;