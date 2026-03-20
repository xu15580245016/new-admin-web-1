const CommentService = require("../../services/admin/CommentService")
const UserModel = require('../../models/UserModel')

const CommentController = {
    // 校验是否是管理员
    checkAdmin: async (req) => {
        if (!req.user) {
            return { isAdmin: false, msg: '请先登录' }
        }
        const user = await UserModel.findById(req.user._id)
        const isAdmin = user && user.role === 1
        if (!isAdmin) {
            return { isAdmin: false, msg: '无管理员权限' }
        }
        return { isAdmin: true }
    },

    getList: async (req, res) => {
        try {
            // 管理员权限校验
            const adminCheck = await CommentController.checkAdmin(req)
            if (!adminCheck.isAdmin) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: adminCheck.msg
                })
            }

            const { page = 1, limit = 10, keyword = '', status = '' } = req.query

            const result = await CommentService.getList({
                page,
                limit,
                keyword,
                status
            })

            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch (error) {
            console.log('Get comment list error:', error)
            res.send({
                ActionType: 'ERROR',
                msg: '获取评论列表失败'
            })
        }
    },

    updateStatus: async (req, res) => {
        try {
            // 管理员权限校验
            const adminCheck = await CommentController.checkAdmin(req)
            if (!adminCheck.isAdmin) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: adminCheck.msg
                })
            }

            const { _id, status } = req.body

            if (!_id || status === undefined) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '缺少必要参数'
                })
            }

            const comment = await CommentService.findById(_id)
            if (!comment) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '评论不存在'
                })
            }

            await CommentService.updateStatus({ _id, status: Number(status) })

            const statusText = status === 1 ? '通过' : status === 2 ? '隐藏' : '待审核'
            res.send({
                ActionType: 'OK',
                msg: `评论已${statusText}`
            })
        } catch (error) {
            console.log('Update status error:', error)
            res.send({
                ActionType: 'ERROR',
                msg: '操作失败'
            })
        }
    },

    delete: async (req, res) => {
        try {
            // 管理员权限校验
            const adminCheck = await CommentController.checkAdmin(req)
            if (!adminCheck.isAdmin) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: adminCheck.msg
                })
            }

            const { _id } = req.params

            const comment = await CommentService.findById(_id)
            if (!comment) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '评论不存在'
                })
            }

            await CommentService.delete({ _id })

            res.send({
                ActionType: 'OK',
                msg: '评论删除成功'
            })
        } catch (error) {
            console.log('Admin delete error:', error)
            res.send({
                ActionType: 'ERROR',
                msg: '删除失败'
            })
        }
    }
}

module.exports = CommentController