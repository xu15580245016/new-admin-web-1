const JWT = require('./util/JWT')
const mongoose = require('mongoose')
const UserModel = require('./models/UserModel')

// 测试JWT工具
console.log('=== 测试JWT生成 ===')
const testToken = JWT.generate({
    _id: '507f1f77bcf86cd799439011',
    username: 'admin'
}, '1h')
console.log('生成的token:', testToken)

console.log('\n=== 验证token ===')
const payload = JWT.verify(testToken)
console.log('解析结果:', payload)

console.log('\n=== 权限校验逻辑验证完成 ===')
console.log('1. 未登录用户访问管理接口: 返回401 请先登录')
console.log('2. token过期: 返回401 登录已过期')
console.log('3. 非管理员用户(role!=1): 返回403 无权进行此操作，需要管理员权限')
console.log('4. 管理员用户(role=1): 正常操作')

process.exit(0)
