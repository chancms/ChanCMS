import dayjs from "dayjs";
const {
  common: {
    success,fail
  },
} = Chan;
import gather from "../service/gather.js";
import {cleanHtml,getValueByPath,arrayToHtml} from "../../../middleware/clearhtml.js";
let GatherController ={

  async getArticle(req, res, next) {
    try {
      const { targetUrl, parseData } = req.query;

      if (!targetUrl) {
        return res.json({ ...fail, msg: '缺少 targetUrl' });
      }
      if (!parseData) {
        return res.json({ ...fail, msg: '缺少 parseData 配置' });
      }
  
      // 1. 解析配置
      let config;
      try {
        config = JSON.parse(decodeURIComponent(parseData));
      } catch (e) {
        return res.json({ ...fail, msg: 'parseData 不是合法 JSON' });
      }
  
      // 2. 请求接口
      const rawData = await gather.common(targetUrl);
      let data;
      try {
        data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      } catch (e) {
        throw new Error('接口返回数据不是合法 JSON');
      }
  
      // 3. 处理每个字段
      const result = {};
  
      for (let [key, fieldConfig] of Object.entries(config)) {
        // 统一处理：所有字段都应为对象
        if (typeof fieldConfig !== 'object' || fieldConfig === null) {
          result[key] = '';
          continue;
        }
  
        const {
          path,
          prefix = '',
          suffix = '',
          default: defaultValue = '',
          isArray = false,
          wrap
        } = fieldConfig;
  
        let value = path ? getValueByPath(data, path) : undefined;
  
        // 处理默认值
        if (value == null || value === undefined || value === '') {
          value = defaultValue;
        }

       
  
        // 如果是数组，且需要转 HTML
        if (isArray && Array.isArray(value) && wrap) {
          console.log(`字段 ${key} 的值为:`, value);
          value = value
            .map(item =>
              `<${wrap}>${String(item).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${wrap}>`
            )
            .join('');
        } else {
          value = String(value);
        }
  
        // 添加前缀后缀
        result[key] = prefix + value + suffix;
      }
  
      // 4. 返回
      res.json({
        ...success,
        source: data,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // 增
  async create(req, res, next) {
    try {
      const body = req.body;
      const data = await gather.create(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 删除
  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const data = await gather.delete(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 改
  async update(req, res, next) {
    try {
      const body = req.body;
      const data = await gather.update(body);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 查
  async detail(req, res, next) {
    try {
      const { id } = req.query;
      const data = await gather.detail(id);
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 搜索
  async search(req, res, next) {
    try {
      const { cur, keyword, pageSize = 10 } = req.query;
      const data = await gather.search(keyword, cur, pageSize);
      data.list.forEach((ele) => {
        ele.createdAt = dayjs(ele.createdAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  },

  // 列表
  async list(req, res, next) {
    try {
      const { cur, pageSize = 10 } = req.query;
      let data = await gather.list(cur, pageSize);
      data.list.forEach((ele) => {
        ele.updatedAt = dayjs(ele.updatedAt).format("YYYY-MM-DD HH:mm");
      });
      res.json({ ...success, data: data });
    } catch (err) {
      next(err);
    }
  }
}

export default GatherController;
