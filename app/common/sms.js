import crypto from 'crypto';

/**
 * 阿里云短信发送工具
 * 基于Node.js内置fetch实现，支持现代ES模块
 * 官方文档: https://help.aliyun.com/document_detail/44364.html
 */

// 常量定义 - 分离固定配置与可配置项
const API_CONFIG = {
  host: 'https://sms.aliyuncs.com/',
  action: 'SingleSendSms',
  version: '2016-09-27',
  format: 'JSON',
  signatureMethod: 'HMAC-SHA1',
  signatureVersion: '1.0'
};

/**
 * 生成阿里云API签名
 * @param {Object} params - 请求参数
 * @param {string} secret - AccessKeySecret
 * @returns {string} 计算后的签名
 */
function generateSignature(params, secret) {
  // 按键名排序并拼接参数
  const sortedParams = Object.keys(params).sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  // 构建待签名字符串
  const signatureStr = `POST&${encodeURIComponent('/')}&${encodeURIComponent(sortedParams)}`;
  
  // 计算HMAC-SHA1签名
  return crypto
    .createHmac('sha1', `${secret}&`)
    .update(Buffer.from(signatureStr, 'utf-8'))
    .digest('base64');
}

/**
 * 创建短信发送实例
 * @param {Object} config - 短信配置
 * @param {string} config.accessKeyId - 访问密钥ID
 * @param {string} config.accessKeySecret - 访问密钥Secret
 * @param {string} config.signName - 短信签名
 * @param {string} config.templateCode - 短信模板ID
 * @returns {Object} 包含发送短信方法的实例
 */
export function createSmsClient(config) {
  // 验证必要配置
  const requiredFields = ['accessKeyId', 'accessKeySecret', 'signName', 'templateCode'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length) {
    throw new Error(`缺少必要配置: ${missingFields.join(', ')}`);
  }

  /**
   * 发送短信
   * @param {Object} options - 发送选项
   * @param {string} options.phone - 接收短信的手机号
   * @param {Object} options.params - 模板参数
   * @returns {Promise<Object>} 发送结果
   */
  return {
    async send({ phone, params }) {
      if (!phone || !params) {
        throw new Error('手机号和模板参数为必填项');
      }

      // 构建基础请求参数
      const requestParams = {
        Action: API_CONFIG.action,
        Version: API_CONFIG.version,
        Format: API_CONFIG.format,
        AccessKeyId: config.accessKeyId,
        SignatureMethod: API_CONFIG.signatureMethod,
        SignatureVersion: API_CONFIG.signatureVersion,
        SignatureNonce: crypto.randomUUID(), // 生成唯一随机数
        Timestamp: new Date().toISOString(), // UTC时间
        SignName: config.signName,
        TemplateCode: config.templateCode,
        RecNum: phone,
        ParamString: JSON.stringify(params)
      };

      // 计算并添加签名
      requestParams.Signature = generateSignature(requestParams, config.accessKeySecret);

      // 转换为表单数据
      const formData = new URLSearchParams();
      Object.entries(requestParams).forEach(([key, value]) => formData.append(key, value));

      // 发送请求并处理响应
      const response = await fetch(API_CONFIG.host, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      const result = await response.json();

      // 处理API错误
      if (result.Code) {
        throw new Error(`[${result.Code}] ${result.Message}`);
      }

      return result;
    }
  };
}

// 测试用例 - 仅在直接运行模块时执行
// if (import.meta.url === new URL(import.meta.url).href) {
//   (async () => {
//     try {
//       // 替换为实际配置
//       const smsClient = createSmsClient({
//         accessKeyId: 'your-access-key-id',
//         accessKeySecret: 'your-access-key-secret',
//         signName: '你的签名',
//         templateCode: 'SMS_123456'
//       });

//       const result = await smsClient.send({
//         phone: '13800138000',
//         params: { code: '654321', product: '测试应用' }
//       });

//       console.log('发送成功:', result);
//     } catch (error) {
//       console.error('发送失败:', error.message);
//     }
//   })();
// }
    