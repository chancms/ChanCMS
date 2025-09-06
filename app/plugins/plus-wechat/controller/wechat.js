const {
  config,
  common: {
    success, fail ,
  },
} = Chan;
class WechatController {
  //微信小程序登录
  async login(req, res, next) {
    try {
      const { code, userInfo } = req.body;
      const { appid, secret } = config.weixin;
      const { avatarUrl, nickName } = userInfo;
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
      const result = await fetch(url);
      const { openid, session_key, unionid } = result.json();
      // 设置token
      const token = setToken(
        { openid: openid },
        config.JWT_SECRET,
        config.JWT_EXPIRES_IN
      );
      // console.log(req.headers)
      // 加密返回token,获取token解密然后通过openid或者unionid来查询
      // openid: "oy9xU5F3p5UPSRv3D8lhEfJkbqGI"
      // userInfo:
      // avatarUrl: ""
      // city: ""
      // country: ""
      // gender: 0
      // language: "zh_CN"
      // nickName: "明空"
      // province: ""
      res.json({
        ...success,
        data: {
          openid,
          token,
          avatarUrl,
          nickName,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default WechatController;
