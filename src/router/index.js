import Vue from "vue";
import VueRouter from "vue-router";
import userControl from "./userManagement/index";
import schedule from "./schedule";

// 去除重复点击路由报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    redirect: "/userManagement",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
