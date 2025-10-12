
export const LogError = (req, data) => {
    console.log('LogError---->',Chan.helper.getIp);
  console.error("接口异常-->:", {
    url: req.url,
    ip: Chan.helper.getIp(req),
    data
  });
};
