const {
  common: {
    getChildrenId, 
  },
  helper:{treeById,}
} = Chan;

import common from "../service/common.js";
import home from "../service/home.js";

import {
  homeView,
  listGetParams,
  listDataParse,
  articleGetParams,
  articleDataParse,
  searchParams,
  searchDataParse,tagParams,tagDataParse,parseJsonFields
} from "../utils/index.js";

let HomeController = {
   // 首页
  async index(req, res, next) {
    try {
      const { nav, template } = req.app.locals;
      const defaultView = homeView(nav);
      const data = await home.home();
      res.render(`${template}/${defaultView}`, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // 列表页
  async list(req, res, next) {
    try {
      const { template, category, cate, cid, current } = listGetParams(req);
      if (!cid) {
        return await res.render(`${template}/404.html`);
      }
      const data = await home.list({cid, current});
      const { pageHtml, view, position,subnav } = listDataParse({
        cid,
        category,
        cate,
        current,
        data,
      });
      await res.render(`${template}/${view}`, {
        position,
        subnav,
        cate,
        pageHtml,
        ...data,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // 详情页
  async article(req, res, next) {
    try {
      let { id, template, category } = articleGetParams(req);
      if (!id) {
        await res.render(`${template}/404.html`);
        return;
      }
      // 文章列表
      const article = await common.article(id);
      
      if(article?.field?.length>0){
        article.field = parseJsonFields(article.field[0]);
      }
      if (!article) {
        await res.render(`${template}/404.html`);
        return;
      }
      // 栏目id
      const cid = article.cid || "";
      let { cate, position, view } = articleDataParse({
        article,
        cid,
        category,
      });
      //热门 推荐 图文 上一页 下一页 count
      const data = await home.article({ id, cid });
      
      await res.render(`${template}/${view}`, {
        ...data,
        cate,
        article,
        position,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // 单页 ，分两种情况，一种单个单页，一个
  async page(req, res, next) {
  try {
    const { cate, id } = req.params;
    const { category, template } = req.app.locals;
    const resolveTemplate = (name) => `${template}/${name}`;
    // 并行获取关键数据
    const [navSub, initialArticle] = await Promise.all([
      cate ? getChildrenId(cate, category) : null,
      id ? common.article(id) : null
    ]);

    // 统一访问校验
    const cid = initialArticle?.cid || navSub?.cate?.id;
    if (!(id || cate) || !cid) {
      return res.render(resolveTemplate("404.html"));
    }

    // 获取页面数据
    const pageData = await home.page({cid});
    const list = pageData?.page?.list || [];
    let article = initialArticle || {};
    let viewTemplate = navSub?.cate?.articleView || "page.html";

    // 处理文章数据
    if (list.length > 0 && !initialArticle) {
      article = await common.article(list[0].id);
      viewTemplate = article.articleView || viewTemplate;
    }

    // 非阻塞计数更新
    if (article.id) {
      setImmediate(() => common.count({ id: article.id }));
    }

    // 渲染响应
    return res.render(resolveTemplate(viewTemplate), {
      ...pageData,
      cate: navSub?.cate,
      position: article.cid ? treeById(article.cid, category) : [],
      article
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Page Error:`, error.stack);
    next(error);
  }
},

  // 搜索页
  async search(req, res, next) {
    try {
      let { current, template, keywords } = searchParams(req);
      const data = await home.search({ keywords, current });
      let { pageHtml } = searchDataParse({ data, keywords, current });
      await res.render(`${template}/search.html`, {
        keywords,
        ...data,
        pageHtml,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // tag
  async tag(req, res, next) {
    try {
      let { current, template, path, tag } = tagParams(req);
      let data = await home.tag({ path, current });
      let { pageHtml } = tagDataParse({ data, current, tag, path });
      await res.render(`${template}/tag.html`, {
        ...data,
        path,
        tag,
        pageHtml,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}

export default HomeController;
