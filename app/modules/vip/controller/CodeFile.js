const {
  helper: {
      getFileTree, 
      readFileContent, 
      saveFileContent, 
      isPathSafe 
  },
  common: { success, fail }
} = Chan
import path from "path";
let CodeFileController = {
  // 获取站点信息
  async tree(req, res, next) {
    try {
      let type =  req.query.type;
      let fullPath = "";
      if(type == "html"){
        fullPath = path.join(APP_PATH, "/modules/web/view", req.app.locals.template);
      }else {
        fullPath = path.join(ROOT_PATH, "/public/template", req.app.locals.template);
      }
      const tree = await getFileTree(fullPath);
      res.json({ ...success, data: tree });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async oss(req, res, next) {
    try {
      let fullPath = ''
      let paths = req.query.path;
      if (paths) {
        fullPath =  path.join(ROOT_PATH, paths);
      }else{
        fullPath =  path.join(ROOT_PATH, "/public/uploads", req.app.locals.template);
      }
      const tree = await getFileTree(fullPath,false);
      res.json({ ...success, data: tree });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async content(req, res, next) {
    try {
      const filePath = req.query.path;
      if (!isPathSafe(filePath,APP_PATH)  && !isPathSafe(filePath,ROOT_PATH)) {
        return res.status(403).json({ error: "访问路径不安全" });
      }
      const content = await readFileContent(filePath);
      res.json({ ...success, data: content });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async save(req, res, next) {
    try {
      const { path: filePath, content } = req.body;
       if (!isPathSafe(filePath,APP_PATH)  && !isPathSafe(filePath,ROOT_PATH)) {
        return res.status(403).json({ error: "访问路径不安全" });
      }
      await saveFileContent(filePath, content);
      res.json({ ...success, data: {} });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};

export default CodeFileController;
