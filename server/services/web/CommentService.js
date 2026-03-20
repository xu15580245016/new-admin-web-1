const CommentModel = require("../../models/CommentModel")

const CommentService = {
    add: async ({ newsId, userId, username, avatar, content, commentTime }) => {
        return CommentModel.create({
            newsId, userId, username, avatar, content, commentTime, isApproved: 1
        })
    },
    getList: async ({ newsId }) => {
        return CommentModel.find({ newsId, isApproved: 1 }).sort({ commentTime: -1 })
    },
    delList: async ({ _id, userId }) => {
        return CommentModel.deleteOne({ _id, userId })
    },
    getById: async ({ _id }) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService
