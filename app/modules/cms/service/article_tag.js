import BaseService from './base.js';
const { knex } = Chan;
let model = "cms_articletag";
let db = Chan.Service(knex, model);
const pageSize = 100;

let ArticleTagService = {
  // 新增
  async create(body) {
    try {
      const result = await db.insert(body);
      return result ? "success" : "fail";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 删
  async delete(id) {
    try {
      const result = await knex(model).where("id", "=", id).del();
      return result ? "success" : "fail";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 修改
  async update(body) {
    const { id } = body;
    delete body.id;
    try {
      const result = await knex(model).where("id", "=", id).update(body);
      return result ? "success" : "fail";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 文章列表
  async list(cur = 1, pageSize = 10) {
    try {
      // 查询个数
      const total = await knex(model).count("id", { as: "count" });
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select("*")
        .from(this.model)
        .limit(pageSize)
        .offset(offset)
        .orderBy("id", "desc");
      const count = total[0].count || 1;
      return {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查
  async detail(id) {
    try {
      const data = await knex(model).where("id", "=", id).select();
      return data[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 搜索
  async search(key = "", cur = 1, pageSize = 10) {
    try {
      // 查询个数
      const total = key
        ? await knex(model)
            .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
            .count("id", { as: "count" })
        : await knex(model).count("id", { as: "count" });
      // 查询个数
      const offset = parseInt((cur - 1) * pageSize);
      const list = key
        ? await knex
            .select(["id", "name", "mark"])
            .from(model)
            .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
            .limit(pageSize)
            .offset(offset)
            .orderBy("id", "desc")
        : await knex
            .select(["id", "name", "mark"])
            .from(model)
            .limit(pageSize)
            .offset(offset)
            .orderBy("id", "desc");
      const count = total[0].count || 1;
      return {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default ArticleTagService;
