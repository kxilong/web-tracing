import { _support } from "./global";

/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export function htmlElementAsString(target) {
  const tagName = target.tagName.toLowerCase();
  if (tagName === "body") {
    return "";
  }
  let classNames = target.classList.value;

  classNames = classNames !== "" ? ` class='${classNames}'` : "";
  const id = target.id ? ` id="${target.id}"` : "";
  const innerText = target.innerText;
  return `<${tagName}${id}${
    classNames !== "" ? classNames : ""
  }>${innerText}</${tagName}>`;
}

// 对每一个错误详情，生成唯一的编码
export function getErrorUid(input) {
  return window.btoa(encodeURIComponent(input));
}

export function hashMapExist(hash) {
  const exist = _support.errorMap.has(hash);
  if (!exist) {
    _support.errorMap.set(hash, true);
  }
  return exist;
}

export function parseUrlToObj(url) {
  if (!url) {
    return {};
  }
  const match = url.match(
    /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/
  );
  if (!match) {
    return {};
  }
  const query = match[6] || "";
  const fragment = match[8] || "";
  return {
    host: match[4],
    path: match[5],
    protocol: match[2],
    relative: match[5] + query + fragment,
  };
}
