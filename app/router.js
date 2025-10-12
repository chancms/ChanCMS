import path from "path";
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

  //爬虫禁止访问
  router.get("/robots.txt", function (req, res, next) {
    res.type("text/plain");
    res.sendFile(path.join(ROOT_PATH, "/public/robots.txt"));
  });

  //404处理
  router.use((req, res, next) => {
    console.error("[异常访问] 404-->:", {
      url: req.url,
      ip: getIp(req),
      userAgent: req.get("User-Agent") || "",
    });
    res.render(`${template}/404.html`, { url: req.url });
  });

  //500处理错误
  router.use((err, req, res) => {
    console.error(`[异常500] 500--> ${req.method}-${req.url}-${err.stack}`);
    let data = { url: req.url, method: req.method, error: err.stack };
    if (req.is("html") || req.is("html") == null) {
      res.render(`${template}/500.html`, { data });
    } else {
      res.json({ code: 500, data, msg: data.error });
    }
  });
};

export default routers;
