const express = require('express')
const CommentController = require('../../controllers/web/CommentController')

const CommentRouter = express.Router()

// 获取新闻评论列表 - 无需登录
CommentRouter.get('/webapi/comment/list/:newsId', CommentController.getList)

// 发布评论 - 需要登录
CommentRouter.post('/webapi/comment/add', CommentController.add)

// 删除评论 - 需要登录且本人或管理员
CommentRouter.delete('/webapi/comment/delete/:_id', CommentController.delete)

module.exports = CommentRouter