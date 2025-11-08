import {
  getJsapiTicket,
  createNonceStr,
  calculateSignature,
} from "../common/wechat-util.js";



// 从全局对象获取配置和工具
const {
  config: { NODE_ENV, AES_SALT },
  helper: { aesEncrypt, aesDecrypt },
  common: { success, fail },
} = Chan;

// Cookie键名（单独定义，避免与其他功能冲突）
const SHARE_CONFIG_COOKIE_KEY = "wx_share_config";

/**
 * 生成微信分享配置（JS-SDK用）
 */
const getConfig = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ ...fail, msg: "缺少页面URL参数" });
    }
    const currentUrl = url.split("#")[0];
    const now = Math.floor(Date.now() / 1000);
    let configData = null;

    // 尝试从Cookie读取缓存
    const encryptedConfig = req.cookies[SHARE_CONFIG_COOKIE_KEY];
    if (encryptedConfig) {
      try {
        const decrypted = aesDecrypt(encryptedConfig, AES_SALT);
        const parsedConfig = JSON.parse(decrypted);
        if (
          parsedConfig.shareConfig &&
          parsedConfig.expireTime &&
          parsedConfig.url === currentUrl &&
          now < parsedConfig.expireTime
        ) {
          configData = parsedConfig;
        }
      } catch (error) {
        console.warn("分享配置缓存无效，重新生成:", error);
      }
    }

    // 缓存无效时重新生成
    if (!configData) {
      const jsapiTicket = await getJsapiTicket();
      const timestamp = now;
      const nonceStr = createNonceStr();
      const signature = calculateSignature({
        jsapi_ticket: jsapiTicket,
        noncestr: nonceStr,
        timestamp,
        url: currentUrl,
      });

      configData = {
        shareConfig: {
          appId: Chan.config.WECHAT.APPID,
          timestamp,
          nonceStr,
          signature,
        },
        expireTime: timestamp + (7200 - 600), // 提前10分钟过期
        jsApiList: [
          "updateAppMessageShareData",
          "updateTimelineShareData",
          "onMenuShareAppMessage",
          "onMenuShareTimeline",
        ],
        url: currentUrl,
      };

      // 加密存Cookie
      const encrypted = aesEncrypt(configData, AES_SALT);
      res.cookie(SHARE_CONFIG_COOKIE_KEY, encrypted, {
        httpOnly: false,
        secure: NODE_ENV === "prd",
        maxAge: 86400000, // 1天
        sameSite: "lax",
        path: "/",
      });
    }

    res.json({
      ...success,
      data: {
        shareConfig: configData.shareConfig,
        jsApiList: configData.jsApiList,
      },
    });
  } catch (error) {
    console.error("获取分享配置失败:", error);
    res.status(500).json({ ...fail, msg: "获取分享配置失败，请稍后重试" });
  }
};

export default {
  getConfig,
}
