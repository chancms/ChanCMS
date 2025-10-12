
const { loadController } = Chan.helper;
let controller = await loadController("proxy");
console.log('proxy-->',controller.Client.ip);

export default (app, router, config) => {

  //用户
  router.get("/ip", controller.Client.ip);

  //配置前缀
  app.use("/proxy/v1", router);
};
