const {
  config: { JWT_SECRET },
  helper: { getToken },
} = Chan;

// 统一响应处理函数，减少重复代码
const sendResponse = (res, code, message, data = null) => {
  res.json({ code, msg: message, data });
};

export default () => {
  return async (req, res, next) => {
    try {
      // 1. 获取token
      const token = req.headers.token || "";
      
      // 2. 检查token是否存在
      if (!token) {
        return sendResponse(res, 401, "token缺失");
      }
      
      // 3. 验证并解析token
      const { uid, fp, ip } = await getToken(token, JWT_SECRET);
      
      // 4. 验证用户基本信息
      if (!uid || !fp) {
        return sendResponse(res, 201, "请登录");
      }
      
      // 5. 获取并验证设备信息
      const { _f, _i} = req.cookies;
      
      // 生产环境移除敏感信息打印
      console.log("user-auth-->", uid, fp, ip);
      console.log("user-auth--cookies-->", _f, _i);
      
      if (_f !== fp || _i !== ip) {
        console.log('_f->', _f, 'fp->', fp, '   _i->', _i, 'ip->', ip);
        return sendResponse(res, 202, "登录设备异常，请重新登录！");
      }
      
      // 6. 将用户信息挂载到req对象，方便后续使用
      req.user = { uid };
      
      // 7. 验证通过，继续处理
      await next();
      
    } catch (error) {
      console.error("认证错误:", error.message);
      
      // 区分不同类型的JWT错误
      const errorMap = {
        'TokenExpiredError': 'token已过期，请重新登录',
        'JsonWebTokenError': '无效的token',
        'NotBeforeError': 'token尚未生效'
      };
      
      const message = errorMap[error.name] || error.message || "认证失败";
      sendResponse(res, 401, message);
    }
  };
};
