const { knex } = Chan;
let model = "cms_model";
let db = Chan.Service(knex, model);
const pageSize = 100;
let ModelService = {

  // 增
  async create(body) {
    try {
      const { model, tableName, status,remark='' } = body;
      await knex.transaction(async (trx) => {
        // 新建表
        const sql_create = `CREATE TABLE ${tableName} (
              id INT(11) NOT NULL AUTO_INCREMENT,
              aid INT(11) NOT NULL,
              PRIMARY KEY (id)
            ) ENGINE=InnoDB
            DEFAULT CHARSET=utf8mb4
            COLLATE=utf8mb4_general_ci
            COMMENT='${remark}'`;

        const createTableStatus = await knex
          .raw(sql_create, [])
          .transacting(trx);
        // 新增内容
        const sql_insert = `INSERT INTO cms_model (model,tableName,status,remark) VALUES(?,?,?,?)`;
        const result = await knex
          .raw(sql_insert, [model, tableName, status ,remark])
          .transacting(trx);
        return {
          insertStatus: result[0],
          createTableStatus: createTableStatus[0],
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async hasUse(id) {
    try {
      // 新增内容
      const hasStr = `SELECT COUNT(*) as count FROM  cms_article a LEFT JOIN cms_category c ON c.mid=${id} WHERE a.cid=c.id LIMIT 0,1`;
      const has = await knex.raw(hasStr);
      return has[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 删
  async delete(body) {
    try {
      const { id, tableName } = body;
      await knex.transaction(async (trx) => {
        // 删除模型
        const result = await knex(model)
          .where("id", "=", id)
          .del()
          .transacting(trx);
        // 删除模型下对应得字段数据
        const delField = await knex("cms_field")
          .where("mid", "=", id)
          .del()
          .transacting(trx);
        // 删除模型对应的表
        const delTable = await knex
        .raw(`drop table ??`, [tableName])  // 使用??作为表名占位符，参数单独传递
        .transacting(trx);
        return {
          delModel: result === 1,
          delField: delField === 1,
          delTable: delTable === 1,
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 改
  async update(body) {
    const { id, old_tableName, tableName, model, status } = body;
    try {

      await knex.transaction(async (trx) => {
        const renameTable = await knex
      .raw(`alter table ?? rename to ??`, [old_tableName, tableName])  // 使用??作为表名占位符
      .transacting(trx);

        const result = await knex(model)
          .where("id", "=", id)
          .update({ tableName, model, status })
          .transacting(trx);

        return {
          renameStatus: renameTable,
          updateStatus: result,
        };
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查询是否已存在模型名称
  async findByName(model, tableName) {
    try {
      const result = await knex.raw(
        `SELECT model,tableName FROM cms_model WHERE model=? or tableName=? LIMIT 0,1`,
        [model, tableName]
      );
      return result[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 文章列表
  async list(cur = 1, pageSize = 10) {
    try {
      const sql = `SELECT COUNT(id) as count FROM ${model}`;
      const total = await knex.raw(sql);
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select(["id", "model", "tableName", "status"])
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

  // 查
  async detail(id) {
    try {
      const data = await knex(model).where("id", "=", id).select();
      return data[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default ModelService;
