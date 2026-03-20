const mongoose = require('mongoose')
const UserModel = require('./models/UserModel')

// 连接数据库
require('./config/db.config')

async function initAdmin() {
  try {
    // 检查是否已存在admin用户
    const existingAdmin = await UserModel.findOne({ username: 'admin' })
    
    if (existingAdmin) {
      console.log('Admin用户已存在')
      console.log('用户名: admin')
      console.log('密码: 123456')
      process.exit(0)
    }

    // 创建admin用户
    const admin = await UserModel.create({
      username: 'admin',
      password: '123456',
      gender: 1,
      introduction: '系统管理员',
      avatar: '',
      role: 1 // 管理员角色
    })

    console.log('Admin用户创建成功!')
    console.log('用户名: admin')
    console.log('密码: 123456')
    process.exit(0)
  } catch (error) {
    console.error('创建Admin用户失败:', error.message)
    process.exit(1)
  }
}

// 等待数据库连接
setTimeout(initAdmin, 1000)