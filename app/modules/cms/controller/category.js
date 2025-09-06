const {
  common: {
    success ,
  },
} = Chan;

import category from "../service/category.js";

let CategoryController = {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await category.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await category.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await category.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async find(req, res, next) {
    try {
      const data = await category.find();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 查
  async findId(req, res, next) {
    try {
      const { id } = req.query;
      const data = await category.findId(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查子栏目
  async findSubId(req, res, next) {
    try {
      const { id } = req.query;
      const data = await category.findSubId(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索栏目
  async search(req, res, next) {
    try {
      const { q } = req.query;
      const data = await category.search(q);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default CategoryController;
