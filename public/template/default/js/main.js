




;(// 获取所有的 <pre> 元素并添加 line-numbers 类
document.querySelectorAll("pre").forEach(function (preElement) {
    preElement.classList.add("line-numbers");
    // 设置复制提示属性
    preElement.dataset.prismjsCopy = "复制代码";
    preElement.dataset.prismjsCopyError = "按Ctrl+C复制";
    preElement.dataset.prismjsCopySuccess = "代码已复制！";
}));





/**
 * @description: 移动端导航菜单切换
 */
function toggleMenu() {
  const menuButton = document.querySelector('.ico-open');
  const mobileMenu =  document.querySelector('.m-mask');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("none");
    });
  }
}

/**
 * @description: 轮播图
 */
function loadSwiper() {
  if(document.querySelectorAll(".swiper").length > 0) {
  new Swiper(".swiper", {
    //   direction: 'vertical',
    loop: true,
    pagination: {
      el: ".swiper-pagination",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: ".swiper-scrollbar",
    },
  });
}
}

/**
 * @description: 搜索框
 */
function toSearchWap() {
  document.querySelectorAll(".search-input").forEach((item) => {
    item.addEventListener("keyup", function (event) {
      console.log(event);
      event.stopPropagation();
      if (event.keyCode == 13) {
        event.preventDefault();
        var keywords =
          document.querySelectorAll(".search-input")[0].value ||
          document.querySelectorAll(".search-input")[1].value;
        if (keywords) {
          location.href =
            location.origin + "/search/" + keywords + "/words.html";
        }
      }
    });
  });
}

function toSearch() {
    var keywords = document.querySelectorAll('.search-input')[0].value || document.querySelectorAll('.search-input')[1].value;
    if (keywords) {
        location.href = location.origin + '/search/' + keywords + '/words.html'
    }
}

/**
 * @description: 返回顶部
 */
function backToTop() {
  // 获取返回顶部按钮元素
  const btn = document.querySelector(".backtop");

  document.addEventListener("scroll", (e) => {
    // 获取当前页面的scrollTop值
    const scrollTop = document.documentElement.scrollTop;
    if (scrollTop > 670) {
      btn.classList.remove("none");
    } else {
      btn.classList.add("none");
    }
  });

  // 监听按钮的点击事件
  btn?.addEventListener("click", () => {
    // 将页面滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * @description 生成导航链接
 * @param {*} fileName - 文件名
 * @returns - 导航链接数组
 */
function buildUrlsFromArray(fileName = "index.html") {
  let url = location.pathname.split("/");
  let filterUrl = url.filter((item) => item != "" && !item.endsWith(".html"));
  const urls = [];
  for (let i = 0; i < filterUrl.length; i++) {
    let finalPath = "/" + filterUrl.slice(0, i + 1).join("/");
    urls.push(finalPath + "/" + fileName);
  }
  return urls;
}

/**
 * @description 设置导航高亮
 * @param {*} paths - 导航链接数组
 * @param {*} className - 高亮类名
 * @param {*} parentNode - 父节点
 */
function setActiveNav(paths, className = "active", hasParentNode = false) {
  paths.forEach(function (path) {
    var element = document.querySelector('a[href="' + path + '"]');
    if (element) {
      if (hasParentNode) {
        element.parentNode.classList.add(className);
      } else {
        element.classList.add(className);
      }
    }
  });
}

/**
 * @returns 代码调试
 */
function debug() {
  try {
    if (!document.querySelector(".code") && !location.search.includes('debug')) {
      return;
    }
    if (localStorage.getItem("debug") == "true" || location.search.includes('debug')) {
      document.querySelector(".code").style.display = "block";
    } else {
      document.querySelector(".code").style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * @description 翻译初始化
 */
function translateInit() {
  try {
    if (translate) {
      translate.selectLanguageTag.show = false;
      translate.language.setLocal("chinese_simplified");
      translate.listener.start();
      translate.service.use("client.edge");
      translate.execute();
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * @description 设置语言
 * @param {*} s - 语言
 */
function setLange(s) {
  try {
    if (translate) {
      translate.changeLanguage(s);
    }
  } catch (error) {
    console.log(error);
  }
}

window.ChanCMS = {
  toggleMenu,
  loadSwiper,
  setActiveNav,
  toSearchWap,
  backToTop,
  debug,
  translateInit,
  setLange,
};

document.addEventListener("DOMContentLoaded", function () {
  // 移动端菜单切换
  ChanCMS.toggleMenu();
  // 轮播图功能
  ChanCMS.loadSwiper();

  // 导航高亮
  var url =
    location.pathname == "/"
      ? [...buildUrlsFromArray(), ...buildUrlsFromArray("page.html"), "/"]
      : [...buildUrlsFromArray(), ...buildUrlsFromArray("page.html")];

  ChanCMS.setActiveNav(url, "font-semibold", false);
  ChanCMS.translateInit();
  // 调试
  ChanCMS.debug();
});