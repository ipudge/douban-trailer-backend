# preparation
    
    安装 mongodb 并且开启
    安装 node最新稳定版

# start

    cd douban-trailer-backend
    npm i --registry=https://registry.npm.taobao.org
    
    const {
      movieTask
    } = require('./task/schedule/movie.js')
         
    // scheduleJob(config.getMovieTaskSchedule, movieTask)  (定时任务先不取消注释，还没办法稳定每天爬取)
         
    // movieTask() (取消注释)
    
    npm run dev

# intro
    
    代理账号还有很多次自己注册也很便宜，根据能力选更好的吧
    
    douban-trailer 是爬取可用的mongodb数据
    
    examples 是一些饰品里面的一些demo
    
    跟着imooc scott 老师的课程走下来的，爬取豆瓣即将上映的电影的后台部分，互相学习

# feature
    
    - 豆瓣电影爬虫/代理爬虫(第一种容易封IP,封了换vpn即刻，第二种比较慢可能是买的代理太便宜了)
    - 图片预告,电影等资源代理(可以换成传到七牛)
    - api接口    
    
# demo

  [demo](http://movie-admin.ipudge.cn/#/movieManage) (爬虫后台前台)
  
  [爬虫代码](https://github.com/ipudge/douban-trailer-backend) (爬虫后台服务)
    
# source
  
  [imooc实站](https://coding.imooc.com/learn/list/178.html)  (后台是基于react，我基于vue写的)
  
  [mongodb备份](http://www.runoob.com/mongodb/mongodb-mongodump-mongorestore.html)
  
  [cnode源码](https://github.com/cnodejs/nodeclub/) 
  
# last

  ## cndota best dota    
    
