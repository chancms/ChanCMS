
const { loadController } = Chan.helper;
let controller = await loadController("wechat");
import {chatRefreshToken} from "./middleware/wechatRefreshToken.js"

export default (app, router, config) => {
  //用户
  router.get("/auth", controller.Auth.authorize);
  router.get("/callback", controller.Auth.callback);
  router.post("/shareConfig", controller.Auth.getShareConfig);
  // router.get("/userinfo", chatRefreshToken, controller.Auth.getUserInfo);
  //配置前缀
  app.use("/wechat/v1", router);
};
