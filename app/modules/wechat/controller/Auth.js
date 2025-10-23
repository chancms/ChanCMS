import crypto from 'node:crypto';

// 从全局对象获取配置和工具
const {
  config: { 
    NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN ,AES_SALT,
    WECHAT: { APPID, APPSECRET, REDIRECT_URI }
  },
  helper: { getIp, setToken ,request,aesEncrypt,aesDecrypt},
  knex,
  common: { success, fail },
} = Chan;

// Cookie键名（存储加密后的分享配置）
const SHARE_CONFIG_COOKIE_KEY = 'wx_share_config';

/**
 * 生成随机字符串
 * @param {number} length - 长度，默认16位
 * @returns {string} 随机字符串
 */
function createNonceStr(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 计算微信签名
 * @param {Object} params - 签名参数
 * @returns {string} SHA1签名
 */
function calculateSignature(params) {
  const sortedKeys = Object.keys(params).sort();
  const string1 = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHash('sha1').update(string1).digest('hex');
}

/**
 * 获取微信全局access_token
 * @returns {string} access_token
 */
async function getGlobalAccessToken() {
  const response = await request('https://api.weixin.qq.com/cgi-bin/token', {
    method: 'GET',
    params: {
      grant_type: 'client_credential',
      appid: APPID,
      secret: APPSECRET
    }
  });
  
  if (response.errcode) {
    throw new Error(`获取access_token失败：${response.errmsg}（${response.errcode}）`);
  }
  return response.access_token;
}

/**
 * 获取jsapi_ticket
 * @returns {string} jsapi_ticket
 */
async function getJsapiTicket() {
  const accessToken = await getGlobalAccessToken();
  const response = await request('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
    method: 'GET',
    params: {
      access_token: accessToken,
      type: 'jsapi'
    }
  });
  
  if (response.errcode !== 0) {
    throw new Error(`获取jsapi_ticket失败：${response.errmsg}（${response.errcode}）`);
  }
  return response.ticket;
}

/**
 * 生成新的分享配置
 * @param {string} url - 页面URL
 * @returns {Object} 包含配置和过期时间的对象
 */
async function generateShareConfig(url) {
  const jsapiTicket = await getJsapiTicket();
  const timestamp = Math.floor(Date.now() / 1000);
  const nonceStr = createNonceStr();
  const signature = calculateSignature({
    jsapi_ticket: jsapiTicket,
    noncestr: nonceStr,
    timestamp: timestamp,
    url: url.split('#')[0]
  });
  
  // 配置有效期：提前10分钟过期（微信凭证有效期7200秒）
  const expireTime = timestamp + (7200 - 600);
  
  return {
    shareConfig: {
      appId: APPID,
      timestamp,
      nonceStr,
      signature
    },
    expireTime,
    jsApiList: ['updateAppMessageShareData', 
      'updateTimelineShareData',
      'onMenuShareAppMessage',
      'onMenuShareTimeline',
      'menu:share:appmessage',
      'menu:share:timeline',
      ]
  };
}

/**
 * 核心接口：获取分享配置（后端管理Cookie缓存）
 * 逻辑：读取Cookie→解密→判断是否过期且URL匹配→有效则复用，否则重新生成→加密存Cookie→返回配置
 */
