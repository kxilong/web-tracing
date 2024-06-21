import {
  setupReplace,
  HandleEvents,
  handleOptions,
  transportData,
  breadcrumb,
  options,
  notify,
} from "./src/core/index.js";
import { nativeTryCatch } from "./src/utils";

function init(options) {
  handleOptions(options);
  setupReplace();
}

function install(Vue, options) {
  try {
    const handler = Vue.config.errorHandler;
    Vue.config.errorHandler = function (err, vm, info) {
      HandleEvents.handleError(err);
      if (handler) handler.apply(null, [err, vm, info]);
    };
    init(options);
  } catch (error) {
    console.warn("插件错误");
  }
  init(options);
}

function use(plugin, option) {
  const instance = new plugin(option);
  nativeTryCatch(() => {
    instance.core({ transportData, breadcrumb, options, notify });
  });
}
export default {
  install,
  use,
};
