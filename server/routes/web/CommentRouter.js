var express = require('express');
const CommentController = require('../../controllers/web/CommentController');

var CommentRouter = express.Router();

CommentRouter.get('/webapi/comment/list/:newsId', CommentController.getList)
CommentRouter.post('/webapi/comment/add', CommentController.add)
CommentRouter.delete('/webapi/comment/del/:id', CommentController.delList)

module.exports = CommentRouter;
