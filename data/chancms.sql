/*
 Navicat Premium Dump SQL

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50726 (5.7.26)
 Source Host           : localhost:3306
 Source Schema         : chancms

 Target Server Type    : MySQL
 Target Server Version : 50726 (5.7.26)
 File Encoding         : 65001

 Date: 10/10/2025 21:03:47
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for cms_article
-- ----------------------------
DROP TABLE IF EXISTS `cms_article`;
CREATE TABLE `cms_article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int(11) NOT NULL COMMENT '栏目id',
  `subCid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '其它栏目id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '标题',
  `shortTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '短标题',
  `tagId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标签id',
  `attr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '1头条 2推荐 3轮播 4热门',
  `articleView` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '详情页模板',
  `source` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '来源',
  `author` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '作者',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '文章简述',
  `img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '缩略图',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '文章内容',
  `status` tinyint(2) NULL DEFAULT 0 COMMENT '0 发布 1 不发布',
  `pv` int(10) NULL DEFAULT 0 COMMENT '浏览量',
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '外链',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cid`(`cid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文章表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_article
-- ----------------------------
INSERT INTO `cms_article` VALUES (1, 2, '', 'ChanCMS内容管理系统', '', '2', '', '', '', '', 'ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。', '', '<p>ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。</p>\n<ul>\n<li>自研。基于自研chanjs轻量级mvc框架实现，轻量、灵活、稳定、高性能、可持续。</li>\n<li>SEO。专注于<code>seo</code>,伪静态<code>html</code>和拼音导航，灵活设置关键词和描述。</li>\n<li>安全。基于<code>knex</code>,高防<code>sql</code>注入，接口权限校验，为安全提供保障。</li>\n<li>灵活。碎片功能，支持零碎文案配置，方便各类灵活文案配置。</li>\n<li>高扩展。支持扩展模型，字段配置，可动态生成表，超强扩展。</li>\n<li>模块化。一切模块相互独立，互不干扰。</li>\n<li>插件化。灵活开发，支持完整功能模块。</li>\n<li>无头cms，为多端提供接口支持。</li>\n</ul>', 0, 15, '', '2024-09-13 22:49:28', '2025-08-18 11:32:13');
INSERT INTO `cms_article` VALUES (2, 3, '', 'ChanCMS山水图：风景图', '', '2', '', '', '', '', '山峰树林湖泊', '/public/cover/04.jpg', '<p><img src=\"https://q5.itc.cn/q_70/images03/20240706/62869b54ec3c4ea5a842b97ac9722630.jpeg\" alt=\"\" width=\"2062\" height=\"1200\"></p>', 0, 32, '', '2024-09-13 22:55:57', '2024-12-13 23:36:50');
INSERT INTO `cms_article` VALUES (3, 4, '', 'ChanCMS后台基本操作', '', '2', '', '', '', '', 'ChanCMS后台基本操作', '', '<p><iframe src=\"//player.bilibili.com/player.html?isOutside=true&aid=877077167&bvid=BV17N4y1Y7WC&cid=1362009352&p=1\" height=\"520\" frameborder=\"no\" scrolling=\"no\" allowfullscreen=\"allowfullscreen\"></iframe></p>', 0, 9, '', '2024-09-13 22:59:58', '2025-09-26 14:56:16');
INSERT INTO `cms_article` VALUES (5, 7, '', 'ChanCMS简介', '', '2', '', '', '', '', 'ChanCMS简介', '', '<p><strong>ChanCMS内容管理系统</strong></p>\n<p>ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。</p>\n<p><strong>系统特色</strong></p>\n<p>自研。基于自研chanjs轻量级mvc框架实现，轻量、灵活、稳定、高性能、可持续。</p>\n<p>SEO。专注于seo,伪静态html和拼音导航，灵活设置关键词和描述。</p>\n<p>安全。基于knex,高防sql注入，接口权限校验，为安全提供保障。</p>\n<p>灵活。碎片功能，支持零碎文案配置，方便各类灵活文案配置。</p>\n<p>高扩展。支持扩展模型，字段配置，可动态生成表，超强扩展。</p>\n<p>模块化。一切模块相互独立，互不干扰。</p>\n<p>插件化。灵活开发，支持完整功能模块。</p>\n<p>无头cms，为多端提供接口支持。</p>\n<p><strong>软件架构</strong></p>\n<p>后台管理FE</p>\n<pre class=\"language-markup\"><code>vue3\nvue-router\npina\nelement-plus\nvite4\ntinymce</code></pre>\n<p>服务端技术栈</p>\n<pre class=\"language-markup\"><code>nodejs v20.16.0+\nexpress 4.18+\nmysql v5.7.26\nknex (sql操作)\nart-tempate v4.13.2+\npm2 v5.2.2\njwt\npm2 (prd)\nnodemon (dev)</code></pre>', 0, 67, '', '2024-09-13 23:06:30', '2025-02-08 21:57:32');
INSERT INTO `cms_article` VALUES (6, 3, '', 'ChanCMS山水图：桂林山水', '', '2', '', '', '', '', '', '/public/cover/06.jpg', '<p><img src=\"https://img-qn.51miz.com/preview/element/00/01/30/75/E-1307587-924E2CBE.png!/quality/90/unsharp/true/compress/true/format/png/fwfh/900x640\" alt=\"\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p3-pc-sign.douyinpic.com/tos-cn-i-0813c001/ogKHZvfQQ30BGWXEzfeP2BQ70OA5AA7AAdyJgF~tplv-dy-aweme-images-v2:3000:3000:q75.webp?biz_tag=aweme_images&from=327834062&s=PackSourceEnum_AWEME_DETAIL&sc=image&se=false&x-expires=1729130400&x-signature=vl4RUOePzX7s4npn4oARkHH6EAc%3D\" alt=\"\" width=\"896\" height=\"1536\"></p>', 0, 7, '', '2024-09-17 10:53:54', '2025-09-25 11:41:54');
INSERT INTO `cms_article` VALUES (7, 3, '', 'ChanCMSAIGC图片美女', '', '2', '', '', '', '', '', '/public/cover/10.jpg', '<p><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p9-heycan-hgt-sign.byteimg.com/tos-cn-i-3jr8j4ixpe/31f5581b6dee463bb23c6f4a31d1b204~tplv-3jr8j4ixpe-aigc_resize:0:0.png?lk3s=43402efa&x-expires=1728864000&x-signature=AP23D4sBKcal3LurrbHp9WWra8M%3D&format=.png\" alt=\"\"></p>', 0, 4, '', '2024-09-27 10:06:09', '2024-12-13 23:36:54');
INSERT INTO `cms_article` VALUES (8, 3, '', 'ChanCMS图片美女', '', '2', '', '', '', '', '', '/public/cover/06.jpg', '<p style=\"text-align: center;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p3-heycan-hgt-sign.byteimg.com/tos-cn-i-3jr8j4ixpe/b9255497ccf94fcf9a1c873eda23b78f~tplv-3jr8j4ixpe-aigc_resize:0:0.png?lk3s=43402efa&x-expires=1728864000&x-signature=xU2jY9QGyZY5ZeG56f%2BZgRyJ4Yk%3D&format=.png\" alt=\"\"></p>', 0, 2, '', '2024-09-27 10:07:52', '2024-12-13 23:36:55');
INSERT INTO `cms_article` VALUES (9, 3, '', 'ChanCMS图片美女', '', '2', '', '', '', '', '', '/public/cover/07.jpg', '<p><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://p3-heycan-hgt-sign.byteimg.com/tos-cn-i-3jr8j4ixpe/9266d858c987459a96ff3a1847d8c9fb~tplv-3jr8j4ixpe-aigc_resize:0:0.png?lk3s=43402efa&x-expires=1728864000&x-signature=%2F%2BWXysOaMFc6Gm%2Fkiv%2FyT2d%2FoAQ%3D&format=.png\" alt=\"\"></p>', 0, 8, '', '2024-09-27 10:37:12', '2025-08-18 11:08:01');
INSERT INTO `cms_article` VALUES (11, 6, '', 'ChanCMS欢迎使用ChanCMS系统', '', '2', '', 'special.html', '', '', '', '', '<section class=\"banner row justify-center\">\n<h1 class=\"chanyue text-c\">ChanCMS</h1>\n<p class=\"f-23 text-c mt-20\">基于express+mysql的一款轻量级高质量cms管理系统</p>\n<p class=\"text-c mt-20\"><span class=\"el-button el-button--primary is-round mr-10 c-fff\"><a href=\"https://www.chancms.top/docs/index.html\" target=\"_blank\" rel=\"noopener\">开始使用</a> </span><span class=\"el-button el-button--primary is-round c-fff\"><a href=\"https://gitee.com/yanyutao0402/chanyue-cms\" target=\"_blank\" rel=\"noopener\">码云</a></span></p>\n</section>\n<section class=\"main center flex justify-between flex-wrap pd-30\">\n<div class=\"m-card\">\n<h3 class=\"f-20 mb-20\">大道至简</h3>\n<p class=\"f-16 mb-20\">基于express自研mvc框架， 优秀的稳定性，可持续迭代，拒绝复杂设计模式。</p>\n</div>\n<div class=\"m-card\">\n<h3 class=\"f-20 mb-20\">独有特色</h3>\n<p class=\"f-16 mb-20\">轻量、灵活、自研、稳定、高性能。</p>\n</div>\n<div class=\"m-card\">\n<h3 class=\"f-20 mb-20\">SEO标准</h3>\n<p class=\"f-16 mb-20\">专注于seo功能，伪静态、自定义导航、灵活设置关键词和描述。</p>\n</div>\n<div class=\"m-card\">\n<h3 class=\"f-20 mb-20\">灵活</h3>\n<p class=\"f-16 mb-20\">万能碎片功能，支持零碎文案配置，把灵活发挥到极致。</p>\n</div>\n<div class=\"m-card\">\n<h3 class=\"f-20 mb-20\">高扩展</h3>\n<p class=\"f-16 mb-20\">无头cms和传统模板共存，多端渲染。灵活模块开发，开发多领域网站。</p>\n</div>\n<div class=\"m-card\">\n<h3 class=\"f-20 mb-20\">高持续性</h3>\n<p class=\"f-16 mb-20\">多年深入nodejs技术栈，一心致力于自研开发，前后端代码逐行开发，可持续性强。</p>\n</div>\n</section>\n<footer class=\"pd-20\">\n<p class=\"mt-30 text-c f-14\">&copy;CopyRight ChanCMS</p>\n<p class=\"mt-5 text-c f-12\"><a href=\"https://beian.miit.gov.cn/\" target=\"_blank\" rel=\"external nofollow noopener\">皖ICP备2024033678号-1</a></p>\n</footer>', 0, 80, '', '2024-10-02 13:58:53', '2025-09-23 10:02:20');
INSERT INTO `cms_article` VALUES (13, 5, '', 'ChanCMS v3.0.6下载', '', '2', '', '', '', '', '', '', '<p>ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。</p>', 0, 16, '', '2024-10-02 15:40:46', '2024-10-02 15:40:46');
INSERT INTO `cms_article` VALUES (14, 2, '', 'ChanCMS', '', '2', '', 'article-pdf.html', '', '', '', '', '<p>/public/doc/1.pdf</p>', 0, 37, '', '2024-11-09 18:40:34', '2025-09-16 09:45:06');
INSERT INTO `cms_article` VALUES (15, 9, '', 'ChanCMS于作者', '', '2', '', '', '', '', '关于作者测试单页', '', '<p>关于作者测试单页</p>', 0, 82, '', '2024-12-05 23:26:59', '2025-09-23 10:02:23');
INSERT INTO `cms_article` VALUES (18, 8, '', 'ChanCMS早间新闻—2024-12-08', '', '2', '', '', '', '', '123', '', '<p>123</p>', 0, 10, '', '2024-12-09 23:16:07', '2025-08-18 11:31:40');
INSERT INTO `cms_article` VALUES (21, 8, '', 'ChanCMS一条鱼如何“接二连三”', '', '2', '', NULL, '', '', '  凌晨2点刚过，王金友就赶到自家鱼塘忙着捕鱼出货了。', '', '  <p>凌晨2点刚过，王金友就赶到自家鱼塘忙着捕鱼出货了。</p> <p>两个小时左右，3万来斤黄金鲫就经由水路运抵兴化市沙沟镇上的鱼行，近18万元卖鱼款很快到账。随着早市开场，从各个塘口汇聚而来的鲜鱼将发往农副市场、食品企业、景区饭店等处。</p> <p>兴化水网纵横，渔业发达，是江苏著名的“鱼米之乡”。当地的“一条鱼”，不仅富了养殖业，兴了加工业，也带动了旅游业发展，成了江苏农特产“接二连三”融合发展的缩影。</p> <p style=\"text-align: center;\"><img src=\"http://www.people.com.cn//NMediaFile/2024/0822/LOCAL1724282105015SPVOL0QXRZ.jpg\" width=\"600\" height=\"338\" alt=\"王金友家的鱼塘配备了自动投饵机。人民网 范尧摄\"></p> <p style=\"text-align: center;\"><span desc=\"desc\">王金友家的鱼塘配备了自动投饵机。人民网 范尧摄</span></p> <p><strong>一条鱼，养在水中富民增收</strong></p> <p>“如果不是今天捕鱼，现在投饵根本不出家门，直接手机操作，还可以看到鱼塘的实时画面。”王金友说。</p> <p>作为有着30多年经验的养鱼户，以前最让王金友头疼的就是喂鱼。一袋袋菜籽饼搬到船上，用铁锹拌匀，一锹锹撒到水塘，每天成百上千斤的鱼食，“哪怕是冬季，一到喂鱼时那汗出的，衣服就没有干过。”</p> <p>如今，鱼塘全部装上了自动投饵机，定时定量投喂，王金友感慨：“现在承包400亩鱼塘，一年能卖600多万元，从来没觉得养鱼像这样轻松。”</p> <p>作为主打农产品，兴化市淡水鱼养殖规模常年维持在16万亩。当地以淡水鱼、大闸蟹为主的水产品年产量超30万吨，连续34年位居江苏省内陆渔业县级之首，渔业经济年产值达260多亿元。</p> <p style=\"text-align: center;\"><img src=\"http://www.people.com.cn//NMediaFile/2024/0822/LOCAL1724282118793UALTZ2ZRGW.jpg\" width=\"600\" height=\"450\" alt=\"当地企业展柜里摆放着部分以鱼为原料开发的食品。人民网 王丹丹摄\"></p> <p style=\"text-align: center;\"><span desc=\"desc\">当地企业展柜里摆放着部分以鱼为原料开发的食品。人民网 王丹丹摄</span></p> <p><strong>一条鱼，生产线上吃干榨净</strong></p> <p>早上7点，5辆厢式货车陆续驶入兴化经济开发区的大泽水产制品有限公司。这趟运来的5万多斤鲢鱼，是渔业经纪人姜绍喜一早从兴化各塘口收来的。</p> <p>活鱼经传送带进入车间，生产线启动作业，80多位工人依次进行分级、打鳞、切断等初处理。</p> <p>一条鲢鱼切为鱼头和鱼身，分别在剁椒鱼头和鱼块生产线上速冻锁鲜，抽真空后再组合料包，做成不同种类的包装食品。此外，鱼骨等经过熟化、粉碎、烘干被加工成宠物饲料。</p> <p>“仅‘边角料’利用，每年就为企业增收近百万元。”该公司总经理张永山介绍，这种对一条鱼“吃干榨净”式的综合利用，既提高了经济效益，也实现了对生鱼废料的清洁化处理。“我们每天要用掉10万斤左右鲢鱼，把兴化本地的鲢鱼都买完，也只能满足需求量的1/3。”他说。</p> <p>在兴化，以鱼为原料的包装食品，除了剁椒鱼头，还有烤鱼、酸菜鱼等。与此同时，健康食品产业也已成为当地三大主导产业之一，规上企业年度开票收入突破110亿元。</p> <p style=\"text-align: center;\"><img src=\"http://www.people.com.cn//NMediaFile/2024/0822/LOCAL1724282131269FYZXGVZQYM.jpg\" width=\"600\" height=\"337\" alt=\"沙沟镇河网纵横，尽显水乡风貌。人民网 范尧摄\"></p> <p style=\"text-align: center;\"><span desc=\"desc\">沙沟镇河网纵横，尽显水乡风貌。人民网 范尧摄</span></p> <p><strong>一条鱼，以农兴旅的美食担当</strong></p> <p>72岁的江荣根在外工作了大半辈子，退休后以“游客”身份回到家乡兴化。促使他回乡“旅居”的，是一碗念念不忘的鱼汤面。</p> <p>“原本只想在亲戚家住两天就回上海，结果却在老家住了下来。”江荣根入住的民宿“枇杷苑”，老板王秀荣做得一手家乡菜，而最能打动江荣根的，还是那碗鱼汤面。</p> <p>鱼汤是将鳝鱼剔肉留骨，加入小鲫鱼、大猪骨煸炒，用文火慢炖到浓白，最后再把下好的面条放到汤头里。这一碗汤鲜味美的鱼汤面让江荣根穿过数十年岁月，吃到了“小时候的味道”。</p> <p>每年住在兴化的时间里，江荣根都会邀请他在上海的“退休团”朋友同来，春看垛田油菜，夏赏万亩荷塘，秋游水上森林，冬观候鸟翔集。沙沟古镇景区内的金沙沟水席馆，一道兴化鱼圆颇受大家的好评。“不少客人都说，就为这口鱼圆来的兴化，吃完还要打包几份带走。高峰期我们一天能卖掉大几百斤。”在金沙沟水席馆总经理张庄巧眼里，鱼汤面也好，鱼圆也罢，都是本乡人的家常饭菜，也是城里人舌尖上的乡愁记忆。</p> <p>以农兴旅，以旅促农，美食总是屡试不爽的关键。仅金沙沟水席馆这一家，一年上百万元的营业额中，淡水鱼有关的菜品销售占近七成。而像这样的餐馆，兴化境内的景区里比比皆是。</p> <p style=\"text-align: center;\"><img src=\"http://www.people.com.cn//NMediaFile/2024/0822/LOCAL17242819971464D92R8R6C7.jpg\" width=\"600\" height=\"567\" alt=\"每年6月的万人龙虾宴，是盱眙龙虾爆火的标志。许昌银摄\"></p> <p style=\"text-align: center;\"><span desc=\"desc\">每年6月的万人龙虾宴，是盱眙龙虾爆火的标志。许昌银摄</span></p> <p><strong>“接二连三”的，不止一条鱼</strong></p> <p>产业振兴是乡村振兴的重中之重。事实上，像“兴化的一条鱼”这样“接二连三”的故事，江苏还有很多。</p> <p>淮安市盱眙县有“中国龙虾之都”的美称，该县小龙虾养殖面积97万亩，从养殖、加工到餐饮，从事龙虾相关产业的人口超过20万，形成了一个年产值超300亿元的富民产业。去年投产的龙虾超级工厂，更让盱眙龙虾成为只需24小时就能从当地虾田送到全国消费者手中的即食美味。</p> <p>在无锡市惠山区阳山镇，3.5万亩桃林，5000多户桃农，成就了当地人的一项甜蜜产业。当地不光卖桃，还卖起了风景，全年200多万的游客带来农旅两旺，阳山农民人均可支配收入高达6.6万元。</p> <p>近些年，江苏持续倡导推动农村一二三产业融合发展。人民网从江苏省农业农村厅了解到，截至目前，江苏以“一村一品、一镇一特、一县一业”为抓手，已打造10亿元以上县域优势特色产业近200个，培育国家农业产业强镇60多个、全国“一村一品”示范村镇200多个。</p> <p>“一二三产业融合发展可以将资源优势转变为产品优势，产品优势转化为产业优势，产业优势转化为市场优势，是乡村产业振兴的进阶方向。其关键在于找准特色资源和优势产业，注重发挥龙头企业的带动作用，并持续优化产业链合作机制，切实带动农民增收。”江苏省农科院农产品加工研究所首席研究员李春阳说。</p><center></center> ', 0, 5, '', '2024-12-09 23:17:35', '2025-09-16 09:45:01');
INSERT INTO `cms_article` VALUES (22, 8, '', '欢迎使用ChanCMS系统', '', '2', '', '', '', '', '1', '/public/uploads/default/2025/04/02/1743577048415_source_01.jpg', '欢迎使用ChanCMS系统', 0, 5, '', '2025-04-02 14:28:02', '2025-09-26 20:01:19');

-- ----------------------------
-- Table structure for cms_articletag
-- ----------------------------
DROP TABLE IF EXISTS `cms_articletag`;
CREATE TABLE `cms_articletag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NULL DEFAULT NULL COMMENT '文章id',
  `tid` int(11) NULL DEFAULT NULL COMMENT '标签id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `aid`(`aid`) USING BTREE,
  INDEX `tid`(`tid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '文章-标签表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_articletag
-- ----------------------------
INSERT INTO `cms_articletag` VALUES (2, 22, 2);

-- ----------------------------
-- Table structure for cms_category
-- ----------------------------
DROP TABLE IF EXISTS `cms_category`;
CREATE TABLE `cms_category`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '栏目id',
  `pid` int(11) NOT NULL DEFAULT 0 COMMENT '父级栏目',
  `seoTitle` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'seo标题',
  `seoKeywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'seo关键字',
  `seoDescription` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT 'seo描述',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目名称',
  `pinyin` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目标识',
  `path` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目路径',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '栏目描述',
  `type` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '0 栏目 1 页面',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '网址',
  `orderBy` tinyint(2) NULL DEFAULT 0 COMMENT '排序',
  `target` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '打开方式 0 当前页面打开 1 新页面打开',
  `status` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '0 显示 1隐藏',
  `mid` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '模型id',
  `listView` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'list.html' COMMENT '列表页模板',
  `articleView` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'article.html' COMMENT '详情页模板',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '网站栏目' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_category
-- ----------------------------
INSERT INTO `cms_category` VALUES (1, 0, '', '', '', '首页', 'home', '/home', '', '1', '', 0, '0', '0', '0', 'index.html', 'article.html', '2024-09-13 22:38:12', '2024-09-17 15:47:29');
INSERT INTO `cms_category` VALUES (2, 0, '', '', '', '文章', 'art3', '/art3', '', '0', '', 0, '0', '0', '0', 'list.html', 'article.html', '2024-09-13 22:38:12', '2024-12-06 00:13:05');
INSERT INTO `cms_category` VALUES (3, 0, '', '', '', '图片', 'pics', '/pics', '', '0', '', 0, '0', '0', '0', 'list-img.html', 'article-img.html', '2024-09-13 22:39:02', '2024-09-17 10:26:10');
INSERT INTO `cms_category` VALUES (4, 0, '', '', '', '视频', 'video', '/video', '', '0', '', 0, '0', '0', '0', 'list.html', 'article.html', '2024-09-13 22:39:22', '2024-09-13 22:39:22');
INSERT INTO `cms_category` VALUES (5, 0, '', '', '', '下载', 'down', '/down', '', '0', '', 0, '0', '0', '1', 'list.html', 'article-down.html', '2024-09-13 22:39:44', '2024-10-02 15:45:16');
INSERT INTO `cms_category` VALUES (6, 0, '', '', '', '专题', 'topic', '/topic', '', '1', '', 0, '0', '0', '0', 'list.html', 'special.html', '2024-09-13 22:42:10', '2024-10-01 14:41:51');
INSERT INTO `cms_category` VALUES (7, 0, '', '', '', '关于', 'about', '/about', '', '1', '', 0, '0', '0', '0', 'list.html', 'page.html', '2024-09-13 22:42:55', '2024-09-13 23:09:29');
INSERT INTO `cms_category` VALUES (8, 2, '', '', '', '文档', 'doc', '/art2/doc', '', '0', '', 0, '0', '0', '0', 'list.html', 'article.html', '2024-12-05 22:35:58', '2025-01-07 21:41:13');
INSERT INTO `cms_category` VALUES (9, 7, '', '', '', '作者', 'zuozhe', '/about/zuozhe', '', '1', '', 0, '0', '0', '0', 'list.html', 'page.html', '2024-12-05 23:25:44', '2024-12-05 23:34:37');

-- ----------------------------
-- Table structure for cms_field
-- ----------------------------
DROP TABLE IF EXISTS `cms_field`;
CREATE TABLE `cms_field`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `mid` int(11) NULL DEFAULT NULL COMMENT '模型id',
  `cname` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '模型字段中文名称',
  `ename` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '模型字段英文名称',
  `type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '表单类型\r\n1单行文本	\r\n2.多行文本 \r\n3.下拉菜单 \r\n4.单选 \r\n5.多选 \r\n6.时间和日期 7.数字',
  `val` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '字段配置 下拉菜单多选等选项配置',
  `defaultVal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '默认值',
  `orderBy` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '0' COMMENT '字段顺序',
  `length` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '字段长度',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `model_id`(`mid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '字段字典' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_field
-- ----------------------------
INSERT INTO `cms_field` VALUES (1, 1, '文件名称', 'fileName', '1', '', '', '0', '');
INSERT INTO `cms_field` VALUES (2, 1, '文件版本', 'fileVersion', '1', '', '', '0', '');
INSERT INTO `cms_field` VALUES (3, 1, '文件链接', 'fileLink', '1', '', '', '0', '');
INSERT INTO `cms_field` VALUES (4, 1, '测试1', 'test1', '4', '', '{\"options\":[{\"label\":\"本地下载\",\"value\":\"1\"},{\"label\":\"电信下载\",\"value\":\"2\"}]}', '0', '');

-- ----------------------------
-- Table structure for cms_frag
-- ----------------------------
DROP TABLE IF EXISTS `cms_frag`;
CREATE TABLE `cms_frag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '名称',
  `mark` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标识',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `type` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '类型 1 富文本 2 文本框',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '碎片' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_frag
-- ----------------------------
INSERT INTO `cms_frag` VALUES (1, 'chancms简介', 'chancms', '<p><span style=\"font-size: 14px;\">ChanCMS是一款基于Node、Express、MySQL、Vue3研发的高质量实用型CMS系统。轻量、灵活、稳定、高性能、易扩展，让开发更简单。</span></p>', '1', '2024-09-13 22:53:33', '2024-09-27 10:51:41');
INSERT INTO `cms_frag` VALUES (2, 'PowerBy', 'PowerBy', '<p style=\"text-align: center;\">Powder By <a href=\"http://www.chancms.top\" target=\"_blank\" rel=\"noopener\">ChanCMS v3.0.14</a></p>', '1', '2024-09-27 11:00:03', '2025-02-12 22:13:21');

-- ----------------------------
-- Table structure for cms_friendlink
-- ----------------------------
DROP TABLE IF EXISTS `cms_friendlink`;
CREATE TABLE `cms_friendlink`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '链接名称',
  `link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '链接地址',
  `orderBy` tinyint(255) NULL DEFAULT 0 COMMENT '排序',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '友情链接' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_friendlink
-- ----------------------------
INSERT INTO `cms_friendlink` VALUES (1, 'ChanCMS官网', 'https://www.chancms.top', 0, '2024-10-02 14:12:45', '2024-10-02 14:12:45');

-- ----------------------------
-- Table structure for cms_message
-- ----------------------------
DROP TABLE IF EXISTS `cms_message`;
CREATE TABLE `cms_message`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('1','2','3','4') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '留言分类 1->咨询 2->建议 3->投诉 4->其它',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '留言标题',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `tel` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '电话',
  `wechat` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信',
  `company` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '公司名称',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '留言内容',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '留言' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_message
-- ----------------------------
INSERT INTO `cms_message` VALUES (1, '1', '1', '1111', '1', '1', '1', '1', '2025-04-02 15:47:25', '2025-04-02 15:47:25');

-- ----------------------------
-- Table structure for cms_model
-- ----------------------------
DROP TABLE IF EXISTS `cms_model`;
CREATE TABLE `cms_model`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `model` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '模型名称',
  `tableName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '模型对应的表名',
  `status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '1' COMMENT '1->开启 0->关闭',
  `remark` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '模型字典' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_model
-- ----------------------------
INSERT INTO `cms_model` VALUES (1, '下载模型', 'ext_download', '1', '下载模型');

-- ----------------------------
-- Table structure for cms_site
-- ----------------------------
DROP TABLE IF EXISTS `cms_site`;
CREATE TABLE `cms_site`  (
  `id` int(2) NOT NULL AUTO_INCREMENT COMMENT '站点id',
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '网站名称',
  `logo` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '网站logo',
  `domain` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '网站域名',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `wx` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信',
  `icp` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'ICP备案号',
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '站点统计代码',
  `json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '万能配置',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '页面标题',
  `keywords` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '页面关键词',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '页面描述',
  `template` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'default' COMMENT 'view模板名称',
  `uploadWay` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '1' COMMENT '上传方式 1->普通 2->七牛云',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '网站信息' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_site
-- ----------------------------
INSERT INTO `cms_site` VALUES (1, 'ChanCMS', '/public/template/default/img/logo.png', 'www.chancms.top', '867528315@qq.com', NULL, '皖ICP备2024030927号-1', '', '', 'ChanCMS演示站', 'ChanCMS演示站', 'ChanCMS是一款基于Express和MySQL研发的高质量实用型CMS管理系统。它具备多种类型网站开发，易扩展、基于模块化和插件化开发模式，适用于商用企业级程序开发。', 'default', '1', NULL, '2025-09-26 19:09:24');

-- ----------------------------
-- Table structure for cms_slide
-- ----------------------------
DROP TABLE IF EXISTS `cms_slide`;
CREATE TABLE `cms_slide`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `imgUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '轮播图',
  `linkUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '轮播链接',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '轮播文案',
  `mark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '轮播图' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_slide
-- ----------------------------
INSERT INTO `cms_slide` VALUES (1, '01', '/public/template/huida/imgs/01.jpg', '', '<h2 class=\"text-4xl font-bold mb-4\">环保科技引领未来</h2>\n<p class=\"text-xl mb-6\">专业的环保解决方案提供商</p>\n<p><a href=\"about.html\" class=\"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition duration-300\">联系我们</a></p>', NULL, '2024-09-17 10:52:05', '2025-07-06 09:30:15');
INSERT INTO `cms_slide` VALUES (3, '04', '/public/template/huida/imgs/04.jpg', '', NULL, NULL, '2025-07-05 20:51:11', '2025-07-06 09:26:00');

-- ----------------------------
-- Table structure for cms_tag
-- ----------------------------
DROP TABLE IF EXISTS `cms_tag`;
CREATE TABLE `cms_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '标签名称',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '标识',
  `count` int(11) NULL DEFAULT 0 COMMENT '引用次数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '标签' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cms_tag
-- ----------------------------
INSERT INTO `cms_tag` VALUES (1, '图片', 'pic', 6);
INSERT INTO `cms_tag` VALUES (2, 'chancms', 'chancms', 7);

-- ----------------------------
-- Table structure for ext_download
-- ----------------------------
DROP TABLE IF EXISTS `ext_download`;
CREATE TABLE `ext_download`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(11) NOT NULL,
  `fileName` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `fileVersion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `fileLink` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `test1` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `aid`(`aid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '下载模型' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of ext_download
-- ----------------------------

-- ----------------------------
-- Table structure for plus_collect
-- ----------------------------
DROP TABLE IF EXISTS `plus_collect`;
CREATE TABLE `plus_collect`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `taskName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '任务名称',
  `targetUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '采集地址',
  `listTag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '列表tag标签',
  `startNum` int(11) NULL DEFAULT 1 COMMENT '开始页面',
  `endNum` int(11) NULL DEFAULT NULL COMMENT '结束页面',
  `increment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '递增数量默认1',
  `titleTag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '标题',
  `articleTag` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '文章内容',
  `charset` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '编码 1-> utf-8  2-> gb2312',
  `pages` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '采集地址集合',
  `parseData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '格式化数据函数',
  `cid` int(11) NOT NULL COMMENT '存储到栏目',
  `status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '发布状态 1 草稿 2 发布',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cid`(`cid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '采集' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of plus_collect
-- ----------------------------
INSERT INTO `plus_collect` VALUES (2, '人民网-top文章', 'http://www.people.com.cn/', '#rm_topline a', 1, 1, '1', '#newstit', '.rm_txt_con', '1', 'http://js.people.com.cn/n2/2024/0822/c360301-40951625.html', '{\n    \"imagePrefix\": \"http://www.people.com.cn\",\n    \"removeSelectors\":\".edit, .paper_num\"\n}', 8, '2', '2024-08-22 16:27:19', '2025-10-10 19:51:10');

-- ----------------------------
-- Table structure for plus_gather
-- ----------------------------
DROP TABLE IF EXISTS `plus_gather`;
CREATE TABLE `plus_gather`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `taskName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '任务名称',
  `targetUrl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '采集地址',
  `parseData` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '格式化数据函数',
  `cid` int(11) NOT NULL COMMENT '存储到栏目',
  `status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '发布状态 1 草稿 2 发布',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `cid`(`cid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '开源接口采集' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of plus_gather
-- ----------------------------
INSERT INTO `plus_gather` VALUES (3, '每日新闻60s', 'https://api.j4u.ink/v1/store/other/proxy/remote/news/60.json', '{\n  \"title\": {\n    \"path\": \"data.date_info.lunarCalendar\",\n    \"prefix\": \"【早报】\",\n    \"suffix\": \" 🌞\",\n    \"default\": \"未知日期\"\n  },\n\"img\":{\n\"path\":\"data.image\"\n},\n  \"content\": {\n    \"path\": \"data.news\",\n    \"isArray\": true,\n    \"wrap\": \"p\",\n    \"prefix\": \"<h3>今日要闻</h3>\",\n    \"suffix\": \"<p><em>—— 完 ——</em></p>\",\n    \"default\": \"暂无新闻\"\n  },\n  \"source\": {\n    \"path\": \"data.source\",\n    \"prefix\": \"来源：\",\n    \"default\": \"互联网\"\n  },\n  \"remark\": {\n    \"path\": \"data.disclaimer\",\n    \"suffix\": \" ⚠️\",\n    \"default\": \"无特别说明\"\n  }\n}', 8, '2', '2023-11-29 19:10:45', '2025-10-10 20:50:48');

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '关联配置类型',
  `config_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置键',
  `config_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置值',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1' COMMENT '开启（1 开启 2 关闭）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `config_key`(`config_key`) USING BTREE,
  INDEX `sys_config_ibfk_1`(`type_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_config
-- ----------------------------
INSERT INTO `sys_config` VALUES (1, 'wechat_minip', 'appid', '23', '1', '2025-03-07 14:50:13', '2025-03-07 22:11:33', '小程序appId');
INSERT INTO `sys_config` VALUES (2, 'wechat_minip', 'secret', '23', '1', '2025-03-07 14:54:36', '2025-03-07 22:11:33', '');
INSERT INTO `sys_config` VALUES (3, 'qiniu_oss', 'accessKey', '5xoT5V81UHKLCVnVcGnoVWVtrw2fdJk_n7X8Pt0o', '1', '2025-03-07 14:59:31', '2025-08-27 11:11:22', '');
INSERT INTO `sys_config` VALUES (4, 'qiniu_oss', 'secretKey', 'N9V-UkYmjIi7nxi1eL_WhLHR9TUIQFh0fxBct7bx', '1', '2025-03-07 14:59:51', '2025-08-27 11:11:22', '');
INSERT INTO `sys_config` VALUES (5, 'qiniu_oss', 'bucket', 'ohm', '1', '2025-03-07 15:00:08', '2025-08-27 11:11:22', '');
INSERT INTO `sys_config` VALUES (6, 'cms_config', 'uploadWay', '1', '1', '2025-03-07 15:00:42', '2025-03-07 15:00:42', '');
INSERT INTO `sys_config` VALUES (8, 'qiniu_oss', 'domain', 'resource.ohmvehicles.com', '1', '2025-03-07 17:48:50', '2025-08-27 11:11:22', NULL);
INSERT INTO `sys_config` VALUES (9, 'cms_data', 'init', '{\r\n  \"site\": {\r\n    \"method\": \"site\"\r\n  },\r\n  \"category\": {\r\n    \"method\": \"category\"\r\n  },\r\n  \"friendlink\": {\r\n    \"method\": \"friendLink\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  },\r\n  \"frag\": {\r\n    \"method\": \"frag\",\r\n    \"params\": {\r\n      \"pageSize\": 50\r\n    }\r\n  },\r\n  \"tag\": {\r\n    \"method\": \"tag\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:11:47', '2025-07-30 14:08:55', '');
INSERT INTO `sys_config` VALUES (10, 'cms_data', 'home', '{\r\n  \"banner\": {\r\n    \"method\": \"bannerSlide\",\r\n    \"show\": true\r\n  },\r\n  \"slide\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 1,\r\n      \"attr\": [\r\n        \"3\"\r\n      ]\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"link\",\r\n      \"img\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"top\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 1,\r\n      \"attr\": [\r\n        \"1\"\r\n      ],\r\n      \"type\": 1\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"description\",\r\n      \"img\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"news\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 3,\r\n      \"excludeAttr\": [\r\n        \"1\"\r\n      ]\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"createdAt\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"article\": {\r\n    \"method\": \"getArticleListByCids\",\r\n    \"params\": {\r\n      \"cid\": [],\r\n      \"len\": 5,\r\n      \"toplen\": 1,\r\n      \"attr\": [\r\n        \"1\",\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"show\": true\r\n  },\r\n  \"imgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 8\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"img\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"recommend\": {\r\n    \"method\": \"getArticleList\",\r\n    \"params\": {\r\n      \"start\": 0,\r\n      \"len\": 10,\r\n      \"attr\": [\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"show\": true\r\n  },\r\n  \"hot\": {\r\n    \"method\": \"getArticlePvList\",\r\n    \"show\": true\r\n  },\r\n  \"recommendImgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 10,\r\n      \"id\": \"\",\r\n      \"attr\": [\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"img\",\r\n      \"description\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"friendlink\": {\r\n    \"method\": \"friendLink\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    },\r\n    \"show\": true\r\n  }\r\n}', '1', '2025-07-30 11:15:24', '2025-07-30 14:10:37', '首页数据');
INSERT INTO `sys_config` VALUES (11, 'cms_data', 'list', '{\r\n  \"articleList\": {\r\n    \"method\": \"list\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  },\r\n  \"recommend\": {\r\n    \"method\": \"getArticleListByCid\",\r\n    \"params\": {\r\n      \"len\": 5,\r\n      \"attr\": [\r\n        \"2\"\r\n      ]\r\n    },\r\n    \"show\": true\r\n  },\r\n  \"hot\": {\r\n    \"method\": \"getArticlePvList\",\r\n    \"params\": {\r\n      \"len\": 10\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"imgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 5\r\n    },\r\n    \"show\": true\r\n  }\r\n}', '1', '2025-07-30 11:22:19', '2025-07-30 14:12:40', '');
INSERT INTO `sys_config` VALUES (12, 'cms_data', 'article', '{\r\n  \"news\": {\r\n    \"method\": \"getArticleListByCid\",\r\n    \"params\": {\r\n      \"len\": 10\r\n    }\r\n  },\r\n  \"hot\": {\r\n    \"method\": \"getArticlePvList\",\r\n    \"params\": {\r\n      \"len\": 10\r\n    },\r\n    \"field\": [\r\n      \"id\",\r\n      \"title\",\r\n      \"path\",\r\n      \"pv\"\r\n    ],\r\n    \"show\": true\r\n  },\r\n  \"imgs\": {\r\n    \"method\": \"getNewImgList\",\r\n    \"params\": {\r\n      \"len\": 5\r\n    }\r\n  },\r\n  \"tags\": {\r\n    \"method\": \"fetchTagsByArticleId\",\r\n    \"params\": {\r\n      \"len\": 5\r\n    }\r\n  },\r\n  \"count\": {\r\n    \"method\": \"count\"\r\n  },\r\n  \"pre\": {\r\n    \"method\": \"prev\"\r\n  },\r\n  \"next\": {\r\n    \"method\": \"next\"\r\n  }\r\n}', '1', '2025-07-30 11:22:53', '2025-07-30 14:13:21', '');
INSERT INTO `sys_config` VALUES (13, 'cms_data', 'page', '{\r\n  \"page\": {\r\n    \"method\": \"list\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:23:25', '2025-07-30 14:14:19', '');
INSERT INTO `sys_config` VALUES (14, 'cms_data', 'search', '{\r\n  \"search\": {\r\n    \"method\": \"search\",\r\n    \"params\": {\r\n      \"pageSize\": 10,\r\n      \"cid\": 0\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:23:53', '2025-07-30 14:13:45', '');
INSERT INTO `sys_config` VALUES (15, 'cms_data', 'tags', '{\r\n  \"tags\": {\r\n    \"method\": \"tags\",\r\n    \"params\": {\r\n      \"pageSize\": 10\r\n    }\r\n  }\r\n}', '1', '2025-07-30 11:24:06', '2025-07-30 14:13:59', '');

-- ----------------------------
-- Table structure for sys_config_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_config_type`;
CREATE TABLE `sys_config_type`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
  `type_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类型标识（如 qiniu, wechat_mini）',
  `type_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '类型名称（如七牛云存储、微信小程序）',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1' COMMENT '是否启用',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `type_code`(`type_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '配置类型表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_config_type
-- ----------------------------
INSERT INTO `sys_config_type` VALUES (2, 'wechat_minip', '微信小程序', '1', '微信小程序登录appId appkey', '2025-03-01 21:02:10', '2025-03-07 14:20:35');
INSERT INTO `sys_config_type` VALUES (3, 'qiniu_oss', '七牛云配置', '1', '七牛云oss配置', '2025-03-01 21:03:35', '2025-03-07 14:20:21');
INSERT INTO `sys_config_type` VALUES (4, 'cms_config', '应用设置', '1', '站点常用配置', '2025-03-04 19:10:51', '2025-03-07 14:21:05');
INSERT INTO `sys_config_type` VALUES (5, 'cms_data', '模板数据', '1', '模板数据', '2025-07-30 10:25:04', '2025-07-30 10:25:04');

-- ----------------------------
-- Table structure for sys_configs
-- ----------------------------
DROP TABLE IF EXISTS `sys_configs`;
CREATE TABLE `sys_configs`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `type_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '关联配置类型',
  `config_key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置键',
  `config_value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '配置值',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1' COMMENT '开启（1 开启 2 关闭）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `config_key`(`config_key`) USING BTREE,
  INDEX `sys_configs_ibfk_1`(`type_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统配置表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_configs
-- ----------------------------
INSERT INTO `sys_configs` VALUES (1, 'wechat_minip', 'appid', '2', '1', '2025-03-07 14:50:13', '2025-03-07 17:31:24', '小程序appId');
INSERT INTO `sys_configs` VALUES (2, 'wechat_minip', 'secret', '2', '1', '2025-03-07 14:54:36', '2025-03-07 17:31:24', '');
INSERT INTO `sys_configs` VALUES (3, 'qiniu_oss', 'accessKey', 'accessKey1', '1', '2025-03-07 14:59:31', '2025-03-07 17:52:32', '');
INSERT INTO `sys_configs` VALUES (4, 'qiniu_oss', 'secretKey', 'secretKey1', '1', '2025-03-07 14:59:51', '2025-03-07 17:52:32', '');
INSERT INTO `sys_configs` VALUES (5, 'qiniu_oss', 'bucket', 'bucket1', '1', '2025-03-07 15:00:08', '2025-03-07 17:52:32', '');
INSERT INTO `sys_configs` VALUES (6, 'cms_config', 'uploadWay', '1', '1', '2025-03-07 15:00:42', '2025-03-07 15:00:42', '');
INSERT INTO `sys_configs` VALUES (8, 'qiniu_oss', 'domain', 'domain1', '1', '2025-03-07 17:48:50', '2025-03-07 17:52:32', NULL);

-- ----------------------------
-- Table structure for sys_loginlog
-- ----------------------------
DROP TABLE IF EXISTS `sys_loginlog`;
CREATE TABLE `sys_loginlog`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户id',
  `ip` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'ip',
  `country` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '国家',
  `prov` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '市',
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '区',
  `isp` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '网络提供商',
  `lat` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '纬度',
  `lng` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '经度',
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`, `createdAt`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 179 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '登录日志' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_loginlog
-- ----------------------------
INSERT INTO `sys_loginlog` VALUES (78, 1, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-22 18:18:38');
INSERT INTO `sys_loginlog` VALUES (79, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 01:02:26');
INSERT INTO `sys_loginlog` VALUES (80, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 01:11:22');
INSERT INTO `sys_loginlog` VALUES (81, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 01:12:46');
INSERT INTO `sys_loginlog` VALUES (82, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 01:15:09');
INSERT INTO `sys_loginlog` VALUES (83, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 01:18:40');
INSERT INTO `sys_loginlog` VALUES (84, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 01:21:48');
INSERT INTO `sys_loginlog` VALUES (85, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:21:16');
INSERT INTO `sys_loginlog` VALUES (86, 14, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:27:39');
INSERT INTO `sys_loginlog` VALUES (87, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:33:09');
INSERT INTO `sys_loginlog` VALUES (88, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:37:36');
INSERT INTO `sys_loginlog` VALUES (89, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:39:48');
INSERT INTO `sys_loginlog` VALUES (90, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:42:06');
INSERT INTO `sys_loginlog` VALUES (91, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:43:45');
INSERT INTO `sys_loginlog` VALUES (92, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:45:42');
INSERT INTO `sys_loginlog` VALUES (93, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 10:59:37');
INSERT INTO `sys_loginlog` VALUES (94, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-23 11:42:52');
INSERT INTO `sys_loginlog` VALUES (95, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-26 22:16:04');
INSERT INTO `sys_loginlog` VALUES (96, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-26 22:16:24');
INSERT INTO `sys_loginlog` VALUES (97, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-26 22:45:40');
INSERT INTO `sys_loginlog` VALUES (98, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-26 23:56:44');
INSERT INTO `sys_loginlog` VALUES (99, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-27 10:01:55');
INSERT INTO `sys_loginlog` VALUES (100, 14, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-27 10:12:26');
INSERT INTO `sys_loginlog` VALUES (101, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-27 10:13:30');
INSERT INTO `sys_loginlog` VALUES (102, 14, '', '', '', '', '', '', '', '', '2025-02-28 09:34:47');
INSERT INTO `sys_loginlog` VALUES (103, 14, '', '', '', '', '', '', '', '', '2025-02-28 09:35:22');
INSERT INTO `sys_loginlog` VALUES (104, 11, '', '', '', '', '', '', '', '', '2025-02-28 09:35:38');
INSERT INTO `sys_loginlog` VALUES (105, 11, '101.125.4.178', '中国', '', '', '', '', NULL, NULL, '2025-02-28 16:14:47');
INSERT INTO `sys_loginlog` VALUES (106, 11, '122.96.45.82', '中国', '', '', '', '', NULL, NULL, '2025-02-28 19:41:04');
INSERT INTO `sys_loginlog` VALUES (107, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-28 23:01:23');
INSERT INTO `sys_loginlog` VALUES (108, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-28 23:02:13');
INSERT INTO `sys_loginlog` VALUES (109, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-28 23:02:39');
INSERT INTO `sys_loginlog` VALUES (110, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-02-28 23:04:17');
INSERT INTO `sys_loginlog` VALUES (111, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 10:57:11');
INSERT INTO `sys_loginlog` VALUES (112, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 10:57:26');
INSERT INTO `sys_loginlog` VALUES (113, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 19:12:35');
INSERT INTO `sys_loginlog` VALUES (114, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 19:12:48');
INSERT INTO `sys_loginlog` VALUES (115, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 19:44:07');
INSERT INTO `sys_loginlog` VALUES (116, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 21:31:03');
INSERT INTO `sys_loginlog` VALUES (117, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 21:53:14');
INSERT INTO `sys_loginlog` VALUES (118, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 21:54:27');
INSERT INTO `sys_loginlog` VALUES (119, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 21:54:55');
INSERT INTO `sys_loginlog` VALUES (120, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-01 22:33:28');
INSERT INTO `sys_loginlog` VALUES (121, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-02 09:52:07');
INSERT INTO `sys_loginlog` VALUES (122, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-02 18:05:54');
INSERT INTO `sys_loginlog` VALUES (123, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-02 18:06:18');
INSERT INTO `sys_loginlog` VALUES (124, 14, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-02 18:32:03');
INSERT INTO `sys_loginlog` VALUES (125, 11, '112.80.235.254', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-02 18:32:17');
INSERT INTO `sys_loginlog` VALUES (126, 11, '101.125.4.178', '中国', '', '', '', '', NULL, NULL, '2025-03-05 17:38:24');
INSERT INTO `sys_loginlog` VALUES (127, 11, '122.96.42.250', '中国', '江苏省', '南京市', '', '中国联通', NULL, NULL, '2025-03-05 19:13:00');
INSERT INTO `sys_loginlog` VALUES (128, 11, '122.96.42.250', '中国', '江苏省', '南京市', '', '中国联通', NULL, NULL, '2025-03-05 20:09:31');
INSERT INTO `sys_loginlog` VALUES (129, 11, '101.125.4.178', '中国', '', '', '', '', NULL, NULL, '2025-03-07 10:19:28');
INSERT INTO `sys_loginlog` VALUES (130, 14, '101.125.4.178', '中国', '', '', '', '', NULL, NULL, '2025-03-07 10:25:22');
INSERT INTO `sys_loginlog` VALUES (131, 11, '101.125.4.178', '中国', '', '', '', '', NULL, NULL, '2025-03-07 10:25:55');
INSERT INTO `sys_loginlog` VALUES (132, 14, '122.96.147.111', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-07 19:24:45');
INSERT INTO `sys_loginlog` VALUES (133, 11, '122.96.147.111', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-07 19:24:59');
INSERT INTO `sys_loginlog` VALUES (134, 11, '122.96.147.111', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-08 10:24:52');
INSERT INTO `sys_loginlog` VALUES (135, 11, '122.96.147.111', '中国', '江苏省', '南京市', '秦淮区', '中国联通', NULL, NULL, '2025-03-08 19:49:48');
INSERT INTO `sys_loginlog` VALUES (136, 14, '221.226.158.155', '中国', '江苏省', '南京市', '玄武区', '中国电信', NULL, NULL, '2025-04-01 09:58:04');
INSERT INTO `sys_loginlog` VALUES (137, 14, '221.226.158.155', '中国', '江苏省', '南京市', '玄武区', '中国电信', NULL, NULL, '2025-04-01 09:58:53');
INSERT INTO `sys_loginlog` VALUES (138, 11, '221.226.158.155', '中国', '江苏省', '南京市', '玄武区', '中国电信', NULL, NULL, '2025-04-01 09:59:24');
INSERT INTO `sys_loginlog` VALUES (139, 11, '221.226.158.154', '中国', '江苏省', '南京市', '玄武区', '中国电信', NULL, NULL, '2025-04-02 14:02:06');
INSERT INTO `sys_loginlog` VALUES (140, 14, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-08-11 19:10:43');
INSERT INTO `sys_loginlog` VALUES (141, 14, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-08-13 10:26:48');
INSERT INTO `sys_loginlog` VALUES (142, 14, '122.96.44.112', '中国', '', '', '', '', NULL, NULL, '2025-08-27 11:36:59');
INSERT INTO `sys_loginlog` VALUES (143, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 11:46:36');
INSERT INTO `sys_loginlog` VALUES (144, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 11:51:53');
INSERT INTO `sys_loginlog` VALUES (145, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 11:54:26');
INSERT INTO `sys_loginlog` VALUES (146, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 13:38:44');
INSERT INTO `sys_loginlog` VALUES (147, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 13:48:17');
INSERT INTO `sys_loginlog` VALUES (148, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 13:51:43');
INSERT INTO `sys_loginlog` VALUES (149, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 14:04:43');
INSERT INTO `sys_loginlog` VALUES (150, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 14:08:32');
INSERT INTO `sys_loginlog` VALUES (151, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 14:12:56');
INSERT INTO `sys_loginlog` VALUES (152, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 14:31:03');
INSERT INTO `sys_loginlog` VALUES (153, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 14:36:07');
INSERT INTO `sys_loginlog` VALUES (154, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 16:27:48');
INSERT INTO `sys_loginlog` VALUES (155, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 16:46:48');
INSERT INTO `sys_loginlog` VALUES (156, 12, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 17:16:18');
INSERT INTO `sys_loginlog` VALUES (157, 14, '101.125.4.179', '中国', '', '', '', '', NULL, NULL, '2025-09-05 18:57:37');
INSERT INTO `sys_loginlog` VALUES (158, 14, '', '', '', '', '', '', '', '', '2025-09-18 16:10:04');
INSERT INTO `sys_loginlog` VALUES (159, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-23 10:05:37');
INSERT INTO `sys_loginlog` VALUES (160, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-23 10:06:00');
INSERT INTO `sys_loginlog` VALUES (161, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-23 10:17:10');
INSERT INTO `sys_loginlog` VALUES (162, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-23 16:23:55');
INSERT INTO `sys_loginlog` VALUES (163, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-24 17:23:06');
INSERT INTO `sys_loginlog` VALUES (164, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-25 11:50:09');
INSERT INTO `sys_loginlog` VALUES (165, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 14:13:20');
INSERT INTO `sys_loginlog` VALUES (166, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 15:50:38');
INSERT INTO `sys_loginlog` VALUES (167, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 16:36:51');
INSERT INTO `sys_loginlog` VALUES (168, 12, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:14:36');
INSERT INTO `sys_loginlog` VALUES (169, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:14:58');
INSERT INTO `sys_loginlog` VALUES (170, 12, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:16:27');
INSERT INTO `sys_loginlog` VALUES (171, 12, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:18:17');
INSERT INTO `sys_loginlog` VALUES (172, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:19:39');
INSERT INTO `sys_loginlog` VALUES (173, 12, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:21:43');
INSERT INTO `sys_loginlog` VALUES (174, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:43:32');
INSERT INTO `sys_loginlog` VALUES (175, 12, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 19:48:11');
INSERT INTO `sys_loginlog` VALUES (176, 14, '122.96.46.11', '中国', '江苏', '南京', '', 'CNC Group CHINA169 Jiangsu Province Network', '32.0589', '118.7738', '2025-09-26 20:02:04');
INSERT INTO `sys_loginlog` VALUES (177, 14, '113.200.204.154', '中国', '陕西', '西安', '', 'CNC Group CHINA169 Shannxi Province Network', '34.2635', '108.9246', '2025-10-10 17:25:31');
INSERT INTO `sys_loginlog` VALUES (178, 14, '113.200.204.154', '中国', '陕西', '西安', '', 'CNC Group CHINA169 Shannxi Province Network', '34.2635', '108.9246', '2025-10-10 19:04:02');

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `pid` int(11) NULL DEFAULT 0 COMMENT '父菜单ID',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '菜单名称',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '路由名称',
  `order_num` int(4) NULL DEFAULT 0 COMMENT '显示顺序',
  `path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '路由地址',
  `component` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '组件路径',
  `icon` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '菜单图标',
  `query` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '路由参数',
  `perms` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '权限标识',
  `type` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '菜单类型（M目录 C菜单 F按钮）',
  `is_frame` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '2' COMMENT '是否为外链（1是 2否）',
  `is_cache` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '2' COMMENT '是否缓存（1缓存 2不缓存）',
  `is_show` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '是否显示（1显示 2隐藏）',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '菜单状态（1开启 2停用）',
  `create_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 98 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '菜单权限表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES (5, 0, '网站信息', 'dashboard', 0, '/dashboard', '@/views/base/dashboard/index.vue', 'DataLine', NULL, '', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (6, 0, '站点管理', '', 0, '/site', '', 'Monitor', NULL, '', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (7, 6, '站点设置', 'siteinfo', 0, '/siteinfo', '@/views/cms/site/index.vue', '', NULL, 'api.site.query', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (8, 0, '内容管理', '', 0, '/content', '', 'Grid', NULL, '', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (9, 8, '栏目管理', 'category-index', 0, '/category', '@/views/cms/category/index.vue', '', NULL, 'api.category.list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (10, 9, '栏目新增', 'category-add', 0, '/category/add', '@/views/cms/category/add.vue', '', NULL, 'api:category:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (11, 9, '栏目修改', 'category-edit', 0, '/category/edit/:id', '@/views/cms/category/edit.vue', '', NULL, 'api:category.edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (12, 9, '栏目删除', '', 0, '', '', '', NULL, 'api:category:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (13, 9, '栏目查询', '', 0, '', '', '', NULL, 'api:category:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (14, 8, '文章管理', 'article-index', 0, '/article', '@/views/cms/article/index.vue', '', NULL, 'api:article:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (15, 14, '文章新增', 'article-add', 0, '/article/add', '@/views/cms/article/add.vue', '', NULL, 'api:article.add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (16, 14, '文章修改', 'article-edit', 0, '/article/edit/:id', '@/views/cms/article/edit.vue', '', NULL, 'api:article:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (17, 14, '文章删除', '', 0, '', NULL, '', NULL, 'api:article:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (18, 14, '文章查询', '', 0, '', NULL, '', NULL, 'api:article:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (19, 8, '轮播管理', 'slide-index', 0, '/slide', '@/views/cms/slide/index.vue', '', NULL, 'api:slide:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (20, 19, '轮播新增', 'slide-add', 0, '/slide/add', '@/views/cms/slide/add.vue', '', NULL, 'api:slide:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (21, 19, '轮播修改', 'slide-edit', 0, '/slide/edit/:id', '@/views/cms/slide/edit.vue', '', NULL, 'api:slide.edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (22, 19, '轮播删除', '', 0, '', NULL, '', NULL, 'api:slide:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (23, 19, '轮播查询', '', 0, '', NULL, '', NULL, 'api:slide:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (24, 8, '标签管理', 'tag-index', 0, '/tag', '@/views/cms/tag/index.vue', '', NULL, 'api:tag:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (25, 24, '标签新增', 'tag-add', 0, '/tag/add', '@/views/cms/tag/add.vue', '', NULL, 'api:tag:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (26, 24, '标签修改', 'tag-edit', 0, '/tag/edit/:id', '@/views/cms/tag/edit.vue', '', NULL, 'api:tag:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (27, 24, '标签删除', '', 0, '', NULL, '', NULL, 'api:tag:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (28, 24, '标签查询', '', 0, '', NULL, '', NULL, 'api:tag:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (29, 8, '碎片管理', 'frag-index', 0, '/frag', '@/views/cms/frag/index.vue', '', NULL, 'api:tag:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (30, 29, '碎片新增', 'frag-add', 0, '/frag/add', '@/views/cms/frag/add.vue', '', NULL, 'api:tag:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (31, 29, '碎片编辑', 'frag-edit', 0, '/frag/edit/:id', '@/views/cms/frag/edit.vue', '', NULL, 'api:tag:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (32, 29, '碎片删除', '', 0, '', NULL, '', NULL, 'api:tag:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (33, 29, '碎片查询', '', 0, '', NULL, '', NULL, 'api:tag:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (35, 45, '页面采集', 'collect-index', 0, '/collect', '@/views/cms/collect/index.vue', '', NULL, 'api:collect:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (36, 35, '采集新增', 'collect-add', 0, '/collect/add', '@/views/cms/collect/add.vue', '', NULL, 'api:collect:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (37, 35, '采集修改', 'collect-edit', 0, '/collect/:id', '@/views/cms/collect/edit.vue', '', NULL, 'api:collect:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (38, 35, '采集删除', '', 0, '', NULL, '', NULL, 'api:collect:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (39, 35, '采集查询', '', 0, '', NULL, '', NULL, 'api:collect:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (40, 45, '接口采集', 'gather-index', 0, '/gather', '@/views/cms/gather/index.vue', '', NULL, 'api:gather:index', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (41, 40, '采集新增', 'gather-add', 0, '/gather/add', '@/views/cms/gather/add.vue', '', NULL, 'api:gather:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (42, 40, '采集修改', 'gather-edit', 0, '/gather/edit/:id', '@/views/cms/gather/edit.vue', '', NULL, 'api:gather:eidt', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (43, 40, '采集删除', '', 0, '', NULL, '', NULL, 'api:gather:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (44, 40, '采集查询', '', 0, '', NULL, '', NULL, 'api:gather:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (45, 0, '功能管理', '', 0, '/extend', NULL, 'Operation', NULL, NULL, 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (46, 45, '模型管理', 'model-index', 0, '/model', '@/views/cms/model/index.vue', '', NULL, 'api:model:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (47, 46, '模型新增', 'model-add', 0, '/model/add', '@/views/cms/model/add.vue', '', NULL, 'api:model:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (48, 46, '模型修改', 'model-edit', 0, '/model/edit/:id', '@/views/cms/model/edit.vue', '', NULL, 'api:model:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (49, 46, '模型删除', '', 0, '', NULL, '', NULL, 'api:model:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (50, 46, '模型查询', '', 0, '', NULL, '', NULL, 'api:model:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (51, 46, '字段管理', 'field-index', 0, '/model/field', '@/views/cms/field/index.vue', '', NULL, 'api:field:list', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (52, 51, '字段新增', 'field-add', 0, '/model/field/add', '@/views/cms/field/add.vue', '', NULL, 'api:field:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (53, 51, '字段修改', 'field-edit', 0, '/model/field/edit', '@/views/cms/field/edit.vue', '', NULL, 'api:field:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (54, 51, '字段删除', '', 0, '', NULL, '', NULL, 'api:field:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (55, 51, '字段查询', '', 0, '', NULL, '', NULL, 'api:field:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (56, 8, '友情链接', 'friendlink-index', 0, '/friendlink', '@/views/cms/friendlink/index.vue', '', NULL, 'api:friendlink:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (57, 56, '友链新增', 'friendlink-add', 0, '/friendlink/add', '@/views/cms/friendlink/add.vue', '', NULL, 'api:friendlink:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (58, 56, '友链修改', 'friendlink-edit', 0, '/friendlink/edit/:id', '@/views/cms/friendlink/edit.vue', '', NULL, 'api:friendlink:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (59, 56, '友链删除', '', 0, '', NULL, '', NULL, 'api:friendlink:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (60, 56, '友链查询', '', 0, '', NULL, '', NULL, 'api:friendlink:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (61, 8, '消息管理', 'message-index', 0, '/message', '@/views/cms/message/index.vue', '', NULL, 'api:message:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (62, 61, '消息新增', 'message-add', 0, '/message/add', '@/views/cms/message/add.vue', '', NULL, 'api:message:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (63, 61, '消息修改', 'message-edit', 0, '/message/edit/:id', '@/views/cms/message/edit.vue', '', NULL, 'api:message:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (64, 61, '消息删除', '', 0, '', NULL, '', NULL, 'api:message:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (65, 61, '消息查询', '', 0, '', NULL, '', NULL, 'api:message:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (66, 0, '系统管理', '', 0, '/sys', '', 'Setting', NULL, NULL, 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (67, 66, '用户管理', 'user-index', 0, '/user', '@/views/base/user/index.vue', '', NULL, 'api:user:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (68, 67, '用户新增', 'user-add', 0, '/user/add', '@/views/base/user/add.vue', '', NULL, 'api:user:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (69, 67, '用户修改', 'user-edit', 0, '/user/edit/:id', '@/views/base/user/edit.vue', '', NULL, 'api:user:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (70, 67, '用户删除', '', 0, '', NULL, '', NULL, 'api:user:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (71, 67, '用户查询', '', 0, '', NULL, '', NULL, 'api:user:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (72, 66, '角色管理', 'role-index', 0, '/role', '@/views/base/role/index.vue', '', NULL, 'api:role:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (73, 72, '角色新增', 'role-add', 0, '/role/add', '@/views/base/role/add.vue', '', NULL, 'api:role:add', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (74, 72, '角色编辑', 'role-edit', 0, '/role/edit/:id', '@/views/base/role/edit.vue', '', NULL, 'api:role:edit', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (75, 72, '角色删除', '', 0, '', NULL, '', NULL, 'api.role.del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (76, 72, '角色查询', '', 0, '', NULL, '', NULL, 'api:role.query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (77, 66, '菜单管理', 'menu', 0, '/menu', '@/views/base/menu/index.vue', '', NULL, 'api:menu:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (78, 77, '菜单新增', '', 0, '', NULL, '', NULL, 'api:menu:add', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (79, 77, '菜单修改', '', 0, '', NULL, '', NULL, 'api:menu:edit', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (80, 77, '菜单删除', '', 0, '', NULL, '', NULL, 'api:menu:del', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (81, 77, '菜单查询', '', 0, '', NULL, '', NULL, 'api:menu:query', 'F', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (82, 66, '登录日志', 'loginlog', 0, '/loginlog', '@/views/cms/loginlog/index.vue', '', NULL, 'api:menu:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (83, 6, '站点更新', '', 0, '', '', '', NULL, 'api:info:edit', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (84, 66, '配置字典', 'configtype', 0, '/configtype', '@/views/base/config-type/index.vue', '', NULL, 'api:configtype:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (85, 84, '配置列表', 'config', 0, '/configtype/:id', '@/views/base/config/index.vue', '', NULL, 'api:config:list', 'C', '2', '2', '2', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (86, 84, '字典新增', '', 0, '', '', '', NULL, 'api:configtype:add', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (87, 84, '字典修改', '', 0, '', '', '', NULL, 'api:configtype:edit', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (88, 84, '字典删除', '', 0, '', '', '', NULL, 'api:configtype:del', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (89, 84, '字典查询', '', 0, '', '', '', NULL, 'api:configtype:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (90, 85, '新增配置', '', 0, '', '', '', NULL, 'api:config.add', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (91, 85, '配置修改', '', 0, '', '', '', NULL, 'api:config:edit', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (92, 85, '配置删除', '', 0, '', '', '', NULL, 'api:config:del', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (93, 85, '配置查询', '', 0, '', '', '', NULL, 'api:config:list', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (94, 0, '资源管理', 'resource', 0, '/resource', '', 'Postcard', NULL, 'api:resource:all', 'M', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (95, 94, '前端模板', 'template', 0, '/template', '@/views/vip/codeEditor/index.vue', '', NULL, 'api:template:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (96, 95, '模板更新', 'template-edit', 0, '', '', '', NULL, 'api:template:update', 'F', '2', '2', '1', NULL, '', NULL, '', NULL, '');
INSERT INTO `sys_menu` VALUES (97, 94, '附件管理', '', 0, '/upload', '@/views/vip/data.vue', '', NULL, 'api:upload:list', 'C', '2', '2', '1', NULL, '', NULL, '', NULL, '');

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice`  (
  `id` int(4) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告标题',
  `type` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告类型（1通知 2公告）',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '公告内容',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '公告状态（0关闭  1正常）',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `createdAt` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updatedAt` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '通知公告表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_notice
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色名称',
  `key` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '角色权限字符串(super/admin)',
  `sort` int(4) NOT NULL COMMENT '显示顺序',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '1' COMMENT '角色状态（1正常 2停用）',
  `del_flag` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '1' COMMENT '删除标志（1代表存在 2代表删除）',
  `create_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES (7, '超级管理员', 'super', 0, '1', '1', '', NULL, '', NULL, NULL);
INSERT INTO `sys_role` VALUES (8, '普通管理员', 'admin', 0, '1', '1', '', NULL, '', NULL, NULL);
INSERT INTO `sys_role` VALUES (9, '游客', 'visitor', 0, '1', '1', '', NULL, '', NULL, NULL);

-- ----------------------------
-- Table structure for sys_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menu`;
CREATE TABLE `sys_role_menu`  (
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `menu_id` int(11) NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '角色和菜单关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_role_menu
-- ----------------------------
INSERT INTO `sys_role_menu` VALUES (7, 5);
INSERT INTO `sys_role_menu` VALUES (7, 6);
INSERT INTO `sys_role_menu` VALUES (7, 7);
INSERT INTO `sys_role_menu` VALUES (7, 8);
INSERT INTO `sys_role_menu` VALUES (7, 9);
INSERT INTO `sys_role_menu` VALUES (7, 10);
INSERT INTO `sys_role_menu` VALUES (7, 11);
INSERT INTO `sys_role_menu` VALUES (7, 12);
INSERT INTO `sys_role_menu` VALUES (7, 13);
INSERT INTO `sys_role_menu` VALUES (7, 14);
INSERT INTO `sys_role_menu` VALUES (7, 15);
INSERT INTO `sys_role_menu` VALUES (7, 16);
INSERT INTO `sys_role_menu` VALUES (7, 17);
INSERT INTO `sys_role_menu` VALUES (7, 18);
INSERT INTO `sys_role_menu` VALUES (7, 19);
INSERT INTO `sys_role_menu` VALUES (7, 20);
INSERT INTO `sys_role_menu` VALUES (7, 21);
INSERT INTO `sys_role_menu` VALUES (7, 22);
INSERT INTO `sys_role_menu` VALUES (7, 23);
INSERT INTO `sys_role_menu` VALUES (7, 24);
INSERT INTO `sys_role_menu` VALUES (7, 25);
INSERT INTO `sys_role_menu` VALUES (7, 26);
INSERT INTO `sys_role_menu` VALUES (7, 27);
INSERT INTO `sys_role_menu` VALUES (7, 28);
INSERT INTO `sys_role_menu` VALUES (7, 29);
INSERT INTO `sys_role_menu` VALUES (7, 30);
INSERT INTO `sys_role_menu` VALUES (7, 31);
INSERT INTO `sys_role_menu` VALUES (7, 32);
INSERT INTO `sys_role_menu` VALUES (7, 33);
INSERT INTO `sys_role_menu` VALUES (7, 35);
INSERT INTO `sys_role_menu` VALUES (7, 36);
INSERT INTO `sys_role_menu` VALUES (7, 37);
INSERT INTO `sys_role_menu` VALUES (7, 38);
INSERT INTO `sys_role_menu` VALUES (7, 39);
INSERT INTO `sys_role_menu` VALUES (7, 40);
INSERT INTO `sys_role_menu` VALUES (7, 41);
INSERT INTO `sys_role_menu` VALUES (7, 42);
INSERT INTO `sys_role_menu` VALUES (7, 43);
INSERT INTO `sys_role_menu` VALUES (7, 44);
INSERT INTO `sys_role_menu` VALUES (7, 45);
INSERT INTO `sys_role_menu` VALUES (7, 46);
INSERT INTO `sys_role_menu` VALUES (7, 47);
INSERT INTO `sys_role_menu` VALUES (7, 48);
INSERT INTO `sys_role_menu` VALUES (7, 49);
INSERT INTO `sys_role_menu` VALUES (7, 50);
INSERT INTO `sys_role_menu` VALUES (7, 51);
INSERT INTO `sys_role_menu` VALUES (7, 52);
INSERT INTO `sys_role_menu` VALUES (7, 53);
INSERT INTO `sys_role_menu` VALUES (7, 54);
INSERT INTO `sys_role_menu` VALUES (7, 55);
INSERT INTO `sys_role_menu` VALUES (7, 56);
INSERT INTO `sys_role_menu` VALUES (7, 57);
INSERT INTO `sys_role_menu` VALUES (7, 58);
INSERT INTO `sys_role_menu` VALUES (7, 59);
INSERT INTO `sys_role_menu` VALUES (7, 60);
INSERT INTO `sys_role_menu` VALUES (7, 61);
INSERT INTO `sys_role_menu` VALUES (7, 62);
INSERT INTO `sys_role_menu` VALUES (7, 63);
INSERT INTO `sys_role_menu` VALUES (7, 64);
INSERT INTO `sys_role_menu` VALUES (7, 65);
INSERT INTO `sys_role_menu` VALUES (7, 66);
INSERT INTO `sys_role_menu` VALUES (7, 67);
INSERT INTO `sys_role_menu` VALUES (7, 68);
INSERT INTO `sys_role_menu` VALUES (7, 69);
INSERT INTO `sys_role_menu` VALUES (7, 70);
INSERT INTO `sys_role_menu` VALUES (7, 71);
INSERT INTO `sys_role_menu` VALUES (7, 72);
INSERT INTO `sys_role_menu` VALUES (7, 73);
INSERT INTO `sys_role_menu` VALUES (7, 74);
INSERT INTO `sys_role_menu` VALUES (7, 75);
INSERT INTO `sys_role_menu` VALUES (7, 76);
INSERT INTO `sys_role_menu` VALUES (7, 77);
INSERT INTO `sys_role_menu` VALUES (7, 78);
INSERT INTO `sys_role_menu` VALUES (7, 79);
INSERT INTO `sys_role_menu` VALUES (7, 80);
INSERT INTO `sys_role_menu` VALUES (7, 81);
INSERT INTO `sys_role_menu` VALUES (7, 82);
INSERT INTO `sys_role_menu` VALUES (7, 83);
INSERT INTO `sys_role_menu` VALUES (7, 84);
INSERT INTO `sys_role_menu` VALUES (7, 85);
INSERT INTO `sys_role_menu` VALUES (7, 86);
INSERT INTO `sys_role_menu` VALUES (7, 87);
INSERT INTO `sys_role_menu` VALUES (7, 88);
INSERT INTO `sys_role_menu` VALUES (7, 89);
INSERT INTO `sys_role_menu` VALUES (7, 90);
INSERT INTO `sys_role_menu` VALUES (7, 91);
INSERT INTO `sys_role_menu` VALUES (7, 92);
INSERT INTO `sys_role_menu` VALUES (7, 93);
INSERT INTO `sys_role_menu` VALUES (7, 94);
INSERT INTO `sys_role_menu` VALUES (7, 95);
INSERT INTO `sys_role_menu` VALUES (7, 96);
INSERT INTO `sys_role_menu` VALUES (7, 97);
INSERT INTO `sys_role_menu` VALUES (8, 5);
INSERT INTO `sys_role_menu` VALUES (8, 6);
INSERT INTO `sys_role_menu` VALUES (8, 7);
INSERT INTO `sys_role_menu` VALUES (9, 5);
INSERT INTO `sys_role_menu` VALUES (9, 7);
INSERT INTO `sys_role_menu` VALUES (9, 13);
INSERT INTO `sys_role_menu` VALUES (9, 18);
INSERT INTO `sys_role_menu` VALUES (9, 23);
INSERT INTO `sys_role_menu` VALUES (9, 28);
INSERT INTO `sys_role_menu` VALUES (9, 33);
INSERT INTO `sys_role_menu` VALUES (9, 39);
INSERT INTO `sys_role_menu` VALUES (9, 44);
INSERT INTO `sys_role_menu` VALUES (9, 50);
INSERT INTO `sys_role_menu` VALUES (9, 55);
INSERT INTO `sys_role_menu` VALUES (9, 60);
INSERT INTO `sys_role_menu` VALUES (9, 65);
INSERT INTO `sys_role_menu` VALUES (9, 71);
INSERT INTO `sys_role_menu` VALUES (9, 76);
INSERT INTO `sys_role_menu` VALUES (9, 81);
INSERT INTO `sys_role_menu` VALUES (9, 82);
INSERT INTO `sys_role_menu` VALUES (9, 89);
INSERT INTO `sys_role_menu` VALUES (9, 93);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录账号',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '用户昵称',
  `password` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '盐加密',
  `avatar` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '头像路径',
  `sex` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '用户性别（0男 1女 2未知）',
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '用户邮箱',
  `phonenumber` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '手机号码',
  `login_ip` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '最后登录IP',
  `login_date` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `create_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '创建者',
  `create_time` datetime NULL DEFAULT NULL COMMENT '创建时间',
  `update_by` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '' COMMENT '更新者',
  `update_time` datetime NULL DEFAULT NULL COMMENT '更新时间',
  `pwd_update_date` datetime NULL DEFAULT NULL COMMENT '密码最后更新时间',
  `status` char(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '帐号状态（0正常 1停用）',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES (11, '张三', '', '$2a$10$P2KJwlUv/88rqcMVCEgOiO2B0tRWxlJ0T2/LMn1vJmbATtNhOBBQe', '', '', '0', '', '', '', NULL, '', NULL, '', NULL, NULL, '1', NULL);
INSERT INTO `sys_user` VALUES (12, 'admin', '', '$2b$12$XMSHDWWlBtwfN9P.6QMrgOetyhS65Ew8COrIVYbovkf9yM8PIIYHW', '', '', '0', '', '', '', NULL, '', NULL, '', NULL, NULL, '1', NULL);
INSERT INTO `sys_user` VALUES (14, 'chancms', '', '$2a$10$Wxkz0GhriYPAXfBxQjQkJ.5ZHs51qYT/JCAZRYQHguManQuFbh1Z.', '', '', '0', '', '', '', NULL, '', NULL, '', NULL, NULL, '1', NULL);

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role`  (
  `user_id` int(11) NOT NULL COMMENT '用户ID',
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户和角色关联表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
INSERT INTO `sys_user_role` VALUES (11, 7);
INSERT INTO `sys_user_role` VALUES (12, 9);
INSERT INTO `sys_user_role` VALUES (14, 7);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '密码',
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '0' COMMENT '性别（0-未知 1-男 2-女 ）',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `wechat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '微信',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '电话号码',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '头像',
  `status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '状态 1-启用 2-关闭',
  `login_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '登录ip',
  `login_date` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后一次登录时间',
  `pwd_update_date` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后一次修改密码时间',
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册日期',
  `updated_at` datetime NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  UNIQUE INDEX `user_email`(`email`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10000013 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员表(核心)' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (10000002, 'yanyutao', '$2b$12$skddevyQ3k16YC4.YLEj7OxRvrOnnuhoOuGEUS4dE7XthgwqAf/oK', '1', '867528315@qq.com', 'yanyutao2014', '13366826071', NULL, NULL, NULL, '2025-09-18 15:07:30', '2025-09-18 15:07:30', '2025-09-11 19:16:00', '2025-09-18 15:07:30', '凡有所相，皆为虚妄1234');
INSERT INTO `user` VALUES (10000003, 'zhangyong', '$2b$12$7nPtIZ9upiEUiRftPipqmOX7mi1/QCfvbmyJ9YStHzZGUgCkVngqG', '0', 'zhangyong_1430@163.com', NULL, NULL, NULL, NULL, NULL, '2025-09-12 09:47:00', '2025-09-12 09:47:00', '2025-09-12 09:47:00', '2025-09-12 09:47:00', NULL);
INSERT INTO `user` VALUES (10000011, 'yanyutao1', '$2b$12$pQ1uUgg9ySD93fxtFPoJl.GHduP/6djp2xuc22Ni1xs/zWSjV/opO', '0', '8675283151@qq.com', NULL, NULL, NULL, NULL, NULL, '2025-09-12 11:31:44', '2025-09-12 11:31:44', '2025-09-12 11:31:44', '2025-09-12 11:31:44', NULL);
INSERT INTO `user` VALUES (10000012, 'yanyutao2023', '$2b$12$oXfmsnZLyxzq.199E9VA3O1YSpK1Xz6CWvvmoHGi48AdFM3uXZ2aK', '0', 'yanyutao2023@163.com', NULL, NULL, NULL, NULL, NULL, '2025-09-26 13:37:10', '2025-09-26 13:37:10', '2025-09-26 13:37:10', '2025-09-26 13:37:10', NULL);

-- ----------------------------
-- Table structure for user_level
-- ----------------------------
DROP TABLE IF EXISTS `user_level`;
CREATE TABLE `user_level`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '等级代码 super0注册 super1 月 super2 季  super3年 super9永久会员',
  `level_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '等级显示名称',
  `days_valid` int(11) NULL DEFAULT NULL COMMENT '有效天数（null表示永久）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `level_code`(`level_code`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员等级' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_level
-- ----------------------------

-- ----------------------------
-- Table structure for user_levelship
-- ----------------------------
DROP TABLE IF EXISTS `user_levelship`;
CREATE TABLE `user_levelship`  (
  `user_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`user_id`) USING BTREE,
  INDEX `level_id`(`level_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '会员等级关系(核心)' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_levelship
-- ----------------------------

-- ----------------------------
-- Table structure for user_order
-- ----------------------------
DROP TABLE IF EXISTS `user_order`;
CREATE TABLE `user_order`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `order_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_id` int(11) NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `payment_method` enum('alipay') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'alipay',
  `status` enum('pending','paid','expired','refunded') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  `paid_at` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_no`(`order_no`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `product_id`(`product_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_order
-- ----------------------------

-- ----------------------------
-- Table structure for user_product
-- ----------------------------
DROP TABLE IF EXISTS `user_product`;
CREATE TABLE `user_product`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '产品名称（月/季/年会员）',
  `price` decimal(10, 2) NOT NULL COMMENT '价格',
  `level_id` int(11) NOT NULL COMMENT '关联的会员等级',
  `duration_days` int(255) NULL DEFAULT NULL COMMENT '有效天数',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
  `status` enum('active','inactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'active',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `level_id`(`level_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '产品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_product
-- ----------------------------

-- ----------------------------
-- Table structure for user_reading_record
-- ----------------------------
DROP TABLE IF EXISTS `user_reading_record`;
CREATE TABLE `user_reading_record`  (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `article_id` int(11) NOT NULL,
  `read_time` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  INDEX `article_id`(`article_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '阅读记录表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_reading_record
-- ----------------------------

-- ----------------------------
-- Table structure for user_social_login
-- ----------------------------
DROP TABLE IF EXISTS `user_social_login`;
CREATE TABLE `user_social_login`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT '用户id',
  `platform` enum('wechat','qq') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '平台',
  `openid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `unionid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `created_at` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `platform`(`platform`, `openid`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '第三方登录' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_social_login
-- ----------------------------

-- ----------------------------
-- Table structure for user_verification_codes
-- ----------------------------
DROP TABLE IF EXISTS `user_verification_codes`;
CREATE TABLE `user_verification_codes`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '邮箱地址',
  `code` char(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '6位验证码',
  `status` tinyint(4) NOT NULL DEFAULT 1 COMMENT '1-未使用\r\n2-已使用 3-已过期',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `expires_at` datetime NULL DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `udx_email_scene`(`email`) USING BTREE,
  INDEX `idx_status`(`status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_verification_codes
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
