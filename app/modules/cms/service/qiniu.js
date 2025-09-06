import qiniu from "qiniu";
const { knex } = Chan;
let db = Chan.Service(knex, "sys_config");
const pageSize = 100;

export default {
  async getConfig() {
    let res = await db.query({
      current: 1,
      pageSize: 10,
      query: { "type_code": "qiniu_oss" },
      field: ["config_key", "config_value"],
    });
    return res;
  },
  // 生成上传token
  async getUploadToken(config) {
    const { accessKey, secretKey, bucket } = config;

    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    // 上传凭证
    let options = {
      scope: bucket,
      // 超时时间
      expires: 7200,
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)","age":$(x:age)}',
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
  },

  // 获取上传token
  // async getUploadToken() {
  //   try {
  //     const result = {
  //       "token":await this._getToken(),
  //     };
  //     return result;
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  //七牛云上传
  async upload(file, config) {

    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    // upload
    let key = `uploads/${year}/${month}/${day}/${new Date().getTime()}_${
      file.originalname
    }`;
    //上传token
    let uploadToken = await this.getUploadToken(config);
    let _config = new qiniu.conf.Config();
    let localFile = file.path;
    let formUploader = new qiniu.form_up.FormUploader(_config);
    let putExtra = new qiniu.form_up.PutExtra();
    putExtra.fname = file.filename;
    putExtra.metadata = {};

    return new Promise(async (resove) => {
      formUploader.putFile(
        uploadToken,
        key,
        localFile,
        putExtra,
        function (err, res, resp) {
          if (err) {
            throw err;
          }
          resove({
            code: resp.statusCode,
            data: res,
          });
        }
      );
    });
  },
};
