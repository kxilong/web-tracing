import {
  setupReplace,
  HandleEvents,
  handleOptions,
  transportData,
  breadcrumb,
  options,
  notify,
  removeListener,
} from "./src/core/index.js";
import { nativeTryCatch } from "./src/utils";

function init(options) {
  handleOptions(options);
  setupReplace();
}

function install(Vue, options) {
  try {
    init(options);
  } catch (err) {
    console.log(err);
    removeListener();
    HandleEvents.handleError(err);
  }
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
