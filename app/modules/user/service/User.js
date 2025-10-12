
const {
  knex
} = Chan;

let model = "user";
let db = Chan.Service(knex,model);
const pageSize = 100;

let UserService = {


 async findUser(username) {
      const res = await db.query({
        query: { username },
        field: ["id", "username","email","password"],
      });
      return res;
  },


  async queryPass(id) {
    const res = await db.query({
      query: { id },
      field: ["password"],
    });
    return res;
},

  async find(email) {
      const res = await db.query({
        query: { email },
        field: ["id", "email"],
      });
      return res;
  },

  /**
   * @description 根据菜单ID查找菜单信息
   * @param {number} id - 菜单ID
   * @returns {Promise<Object|null>} 返回找到的菜单对象或null
   */
  async detail(id) {
    const res = await db.findById({
      query: { id },
      field: [
        "id", 
        "username",
        "sex",
        "email",
        "wechat", 
        "phone", 
        "avatar", 
        "status",
        "created_at",
        "remark",
        "login_date"
      ],
    });

    return res;
  },

  /**
   * @description 删除菜单
   * @param {number} id - 要删除的菜单ID
   * @returns {Promise<boolean>} 操作是否成功
   */
  async delete(id) {
    let res = await db.delete({ id });
    return res;
  },

 // 增
 async create(body) {
  try {
    const result = await db.insert(body);
    return result;
  } catch (err) {
    console.error('sql error--->',err);
    throw err;
  }
},

  //改
  async update({ query, params }) {
    const result = await db.update({ query, params });
    return result;
  }
}

export default UserService;
