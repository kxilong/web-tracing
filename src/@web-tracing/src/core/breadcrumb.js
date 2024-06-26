import { _support, getTimestamp } from "../utils";
import { EVENTTYPES, BREADCRUMBTYPES } from "../common/constant";

export class Breadcrumb {
  maxBreadcrumbs = 20; // 用户行为存放的最大长度
  beforePushBreadcrumb;
  stack;
  constructor() {
    this.stack = [];
  }
  // 添加用户行为栈
  push(data) {
    this.immediatePush(data);
  }
  immediatePush(data) {
    data.time || (data.time = getTimestamp());
    if (this.stack.length >= this.maxBreadcrumbs) {
      this.shift();
    }
    this.stack.push(data);
    this.stack.sort((a, b) => a.time - b.time);
  }
  shift() {
    return this.stack.shift() !== undefined;
  }
  getStack() {
    return this.stack;
  }
  getCategory(type) {
    switch (type) {
      // 接口请求
      case EVENTTYPES.XHR:
      case EVENTTYPES.FETCH:
        return BREADCRUMBTYPES.HTTP;

      // 用户点击
      case EVENTTYPES.CLICK:
        return BREADCRUMBTYPES.CLICK;

      // 路由变化
      case EVENTTYPES.HISTORY:
      case EVENTTYPES.HASHCHANGE:
        return BREADCRUMBTYPES.ROUTE;

      // 加载资源
      case EVENTTYPES.RESOURCE:
        return BREADCRUMBTYPES.RESOURCE;

      // Js代码报错
      case EVENTTYPES.UNHANDLEDREJECTION:
      case EVENTTYPES.ERROR:
        return BREADCRUMBTYPES.CODEERROR;

      // 断网
      case EVENTTYPES.OFFLINE:
        return BREADCRUMBTYPES.OFFLINE;

      // 用户自定义
      default:
        return BREADCRUMBTYPES.CUSTOM;
    }
  }
}

const breadcrumb =
  _support.breadcrumb || (_support.breadcrumb = new Breadcrumb());
export { breadcrumb };
