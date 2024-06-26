import { subscribeEvent, notify } from "./subscribe";
import { EVENTTYPES, HTTPTYPE } from "../common/constant";
import {
  on,
  _global,
  throttle,
  replaceAop,
  getTimestamp,
  getLocationHref,
  supportsHistory,
  isExistProperty,
} from "../utils";

function replace(type) {
  switch (type) {
    case EVENTTYPES.OFFLINE:
      listenOfflinechange();
      break;
    case EVENTTYPES.HASHCHANGE:
      listenHashchange();
      break;
    case EVENTTYPES.HISTORY:
      historyReplace();
      break;
    case EVENTTYPES.FETCH:
      fetchReplace();
      break;
    case EVENTTYPES.XHR:
      xhrReplace();
      break;
    case EVENTTYPES.ERROR:
      listenError();
      break;
    case EVENTTYPES.CLICK:
      domReplace();
      break;
    case EVENTTYPES.UNHANDLEDREJECTION:
      unhandledrejectionReplace();
      break;
    default:
      break;
  }
}

export function addReplaceHandler(handler) {
  if (!subscribeEvent(handler)) return;
  replace(handler.type);
}

function domReplace() {
  if (!("document" in _global)) return;
  // 节流，默认0s
  const clickThrottle = throttle(notify, 3000);
  on(
    _global.document,
    "click",
    function () {
      clickThrottle(EVENTTYPES.CLICK, {
        category: "click",
        data: this,
      });
    },
    true
  );
}

function listenError() {
  on(
    _global,
    "error",
    function (e) {
      notify(EVENTTYPES.ERROR, e);
    },
    true
  );
}

function unhandledrejectionReplace() {
  on(_global, EVENTTYPES.UNHANDLEDREJECTION, function (ev) {
    // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
    notify(EVENTTYPES.UNHANDLEDREJECTION, ev);
  });
}

function xhrReplace() {
  if (!("XMLHttpRequest" in _global)) {
    return;
  }

  const originalXhrProto = XMLHttpRequest.prototype;
  let websee_xhr = {};
  replaceAop(originalXhrProto, "open", (originalOpen) => {
    return function (...args) {
      websee_xhr = {
        method: args[0].toUpperCase(),
        url: args[1],
        sTime: getTimestamp(),
        type: HTTPTYPE.XHR,
      };
      originalOpen.apply(this, args);
    };
  });

  replaceAop(originalXhrProto, "send", (originalSend) => {
    return function (...args) {
      on(this, "loadend", function () {
        const { status } = this;
        websee_xhr.requestData = args[0];
        const eTime = getTimestamp();
        // 设置该接口的time，用户用户行为按时间排序
        websee_xhr.time = websee_xhr.sTime;
        websee_xhr.Status = status;
        // 接口的执行时长
        websee_xhr.elapsedTime = eTime - websee_xhr.sTime;
        // 执行之前注册的xhr回调函数
        notify(EVENTTYPES.XHR, websee_xhr);
      });
      originalSend.apply(this, args);
    };
  });
}

function fetchReplace() {
  if (!("fetch" in _global)) return;

  replaceAop(_global, EVENTTYPES.FETCH, (originalFetch) => {
    return function (url, config) {
      const sTime = getTimestamp();
      const method = (config && config.method) || "GET";
      let fetchData = {
        type: HTTPTYPE.FETCH,
        method,
        requestData: config && config.body,
        url,
        response: "",
      };
      const headers = new Headers(config?.headers || {});
      Object.assign(headers, {
        setRequestHeader: headers.set,
      });
      config = Object.assign({}, config, headers);
      return originalFetch.apply(_global, [url, config]).then(
        (res) => {
          // 克隆一份，防止被标记已消费
          const tempRes = res.clone();
          const eTime = getTimestamp();
          fetchData = Object.assign({}, fetchData, {
            elapsedTime: eTime - sTime,
            Status: tempRes.status,
            time: sTime,
          });
          tempRes.text().then((text) => {
            notify(EVENTTYPES.FETCH, fetchData);
          });
          return res;
        },
        (err) => {
          const eTime = getTimestamp();
          fetchData = Object.assign({}, fetchData, {
            elapsedTime: eTime - sTime,
            status: 0,
            time: sTime,
          });
          notify(EVENTTYPES.FETCH, fetchData);
          throw err;
        }
      );
    };
  });
}

let lastHref = getLocationHref();
function historyReplace() {
  if (!supportsHistory()) {
    return;
  }
  const oldOnpopstate = _global.onpopstate;
  _global.onpopstate = function (event) {
    const to = getLocationHref();
    const from = lastHref;
    lastHref = to;
    notify(EVENTTYPES.HISTORY, {
      from,
      to,
    });
    oldOnpopstate && oldOnpopstate.call(this, event);
  };
  function historyReplaceFn(originalHistoryFn) {
    return function (...args) {
      const url = args.length > 2 ? args[2] : undefined;
      if (url) {
        const from = lastHref;
        const to = String(url);
        lastHref = to;
        notify(EVENTTYPES.HISTORY, {
          from,
          to,
        });
      }
      return originalHistoryFn.apply(this, args);
    };
  }
  // 重写pushState、replaceState事件
  replaceAop(_global.history, "pushState", historyReplaceFn);
  replaceAop(_global.history, "replaceState", historyReplaceFn);
}

function listenHashchange() {
  // 通过onpopstate事件，来监听hash模式下路由的变化
  if (isExistProperty(_global, "onhashchange")) {
    on(_global, EVENTTYPES.HASHCHANGE, function (e) {
      console.log(e);
      notify(EVENTTYPES.HASHCHANGE, e);
    });
  }
}

function listenOfflinechange() {
  on(
    _global,
    "offline",
    function (e) {
      notify(EVENTTYPES.OFFLINE, e);
    },
    true
  );
}
