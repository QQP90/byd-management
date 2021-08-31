import Vue from "vue";
import Vuex from "vuex";
import user from "./internalUser/user";
import { getUserRoleRootList } from "@/service/index";
import router from "@/router/index";
import userControl from "@/router/userManagement/index";
import schedule from "@/router/schedule";

Vue.use(Vuex);

const defaultMenuList = [
  {
    name: "用户管理",
    icon: "team",
    routeName: "userManagement",
    modelRootId: "6",
  },
  { name: "排期表", icon: "calendar", routeName: "schedule", modelRootId: "5" },
];

const routerMap = {
  userManagement: {
    path: "/userManagement",
    name: "userManagement",
    component: () => import("@/views/userManagement/index.vue"),
    redirect: "/userManagement/userControl",
    children: [...userControl],
  },
  schedule: {
    path: "/schedule",
    name: "schedule",
    component: () => import("@/views/schedule/index.vue"),
    redirect: "/schedule/projectInitiation",
    children: [...schedule],
  },
};

export default new Vuex.Store({
  state: {
    userAuth: null,
    menuList: [],
  },
  mutations: {
    SET_USER_AUTH(state, payload) {
      state.userAuth = payload;
    },
    SET_MENU_LIST(state, payload) {
      state.menuList = payload;
    },
  },
  actions: {
    // 获取用户权限
    async getUserRoleRootList(context) {
      try {
        const res = await getUserRoleRootList();
        const moduleList = res.data.backList;
        const menuList = [];
        const { userTypeId } = res.data;

        defaultMenuList.forEach((item) => {
          const { modelRootId } = item;
          const hasAuth = moduleList.some((module) => {
            return modelRootId === module.modelRootId;
          });
          if (hasAuth) {
            if (userTypeId == 1 && modelRootId == 5) {
              router.addRoute({
                path: "/schedule",
                name: "schedule",
                component: () => import("@/views/schedule/index.vue"),
                redirect: "/schedule/projectInitiation",
                children: [
                  {
                    path: "schedulingPlan",
                    name: "schedulingPlan",
                    component: () =>
                      import("@/views/schedule/schedulingPlan.vue"),
                  },
                ],
              });
            } else {
              router.addRoute(routerMap[item["routeName"]]);
            }
            menuList.push(item);
          }
        });

        context.commit("SET_USER_AUTH", res.data);
        context.commit("SET_MENU_LIST", menuList);
      } catch (err) {
        context.commit("SET_USER_AUTH", null);
        context.commit("SET_MENU_LIST", []);
        console.error(err);
      }
    },
  },
  modules: {
    user,
  },
});
