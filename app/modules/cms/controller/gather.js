import dayjs from "dayjs";
const {
  common: {
    success
  },
} = Chan;
import gather from "../service/gather.js";
let GatherController ={

  async getArticle(req, res, next) {
    try {
      const { targetUrl, parseData } = req.query;
      var data = await gather.common(targetUrl);
      let run = new Function(`data`, parseData);
      let dataend = run(data);
      res.json({ ...success, source: data, data: dataend });
    } catch (error) {
      next(error);
    }
  },

  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await gather.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await gather.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await gather.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await gather.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 10 } = req.query;
      const data = await gather.search(keyword, cur, pageSize);
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
      let data = await gather.list(cur, pageSize);
      data.list.forEach((ele) => {
        ele.updatedAt = dayjs(ele.updatedAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default GatherController;
