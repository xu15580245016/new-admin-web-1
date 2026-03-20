const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentType = {
    newsId: String,
    userId: String,
    username: String,
    avatar: String,
    content: String,
    status: Number, // 0:待审核, 1:已通过, 2:已隐藏
    createTime: Date
}

const CommentModel = mongoose.model("comment", new Schema(CommentType))
module.exports = CommentModel