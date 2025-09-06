const {
  config,
  helper: {
    getToken,
  },
  common: {
    success, fail ,
  },
} = Chan;
import SysRole from "../service/SysRole.js";

let SysRoleController = {

  async list(req, res, next) {
    try {
      const query = req.query;
      const data = await SysRole.list(query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // 增
  async create(req, res, next) {
    try {
      const { roleData, menuIds } = req.body;
      const data = await SysRole.create({ roleData, menuIds });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await SysRole.detail(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await SysRole.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      let { roleId, roleData, menuIds} = req.body
      const data = await SysRole.update({ roleId, roleData, menuIds});
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default SysRoleController;
