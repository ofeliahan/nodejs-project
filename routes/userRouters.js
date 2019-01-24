const express = require('express');
const UserModel = require('../models/userModels');
const router = express.Router();


//注册
router.post('/register',(req,res) =>{
    //得到数据,前端传递过来的参数名跟表中的字段名相同
    //实例化用户对象
    console.log(req.body);
    let user = new UserModel({
        userName:req.body.userName,
        password:req.body.password,
        nickName:req.body.nickName,
        isAdmin:req.body.isAdmin

    })
    //let user = new UserModel(req.body);

    //调用save方法
    user.save().then(() =>{
        res.json({
            code:0,
            msg:'注册成功'

        })
    }).catch((err) => {
        res.json({
            code:-1,
            msg:err.message
        })
    })
    
})



module.exports = router;