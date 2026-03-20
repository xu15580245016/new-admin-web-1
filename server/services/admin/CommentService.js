const CommentModel = require('../../models/CommentModel')

const CommentService = {
    // 获取所有评论列表（管理端）
    getList: async ({ page, pageSize, newsId, status }) => {
        const query = {}
        if (newsId) query.newsId = newsId
        if (status !== undefined && status !== '') query.status = Number(status)
        
        const skip = (Number(page) - 1) * Number(pageSize)
        const limit = Number(pageSize)
        
        const total = await CommentModel.countDocuments(query)
        const list = await CommentModel.find(query)
            .populate('newsId', 'title')
            .sort({ createTime: -1 })
            .skip(skip)
            .limit(limit)
        
        return {
            list,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }
    },

    // 审核/隐藏评论
    updateStatus: async ({ _id, status }) => {
        return CommentModel.updateOne(
            { _id },
            { status: Number(status) }
        )
    },

    // 删除评论
    delete: async ({ _id }) => {
        return CommentModel.deleteOne({ _id })
    },

    // 根据ID获取评论
    getById: async ({ _id }) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService
