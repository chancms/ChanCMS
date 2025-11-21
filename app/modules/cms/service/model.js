class ModelService extends Chan.Service {
  constructor() {
    super(Chan.knex, "cms_model");
  }

  // 增
  async create(body) {
    try {
      const { model, tableName, status, remark = "" } = body;
      await this.knex.transaction(async (trx) => {
        // 新建表
        const sql_create = `CREATE TABLE ${tableName} (
              id INT(11) NOT NULL AUTO_INCREMENT,
              aid INT(11) NOT NULL,
              PRIMARY KEY (id)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8mb4
            COLLATE=utf8mb4_general_ci
            COMMENT='${remark}'`;

        const createTableStatus = await this.knex
          .raw(sql_create, [])
          .transacting(trx);
        // 新增内容
        const sql_insert = `INSERT INTO cms_model (model,tableName,status,remark) VALUES(?,?,?,?)`;
        const result = await this.knex
          .raw(sql_insert, [model, tableName, status, remark])
          .transacting(trx);
        return {
          insertStatus: result[0],
          createTableStatus: createTableStatus[0],
        };
      });
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async hasUse(id) {
    try {
      const res = await this.knex
        .select(this.knex.raw("COUNT(*) as count"))
        .from("cms_article as a")
        .leftJoin("cms_category as c", "c.id", "a.cid")
        .where("c.mid", id)
        .first();

      return res.count > 0;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 删
  async delete(id) {
    try {
      const data = await Chan.knex(this.model).where("id", "=", id).first();
      if (!data) {
        return "fail";
      }
      const { tableName } = data;
      await Chan.knex.transaction(async (trx) => {
        // 删除表
        const sql_del = `DROP TABLE ${tableName}`;
        await Chan.knex.raw(sql_del).transacting(trx);
        // 删除字段
        await Chan.knex(this.model).where("id", "=", id).del().transacting(trx);
      });
      return true;
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
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 获取全量model，默认100个cur = 1,
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
      return res.data;
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
        query: key ? { model: { like: `%${key}%` } } : {},
        field: ["*"],
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new ModelService();
