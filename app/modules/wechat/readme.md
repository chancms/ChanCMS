# 微信授权接口核心区别与代码实现笔记

## 一、`qrconnect` 与 `oauth2/authorize` 接口对比表
| 对比维度                | `connect/qrconnect`（扫码登录接口）                | `connect/oauth2/authorize`（网页授权接口）                  |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **所属平台**            | 微信开放平台（[open.weixin.qq.com](https://open.weixin.qq.com)） | 微信公众平台（[mp.weixin.qq.com](https://mp.weixin.qq.com)） |
| **适用场景**            | PC端网页扫码登录（官网、管理系统、后台登录） | 微信内H5授权（公众号文章链接、微信打开的H5页面） |
| **用户操作方式**        | PC端打开链接 → 手机微信扫码 → 确认授权 | 微信内点击链接 → 手动点击“同意”（静默授权免点击） |
| **必填参数差异**        | - `scope`：固定为 `snsapi_login`（仅支持此值）<br>- 无 `connect_redirect` 参数 | - `scope`：`snsapi_base`（静默）/ `snsapi_userinfo`（手动）<br>- 可加 `connect_redirect=1` 优化跳转 |
| **依赖AppID类型**       | 开放平台“网站应用”AppID（单独创建，与公众号不通用） | 公众平台“公众号/小程序”AppID（与开放平台不互通） |
| **回调域名配置位置**    | 开放平台“网站应用”→“授权回调域名” | 公众平台“公众号设置”→“功能设置”→“网页授权域名” |
| **典型错误提示**        | 1. 用公众号AppID：“AppID参数错误”<br>2. 域名未配置：“redirect_uri域名与后台配置不一致” | 1. 非微信内打开：“请在微信客户端打开链接”<br>2. 域名未配置：“redirect_uri参数错误” |
| **用户信息关联性**      | 返回的openid属于开放平台体系，与公众号openid不互通 | 返回的openid属于公众号体系，可关联公众号用户数据 |


## 二、对应代码实现（按接口区分）
### 1. `connect/qrconnect` 接口（PC扫码登录，开放平台）
```javascript
/**
 * 生成PC扫码登录二维码（依赖开放平台“网站应用”AppID）
 */
async function generatePcQrLogin(req, res) {
  try {
    const { OPEN_PLATFORM_APPID, PC_LOGIN_REDIRECT_URI } = Chan.config.WECHAT; // 开放平台AppID
    const fp = req.cookies._f || crypto.randomBytes(16).toString('hex');
    
    // 设置防CSRF的state Cookie
    res.cookie('pc_login_state', fp, {
      httpOnly: true,
      secure: Chan.config.NODE_ENV === 'production',
      maxAge: 300_000, // 5分钟有效期
      sameSite: 'lax',
      path: '/'
    });

    // 拼接qrconnect接口链接（开放平台专属）
    const qrUrl = `https://open.weixin.qq.com/connect/qrconnect?` +
      `appid=${OPEN_PLATFORM_APPID}&` +
      `redirect_uri=${encodeURIComponent(PC_LOGIN_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=snsapi_login&` + // 固定值，不可修改
      `state=${fp}#wechat_redirect`;

    res.json({
      ...Chan.common.success,
      data: { qr_url: qrUrl, expires_in: 300 }
    });
  } catch (error) {
    console.error('生成PC登录二维码失败:', error);
    res.status(500).json({ ...Chan.common.fail, msg: '生成登录二维码失败' });
  }
}

/**
 * PC扫码登录回调处理（开放平台）
 */
async function pcLoginCallback(req, res) {
  const { code, state } = req.query;
  const savedState = req.cookies.pc_login_state;
  const { OPEN_PLATFORM_APPID, OPEN_PLATFORM_APPSECRET } = Chan.config.WECHAT;

  // 1. CSRF验证
  if (!savedState || state !== savedState) {
    return res.redirect('/login?error=非法请求');
  }
  res.clearCookie('pc_login_state');

  // 2. 用code换access_token（开放平台接口）
  const tokenRes = await Chan.helper.request('https://api.weixin.qq.com/sns/oauth2/access_token', {
    method: 'GET',
    params: {
      appid: OPEN_PLATFORM_APPID,
      secret: OPEN_PLATFORM_APPSECRET,
      code,
      grant_type: 'authorization_code'
    }
  });

  // 3. 获取用户信息（开放平台用户体系）
  const userInfo = await Chan.helper.request('https://api.weixin.qq.com/sns/userinfo', {
    method: 'GET',
    params: {
      access_token: tokenRes.access_token,
      openid: tokenRes.openid,
      lang: 'zh_CN'
    }
  });

  // 4. 后续：同步用户数据、生成JWT等（与公众号用户区分处理）
  // ...（此处省略用户同步、token生成逻辑）

  res.redirect('/home?token=xxx'); // 登录成功跳转
}