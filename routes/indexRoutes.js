// 页面渲染的路由
const express = require('express');
const router = express.Router();


//首页 - http://localhost:1990/
router.get('/',(req,res) =>{
    res.render('index.ejs');
})

//banner页面
router.get('/banner.html',(req,res) =>{
    res.render('banner.ejs');
})

router.get('/login.html',(req,res) =>{
    res.render('login.ejs');
})
module.exports = router;