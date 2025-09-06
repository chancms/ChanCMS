const {
  common: {
    success, fail ,
  },
} = Chan;
import tag from "../service/tag.js";
let tagController = {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await tag.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await tag.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await tag.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await tag.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 50 } = req.query;
      const data = await tag.list(cur, pageSize);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  async has(req, res, next) {
    try {
      const { path } = req.query;
      const data = await tag.has(path);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 10 } = req.query;
      const data = await tag.search(keyword, cur, pageSize);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default tagController;
