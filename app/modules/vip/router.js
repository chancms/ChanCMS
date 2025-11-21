const { loadController } = Chan.helper;

let controller = await loadController("vip");

export default (app, router, config) => {
  router.get("/file/tree", controller.CodeFile.tree);
  router.get("/file/content", controller.CodeFile.content);
  router.post("/file/save", controller.CodeFile.save);
  router.get("/file/oss", controller.CodeFile.oss);

  //配置前缀
  app.use("/vip/v1", router);
};