async function getShareConfig(req, res) {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ ...fail, msg: '缺少页面URL参数' });
    }
    const currentUrl = url.split('#')[0]; // 统一处理URL（去除#部分）
    const now = Math.floor(Date.now() / 1000);
    let configData = null;
    
    // 1. 尝试从Cookie读取并解密配置
    const encryptedConfig = req.cookies[SHARE_CONFIG_COOKIE_KEY];
    if (encryptedConfig) {
      try {
        // 使用后端封装的aesDecrypt解密
        const decrypted = aesDecrypt(encryptedConfig,AES_SALT);
        const parsedConfig = JSON.parse(decrypted);
        
        // 校验：配置有效+未过期+URL匹配
        if (
          parsedConfig.shareConfig &&
          parsedConfig.expireTime &&
          parsedConfig.url === currentUrl &&
          now < parsedConfig.expireTime
        ) {
          configData = parsedConfig;
        }
      } catch (error) {
        console.warn('Cookie配置解密或校验失败，将重新生成:', error);
        // 解密失败或格式错误，视为无效，继续生成新配置
      }
    }
    
    // 2. 配置无效/过期/不存在，重新生成
    if (!configData) {
      configData = await generateShareConfig(currentUrl);
      // 补充URL信息（用于下次校验是否匹配）
      configData.url = currentUrl;
      // 3. 加密后存入Cookie（有效期1天，实际以expireTime为准）
      const encrypted = aesEncrypt(configData,AES_SALT);

      res.cookie(SHARE_CONFIG_COOKIE_KEY, encrypted, {
        httpOnly: false, // 允许前端读取（如果需要）
        secure: NODE_ENV === 'prd',
        maxAge: 86400000, // 1天（毫秒）
        sameSite: 'lax',
        path: '/'
      });
    }
    
    // 4. 返回原始配置（前端直接使用，无需处理加密）
    res.json({
      ...success,
      data: {
        shareConfig: configData.shareConfig,
        jsApiList: configData.jsApiList
      }
    });
  } catch (error) {
    console.error('获取分享配置失败:', error);
    res.status(500).json({ ...fail, msg: '获取分享配置失败，请稍后重试' });
  }
}
/**
 * 同步微信用户信息到本地数据库
 * @param {Object} params
 * @returns {Object} { userId, openid, unionid }
 */
const syncWeChatUser = async ({ userInfo, tokenData, ip }) => {
  const { openid, nickname, headimgurl, sex, city, country, province, unionid } = userInfo;
  const { access_token, refresh_token, expires_in } = tokenData;
  const now = new Date();
  const safeNickname = (nickname || '').substring(0, 50) || `微信用户_${openid.slice(-6)}`;
  const avatar = headimgurl || '';

  let userId = null;
  let socialRecord = null;

  return await knex.transaction(async (trx) => {
    // 1. 先查询是否有已存在的社交登录记录（逻辑不变）
    socialRecord = await trx('user_social_login')
      .where('platform', 'wechat')
      .where(function () {
        unionid ? this.where('unionid', unionid) : this.where('openid', openid);
      })
      .orWhere('openid', openid)
      .first();

    if (socialRecord) {
      // 已有用户：更新数据（逻辑不变）
      userId = socialRecord.user_id;
      await trx('user')
        .where('id', userId)
        .update({
          nickname: safeNickname, // 假设已解决之前的 nickname 字段问题
          avatar,
          sex: [1, 2].includes(sex) ? sex : 0,
          login_ip: ip,
          updated_at: now,
        });

      await trx('user_social_login')
        .where('id', socialRecord.id)
        .update({
          access_token,
          refresh_token,
          expires_in,
          sex,
          country,
          province,
          city,
          updated_at: now,
        });
    } else {
      // 2. 关键修改：创建新用户时，用 MySQL 方式获取自增 ID
      // 步骤1：先插入 user 表（去掉 .returning()）
      await trx('user').insert({
        username: `wx_${Date.now().toString(36)}_${crypto.randomBytes(2).toString('hex')}`, // 确保用户名唯一
        nickname: safeNickname,
        avatar,
        sex: [1, 2].includes(sex) ? sex : 0,
        status: 1,
        login_ip: ip,
        created_at: now,
        updated_at: now,
      });

      // 步骤2：通过 LAST_INSERT_ID() 获取刚插入的 user.id（MySQL 专属语法）
      const [result] = await trx.raw('SELECT LAST_INSERT_ID() AS userId');
      userId = result[0].userId; // 此时 userId 是有效的新用户 ID

      // 3. 插入 user_social_login 表：此时 userId 已存在，不会传 DEFAULT
      await trx('user_social_login').insert({
        user_id: userId, // 传入有效 userId，解决「无默认值」问题
        platform: 'wechat',
        openid,
        unionid: unionid || null,
        access_token,
        refresh_token,
        expires_in,
        sex,
        country,
        province,
        city,
        created_at: now,
        updated_at: now,
      });
    }

    return { userId, openid, unionid };
  });
};

/**
 * 生成微信扫码二维码
 * 前端调用此接口获取二维码链接
 */
