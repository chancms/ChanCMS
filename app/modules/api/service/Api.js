class ApiService extends Chan.Service {
  constructor() {
    super(Chan.knex, "api");
  }

  /**
   * 获取网站栏目
   * @returns {Promise<Array>} 栏目列表
   */
  async category() {
    try {
      return await this.knex("cms_category")
        .select([
          "id",
          "pid",
          "name",
          "pinyin",
          "path",
          "orderBy",
          "target",
          "status",
          "listView",
          "articleView",
          "seoTitle",
          "seoKeywords",
          "seoDescription",
          "type",
        ])
        .orderBy("orderBy", "ASC");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 获取文章列表
   * @param {Object} params - 查询参数
   * @param {number} params.start - 开始位置
   * @param {number} params.len - 查询个数
   * @param {string} params.attr - 属性筛选 (1头条 2推荐 3轮播 4热门)
   * @returns {Promise<Array>} 文章列表
   */
  async getArticleList({ start, len, attr }) {
    try {
      const columns = [
        "a.id",
        "a.title",
        "a.shortTitle",
        "a.img",
        "a.createdAt",
        "a.description",
        "a.link",
        "c.pinyin",
        "c.name",
        "c.path",
      ];

      const query = this.knex
        .select(columns)
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .limit(len)
        .offset(start);

      if (attr) {
        query.where("a.attr", "LIKE", `%${attr}%`);
      }

      return await query;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 获取指定栏目的文章列表
   * @param {number} cid - 栏目ID
   * @param {number} len - 查询个数 (默认5)
   * @param {string} attr - 属性筛选 (1头条 2推荐 3轮播 4热门)
   * @returns {Promise<Array>} 文章列表
   */
  async getArticleListByCid(cid, len = 5, attr = "") {
    try {
      // 获取所有子栏目ID
      const res = await this.knex
        .select("id")
        .from("cms_category")
        .where("pid", cid);

      const ids = [cid, ...res.map((item) => item.id)];

      // 构建查询
      let queryBuilder = this.knex
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .whereIn("a.cid", ids)
        .where("a.status", 0)
        .orderBy("createdAt", "DESC")
        .limit(len);

      if (attr) {
        queryBuilder = queryBuilder.andWhere("a.attr", "LIKE", `%${attr}%`);
      }

      return await queryBuilder;
    } catch (err) {
      console.error(`cid->${cid} attr-> ${attr} len->${len}`, err);
      throw err;
    }
  }

  /**
   * 通过文章ID获取对应的标签
   * @param {number} id - 文章ID
   * @returns {Promise<Array>} 标签列表
   */
  async getArticleTag(id) {
    try {
      return await this.knex("cms_article AS a")
        .select("a.cid", "t.id", "t.name", "t.path")
        .rightJoin("cms_tag AS t", "t.id", "=", "a.tagId")
        .where("a.id", id)
        .where("a.status", 0)
        .limit(10)
        .offset(0);
    } catch (err) {
      console.error(`aid->${id}`, err);
      throw err;
    }
  }

  /**
   * 获取所有根栏目
   * @param {Array} idArray - 指定栏目ID数组
   * @returns {Promise<Array>} 根栏目列表
   */
  async getAllParentCategory(idArray = []) {
    try {
      return await this.knex("cms_category")
        .select([
          "id",
          "pid",
          "name",
          "pinyin",
          "path",
          "orderBy",
          "target",
          "status",
          "type",
        ])
        .where("pid", 0)
        .where("type", 0)
        .where((builder) => !idArray.length || builder.whereIn("id", idArray))
        .orderBy("orderBy", "ASC");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 通过文章ID获取标签
   * @param {number} id - 文章ID
   * @returns {Promise<Array>} 标签列表
   */
  async getTagsById(id) {
    try {
      return await this.knex("cms_article AS a")
        .select("a.cid", "t.id", "t.name", "t.path")
        .rightJoin("cms_tag AS t", "t.id", "=", "a.tagId")
        .where("a.id", id)
        .where("a.status", 0)
        .limit(10)
        .offset(0);
    } catch (err) {
      console.error(`aid->${id}`, err);
      throw err;
    }
  }

  /**
   * 获取浏览PV排行
   * @param {number} len - 查询条数 (默认10)
   * @param {number|string} id - 栏目ID
   * @returns {Promise<Array>} 文章列表
   */
  async pv(len = 10, id = "") {
    try {
      let query = this.knex
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.status", 0);

      if (id) {
        const ids = await this.knex("cms_category")
          .select("id")
          .where("pid", id)
          .pluck("id");

        ids.push(id);
        query.whereIn("cid", ids);
      }

      return await query.orderBy("pv", "DESC").limit(len);
    } catch (err) {
      console.error(`id->${id} len->${len}`, err);
      throw err;
    }
  }

  /**
   * 获取图文文章
   * @param {Object} params - 查询参数
   * @param {number} params.len - 查询条数
   * @param {number|string} params.id - 栏目ID
   * @param {string} params.attr - 属性筛选 (1头条 2推荐 3轮播 4热门)
   * @returns {Promise<Array>} 文章列表
   */
  async articleImg({ len, id, attr }) {
    try {
      let query = this.knex
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.img", "!=", "")
        .where("a.status", 0);

      if (id) {
        const ids = await this.knex("cms_category")
          .select("id")
          .where("pid", id)
          .pluck("id");

        ids.push(id);
        query.whereIn("a.cid", ids);
      }

      if (attr) {
        query.where("a.attr", "LIKE", `%${attr}%`);
      }

      return await query.orderBy("a.createdAt", "DESC").limit(len);
    } catch (err) {
      console.error(`id->${id} len->${len}`, err);
      throw err;
    }
  }

  /**
   * 获取文章列表
   * @param {Object} params - 查询参数
   * @param {number} params.id - 栏目ID
   * @param {number} params.current - 当前页码
   * @param {number} params.pageSize - 每页条数 (默认10)
   * @returns {Promise<Object>} 分页结果
   */
  async list({ id, current, pageSize }) {
    try {
      const start = (current - 1) * pageSize;

      // 获取所有子栏目ID
      const res = await this.knex("cms_category").select("id").where("pid", id);
      const ids = [id, ...res.map((item) => item.id)];

      // 查询总数
      const total = await this.knex("cms_article")
        .count("id as count")
        .whereIn("cid", ids)
        .where("status", 0)
        .first();

      const count = total.count || 1;

      // 查询文章列表
      const result = await this.knex
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.description",
          "a.createdAt",
          "a.author",
          "a.pv",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .whereIn("a.cid", ids)
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .offset(start)
        .limit(pageSize);

      return {
        count,
        total: Math.ceil(count / pageSize),
        current: +current,
        list: result,
      };
    } catch (err) {
      console.error(`id->${id} current->${current} pageSize->${pageSize}`, err);
      throw err;
    }
  }

  /**
   * 标签搜索
   * @param {Object} params - 查询参数
   * @param {string} params.name - 标签名称
   * @param {number} params.current - 当前页码
   * @param {number} params.pageSize - 每页条数 (默认10)
   * @returns {Promise<Object>} 分页结果
   */
  async tagList({ name, current, pageSize }) {
    try {
      const start = (current - 1) * pageSize;

      // 查询总数
      const total = await this.knex("cms_article as a")
        .join("cms_category as c", "a.cid", "c.id")
        .whereExists(function () {
          this.select(1)
            .from("cms_tag as t")
            .whereRaw("FIND_IN_SET(t.id, a.tagId) > 0")
            .andWhere("t.name", name);
        })
        .count("* as total");

      // 查询文章列表
      const result = await this.knex("cms_article as a")
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.description",
          "a.createdAt",
          "a.author",
          "a.pv",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .join("cms_category as c", "a.cid", "c.id")
        .whereExists(function () {
          this.select(1)
            .from("cms_tag as t")
            .whereRaw("FIND_IN_SET(t.id, a.tagId) > 0")
            .andWhere("t.name", name);
        })
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .offset(start)
        .limit(pageSize);

      const count = total[0].total || 1;

      return {
        count,
        total: Math.ceil(count / pageSize),
        current: +current,
        list: result,
      };
    } catch (err) {
      console.error(
        `name->${name} current->${current} pageSize->${pageSize}`,
        err
      );
      throw err;
    }
  }

  /**
   * 获取轮播图
   * @param {number} cur - 当前页码 (默认1)
   * @param {number} pageSize - 每页条数 (默认10)
   * @returns {Promise<Array>} 轮播图列表
   */
  async banner(cur = 1, pageSize = 10) {
    try {
      const offset = parseInt((cur - 1) * pageSize);
      return await this.knex
        .select(["id", "title", "imgUrl", "linkUrl"])
        .from("cms_slide")
        .limit(pageSize)
        .offset(offset)
        .orderBy("id", "desc");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 获取文章详情
   * @param {number} id - 文章ID
   * @returns {Promise<Object>} 文章详情
   */
  async article(id) {
    try {
      // 查询文章
      const data = await this.knex("cms_article").where("id", "=", id).first();

      if (!data || !data.cid) {
        return false;
      }

      // 通过栏目ID查找模型ID
      const modId = await this.knex("cms_category")
        .select("mid")
        .where("id", data.cid)
        .first();

      let field = {};
      if (modId && modId.mid !== "0") {
        // 通过模型查找表名
        const tableName = await this.knex("cms_model")
          .select("tableName")
          .where("id", modId.mid)
          .first();

        // 通过表名查找文章扩展字段
        field =
          (await this.knex(tableName.tableName).where("aid", id).first()) || {};
      }

      return { ...data, field };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 获取上一篇文章
   * @param {Object} params - 查询参数
   * @param {number} params.id - 当前文章ID
   * @param {number} params.cid - 栏目ID
   * @returns {Promise<Object>} 上一篇文章
   */
  async prev({ id, cid }) {
    try {
      const result = await this.knex.raw(
        `SELECT a.id,a.title,c.name,c.path FROM cms_article a LEFT JOIN cms_category c ON a.cid=c.id  WHERE a.id<? AND a.cid=? ORDER BY id DESC LIMIT 1`,
        [id, cid]
      );
      return result[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 获取下一篇文章
   * @param {Object} params - 查询参数
   * @param {number} params.id - 当前文章ID
   * @param {number} params.cid - 栏目ID
   * @returns {Promise<Object>} 下一篇文章
   */
  async next({ id, cid }) {
    try {
      const result = await this.knex.raw(
        `SELECT a.id,a.title,c.name,c.path FROM cms_article a LEFT JOIN cms_category c ON a.cid=c.id WHERE a.id>? AND a.cid=? LIMIT 1`,
        [id, cid]
      );
      return result[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * 搜索文章
   * @param {string} key - 搜索关键词
   * @param {number} cur - 当前页码 (默认1)
   * @param {number} pageSize - 每页条数 (默认10)
   * @param {number} cid - 栏目ID (默认0)
   * @returns {Promise<Object>} 搜索结果
   */
  async search(key = "", cur = 1, pageSize = 10, cid = 0) {
    try {
      // 查询总数
      let countQuery = this.knex("cms_article as a")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.title", "LIKE", `%${key}%`)
        .count("* as count");

      if (cid !== 0) {
        countQuery = countQuery.andWhere("c.id", cid);
      }

      const total = await countQuery;
      const count = total[0].count || 0;

      // 查询列表
      const offset = parseInt((cur - 1) * pageSize);
      let listQuery = this.knex("cms_article as a")
        .select(
          "a.id",
          "a.title",
          "a.attr",
          "a.tagId",
          "a.description",
          "a.cid",
          "a.pv",
          "a.createdAt",
          "a.status",
          "c.name",
          "c.path"
        )
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.title", "LIKE", `%${key}%`)
        .orderBy("a.id", "desc")
        .offset(offset)
        .limit(pageSize);

      if (cid !== 0) {
        listQuery = listQuery.andWhere("c.id", cid);
      }

      const list = await listQuery;

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

  /**
   * 增加文章浏览量
   * @param {number} id - 文章ID
   * @returns {Promise<string>} 操作结果
   */
  async pvadd(id) {
    try {
      const result = await this.knex("cms_article")
        .where("id", id)
        .increment("pv", 1);
      return !!result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new ApiService();
