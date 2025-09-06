const {
  common: {
    success, fail ,
  },
} = Chan;

import model from "../service/model.js";
let ModelController  = {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const has = await model.findByName(body.model, body.tableName);
      if (has.length > 0) {
        res.json({ ...fail, msg: "模型命名已重复" });
        return;
      }
      const data = await model.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const body = req.body;
      const data = await model.delete(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await model.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await model.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 是否被使用
  async hasUse(req, res, next) {
    try {
      const { id } = req.query;
      const data = await model.hasUse(id);
      res.json({ ...success, data: data[0] });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 10 } = req.query;
      const data = await model.list(cur, pageSize);
      res.json({ ...success, data });
    } catch (err) {
      next(err);
    }
  }
}

export default ModelController;
