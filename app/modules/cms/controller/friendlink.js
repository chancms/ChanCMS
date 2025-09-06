import dayjs from "dayjs";
const {
  common: {
    success
  },
} = Chan;
import friendlink from "../service/friendlink.js";
let FriendlinkController  = {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      body.createdAt = dayjs(body.createdAt).format("YYYY-MM-DD HH:mm:ss");
      const data = await friendlink.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await friendlink.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await friendlink.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async find(req, res, next) {
    try {
      const { id } = req.query;
      const data = await friendlink.find(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await friendlink.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 10 } = req.query;
      const data = await friendlink.search(keyword, cur, pageSize);
      data.forEach((ele) => {
        ele.createdAt = dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const cur = req.query.cur;
      const pageSize = 10;
      const data = await friendlink.list(cur, pageSize);
      data.list.forEach((ele) => {
        ele.createdAt = dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default FriendlinkController;
