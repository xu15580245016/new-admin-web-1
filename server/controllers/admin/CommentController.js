const CommentService = require("../../services/admin/CommentService")
const JWT = require('../../util/JWT')
const UserModel = require('../../models/UserModel')

// 管理员权限校验中间件
const checkAdminPermission = async (req, res) => {
    const token = req.headers['authorization']?.split(" ")[1]
    if (!token) {
        return {
            hasPermission: false,
            response: {
                status: 401,
                data: {
                    ActionType: 'ERROR',
                    msg: '请先登录'
                }
            }
        }
    }

    const payload = JWT.verify(token)
    if (!payload) {
        return {
            hasPermission: false,
            response: {
                status: 401,
                data: {
                    ActionType: 'ERROR',
                    msg: '登录已过期，请重新登录'
                }
            }
        }
    }

    // 验证用户是否为管理员
    const user = await UserModel.findById(payload._id)
    if (!user || user.role !== 1) {
        return {
            hasPermission: false,
            response: {
                status: 403,
                data: {
                    ActionType: 'ERROR',
                    msg: '无权进行此操作，需要管理员权限'
                }
            }
        }
    }

    return { hasPermission: true, user }
}

const CommentController = {
    // 获取评论列表（管理端）
    getList: async (req, res) => {
        // 权限校验
        const permissionCheck = await checkAdminPermission(req, res)
        if (!permissionCheck.hasPermission) {
            return res.status(permissionCheck.response.status).send(permissionCheck.response.data)
        }

        const { page = 1, pageSize = 10, newsId, status } = req.query
        try {
            const result = await CommentService.getList({ page, pageSize, newsId, status })
            res.send({
                ActionType: 'OK',
                data: result
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: '获取评论列表失败'
            })
        }
    },

    // 审核/隐藏评论
    updateStatus: async (req, res) => {
        // 权限校验
        const permissionCheck = await checkAdminPermission(req, res)
        if (!permissionCheck.hasPermission) {
            return res.status(permissionCheck.response.status).send(permissionCheck.response.data)
        }

        const { _id, status } = req.body
        // 参数校验
        if (!_id || status === undefined) {
            return res.send({
                ActionType: 'ERROR',
                msg: '缺少必要参数'
            })
        }

        try {
            await CommentService.updateStatus({ _id, status })
            res.send({
                ActionType: 'OK',
                msg: status === 1 ? '评论已通过审核' : status === 0 ? '评论已隐藏' : '状态已更新'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: '操作失败'
            })
        }
    },

    // 删除评论（管理端，管理员可删除任意评论）
    delete: async (req, res) => {
        // 权限校验
        const permissionCheck = await checkAdminPermission(req, res)
        if (!permissionCheck.hasPermission) {
            return res.status(permissionCheck.response.status).send(permissionCheck.response.data)
        }

        const { _id } = req.params
        if (!_id) {
            return res.send({
                ActionType: 'ERROR',
                msg: '缺少评论ID参数'
            })
        }

        try {
            await CommentService.delete({ _id })
            res.send({
                ActionType: 'OK',
                msg: '评论已删除'
            })
        } catch (error) {
            res.send({
                ActionType: 'ERROR',
                msg: '删除失败'
            })
        }
    }
}

module.exports = CommentController
