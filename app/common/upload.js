import multer from "multer";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";
function createStorage(dir = "uploads", changeDir = true) {
  // 模板
  return multer.diskStorage({
    // 目的地
    destination: async function (req, file, cb) {
      const template = Chan.config.template;
      let destinationDir = "";
      if (changeDir) {
        const date = dayjs(Date.now()).format("YYYY/MM/DD");
        destinationDir = path.join(`public/`, dir, template, date);
      } else {
        destinationDir = path.join(`public/`, dir, template);
      }
      // 确保目录存在
      fs.mkdirSync(destinationDir, { recursive: true });
      cb(null, destinationDir);
    },
    // 文件名
    filename: (req, file, cb) => {
      let originalName = file.originalname;
      originalName = Buffer.from(originalName, 'binary').toString('utf8');
      const safeName = originalName.replace(/[\\/*?:"<>|]/g, '_');
      file.originalname = safeName;
      cb(null, `${Date.now()}_source_${safeName}`); 
    },
  });
}

// logo
export const logo = () => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const upload = multer({
    storage: createStorage("uploads", false), // 使用自定义的存储引擎
    limits: { fileSize: Chan.config.upload.logoSize }, // 限制文件大小为5MB
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 允许上传
      } else {
        cb(new Error("不支持的文件类型")); // 拒绝上传
      }
    },
  });

  return upload.single("file");
};

// 单图上传
export const singleUpload = () => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const upload = multer({
    storage: createStorage("uploads"), // 使用自定义的存储引擎
    limits: { fileSize: Chan.config.upload.imgSize }, // 限制文件大小为5MB
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 允许上传
      } else {
        cb(new Error("不支持的文件类型")); // 拒绝上传
      }
    },
  });
  return upload.single("file");
};

// 多图上传
export const multiUpload = () => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  const upload = multer({
    storage: createStorage("uploads"), // 使用自定义的存储引擎
    limits: { fileSize: Chan.config.upload.imgSize }, // 限制文件大小为200kb
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // 允许上传
      } else {
        cb(new Error("不支持的文件类型")); // 拒绝上传
      }
    },
  });
  return upload.array("file", 5);
};
