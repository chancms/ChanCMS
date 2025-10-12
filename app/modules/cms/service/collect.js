
const { knex } = Chan;
import axios from 'axios';
import iconv from 'iconv-lite';
import BaseService from './base.js';

let model = "plus_collect";
let db = Chan.Service(knex, model);
const pageSize = 100;

let CollectService = {

  async common(url, charset) {
    try {
      const { data } = await axios.get(url, {
        responseType: "arraybuffer",
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
          Referer: url,
          "Accept-Language": "zh-CN,zh;q=0.9",
        },
      });
      return charset == 1 ? data : iconv.decode(data, "gb2312");
    } catch (err) {
      throw err;
    }
  },

  // 增加
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

  // 列表
  async list(cur = 1, pageSize = 10) {
    try {
      // 查询个数
      const total = await knex(model).count("id", { as: "count" });
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex(model)
        .select(
          "plus_collect.id",
          "plus_collect.taskName",
          "plus_collect.pages",
          "plus_collect.updatedAt",
          "plus_collect.charset",
          "plus_collect.titleTag",
          "plus_collect.articleTag",
          "plus_collect.parseData",
          "plus_collect.status",
          "plus_collect.cid",
          "cms_category.name as category"
        )
        .innerJoin("cms_category", "plus_collect.cid", "cms_category.id")
        .limit(pageSize)
        .offset(offset)
        .orderBy("plus_collect.id", "desc");
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
      const data = await knex(model)
        .where("id", "=", id)
        .select([
          "id",
          "taskName",
          "targetUrl",
          "listTag",
          "startNum",
          "endNum",
          "increment",
          "pages",
          "titleTag",
          "articleTag",
          "charset",
          "parseData",
          "status",
          "cid",
        ]);
      return data[0];
    } catch (err) {
      throw err;
    }
  },

  // 搜索
  async search(key = "", cur = 1, pageSize = 10) {
    try {
      // 查询个数
      const sql = `SELECT COUNT(id) as count FROM ?? p WHERE p.taskName LIKE '%${key}%'`;
      const total = await knex.raw(sql, [model]);
      // 翻页
      const offset = parseInt((cur - 1) * pageSize);
      const sql_list = `SELECT p.id,p.taskName,p.targetUrl,p.updatedAt,p.charset,p.status FROM ?? p WHERE p.taskName LIKE '%${key}%' ORDER BY id DESC LIMIT ?,?`;
      const list = await knex.raw(sql_list, [
        model,
        offset,
        parseInt(pageSize),
      ]);
      const count = total[0].count || 1;
      return {
        count: count,
        total: Math.ceil(count / pageSize),
        current: +cur,
        list: list[0],
      };
    } catch (err) {
      throw err;
    }
  }
}

export default CollectService;