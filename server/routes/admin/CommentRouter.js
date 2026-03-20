const express = require('express')
const CommentController = require('../../controllers/admin/CommentController')

const CommentRouter = express.Router()

// 后台获取所有评论列表 - 需要管理员权限
CommentRouter.get('/adminapi/comment/list', CommentController.getList)

// 审核/隐藏评论 - 需要管理员权限
CommentRouter.post('/adminapi/comment/status', CommentController.updateStatus)

// 删除评论 - 需要管理员权限
CommentRouter.delete('/adminapi/comment/delete/:_id', CommentController.delete)

module.exports = CommentRouter