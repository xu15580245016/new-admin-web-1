const CommentService = require("../../services/admin/CommentService")

const CommentController = {
    getList: async (req, res) => {
        const user = req.user
        if (user.role !== 1) {
            res.send({
                ActionType: 'ERROR',
                msg: '无权限访问'
            })
            return
        }
        const result = await CommentService.getList()
        res.send({
            ActionType: 'OK',
            data: result
        })
    },
    audit: async (req, res) => {
        const user = req.user
        if (user.role !== 1) {
            res.send({
                ActionType: 'ERROR',
                msg: '无权限操作'
            })
            return
        }
        const { _id, isApproved } = req.body
        await CommentService.audit({ _id, isApproved })
        res.send({
            ActionType: 'OK',
            msg: '审核成功'
        })
    },
    delList: async (req, res) => {
        const user = req.user
        if (user.role !== 1) {
            res.send({
                ActionType: 'ERROR',
                msg: '无权限操作'
            })
            return
        }
        await CommentService.delList({ _id: req.params.id })
        res.send({
            ActionType: 'OK',
            msg: '删除成功'
        })
    }
}

module.exports = CommentController
