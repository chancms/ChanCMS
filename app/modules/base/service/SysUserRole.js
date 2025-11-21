class SysUserRoleService extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_user_role");
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    try {
      const res = await this.findById({ query: { user_id: id } });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new SysUserRoleService();
