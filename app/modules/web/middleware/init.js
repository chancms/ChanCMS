const {
  config,
  helper: { tree },
} = Chan;

import home from "../service/home.js";

export default () => {
  return async (req, res, next) => {
    try {
      let { env, appName, version, cache } = config;
      if ("site" in req.app.locals && env == "prd" && cache) {
        await next();
        return;
      }
      // 站点
      const { site, category, friendlink, frag, tag } = await home.init();
      //导航
      const nav = tree(category);
      req.app.locals = {
        ...req.app.locals,
        appName,
        version,
        site,
        nav,
        category,
        friendlink,
        frag,
        tag,
      };
      await next();
    } catch (error) {
      console.error("--->>init error", error);
      next(error);
    }
  };
};
