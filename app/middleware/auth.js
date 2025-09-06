const {
  knex,
  config: {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH,
  
  },
  helper: {
   setToken, getToken
  },
} = Chan;
import configService from "../modules/base/service/Config.js";

export default (permsStr) => {
  return async (req, res, next) => {
    const token = req.cookies.token || req.headers.token || "";
    if (token) {
      try {
        const { username, uid, exp } = await getToken(token, JWT_SECRET);

        if (username && uid && JWT_REFRESH) {
          // 计算 token 剩余有效时间
          const currentTime = Math.floor(Date.now() / 1000);
          const remainingTime = exp - currentTime;
          const refreshThreshold = 30 * 60; // 30分钟
          if (remainingTime < refreshThreshold) {
            const newToken = setToken({ username, uid }, JWT_SECRET, JWT_EXPIRES_IN);
            res.cookie("token", newToken, { httpOnly: true });
          }
        }

        if (permsStr) {
          let permsRes = await configService.allPerms(uid);
          const hasAction = permsRes
            .filter((item) => item.perms)
            .map((item) => item.perms)
            .includes(permsStr);

          if (!hasAction) {
            res.json({
              code: 402,
              msg: "暂无权限",
            });
            return;
          }
        }

        await next();
      } catch (error) {
        console.error("token-->", error);
        res.json({
          code: 401,
          msg: error.message || "认证失败",
        });
      }
    } else {
      res.json({
        code: 401,
        msg: "token缺失",
      });
    }
  };
};