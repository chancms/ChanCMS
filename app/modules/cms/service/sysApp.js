class SysAppService extends Chan.Service {
  constructor() {
    super(Chan.knex, "sys_config");
  }

  async find() {
    try {
      let res = await this.one();
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async update(body) {
    const { id } = body;
    delete body.id;
    delete body.createdAt;
    delete body.updatedAt;
    try {
      const res = await super.update({query: {id}, params: body});
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

export default new SysAppService();