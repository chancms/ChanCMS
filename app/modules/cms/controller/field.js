const {
  common: {
    success, fail
  },
} = Chan;
import field from "../service/field.js";
let FieldController  = {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const has = await field.findByName(body.cname, body.ename);
      if (has.length > 0) {
        res.json({ ...fail, msg: "字段命名已重复" });
        return;
      }
      const data = await field.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await field.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await field.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await field.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, mid, pageSize = 10 } = req.query;
      const data = await field.list(mid, cur, pageSize);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default FieldController;
