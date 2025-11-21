class Config extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_config");
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    try {
      const res = await this.findById({
        query: { id },
        field: [
          "id",
          "type_code",
          "config_key",
          "config_value",
          "status",
          "remark",
        ],
      });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    try {
      let res = await super.delete({ id });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含菜单列表、总数等信息的对象
   */
  async list({
    query,
    field = [
      "id",
      "type_code",
      "config_key",
      "config_value",
      "status",
      "remark",
    ],
  }) {
    try {
      let res = await this.query({
        current: 1,
        pageSize: this.pageSize,
        query,
        field,
      });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 增
  async create(body) {
    try {
      const res = await this.insert(body);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(body) {
    const { id, ...params } = body;
    try {
      const res = await this.update({ query: { id: id }, params });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async updateMany(updates = []) {
    try {
      const res = await this.updateMany(updates);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new Config();
