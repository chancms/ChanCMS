const {
  config,
  helper: { getIp },
  common: { success, fail },
} = Chan;

let ClientController = {
  // Express 路由：代理 IP 查询
  async ip(req, res, next) {
    const ip = req.query.ip || getIp(req);
    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.log("ClientController.ip--->", error);
      res.json({
        status: "success",
        country: "未知",
        countryCode: "未知",
        region: "未知",
        regionName: "未知",
        city: "未知",
        zip: "",
        lat: "0.0",
        lon: "0.0",
        timezone: "未知",
        isp: "未知",
        org: "",
        as: "未知",
        query: ip,
      });
    }
  },
};

export default ClientController;
