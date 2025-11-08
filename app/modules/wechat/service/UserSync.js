import crypto from 'node:crypto';

const { knex } = Chan;

/**
 * 同步微信用户信息到本地数据库（扫码登录和OAuth登录共用）
 */
const syncWeChatUser = async ({ userInfo, tokenData, ip }) => {
  const { openid, nickname, headimgurl, sex, city, country, province, unionid } = userInfo;
  const { access_token, refresh_token, expires_in } = tokenData || {};
  const now = new Date();
  const safeNickname = (nickname || '').substring(0, 50) || `wx_${openid.slice(-6)}`;
  const avatar = headimgurl || '';

  let userId = null;
  let socialRecord = null;

  return await knex.transaction(async (trx) => {
    // 查询已有记录
    socialRecord = await trx('user_social_login')
      .where('platform', 'wechat')
      .where(builder => {
        unionid ? builder.where('unionid', unionid) : builder.where('openid', openid);
      })
      .orWhere('openid', openid)
      .first();

    if (socialRecord) {
      // 更新已有用户
      userId = socialRecord.user_id;
      await trx('user').where('id', userId).update({
        nickname: safeNickname,
        avatar,
        sex: [1, 2].includes(sex) ? sex : 0,
        login_ip: ip,
        updated_at: now,
      });

      await trx('user_social_login').where('id', socialRecord.id).update({
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
      // 创建新用户
      await trx('user').insert({
        username: `wx_${Date.now().toString(36)}_${crypto.randomBytes(2).toString('hex')}`,
        nickname: safeNickname,
        avatar,
        sex: [1, 2].includes(sex) ? sex : 0,
        status: 1,
        login_ip: ip,
        created_at: now,
        updated_at: now,
      });

      // 获取自增ID
      const [result] = await trx.raw('SELECT LAST_INSERT_ID() AS userId');
      userId = result[0].userId;

      // 关联社交账号
      await trx('user_social_login').insert({
        user_id: userId,
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

export default {
    syncWeChatUser,
}