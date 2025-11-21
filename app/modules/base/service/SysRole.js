class SysRoleService extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_role");
  }

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    try {
      const res = await this.findById({ query: { id } });
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
  async list(query) {
    try {
      let res = await this.query({
        current: 1,
        pageSize: this.pageSize,
        query,
        field: ["id", "name", "key", "sort", "status", "create_time"],
      });
      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 增
  async create({ roleData, menuIds }) {
    try {
      // 等待事务完成
      const result = await this.knex.transaction(async (trx) => {
        // 插入角色数据并获取新插入行的 id
        const [roleId] = await trx(this.model).insert(roleData).returning("id");

        // 准备要插入到 sys_role_menu 表的数据
        const roleMenuData = menuIds.map((menuId) => ({
          role_id: roleId,
          menu_id: menuId,
        }));

        // 将角色和菜单的关联信息插入到 sys_role_menu 表中
        if (roleMenuData.length > 0) {
          await trx("sys_role_menu").insert(roleMenuData);
        }

        // 返回结果或确认信息
        return roleId;
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  //改
  async update({ roleId = 0, roleData = {}, menuIds = [] } = {}) {
    return this.knex.transaction(async (trx) => {
      try {
        // 更新 sys_role 表
        if (Object.keys(roleData).length > 0) {
          await trx("sys_role").where("id", roleId).update(roleData);
        }

        // 查询现有的菜单ID
        const existingMenuIdsResult = await trx("sys_role_menu")
          .select("menu_id")
          .where("role_id", roleId);
        const existingMenuIds = existingMenuIdsResult.map(
          (item) => item.menu_id
        );

        // 找出需要删除的菜单ID（即存在于数据库中但不在新菜单列表中的）
        const idsToDelete = existingMenuIds.filter(
          (id) => !menuIds.includes(id)
        );

        // 删除这些菜单ID的关联
        if (idsToDelete.length > 0) {
          await trx("sys_role_menu")
            .whereIn("menu_id", idsToDelete)
            .andWhere("role_id", roleId)
            .del();
        }

        // 准备插入的新菜单关联数据
        const insertData = menuIds
          .filter((menuId) => !existingMenuIds.includes(menuId))
          .map((menuId) => ({
            role_id: roleId,
            menu_id: menuId,
          }));

        // 插入新的菜单关联
        if (insertData.length > 0) {
          await trx("sys_role_menu").insert(insertData);
        }

        return true; // 表示操作成功
      } catch (error) {
        console.error("Error updating role and menus:", error);
        throw error; // 抛出错误以便调用者知道操作失败
      }
    });
  }
}

export default new SysRoleService();
