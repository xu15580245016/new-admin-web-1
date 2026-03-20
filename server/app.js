var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const UserRouter = require('./routes/admin/UserRouter');
const JWT = require('./util/JWT');
const NewsRouter = require('./routes/admin/NewsRouter');
const WebNewsRouter = require('./routes/web/NewsRouter');
const WebProductRouter = require('./routes/web/ProductRouter');
const WebCommentRouter = require('./routes/web/CommentRouter');
const ProductRouter = require('./routes/admin/ProductRouter');
const CommentRouter = require('./routes/admin/CommentRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

/* 
 /adminapi/* - 后台系统用
 /webapi/*   - 官网用
*/
app.use(WebNewsRouter)
app.use(WebProductRouter)
app.use(WebCommentRouter)
app.use((req, res, next) => {
  // token验证中间件 - 只解析token，不强制拦截（webapi的权限由控制器自己判断）
  console.log(req.url);
  
  // adminapi的登录接口跳过验证
  if (req.url === '/adminapi/user/login') {
    next()
    return
  }
  
  // 从header中获取token
  const authHeader = req.headers['authorization']
  const token = authHeader ? authHeader.split(" ")[1] : null
  
  if (token) {
    let payload = JWT.verify(token)
    if (payload) {
      // token有效，将用户信息挂载到req.user上
      req.user = payload
      
      // 刷新token
      const newToken = JWT.generate({
        _id: payload._id,
        username: payload.username
      }, "1d")
      res.header('Authorization', newToken)
      next()
    } else {
      // token过期 - 如果是adminapi接口直接返回，webapi接口继续
      if (req.url.startsWith('/adminapi/')) {
        res.status(401).send({ errorCode: "-1", errorInfo: "token过期" })
      } else {
        // webapi接口继续执行，由控制器判断是否需要登录
        next()
      }
    }
  } else {
    // 没有token - 如果是adminapi接口直接返回，webapi接口继续
    if (req.url.startsWith('/adminapi/')) {
      res.status(401).send({ errorCode: "-1", errorInfo: "未提供认证信息" })
    } else {
      // webapi接口继续执行，由控制器判断是否需要登录
      next()
    }
  }
})

app.use(UserRouter)
app.use(NewsRouter)
app.use(ProductRouter)
app.use(CommentRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // console.log(req.url);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
