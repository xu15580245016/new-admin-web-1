const CommentModel = require('../../models/CommentModel')

const CommentService = {
    // 获取所有评论列表（管理端）
    getList: async () => {
        const comments = await CommentModel.find().sort({ createTime: -1 })
        return comments
    },

    // 审核/隐藏评论
    updateStatus: async (commentId, status) => {
        const comment = await CommentModel.findByIdAndUpdate(
            commentId,
            { status },
            { new: true }
        )
        if (!comment) {
            throw new Error('评论不存在')
        }
        return comment
    },

    // 删除评论（管理端）
    delete: async (commentId) => {
        const comment = await CommentModel.findByIdAndDelete(commentId)
        if (!comment) {
            throw new Error('评论不存在')
        }
        return true
    }
}

module.exports = CommentService