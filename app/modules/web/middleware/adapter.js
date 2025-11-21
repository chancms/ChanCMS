export default () => {
  return async (req, res, next) => {
    try {
      // 特殊路径段检查（以 .html 结尾）
      const pathSegments = req.url.split("/").filter((item) => item !== "");

      for (let item of pathSegments) {
        if (item.length > 100) {
          console.error(`错误请求路径: ${req.url}`);
          return res.status(403).send(`错误请求路径: ${req.url}`);
        }
      }

      const { content_id = "", class_id = "", page = "" } = req.query;
      if (class_id) {
        if (page) {
          res.redirect(`/list/${class_id}/index${page}.html`);
        } else {
          res.redirect(`/list/${class_id}`);
        }
        return;
      }

      if (content_id) {
        res.redirect(`/article/${content_id}.html`);
        return;
      }

      await next();
    } catch (error) {
      next(error);
    }
  };
};
