import iconv from "iconv-lite";

class CollectService extends Chan.Service {
  constructor() {
    super(Chan.knex, "plus_collect");
  }

  /**
   * 抓取网页内容（支持 GB2312 / Buffer）
   */
  async common(url, charset) {
    try {
      const data = await Chan.helper.request(url, {
        method: "GET",
        responseType: "arraybuffer",
        parseJson: false,
        timeout: 15000,
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
          Referer: url,
          "Accept-Language": "zh-CN,zh;q=0.9",
        },
      });

      const buffer = Buffer.from(data);
      return charset === "1" ? buffer : iconv.decode(buffer, "gb2312");
    } catch (err) {
      console.error(`[CollectService] 抓取失败: ${url}`, err.message);
      throw { code: "FETCH_ERROR", message: err.message, url };
    }
  }

  /**
   * 新增采集任务
   */
  async create(body) {
    try {
      const res = await this.insert(body);
      return res;
    } catch (err) {
      console.error(`[CollectService.create] 插入失败`, err);
      throw { code: "DB_INSERT_ERROR", message: err.message };
    }
  }

  /**
   * 删除采集任务
   */
  async delete(id) {
    try {
      const res = await super.delete({ id });
      return res;
    } catch (err) {
      console.error(`[CollectService.delete] 删除失败`, {
        id,
        error: err.message,
      });
      throw { code: "DB_DELETE_ERROR", message: err.message };
    }
  }

  /**
   * 更新采集任务
   */
  async update(body) {
    const { id, ...params } = body;
    if (!id) throw { code: "VALIDATION_ERROR", message: "缺少 id 参数" };

    try {
      const res = await super.update({ query: { id }, params });
      return res;
    } catch (err) {
      console.error(`[CollectService.update] 更新失败`, {
        id,
        params,
        error: err.message,
      });
      throw { code: "DB_UPDATE_ERROR", message: err.message };
    }
  }

  /**
   * 分页查询采集任务列表
   */
  async list(cur = 1, pageSize = 10) {
    const page = Math.max(1, parseInt(cur));
    const limit = Math.min(pageSize, 100); // 防止过大 pageSize
    const offset = (page - 1) * limit;

    try {
      const [{ count }] = await this.knex(this.model).count("id as count");
      const list = await this.knex(this.model)
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
        .limit(limit)
        .offset(offset)
        .orderBy("plus_collect.id", "desc");

      const total = Math.ceil(count / limit);

      return {
        count,
        total,
        current: page,
        list,
      };
    } catch (err) {
      console.error(`[CollectService.list] 查询失败`, err);
      throw { code: "DB_QUERY_ERROR", message: err.message };
    }
  }

  /**
   * 查询单个任务详情
   */
  async detail(id) {
    try {
      const data = await this.knex(this.model)
        .where("id", id)
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
        ])
        .first();

      return data || null;
    } catch (err) {
      console.error(`[CollectService.detail] 查询详情失败`, {
        id,
        error: err.message,
      });
      throw { code: "DB_DETAIL_ERROR", message: err.message };
    }
  }

  /**
   * 搜索采集任务（修复 SQL 注入）
   */
  async search(key = "", cur = 1, pageSize = 10) {
    const page = Math.max(1, parseInt(cur));
    const limit = Math.min(pageSize, 100);
    const offset = (page - 1) * limit;

    try {
      // 转义 LIKE 特殊字符：% _ \
      const safeKey = key.replace(/[%_\\]/g, (match) => `\\${match}`);
      const likePattern = `%${safeKey}%`;

      const [{ count }] = await this.knex(this.model)
        .count("id as count")
        .where("taskName", "like", likePattern);

      const list = await this.knex(this.model)
        .select("id", "taskName", "targetUrl", "updatedAt", "charset", "status")
        .where("taskName", "like", likePattern)
        .orderBy("id", "desc")
        .limit(limit)
        .offset(offset);

      return {
        count: count || 0,
        total: Math.ceil((count || 0) / limit),
        current: page,
        list,
      };
    } catch (err) {
      console.error(`[CollectService.search] 搜索失败`, {
        key,
        error: err.message,
      });
      throw { code: "DB_SEARCH_ERROR", message: err.message };
    }
  }
}

export default new CollectService();
