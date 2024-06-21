const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/index.vue"),
    meta: {
      title: "首页",
      icon: "el-icon-setting",
    },
  },
  {
    path: "/error",
    name: "Error",
    component: () => import("@/views/error/index.vue"),
    meta: {
      title: "监控 - 错误",
      icon: "el-icon-setting",
    },
  },
  {
    path: "/event",
    name: "Event",
    component: () => import("@/views/event/index.vue"),
    meta: {
      title: "监控 - 点击事件",
      icon: "el-icon-setting",
    },
  },
];

export default routes;
