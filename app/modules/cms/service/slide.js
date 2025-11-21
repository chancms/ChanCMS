class SlideService extends Chan.Service {
  constructor() {
    super(Chan.knex, "cms_slide");
  }

  // 新增
  async create(body) {
    try {
      const res = await this.insert(body);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 删
  async delete(id) {
    try {
      const res = await super.delete({id});
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 改
  async update(body) {
    const { id,createdAt,updatedAt,...params } = body;
    try {
      const res = await super.update({query:{id}, params});
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 列表
  async list(cur = 1, pageSize = 10) {
    try {
      const res = await this.query({
        current: cur,
        pageSize: pageSize,
        field: ["id", "title", "imgUrl", "linkUrl", "status", "sort"]
      });
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 查
  async detail(id) {
    try {
      const res = await this.findById({query: {id}});
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new SlideService();