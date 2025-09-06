import fs from 'fs/promises'; // 使用异步文件操作API
import qiniu from '../service/qiniu.js';

const {
  common: {
    success, fail ,
  },
} = Chan;



/**
 * 将数组转换为键值对对象
 * @param {Array} arr - 包含键值对的数组
 * @param {string} keyField - 作为键的字段名
 * @param {string} valueField - 作为值的字段名
 * @returns {Object} 转换后的对象
 */
const arrToObj = (arr, keyField = 'config_key', valueField = 'config_value') => {
  // 输入验证
  if (!Array.isArray(arr)) {
    throw new Error('arrToObj 期望接收数组作为第一个参数');
  }
  
  return arr.reduce((result, item) => {
    if (item && typeof item === 'object') {
      const key = item[keyField];
      const value = item[valueField];
      if (key !== undefined && value !== undefined) {
        result[key] = value;
      }
    }
    return result;
  }, {});
};


let config =  {
  domain: '',
  bucket: '',
  secretKey: '',
  accessKey: ''
}

/**
   * 初始化七牛云配置
   * @returns {Promise<boolean>} 配置是否初始化成功
   */
const initConfig = async () => {
  // 如果已有有效配置，无需重复初始化
  if (config.bucket && config.secretKey && config.accessKey && config.domain) {
    return true;
  }

  try {
    const res = await qiniu.getConfig();
    
    if (res.code !== 200 || !res?.data?.list || !res?.data?.list?.length) {
      throw new Error('获取七牛云配置失败，配置列表为空');
    }

    const configObj = arrToObj(res.data.list);
    
    // 验证必要配置项
    const requiredConfigs = [
      'bucket',
     'secretKey',
      'accessKey',
      'domain'
    ];
    
    const missingConfigs = requiredConfigs.filter(key => !configObj[key]);
    if (missingConfigs.length) {
      throw new Error(`七牛云配置不完整，缺少: ${missingConfigs.join(', ')}`);
    }

    // 更新配置
    config = { ...configObj };
    return true;
  } catch (error) {
    console.error('七牛云配置初始化失败:', error.message);
    throw error; // 抛出错误让上层处理
  }
}
const QiniuController = {
  // 配置项使用私有变量，避免直接修改
  
  /**
   * 获取七牛云上传token
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 中间件next函数
   */
  async getUploadToken(req, res, next) {
    try {
      const data = await qiniu.getUploadToken();
      res.json({ ...success, data });
    } catch (error) {
      next(error);
    }
  },

  /**
   * 服务端直传七牛云
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   * @param {Function} next - 中间件next函数
   */
  async upload(req, res, next) {
    try {
      // 1. 检查文件是否存在
      const file = req.file || (req.files && req.files[0]);
      if (!file) {
        return res.json({ ...fail, message: '未找到上传的文件' });
      }
    

      // 2. 初始化配置
      await initConfig();
      const { bucket, secretKey, accessKey, domain } = config;

      // 3. 提取文件信息
      const { originalname, filename, path: filePath } = file;

      try {
        // 4. 上传文件到七牛云
        const uploadResult = await qiniu.upload(file, {
          bucket,
          secretKey,
          accessKey,
        });

        if (uploadResult.code === 200) {
          const { key = '' } = uploadResult.data;
          
          // 5. 异步删除本地文件（不阻塞主流程，但确保错误被捕获）
          await fs.unlink(filePath);
          
          return res.json({
            ...success,
            data: {
              path: `//${domain}/${key}`,
              domain,
              originalname,
              filename,
              link: key,
            },
          });
        } else {
          return res.json({ ...fail, data: uploadResult.data });
        }
      } catch (uploadError) {
        // 上传失败也尝试删除本地文件，避免文件残留
        try {
          await fs.unlink(filePath);
        } catch (unlinkError) {
          console.warn('上传失败后删除本地文件出错:', unlinkError.message);
        }
        throw uploadError;
      }
    } catch (error) {
      next(error);
    }
  },
};

export default QiniuController;
