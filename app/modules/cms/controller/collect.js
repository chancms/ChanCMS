import dayjs from "dayjs";
import * as cheerio from "cheerio";
import { isValidTargetUrl } from "../../../middleware/guard.js";
import { cleanHtml } from "../../../middleware/clearhtml.js";
const {
  common: { success, fail },
} = Chan;

import collect from "../service/collect.js";

let CollectController = {
  async getPages(req, res, next) {
    try {
      let arr = [];
      /**
       * 获取目标网页中指定标签的所有链接
       * @param {Object} req - 请求对象，包含目标URL、列表标签和字符集
       * @param {string} req.body.targetUrl - 要抓取的目标网页URL
       * @param {string} req.body.listTag - 包含链接的HTML标签选择器
       * @param {string} req.body.charset - 网页字符编码
       * @param {Object} res - 响应对象
       * @param {Function} next - 错误处理中间件
       * @returns {Promise<void>} 返回包含链接数组的JSON响应
       * @throws {Error} 当目标URL无效或抓取过程中出错时抛出异常
       */
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
      const {
        taskUrl,
        titleTag,
        articleTag,
        parseData,
        charset = "utf8",
      } = req.body;

      // 1. 获取页面内容
      const dataStr = await collect.common(taskUrl, charset);
      const $ = cheerio.load(dataStr.toString(), { decodeEntities: false });

      // 2. 提取标题
      const title = $(titleTag).text().trim();

      // 3. 提取内容
      let $content = $(articleTag).clone();
      let html = $content.html();

      // 4. 应用清洗
      try {
        const cleanOptions = JSON.parse(parseData) || {};
      } catch (error) {
        console.log("error--->", error);
        return res.json({
          ...fail,
          msg: "清理配置非标准JSON",
          data: error.toString(),
        });
      }
      const cleanOptions = JSON.parse(parseData) || {};
      html = cleanHtml(html, cleanOptions);

      res.json({
        ...success,
        data: {
          title,
          article: html,
        },
      });
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
  },
};

export default CollectController;
