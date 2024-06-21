import { interceptStr, getTimestamp, fromHttpStatus } from "../utils";
import { STATUS_CODE, HTTP_CODE } from "../common";

export function resourceTransform(target) {
  return {
    time: getTimestamp(),
    message:
      (interceptStr(target.src, 120) || interceptStr(target.href, 120)) +
      "; 资源加载失败",
    name: target.localName,
  };
}

// 处理接口的状态
export function httpTransform(data) {
  let message = "";
  const {
    elapsedTime,
    time,
    method = "",
    type,
    Status = 200,
    response,
    requestData,
  } = data;
  let status;
  if (Status === 0) {
    status = STATUS_CODE.ERROR;
    message =
      elapsedTime <= 10 * 1000
        ? `请求失败，Status值为:${Status}`
        : "请求失败，接口超时";
  } else if (Status < HTTP_CODE.BAD_REQUEST) {
    status = STATUS_CODE.OK;
  } else {
    status = STATUS_CODE.ERROR;
    message = `请求失败，Status值为:${Status}，${fromHttpStatus(Status)}`;
  }
  message = `${data.url}; ${message}`;

  return {
    url: data.url,
    time,
    status,
    elapsedTime,
    message,
    requestData: {
      httpType: type,
      method,
      data: requestData || "",
    },
    response: {
      Status,
      data: status == STATUS_CODE.ERROR ? response : null,
    },
  };
}
