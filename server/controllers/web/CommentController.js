const CommentService = require("../../services/web/CommentService")
const AdminCommentService = require("../../services/admin/CommentService")
const JWT = require('../../util/JWT')
const UserModel = require('../../models/UserModel')

const CommentController = {
    // 发布评论 - 需要用户登录
    add: async (req, res) => {
        const { content, newsId } = req.body
        
        // 验证token
        const token = req.headers['authorization']?.split(" ")[1]
        if (!token) {
            return res.status(401).send({
                ActionType: 'ERROR',
                msg: '请先登录'
            })
        }
        
        const payload = JWT.verify(token)
        if (!payload) {
            return res.status(401).send({
                ActionType: 'ERROR',
                msg: '登录已过期，请重新登录'
            })
        }
        
        // 验证必填字段
        if (!content || !newsId) {
            return res.send({
                ActionType: 'ERROR',
                msg: '缺少必要参数'
            })
        }
        
        try {
            await CommentService.add({ 
                content, 
                newsId, 
                userId: payload._id 
            })
            res.send({
                ActionType: 'OK',
                msg: '评论发布成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: '评论发布失败'
            })
        }
    },

    // 获取新闻的评论列表 - 无需登录
    getListByNewsId: async (req, res) => {
        const { newsId, page = 1, pageSize = 10 } = req.query
        
        if (!newsId) {
            return res.send({
                ActionType: 'ERROR',
                msg: '缺少新闻ID参数'
            })
        }
        
        try {
            const result = await CommentService.getListByNewsId({ newsId, page, pageSize })
            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: '获取评论列表失败'
            })
        }
    },

    // 删除评论 - 用户删除自己的评论
    delete: async (req, res) => {
        const { _id } = req.params
        
        // 验证token
        const token = req.headers['authorization']?.split(" ")[1]
        if (!token) {
            return res.status(401).send({
                ActionType: 'ERROR',
                msg: '请先登录'
            })
        }
        
        const payload = JWT.verify(token)
        if (!payload) {
            return res.status(401).send({
                ActionType: 'ERROR',
                msg: '登录已过期，请重新登录'
            })
        }
        
        try {
            // 先查询评论确认是本人的
            const comment = await CommentService.getById({ _id })
            if (!comment) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '评论不存在'
                })
            }
            
            // 检查是否是本人或者管理员
            const user = await UserModel.findById(payload._id)
            const isOwner = comment.userId.toString() === payload._id
            const isAdmin = user && user.role === 1 // 管理员role为1
            
            if (!isOwner && !isAdmin) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: '无权删除此评论'
                })
            }
            
            // 本人删除调用web服务，管理员删除调用admin服务
            if (isAdmin && !isOwner) {
                await AdminCommentService.delete({ _id })
            } else {
                await CommentService.delete({ _id, userId: payload._id })
            }
            
            res.send({
                ActionType: 'OK',
                msg: '评论已删除'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: '删除失败'
            })
        }
    }
}

module.exports = CommentController
