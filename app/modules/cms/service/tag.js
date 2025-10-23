const { knex } = Chan;
let model = "cms_tag";
let db = Chan.Service(knex, model);
const pageSize = 100;
let TagService = {

  // 新增
  async create(body) {
    try {
      const result = await knex(model).insert(body);
      return result ? "success" : "fail";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async has(path) {
    const result = await knex(model)
      .where("path", "=", path)
      .select(["id"]);
    return result.length > 0;
  },

  // 删除tag ,需要删除cms_articleTag.js 里面的tid
  async delete(id) {
    try {
      const has = await knex.raw(
        `SELECT tid FROM cms_articletag WHERE tid = ?`,  // 使用?作为参数占位符
        [id]  // 参数单独传递
      );
      if (has[0].length > 0) {
        return false;
      }
      const res = await knex(model).where("id", "=", id).del();
      // res  返回值是 1
      return res ? "success" : "fail";
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
  async list(cur = 1, pageSize = 20) {
    try {
      // 查询个数
      const total = await knex(model).count("id", { as: "count" });
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select(["id", "name", "path"])
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
  },

  async hot(size = 20) {
    try {
      const list = await knex
        .select(["id", "name", "path", "count"])
        .from(model)
        .orderBy("count", "desc")
        .limit(size);
      return list;
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
    } catch (error) {
      console.error(error);
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

      const offset = parseInt((cur - 1) * pageSize);
      const list = key
        ? await knex
            .select(["id", "name", "path"])
            .from(model)
            .whereRaw("name COLLATE utf8mb4_general_ci LIKE ?", [`%${key}%`])
            .limit(pageSize)
            .offset(offset)
            .orderBy("id", "desc")
        : await knex
            .select(["id", "name", "path"])
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

export default TagService;
