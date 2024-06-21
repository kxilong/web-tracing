import { transportData } from "./index";
import { _support } from "../utils";

export class Options {
  dsn = ""; // 监控上报接口的地址
  bindOptions(options) {
    this.dsn = options?.dsn;
  }
}
const options = _support.options || (_support.options = new Options());

export function handleOptions(paramOptions) {
  // transportData 配置上报的信息
  transportData.bindOptions(paramOptions);
  // 绑定其他配置项
  options.bindOptions(paramOptions);
}

export { options };
