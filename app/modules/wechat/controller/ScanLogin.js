import {
  xml2json,
  getGlobalAccessToken,
  verifyEventSignature,
  generateScanId,
} from "../common/wechat-util.js";
import UserSync from "../service/UserSync.js";
// 从全局对象获取配置和工具
const {
  config: { JWT_SECRET, JWT_EXPIRES_IN },
  helper: { getIp, setToken, request },
  knex,
  common: { success, fail },
} = Chan;

/**
 * 1. 生成公众号扫码登录二维码
 */
const loginQrCode = async (req, res) => {
  try {
    const scanId = generateScanId();
    const expireTime = new Date(Date.now() + 5 * 60 * 1000); // 5分钟过期
    const expireSeconds = 300;

    const accessToken = await getGlobalAccessToken();
    const qrResponse = await request(
      `https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${accessToken}`,
      {
        method: "POST",
        data: {
          expire_seconds: expireSeconds,
          action_name: "QR_STR_SCENE",
          action_info: { scene: { scene_str: scanId } },
        },
      }
    );

    if (qrResponse.errcode) {
      throw new Error(
        `生成二维码失败：${qrResponse.errmsg}（${qrResponse.errcode}）`
      );
    }

    // 存储扫码状态
    await knex("wechat_scan_login").insert({
      scan_id: scanId,
      status: 0, // 0:未扫码
      expire_time: expireTime,
      client_ip: req.cookies._i,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const qrImgUrl = `https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(
      qrResponse.ticket
    )}`;
    res.json({
      ...success,
      data: {
        scanId,
        qrImgUrl,
        expireSeconds,
        expireTime: expireTime.getTime(),
      },
      msg: "请使用微信扫码关注公众号登录",
    });
  } catch (error) {
    console.error("生成扫码登录二维码失败:", error);
    res.status(500).json({ ...fail, msg: "二维码生成失败，请稍后重试" });
  }
};

/**
 * 微信服务器验证（GET 请求）
 */
const verifyServer = (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;

  // 验证签名
  if (!verifyEventSignature(signature, timestamp, nonce)) {
    console.error("签名验证失败");
    return res.status(403).send("Invalid signature");
  }

  // 验证通过，返回 echostr
  res.send(echostr);
};
/**
 * 2. 接收微信公众号扫码/关注事件推送
 */
const eventCallback = async (req, res) => {
  try {
    // 1. 先验证 POST 请求的签名（微信对 POST 也会传 signature 等参数）
    const { signature, timestamp, nonce } = req.query;
    if (!verifyEventSignature(signature, timestamp, nonce)) {
      console.error("POST 请求签名验证失败");
      return res.status(403).send("Invalid signature");
    }

    // 2. 手动解析 XML 请求体（避免依赖中间件的问题）
    const xmlStr = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => {
        data += chunk.toString("utf-8"); // 拼接 Buffer 为字符串
      });
      req.on("end", () => resolve(data));
      req.on("error", (err) => reject(err));
    });

    if (!xmlStr) {
      throw new Error("未接收到 XML 数据");
    }

    // 3. 解析 XML 为 JSON
    const eventData = await xml2json(xmlStr);

    // 4. 提取事件参数（注意：不同 XML 解析工具可能有不同的结构，需根据实际调整）
    const eventType = eventData.Event || eventData.xml?.Event; // 兼容可能的嵌套结构
    const sceneStr =
      (eventData.EventKey || eventData.xml?.EventKey)?.replace(
        "qrscene_",
        ""
      ) || "";
    const openid = eventData.FromUserName || eventData.xml?.FromUserName;
    const unionid = eventData.UnionID || eventData.xml?.UnionID || null;

    // 5. 处理扫码/关注事件（仅处理相关类型）
    if (
      ["SCAN", "subscribe"].includes(eventType) &&
      sceneStr.startsWith("scan_")
    ) {
      const scanRecord = await knex("wechat_scan_login")
        .where("scan_id", sceneStr)
        .where("expire_time", ">", new Date())
        .first();

      if (scanRecord) {
        await knex("wechat_scan_login")
          .where("id", scanRecord.id)
          .update({ status: 1, openid, unionid, updated_at: new Date() });
      }
    }

    // 6. 必须返回 'success' 给微信，否则会重复推送
    res.send("success");
  } catch (error) {
    console.error("处理事件推送失败:", error);
    res.send("success"); // 即使出错也返回 success，避免重复推送
  }
};

