import UserSync from "../service/UserSync.js";

// 从全局对象获取配置和工具
const {
  config: {
    JWT_SECRET,
    JWT_EXPIRES_IN,
    WECHAT: { MINIPROGRAM_APPID, MINIPROGRAM_APPSECRET }
  },
  helper: { getIp, setToken, request },
  knex,
  common: { success, fail },
} = Chan;

/**
 * 微信小程序登录
 */
const login = async (req, res) => {
  try {
    const { code, userInfo } = req.body;
    const clientFp = req.cookies._f || crypto.randomBytes(8).toString("hex");
    const clientIp = req.cookies.ip || getIp(req);

    // 参数验证
    if (!code) {
      return res.status(400).json({
        ...fail,
        msg: "缺少授权码",
        code: "MISSING_AUTH_CODE",
      });
    }

    if (!MINIPROGRAM_APPID || !MINIPROGRAM_APPSECRET) {
      return res.status(500).json({
        ...fail,
        msg: "小程序配置不完整",
        code: "MINIPROGRAM_CONFIG_ERROR",
      });
    }

    // 调用微信小程序登录接口
    const sessionData = await request(
      "https://api.weixin.qq.com/sns/jscode2session",
      {
        method: "GET",
        params: {
          appid: MINIPROGRAM_APPID,
          secret: MINIPROGRAM_APPSECRET,
          js_code: code,
          grant_type: "authorization_code",
        },
      }
    );

    if (sessionData.errcode) {
      return res.status(400).json({
        ...fail,
        msg: `小程序登录失败：${sessionData.errmsg}`,
        code: `WECHAT_${sessionData.errcode}`,
      });
    }

    const { openid, session_key, unionid } = sessionData;

    // 构建用户信息对象
    const completeUserInfo = {
      openid,
      unionid: unionid || null,
      nickname: userInfo?.nickName || `小程序用户_${openid.slice(-6)}`,
      headimgurl: userInfo?.avatarUrl || '',
      sex: userInfo?.gender || 0,
      city: userInfo?.city || '',
      country: userInfo?.country || '',
      province: userInfo?.province || '',
    };

    // 同步用户数据到本地数据库
    const { userId } = await UserSync.syncWeChatUser({
      userInfo: completeUserInfo,
      tokenData: {
        access_token: session_key,
        refresh_token: '',
        expires_in: 7200,
      },
      ip: clientIp,
    });

    // 生成JWT token
    const token = setToken(
      { uid: userId, fp: clientFp, ip: clientIp },
      JWT_SECRET,
      JWT_EXPIRES_IN
    );

    res.json({
      ...success,
      data: {
        token,
        openid,
        unionid,
        nickname: completeUserInfo.nickname,
        avatar: completeUserInfo.headimgurl,
        session_key, // 返回session_key供前端使用
      },
      msg: "小程序登录成功",
    });

  } catch (error) {
    console.error("小程序登录失败:", error);
    const msg = error.response?.errcode
      ? `小程序登录失败：${error.response.errmsg}`
      : "登录失败，请重试";
    res.status(500).json({ ...fail, msg });
  }
};


export default {
  login
};