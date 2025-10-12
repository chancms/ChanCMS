//mysql配置
let debug = process.env.DB_DEBUG === "false" ? false : true;
export const db = [
  {
    client: process.env.DB_CLIENT || "mysql2",
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "123456",
    database: process.env.DB_DATABASE || "huida",
    port: process.env.DB_PORT || "3306",
    max: parseInt(process.env.DB_POOL_MAX || 2),
    min: parseInt(process.env.DB_POOL_MIN || 0),
    debug: debug,
    filename: process.env.DB_FILENAME || "",
  },
];
