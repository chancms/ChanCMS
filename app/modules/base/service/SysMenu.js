class SysMenuService extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_menu");
  }

  // 获取角色关联的所有菜单ID，包括所有层级的父级菜单
  async getAllMenuIdsWithParents(roleIds) {
    // 步骤1: 获取角色直接关联的菜单ID
    const directMenus = await Chan.knex("sys_role_menu")
      .select("menu_id")
      .whereIn("role_id", roleIds);

    let allMenuIds = [...new Set(directMenus.map((menu) => menu.menu_id))];

    if (allMenuIds.length === 0) {
      return [];
    }

    // 步骤2: 循环获取所有父级菜单ID
    while (true) {
      // 获取当前所有菜单ID对应的父级ID
      const parentMenus = await Chan.knex("sys_menu")
        .select("pid")
        .whereIn("id", allMenuIds)
        .where("pid", "!=", 0); // 排除根节点

      const parentIds = [...new Set(parentMenus.map((menu) => menu.pid))];

      // 筛选出不在已有菜单ID列表中的父级ID
      const newParentIds = parentIds.filter((pid) => !allMenuIds.includes(pid));

      // 如果没有新的父级ID，退出循环
      if (newParentIds.length === 0) {
        break;
      }

      // 将新的父级ID添加到菜单ID列表中
      allMenuIds = [...allMenuIds, ...newParentIds];
    }

    return allMenuIds;
  }

  async allRouter(userId) {
    try {
      // Step 1: 根据 user_id 查找 role_id
      const roles = await Chan.knex("sys_user_role")
        .select("role_id")
        .where("user_id", userId);

      const roleIds = roles.map((role) => role.role_id);

      if (roleIds.length === 0) {
        return { perms: [], routers: [] };
      }

      // Step 2: 获取所有相关的菜单ID，包括所有父级
      const allMenuIds = await this.getAllMenuIdsWithParents(roleIds);

      if (allMenuIds.length === 0) {
        return { perms: [], routers: [] };
      }

      // Step 3: 根据所有菜单ID查找具体的菜单信息
      let menuDetails = await Chan.knex("sys_menu")
        .whereIn("id", allMenuIds)
        .select([
          "id",
          "pid",
          "title",
          "name",
          "path",
          "component",
          "icon",
          "perms",
          "type",
          "is_show",
        ])
        .whereNot("type", "F");

      // 提取 perms 到单独的数组
      const perms = menuDetails
        .filter((menu) => menu.perms)
        .map((menu) => menu.perms);

      return { perms, routers: menuDetails };
    } catch (error) {
      console.error("Error fetching user menus:", error);
      throw error;
    }
  }

  async allPerms(userId) {
    try {
      //Step 1: 根据 user_id 查找 role_id
      const roles = await Chan.knex("sys_user_role")
        .select("role_id")
        .where("user_id", userId);

      const roleId = roles.map((role) => role.role_id);

      if (roleId.length === 0) {
        return [];
      }

      // Step 2: 根据 role_id 查找 menu_id
      const menus = await Chan.knex("sys_role_menu")
        .select("menu_id")
        .whereIn("role_id", [roleId]);

      const menuIds = menus.map((menu) => menu.menu_id);

      if (menuIds.length === 0) {
        return [];
      }

      // Step 3: 根据 menu_id 查找具体的菜单perms信息
      const res = await Chan.knex("sys_menu")
        .whereIn("id", menuIds)
        .select(["perms"]);
      return res;
    } catch (error) {
      console.error("Error fetching user menus:", error);
      throw error;
    }
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
        field: [
          "id",
          "name",
          "pid",
          "order_num",
          "path",
          "component",
          "title",
          "is_frame",
          "is_show",
          "perms",
          "icon",
          "type",
        ],
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

  //改
  async update(body) {
    const { id, ...params } = body;
    try {
      const res = await super.update({ query: { id: id }, params });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new SysMenuService();
