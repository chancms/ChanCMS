class LoginLogService extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_loginlog");
  }

  // 增加
  async create(body) {
    try {
      const res = await this.insert(body);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 删除100条之外的数据
  async delete() {
    try {
      // 获取最新的100条记录的ID
      const recentLogIds = await Chan.knex(this.model)
        .select("id")
        .orderBy("createdAt", "desc")
        .limit(100);

      // 将ID数组转换为可以用于IN子句的格式
      const idsToKeep = recentLogIds.map((row) => row.id);

      // 删除不在这些ID中的所有记录
      const res = await Chan.knex(this.model).whereNotIn("id", idsToKeep).del();
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 列表
  async list(cur = 1, pageSize = 10) {
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
}

export default new LoginLogService();
