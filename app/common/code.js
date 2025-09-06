
// 业务状态码（仅标识业务逻辑结果）
export const API_CODE = {
    SUCCESS: 200,                 // 成功
    FAIL: 201,                   // 失败
    ERROR: 500,                   // 错误
    // 参数相关
    PARAM_INVALID: 10001,       // 参数无效
    PARAM_MISSING: 10002,       // 参数缺失
    // 认证相关
    AUTH_FAILED: 20001,         // 认证失败
    TOKEN_EXPIRED: 20002,       // 令牌过期
    // 资源相关
    RESOURCE_NOT_FOUND: 30001,  // 资源不存在
    RESOURCE_LOCKED: 30002,     // 资源锁定
    // 系统相关
    SYSTEM_ERROR: 50001,        // 系统错误
    SERVICE_BUSY: 50002         // 服务繁忙
};
  