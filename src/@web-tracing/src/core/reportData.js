import { _support, getLocationHref } from "../utils";
import { EVENTTYPES } from "../common";
import { breadcrumb } from "./index";

export class TransportData {
  queue = _support.queueData;
  errorDsn = "";
  pageId = ""; //应用ID
  useImgUpload = false; // 是否使用图片打点上报
  constructor() {}
  beacon(url, data) {
    return navigator.sendBeacon(url, JSON.stringify(data));
  }
  imgRequest(data, url) {
    const requestFun = () => {
      const img = new Image();
      const spliceStr = url.indexOf("?") === -1 ? "?" : "&";
      img.src = `${url}${spliceStr}data=${encodeURIComponent(
        JSON.stringify(data)
      )}`;
    };
    _support.queueData.addFn(requestFun);
  }
  xhrPost(data, url) {
    const requestFun = () => {
      fetch(`${url}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
    _support.queueData.addFn(requestFun);
  }
  bindOptions(options) {
    this.pageId = options.pageId;
    this.errorDsn = options.dsn;
  }
  beforePost(data) {
    let transportData = this.getTransportData(data);
    return transportData;
  }
  // 添加公共信息
  // 这里不要添加时间戳，比如接口报错，发生的时间和上报时间不一致
  getTransportData(data) {
    const info = {
      ...data,
      pageId: this.pageId,
      pageUrl: getLocationHref(),
      deviceInfo: _support.deviceInfo, // 获取设备信息
    };
    const excludeRreadcrumb = [
      EVENTTYPES.PERFORMANCE,
      EVENTTYPES.RECORDSCREEN,
      EVENTTYPES.WHITESCREEN,
    ];
    if (!excludeRreadcrumb.includes(data.type)) {
      info.breadcrumb = breadcrumb.getStack(); // 获取用户行为栈
    }
    return info;
  }
  // 上报数据
  send(data) {
    const dsn = this.errorDsn;
    if (!dsn) {
      console.error(
        "web-see: dsn为空，没有传入监控错误上报的dsn地址，请在init中传入"
      );
      return;
    }

    // 开启录屏，由@websee/recordScreen 插件控制
    if (_support.options.silentRecordScreen) {
      if (_support.options.recordScreenTypeList.includes(data.type)) {
        // 修改hasError
        _support.hasError = true;
        data.recordScreenId = _support.recordScreenId;
      }
    }

    const result = this.beforePost(data);
    if (result) {
      // 优先使用sendBeacon 上报，若数据量大，再使用图片打点上报和fetch上报
      // sendBeacon 最大64kb

      const value = this.beacon(dsn, result);
      if (!value) {
        // img 限制在 2kb
        return this.useImgUpload
          ? this.imgRequest(result, dsn)
          : this.xhrPost(result, dsn);
      }
    }
  }
}

const transportData =
  _support.transportData || (_support.transportData = new TransportData());

export { transportData };