async function authorize(req, res) {
  try {
    // 生成安全 state（防 CSRF）
    // const state = crypto.randomBytes(16).toString('hex');
    let fp = req.cookies._f
    
    // 设置 httpOnly Cookie，有效期 5 分钟
    res.cookie('wechat_oauth_state', fp, {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 300_000, // 5 分钟
      sameSite: 'lax',
    });

    const scope = 'snsapi_userinfo'; // 授权登录
    const wechatQrUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI + '/public/user/index.html#/login'
    )}&response_type=code&scope=${scope}&state=${fp}&connect_redirect=1#wechat_redirect`;

    res.json({
      ...success,
      data: { qr_url: wechatQrUrl, expires_in: 300 }, // 提示前端 5 分钟过期
    });
  } catch (error) {
    console.error('生成微信二维码失败:', error);
    res.status(500).json({ ...fail, msg: '生成二维码失败，请稍后重试' });
  }
}

/**
 * 微信授权回调处理
 * 微信重定向到此接口
 */
async function callback(req, res) {
  const { code, state } = req.query;
  const clientFp = req.cookies._f // crypto.randomBytes(8).toString('hex'); // 提供默认FP值
  console.log('fp--这个时候好像还没有', clientFp,req.cookies);
  const clientIp = req.cookies.ip || getIp(req);

  try {
    // --- 1. CSRF 验证 ---
    const savedState = req.cookies.wechat_oauth_state;
    if (!savedState || state !== savedState) {

      return res.json({
        ...fail,
        msg: '请求非法，请重新扫码',
        code: '403',
      });
    }

    // 清除 state cookie
    res.clearCookie('wechat_oauth_state');

    // 缺少code参数的处理
    if (!code) {
    return res.json({
        ...fail,
        msg: '缺少授权码，请重新扫码',
        code: 'MISSING_AUTH_CODE',
      });
    }

    // --- 2. 获取 access_token ---
    const tokenData = await request('https://api.weixin.qq.com/sns/oauth2/access_token', {
      method: 'GET',
      params: {
        appid: APPID,
        secret: APPSECRET,
        code,
        grant_type: 'authorization_code'
      }
    });

    // --- 3. 获取用户信息 ---
    const userInfo = await request('https://api.weixin.qq.com/sns/userinfo', {
      method: 'GET',
      params: {
        access_token: tokenData.access_token,
        openid: tokenData.openid,
        lang: 'zh_CN'
      }
    });

    // --- 4. 同步用户数据 ---
    const { userId } = await syncWeChatUser({
      userInfo,
      tokenData,
      ip: clientIp,
    });

    // --- 5. 生成 JWT ---
    
    const token = setToken(
      { uid: userId, fp: clientFp, ip: clientIp },
      JWT_SECRET,
      JWT_EXPIRES_IN
    );

    // --- 6. 返回成功 ---
    res.json({
      ...success,
      data: {
        token,
        openid: userInfo.openid,
        unionid: userInfo.unionid || null,
        nickname: userInfo.nickname,
        avatar: userInfo.headimgurl || '',
      },
      msg: '登录成功！',
    });
  } catch (error) {
    // 精细化错误处理
    if (error.type === 'TIMEOUT') {
      return res.status(504).json({ ...fail, msg: '微信服务响应超时' });
    }

    // 处理微信API返回的错误
    if (error.response?.errcode) {
      let msg = '授权失败，请重试';
      const errCode = error.response.errcode;
      
      switch (errCode) {
        case 40029:
          msg = '授权码已过期，请重新扫码';
          break;
        case 40013:
          msg = '应用 AppID 无效，请联系管理员';
          break;
        case 40163:
          msg = 'code 被使用过，请重新扫码';
          break;
        case 40001:
          msg = 'AppSecret 错误，请检查配置';
          break;
        default:
          console.warn('微信 API 错误:', error.response);
      }
      
      return res.status(400).json({ 
        ...fail, 
        msg, 
        code: `WECHAT_${errCode}` 
      });
    }

    // HTTP错误状态处理
    if (error.status) {
      return res.status(error.status).json({
        ...fail,
        msg: `请求失败: ${error.statusText}`,
        code: `HTTP_${error.status}`
      });
    }

    // 其他未知错误
    console.error('微信登录回调失败:', error);
    res.json({ ...fail, data:error,msg: '登录失败，请重试' });
  }
}

// 导出控制器
const AuthController = {
  authorize,
  callback,
  getShareConfig
};

export default AuthController;
 