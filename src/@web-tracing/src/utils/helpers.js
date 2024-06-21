export function on(target, eventName, handler, options = false) {
  target.addEventListener(eventName, handler, options);
}

/**
 * 函数节流
 * fn 需要节流的函数
 * delay 节流的时间间隔
 * 返回一个包含节流功能的函数
 */
export const throttle = (fn, delay) => {
  let canRun = true;
  return (...args) => {
    if (!canRun) return;
    fn.apply(this, args);
    canRun = false;
    setTimeout(() => {
      canRun = true;
    }, delay);
  };
};

// 获取当前的时间戳
export function getTimestamp() {
  return Date.now();
}

export function getLocationHref() {
  if (typeof document === "undefined" || document.location == null) return "";
  return document.location.href;
}

export function interceptStr(str, interceptLength) {
  if (typeof str === "string") {
    return (
      str.slice(0, interceptLength) +
      (str.length > interceptLength ? `:截取前${interceptLength}个字符` : "")
    );
  }
  return "";
}

export function unknownToString(target) {
  if (typeof target == "string") {
    return target;
  }
  if (typeof target == "undefined") {
    return "undefined";
  }
  return JSON.stringify(target);
}

export function replaceAop(source, name, replacement) {
  if (!source) return;
  if (name in source) {
    const original = source[name];
    const wrapped = replacement(original);
    if (typeof wrapped == "function") {
      source[name] = wrapped;
    }
  }
}

export function isExistProperty(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function generateUUID() {
  let d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
}
