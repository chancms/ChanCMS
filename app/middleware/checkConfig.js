const {
  knex,
  config: { APP_DEBUG },
  common: { fail },
} = Chan;

export const checkConfig = () => {
  return (req, res, next) => {
    if (!APP_DEBUG) {
      // JWT密钥校验（禁止默认值）
      if (process.env.JWT_SECRET === "ChanCMS") {
        res.json({ ...fail, msg: "JWT_SECRET 不能使用默认值 ChanCMS" });
      }
      // 数据库密码校验（禁止默认值）
      if (process.env.DB_PASS === "123456") {
        res.json({ ...fail, msg: 'DB_PASS 不能使用默认密码 "123456"' });
      }
    }

    next();
  };
};
