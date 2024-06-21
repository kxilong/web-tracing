<template>
  <div class="home">
    <div class="mb">
      所有的事件类型:
      <div v-for="(value, key) in sendEventType">{{ `${key}: ${value}` }}</div>
    </div>
    <div>
      所有的事件ID(还有一些id是随机字符串的):
      <div v-for="(value, key) in sendEventId">{{ `${key}: ${value}` }}</div>
    </div>
    <div>
      上报时机这里，一般来说：<br />
      1)PV、错误、用户自定义行为 都是触发后立即就进行上报；<br />
      2)性能数据 需要等待页面加载完成、数据采集完毕后进行上报；<br />
      3)API请求数据
      会进行本地暂存，在数据量达到10条(自拟)时触发一次上报，并且在页面可见性变化、以及页面关闭之前进行上报；<br />
      4)如果你还要上报 点击行为 等其余的数据，跟 API请求数据 一样的上报时机；<br />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const sendEventType = ref({
  pv: "路由",
  error: "错误",
  performance: "资源",
  click: "点击",
  dwell: "页面卸载",
  intersection: "曝光采集",
});
const sendEventId = ref({
  page: "页面",
  resource: "资源",
  server: "请求",
  code: "错误id - code",
  reject: "错误id - reject",
  "console.error": "错误id - console.error",
});
</script>

<style lang="scss"></style>
