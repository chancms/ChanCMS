const {
  helper: { getIp },
} = Chan;
/**
 * @description 全局路由
 * @param {*} app - app实例
 * @param {*} router - 路由实例
 * @param {*} config - 配置
 * @returns
 */
const routers = (app, router, config) => {
  const { template = "default" } = config;


  //404处理
  router.use((req, res, next) => {
    console.error(`[异常访问-404]  url-->:${req.url} ip-->:${getIp(req)} UA-->:${req.get("User-Agent")}`);
    res.render(`${template}/404.html`, { url: req.url });
  });

  //500处理错误
  router.use((err, req, res) => {
    let data = {
      message: err.message,
      url: req.url,
      method: req.method,
    };
    let other = {
      stack: err.stack,
      ip: getIp(req),
      userAgent: req.get("User-Agent") || "",
      referer: req.get("Referer") || "",
    };
    console.error(`[接口异常-500]-->`, data, other);
    if (req.is("html") || req.is("html") == null) {
      res.render(`${template}/500.html`, { data });
    } else {
      res.json({ code: 500, data }); // 已移除冗余msg字段
    }
  });
};

export default routers;
