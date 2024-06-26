import ErrorStackParser from "error-stack-parser";
import { EVENTTYPES, STATUS_CODE } from "../common/constant";
import {
  breadcrumb,
  transportData,
  resourceTransform,
  options,
  httpTransform,
} from "./index";
import {
  getTimestamp,
  getErrorUid,
  hashMapExist,
  unknownToString,
  parseUrlToObj,
} from "../utils";

const HandleEvents = {
  handleHashchange(data) {
    const { oldURL, newURL } = data;
    const { relative: from } = parseUrlToObj(oldURL);
    const { relative: to } = parseUrlToObj(newURL);
    breadcrumb.push({
      type: EVENTTYPES.HASHCHANGE,
      category: breadcrumb.getCategory(EVENTTYPES.HASHCHANGE),
      data: {
        from,
        to,
      },
      time: getTimestamp(),
      status: STATUS_CODE.OK,
    });
  },
  handleHistory(data) {
    const { from, to } = data;
    // 定义parsedFrom变量，值为relative
    const { relative: parsedFrom } = parseUrlToObj(from);
    const { relative: parsedTo } = parseUrlToObj(to);
    breadcrumb.push({
      type: EVENTTYPES.HISTORY,
      category: breadcrumb.getCategory(EVENTTYPES.HISTORY),
      data: {
        from: parsedFrom ? parsedFrom : "/",
        to: parsedTo ? parsedTo : "/",
      },
      time: getTimestamp(),
      status: STATUS_CODE.OK,
    });
  },
  handleHttp(data, type) {
    const result = httpTransform(data);
    // 添加用户行为，去掉自身上报的接口行为
    if (!data.url.includes(options.dsn)) {
      breadcrumb.push({
        type,
        category: breadcrumb.getCategory(type),
        data: result,
        status: result.status,
        time: data.time,
      });
    }
    if (result.status === "error") {
      // 上报接口错误
      transportData.send({ ...result, type, status: STATUS_CODE.ERROR });
    }
  },
  handleError(ev) {
    const target = ev.target;
    if (!target || (ev.target && !ev.target.localName)) {
      const stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      const errorData = {
        type: EVENTTYPES.ERROR,
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        message: ev.message,
        fileName,
        line: lineNumber,
        column: columnNumber,
      };
      breadcrumb.push({
        type: EVENTTYPES.ERROR,
        category: breadcrumb.getCategory(EVENTTYPES.ERROR),
        data: errorData,
        time: getTimestamp(),
        status: STATUS_CODE.ERROR,
      });
      const hash = getErrorUid(
        `${EVENTTYPES.ERROR}-${ev.message}-${fileName}-${columnNumber}`
      );
      if (!hashMapExist(hash)) {
        return transportData.send(errorData);
      }
    }
    // 资源加载报错
    if (target?.localName) {
      // 提取资源加载的信息
      const data = resourceTransform(target);
      breadcrumb.push({
        type: EVENTTYPES.RESOURCE,
        category: breadcrumb.getCategory(EVENTTYPES.RESOURCE),
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        data,
      });
      return transportData.send({
        ...data,
        type: EVENTTYPES.RESOURCE,
        status: STATUS_CODE.ERROR,
      });
    }
  },
  handleUnhandleRejection(ev) {
    const stackFrame = ErrorStackParser.parse(ev.reason)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    const message = unknownToString(ev.reason.message || ev.reason.stack);
    const data = {
      type: EVENTTYPES.UNHANDLEDREJECTION,
      status: STATUS_CODE.ERROR,
      time: getTimestamp(),
      message,
      fileName,
      line: lineNumber,
      column: columnNumber,
    };

    breadcrumb.push({
      type: EVENTTYPES.UNHANDLEDREJECTION,
      category: breadcrumb.getCategory(EVENTTYPES.UNHANDLEDREJECTION),
      time: getTimestamp(),
      status: STATUS_CODE.ERROR,
      data,
    });
    const hash = getErrorUid(
      `${EVENTTYPES.UNHANDLEDREJECTION}-${message}-${fileName}-${columnNumber}`
    );
    if (!hashMapExist(hash)) {
      transportData.send(data);
    }
  },
  handleOfflinechange(data) {
    console.log(data);
    breadcrumb.push({
      type: EVENTTYPES.OFFLINE,
      category: breadcrumb.getCategory(EVENTTYPES.OFFLINE),
      data,
      time: getTimestamp(),
      status: STATUS_CODE.ERROR,
    });
  },
};

export { HandleEvents };
