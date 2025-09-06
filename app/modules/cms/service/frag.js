const {
  knex,
 helper:{arrToObj},
} = Chan;

let model = "cms_frag";
let db = Chan.Service(knex, model);
const pageSize = 100;
let FragService = {

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

  // 获取全量frag，默认100个cur = 1,
  async list(pageSize = 100) {
    try {
      // 查询个数
      // const total = await knex(model).count('id', { as: 'count' });
      //  const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select(["name", "mark", "content"])
        .from(model)
        .limit(pageSize)
        // .offset(offset)
        .orderBy("id", "desc");

      const frags = arrToObj(list, "name","content");
      return frags;
      // const count = total[0].count || 1;
      // return {
      //   count: count,
      //   total: Math.ceil(count / pageSize),
      //   current: +cur,
      //   list: frags,
      // };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查
  async detail(id) {
    try {
      const data = await knex
        .select(["id", "name", "mark", "content", "type"])
        .from(model)
        .where("id", "=", id);
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

export default FragService;
