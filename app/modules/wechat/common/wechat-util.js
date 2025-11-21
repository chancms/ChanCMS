import crypto from "node:crypto";
import { parseString } from "xml2js";

// 从全局对象获取配置（所有功能共用的微信配置）
const {
  config: {
    WECHAT: { APPID, APPSECRET, TOKEN },
  },
  helper: { request },
} = Chan;

/**
 * XML转JSON（微信事件推送解析用）
 */
export const xml2json = (xmlStr) => {
  return new Promise((resolve, reject) => {
    parseString(
      xmlStr,
      {
        explicitArray: false,
        ignoreAttrs: true,
        trim: true,
      },
      (err, result) => {
        if (err) reject(new Error(`XML解析错误: ${err.message}`));
        else resolve(result?.xml || {});
      }
    );
  });
};

/**
 * 生成随机字符串（签名、扫码标识等场景用）
 */
export const createNonceStr = (length = 16) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

/**
 * 计算微信签名（JS-SDK、事件回调验证用）
 */
export const calculateSignature = (params) => {
  const sortedKeys = Object.keys(params).sort();
  const string1 = sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
  return crypto.createHash("sha1").update(string1).digest("hex");
};

/**
 * 获取微信全局access_token（通用接口调用凭证）
 */
export const getGlobalAccessToken = async () => {
  const response = await request("https://api.weixin.qq.com/cgi-bin/token", {
    method: "GET",
    params: {
      grant_type: "client_credential",
      appid: APPID,
      secret: APPSECRET,
    },
  });

  if (response.errcode) {
    throw new Error(
      `获取access_token失败：${response.errmsg}（${response.errcode}）`
    );
  }
  return response.access_token;
};

/**
 * 获取jsapi_ticket（微信分享用）
 */
export const getJsapiTicket = async () => {
  const accessToken = await getGlobalAccessToken();
  const response = await request(
    "https://api.weixin.qq.com/cgi-bin/ticket/getticket",
    {
      method: "GET",
      params: { access_token: accessToken, type: "jsapi" },
    }
  );

  if (response.errcode !== 0) {
    throw new Error(
      `获取jsapi_ticket失败：${response.errmsg}（${response.errcode}）`
    );
  }
  return response.ticket;
};

/**
 * 验证微信事件回调签名（扫码登录事件用）
 */
export const verifyEventSignature = (signature, timestamp, nonce) => {
  if (!TOKEN) throw new Error("公众号TOKEN未配置");
  const signArr = [TOKEN, String(timestamp), String(nonce)].sort();
  const signStr = signArr.join("");
  const signResult = crypto.createHash("sha1").update(signStr).digest("hex");
  return signResult === signature;
};

/**
 * 生成唯一扫码标识（扫码登录用）
 */
export const generateScanId = () =>
  `scan_${crypto.randomBytes(12).toString("hex")}`;