/**
 * 3. 轮询扫码登录状态
 */
const scanStatus = async (req, res) => {
  try {
    const { scanId } = req.query;
    if (!scanId) {
      return res.status(400).json({ ...fail, msg: "缺少scanId参数" });
    }

    // 查询扫码记录
    const scanRecord = await knex("wechat_scan_login")
      .where("scan_id", scanId)
      .first();
    if (!scanRecord) {
      return res.json({
        ...fail,
        code: "SCAN_NOT_FOUND",
        msg: "扫码记录不存在",
      });
    }

    // 检查是否过期
    if (new Date(scanRecord.expire_time) < new Date()) {
      await knex("wechat_scan_login")
        .where("id", scanRecord.id)
        .update({ status: 3 });
      return res.json({ ...fail, code: "SCAN_EXPIRED", msg: "二维码已过期" });
    }

    // 处理不同状态
    switch (scanRecord.status) {
      case 0:
        return res.json({
          ...success,
          code: "SCAN_PENDING",
          data: { status: 0 },
        });
      case 1: {
        const { openid, unionid } = scanRecord;
        if (!openid) throw new Error("用户openid缺失");

        // 获取用户信息并同步
        const accessToken = await getGlobalAccessToken();
        const userInfo = await request(
          `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${accessToken}&openid=${openid}&lang=zh_CN`
        );
        if (userInfo.errcode)
          throw new Error(`获取用户信息失败：${userInfo.errmsg}`);

        // 检查用户是否关注公众号（subscribe=1表示已关注）
        if (userInfo.subscribe !== 1) {
          throw new Error("用户未关注公众号，无法获取完整信息");
        }

        // 构建完整的用户信息对象，确保包含扫码登录API可能缺失的字段
        const completeUserInfo = {
          ...userInfo,
          unionid: unionid || userInfo.unionid,
          // 扫码登录API可能不返回这些字段，设置默认值
          sex: userInfo.sex || 0,
          city: userInfo.city || "",
          country: userInfo.country || "",
          province: userInfo.province || "",
        };

        // 复用用户同步逻辑
        const { userId } = await UserSync.syncWeChatUser({
          userInfo: completeUserInfo,
          tokenData: {},
          ip: req.cookies._i,
        });

        // 更新状态并生成token
        await knex("wechat_scan_login")
          .where("id", scanRecord.id)
          .update({ status: 2 });
        const token = setToken(
          { uid: userId, fp: req.cookies._f || "", ip: req.cookies._i },
          JWT_SECRET,
          JWT_EXPIRES_IN
        );

        return res.json({
          ...success,
          code: "SCAN_LOGIN_SUCCESS",
          data: {
            token,
            openid,
            unionid,
            nickname: userInfo.nickname,
            avatar: userInfo.headimgurl,
          },
        });
      }
      case 2:
        return res.json({
          ...success,
          code: "SCAN_ALREADY_LOGIN",
          data: { status: 2 },
        });
      default:
        return res.json({ ...fail, code: "UNKNOWN_STATUS", msg: "未知状态" });
    }
  } catch (error) {
    console.error("轮询扫码状态失败:", error);
    res.status(500).json({ ...fail, msg: "查询登录状态失败" });
  }
};

export default {
  loginQrCode,
  verifyServer,
  eventCallback,
  scanStatus,
};
