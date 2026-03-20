const CommentModel = require("../../models/CommentModel")

const CommentService = {
    // 发布评论
    add: async ({ newsId, userId, username, avatar, content }) => {
        return CommentModel.create({
            newsId, userId, username, avatar, content, status: 1
        })
    },
    // 获取评论列表（Web端 - 只显示审核通过的评论）
    getList: async ({ newsId, page = 1, limit = 10 }) => {
        const skip = (page - 1) * limit
        const query = newsId ? { newsId, status: 1 } : { status: 1 }
        
        const list = await CommentModel.find(query)
            .sort({ createTime: -1 })
            .skip(skip)
            .limit(Number(limit))
        
        const total = await CommentModel.countDocuments(query)
        
        return { list, total }
    },
    // 删除评论（用户只能删除自己的评论）
    del: async ({ _id, userId }) => {
        return CommentModel.deleteOne({ _id, userId })
    },
    // 根据ID获取评论
    getById: async ({ _id }) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService
