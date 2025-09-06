const {
  config,
  helper: { getToken},
  common: {
    success, fail ,
  },
} = Chan;
import SysMenu from "../service/SysMenu.js";
let SysMenuController = {
  async list(req, res, next) {
    try {
      const query = req.query;
      const data = await SysMenu.list(query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async allRouter(req, res, next) {
    try {
      let { id } = req.query;
      if (!id) {
        const token = req.cookies.token || req.headers.token;
        if (!token) {
          return res.json({ ...fail, msg: "请先登录" });
        }
        const user = await getToken(token, config.JWT_SECRET);
        id = user.uid;
      }
      const data = await SysMenu.allRouter(id);
      res.json({ ...success, data });
    } catch (err) {
      next(err);
    }
  },

  async allPerms(req, res, next) {
    try {
      let { id } = req.query;
      if (!id) {
        const token = req.cookies.token || req.headers.token;
        if (!token) {
          return res.json({ ...fail, msg: "请先登录" });
        }
        const user = await getToken(token, config.JWT_SECRET);
        id = user.uid;
      }
      const data = await SysMenu.allPerms(id);
      res.json({ ...success, data });
    } catch (err) {
      next(err);
    }
  },
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await SysMenu.create(body);
      res.json({ ...success, data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await SysMenu.detail(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await SysMenu.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await SysMenu.update(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
};

export default SysMenuController;
