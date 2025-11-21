const siteInfo = (req, res, next) => {
  res.setHeader("X-Powered-By", appName);
  res.setHeader("ChanCMS", version);
  next();
};
