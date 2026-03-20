var express = require('express');
const CommentController = require('../../controllers/web/CommentController');

var CommentPublicRouter = express.Router();

// 获取评论列表 - 无需登录
CommentPublicRouter.get('/webapi/comment/list', CommentController.getList)
CommentPublicRouter.get('/webapi/comment/list/:newsId', CommentController.getList)

module.exports = CommentPublicRouter;
