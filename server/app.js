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
const WebCommentPublicRouter = require('./routes/web/CommentPublicRouter');
const WebCommentAuthRouter = require('./routes/web/CommentAuthRouter');
const AdminCommentRouter = require('./routes/admin/CommentRouter');

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
// Web端评论列表 - 无需登录
app.use(WebCommentPublicRouter)
app.use((req, res, next) => {
  // 如果token有效，next()
  // 如果token过期了，返回401错误
  console.log(req.url);
  if (req.url === '/adminapi/user/login') {
    next()
    return;
  }

  const authorization = req.headers['authorization']
  if (!authorization) {
    res.status(401).send({ errorCode: "-1", errorInfo: "缺少token" })
    return
  }

  const token = authorization.split(" ")[1]
  if (token) {
    // console.log("我来啦");
    let payload = JWT.verify(token)
    if (payload) {
      const newToken = JWT.generate({
        _id: payload._id,
        username: payload.username,
        role: payload.role,
        avatar: payload.avatar
      }, "1d")
      res.header('Authorization', newToken)
      next()
    } else {
      res.status(401).send({ errorCode: "-1", errorInfo: "token过期" })
    }
  } else {
    res.status(401).send({ errorCode: "-1", errorInfo: "token格式错误" })
  }
})

app.use(UserRouter)
app.use(NewsRouter)
app.use(ProductRouter)
// Web端需要登录的评论接口
app.use(WebCommentAuthRouter)
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
