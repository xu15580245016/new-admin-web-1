const CommentService = require("../../services/web/CommentService")
const JWT = require('../../util/JWT')

const CommentController = {
    // 发布评论 - 需要用户登录（在app.js中已校验）
    add: async (req, res) => {
        try {
            const { newsId, content } = req.body
            
            if (!newsId || !content) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '新闻ID和评论内容不能为空'
                })
            }
            
            // 从token中获取用户信息（app.js已校验过token）
            const token = req.headers['authorization'].split(" ")[1]
            let payload = JWT.verify(token)
            
            const result = await CommentService.add({
                newsId,
                userId: payload._id,
                username: payload.username,
                avatar: payload.avatar || '',
                content
            })
            
            res.send({
                ActionType: 'OK',
                data: result,
                msg: '评论发布成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message
            })
        }
    },
    
    // 获取评论列表 - 无需登录
    getList: async (req, res) => {
        try {
            const { newsId, page, limit } = req.query
            
            const result = await CommentService.getList({
                newsId,
                page: page || 1,
                limit: limit || 10
            })
            
            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message
            })
        }
    },
    
    // 删除评论 - 需要用户登录（在app.js中已校验），只能删除自己的评论
    del: async (req, res) => {
        try {
            const { id } = req.params
            
            // 从token中获取用户信息（app.js已校验过token）
            const token = req.headers['authorization'].split(" ")[1]
            let payload = JWT.verify(token)
            
            // 先查询评论是否属于当前用户
            const comment = await CommentService.getById({ _id: id })
            
            if (!comment) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '评论不存在'
                })
            }
            
            if (comment.userId.toString() !== payload._id) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '只能删除自己的评论'
                })
            }
            
            await CommentService.del({ _id: id, userId: payload._id })
            
            res.send({
                ActionType: 'OK',
                msg: '评论删除成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message
            })
        }
    }
}

module.exports = CommentController
