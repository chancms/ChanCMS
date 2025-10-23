import { p } from "../../../../public/admin/assets/js/@vue";

const { knex } = Chan;
const model = "cms_articletag";  // 改为const
const db = Chan.Service(knex, model);  // 改为const
const pageSize = 100;

const ArticleTagService = {
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
    const { id ,...params } = body;
    try {
      const result = await knex(model).where("id", "=", id).update(params);
      return result ? "success" : "fail";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 文章列表
  async list(cur = 1, pageSize = 10) {
    try {
      // 修正this.model为model，参数转为数字
      cur = Number(cur) || 1;
      pageSize = Number(pageSize) || 10;
      // 查询个数
      const total = await knex(model).count("id", { as: "count" });
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select("*")
        .from(model)  // 修复点：使用model变量
        .limit(pageSize)
        .offset(offset)
        .orderBy("id", "desc");
      const count = Number(total[0].count) || 0;  // 修复点：默认0且转为数字
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
      // 参数转为数字
      cur = Number(cur) || 1;
      pageSize = Number(pageSize) || 10;
      // 查询个数
      const total = key
        ? await knex(model)
            .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
            .count("id", { as: "count" })
        : await knex(model).count("id", { as: "count" });
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
      const count = Number(total[0].count) || 0;  // 修复点：默认0且转为数字
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
};

export default ArticleTagService;