import { addReplaceHandler, breadcrumb, HandleEvents } from "./index";
import { EVENTTYPES, STATUS_CODE } from "../common/constant";
import { htmlElementAsString, getTimestamp } from "../utils";

export function setupReplace() {
  // 监听s网络是否关闭
  addReplaceHandler({
    callback: (e) => {
      HandleEvents.handleOfflinechange(e);
    },
    type: EVENTTYPES.OFFLINE,
  });
  // 监听hashchange
  addReplaceHandler({
    callback: (e) => {
      HandleEvents.handleHashchange(e);
    },
    type: EVENTTYPES.HASHCHANGE,
  });
  // 监听history模式路由的变化
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHistory(data, EVENTTYPES.HISTORY);
    },
    type: EVENTTYPES.HISTORY,
  });
  // 重写fetch
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, EVENTTYPES.FETCH);
    },
    type: EVENTTYPES.FETCH,
  });
  // 重写XMLHttpRequest
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, EVENTTYPES.XHR);
    },
    type: EVENTTYPES.XHR,
  });
  // 添加handleUnhandleRejection事件
  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleUnhandleRejection(error);
    },
    type: EVENTTYPES.UNHANDLEDREJECTION,
  });
  // 捕获错误
  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleError(error);
    },
    type: EVENTTYPES.ERROR,
  });
  //   监听click事件
  addReplaceHandler({
    callback: (data) => {
      // 获取html信息
      const htmlString = htmlElementAsString(data.data.activeElement);
      if (htmlString) {
        breadcrumb.push({
          type: EVENTTYPES.CLICK,
          status: STATUS_CODE.OK,
          category: breadcrumb.getCategory(EVENTTYPES.CLICK),
          data: htmlString,
          time: getTimestamp(),
        });
      }
    },
    type: EVENTTYPES.CLICK,
  });
}
