class SysRoleMenuService extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_role_menu");
  }

  /**
   * @description 获取分页菜单列表
   * @param {Object} options - 分页查询参数
   * @returns {Promise<Object>} 包含菜单列表、总数等信息的对象
   */
  async list(query) {
    try {
      let res = await this.query({
        current: 1,
        pageSize: this.pageSize,
        query,
        field: ["role_id", "menu_id"],
      });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new SysRoleMenuService();
