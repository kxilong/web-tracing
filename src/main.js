import { createApp } from "vue";
import "./style.scss";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router";
import WebTracing from "./@web-tracing";
import recordscreen from "./recordscreen";
import initComponents from "./components/index";

const app = createApp(App);

app.use(WebTracing, {
  dsn: "http://localhost:3350/reportData",
  pageId: "cxh",
  useImgUpload: true,
});

WebTracing.use(recordscreen, { recordScreentime: 15 });

app.use(router);
app.use(initComponents);
app.use(ElementPlus);
app.mount("#app");
