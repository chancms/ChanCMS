class FieldService extends Chan.Service {
  constructor() {
    super(Chan.knex, "cms_field");
  }
  // 增
  async create(body) {
    try {
      // 新增字的同时需要新增表
      const { mid, cname, ename, type, val, defaultVal, orderBy, length } =
        body;
      await this.knex.transaction(async (trx) => {
        // 查询模块名称
        let table = await this.knex
          .raw("SELECT tableName FROM cms_model WHERE id=?", [mid])
          .transacting(trx);
        table = table[0][0].tableName;
        const result = await this.knex(this.model)
          .insert({ mid, cname, ename, type, val, defaultVal, orderBy, length })
          .transacting(trx);

        // result 返回是新增[id]
        let len = length || 250;
        let sql = "";
        if (result[0]) {
          // 1单行文本（varchar）
          if (type === "1") {
            sql = `varchar(${len})  default ''`;
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
          // 7.数字类型
          if (type === "7") {
            sql = `int default 0`;
          }
          // 8.单图
          if (type === "8") {
            sql = `varchar(255)  default ''`;
          }
          // 9.多图
          if (type === "9") {
            sql = `text`;
          }
          // 10.文件
          if (type === "10") {
            sql = `varchar(255)  default ''`;
          }
          // 11.多文件
          if (type === "11") {
            sql = `text`;
          }
          // 12.编辑器
          if (type === "12") {
            sql = `text`;
          }

          if (sql) {
            const sql_add = `ALTER TABLE ${table} ADD COLUMN ${ename} ${sql}`;
            await Chan.knex.raw(sql_add).transacting(trx);
          }
        }
        return result;
      });
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async findByName(cname, ename) {
    try {
      const result = await this.knex.raw(
        "SELECT cname,ename FROM cms_field WHERE cname=? or ename=? LIMIT 0,1",
        [cname, ename]
      );
      return result[0];
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
      const { mid, ename } = data;
      await Chan.knex.transaction(async (trx) => {
        // 查询模块名称
        let table = await Chan.knex
          .raw("SELECT tableName FROM cms_model WHERE id=?", [mid])
          .transacting(trx);
        table = table[0][0].tableName;
        // 删除表字段
        const sql_del = `ALTER TABLE ${table} DROP COLUMN ${ename}`;
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
    const { id, length, ename, old_ename } = body;
    delete body.id;
    delete body.old_ename;
    try {
      // 开始事务
      await this.knex.transaction(async (trx) => {
        // 更新记录
        const result = await this.knex(this.model)
          .where("id", "=", id)
          .update(body)
          .transacting(trx);

        if (result) {
          // 查询 cms_model 表来获取 tableName
          const modelInfo = await this.knex
            .raw("SELECT tableName FROM cms_model WHERE id = ?", [body.mid])
            .transacting(trx);
          const [[{ tableName }]] = modelInfo;
          if (!tableName) {
            throw new Error("找不到模型表格");
          }
          // 修复点：对length进行数字验证，防止注入
          const safeLength =
            Number.isInteger(length) && length > 0 ? length : 255;
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
          await this.knex
            .raw(sql, [tableName, old_ename, ename])
            .transacting(trx);
        }
      });

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 获取全量field，默认100个cur = 1,
  async list(mid, cur = 1, pageSize = 100) {
    try {
      const total = await this.knex(this.model).count("id", { as: "count" });
      const offset = parseInt((cur - 1) * pageSize);
      const list = await this.knex
        .select(["id", "cname", "ename", "orderBy"])
        .from(this.model)
        .where("mid", "=", mid)
        .limit(pageSize)
        .offset(offset)
        .orderBy("id", "desc");
      const count = total[0].count || 1;

      // 查询模块名称
      const models = await this.knex.raw(
        "SELECT model,tableName FROM cms_model WHERE id=?",
        [mid]
      );

      return {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list,
        model: models[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 查
  async detail(id) {
    try {
      const data = await this.findById({
        query: { id },
        field: ["*"],
      });
      return data;
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
        query: key ? { cname: { like: `%${key}%` } } : {},
        field: ["*"],
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new FieldService();
