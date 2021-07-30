import { createApp } from "vue";
import Index from "./Index.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
import "./test/server";
import { inspect } from "@xstate/inspect";

// inspect({
//   iframe: false,
// });

createApp(Index).use(store).use(router).use(ElementPlus).mount("#app");
