const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentType = {
    newsId: {
        type: Schema.Types.ObjectId,
        ref: 'news'
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    username: String,
    avatar: String,
    content: String,
    commentTime: Date,
    isApproved: {
        type: Number,
        default: 1
    }
}

const CommentModel = mongoose.model("comment", new Schema(CommentType))
module.exports = CommentModel
