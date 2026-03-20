const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentType = {
    newsId: {
        type: Schema.Types.ObjectId,
        ref: 'news',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1 // 0:待审核, 1:已通过, 2:已隐藏
    },
    createTime: {
        type: Number,
        default: () => Date.now()
    }
}

const CommentModel = mongoose.model("comment", new Schema(CommentType))
module.exports = CommentModel