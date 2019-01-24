

(function(){

    var Banner = function(){
        //定义这个页面需要的数据
        this.pageNum = 1;       //当前页码
        this.pageSize = 2;      //每页显示条数
        this.totalPage = 0;     //总页数
        this.bannerList =[];    //banner数据

        //需要用的dom对象 性能优化-dom缓存
        this.dom = {
            table : $('#banner-table tbody'), //table 的tbody
            pagination:$('#pagination'),  //分页 的ul
            nameInput:$('#inputEmail3'), //输入框
            urlInput:$('#inputPassword3'),
            addModal :$('#addModal'),
            submit: $('#bannerAdd')
        }
    }
        //新增方法
        Banner.prototype.add = function(){
            var that = this;
            //ajax 上传并带有文件

            //实例化一个FormData对象
            var formData = new FormData();

            //给forData对象加属性
            formData.append('bannerName',this.dom.nameInput.val());
            formData.append('bannerImg',this.dom.urlInput[0].files[0]);




            $.ajax({
                url:'/banner/add',
                method:'POST',
                //上传文件的时候需要设置的
                processData: false,
                contentType:false,
                data:formData,
                succsess:function(){
                    layer.msg('添加成功');
                    that.search();
                },
                error:function(){
                    layer.msg('网络异常,请稍后重试');

                },
                //不管成功失败都会到这个函数里
                complete:function(){
                    //手动调用关闭的方法
                    that.dom.addModal.modal('hide');
                    //手动清空输入框
                    that.dom.nameInput.val('');
                    that.dom.urlInput.val('');
                }
            })




          /*   $.post('/banner/add',{
                bannerName: this.dom.nameInput.val(),
                bannerUrl: this.dom.urlInput.val(),
            },function(res){
                //console.log(res);
                if(res.code === 0){
                    layer.msg('添加成功');

                    //重新请求数据
                    that.search();
                }else{
                    //console.log('res.msg');
                    layer.msg('网络异常,请稍后重试');
                }
                //手动调用关闭的方法
                that.dom.addModal.modal('hide');
                //手动清空输入框
                that.dom.nameInput.val('');
                that.dom.urlInput.val('');
            }) */
        }

        //查询的方法
        Banner.prototype.search = function(){
            var that = this;
            $.get('/banner/search',{
                pageNum:this.pageNum,
                pageSize:this.pageSize
            },function(result){
                if(result.code ===0){
                    layer.msg('查询成功');
                    //讲result.data写入到实例的 bannerList
                    that.bannerList = result.data;
                    //讲result.totalPage写入到实例的 totalPage
                    that.totalPage = result.totalPage;

                    //调用渲染table
                    that.renderTable();
                    //调用渲染分页
                    that.renderPage();

                }else{
                    console.log('res.msg');
                    layer.msg('网络异常,请稍后重试');
                }
            }) 
        }

        //渲染table
        Banner.prototype.renderTable = function(){
            this.dom.table.html('');
            for(var i = 0; i<this.bannerList.length; i++){
                var item = this.bannerList[i];
                this.dom.table.append(
                    `
                    <tr>
                        <td>${item._id}</td>
                        <td>${item.name}</td>
                        <td> <img class="banner-img" data-id='${item._id}' src="${item.imgUrl}"> </td>
                        <td><a class='delete' data-id='${item._id}' href="javascript:;">删除</a> / <a class='update' href="javascript:;">修改</a></td>
                    </tr>
                    `
                )

            }
        }
        //渲染分页
        Banner.prototype.renderPage = function(){
            var prevClassName = this.pageNum === 1 ?'disabled' :'' ;
            var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';
            //清空
            this.dom.pagination.html('');
            //添加上一页
            this.dom.pagination.append(
                `
                <li class= "${prevClassName}" data-num='${this.pageNum  -1}'>
                    <a href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                `
            )

            //根据this.totalPage循环渲染多少个li
            for(var i = 1; i <= this.totalPage;i++){
                var className = this.pageNum === i?'active' : '';
                this.dom.pagination.append(
                    `
                    <li class= '${className}' data-num='${i}'><a href="#">${i}</a></li> 
                    `
                )
            }

            //添加下一页
            this.dom.pagination.append(
                `
                <li class='${nextClassName}' data-num='${this.pageNum + 1}'>
                    <a href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                `
            )
        }

         //将所有dom事件的操作放在这里
         Banner.prototype.bindDOM = function(){
            var that = this;
            //点击确认新增按钮要调用add
            this.dom.submit.click(function(){
                that.add();
            })
            this.dom.pagination.on('click','li',function(){
                //得到页码
                //attr获取属性.如果是自定义属性并且用data-开头,我们可以直接用data()获取
                //$(this).attr('data-num')
                var num = parseInt($(this).data('num'));
                //判断是否点击的是相同页 或者小于1,大于总页数
                if(that.pageNum === num || num < 1 || num > that.totalPage){
                    return;
                }
                //设置给this.pageNum
                that.pageNum = num;
                //console.log(that.pageNum);
                //再次调用this.search
                that.search();
            })
            this.dom.table.on('click','.delete', function(){
                //得到ID
                var id = $(this).data('id');
                //二次确认框
                layer.confirm("您确认要删除这条吗?",function(){
                    $.post('/banner/delete',{
                        id : id
                    },function(result){
                        if(result.code ===0){
                            layer.msg('删除成功');
                            that.search();
                        }else{
                            console.log('res.msg');
                            layer.msg('网络异常,请稍后重试');
                        }
                    })
                },function(){
                    
                })
            })
        }
        $(function(){
            var banner = new Banner();
            banner.bindDOM();
            banner.search();

        })
    
})()


















/* 
$(function(){
    var pageNum = 1;
    var pageSize = 2;

        //默认调用一次
        search(pageNum,pageSize);

    $('#bannerAdd').click(function(){
        $.post('/banner/add',{
            bannerName: $('#inputEmail3').val(),
            bannerUrl: $('#inputPassword3').val(),
        },function(res){
            console.log(res);
            if(res.code === 0){
                layer.msg('添加成功');
            }else{
                console.log('res.msg');
                layer.msg('网络异常,请稍后重试');
            }
            //手动调用关闭的方法
            $('#myModal').modal('hide');
            //手动清空输入框
            $('#inputEmail3').val('');
            $('#inputPassword3').val('');
        })
        
    
})


   /** 
        * 获取banner数据的方法
        * @param {Number} pageNum 当前页数
        * @param {Number} pageSise 每页显示的条数
        */
       /* function search(pageNum,pageSize){
        $.get('/banner/search',{
            pageNum:pageNum,
            pageSize:pageSize
        },function(result){
            if(result.code ===0){
                layer.msg('查询成功');
                for(var i = 0; i<result.data.length; i++){
                    var item = result.data[i];
                    $('#banner-table tbody').append(
                        `
                        <tr>
                            <td>${item._id}</td>
                            <td>${item.name}</td>
                            <td> <img class="banner-img" src="${item.imgUrl}"> </td>
                            <td><a href="javascript:;">删除</a> / <a href="javascript:;">修改</a></td>
                        </tr>
                        `
                    )

                }
            }else{
                console.log('res.msg');
                layer.msg('网络异常,请稍后重试');
            }
        })
    }
    
}) */ 