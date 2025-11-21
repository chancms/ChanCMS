class SiteService extends Chan.Service {
  constructor() {
    super(Chan.knex, "cms_site");
  }

  // 基本信息
  async info() {
    try {
      let res = await this.one();
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // 更新基本信息
  async updateInfo(body) {
    const { id, ...params } = body;
    try {
      const res = await this.update({query:{id:id}, params});
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new SiteService();