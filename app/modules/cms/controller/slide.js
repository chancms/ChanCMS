import dayjs from "dayjs";
const {
  common: {
    success, fail ,
  },
} = Chan;

import slide from "../service/slide.js";
let SlideController = {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await slide.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await slide.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await slide.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await slide.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, cid = 0, pageSize = 10 } = req.query;
      const data = await slide.search(keyword, cur, pageSize, +cid);
      data.list.forEach((ele) => {
        ele.updatedAt = dayjs(ele.updatedAt).format("YYYY-MM-DD HH:mm:ss");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, cid = 0, pageSize = 10 } = req.query;
      const data = await slide.list(cur, pageSize, cid);
      data.list.forEach((ele) => {
        ele.updatedAt = dayjs(ele.updatedAt).format("YYYY-MM-DD HH:mm:ss");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 上传图片
  async upload(req, res, next) {
    try {
      let file = req.files;
      const { originalname, filename, path } = file[0];
      res.json({
        ...success,
        data: {
          link: path.replace("app", ""),
          domain: req.hostname,
          originalname,
          filename,
          path: "/" + path.replace(/\\/g, "/").replace(/^app\//, ""),
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default SlideController;
