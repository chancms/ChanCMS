import path from "path";

const {
  knex,
  common: { filterImgFromStr },
  helper:{delImg}
} = Chan;

let model = "cms_article";
let db = Chan.Service(knex, model);
const pageSize = 100; // 注意：这个变量未被使用，保留原样

/**
 * 获取文章中的图片路径（缩略图 + 内容图片）
 */
async function getImgsByArticleId(id, arr) {
  const img = await knex("cms_article")
    .select("img", "content")
    .where("id", id)
    .first();

  if (img) {
    if (img.img) {
      arr.push(img.img);
    }
    const contImgArr = filterImgFromStr(img.content);
    arr.push(...contImgArr);
  }
}

/**
 * 文章服务：增删改查、搜索、统计等
 */
let ArticleService = {
  // 增：创建文章（含事务）
  async create(body) {
    try {
      const { defaultParams, fieldParams } = body;

      await knex.transaction(async (trx) => {
        // 插入基础文章
        const result = await knex(model).insert(defaultParams).transacting(trx);
        const id = result[0];

        if (!id) throw new Error("Failed to insert article");

        // 获取最后插入的文章信息（替代原始 ORDER BY DESC LIMIT 1）
        const article = await knex(model).where("id", id).select("id", "cid").first().transacting(trx);
        const { cid } = article;

        // 获取模型ID
        const modIdRow = await knex("cms_category")
          .where("id", cid)
          .select("mid")
          .first()
          .transacting(trx);

        if (!modIdRow || !modIdRow.mid) return;

        // 获取模型表名
        const tableRow = await knex("cms_model")
          .where("id", modIdRow.mid)
          .select("tableName")
          .first()
          .transacting(trx);

        if (tableRow && tableRow.tableName) {
          // 插入扩展字段数据
          await knex(tableRow.tableName)
            .insert({ ...fieldParams, aid: id })
            .transacting(trx);
        }

        // 处理标签关联
        if (defaultParams.tagId && defaultParams.tagId.length > 0) {
          const tags = defaultParams.tagId.split(",").map(Number).filter(Boolean);
          if (tags.length > 0) {
            // 批量插入标签映射
            const tagMappings = tags.map(tid => ({ aid: id, tid }));
            await knex("cms_articletag")
              .insert(tagMappings)
              .transacting(trx);

            // 更新标签计数
            await knex("cms_tag")
              .whereIn("id", tags)
              .increment("count", 1)
              .transacting(trx);
          }
        }
      });

      return "success";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 删：删除文章（含图片、标签、扩展数据）
  async delete(id) {
    try {
      // 校验并转换 ID 数组
      const ids = id.split(",").map(Number).filter(Boolean);
      if (ids.length === 0) return "success";

      let imgPaths = []; // 收集待删除图片

      await knex.transaction(async (trx) => {
        for (const id of ids) {
          // 获取栏目ID
          const article = await knex(model)
            .where("id", id)
            .select("cid")
            .first()
            .transacting(trx);

          if (!article) continue;

          const { cid } = article;

          // 获取模型表名
          const modIdRow = await knex("cms_category")
            .where("id", cid)
            .select("mid")
            .first()
            .transacting(trx);

          if (modIdRow?.mid) {
            const tableRow = await knex("cms_model")
              .where("id", modIdRow.mid)
              .select("tableName")
              .first()
              .transacting(trx);

            if (tableRow?.tableName) {
              // 删除扩展表数据
              await knex(tableRow.tableName)
                .where("aid", id)
                .del()
                .transacting(trx);
            }
          }

          // 收集图片路径
          await getImgsByArticleId(id, imgPaths);

          // 过滤仅本地上传图片
          const localImgs = imgPaths.filter(p => p.includes("public/upload"));

          // 删除物理图片文件
          for (const imgPath of localImgs) {
            delImg(path.join(__dirname, "../../", imgPath));
          }

          // 删除主文章
          await knex(model).where("id", id).del().transacting(trx);

          // 删除标签映射
          await knex("cms_articletag").where("aid", id).del().transacting(trx);

          // 获取旧标签并减计数
          const record = await knex(model).where("id", id).select("tagId").first().transacting(trx);
          if (record?.tagId) {
            const oldTags = record.tagId.split(",").map(Number).filter(Boolean);
            if (oldTags.length > 0) {
              await knex("cms_tag")
                .whereIn("id", oldTags)
                .decrement("count", 1)
                .where("count", ">", 0) // 防止负数
                .transacting(trx);
            }
          }
        }
      });

      return "success";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 改：更新文章
  async update(body) {
    try {
      const { id, field, oldTagId, ...updateData } = body;

      await knex.transaction(async (trx) => {
        // 获取栏目ID以确定模型
        const article = await knex(model)
          .where("id", id)
          .select("cid")
          .first()
          .transacting(trx);

        if (!article) throw new Error("Article not found");

        const modIdRow = await knex("cms_category")
          .where("id", article.cid)
          .select("mid")
          .first()
          .transacting(trx);

        if (modIdRow?.mid) {
          const tableRow = await knex("cms_model")
            .where("id", modIdRow.mid)
            .select("tableName")
            .first()
            .transacting(trx);

          if (tableRow?.tableName) {
            const tableName = tableRow.tableName;
            const exists = await knex(tableName)
              .where("aid", id)
              .first()
              .transacting(trx);

            if (exists) {
              await knex(tableName)
                .where("aid", id)
                .update(field)
                .transacting(trx);
            } else {
              await knex(tableName)
                .insert({ ...field, aid: id })
                .transacting(trx);
            }
          }
        }

        // 删除旧标签关联
        await knex("cms_articletag").where("aid", id).del().transacting(trx);

        // 减旧标签计数
        if (oldTagId && oldTagId.length > 0) {
          const oldTags = oldTagId.split(",").map(Number).filter(Boolean);
          if (oldTags.length > 0) {
            await knex("cms_tag")
              .whereIn("id", oldTags)
              .decrement("count", 1)
              .where("count", ">", 0)
              .transacting(trx);
          }
        }

        // 新增标签
        if (updateData.tagId && updateData.tagId.length > 0) {
          const newTags = updateData.tagId.split(",").map(Number).filter(Boolean);
          if (newTags.length > 0) {
            await knex("cms_articletag")
              .insert(newTags.map(tid => ({ aid: id, tid })))
              .transacting(trx);

            await knex("cms_tag")
              .whereIn("id", newTags)
              .increment("count", 1)
              .transacting(trx);
          }
        }

        // 更新主表
        await knex(model)
          .where("id", id)
          .update(updateData)
          .transacting(trx);
      });

      return "success";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查：文章列表（支持分页和栏目筛选）
  async list(cur = 1, pageSize = 10, cid) {
    try {
      const page = Math.max(1, parseInt(cur) || 1);
      const limit = Math.max(1, parseInt(pageSize) || 10);
      const offset = (page - 1) * limit;

      let query = knex(model).select([
        "id", "title", "attr", "pv", "createdAt", "status"
      ]);

      // 如果传了 cid，且是有效数字或数组
      if (cid) {
        const ids = Array.isArray(cid) ? cid : [cid].flat().map(Number).filter(Boolean);
        if (ids.length > 0) {
          query = query.whereIn("cid", ids);
        }
      }

      const totalResult = await query.clone().count("* as count").first();
      const count = parseInt(totalResult?.count || 0, 10);

      const list = await query.orderBy("id", "desc").offset(offset).limit(limit);

      return {
        count,
        total: Math.ceil(count / limit),
        current: page,
        list
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 查：文章详情
  async detail(id) {
    try {
      const data = await knex(model).where("id", id).first();
      if (!data || !data.cid) return false;

      let field = {};

      const modIdRow = await knex("cms_category")
        .where("id", data.cid)
        .select("mid")
        .first();

      if (modIdRow?.mid && modIdRow.mid !== "0") {
        const tableRow = await knex("cms_model")
          .where("id", modIdRow.mid)
          .select("tableName")
          .first();

        if (tableRow?.tableName) {
          const fieldData = await knex(tableRow.tableName)
            .where("aid", id)
            .first();

          field = fieldData || {};
        }
      }

      return { ...data, field };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 搜索文章（标题 + 栏目）
  async search(key = "", cur = 1, pageSize = 10, cid = 0) {
    try {
      const keyword = key.trim();
      const page = Math.max(1, parseInt(cur) || 1);
      const limit = Math.max(1, parseInt(pageSize) || 10);
      const offset = (page - 1) * limit;

      // 转义 LIKE 特殊字符：% _ \
      const escapeLike = str => str.replace(/[%_\\]/g, '\\$&');
      const safeKey = keyword ? `%${escapeLike(keyword)}%` : '%';

      let countQuery = knex("cms_article as a")
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .count("* as count");

      let listQuery = knex("cms_article as a")
        .select(
          "a.id", "a.title", "a.attr", "a.tagId", "a.description",
          "a.cid", "a.pv", "a.createdAt", "a.status",
          "c.name", "c.path", "c.type"
        )
        .leftJoin("cms_category as c", "a.cid", "c.id")
        .orderBy("a.id", "desc")
        .offset(offset)
        .limit(limit);

      if (keyword) {
        countQuery = countQuery.where("a.title", "LIKE", safeKey);
        listQuery = listQuery.where("a.title", "LIKE", safeKey);
      }

      if (cid) {
        countQuery = countQuery.andWhere("c.id", cid);
        listQuery = listQuery.andWhere("c.id", cid);
      }

      const totalResult = await countQuery.first();
      const count = parseInt(totalResult?.count || 0, 10);
      const list = await listQuery;

      return {
        count,
        total: Math.ceil(count / limit),
        current: page,
        list
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 增加浏览量
  async count(id) {
    const result = await knex("cms_article")
      .where("id", id)
      .increment("pv", 1);
    return result ? "success" : "fail";
  },

  // 上一篇文章
  async pre(id, cid) {
    return await knex("cms_article as a")
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .where("a.id", "<", id)
      .andWhere("a.cid", cid)
      .orderBy("a.id", "desc")
      .select("a.id", "a.title", "c.name", "c.path")
      .first();
  },

  // 下一篇文章
  async next(id, cid) {
    return await knex("cms_article as a")
      .leftJoin("cms_category as c", "a.cid", "c.id")
      .where("a.id", ">", id)
      .andWhere("a.cid", cid)
      .orderBy("a.id", "asc")
      .select("a.id", "a.title", "c.name", "c.path")
      .first();
  },

  // 获取栏目对应模型的字段配置
  async findField(cid) {
    try {
      const modIdRow = await knex("cms_category")
        .where("id", cid)
        .whereNotNull("mid")
        .select("mid")
        .first();

      let fields = [];
      if (modIdRow) {
        fields = await knex("cms_field")
          .where("mid", modIdRow.mid)
          .select("cname", "ename", "type", "val", "defaultVal", "orderBy")
          .limit(12);
      }

      return { fields };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 统计数据
  async tongji() {
    const [week, message, tag, article] = await Promise.all([
      knex("cms_article")
        .count("* as count")
        .where("createdAt", ">=", knex.raw("DATE_SUB(CURDATE(), INTERVAL 7 DAY)"))
        .first(),

      knex("cms_message").count("* as count").first(),
      knex("cms_tag").count("* as count").first(),
      knex("cms_article").count("* as count").first(),
    ]);

    return {
      week: week.count,
      message: message.count,
      tag: tag.count,
      article: article.count,
    };
  }
};

export default ArticleService;