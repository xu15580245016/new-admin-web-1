const CommentService = require('../../services/web/CommentService')
const JWT = require('../../util/JWT')

const CommentController = {
    // 发布评论 - 需要用户登录
    add: async (req, res) => {
        try {
            const { newsId, content } = req.body
            
            // 验证用户登录
            const token = req.headers['authorization']?.split(" ")[1]
            if (!token) {
                return res.status(401).send({
                    ActionType: 'ERROR',
                    msg: '请先登录'
                })
            }
            
            const payload = JWT.verify(token)
            if (!payload) {
                return res.status(401).send({
                    ActionType: 'ERROR',
                    msg: '登录已过期，请重新登录'
                })
            }
            
            if (!newsId || !content) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '缺少必要参数'
                })
            }
            
            const result = await CommentService.add({
                newsId,
                userId: payload._id,
                content
            })
            
            res.send({
                ActionType: 'OK',
                data: result,
                msg: '评论发布成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message || '评论发布失败'
            })
        }
    },

    // 获取新闻的评论列表 - 无需登录
    getList: async (req, res) => {
        try {
            const { newsId } = req.params
            
            if (!newsId) {
                return res.send({
                    ActionType: 'ERROR',
                    msg: '缺少新闻ID'
                })
            }
            
            const result = await CommentService.getListByNewsId(newsId)
            
            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message || '获取评论列表失败'
            })
        }
    },

    // 删除评论 - 本人或管理员
    delete: async (req, res) => {
        try {
            const { id } = req.params
            
            // 验证用户登录
            const token = req.headers['authorization']?.split(" ")[1]
            if (!token) {
                return res.status(401).send({
                    ActionType: 'ERROR',
                    msg: '请先登录'
                })
            }
            
            const payload = JWT.verify(token)
            if (!payload) {
                return res.status(401).send({
                    ActionType: 'ERROR',
                    msg: '登录已过期，请重新登录'
                })
            }
            
            // 获取用户角色
            const UserModel = require('../../models/UserModel')
            const user = await UserModel.findById(payload._id)
            
            await CommentService.delete(id, payload._id, user?.role || 0)
            
            res.send({
                ActionType: 'OK',
                msg: '删除成功'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: error.message || '删除失败'
            })
        }
    }
}

module.exports = CommentController