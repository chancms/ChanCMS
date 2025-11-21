let {
  helper: { filterFields },
} = Chan;
import common from "./common.js";

import { getApiCalls } from "../utils/index.js";
const home = {
  async init() {
    try {
      const config = Chan.config?.data?.init || {};
      const apiCalls = getApiCalls(config, {}, common);

      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));

      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });

      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 首页
  async home() {
    try {
      const config = Chan.config.data.home;
      const apiCalls = getApiCalls(config, {}, common);

      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));

      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });

      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 列表页
  async list({ cid, current = 1 }) {
    try {
      const config = Chan.config.data.list;
      const apiCalls = getApiCalls(
        config,
        {
          cid,
          current,
        },
        common
      );

      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));

      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });

      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 文章页
  async article({ id, cid }) {
    try {
      const config = Chan.config.data.article;
      const apiCalls = getApiCalls(
        config,
        {
          id,
          cid,
        },
        common
      );

      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));

      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });

      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // 单页列表页
  async page({ cid }) {
    try {
      const config = Chan.config.data.page;

      const apiCalls = getApiCalls(
        config,
        {
          cid,
        },
        common
      );

      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));

      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });

      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async search({ keywords = "", current = 1 }) {
    try {
      const config = Chan.config.data.search;
      const apiCalls = getApiCalls(
        config,
        {
          keywords,
          current,
        },
        common
      );

      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));

      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });

      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  async tag({ path, current = 1 }) {
    try {
      const config = Chan.config.data.tags;
      const apiCalls = getApiCalls(
        config,
        {
          path,
          current,
        },
        common
      );
      // 使用Promise.all并行执行所有api调用，并通过解构赋值获取结果
      let results = await Promise.all(Object.values(apiCalls));
      // 合并结果到一个对象中
      let resultObject = {};
      let keys = Object.keys(apiCalls);
      results.forEach((result, index) => {
        resultObject[keys[index]] = result;
      });
      return resultObject;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

export default home;
