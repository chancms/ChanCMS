import path from "path";
const {
  knex,
  // helper: {
  //   utils: { filterImgFromStr, delImg },
  // },
  common: {
    filterImgFromStr, delImg
  }
} = Chan;

let model = "cms_article";
let db = Chan.Service(knex, model);
const pageSize = 100;

async function getImgsByArticleId(id, arr) {
  const imgStr = ` SELECT img,content FROM cms_article WHERE id=${id}`;
  const img = await knex.raw(imgStr, []);

  if (img[0].length > 0) {
    if (img[0][0].img) {
      arr.push(img[0][0].img);
    }
    const contImgArr = filterImgFromStr(img[0][0].content);
    for (let i = 0; i < contImgArr.length; i++) {
      arr.push(contImgArr[i]);
    }
  }
}
let ArticleService ={
  // 增
  async create(body) {
    try {
      let res, mapTag;
      const { defaultParams, fieldParams } = body;

      await knex.transaction(async (trx) => {
        const result = await knex(model)
          .insert(defaultParams)
          .transacting(trx);
        if (result[0]) {
          // 获取最后一个文章id和栏目id
          const lastStr = `SELECT id, cid FROM ${model} ORDER BY id DESC LIMIT 1`;
          const lastId = await knex.raw(lastStr, []).transacting(trx);
          const { id, cid } = lastId[0][0];

          // 通过栏目id查找模型id
          const modIdStr = `SELECT mid FROM cms_category WHERE id=${cid} LIMIT 1`;
          const modId = await knex.raw(modIdStr, []).transacting(trx);

          // 通过模型查找表名
          if (modId[0].length > 0) {
            const tableNameStr = `SELECT tableName FROM cms_model WHERE id=${modId[0][0].mid} LIMIT 1`;
            const tableName = await knex.raw(tableNameStr, []).transacting(trx);

            // 新增模型文章
            if (tableName[0].length > 0) {
              const fields = { ...fieldParams, aid: id };
              res = await knex(`${tableName[0][0].tableName}`)
                .insert(fields)
                .transacting(trx);
            }
          }

          // 新增文章和标签关联
          if (defaultParams.tagId.length > 0) {
            const tags = defaultParams.tagId.split(",");

            const tagsql = [];
            tags.forEach((item) => {
              tagsql.push(`(${id},${item})`);
            });
            if (tags.length > 0) {

              mapTag = await knex
                .raw(
                  `INSERT INTO cms_articletag(aid, tid) VALUES ${tagsql.join(
                    ","
                  )}`,
                  []
                )
                .transacting(trx);

              // 更新标签表中的count字段
              const updateSql = `
              UPDATE cms_tag
              SET count = count + 1
              WHERE id IN (${tags.join(",")})
            `;
              await knex.raw(updateSql).transacting(trx);
            }

            return result[0] ? "success" : "fail";
          }

        }
      });

      return "success";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 删
  async delete(id) {
    try {
      const ids = id.split(",");
      // 删除文章图片
      let arr = [];
      await knex.transaction(async (trx) => {
        // 批量删除模型文章
        for (let i = 0, item; i < ids.length; i++) {
          item = ids[i];

          // 通过文章id,找栏目id
          const categoryStr = `SELECT cid FROM cms_article WHERE id=${item} LIMIT 0,1`;
          const category = await knex.raw(categoryStr, []).transacting(trx);

          // 通过栏目id查找模型id
          if (category[0].length > 0) {
            const modIdStr = `SELECT mid FROM cms_category WHERE id=${category[0][0].cid} LIMIT 0,1`;
            const modId = await knex.raw(modIdStr, []).transacting(trx);

            // 通过模型查找表名
            if (modId[0].length > 0) {
              const tableNameStr = `SELECT tableName FROM cms_model WHERE id=${modId[0][0].mid} LIMIT 0,1`;
              const tableName = await knex
                .raw(tableNameStr, [])
                .transacting(trx);

              if (tableName[0].length > 0) {
                // 删除模型文章
                const delModelStr = `DELETE FROM ${tableName[0][0].tableName} WHERE aid IN(${item})`;
                await knex.raw(delModelStr, []).transacting(trx);
              }
            }
          }

          // 获取批量文章缩略图和内容图片路径
          await getImgsByArticleId(item, arr);
          // 过滤外链中的图片
          arr = arr.filter((item) => {
            return item.includes("public/upload");
          });

          // 批量删除文章缩略图和文章图片
          if (arr.length > 0) {
            for (let i = 0, item; i < arr.length; i++) {
              item = arr[i];
              delImg(path.join(__dirname, "../../" + item));
            }
          }

          // 批量删除文章
          const delArticleStr = `DELETE FROM ${model} WHERE id IN(${item})`;
          await knex.raw(delArticleStr, []).transacting(trx);

          // 删除关联的 tag
          const delMapTagStr = `DELETE FROM cms_articletag WHERE aid IN(${item})`;
          await knex.raw(delMapTagStr, []).transacting(trx);
          // 更新旧的标签关联中的 count 字段减去 1

          const oneRecord = await knex(model)
            .where("id", item)
            .select(["tagId"])
            .first();
          const tagId = oneRecord.tagId.split(",").map((item) => +item);
          const tagsSql = `
            UPDATE cms_tag
            SET count = GREATEST(0, count - 1)
            WHERE id IN (${tagId.join(",")})
            `;
          await knex.raw(tagsSql).transacting(trx);
        }
        return "success";
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 改
  async update(body) {
    try {
      const { id, field, oldTagId } = body;
      delete body.id;
      delete body.field;
      delete body.oldTagId;

      await knex.transaction(async (trx) => {
        // 通过栏目id查找模型id
        const modIdStr = `SELECT mid FROM cms_category WHERE id=${body.cid} LIMIT 0,1`;
        const modId = await knex.raw(modIdStr, []).transacting(trx);

        // 通过模型查找表名
        const tableNameStr = `SELECT tableName FROM cms_model WHERE id=${modId[0][0].mid} LIMIT 0,1`;
        const tableName = await knex.raw(tableNameStr, []).transacting(trx);
        if (tableName[0].length > 0) {
          // 判断是否是修改文章内容
          if ('id' in field) {
            await knex(`${tableName[0][0].tableName}`)
            .where("aid", "=", id)
            .update(field)
            .transacting(trx);
          }else{
            await knex(`${tableName[0][0].tableName}`)
                .insert({...field, aid: id})
                .transacting(trx);
          }
          
        }

        // 修改标签，要先全部删除关联的tag，然后再添加，因为修改标签有删除，新增等方式
        const delMapTagStr = `DELETE FROM cms_articletag WHERE aid IN(${id})`;
        await knex.raw(delMapTagStr, []).transacting(trx);

        // 更新旧的标签关联中的 count 字段减去 1
        if (oldTagId.length > 0) {
          let oldTagIds = oldTagId.split(",").map((item) => +item);
          const oldTagsSql = `
          UPDATE cms_tag
          SET count = GREATEST(0, count - 1)
          WHERE id IN (${oldTagIds.join(",")})
          `;
          await knex.raw(oldTagsSql).transacting(trx);
        }


        // 新增文章和标签关联
        if (body.tagId.length > 0) {
          const tags = body.tagId.split(",").map((item) => +item);
          const tagsql = [];
          tags.forEach((item) => {
            tagsql.push(`(${id},${item})`);
          });
          await knex
            .raw("INSERT INTO cms_articletag(aid,tid) VALUES " + tagsql.join(","))
            .transacting(trx);

          // 更新新的标签关联中的 count 字段加上 1
          const newTagsSql = `
        UPDATE cms_tag
        SET count = count + 1
        WHERE id IN (${tags.join(",")})
        `;
          await knex.raw(newTagsSql).transacting(trx);
        }
        // 修改文章
        const result = await knex(model)
          .where("id", "=", id)
          .update(body)
          .transacting(trx);
        return result ? "success" : "fail";
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 文章列表
  async list(cur = 1, pageSize = 10, id) {
    try {
      // 查询个数
      let sql;
      if (id) {
        sql = `SELECT COUNT(id) as count FROM ${model} WHERE cid IN (${id})`;
      } else {
        sql = `SELECT COUNT(id) as count FROM ${model}`;
      }
      const total = await knex.raw(sql);
      const offset = parseInt((cur - 1) * pageSize);
      let list;
      if (id) {
        list = await knex
          .select([
            "id",
            "title",
            "createdAt",
            "description",
            "pv",
            "author",
            "status",
            "img",
          ])
          .from(model)
          .where("cid", "=", id)
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc");
      } else {
        list = await knex
          .select(["id", "title", "attr", "pv", "createdAt", "status"])
          .from(model)
          .limit(pageSize)
          .offset(offset)
          .orderBy("id", "desc");
      }
      const count = total[0][0].count;
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
      // 查询文章
      const data = await knex(model).where("id", "=", id).select();

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
        field = await knex.raw(
          `SELECT * FROM ${tableName[0][0].tableName} WHERE aid=? LIMIT 0,1`,
          [id]
        );
      }

      return { ...data[0], field: field.length > 0 ? field[0][0] : {} };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 搜索
  async search(key = "", cur = 1, pageSize = 10, cid = 0) {
    try {
      // 查询个数
      let sql;
      const countSql = `SELECT COUNT(*) as count FROM  cms_article a LEFT JOIN cms_category c ON a.cid=c.id`;
      const keyStr = ` WHERE a.title LIKE \'%${key}%\'`;
      const cidStr = `  AND c.id=?`;

      if (cid === 0) {
        sql = countSql + keyStr;
      } else {
        sql = countSql + keyStr + cidStr;
      }

      const total = cid ? await knex.raw(sql, [cid]) : await knex.raw(sql, []);
      // 翻页
      const offset = parseInt((cur - 1) * pageSize);
      let sql_list = "";
      const listStart = `SELECT a.id,a.title,a.attr,a.tagId,a.description,a.cid,a.pv,a.createdAt,a.status,c.name,c.path,c.type FROM ${model} a LEFT JOIN cms_category c ON a.cid=c.id WHERE a.title LIKE  \'%${key}%\' `;
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
        current: +cur,
        list: list[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 增加计数器
  async count(id) {
    try {
      const result = await knex.raw(
        `UPDATE cms_article SET pv=pv+1 WHERE id=? LIMIT 1`,
        [id]
      );
      return result[0].affectedRows ? "success" : "fail";
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 上一篇文章
  async pre(id, cid) {
    try {
      const result = await knex.raw(
        `SELECT a.id,a.title,c.name,c.path FROM cms_article a LEFT JOIN cms_category c ON a.cid=c.id  WHERE a.id<? AND a.cid=? ORDER BY id DESC LIMIT 1`,
        [id, cid]
      );
      return result[0][0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 下一篇文章
  async next(id, cid) {
    try {
      const result = await knex.raw(
        `SELECT a.id,a.title,c.name,c.path FROM cms_article a LEFT JOIN cms_category c ON a.cid=c.id WHERE a.id>? AND a.cid=? LIMIT 1`,
        [id, cid]
      );
      return result[0][0];
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 通过栏目id获取mid，通过mid获取模型对应字段
  async findField(cid) {
    try {
      // 查询个数
      const mid = `SELECT mid FROM cms_category WHERE id=${cid} AND mid IS NOT NULL`;
      const _mid = await knex.raw(mid);
      let res = [];
      if (_mid[0].length > 0) {
        const field = `SELECT cname,ename,type,val,defaultVal,orderBy FROM cms_field WHERE mid=${_mid[0][0].mid} LIMIT 0,12`;
        res = await knex.raw(field);
      }
      return {
        fields: res[0],
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async tongji() {
    try {
      // 昨天
      // const yesterdayStr =
      //   "select count(*) AS count from cms_article where TO_DAYS(NOW())-TO_DAYS(updatedAt)<=1";
      // const yesterday = await knex.raw(yesterdayStr);

      //今天
      // const todayStr =
      //   "select count(*) AS count from cms_article where TO_DAYS(NOW())=TO_DAYS(NOW())";
      // const today = await knex.raw(todayStr);

      // 7天
      const weekStr =
        "SELECT COUNT(*) AS count from cms_article where DATE_SUB(CURDATE(),INTERVAL 7 DAY)<=DATE(createdAt)";
      const week = await knex.raw(weekStr);

      // 30天
      // const monthStr =
      //   "SELECT COUNT(*) AS count from cms_article where DATE_SUB(CURDATE(),INTERVAL 30 DAY)<=DATE(updatedAt)";
      // const month = await knex.raw(monthStr);

      //季度
      // const quarterStr =
      //   "SELECT COUNT(*) AS count from cms_article where QUARTER(createdAt)=QUARTER(NOW())";
      // const quarter = await knex.raw(quarterStr);

      //年
      // const yearStr =
      //   "SELECT COUNT(*) AS count from cms_article where YEAR(createdAt)=YEAR(NOW())";
      // const year = await knex.raw(yearStr);

      // 留言数
      const messageStr = "SELECT COUNT(id) AS count FROM cms_message LIMIT 0,1";
      const message = await knex.raw(messageStr);

      // tag
      const tagStr = "SELECT COUNT(id) AS count FROM cms_tag LIMIT 0,1";
      const tag = await knex.raw(tagStr);

      // tag
      const articleStr = "SELECT COUNT(id) AS count FROM cms_article LIMIT 0,1";
      const article = await knex.raw(articleStr);

      return {
        // yesterday: yesterday[0][0].count,
        // today: today[0][0].count,
        week: week[0][0].count,
        // month: month[0][0].count,
        // quarter: quarter[0][0].count,
        // year: year[0][0].count,
        message: message[0][0].count,
        tag: tag[0][0].count,
        article: article[0][0].count,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default ArticleService;
