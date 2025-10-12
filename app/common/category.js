// 获取子栏目
export function getChildrenId(py, source) {
  let cate = {};
  let id = "";
  source.forEach((item) => {
    if (item.pinyin == py || item.id == py) {
      cate = item;
      id = item.id;
    }
  });
  return { cate, id };
}
