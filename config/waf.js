/**
 * @description 0->不限制 1->禁止iframe 2->最高安全，建议不开启。将会全面禁止所有的非本域下js css img iframe等资源所有请求
 * @deprecated 防点击劫持，防止恶意js攻击,减少 XSS 攻击面
 * @type {{level: number}}
 */
export const WAF_LEVEL = process.env.WAF_LEVEL || 1; 