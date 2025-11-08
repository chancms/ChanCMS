# ChanCMS 接口文档

## 1.站点信息

<http://localhost:3000/api/v1/site>

## 2.获取碎片

<http://localhost:3000/api/v1/frag>

## 3.tag 列表

<http://localhost:3000/api/v1/tag>

## 4.友情链接

<http://localhost:3000/api/v1/friendlink>

## 5.导航

<http://localhost:3000/api/v1/category>

## 6.获取文章(头条、推荐、轮播、热门)

作用：查询头条、推荐、轮播、热门文章

<http://localhost:3000/api/v1/getArticleList?attr=&len=10&start=0>

入参：

- attr: 1 头条 2 推荐 3 轮播 4 热门 默认空
- len : 查询个数,默认 5
- start: 开始 默认 0

## 6.获取栏目文章(头条、推荐、轮播、热门)

作用：查询某个栏目头条、推荐、轮播、热门文章

<http://localhost:3000/api/v1/getArticleList?attr=&len=10&cid=1>

入参：

- attr: 1 头条 2 推荐 3 轮播 4 热门 默认空
- len : 查询个数,默认 5
- cid: 栏目 id

## 7.文章 tag 标签

作用：获取文章对应的 tag 标签
<http://localhost:3000/api/v1/getArticleTag?id=79>

入参：

- id: 文章 id

## 7.文章栏目列表

作用：获取文章对应的 tag 标签
<http://localhost:3000/api/v1/list?id=2&current=1&pageSize=10>

入参：

- id: 栏目 id
- current: 当前页
- pageSize: 每页显示条数

## 8.文章详情

作用：获取文章详情
<http://localhost:3000/api/v1/article?id=79>

入参：

- id: 文章 id

## 9.轮播图

作用：获取轮播图
<http://localhost:3000/api/v1/banner?cur=1&pageSize=10>

入参：

- cur: 当前页 默认 1
- pageSize: 每页显示条数 默认 10

## 10.pv 排行

作用：获取 pv 排行
<http://localhost:3000/api/v1/pv?id=&len=10>

入参：

- id: 栏目 id 可为空
- len: 默认 10

## 11.图文（带图）

作用：获取图文（头条，推荐，轮播，热门）列表，支持
<http://localhost:3000/api/v1/articleImg?attr=&len=10&id=>

- attr: 1 头条 2 推荐 3 轮播 4 热门 默认空
- len : 查询个数,默认 10
- id: 栏目 id

## 12.tag 列表

作用：获取 tag 列表
<http://localhost:3000/api/v1/tagList?name=&current=1&pageSize=10>

入参：

- name: 查询 tag 名称
- current: 当前页 默认 1
- pageSize: 每页显示条数 默认 10

## 13.上一页

作用：获取上一页
<http://localhost:3000/api/v1/prev?id=79&cid=6>

入参：

- id: 文章 id
- cid: 栏目 id

## 14.下一页

作用：获取下一页
<http://localhost:3000/api/v1/next?id=79&cid=6>

入参：

- id: 文章 id
- cid: 栏目 id

## 15.文章详情tag

<http://localhost:3000/api/v1/getTagsById?id=53>

入参：

- id: 文章 id

## 16.搜索

<http://localhost:3000/api/v1/search?keyword=&current=1&pageSize=10>

- keyword: 搜索关键字
- current: 当前页 默认 1
- pageSize: 每页显示条数 默认 10

## 17.浏览+1

<http://localhost:3000/api/v1/pvadd?id=53>

入参：

- id: 文章 id


## 小程序登录
<http://localhost:3000/wechat/minip/login>

入参：

- code: 小程序登录凭证（code）
- encryptedData: 用户信息
- iv: 加密算法的初始向量
- rawData: 用户信息
- signature: 签名
- userInfo: 用户信息
- userInfo.nickName: 用户昵称
- userInfo.avatarUrl: 用户头像
- userInfo.gender: 用户性别
- userInfo.city: 用户城市
- userInfo.province: 用户省份
- userInfo.country: 用户国家
- userInfo.language: 用户语言
- userInfo.openId: 用户 openId
- userInfo.unionId: 用户 unionId
- userInfo.watermark.timestamp: 用户 watermark 时间戳
- userInfo.watermark.appid: 用户 watermark appid


## 获取微信用户信息

http://localhost:3000/user/v1/detail

