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
const ProductRouter = require('./routes/admin/ProductRouter');
const AdminCommentRouter = require('./routes/admin/CommentRouter');
const WebCommentRouter = require('./routes/web/CommentRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* 
 /adminapi/* - 后台系统用
 /webapi/*   - 官网用
*/
// Web端路由 - 不需要全局token验证（部分接口需要在controller内验证）
app.use(WebNewsRouter)
app.use(WebProductRouter)
app.use(WebCommentRouter)

// 后台接口token验证中间件
app.use((req, res, next) => {
  // 如果token有效，next()
  // 如果token过期了，返回401错误
  if (req.url === '/adminapi/user/login') {
    next()
    return;
  }

  // 验证adminapi前缀的接口
  if (req.url.startsWith('/adminapi')) {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
      return res.status(401).send({ errorCode: "-1", errorInfo: "未提供认证token" })
    }
    
    const token = authHeader.split(" ")[1]
    if (token) {
      let payload = JWT.verify(token)
      if (payload) {
        const newToken = JWT.generate({
          _id: payload._id,
          username: payload.username
        }, "1d")
        res.header('Authorization', newToken)
        next()
      } else {
        res.status(401).send({ errorCode: "-1", errorInfo: "token过期" })
      }
    } else {
      res.status(401).send({ errorCode: "-1", errorInfo: "无效的认证token" })
    }
  } else {
    next()
  }
})

app.use(UserRouter)
app.use(NewsRouter)
app.use(ProductRouter)
app.use(AdminCommentRouter)

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
