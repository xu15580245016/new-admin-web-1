const axios = require('axios')
const BASE_URL = 'http://localhost:3002'

// 测试数据
const TEST_NEWS_ID = 'test_news_' + Date.now()
const TEST_COMMENT_CONTENT = '这是一条测试评论 ' + Date.now()
let TEST_COMMENT_ID = ''
let ADMIN_TOKEN = ''

// 延迟函数
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 测试报告
const report = {
  passed: 0,
  failed: 0,
  tests: []
}

function addTestResult(name, passed, message) {
  const result = { name, passed, message }
  report.tests.push(result)
  if (passed) {
    report.passed++
    console.log(`✓ ${name}: ${message}`)
  } else {
    report.failed++
    console.log(`✗ ${name}: ${message}`)
  }
}

async function runTests() {
  console.log('='.repeat(60))
  console.log('开始测试评论功能...')
  console.log('='.repeat(60))

  try {
    // 1. 测试未登录发布评论 - 应该失败
    console.log('\n[测试1] 未登录发布评论')
    try {
      await axios.post(`${BASE_URL}/webapi/comment/add`, {
        newsId: TEST_NEWS_ID,
        content: TEST_COMMENT_CONTENT
      })
      addTestResult('未登录发布评论', false, '应该返回未授权错误，但实际成功了')
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.data.ActionType === 'ERROR')) {
        addTestResult('未登录发布评论', true, '正确阻止未登录用户发布评论')
      } else {
        addTestResult('未登录发布评论', false, `错误: ${error.message}`)
      }
    }

    // 2. 测试获取不存在新闻的评论列表
    console.log('\n[测试2] 获取不存在新闻的评论列表')
    try {
      const response = await axios.get(`${BASE_URL}/webapi/comment/list/nonexistent_news`)
      if (response.data.ActionType === 'OK') {
        addTestResult('获取不存在新闻的评论列表', true, '正确返回空列表')
      } else {
        addTestResult('获取不存在新闻的评论列表', false, `响应异常: ${JSON.stringify(response.data)}`)
      }
    } catch (error) {
      addTestResult('获取不存在新闻的评论列表', false, `错误: ${error.message}`)
    }

    // 3. 尝试管理员登录（获取token）
    console.log('\n[测试3] 管理员登录')
    try {
      const response = await axios.post(`${BASE_URL}/adminapi/user/login`, {
        username: 'admin',
        password: 'admin'
      })
      if (response.data.ActionType === 'OK') {
        ADMIN_TOKEN = response.headers['authorization'] || response.headers['Authorization'] || ''
        addTestResult('管理员登录', true, '登录成功，获取到token')
      } else {
        // 尝试创建一个测试用户后再登录
        addTestResult('管理员登录', false, '请先确保有admin用户存在 (默认账号: admin/123456)')
      }
    } catch (error) {
      addTestResult('管理员登录', false, `登录失败: ${error.message} - 请确保MongoDB运行且有admin用户`)
    }

    await delay(1000)

    // 4. 如果有token，测试完整的评论流程
    if (ADMIN_TOKEN) {
      console.log('\n=== 开始完整流程测试 ===')

      // 4.1 发布评论
      console.log('\n[测试4.1] 发布评论')
      try {
        const response = await axios.post(
          `${BASE_URL}/webapi/comment/add`,
          {
            newsId: TEST_NEWS_ID,
            content: TEST_COMMENT_CONTENT
          },
          {
            headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
          }
        )
        if (response.data.ActionType === 'OK') {
          TEST_COMMENT_ID = response.data.data._id
          addTestResult('发布评论', true, `评论发布成功，ID: ${TEST_COMMENT_ID}`)
        } else {
          addTestResult('发布评论', false, `发布失败: ${response.data.msg}`)
        }
      } catch (error) {
        addTestResult('发布评论', false, `错误: ${error.response?.data?.msg || error.message}`)
      }

      await delay(500)

      // 4.2 获取新闻评论列表
      console.log('\n[测试4.2] 获取新闻评论列表')
      try {
        const response = await axios.get(`${BASE_URL}/webapi/comment/list/${TEST_NEWS_ID}`)
        if (response.data.ActionType === 'OK' && Array.isArray(response.data.data)) {
          const hasTestComment = response.data.data.some(c => c.content === TEST_COMMENT_CONTENT)
          addTestResult('获取新闻评论列表', true, `成功获取 ${response.data.data.length} 条评论${hasTestComment ? '，包含测试评论' : ''}`)
        } else {
          addTestResult('获取新闻评论列表', false, '响应格式错误')
        }
      } catch (error) {
        addTestResult('获取新闻评论列表', false, `错误: ${error.message}`)
      }

      // 4.3 管理员获取所有评论列表
      console.log('\n[测试4.3] 管理员获取所有评论列表')
      try {
        const response = await axios.get(`${BASE_URL}/adminapi/comment/list`, {
          headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
        })
        if (response.data.ActionType === 'OK' && Array.isArray(response.data.data)) {
          addTestResult('管理员获取所有评论列表', true, `成功获取 ${response.data.data.length} 条评论`)
        } else {
          addTestResult('管理员获取所有评论列表', false, '响应格式错误')
        }
      } catch (error) {
        addTestResult('管理员获取所有评论列表', false, `错误: ${error.response?.data?.msg || error.message}`)
      }

      // 4.4 审核评论（隐藏）
      if (TEST_COMMENT_ID) {
        console.log('\n[测试4.4] 隐藏评论')
        try {
          const response = await axios.put(
            `${BASE_URL}/adminapi/comment/status/${TEST_COMMENT_ID}`,
            { status: 2 },
            {
              headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
            }
          )
          if (response.data.ActionType === 'OK') {
            addTestResult('隐藏评论', true, '评论已隐藏')
          } else {
            addTestResult('隐藏评论', false, `操作失败: ${response.data.msg}`)
          }
        } catch (error) {
          addTestResult('隐藏评论', false, `错误: ${error.response?.data?.msg || error.message}`)
        }

        await delay(500)

        // 4.5 审核评论（恢复）
        console.log('\n[测试4.5] 恢复评论（审核通过）')
        try {
          const response = await axios.put(
            `${BASE_URL}/adminapi/comment/status/${TEST_COMMENT_ID}`,
            { status: 1 },
            {
              headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
            }
          )
          if (response.data.ActionType === 'OK') {
            addTestResult('恢复评论', true, '评论已恢复（审核通过）')
          } else {
            addTestResult('恢复评论', false, `操作失败: ${response.data.msg}`)
          }
        } catch (error) {
          addTestResult('恢复评论', false, `错误: ${error.response?.data?.msg || error.message}`)
        }

        // 4.6 删除评论
        console.log('\n[测试4.6] 删除评论')
        try {
          const response = await axios.delete(
            `${BASE_URL}/webapi/comment/delete/${TEST_COMMENT_ID}`,
            {
              headers: { 'Authorization': `Bearer ${ADMIN_TOKEN}` }
            }
          )
          if (response.data.ActionType === 'OK') {
            addTestResult('删除评论', true, '评论已删除')
          } else {
            addTestResult('删除评论', false, `删除失败: ${response.data.msg}`)
          }
        } catch (error) {
          addTestResult('删除评论', false, `错误: ${error.response?.data?.msg || error.message}`)
        }
      }
    } else {
      console.log('\n=== 跳过需要登录的测试（无有效Token） ===')
    }

  } catch (error) {
    console.log('\n测试过程中发生未预期错误:', error.message)
  }

  // 输出测试报告
  console.log('\n' + '='.repeat(60))
  console.log('测试报告')
  console.log('='.repeat(60))
  console.log(`总测试数: ${report.tests.length}`)
  console.log(`通过: ${report.passed}`)
  console.log(`失败: ${report.failed}`)
  console.log('='.repeat(60))
  
  if (report.failed > 0) {
    console.log('\n失败的测试:')
    report.tests.filter(t => !t.passed).forEach(t => {
      console.log(`  - ${t.name}: ${t.message}`)
    })
    process.exit(1)
  } else {
    console.log('\n所有测试通过!')
    process.exit(0)
  }
}

runTests()