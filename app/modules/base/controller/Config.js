const {
  config,
  helper: {
     setToken, getToken,
    
  },
  common: {
    success, fail ,
  },
} = Chan;

import Config from "../service/Config.js";

let ConfigController =  {


  async list(req, res, next) {
    try {
      const query = req.query || {};
      const data = await Config.list({query});
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  async getlist(req, res, next) {
    try {
      const query = req.query || {};
      const data = await Config.list({query,field:["id","config_key","config_value"]});
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await Config.create(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      let {id} = req.query;
      const data = await Config.detail(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await Config.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const params = req.body;
      const data = await Config.update(params);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //批量更新
  async updateMany(req, res, next) {
   try {
    const params = req.body;
    const data = await Config.updateMany(params);
    res.json(data);
   } catch (err) {
     next(err);
   }
  }


}

export default ConfigController;
