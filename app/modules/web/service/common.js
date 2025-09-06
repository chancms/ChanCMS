const {
  knex,
  helper: { filterFields,arrToObj },
} = Chan;

const common = {
  async site() {
    try {
      let res = await knex("cms_site")
        .select([
          "name",
          "domain",
          "email",
          "wx",
          "icp",
          "code",
          "title",
          "keywords",
          "description",
          "json",
        ])
        .first();
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 网站栏目
  async category() {
    try {
      let res = await knex("cms_category")
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
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  /**
   * @description 获取文章(头条、推荐、轮播、热门)
   * @param {Array} attr 1头条 2推荐 3轮播 4热门
   * @param {Array} excludeAttr 排除1头条 2推荐 3轮播 4热门
   * @param {Object} len 查询个数
   * @param {Object} start 开始
   * @param {Number} 1 ->返回对象 2->返回数组
   * @returns
   */
  async getArticleList({
    start = 0,
    len = 5,
    attr = "",
    excludeAttr = "",
    type = 2,
  }) {
    try {
      const query = knex
        .select([
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
        ])
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .limit(len)
        .offset(parseInt(start));

      if (attr) {
        query.whereIn("a.attr", attr);
      }

      if (excludeAttr) {
        query.whereNotIn("a.attr", excludeAttr);
      }

      const result = await query;
      return type == 2 ? result : result[0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  /**
   * @description 通用查询全局文章区分栏目
   * @param {*} cid 栏目id
   * @param {*} len 查询个数
   * @param {*} attr 1头条 2推荐 3轮播 4热门
   * @returns {Array}
   */
  async getArticleListByCid({ cid, len = 5, attr = [] }) {
    try {
      // 获取所有id
      const res = await knex
        .select("id")
        .from("cms_category")
        .where("pid", cid);
      const ids = [cid, ...res.map((item) => item.id)];
      // 构建查询条件
      let queryBuilder = knex
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
        .orderBy("a.createdAt", "DESC")
        .limit(len);

      if (attr.length > 0) {
        queryBuilder.whereIn("a.attr", attr);
      }

      // 执行查询
      const result = await queryBuilder;
      return result;
    } catch (err) {
      console.error(`cid->${cid} attr-> ${attr} len->${len}`, err);
      throw err;
    }
  },

  /**
   * @description 通用查询全局文章区分栏目返回对象
   * @param {*} cid 栏目id
   * @param {*} len 查询个数
   * @param {*} attr 1头条 2推荐 3轮播 4热门
   * @returns {Array}
   */
  async getArticleListByCidCate({ cid, len = 5, attr = [] }) {
    try {
      // 获取当前栏目及其所有子栏目（包含 pinyin）
      const res = await knex
        .select("id", "pinyin")
        .from("cms_category")
        .where("pid", cid);
      const childCategories = res.filter((item) => item.id !== cid); // 子栏目
      const allCategoryIds = [...childCategories.map((item) => item.id)];

      if (allCategoryIds.length === 0) return {};

      // 构建一个 id -> pinyin 的映射
      const idToPinyin = Object.fromEntries(
        res.map((item) => [item.id, item.pinyin])
      );

      // 如果是叶子节点（没有子栏目），就只查自己
      if (res.length === 0 && cid !== 0) {
        const category = await knex
          .select("pinyin")
          .from("cms_category")
          .where("id", cid)
          .first();
        if (category) {
          idToPinyin[cid] = category.pinyin;
        }
      }

      // 构建每个子栏目（包括父栏目）的查询 Promise
      const fetchPromises = allCategoryIds.map((id) => {
        let queryBuilder = knex
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
          .where("a.cid", id)
          .where("a.status", 0)
          .orderBy("a.createdAt", "DESC");

        if (len > 0) {
          queryBuilder = queryBuilder.limit(len);
        }

        if (attr.length > 0) {
          queryBuilder = queryBuilder.whereIn("a.attr", attr);
        }

        return queryBuilder;
      });

      // 并发执行所有查询
      const results = await Promise.all(fetchPromises);

      // 将结果按 pinyin 分组整理成对象
      const grouped = {};
      allCategoryIds.forEach((id, index) => {
        const pinyin = idToPinyin[id] || "default";
        grouped[pinyin] = results[index] || [];
      });

      return grouped;
    } catch (err) {
      console.error(`cid->${cid} attr-> ${attr} len->${len}`, err);
      throw err;
    }
  },

  /**
   * @description 通过文章id查找对应的tag标签
   * @param {Number} aid 文章id
   * @returns {Array} 返回数组
   */
  async getTagsFromArticleByAid(aid) {
    try {
      // 执行查询
      const result = await knex("cms_article AS a")
        .select("a.cid", "t.id", "t.name", "t.path")
        .rightJoin("cms_tag AS t", "t.id", "=", "a.tagId")
        .where("a.id", aid)
        .where("a.status", 0)
        .limit(10)
        .offset(0);
      return result;
    } catch (err) {
      console.error(`aid->${aid}`, err);
      throw err;
    }
  },

  /**
   * @param [1,2,3] 栏目id，指定栏目id进行返回
   * @description 返回所有的根栏目
   * @returns {Array}
   */
  async getAllParentCategory(idArray = []) {
    try {
      const result = await knex("cms_category")
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
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  /**
   * @description 获取所需多个栏目文章
   * @param {Array} cids 栏目id
   * @returns {Array}
   */
  async getArticleListByCids({
    cids = [],
    attr = 2,
    toplen = 1,
    listlen = 5,
  } = {}) {
    try {
      // 去重函数
      function uniqueByPath(arr) {
        const map = new Map();
        return arr.filter((item) => {
          if (!map.has(item.path)) {
            map.set(item.path, item);
            return true;
          }
          return false;
        });
      }

      // 主栏目-图-文
      let cate = await common.getAllParentCategory(cids);
      cate = cate.filter((item) => item.path != "/home" && item.type == "0");
      const cateField = ["id", "name", "path", "pinyin"];
      cate = filterFields(cate, cateField);

      let list = [];
      for (let item of cate) {
        // 使用 Promise.all 并行获取数据
        const [_top, _list] = await Promise.all([
          common.getArticleListByCid({ cid: item.id, len: toplen, attr }),
          common.getArticleListByCid({ cid: item.id, len: listlen }),
        ]);

        // 获取并处理标签
        let tagsPromises = _list.map((sub) =>
          common.getTagsFromArticleByAid(sub.id)
        );
        let tags = await Promise.all(tagsPromises);
        tags = [].concat(...tags); // 将二维数组转为一维
        tags = uniqueByPath(tags);

        let _item = { top: _top, list: _list, tags, category: item };
        list.push(_item);
      }

      // 方便模板调用
      let article = {};
      list.forEach((item) => {
        article[item.category.pinyin] = item;
      });

      return { ...article, list };
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  /**
   * @description 浏览pv排行(全局|指定栏目)
   * @param {Number|String} id 栏目id
   * @param {Number} len 默认10条
   * @returns
   */
  async getArticlePvList({ len = 10, cid = "" } = {}) {
    try {
      // 1. 基础查询构建
      const query = knex
        .select(
          "a.id",
          "a.title",
          "a.shortTitle",
          "a.img",
          "a.createdAt",
          "a.description",
          "a.pv",
          "c.pinyin",
          "c.name",
          "c.path"
        )
        .from("cms_article AS a")
        .leftJoin("cms_category AS c", "a.cid", "c.id")
        .where("a.status", 0);

      // 2. 栏目过滤逻辑优化
      if (cid) {
        // 获取子栏目ID（同步查询优化）
        const subIds = await knex("cms_category")
          .select("id")
          .where("pid", Number(cid)) // 确保类型匹配
          .pluck("id");

        const targetIds = [...subIds, Number(cid)]; // 包含当前栏目
        query.whereIn("a.cid", targetIds);
      }

      // 3. 执行优化后的查询
      return query.orderBy("a.pv", "DESC").limit(len);
    } catch (err) {
      console.error(`id->${id} len->${len}`, err);
      throw err;
    }
  },

  /**
   * @description 最新图文(全局|指定栏目)
   * @param {Number|String} id 栏目id
   * @param {Number} len 默认10条
   * @param {*} attr 1头条 2推荐 3轮播 4热门
   * @returns
   */
  async getNewImgList({ len = 10, cid = "", attr = "" } = {}) {
    try {
      let query = knex
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

      if (cid) {
        const ids = await knex("cms_category")
          .select("id")
          .where("pid", cid)
          .pluck("id");

        ids.push(cid);
        query.whereIn("a.cid", ids);
      }

      if (attr) {
        query.where("a.attr", "LIKE", `%${attr}%`);
      }
      query.orderBy("a.createdAt", "DESC").limit(len);

      let result = await query;
      return result;
    } catch (err) {
      console.error(`id->${cid} len->${len}`, err);
      throw err;
    }
  },

  /**
   * @description 文章列表
   * @param {Number} id 栏目id
   * @param {Number|String} current 当前页面
   * @param {Number} pageSize 默认10条
   * @returns {Array}
   */
  // 异步函数，用于获取文章列表
  async list({ cid, current = 1, pageSize = 10 }) {
    try {
      // 计算起始位置
      const start = (current - 1) * pageSize;
      // 获取所有id
      let ids = [cid];
      const res = await knex("cms_category").select("id").where("pid", cid);
      res.forEach((item) => {
        ids.push(item.id);
      });
      // 查询个数
      const total = await knex("cms_article")
        .count("id as count")
        .whereIn("cid", ids)
        .where("status", 0)
        .first();
      const count = total.count || 1;

      // 查询文章列表
      const result = await knex
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
      console.error(
        `list-id->${cid} current->${current} pageSize->${pageSize}`,
        err
      );
      throw err;
    }
  },

  /**
   * @description tag搜索
   * @param {Number} tag tagpath
   * @param {Number|String} current 当前页面
   * @param {Number} pageSize 默认10条
   * @returns {Array}
   */
  // 异步函数，用于查询标签
  async tags({ path, current = 1, pageSize = 10 }) {
    try {
      // 计算起始位置
      const start = (current - 1) * pageSize;
      // 查询个数
      const total = await knex("cms_article as a")
        .whereExists(function () {
          select(1)
            .from("cms_tag as t")
            .whereRaw("FIND_IN_SET(t.id, a.tagId)")
            .andWhere("t.path", path);
        })
        .count("a.id as total");

      // 查询文章列表
      const result = await knex("cms_article as a")
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
          select(1)
            .from("cms_tag as t")
            .whereRaw("FIND_IN_SET(t.id, a.tagId) > 0")
            .andWhere("t.path", path);
        })
        .where("a.status", 0)
        .orderBy("a.createdAt", "DESC")
        .offset(start)
        .limit(pageSize);

      const count = total[0].total || 1;

      return {
        count,
        total: Math.ceil(count / pageSize),
        current,
        list: result,
      };
    } catch (err) {
      console.error(
        `id->${path} current->${current} pageSize->${pageSize}`,
        err
      );
      throw err;
    }
  },

  /**
   * @description 通过文章id获取tags
   * @param {*} articleId
   * @returns {Array} 返回数组
   */
  async fetchTagsByArticleId({ id, len = 5 }) {
    try {
      const article = await knex("cms_article")
        .select("tagId")
        .where("id", id)
        .first();

      if (!article || !article.tagId) {
        return [];
      }

      const tagIds = article.tagId.split(",").map(Number);
      const tags = await knex("cms_tag")
        .select("id", "path", "name")
        .whereIn("id", tagIds)
        .limit(len);

      return tags;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // banner轮播图
  async bannerSlide(cur = 1, pageSize = 10) {
    try {
      const offset = parseInt((cur - 1) * pageSize);
      const list = await knex
        .select(["id", "title", "imgUrl", "linkUrl", "content"])
        .from("cms_slide")
        .limit(pageSize)
        .offset(offset)
        .orderBy("id", "desc");
      return list;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async friendLink({ pageSize = 10 }) {
    try {
      // 限制每页最多100条
      pageSize = Math.min(parseInt(pageSize, 10) || 10, 100);
      // 并行执行总数查询和分页查询
      const [list] = await Promise.all([
        knex("cms_friendlink")
          .select("title", "link")
          .orderBy("orderBy", "desc") // 先按 orderBy 降序排序
          .orderBy("id", "desc") // 再按 id 降序排序
          .limit(pageSize)
          .offset(0),
      ]);
      return list;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async frag({ pageSize = 10 }) {
    try {
      // 限制每页最多100条
      pageSize = Math.min(parseInt(pageSize, 10) || 10, 100);

      const list = await knex
        .select(["name", "mark", "content"])
        .from("cms_frag")
        .limit(pageSize)
        .offset(0)
        .orderBy("id", "desc");
      const frags = arrToObj(list, "mark","content");
      return frags;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async tag({ pageSize = 10 }) {
    try {
      // 限制每页最多100条
      pageSize = Math.min(parseInt(pageSize, 10) || 10, 100);

      const res = await knex
        .select(["id", "name", "path", "count"])
        .from("cms_tag")
        .limit(pageSize)
        .offset(0)
        .orderBy("count", "desc");
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async article(id) {
    try {
      // 查询文章
      const data = await knex("cms_article").where("id", "=", id).select();
      //兼容mysql错误
      if (!data[0] || !data[0].cid) {
        return false;
      }
      // 通过栏目id查找模型id
      const modId = await knex.raw(
        `SELECT mid FROM cms_category WHERE id=? LIMIT 0,1`,
        [data[0].cid]
      );

      let field = [];
      if (modId[0].length > 0 && modId[0][0].mid !== "0") {
        // 通过模型查找表名
        const tableName = await knex.raw(
          `SELECT tableName FROM cms_model WHERE id=?`,
          [modId[0][0].mid]
        );
        // 通过表名查找文章
        field = await knex.raw(`SELECT * FROM ?? WHERE aid=? LIMIT 0,1`, [
          tableName[0][0].tableName,
          id,
        ]);
      }
      return { ...data[0], field: field[0] || {} };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 上一篇文章
  async prev({ id, cid }) {
    try {
      const result = await knex("cms_article as a")
        .select("a.id", "a.title", "c.name", "c.path")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.id", "<", id)
        .andWhere("a.cid", cid)
        .orderBy("a.id", "desc")
        .first();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 下一篇文章
  async next({ id, cid }) {
    try {
      const result = await knex("cms_article as a")
        .select("a.id", "a.title", "c.name", "c.path")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .where("a.id", ">", id)
        .andWhere("a.cid", cid)
        .orderBy("a.id", "asc")
        .first();
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 增加计数器
  async count({ id }) {
    try {
      const result = await knex("cms_article")
        .where("id", id)
        .increment("pv", 1);
      return result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async search({ keywords = "", current = 1, pageSize = 10, cid = 0 }) {
    try {
      // 查询个数
      let sql;
      const countSql = `SELECT COUNT(*) as count FROM  cms_article a LEFT JOIN cms_category c ON a.cid=c.id`;
      const keyStr = ` WHERE a.title LIKE \'%${keywords}%\'`;
      const cidStr = `  AND c.id=?`;

      if (cid === 0) {
        sql = countSql + keyStr;
      } else {
        sql = countSql + keyStr + cidStr;
      }
      const total = cid ? await knex.raw(sql, [cid]) : await knex.raw(sql, []);
      // 翻页
      const offset = parseInt((current - 1) * pageSize);
      let sql_list = "";
      const listStart = `SELECT a.id,a.title,a.attr,a.tagId,a.description,a.cid,a.pv,a.createdAt,a.status,c.name,c.path FROM cms_article a LEFT JOIN cms_category c ON a.cid=c.id WHERE a.title LIKE  \'%${keywords}%\' `;
      const listEnd = `ORDER BY a.id desc LIMIT ${offset},${parseInt(
        pageSize
      )}`;
      if (cid === 0) {
        sql_list = listStart + listEnd;
      } else {
        sql_list = listStart + `AND c.id=? ` + listEnd;
      }
      const list = cid
        ? await knex.raw(sql_list, [cid])
        : await knex.raw(sql_list, []);
      const count = total[0][0].count;
      return {
        count: count,
        total: Math.ceil(count / pageSize),
        current,
        list: list[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  /**
   * 查找所有符合条件的记录，并提供分页信息。
   * @param {Object} options - 包含查询参数的对象
   * @param {number} options.current - 当前页码，默认第一页
   * @param {String} options.table - 表名
   * @param {Boolean} options.needCount - 是否需要总记录数，默认为true
   * @param {number} options.pageSize - 每页大小，默认10条记录
   * @param {Object} options.query - 查询条件
   * @param {Array} options.field - 需要返回的字段
   * @returns {Promise<Object>} 返回包含数据列表、总记录数、当前页、每页大小的对象
   */
  async query({
    table = "", // 表名
    current = 1,
    pageSize = 10,
    query = {},
    field = [],
    needCount = true,
  }) {
    if (!table) {
      console.warn("请传入表名");
      return {};
    }

    if (
      [
        "sys_user",
        "sys_role",
        "sys_notice",
        "sys_menu",
        "sys_config",
        "plus_collect",
        "plus_gather",
      ].includes(table)
    ) {
      console.warn(`查询${table}表，无权限`);
      return {};
    }
    const offset = (current - 1) * pageSize;

    let countQuery = knex(table).count("* as total");
    let dataQuery = knex(table);
    // 应用查询条件
    if (Object.keys(query).length > 0) {
      Object.entries(query).forEach(([key, value]) => {
        dataQuery = dataQuery.where(key, value);
        countQuery = countQuery.where(key, value);
      });
    }

    //字段筛选
    if (field.length > 0) {
      dataQuery = dataQuery.select(field);
    }

    //并行执行获取总记录数和分页数据的查询
    const [totalResult, data] = await Promise.all([
      countQuery.first(),
      pageSize == 1
        ? dataQuery.offset(offset).limit(pageSize).first()
        : dataQuery.offset(offset).limit(pageSize),
    ]);
    // 提取总记录数
    const total = totalResult?.total || 0;
    return needCount ? { data, total, current, pageSize } : data;
  },
};

export default common;
