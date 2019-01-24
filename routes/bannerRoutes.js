//提供给前端ajax 调用的接口地址,url
const express = require('express');
const async = require('async');
const BannerModel = require('../models/bannerModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    dest:'c/tmp'
});
const router = express.Router();

//添加banner http://localhost:1990/banner/add
router.post('/add',upload.single('bannerImg'),(req,res) =>{
    //操作文件
    let newFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname,'../public/uploads/banners/',newFileName);

    //移动文件
    try {
        let data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath,data);
        fs.unlinkSync(req.file.path);//删除原文件

        //将文件的名字加上banner图的名字给写入到数据库
        let banner = new BannerModel({
            name:req.body.bannerName,
            imgUrl:'http://localhost:1990/uploads/banners/'+ newFileName
        })
        banner.save().then(() =>{
            res.json({
                code:0,
                msg:'ok'
            })

        }).catch((err) =>{
            res.json({
                code:-1,
                msg:err.message
            })
        })
    } catch (error) {
        res.json({
            code:-1,
            msg:error.message
        })
    }



    /* //获取前端传递过来的参数
    var banner = new BannerModel({
        name:req.body.bannerName,
        imgUrl:req.body.bannerUrl
    })

    banner.save(function(err){
        if(err){
            res.json({
                code:-1,
                msq: err.message

            })
        }else{
          
            res.json({
                code: 0,
                msg: 'ok'
            })

        }
    }) */
})


//搜索/查询  http://localhost:1990/banner/search
router.get('/search',(req,res) =>{

    //分页
    //1.得到前端传递过来的参数
    let pageNum = parseInt(req.query.pageNum) || 1;//当前的页数
    let pageSize =parseInt(req.query.pageSize) || 2;//每页显示的条数

    //并行无关联
    async.parallel([
        function(cb){
            BannerModel.find().count().then(num =>{
                cb(null,num);
            }).catch(err =>{
                cb(err);
            })
        },
        function(cb){
            BannerModel.find().skip((pageNum -1)*pageSize).limit(pageSize)
            .then(data =>{
                cb(null,data);
            }).catch(err =>{
                cb(err);
            })
        }

    ],function(err,result){
        if(err){
            res.json({
                code:-1,
                msg:err.message
            })
        }else{
            res.json({
                code:0,
                msg:'ok',
                data:result[1],
                totalPage:Math.ceil(result[0]/pageSize)
            })
        }
    })

    //删除 http://localhost:1990/banner/delete
    router.post('/delete',(req,res) =>{
        //得到要删除的id字段
        var id =req.body.id;
        //操作删除
        BannerModel.deleteOne({_id:id}).then((data)=>{
            if(data.deletedCount > 0){
                res.json({
                    code:0,
                    msg:'ok'
                })
            }else{
                //到这一步因为是一个reject对象,所以会携带err信息直接渠道.catch里
                return Promise.reject(new Error('未找到相关数据'));
                /* res.json({
                code:-1,
                msg:'未找到相关数据'
                })   */     
            }
        }).catch((err) =>{
            res.json({
                code:-1,
                msg:err.message
            })
        })
    })
   

})

module.exports = router;