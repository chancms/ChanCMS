import nodemailer from "nodemailer";
const { EMAIL, APP_NAME } = Chan.config;

/**
 * 发送邮件
 * @param {string} to 收件人邮箱
 * @param {string} subject 邮件主题
 * @param {string} text 纯文本内容
 * @param {string} [html] HTML 内容（可选）
 * @returns {Promise<object>} 发送结果
 */
export const sendMail = async (to, subject, text, html = null) => {
  const transporter = nodemailer.createTransport({
    host: EMAIL.HOST,
    port: parseInt(EMAIL.PORT),
    secure: EMAIL.SECURE === "true", // true for 465 (SSL), false for 587 (STARTTLS)
    auth: {
      user: EMAIL.USER,
      pass: EMAIL.PASS,
    },
  });
  let res = await transporter.verify();
  if (!res) {
    throw new Error("邮件服务未配置");
  }

  const mailOptions = {
    from: EMAIL.FROM, // 如 '"MyApp" <noreply@yourdomain.com>'
    to,
    subject,
    text,
    html: html || text, // 如果没有 HTML，就用 text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ 邮件发送失败:", error.message);
    throw error;
  }
};

/**
 * 生成注册验证码邮件的 HTML 内容
 * @param {string} code 验证码
 * @param {number} minutes 有效时间（分钟）
 * @returns {string} HTML 字符串
 */
export const genRegEmailHtml = (code, minutes = 10) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 750px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #007bff; color: white; padding: 10px; text-align: center;">
      <h2>${APP_NAME} 欢迎注册！</h2>
    </div>
    <div style="padding: 20px; line-height: 1.6;">
      <p>您好，感谢您注册我们的服务！</p>
      <p>您的注册验证码是：</p>
      <div style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">
        ${code}
      </div>
      <p>请在 <strong>${minutes} 分钟内</strong> 输入该验证码，完成账户验证。</p>
      <p>如非本人操作，请忽略此邮件。</p>
      <p>祝您使用愉快！</p>
    </div>
    <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
      &copy; ${new Date().getFullYear()} ${APP_NAME}. 保留所有权利。
    </div>
  </div>
  `;
};

/**
 * 生成修改密码邮件的 HTML 内容
 * @param {string} link 重置密码链接
 * @param {number} minutes 链接有效时间（分钟）
 * @returns {string} HTML 字符串
 */
export const genResetPasswordEmail = (code, minutes = 10) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
    <div style="background-color: #28a745; color: white; padding: 20px; text-align: center;">
      <h2>重置密码_${APP_NAME}</h2>
    </div>
    <div style="padding: 20px; line-height: 1.6;">
      <p>您好，我们收到了您重置密码的请求。</p>
       <p>您的重置密码验证码是：</p>
      <div style="font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">
        ${code}
      </div>
      <p>请在 <strong>${minutes} 分钟内</strong> 输入该验证码，完成账户验证。</p>
      <p>如非本人操作，请忽略此邮件。</p>
      <p>祝您使用愉快！</p>
    </div>
    <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #666;">
      &copy; ${new Date().getFullYear()} ${APP_NAME}. 保留所有权利。
    </div>
  </div>
  `;
};
