const CommentModel = require("../../models/CommentModel")

const CommentService = {
    add: async ({ newsId, userId, username, content }) => {
        return CommentModel.create({
            newsId, userId, username, content
        })
    },

    getListByNewsId: async ({ newsId, page, limit }) => {
        const query = { newsId, status: 1 } // 只返回已通过的评论
        const skip = (page - 1) * limit
        
        const [data, total] = await Promise.all([
            CommentModel.find(query, ['username', 'content', 'createTime'])
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit),
            CommentModel.countDocuments(query)
        ])
        
        return {
            data,
            total,
            page: Number(page),
            limit: Number(limit)
        }
    },

    delete: async ({ _id, userId, isAdmin }) => {
        if (isAdmin) {
            return CommentModel.deleteOne({ _id })
        }
        return CommentModel.deleteOne({ _id, userId })
    },

    findById: async (_id) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService