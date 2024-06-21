import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true, // 或者使用 'inline' 等其他选项
  },
  server: {
    https: false,
    host: "0.0.0.0",
    port: 6657,
    cors: true,
    proxy: {
      "/getList": {
        target: "http://localhost:3350/",
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false, //  设置支持https协议的代理,
      },
      "/setList": {
        target: "http://localhost:3350/",
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false, //  设置支持https协议的代理,
      },
      "/cleanTracingList": {
        target: "http://localhost:3350/",
        changeOrigin: false,
        secure: false,
      },
      "/getBaseInfo": {
        target: "http://localhost:3350",
      },
      "/getAllTracingList": {
        target: "http://localhost:3350",
      },
      "/trackweb": {
        target: "http://localhost:3350",
      },
      "/getSourceMap": {
        target: "http://localhost:3350/",
        changeOrigin: false, //  target是域名的话，需要这个参数，
        secure: false, //  设置支持https协议的代理,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
