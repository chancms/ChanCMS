const {
  config,
  common: {
    success, fail ,
  },
} = Chan;



  const handleResponse = (req, files) => {
    const isArray = Array.isArray(files);
    const result = (isArray ? files : [files]).map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      path: `/${file.path.replace(/\\/g, "/").replace(/^app\//, "")}`,
      url: `${req.protocol}://${req.get("host")}/${file.path.replace(
        /^app\//,
        ""
      )}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    return isArray ? result : result[0];
  }

let UploadController  = {
  // 单文件上传
  async uploadFile(req, res, next) {
    try {
      if (!req.file) throw new Error("未收到文件");
      res.json({
        code: 200,
        data: handleResponse(req, req.file),
      });
    } catch (err) {
      next(err);
    }
  },

  // 多文件上传
  async uploadFiles(req, res, next) {
    try {
      if (!req.files?.length) throw new Error("未收到文件");
      res.json({
        code: 200,
        data: handleResponse(req, req.files),
      });
    } catch (err) {
      next(err);
    }
  },

  // 单图上传
  async uploadImg(req, res, next) {
    try {
      if (!req.file) throw new Error("未收到图片文件");
      const result = handleResponse(req, req.file);
      res.json({
        code: 200,
        data: {
          ...result,
          thumbnail: `${result.url}?width=200`, // 可扩展缩略图
        },
      });
    } catch (err) {
      next(err);
    }
  },

  // 多图上传
  async uploadImgs(req, res, next) {
    try {
      if (!req.files?.length) throw new Error("未收到图片文件");
      const data = handleResponse(req, req.files).map((item) => ({
        ...item,
        thumbnail: `${item.url}?width=200`,
      }));
      res.json({ code: 200, data });
    } catch (err) {
      next(err);
    }
  },


 
 
}

export default UploadController;
