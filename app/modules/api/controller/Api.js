const {
  helper: {
      tree 
  },
  common:{success,fail }
} = Chan;

import Site from "../../cms/service/Site.js";
import frag from "../../cms/service/frag.js";
import tag from "../../cms/service/tag.js";
import friendlink from "../../cms/service/friendlink.js";
import article from "../../cms/service/article.js"; 
import Api from "../service/Api.js"; 

// 获取站点信息
 export const site = async (req, res, next) => {
    try {
      const data = await Site.info();
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //碎片
 export const fragList = async(req, res, next) => {
    try {
      const data = await frag.list();
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //Tag标签
  export const getTag = async (req, res, next) => {
    try {
      const data = await tag.list();
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //友情链接
 export const getFriendlink = async (req, res, next) => {
    try {
      const data = await friendlink.list();
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //栏目
  export const category = async (req, res, next) => {
    try {
      const category = await Api.category();
      const nav = tree(category);
      res.json({ ...success, data: nav });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @param {Object} attr 1头条 2推荐 3轮播 4热门
   * @param {Object} len 查询个数
   * @param {Object} start 开始
   * @returns
   */
  export const getArticleList = async (req, res, next) => {
    try {
      const { attr, len, start } = req.query;
      let params = { attr, len: +len, start: +start };
      const data = await Api.getArticleList(params);
      res.json({ ...success, data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @param {Object} attr 1头条 2推荐 3轮播 4热门
   * @param {Object} len 查询个数
   * @param {Object} start 开始
   * @returns
   */
  export const getArticleListByCid = async (req, res, next) => {
    try {
      const { cid, attr, len } = req.query;
      let params = { cid, attr, len: +len };
      const data = await Api.getArticleListByCid(params);
      res.json({ ...success, data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 通过文章id查找对应的tag标签
   * @param {Object} aid 文章id
   */
 export const getArticleTag = async (req, res, next) => {
    try {
      const { id } = req.query;
      const data = await Api.getArticleTag(id);
      res.json({ ...success, data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 栏目列表
   * @param {Object} id 栏目id
   * @param {Object} current 当前页面
   * @param {Object} pageSize = 10 每页显示条数
   */
  export const list = async (req, res, next) => {
    try {
      const { id, current = 1, pageSize = 10 } = req.query;
      const data = await Api.list({ id, current, pageSize });
      res.json({ ...success, data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 栏目列表
   * @param {Object} id 栏目id
   * @param {Object} current 当前页面
   * @param {Object} pageSize = 10 每页显示条数
   */
  export const getArticle = async (req, res, next) => {
    try {
      const { id } = req.query;
      const data = await Api.article(id);
      res.json({ ...success, data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //banner轮播
  export const banner = async (req, res, next) => {
    try {
      const { cur = 1, pageSize = 10 } = req.query;
      const data = await Api.banner(cur, pageSize);
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //pv排行
  export const pv = async (req, res, next) => {
    try {
      const { id = 1, len = 10 } = req.query;
      const data = await Api.pv(len, id);
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 图文（带图文）
   * @param {Number|String} id 栏目id
   * @param {Number} len 默认10条
   * @param {*} attr 1头条 2推荐 3轮播 4热门
   */
  export const articleImg = async (req, res, next) => {
    try {
      const { id = "", attr = "", len = 10 } = req.query;
      const data = await Api.articleImg({ len, id, attr });
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //tag列表
  export const tagList = async (req, res, next) => {
    try {
      const { name = "", current = 1, pageSize = 10 } = req.query;
      const data = await Api.tagList({ name, current, pageSize });
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //上一页
  export const prev = async (req, res, next) => {
    try {
      const { id, cid } = req.query;
      const data = await Api.prev({ id, cid });
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  //下一页
 export const next = async (req, res, next) => {
    try {
      const { id, cid } = req.query;
      const data = await Api.next({ id, cid });
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 当前文章tag
   * @param {Object} id 文章id
   */
 export const getTagsById = async (req, res, next) => {
    try {
      const { id } = req.query;
      const data = await Api.getTagsById(id);
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 搜索
   * @param {Object} key 关键词
   * @param {Object} cur 当前页
   * @param {Object} pageSize 每页显示条数
   * @param {Object} cid 栏目id
   */
  export const search = async (req, res, next) => {
    try {
      const { key, cur, pageSize, cid } = req.query;
      const data = await Api.search(key, cur, pageSize, cid);
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  /**
   * @description 浏览次数增加
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
 export const pvadd = async (req, res, next) => {
    try {
      const { id } = req.query;
      const data = await Api.pvadd(id);
      res.json({ ...success, data: data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }


