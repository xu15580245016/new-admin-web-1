const CommentModel = require("../../models/CommentModel")

const CommentService = {
    getList: async ({ page, limit, keyword, status }) => {
        let query = {}
        
        if (keyword) {
            query.content = { $regex: keyword, $options: 'i' }
        }
        
        if (status !== undefined && status !== '') {
            query.status = Number(status)
        }
        
        const skip = (page - 1) * limit
        
        const [data, total] = await Promise.all([
            CommentModel.find(query, ['newsId', 'userId', 'username', 'content', 'status', 'createTime'])
                .populate('newsId', ['title'])
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

    updateStatus: async ({ _id, status }) => {
        return CommentModel.updateOne({ _id }, { status })
    },

    delete: async ({ _id }) => {
        return CommentModel.deleteOne({ _id })
    },

    findById: async (_id) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService