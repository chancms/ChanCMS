import UserSync from "../service/UserSync.js";
// 从全局对象获取配置和工具
const {
  config: {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    WECHAT: { APPID, APPSECRET, REDIRECT_URI },
  },
  helper: { getIp, setToken, request },
  knex,
  common: { success, fail },
} = Chan;

/**
 * 生成OAuth授权二维码（引导用户授权）
 */
const authorize = async (req, res) => {
  try {
    const fp = req.cookies._f || crypto.randomBytes(8).toString("hex");
    // 设置state Cookie防CSRF
    res.cookie("wechat_oauth_state", fp, {
      httpOnly: true,
      secure: Chan.config.NODE_ENV === "production",
      maxAge: 300_000, // 5分钟
      sameSite: "lax",
    });

    const scope = "snsapi_userinfo"; // 非静默授权
    const wechatQrUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${encodeURIComponent(
      `${REDIRECT_URI}/public/user/index.html#/login`
    )}&response_type=code&scope=${scope}&state=${fp}&connect_redirect=1#wechat_redirect`;

    res.json({
      ...success,
      data: { qr_url: wechatQrUrl, expires_in: 300 },
    });
  } catch (error) {
    console.error("生成OAuth二维码失败:", error);
    res.status(500).json({ ...fail, msg: "生成二维码失败，请稍后重试" });
  }
};

/**
 * OAuth授权回调处理
 */
const callback = async (req, res) => {
  const { code, state } = req.query;
  const clientFp = req.cookies._f || crypto.randomBytes(8).toString("hex");
  const clientIp = req.cookies.ip || getIp(req);

  try {
    // 验证state防CSRF
    const savedState = req.cookies.wechat_oauth_state;
    if (!savedState || state !== savedState) {
      return res.json({ ...fail, msg: "请求非法，请重新扫码", code: "403" });
    }
    res.clearCookie("wechat_oauth_state");

    if (!code) {
      return res.json({
        ...fail,
        msg: "缺少授权码",
        code: "MISSING_AUTH_CODE",
      });
    }

    // 获取OAuth token
    const tokenData = await request(
      "https://api.weixin.qq.com/sns/oauth2/access_token",
      {
        method: "GET",
        params: {
          appid: APPID,
          secret: APPSECRET,
          code,
          grant_type: "authorization_code",
        },
      }
    );

    // 获取用户信息
    const userInfo = await request("https://api.weixin.qq.com/sns/userinfo", {
      method: "GET",
      params: {
        access_token: tokenData.access_token,
        openid: tokenData.openid,
        lang: "zh_CN",
      },
    });

    // 同步用户数据（复用公共用户同步方法）
    const { userId } = await UserSync.syncWeChatUser({
      userInfo,
      tokenData,
      ip: clientIp,
    });

    // 生成JWT
    const token = setToken(
      { uid: userId, fp: clientFp, ip: clientIp },
      JWT_SECRET,
      JWT_EXPIRES_IN
    );

    res.json({
      ...success,
      data: {
        token,
        openid: userInfo.openid,
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl,
      },
    });
  } catch (error) {
    console.error("OAuth回调处理失败:", error);
    const msg = error.response?.errcode
      ? `授权失败：${error.response.errmsg}`
      : "登录失败，请重试";
    res.status(400).json({ ...fail, msg });
  }
};

export default { authorize, callback };
