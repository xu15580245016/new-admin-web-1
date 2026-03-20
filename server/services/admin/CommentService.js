const CommentModel = require("../../models/CommentModel")

const CommentService = {
    getList: async () => {
        return CommentModel.find({}).sort({ commentTime: -1 }).populate('newsId', 'title').populate('userId', 'username')
    },
    audit: async ({ _id, isApproved }) => {
        return CommentModel.updateOne({ _id }, { isApproved })
    },
    delList: async ({ _id }) => {
        return CommentModel.deleteOne({ _id })
    }
}

module.exports = CommentService
