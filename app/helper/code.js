/**
 * @description 生成验证码
 * @param {*} str 字符串
 * @param {*} key 密钥
 * @returns  4位验证码
 */
export const genCode = (str, key) => {
  let endCode = "";
  for (let [index, char] of [...str].entries()) {
    endCode += parseInt(key[index]) + parseInt(char);
  }
  return endCode.substr(0,4);
};
