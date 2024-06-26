import { _global, remove } from "../utils";
import { EVENTTYPES } from "../common/constant";

function removeListener() {
  remove(_global, EVENTTYPES.HASHCHANGE);
  remove(_global, EVENTTYPES.UNHANDLEDREJECTION);
  remove(_global, "error");
  remove(_global, "click");
}

export { removeListener };
