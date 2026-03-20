var express = require('express');
const CommentController = require('../../controllers/web/CommentController');
var CommentRouter = express.Router();

// Web端评论路由
CommentRouter.post('/webapi/comment/add', CommentController.add);
CommentRouter.get('/webapi/comment/list', CommentController.getListByNewsId);
CommentRouter.delete('/webapi/comment/delete/:_id', CommentController.delete);

module.exports = CommentRouter;
