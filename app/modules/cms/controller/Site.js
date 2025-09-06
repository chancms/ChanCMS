const {
 
  common: {
    success, fail ,
  },
  config
} = Chan;
import Site from "../service/Site.js";
let SiteController = {
  // 查
  async info(req, res, next) {
    try {
      const data = await Site.info();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await Site.updateInfo(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },


  // 获取磁盘信息
  async runEnv(req, res, next) {
    try {
      res.json({ ...success, data: { dirname: ROOT_PATH } });
    } catch (err) {
      next(err);
    }
  }
}

export default SiteController;
