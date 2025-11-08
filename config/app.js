export const APP_NAME = "ChanCMS";
export const APP_VERSION = "3.3.4";
export const APP_VERSION_TIME = "2025-10-25";
export const APP_AUTHOR_EMAIL = "867528315@qq.com";
export const APP_AUTHOR_WECHAT = "yanyutao2014";
export const PORT = process.env.PORT || "3000";
export const BODY_LIMIT = process.env.BODY_LIMIT || "100kb";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const APP_DEBUG = process.env.APP_DEBUG === "true";

export default {
  APP_NAME,
  APP_VERSION,
  APP_VERSION_TIME,
  APP_AUTHOR_EMAIL,
  APP_AUTHOR_WECHAT,
  PORT,
  BODY_LIMIT,
  NODE_ENV,
  APP_DEBUG
}