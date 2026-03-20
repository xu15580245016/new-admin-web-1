const CommentService = require('../../services/admin/CommentService')
const JWT = require('../../util/JWT')
const UserModel = require('../../models/UserModel')

const CommentController = {
    // 获取所有评论列表（管理端）- 管理员
    getList: async (req, res) => {
        try {
            // 验证权限 - 管理员
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
            
            const user = await UserModel.findById(payload._id)
            if (!user || user.role !== 1) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: '无权限访问'
                })
            }
            
            const result = await CommentService.getList()
            
            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message || '获取评论列表失败'
            })
        }
    },

    // 审核/隐藏评论 - 管理员
    updateStatus: async (req, res) => {
        try {
            const { id } = req.params
            const { status } = req.body
            
            // 验证权限 - 管理员
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
            
            const user = await UserModel.findById(payload._id)
            if (!user || user.role !== 1) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: '无权限操作'
                })
            }
            
            if (![0, 1, 2].includes(Number(status))) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '状态参数无效'
                })
            }
            
            const result = await CommentService.updateStatus(id, Number(status))
            
            res.send({
                ActionType: 'OK',
                data: result,
                msg: '操作成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message || '操作失败'
            })
        }
    },

    // 删除评论（管理端）- 管理员
    delete: async (req, res) => {
        try {
            const { id } = req.params
            
            // 验证权限 - 管理员
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
            
            const user = await UserModel.findById(payload._id)
            if (!user || user.role !== 1) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: '无权限操作'
                })
            }
            
            await CommentService.delete(id)
            
            res.send({
                ActionType: 'OK',
                msg: '删除成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message || '删除失败'
            })
        }
    }
}

module.exports = CommentController