import dayjs from "dayjs";
import * as cheerio from "cheerio";
import {safeExecuteUserFunction,isValidTargetUrl} from "../../../middleware/guard.js";
const {
  common: {
    success ,
  },
} = Chan;

import collect from "../service/collect.js";

let CollectController  = {

  async getPages(req, res, next) {
    try {
      let arr = [];
      const { targetUrl, listTag, charset } = req.body;
       if (!isValidTargetUrl(targetUrl)) {
          return "不允许访问的目标地址";
      }
      const data = await collect.common(targetUrl, charset);
      const $ = cheerio.load(data.toString(), { decodeEntities: false });
      $(`${listTag}`).each(function () {
        arr.push($(this).attr("href"));
      });
      res.json({ ...success, data: arr });
    } catch (error) {
      next(error);
    }
  },

  //测试列表所有地址
  async getArticle(req, res, next) {
    try {
      const { taskUrl, titleTag, articleTag, parseData, charset } = req.body;
      const dataStr = await collect.common(taskUrl, charset);
      const $ = cheerio.load(dataStr.toString(), { decodeEntities: false });
      const title = $(`${titleTag}`).text().trim();
      let str = safeExecuteUserFunction(parseData)

      let run = new Function(`data`, str);

      let data = $(`${articleTag}`).html();
      let dataend = run(data);
      res.json({ ...success, data: { title: title, article: dataend } });
    } catch (error) {
      next(error);
    }
  },

  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await collect.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await collect.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await collect.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await collect.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 10 } = req.query;
      const data = await collect.search(keyword, cur, pageSize);
      data.list.forEach((ele) => {
        ele.createdAt = dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 10 } = req.query;
      let data = await collect.list(cur, pageSize);
      data.list.forEach((ele) => {
        ele.updatedAt = dayjs(ele.updatedAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default CollectController;
