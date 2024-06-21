import { handleScreen } from "./src/recordscreen";
import {} from "../@web-tracing/src/core";
import { EVENTTYPES } from "../@web-tracing/src/common";
import { _support, generateUUID } from "../@web-tracing/src/utils";

export default class RecordScreen {
  type;
  recordScreentime = 10; // 默认录屏时长
  recordScreenTypeList = [
    EVENTTYPES.ERROR,
    EVENTTYPES.UNHANDLEDREJECTION,
    EVENTTYPES.RESOURCE,
    EVENTTYPES.FETCH,
    EVENTTYPES.XHR,
  ]; // 录屏事件集合
  constructor(params = {}) {
    this.type = "recordScreen";
    this.bindOptions(params);
  }
  bindOptions(params) {
    const { recordScreenTypeList, recordScreentime } = params;
    this.recordScreentime = recordScreentime;
    if (recordScreenTypeList) {
      this.recordScreenTypeList = recordScreenTypeList;
    }
  }
  core({ transportData, options }) {
    // 给公共配置上添加开启录屏的标识 和 录屏列表
    options.silentRecordScreen = true;
    options.recordScreenTypeList = this.recordScreenTypeList;
    // 添加初始的recordScreenId
    _support.recordScreenId = generateUUID();
    handleScreen(transportData, this.recordScreentime);
  }
}
