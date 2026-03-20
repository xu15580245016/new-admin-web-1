var express = require('express');
const CommentController = require('../../controllers/admin/CommentController');

var CommentRouter = express.Router();

// 获取所有评论列表（管理后台）
CommentRouter.get('/adminapi/comment/list', CommentController.getList)

// 删除评论（管理员可以删除任何评论）
CommentRouter.delete('/adminapi/comment/:id', CommentController.del)

// 审核/隐藏评论
CommentRouter.put('/adminapi/comment/audit/:id', CommentController.audit)

module.exports = CommentRouter;
