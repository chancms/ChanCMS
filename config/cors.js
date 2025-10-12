export const cors = {
  origin: process.env.CORS_ORIGIN || "*", //或者['http://localhost:8080', 'https://www.chancms.top']
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,// 允许携带 cookies 等凭据（如需）
  maxAge: 86400,// 预检请求的缓存时间（秒），减少重复验证
};