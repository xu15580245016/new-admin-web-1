const mongoose = require('mongoose')
const UserModel = require('./models/UserModel')

// 连接数据库
require('./config/db.config')

async function checkUsers() {
  try {
    const users = await UserModel.find({})
    console.log('数据库中的用户:')
    users.forEach(user => {
      console.log(`- 用户名: ${user.username}, 密码: ${user.password}, 角色: ${user.role}`)
    })
    
    if (users.length === 0) {
      console.log('没有找到用户，创建一个admin用户...')
      await UserModel.create({
        username: 'admin',
        password: '123456',
        gender: 1,
        introduction: '系统管理员',
        avatar: '',
        role: 1
      })
      console.log('Admin用户已创建!')
    }
    process.exit(0)
  } catch (error) {
    console.error('错误:', error.message)
    process.exit(1)
  }
}

setTimeout(checkUsers, 1000)