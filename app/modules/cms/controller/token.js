const {
  config: {
    JWT_SECRET, JWT_EXPIRES_IN,
  },
  helper: {
   setToken, getToken
  },
  common: {
    success, fail ,
  },
} = Chan;

let TokenController = {
  // 更新token时间
  async update(res, req, next) {
    try {
      const username = req.locals.username;
      const uid = req.locals.uid;
      const token = setToken({ username, uid }, JWT_SECRET, JWT_EXPIRES_IN);
      res.json({ ...success, data: { token } });
    } catch (err) {
      next(err);
    }
  },

  // 校验token是否正确
  async check(req, res, next) {
    try {
      const token = req.query.token;
      const res = await getToken(token, JWT_SECRET);
      res.json({ ...success, data: { ...res } });
    } catch (err) {
      next(err);
    }
  }
}

export default TokenController;
