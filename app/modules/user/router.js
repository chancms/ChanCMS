import init from "../../middleware/init.js";
import verifycode from "./middleware/verifycode.js";
import userauth from "./middleware/userauth.js";
const { loadController } = Chan.helper;
const { singleUpload, multiUpload, logo } = Chan.common;
let controller = await loadController("user");

export default (app, router, config) => {
  router.use(init());
  //用户
  router.post("/sendEmail", controller.User.sendEmail);
  router.post("/register", verifycode, controller.User.register);
  router.post("/login", controller.User.login);
  router.get("/detail", userauth(), controller.User.detail);
  router.post("/checkEmail", verifycode, controller.User.checkEmail);
  router.post("/resetPass", verifycode, controller.User.resetPass);
  router.post("/updatePass", userauth(), controller.User.updatePass);
  router.post("/updateUser", userauth(), controller.User.updateUser);
  // router.get("/delete", auth(), controller.User.delete);

  //配置前缀
  app.use("/user/v1", router);
};
