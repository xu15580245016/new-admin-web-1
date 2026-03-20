const CommentModel = require("../../models/CommentModel")

const CommentService = {
    // 获取所有评论列表（管理后台 - 包含所有状态）
    getList: async ({ newsId, status, page = 1, limit = 10 }) => {
        const skip = (page - 1) * limit
        let query = {}
        
        if (newsId) query.newsId = newsId
        if (status !== undefined && status !== null && status !== '') query.status = Number(status)
        
        const list = await CommentModel.find(query)
            .sort({ createTime: -1 })
            .skip(skip)
            .limit(Number(limit))
        
        const total = await CommentModel.countDocuments(query)
        
        return { list, total }
    },
    // 删除评论（管理员可以删除任何评论）
    del: async ({ _id }) => {
        return CommentModel.deleteOne({ _id })
    },
    // 审核/隐藏评论
    audit: async ({ _id, status }) => {
        return CommentModel.updateOne({ _id }, { status: Number(status) })
    },
    // 根据ID获取评论
    getById: async ({ _id }) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService
