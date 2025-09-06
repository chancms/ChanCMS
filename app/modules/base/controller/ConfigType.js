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

import ConfigType from "../service/ConfigType.js";

let ConfigTypeController  = {


  async list(req, res, next) {
    try {
      const query = req.query || {};
      const data = await ConfigType.list(query);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await ConfigType.create(body);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      let {id} = req.query;
     
      const data = await ConfigType.detail(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await ConfigType.delete(id);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const params = req.body;
      const data = await ConfigType.update(params);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }


}

export default ConfigTypeController;
