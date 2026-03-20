const CommentModel = require('../../models/CommentModel')
const UserModel = require('../../models/UserModel')

const CommentService = {
    // 发布评论
    add: async ({ content, newsId, userId }) => {
        // 获取用户信息用于冗余存储
        const user = await UserModel.findById(userId)
        
        return CommentModel.create({
            content,
            newsId,
            userId,
            username: user.username,
            avatar: user.avatar || '',
            status: 1, // 默认审核通过，可根据需求改为2（待审核）
            createTime: new Date()
        })
    },

    // 获取新闻的评论列表（只显示已审核通过的）
    getListByNewsId: async ({ newsId, page, pageSize }) => {
        const query = {
            newsId,
            status: 1 // 只返回已审核通过的评论
        }
        
        const skip = (Number(page) - 1) * Number(pageSize)
        const limit = Number(pageSize)
        
        try {
            const total = await CommentModel.countDocuments(query)
            const list = await CommentModel.find(query)
                .sort({ createTime: -1 })
                .skip(skip)
                .limit(limit)
                .select('content username avatar createTime userId')
            
            return {
                list,
                total,
                page: Number(page),
                pageSize: Number(pageSize)
            }
        } catch (error) {
            // 如果newsId格式不正确，返回空列表
            return {
                list: [],
                total: 0,
                page: Number(page),
                pageSize: Number(pageSize)
            }
        }
    },

    // 删除评论（本人）
    delete: async ({ _id, userId }) => {
        return CommentModel.deleteOne({ _id, userId })
    },

    // 根据ID获取评论
    getById: async ({ _id }) => {
        return CommentModel.findById(_id)
    }
}

module.exports = CommentService
