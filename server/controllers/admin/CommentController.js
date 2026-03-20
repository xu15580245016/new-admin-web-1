const CommentService = require("../../services/admin/CommentService")
const JWT = require('../../util/JWT')

const CommentController = {
    // 获取所有评论列表（管理后台）- 需要管理员权限
    getList: async (req, res) => {
        try {
            // 从token中获取用户信息（app.js已校验过token）
            const token = req.headers['authorization'].split(" ")[1]
            let payload = JWT.verify(token)
            
            // 判断是否为管理员（role: 1-管理员，2-编辑）
            if (payload.role !== 1) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '权限不足，需要管理员权限'
                })
            }
            
            const { newsId, status, page, limit } = req.query
            
            const result = await CommentService.getList({
                newsId,
                status,
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
    
    // 删除评论（管理员可以删除任何评论）- 需要管理员权限
    del: async (req, res) => {
        try {
            // 从token中获取用户信息（app.js已校验过token）
            const token = req.headers['authorization'].split(" ")[1]
            let payload = JWT.verify(token)
            
            // 判断是否为管理员（role: 1-管理员，2-编辑）
            if (payload.role !== 1) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '权限不足，需要管理员权限'
                })
            }
            
            const { id } = req.params
            
            const comment = await CommentService.getById({ _id: id })
            
            if (!comment) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '评论不存在'
                })
            }
            
            await CommentService.del({ _id: id })
            
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
    },
    
    // 审核/隐藏评论 - 需要管理员权限
    audit: async (req, res) => {
        try {
            // 从token中获取用户信息（app.js已校验过token）
            const token = req.headers['authorization'].split(" ")[1]
            let payload = JWT.verify(token)
            
            // 判断是否为管理员（role: 1-管理员，2-编辑）
            if (payload.role !== 1) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '权限不足，需要管理员权限'
                })
            }
            
            const { id } = req.params
            const { status } = req.body
            
            if (status === undefined || status === null) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '状态参数不能为空'
                })
            }
            
            const comment = await CommentService.getById({ _id: id })
            
            if (!comment) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '评论不存在'
                })
            }
            
            await CommentService.audit({ _id: id, status })
            
            res.send({
                ActionType: 'OK',
                msg: status == 1 ? '评论审核通过' : '评论已隐藏'
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
