const CommentService = require("../../services/web/CommentService")
const UserModel = require("../../models/UserModel")

const CommentController = {
    add: async (req, res) => {
        const { newsId, content } = req.body
        const user = req.user
        
        const userInfo = await UserModel.findById(user._id)
        if (!userInfo) {
            res.send({
                ActionType: 'ERROR',
                msg: '用户不存在'
            })
            return
        }
        
        await CommentService.add({
            newsId,
            userId: user._id,
            username: userInfo.username,
            avatar: userInfo.avatar,
            content,
            commentTime: new Date()
        })
        
        res.send({
            ActionType: 'OK',
            msg: '评论发布成功'
        })
    },
    getList: async (req, res) => {
        const newsId = req.params.newsId || req.query.newsId
        const result = await CommentService.getList({ newsId })
        res.send({
            ActionType: 'OK',
            data: result
        })
    },
    delList: async (req, res) => {
        const { id } = req.params
        const user = req.user
        
        const comment = await CommentService.getById({ _id: id })
        if (!comment) {
            res.send({
                ActionType: 'ERROR',
                msg: '评论不存在'
            })
            return
        }
        
        if (comment.userId.toString() !== user._id && user.role !== 1) {
            res.send({
                ActionType: 'ERROR',
                msg: '无权删除此评论'
            })
            return
        }
        
        await CommentService.delList({ _id: id, userId: comment.userId })
        res.send({
            ActionType: 'OK',
            msg: '删除成功'
        })
    }
}

module.exports = CommentController
