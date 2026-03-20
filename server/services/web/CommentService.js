const CommentModel = require('../../models/CommentModel')
const UserModel = require('../../models/UserModel')

const CommentService = {
    // 发布评论
    add: async ({ newsId, userId, content }) => {
        // 获取用户信息
        const user = await UserModel.findById(userId)
        if (!user) {
            throw new Error('用户不存在')
        }
        
        const createTime = new Date()
        const comment = await CommentModel.create({
            newsId,
            userId,
            username: user.username,
            avatar: user.avatar || '',
            content,
            status: 1, // 默认已通过
            createTime
        })
        return comment
    },

    // 获取新闻的评论列表（只显示已通过的）
    getListByNewsId: async (newsId) => {
        const comments = await CommentModel.find({
            newsId,
            status: 1
        }).sort({ createTime: -1 })
        return comments
    },

    // 删除评论 - 本人或管理员
    delete: async (commentId, userId, role) => {
        const comment = await CommentModel.findById(commentId)
        if (!comment) {
            throw new Error('评论不存在')
        }
        
        // 验证权限：本人或管理员
        if (comment.userId !== userId && role !== 1) {
            throw new Error('无权限删除该评论')
        }
        
        await CommentModel.findByIdAndDelete(commentId)
        return true
    }
}

module.exports = CommentService