

/**
 * 获取微信配置信息（后端会通过Cookie管理缓存）
 * @param {string} apiUrl - 后端接口地址
 * @returns {Promise<Object>} 配置信息
 */
async function getWechatConfig(apiUrl) {

  // 传递完整URL（后端会处理#部分）
  const url = window.location.href;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
    // 关键：允许请求携带Cookie
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Config request failed: ${res.status}`);
  const result = await res.json();

  // 假设后端返回格式为 { code: 0, data: { shareConfig, jsApiList } }
  if (result.code !== 200) {
    throw new Error(`获取配置失败: ${result.msg || "未知错误"}`);
  }

  return result.data;
}

/**
 * 初始化微信分享
 * @param {Object} shareData - 分享内容
 * @param {Object} config - 微信配置（包含shareConfig和jsApiList）
 */
function initWechatShare(shareData, config) {
  const { title, desc, link, imgUrl } = shareData;
  const wx = window.wx;
  const { shareConfig, jsApiList } = config;
console.log('shareConfig->',shareConfig);
console.log('jsApiList->',jsApiList);
  // 配置SDK
  wx.config({
    debug: false, // 生产环境关闭调试
    appId: shareConfig.appId,
    timestamp: shareConfig.timestamp,
    nonceStr: shareConfig.nonceStr,
    signature: shareConfig.signature,
    jsApiList: jsApiList,
  });

  // 设置分享内容
  wx.ready(() => {
   
   // 旧版接口 - 分享给朋友（兼容iOS）
    wx.onMenuShareAppMessage({
      title,
      desc,
      link: link || window.location.href,
      imgUrl,
      type: '', // 默认为link
      dataUrl: ''
    });

    // 旧版接口 - 分享到朋友圈（兼容iOS）
    wx.onMenuShareTimeline({
      title,
      desc,
      link: link || window.location.href,
      imgUrl,
    });
    // 分享给朋友
    wx.updateAppMessageShareData({
      title,
      desc,
      link: link || window.location.href,
      imgUrl,
    });

    // 分享到朋友圈
    wx.updateTimelineShareData({
      title,
      desc,
      link: link || window.location.href,
      imgUrl,
    });

    console.log("微信分享初始化成功");
  });

  wx.error((err) => console.error("WeChat SDK error:", err));
}

async function wxShare(shareConfig) {
  try {
   

    const config = await getWechatConfig(window.location.origin + "/wechat/v1/shareConfig");

    initWechatShare(shareConfig, config);
  } catch (err) {
    console.error("Share setup failed:", err);
  }
}

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", () => {
 alert(1)
    let baseUrl = window.location.origin;
    // 1. 处理分享图片：优先og:image，无则用默认图，补全协议
    let imgUrl = document.querySelector('meta[property="og:image"]')?.content || 
                 `${baseUrl}/public/template/default/img/logo.png`; // 兜底默认图
    if (!imgUrl.includes("http")) {
      imgUrl = baseUrl + imgUrl;
    }
  
    // 2. 处理分享标题：首页用页面title，其他页优先h1/h2/h3
    let title = document.title;
    if (location.pathname !== "/") {
      title = document.querySelector("h2")?.innerText || 
              document.querySelector("h1")?.innerText || 
              document.title;
    }
  
    // 3. 处理分享描述：优先meta description，无则用默认
    const desc = document.querySelector(".introduction")?.innerText || "分享描述";
  
    // 4. 组装分享配置（转义特殊字符）
    const shareConfig = {
      title: title,
      desc: desc,
      link: window.location.href,
      imgUrl: imgUrl,
    };
    
    console.log(JSON.stringify(shareConfig))
  
    wxShare(shareConfig);
  });
