import { z } from "zod";
import path from 'path';

// 安全路径验证规则
export const safePathSchema = z.string()
  .min(1, "路径不能为空")
  .refine((value) => {
    // 解析绝对路径并检查是否在基础目录内
    const resolvedPath = path.join(APP_PATH, value);
    return resolvedPath.startsWith(APP_PATH);
  }, "非法路径：禁止访问系统目录")
  .refine((value) => {
    // 白名单字符验证
    return /^[\w\-\.\/]+$/.test(value);
  }, "文件名包含非法字符");


export const isValidTargetUrl =(urlString)=>{
  try {
    const allowedHosts = [];

    const url = new URL(urlString);

    // 检查是否为私有地址（禁止访问）
    const privateIpRegex = /^(127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-2])\.)/;
    if (privateIpRegex.test(url.hostname)) {
      console.log('禁止访问私有地址：', url.hostname);
      return false;
    }

    // IPv6 私有地址检查
    if (url.hostname.startsWith('fc00:') || url.hostname === '::1' || url.hostname === 'localhost') {
      return false;
    }

    // 检查是否在允许的域名范围内
    return true
    // return allowedHosts.some(host => url.hostname.endsWith(host));
  } catch (e) {
    // URL 不合法也视为不安全
    console.error(e);
    return false;
  }
}
