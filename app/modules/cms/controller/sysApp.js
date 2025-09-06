import path from 'path';
import fs from 'fs';

const {
 
  common: {
    success ,
    getHtmlFilesSync
  },
} = Chan;
import sysApp from "../service/sysApp.js";
let SysAppController = {
  // 查
  async find(req, res, next) {
    try {
      const data = await sysApp.find();
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async getViews(req, res, next) {
    try {
      let _template = Chan.config.template;
      const viewsPath = path.join(APP_PATH, `/modules/web/view/${_template}`);
      const data = getHtmlFilesSync(viewsPath);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @description 获取模板文件
   */
  async folder(req, res, next) {
    try {
      const dir = path.join(APP_PATH, `/modules/web/view/`);
      const data = fs.readdirSync(dir);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // app配置
  // async config(req, res, next) {
  //   try {
  //     const data = await sysApp.config();
  //     res.json({ ...success, data: data });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await sysApp.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default SysAppController;