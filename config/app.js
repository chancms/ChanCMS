export const APP_NAME = "ChanCMS";
export const APP_VERSION = "3.3.1";
export const APP_VERSION_TIME = "2025-09-06";
export const APP_AUTHOR_EMAIL = "867528315@qq.com";
export const APP_AUTHOR_WECHAT = "yanyutao2014";
export const port = process.env.PORT || "3000";
export const cors = {
  origin: process.env.CORS_ORIGIN || "*", //或者['http://localhost:8080', 'http://localhost:8081']
};
export const BODY_LIMIT = process.env.BODY_LIMIT || "100kb";


export default {
  APP_NAME,
  APP_VERSION,
  APP_VERSION_TIME,
  APP_AUTHOR_EMAIL,
  APP_AUTHOR_WECHAT,
  port,
  cors,
  BODY_LIMIT,
}