import dayjs from "dayjs";
const {
  common: {
    success
  },
} = Chan;
import message from "../service/message.js";
let MessageController =  {
  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await message.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await message.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await message.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async find(req, res, next) {
    try {
      const { id } = req.query;
      const data = await message.find(id);
      data.createdAt = dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await message.detail(id);
      data.createdAt = dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 20 } = req.query;
      const data = await message.search(keyword, cur, pageSize);
      data.list.forEach((ele) => {
        ele.createdAt = dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 20 } = req.query;
      const data = await message.list(cur, pageSize);
      data.list.forEach((ele) => {
        ele.createdAt = dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default MessageController;
