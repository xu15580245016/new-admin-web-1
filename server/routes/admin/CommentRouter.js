var express = require('express');
const CommentController = require('../../controllers/admin/CommentController');
var CommentRouter = express.Router();

// Admin端接口前缀: /adminapi/

// 获取所有评论列表 - 管理员
CommentRouter.get('/adminapi/comment/list', CommentController.getList);

// 审核/隐藏评论 - 管理员
CommentRouter.put('/adminapi/comment/status/:id', CommentController.updateStatus);

// 删除评论 - 管理员
CommentRouter.delete('/adminapi/comment/delete/:id', CommentController.delete);

module.exports = CommentRouter;