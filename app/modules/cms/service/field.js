const { knex } = Chan;
let model = "cms_field";
let db = Chan.Service(knex, model);
const pageSize = 100;
let FieldService = {
  // 增
  async create(body) {
    try {
      // 新增字的同时需要新增表
      const { mid, cname, ename, type, val, defaultVal, orderBy, length } =
        body;
      await knex.transaction(async (trx) => {
        // 查询模块名称
        let table = await knex
          .raw("SELECT tableName FROM cms_model WHERE id=?", [mid])
          .transacting(trx);
        table = table[0][0].tableName;
        const result = await knex(model)
          .insert({ mid, cname, ename, type, val, defaultVal, orderBy, length })
          .transacting(trx);

        // result 返回是新增[id]
        let len = length || 250;
        let sql = "";
        if (result[0]) {
          // 1单行文本（varchar）
          if (type === "1") {
            sql = `varchar(${len})  default \'\'`;
          }
          // 2.多行文本 text
          if (type === "2") {
            sql = `text`;
          }
          // 3.下拉菜单 text
          if (type === "3") {
            sql = `text`;
          }
          // 4.单选 text
          if (type === "4") {
            sql = `text`;
          }
          // 5.多选 text
          if (type === "5") {
            sql = `text`;
          }
          // 6.时间和日期
          if (type === "6") {
            sql = `datetime default null`;
          }
          // 7.s数字
          if (type === "7") {
            sql = `varchar(${len})  default \'\'`;
          }
          // 8.图片上传
          if (type === "8") {
            sql = `text`;
          }
          // 9富文本
          if (type === "9") {
            sql = `longtext`;
          }
        }

        const res = await knex
         .raw(`alter table ?? add ?? ${sql}`, [table, ename])
          .transacting(trx);
        return res ? "success" : "fail";
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 删 先删除field数据表中的数据 在删除对应表中的字段名称 2020-10-08
  // "alter table ${table} drop column ${fieldName}"

  async delete(id, table) {
    try {
      await knex.transaction(async (trx) => {
        // 查询需要删除的字段
        const field = await knex
          .raw("SELECT mid,ename FROM cms_field WHERE id=?", [id])
          .transacting(trx);
        const { ename, mid } = field[0][0];
        // 查询模型表名
        let table = await knex
          .raw("SELECT tableName FROM cms_model WHERE id=?", [mid])
          .transacting(trx);
        table = table[0][0].table;
        // 删除数据
        const result = await knex(model)
          .where("id", "=", id)
          .del()
          .transacting(trx);
        // 删除对应模型表中的字段
        if (result > 0) {
          const res = await knex
          .raw(`alter table ?? drop column ??`, [table, ename])
            .transacting(trx);
        }
        return result ? "success" : "fail";
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 改
  async update(body) {

    const { id, length,old_ename } = body;
    delete body.id;
    delete body.old_ename;
    try {
      // 开始事务
      await knex.transaction(async (trx) => {
        // 更新记录
        const result = await knex(model)
          .where("id", "=", id)
          .update(body)
          .transacting(trx);

        if (result) {
          // 查询 cms_model 表来获取 tableName
          const modelInfo = await knex
            .raw("SELECT tableName FROM cms_model WHERE id = ?", [body.mid])
            .transacting(trx);
          const [[{ tableName }]] = modelInfo;
          if (!tableName) {
            throw new Error("找不到模型表格");
          }
         // 修复点：对length进行数字验证，防止注入
          const safeLength = Number.isInteger(length) && length > 0 ? length : 255;
          // 定义一个对象来存储不同类型的SQL字段定义
          const fieldTypeMap = {
            1: `varchar(${safeLength || 255}) `, // 如果没有提供长度，默认为255
            2: "text",
            3: "text",
            4: "text",
            5: "text",
            6: `datetime NOT NULL DEFAULT NULL`,
            7: `varchar(${safeLength || 255}) `, // 如果没有提供长度，默认为255
            8: "text",
            9: "longtext",
          };

          // 获取对应的SQL字段定义
          let sqlType = fieldTypeMap[body.type];
        
           // 使用 ?? 安全引用表名、旧字段名、新字段名
           const sql = `ALTER TABLE ?? CHANGE ?? ?? ${sqlType}`;
           await knex
             .raw(sql, [tableName, old_ename, updateData.ename])
             .transacting(trx);
        }
      });

      return "success";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查询是否存在重复字段名

  async findByName(cname, ename) {
    try {
      const result = await knex.raw(
        "SELECT cname,ename FROM cms_field WHERE cname=? or ename=? LIMIT 0,1",
        [cname, ename]
      );
      return result[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 文章列表
  async list(mid, cur = 1, pageSize = 10) {
     try {
      // 查询个数
   
      const total = await knex.raw("SELECT COUNT(id) as count FROM ??", [model]);
	  
	 
      // 列表
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select(["id", "cname", "ename", "orderBy"])
        .from(model)
        .where("mid", "=", mid)
        .limit(pageSize)
        .offset(offset)
        .orderBy("id", "desc");

      // 查询模块名称
      const models = await knex.raw(
        "SELECT model,tableName FROM cms_model WHERE id=?",
        [mid]
      );
      const count = total[0].count || 1;
      return {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
        model: models[0],
      };
    } catch (err) {
      console.error(err);
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

export default FieldService;
