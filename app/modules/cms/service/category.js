const { knex } = Chan;
import BaseService from "./base.js";

let model = "cms_category";
let db = Chan.Service(knex, model);
const pageSize = 100;

let CategoryService  = {
  // 增
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
      return { code: 200,data:result}
    } catch (err) {
      console.error(err);
      return {
        code: 500,
        msg: "删除失败",
        data: { sql: err.sql, sqlMessage: err.sqlMessage },
      };
    }
  },

  // 改
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

  // 查全部栏目
  async find() {
    try {
      const result = await db.all({"orderBy": "asc"});
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查栏目
  async findId(id) {
    try {
      const data = await knex(model)
        .where("id", "=", id)
        .select([
          "id",
          "pid",
          "seoTitle",
          "seoKeywords",
          "seoDescription",
          "name",
          "pinyin",
          "path",
          "description",
          "type",
          "url",
          "orderBy",
          "target",
          "status",
          "mid",
          "listView",
          "articleView",
        ]);
      return data[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查子栏目
  async findSubId(id) {
    try {
      const result = await knex(model).where("pid", "=", id).select();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 搜索栏目
  async search(key) {
    try {
      const result = key
        ? await knex(model)
            .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
            .orderBy("orderBy", "asc")
        : await knex(model).orderBy("orderBy", "asc");
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default CategoryService;
