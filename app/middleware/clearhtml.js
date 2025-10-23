import * as cheerio from "cheerio";

/**
 * 通用 HTML 清洗函数（适用于新闻/文章采集）
 * @param {string} html - 原始 HTML 内容
 * @param {Object} inputOptions - 配置项
 * @returns {string} 清洗后的 HTML
 */
export const cleanHtml = (html, inputOptions = {}) => {
  try {
    const defaultOptions = {
      imagePrefix: null,
      removeSelectors: "script, style, iframe",
      removeTextPatterns: [
        /^来源：/,
        /^作者：/,
        /^编辑：/,
        /^责任编辑：/,
        /^发布时间：/,
        /^时间：/,
        /^阅读量：/,
        /^点击下载/,
        /^点击查看原文/,
        /^分享到：/,
        /^相关新闻：/,
        /^推荐阅读：/,
        /^广告：/,
        /^赞助商：/,
      ],
      keepStyles: ["text-align: center;", "text-align:center"],
      removeAttributes: [
        "class",
        "id",
        "onclick",
        "onload",
        "alt",
        "title",
        "border",
        "width",
        "height",
      ],
      removeEmptyTags: ["span", "p", "div", "li"],
      unwrapLinks: true,
      collapseWhitespace: true,
      removeHtmlComments: true,
      sanitizeUrls: true,
    };

    const options = { ...defaultOptions, ...inputOptions };

    const {
      imagePrefix,
      removeSelectors,
      removeTextPatterns,
      keepStyles,
      removeAttributes,
      removeEmptyTags,
      unwrapLinks,
      sanitizeUrls,
      removeHtmlComments,
    } = options;

    const $ = cheerio.load(html, { decodeEntities: false });

    // 1. 补全图片域名
    if (imagePrefix) {
      $("img").each((i, elem) => {
        const $img = $(elem);
        let src = $img.attr("src");
        if (!src) return;

        src = src.trim();
        if (/^https?:\/\//i.test(src)) return;
        if (src.startsWith("//")) src = "https:" + src;
        else if (src.startsWith("/"))
          src = imagePrefix.replace(/\/+$/, "") + "/" + src.replace(/^\/+/, "");
        else src = imagePrefix.replace(/\/+$/, "") + "/" + src;

        $img.attr("src", src);
      });
    }

    // 2. 删除指定选择器的元素
    if (removeSelectors) {
      $(removeSelectors).remove();
    }

    // 3. 删除包含干扰文本的元素
    $("p, div, span, li").each((i, elem) => {
      const $elem = $(elem);
      const text = $elem.text().trim();
      if (
        removeTextPatterns.some((re) => re.test(text)) &&
        $elem.children().length === 0 &&
        text.length < 100
      ) {
        $elem.remove();
      }
    });

    // 4. 清理 style 属性
    $("*").each((i, elem) => {
      const $elem = $(elem);
      const style = $elem.attr("style");
      if (!style) return;

      const keep = keepStyles.find((k) => style.includes(k));
      if (keep) {
        $elem.attr("style", keep);
      } else {
        $elem.removeAttr("style");
      }
    });

    // 5. 移除指定属性
    removeAttributes.forEach((attr) => {
      $(`[${attr}]`).removeAttr(attr);
    });

    // 6. 去掉 a 标签，保留文本
    if (unwrapLinks) {
      $("a").each((i, elem) => {
        $(elem).replaceWith($(elem).html());
      });
    }

    // 7. 清理 javascript: 协议
    if (sanitizeUrls) {
      $("a, img, [href], [src]").each((i, elem) => {
        const $elem = $(elem);
        ["href", "src"].forEach((attr) => {
          const val = $elem.attr(attr);
          if (val && val.trim().toLowerCase().startsWith("javascript:")) {
            $elem.removeAttr(attr);
          }
        });
      });
    }

    // 8. 删除空标签
    if (Array.isArray(removeEmptyTags)) {
      removeEmptyTags.forEach((tag) => {
        $(tag)
          .filter(function () {
            return (
              $(this).text().trim() === "" && $(this).children().length === 0
            );
          })
          .remove();
      });
    }

    // 9. 获取最终 HTML
    let resultHtml = $("body").html() || "";

    // 10. 删除 HTML 注释（最后处理）
    if (removeHtmlComments) {
      resultHtml = resultHtml.replace(/<!--[\s\S]*?-->/g, "");
    }

    // 11. 合并空白（最后处理）
    if (options.collapseWhitespace) {
      resultHtml = resultHtml.replace(/\s+/g, " ").trim();
    }
    return resultHtml;
  } catch (error) {
    console.log("error--->", error);
    return "";
  }
};

/**
 * 根据字符串路径从对象中取值，支持 . 和 [n] 语法
 * 示例：getValueByPath(data, 'data.list[0].title')
 */
export const getValueByPath = (obj, path) => {
  if (!path || typeof path !== "string") return "";
  return path.split(".").reduce((o, k) => {
    if (o == null) return undefined;
    // 支持数组下标：data.list[0]
    const match = k.match(/^(.+)\[(\d+)\]$/);
    if (match) {
      const [, key, index] = match;
      return o[key]?.[index];
    }
    return o[k];
  }, obj);
};

/**
 * 将数组转为 HTML 字符串
 */
export const arrayToHtml = (arr, wrapTag = "p", options = {}) => {
  if (!Array.isArray(arr)) return "";
  return arr
    .map((item) => {
      const str = String(item || "").trim();
      if (!str) return "";
      return `<${wrapTag}>${str}</${wrapTag}>`;
    })
    .join("");
};
