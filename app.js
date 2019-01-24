//项目入口文件
const express = require('express');
const path = require('path');
const cookieParser =require('cookie-parser');
const app = express();

//引入路由中间件文件
const indexRouter = require('./routes/indexRoutes');
const bannerRouter = require('./routes/bannerRoutes');
const userRouter = require('./routes/userRouters');
//设置静态文件托管
app.use(express.static(path.resolve(__dirname,'./public')));

//使用中间件
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));//设为true的话使用第三的querystring模块

//设置模板文件的路径与使用的是什么模板引擎
app.set("views",path.resolve(__dirname,'./views'));
app.set('view engine','ejs');

//路由中间件的使用
app.use('/',indexRouter);
app.use('/banner',bannerRouter);
app.use('/user',userRouter);



app.listen(1990);