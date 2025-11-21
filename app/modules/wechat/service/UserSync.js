import crypto from "node:crypto";

class UserSyncService extends Chan.Service {
  constructor() {
    super(Chan.knex, "user_social_login");
  }

  /**
   * 同步微信用户信息到本地数据库（扫码登录和OAuth登录共用）
   */
  async syncWeChatUser({ userInfo, tokenData, ip }) {
    const {
      openid,
      nickname,
      headimgurl,
      sex,
      city,
      country,
      province,
      unionid,
    } = userInfo;
    const { access_token, refresh_token, expires_in } = tokenData || {};
    const now = new Date();
    const safeNickname =
      (nickname || "").substring(0, 50) || `wx_${openid.slice(-6)}`;
    const avatar = headimgurl || "";

    let userId = null;
    let socialRecord = null;

    return await Chan.knex.transaction(async (trx) => {
      // 查询已有记录
      socialRecord = await trx("user_social_login")
        .where("platform", "wechat")
        .where((builder) => {
          unionid
            ? builder.where("unionid", unionid)
            : builder.where("openid", openid);
        })
        .orWhere("openid", openid)
        .first();

      if (socialRecord) {
        // 更新已有用户
        userId = socialRecord.user_id;
        await trx("user_social_login").where("id", socialRecord.id).update({
          access_token,
          refresh_token,
          expires_in,
          updated_at: now,
          last_login_ip: ip,
        });

        // 更新用户表信息
        await trx("user").where("id", userId).update({
          nickname: safeNickname,
          avatar,
          updated_at: now,
        });
      } else {
        // 创建新用户
        const [userResult] = await trx("user").insert({
          username: `wx_${openid.slice(-8)}`,
          nickname: safeNickname,
          avatar,
          status: 1,
          created_at: now,
          updated_at: now,
        });

        userId = userResult;

        // 创建社交登录记录
        await trx("user_social_login").insert({
          user_id: userId,
          platform: "wechat",
          openid,
          unionid,
          access_token,
          refresh_token,
          expires_in,
          created_at: now,
          updated_at: now,
          last_login_ip: ip,
        });
      }

      // 获取完整用户信息
      const user = await trx("user").where("id", userId).first();

      return {
        user,
        socialRecord: socialRecord || { platform: "wechat", openid, unionid },
      };
    });
  }
}

export default new UserSyncService();
