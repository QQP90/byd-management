export const GetQueryValue = function (queryName) {
  var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  } else {
    return null;
  }
};

export const initSchedulePaneList = userAuth => {
  let paneList = [];
  const defaultSchedulePaneList = [
    {
      name: "项目立项",
      router: "projectInitiation",
    },
    {
      name: "排期计划",
      router: "schedulingPlan",
    },
    {
      name: "车型管理",
      router: "carManagement",
    },
    {
      name: "代理管理",
      router: "agentManagement",
    },
    {
      name: "媒体管理",
      router: "mediaManagement",
    },
    {
      name: "消息通知",
      router: "messageNotification",
    },
  ];
  const { userTypeId, schedulingPlan } = userAuth;
  if (userTypeId == 1) {
    if (schedulingPlan) {
      const { browseRoot } = schedulingPlan;
      if (browseRoot) {
        paneList = [{ name: "排期计划", router: "schedulingPlan", }]
      }
    }
  }
  else {
    paneList = [...defaultSchedulePaneList]
  }
  return { paneList }
}

/**
 * 防抖
 * @param func 执行函数
 * @param wait 间隔时间
 * @param immediate 立即执行
 */
export function _debounce(fn, wait = 300, immediate) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);
      if (callNow) {
        fn.apply(this, arguments);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, arguments);
      }, wait);
    }
  };
}
/**
 * 节流
 * @param func 执行函数
 * @param wait 间隔时间
 * @param options 立即执行
 * options中  leading：false 表示禁用第一次执行 trailing: false 表示禁用停止触发的回调
 */
export function _throttle(fn, wait = 300, options = {}) {
  let timer;
  let previous = 0;
  let throttled = function () {
    let now = +new Date();
    // remaining 不触发下一次函数的剩余时间
    if (!previous && options.leading === false) previous = now;
    let remaining = wait - (now - previous);
    if (remaining < 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      previous = now;
      fn.apply(this, arguments);
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(() => {
        previous = options.leading === false ? 0 : new Date().getTime();
        timer = null;
        fn.apply(this, arguments);
      }, remaining);
    }
  };
  return throttled;
}
export function _download(url) {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Chrome") > -1) {
    window.open(url, "_blank");
  } else {
    let a = document.createElement("a");

    //2.给a标签的href赋上下载地址
    a.href = url;

    //3.让a标签不显示在视图中
    a.style.display = "none";

    //4.将a标签append到文档中
    document.body.appendChild(a);

    //5.a标签自点击
    a.click();

    //6.点击下载后，销毁这个节点
    document.body.removeChild(a);
    // window.location.href = this.downloadUrl;
  }
}
