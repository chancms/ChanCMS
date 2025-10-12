// 简化的状态码定义（数字作为键）
export const CODE = {
  SUCCESS: {
    code: 200,
    message: "操作成功",
  },
  FAIL: {
    code: 201,
    message: "操作失败",
  },
  ERROR: {
    code: 500,
    message: "服务器错误",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "未授权",
  },
  FORBIDDEN: {
    code: 403,
    message: "禁止访问",
  },
};
