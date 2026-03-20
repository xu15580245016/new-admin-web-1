const axios = require('axios')
const BASE_URL = 'http://localhost:3002'

async function testLogin() {
  try {
    const response = await axios.post(`${BASE_URL}/adminapi/user/login`, {
      username: 'admin',
      password: '123456'
    })
    
    console.log('响应状态:', response.status)
    console.log('响应头:', response.headers)
    console.log('响应数据:', response.data)
    
    const authHeader = response.headers['authorization'] || response.headers['Authorization']
    console.log('Authorization header:', authHeader)
    
  } catch (error) {
    console.log('错误:', error.message)
    if (error.response) {
      console.log('错误响应状态:', error.response.status)
      console.log('错误响应数据:', error.response.data)
    }
  }
}

testLogin()