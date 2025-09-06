import dayjs from "dayjs";
const {
  config,
  helper: {
    setToken, getToken, 
  },
  common: {
    success, fail ,
  },
} = Chan;
import SysUser from "../service/SysUser.js";
import SysMenu from "../service/SysMenu.js";
import bcrypt from "bcryptjs";
let SysUserController = {
  async login(req, res, next) {
    try {
      let { username, password } = req.body;
      const result = await SysUser.find(username);
      if (result.code == 200 && Object.keys(result.data).length > 0) {
        let user = result.data;
        if (!user.id) {
          res.json({ ...fail, msg: "用户名或密码错误！" });
          return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (user && match) {
          const { id, status } = user;
          // 设置token
          const token = setToken(
            { uid: id, username },
            config.JWT_SECRET,
            config.JWT_EXPIRES_IN
          );
          const data = { status, username, token };
          // 获取用户菜单
          const menus = await SysMenu.allRouter(id);

          res.json({ ...success, data: data, menus });
        } else {
          res.json({ ...fail, msg: "用户名或密码错误！" });
        }
      } else {
        res.json(result);
      }
    } catch (err) {
      res.json({ ...fail, msg: "用户名或密码错误！" });
      console.error("SysUserController.login-->", err);
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const query = req.query || {};
      const data = await SysUser.list(query);
      res.json({ ...success, data });
    } catch (err) {
      next(err);
    }
  },
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      body.password = await bcrypt.hash(body.password, parseInt(config.PASSWORD_SALT));
      const data = await SysUser.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
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
      const data = await SysUser.detail(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await SysUser.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      let { userId, username, status, role_id, password } = req.body;
      let params = { userId, username, status, role_id };
      if (password) {
        password = await bcrypt.hash(password, parseInt(config.PASSWORD_SALT));
        params.password = password;
      }
      const data = await SysUser.update(params);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default SysUserController;
