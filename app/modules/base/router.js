import auth  from "../../middleware/auth.js";
import init from "../../middleware/init.js";
const { loadController } = Chan.helper;
const { singleUpload, multiUpload, logo} = Chan.common;
let controller = await loadController("base");
export default (app, router, config) => {
  router.use(init());
  //菜单
  router.get("/menu/list", auth(), controller.SysMenu.list);
  router.get("/menu/detail", auth(), controller.SysMenu.detail);
  router.post("/menu/create", auth(), controller.SysMenu.create);
  router.post("/menu/update", auth(), controller.SysMenu.update);
  router.get("/menu/delete", auth(), controller.SysMenu.delete);
  router.get("/menu/allRouter", auth(), controller.SysMenu.allRouter);

  //角色
  router.get("/role/list", auth(), controller.SysRole.list);
  router.get("/role/detail", auth(), controller.SysRole.detail);
  router.post("/role/create", auth(), controller.SysRole.create);
  router.post("/role/update", auth(), controller.SysRole.update);
  router.get("/role/delete", auth(), controller.SysRole.delete);

  //角色&菜单
  router.get("/roleMenu/list", auth(), controller.SysRoleMenu.list);

  //用户
  router.post("/user/login", controller.SysUser.login);
  router.get("/user/list", auth(), controller.SysUser.list);
  router.get("/user/detail", auth(), controller.SysUser.detail);
  router.post("/user/create", auth(), controller.SysUser.create);
  router.post("/user/update", auth(), controller.SysUser.update);
  router.get("/user/delete", auth(), controller.SysUser.delete);

  //用户&角色
  router.get("/userRole/detail", auth(), controller.SysUserRole.detail);

  //配置类型
  router.get("/config-type/list", auth(), controller.ConfigType.list);
  router.get("/config-type/detail", auth(), controller.ConfigType.detail);
  router.post("/config-type/create", auth(), controller.ConfigType.create);
  router.post("/config-type/update", auth(), controller.ConfigType.update);
  router.get("/config-type/delete", auth(), controller.ConfigType.delete);

  //配置
  router.get("/config/list", auth(), controller.Config.list);
  router.get("/config/getlist", auth(), controller.Config.getlist);
  router.get("/config/detail", auth(), controller.Config.detail);
  router.post("/config/create", auth(), controller.Config.create);
  router.post("/config/update", auth(), controller.Config.update);
  router.post("/config/updateMany", auth(), controller.Config.updateMany);
  router.get("/config/delete", auth(), controller.Config.delete);

  //上传
  router.post("/upload/logo", auth(), logo(), controller.Upload.uploadImg);
  router.post("/upload/img", auth(), singleUpload(), controller.Upload.uploadImg);
  router.post("/upload/imgs", auth(), multiUpload(),controller.Upload.uploadImgs);
  router.post("/upload/file", auth(), singleUpload(), controller.Upload.uploadFile);
  router.post("/upload/files",auth(),multiUpload(),controller.Upload.uploadFiles);
  // router.post("/upload/chunk", auth(),chunk.upload,controller.Upload.chunkUpload);
  // router.post("/upload/merge", auth(),chunk.merge, controller.Upload.mergeChunk);
 
  //配置前缀
  app.use("/base", router);
};
