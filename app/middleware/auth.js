const {
  config: { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH, APP_DEBUG },
  helper: { setToken, getToken },
} = Chan;
import configService from "../modules/base/service/Config.js";

const REFRESH_THRESHOLD = 30 * 60; // 30分钟
// 统一响应处理函数，减少重复代码
const sendResponse = (res, code, message, data = null) => {
  res.json({ code, msg: message, data });
};
export default (permsStr) => {
  if (permsStr && typeof permsStr !== "string") {
    throw new Error("权限参数必须是字符串");
  }

  return async (req, res, next) => {
    try {
      const token = req.headers.token || "";

      // 2. 检查token是否存在
      if (!token) {
        return sendResponse(res, 401, "token缺失");
      }
      // 3. 验证并解析token
      const { username, uid, f, i, exp } = await getToken(token, JWT_SECRET);

      // 4. 验证用户基本信息
      if (!username || !uid || !f || !i || !exp) {
        return sendResponse(res, 201, "请登录");
      }

      // 5. 获取并验证设备信息
      const { _f, _i } = req.cookies;

      if (_f !== f || _i !== i) {
        return sendResponse(res, 202, "登录设备异常，请重新登录！");
      }

      // 6. 验证token是否过期，如果过期，则刷新token
      if (JWT_REFRESH) {
        const currentTime = Math.floor(Date.now() / 1000);
        const remainingTime = exp - currentTime;

        if (remainingTime <= 0) {
          return sendResponse(res, 401, "认证失败：token已过期");
        } else if (remainingTime < REFRESH_THRESHOLD) {
          res.cookie(
            "token",
            setToken({ username, uid }, JWT_SECRET, JWT_EXPIRES_IN),
            { httpOnly: true }
          );
        }
      }

      // 7. 验证权限
      if (permsStr) {
        const permsRes = await configService.allPerms(uid);
        if (!permsRes.some((item) => item.perms === permsStr)) {
          return res.json({ code: 402, msg: "暂无权限" });
        }
      }

      // 8. 验证通过，将用户信息存入req中，供后续中间件使用
      req.user = { username, uid };

      // 9. 继续处理请求
      await next();
    } catch (error) {
      console.error("认证错误:", error);
      // 区分不同类型的JWT错误
      const errorMap = {
        TokenExpiredError: "token已过期，请重新登录",
        JsonWebTokenError: "无效的token",
        NotBeforeError: "token尚未生效",
      };
      const message = errorMap[error.name] || error.message || "认证失败";
      sendResponse(res, 401, message);
    }
  };
};
