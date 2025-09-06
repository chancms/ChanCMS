const {
  config,
  treeById, filterFields, htmlDecode
} = Chan.helper;

const {pages,getChildrenId} = Chan.common;

/**
 * @description 根据导航栏目获取首页视图文件
 * @param {*} nav 导航栏目
 */
export const homeView = (nav) => {
  let view = "index.html";
  if (
    Array.isArray(nav) &&
    nav.length > 0 &&
    nav[0].pinyin == "home" &&
    nav[0].listView
  ) {
    view = nav[0].listView;
  }
  return view;
};

/**
 * @description 获取列表页参数
 * @param {*} req
 * @returns {object}
 */
export const listGetParams = (req) => {
  const { template, category } = req.app.locals;

  const { cate = "", cid } = req.params;
  const current = parseInt(req.params.current, 10) || 1;
  // 当前栏目和当前栏目下所有子导航
  const navSub = getChildrenId(cate || cid, category);
  const _cate = navSub?.cate || {};
  const id = cid || _cate.id;
  return { template, category, cate: _cate, cid: id, current };
};

/**
 * @description 列表页数据解析
 * @param {*} param0
 * @returns {object}
 */
export const listDataParse = ({ cid, category, cate, current, data }) => {
  let id = cid || cate.id;
  let position = treeById(id, category).filter((item) => item); // 确保过滤掉可能的空值

  //当前栏目父子层级栏目
  let subnav = {};
  position.map((item, index) => {
    subnav[`level${index + 1}`] = item;
  });

  //当前位置
  const positionField = ["id", "name", "path"];
  position = filterFields(position, positionField);

  //文章数量
  const count = data.articleList.count;

  // 分页
  let pageHtml = "";
  if (position.length > 0) {
    const lastPath = position[position.length - 1].path; // 提前存储最后一个元素的路径
    const href = `${lastPath}/index`;
    pageHtml = pages(
      current,
      count,
      data?.list?.articleList?.params?.pageSize || 10,
      href
    );
  }

  // 获取模板
  const view = cate?.listView || "list.html";
  return { pageHtml, view, position, subnav };
};

export const articleGetParams = (req) => {
  const { template, category } = req.app.locals;
  let { id } = req.params;
  if (id.includes(".html")) {
    id = id.replace(".html", "");
  }
  return { id, template, category };
};

export const articleDataParse = ({ article, cid, category }) => {
  article.content = htmlDecode(article.content);
  // 扩展字段
  Object.getOwnPropertyNames(article.field).forEach(function (key) {
    if (
      typeof article.field[key] == "string" &&
      article.field[key].includes("{")
    ) {
      article.field[key] = JSON.parse(article.field[key]);
    }
  });
  // 当前栏目和当前栏目下所有子导航
  const navSub = getChildrenId(cid, category);
  let cate = navSub?.cate || {};
  // 当前位置
  const position = treeById(cid, category);
  //获取模板
  let view = article.articleView || cate.articleView;
  return { article, cate, position, view };
};

export const searchParams = (req) => {
  const { template } = req.app.locals;
  const { keywords, current = 1 } = req.params;
  let key = keywords.slice(0, 10);
  return { current: +current, template, keywords: key };
};

export const searchDataParse = ({ data, keywords, current }) => {
  // 分页
  let { count = 0, list = [] } = data.search;
  let href = `/search/${keywords}/words`;

  let pageHtml = pages(
    current,
    count,
    data?.search?.search?.params?.pageSize || 10,
    href
  );

  list.forEach((ele) => {
    ele.titles = ele.title.replace(
      new RegExp(keywords, "gi"),
      `<span class='c-red'>${keywords}</span>`
    );
  });

  return { list, pageHtml };
};

export const tagParams = (req) => {
  const { template } = req.app.locals;
  const { path, current = 1 } = req.params;
  const { tag } = req.query;
  return { current: +current, template, path, tag };
};

export const tagDataParse = ({ data, current, tag, path }) => {
  //分页
  let { count } = data.tags;
  let href = `/tags/${path}/tag`;
  let query = `?tag=${tag}`;
  let pageHtml = pages(
    current,
    count,
    data?.tag?.tags?.params?.pageSize || 10,
    href,
    query
  );
  return { pageHtml };
};

export const getApiCalls = (
  config = {}, //配置接口参数
  options = {}, //动态参数
  common // mysql通用查询方法
) => {
  // let apiCalls = {};
  //构建要调用的api对象
  // for (let key in config) {
  //   if (config[key].show !== false) {
  //     let method = config[key].method;
  //     let apiMethod = common[method];
  //     let params = { ...(config[key].params || {}), path, current };
  //     apiCalls[key] = apiMethod(params).then((data) => data);
  //   }
  // }

  let apiCalls = {};

  //配置
  if (Object.keys(config).length === 0) {
    console.warn("getApiCalls: config is empty");
    return apiCalls;
  }

  const { cid } = options;

  for (let key in config) {
    if (config[key].show === false) continue;

    const cfg = config[key];
    const method = cfg.method;

    if (!common[method]) {
      console.error(`Method ${method} not found in common module`);
      continue;
    }

    const apiMethod = common[method];

    //合并参数： 调整参数合并顺序：options 优先级最高
    let params = {
      ...(cfg.params || {}), // 先取配置默认值
      ...options, // 用户传入参数覆盖配置
    };

    // 处理 CID 条件判断
    if (cfg.cid !== undefined) {
      // 使用 undefined 检查
      if (cid === undefined || cfg.cid != cid) {
        continue; // 条件不匹配则跳过此项
      }
    }

    // 执行 API 调用
    apiCalls[key] = apiMethod(params).then((data) =>
      cfg.field ? filterFields(data, cfg.field) : data
    );
  }

  return apiCalls;
};


export const parseJsonFields = (obj)=> {
  const result = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const value = obj[key];
    // 如果是字符串，并且看起来像 JSON（以 { 或 [ 开头）
    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        result[key] = JSON.parse(value);
      } catch (e) {
        console.warn(`JSON parse failed for field: ${key}`, e);
        result[key] = value; // 保留原始值
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
