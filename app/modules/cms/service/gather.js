const {
  helper: { request },
} = Chan;
import { isValidTargetUrl } from "../../../middleware/guard.js";

class GatherService extends Chan.Service {
  constructor() {
    super(Chan.knex, "plus_gather");
  }

  async common(url) {
    try {
      if (!isValidTargetUrl(url)) {
        return "不允许访问的目标地址";
      }
      const res = await request(url);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 增加
  async create(body) {
    try {
      const res = await this.insert(body);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 删
  async delete(id) {
    try {
      const res = await super.delete({ id });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 修改
  async update(body) {
    const { id, ...params } = body;
    try {
      const res = await super.update({ query: { id }, params });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 获取全量gather，默认100个cur = 1,
  async list(cur = 1, pageSize = 100) {
    try {
      let res = await this.query({
        current: cur,
        pageSize: pageSize,
        query: {},
        field: ["*"],
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 查
  async detail(id) {
    try {
      const res = await this.findById({
        query: { id },
        field: ["*"],
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 搜索
  async search(key = "", cur = 1, pageSize = 10) {
    try {
      let res = await this.query({
        current: cur,
        pageSize: pageSize,
        query: key ? { taskName: { like: `%${key}%` } } : {},
        field: ["*"],
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new GatherService();
