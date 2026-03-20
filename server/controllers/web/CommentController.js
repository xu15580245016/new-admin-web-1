const CommentService = require("../../services/web/CommentService")

const CommentController = {
    add: async (req, res) => {
        try {
            // 需要登录才能发布评论
            if (!req.user) {
                return res.status(401).send({
                    ActionType: 'ERROR',
                    msg: '请先登录'
                })
            }

            const { newsId, content } = req.body
            if (!newsId || !content) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '缺少必要参数'
                })
            }

            await CommentService.add({
                newsId,
                userId: req.user._id,
                username: req.user.username,
                content
            })

            res.send({
                ActionType: 'OK',
                msg: '评论发布成功'
            })
        } catch (error) {
            console.log('Add comment error:', error)
            res.send({
                ActionType: 'ERROR',
                msg: '评论发布失败'
            })
        }
    },

    getList: async (req, res) => {
        try {
            const { newsId } = req.params
            const { page = 1, limit = 10 } = req.query

            const result = await CommentService.getListByNewsId({
                newsId,
                page,
                limit
            })

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

    delete: async (req, res) => {
        try {
            // 需要登录才能删除评论
            if (!req.user) {
                return res.status(401).send({
                    ActionType: 'ERROR',
                    msg: '请先登录'
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

            // 权限校验：只能删除自己的评论
            const isOwner = comment.userId.toString() === req.user._id
            if (!isOwner) {
                return res.status(403).send({
                    ActionType: 'ERROR',
                    msg: '只能删除自己的评论'
                })
            }

            await CommentService.delete({ _id, userId: req.user._id })

            res.send({
                ActionType: 'OK',
                msg: '评论删除成功'
            })
        } catch (error) {
            console.log('Delete comment error:', error)
            res.send({
                ActionType: 'ERROR',
                msg: '评论删除失败'
            })
        }
    }
}

module.exports = CommentController