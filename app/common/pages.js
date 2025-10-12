import fs from 'fs';
import path from 'path';
/**
 * @description 输出分页标签
 * @param {*} current 当前页面
 * @param {*} total 总条数
 * @param {*} pageSize 每页数量
 * @param {*} href 跳转路由
 * @param {*} query 查询参数
 * @returns 返回分页html
 */
export function pages(current, total, pageSize, href,query='') {
  let pageTemp = [];
  let totalPage = Math.ceil(total / pageSize);
  if(totalPage<=1){
    return '';
  }
  
  let pageStr = `<p>共${total}条记录，共${totalPage},当前${current}</p>`;
  //上一页
  if (current == 1) {
    pageTemp.push(`<li class="disabled">上一页</li>`);
  } else {
    pageTemp.push(`<li><a href='${href}${parseInt(current) - 1}.html${query}'>上一页</a></li>`);
  }
  //中间的 小于8页面
  if (totalPage <= 8) {
    for (let i = 0; i < totalPage; i++) {
      if (current == i + 1) {
        pageTemp.push(
          `<li class="current"><a href='${href}${i + 1}.html${query}'>${i + 1}</a></li>`
        );
      } else {
        pageTemp.push(`<li><a href='${href}${i + 1}.html${query}'>${i + 1}</a></li>`);
      }
    }
  } else {
    //获取前3
    for (let i = 0; i < 3; i++) {
      if (current == i + 1) {
        pageTemp.push(
          `<li class="current"><a href='${href}${i + 1}.html${query}'>${i + 1}</a></li>`
        );
      } else {
        pageTemp.push(`<li><a href='${href}${i + 1}.html${query}'>${i + 1}</a></li>`);
      }
    }
    pageTemp.push(`<li><a href='${href}${3 + 1}.html${query}'>...</a></li>`);
    for (let i = totalPage - 3; i < totalPage; i++) {
      if (current == i + 1) {
        pageTemp.push(
          `<li class="current"><a href='${href}${i + 1}.html${query}'>${i + 1}</a></li>`
        );
      } else {
        pageTemp.push(`<li><a href='${href}${i + 1}.html${query}'>${i + 1}</a></li>`);
      }
    }
  }
  //下一页
  if (current == totalPage) {
    pageTemp.push(`<li class="disabled">下一页</li>`);
  } else {
    pageTemp.push(`<li><a href='${href}${parseInt(current) + 1}.html${query}'>下一页</a></li>`);
  }
  return pageTemp.join("");
}

/**
 * @description 获取模板文件
 * @param {*} folderPath
 * @returns 获取模板文件
 */
export function getHtmlFilesSync(folderPath) {
  const files = fs.readdirSync(folderPath);
  const htmlFiles = [];
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile() && path.extname(file) === ".html") {
      htmlFiles.push(file);
    }
  });
  return htmlFiles;
}