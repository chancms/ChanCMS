import dayjs from "dayjs";
const {
  config: { EMAIL, USER_SALT, JWT_SECRET, JWT_EXPIRES_IN },
  helper: { setToken, getToken, genCode, LogError },
  common: { success, fail, genRegEmailHtml, genResetPasswordEmail, sendMail },
} = Chan;

import User from "../service/User.js";
import bcrypt from "bcryptjs";

let UserController = {
  async sendEmail(req, res, next) {
    const { email, code,type } = req.body;
    let emailcode = genCode(code, EMAIL.CODE);
    if(type === 'register'){
      await sendMail(email, "注册验证码", genRegEmailHtml(emailcode));
    }else{
      await sendMail(email, "修改密码验证码", genResetPasswordEmail(emailcode));
    }
    
    res.json({ ...success, data: "邮件发送成功" });
  },

  async login(req, res, next) {
    try {
      let { username, password, fp, ip } = req.body;
      const result = await User.findUser(username);
      if (result.data.total === 1) {
        let user = result.data.list[0];
        if (!user.id) {
          res.json({ ...fail, msg: "不存在此用户" });
          return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (user && match) {
          const { id, username, status } = user;
          // 设置token
          const token = setToken(
            { uid: id, fp, ip },
            JWT_SECRET,
            JWT_EXPIRES_IN
          );
          res.json({ ...success, data: { id, username, status, token } });
        } else {
          res.json({ ...fail, msg: "密码错误！" });
        }
      } else {
        res.json({ ...fail, msg: "用户不存在！" });
      }
    } catch (err) {
      res.json({ ...fail, msg: "登录异常，请稍后重试" });
      console.error("SysUserController.login-->", err);
      next(err);
    }
  },

  // 注册
  async register(req, res, next) {
    try {
      const { username, password, email } = req.body;
      let _password = await bcrypt.hash(password, parseInt(USER_SALT));
      const data = await User.create({ username, password: _password, email });
      if (data.code === 200) {
        res.json(data);
      } else {
        LogError(req, data);
        res.json(data);
      }
    } catch (err) {
      next(err);
    }
  },

  async checkEmail(req, res, next) {
    try {
      res.json({ ...success, data: "邮件发送成功" });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { uid } = req.user;
      const data = await User.detail(uid);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await User.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async resetPass(req, res, next) {
    try {
      const { email, password } = req.body;
      //判断邮箱是否存在
      let user = await User.find(email);
      if(user.code === 200 && user?.data?.list?.length > 0){
        let _password = await bcrypt.hash(password, parseInt(USER_SALT));
        let data = await User.update({ query: { email }, params:{password: _password} });
        res.json(data);
      }else{
        res.json({ ...fail, msg: "账号不存在！" });
      }
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      let { id, phone, remark, sex, wechat } = req.body;
      let query = { id };
      let params = { phone, remark, sex, wechat };
      const data = await User.update({query, params});
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async updatePass(req, res, next) {
    try {
      let { uid } = req.user;
      let { password,newPassword } = req.body;
      const result = await User.queryPass(uid);
      if (result.data.total === 1) {
        let user = result.data.list[0];
        const match = await bcrypt.compare(password, user.password);
        if(user && match){
          let _password = await bcrypt.hash(newPassword, parseInt(USER_SALT));
          let params = {password: _password}
          let query = {id: uid}
          const data = await User.update({query, params});
          res.json(data);
        }else{
          res.json({ ...fail, msg: "原密码错误！" });
        }
      }else{
        res.json({ ...fail, msg: "用户名或密码错误！" });
      }
    } catch (err) {
      next(err);
    }
  },
};

export default UserController;
