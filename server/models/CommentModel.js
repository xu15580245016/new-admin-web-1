const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentType = {
    content: String, // 评论内容
    newsId: {
        type: Schema.Types.ObjectId,
        ref: 'news'
    }, // 关联新闻ID
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }, // 评论用户ID
    username: String, // 评论用户名（冗余存储，方便查询）
    avatar: String, // 用户头像（冗余存储）
    status: {
        type: Number,
        default: 1 // 审核状态：0-隐藏，1-已审核通过，2-待审核
    },
    createTime: Date // 评论时间
}

const CommentModel = mongoose.model("comment", new Schema(CommentType))
module.exports = CommentModel
