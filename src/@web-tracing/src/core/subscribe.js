import { setFlag, nativeTryCatch } from "../utils";

const handlers = {};

export function subscribeEvent(handler) {
  setFlag(handler.type, true);
  handlers[handler.type] = handlers[handler.type] || [];
  handlers[handler.type]?.push(handler.callback);
  return true;
}

export function notify(type, data) {
  if (!type || !handlers[type]) return;
  // 获取对应事件的回调函数并执行，回调函数为addReplaceHandler事件中定义的事件
  handlers[type]?.forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data);
      },
      () => {
        // console.error(
        //   `web-see 重写事件notify的回调函数发生错误\nType:${type}\nName: ${getFunctionName(
        //     callback
        //   )}\nError: ${e}`
        // );
      }
    );
  });
}
