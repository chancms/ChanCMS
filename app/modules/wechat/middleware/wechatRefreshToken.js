const {
  helper: { request },
  knex,
  config,
  common: { success, fail },
} = Chan;

const {
  WECHAT: { APPID },
} = config;

/**
 * 中间件：确保微信 access_token 有效，自动刷新
 * 注入：req.wechat_access_token
 * 适用场景是处理用户级别的 OAuth access_token，专门适用于以下场景：当业务需要调用微信 “用户级 OAuth 接口” 时（例如：
sns/userinfo（获取用户详细信息）
sns/auth（验证用户登录态）
其他带 sns/ 前缀的接口接口
 */
export async function chatRefreshToken(req, res, next) {
  const { openid } = req.query;

  if (!openid) {
    return res.status(400).json({ ...fail, msg: "缺少 openid" });
  }

  try {
    // 1. 查询数据库
    const record = await knex("user_social_login")
      .where({ platform: "wechat", openid })
      .first();

    if (!record || !record.access_token) {
      return sendAuthExpired(res);
    }

    const { access_token, refresh_token } = record;

    // 2. 验证 access_token 是否有效
    const testData = await request("https://api.weixin.qq.com/sns/userinfo", {
      method: "GET",
      params: {
        access_token,
        openid,
        lang: "zh_CN",
      },
      // ✅ 使用 request，无需手动处理 fetch + json()
    });

    if (!testData.errcode) {
      req.wechat_access_token = access_token;
      return next();
    }

    // 3. 如果 access_token 失效，尝试刷新
    if ([40001, 42001].includes(testData.errcode)) {
      if (!refresh_token) {
        return sendAuthExpired(res);
      }

      const refreshData = await request(
        "https://api.weixin.qq.com/sns/oauth2/refresh_token",
        {
          method: "GET",
          params: {
            appid: APPID,
            grant_type: "refresh_token",
            refresh_token,
          },
        }
      );

      if (refreshData.errcode) {
        // refresh_token 失效，清理
        await knex("user_social_login")
          .where({ platform: "wechat", openid })
          .update({ access_token: null, refresh_token: null });

        return sendAuthExpired(res);
      }

      const {
        access_token: newToken,
        refresh_token: newRefreshToken,
        expires_in,
      } = refreshData;

      await knex("user_social_login")
        .where({ platform: "wechat", openid })
        .update({
          access_token: newToken,
          refresh_token: newRefreshToken,
          expires_in,
          updated_at: new Date(),
        });

      req.wechat_access_token = newToken;
      return next();
    } else {
      // 其他微信错误（如 openid 无效等）
      console.warn("微信接口错误:", testData);
      return res.status(400).json({
        ...fail,
        msg: testData.errmsg || "授权异常",
      });
    }
  } catch (error) {
    // ✅ 所有异常（网络错误、超时、JSON 解析失败等）统一处理
    console.error("验证微信登录状态失败:", error);
    return sendAuthExpired(res); // ❗直接返回过期，让用户重新登录
  }
}

/**
 * 统一封装过期响应
 */
function sendAuthExpired(res) {
  return res.status(401).json({
    ...fail,
    msg: "登录已过期，请重新扫码授权",
    code: "WECHAT_AUTH_EXPIRED",
    action: "reauth",
  });
}
