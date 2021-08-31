import {
  getAllDepts,
  getAllUserRoles,
  getCompanies,
  getUserRoles,
  getUserRole,
} from "@/service/internalUser/user.js";
export default {
  namespaced: true,
  state: {
    interiorAddUser: false, // 控制内部用户手动添加用户模态框
    interiorBatchAddUser: false, // 控制内部用户批量添加用户模态框
    adcraftAddUser: false, // 控制广告代理手动添加用户模态框
    adcraftBatchAddUser: false, // 控制广告代理批量添加用户模态框
    allDepts: [], // 部门数据
    userRoles: [], // 用户角色
    companyList: [], // 公司数据
    agentRolesList: [], // 代理角色
    userInfo: {
      userRole: "", //用户角色，1系统管理员，2领导者，3普通用户，4广告代理
      userType: "", //用户类型0，内部用户，1广告代理
    }, //当前用户角色
  },
  mutations: {
    Set_ALL_DEPTS(state, val) {
      state.allDepts = val;
    },
    SET_INTERIOR_ADD_USER(state, bool) {
      state.interiorAddUser = bool;
    },
    SET_ADCRAFT_ADD_USER(state, bool) {
      state.adcraftAddUser = bool;
    },
    SET_INTERIOR_BATCH_ADD_USER(state, bool) {
      state.interiorBatchAddUser = bool;
    },
    SET_ADCRAFT_BATCH_ADD_USER(state, bool) {
      state.adcraftBatchAddUser = bool;
    },
    SET_USER_ROLES(state, lis) {
      state.userRoles = lis;
    },
    SET_COMPANY_LIST(state, payload) {
      state.companyList = payload;
    },
    SET_AGENT_ROLES_LIST(state, payload) {
      state.agentRolesList = payload;
    },
    SET_AGENT_USER_TYPE(state, payload) {
      state.userInfo = payload;
    },
  },
  actions: {
    async getAllDepts(context) {
      if (context.state.allDepts.length) return;
      try {
        const res = await getAllDepts();
        context.commit("Set_ALL_DEPTS", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    async getAllUserRoles(context) {
      if (context.state.userRoles.length) return;
      try {
        const res = await getAllUserRoles();
        context.commit("SET_USER_ROLES", res.data);
      } catch (err) {
        console.error(err);
      }
    },
    async getCompanies(context) {
      if (context.state.companyList.length) return;
      try {
        const res = await getCompanies();
        context.commit("SET_COMPANY_LIST", res.data);
      } catch (err) {
        context.commit("SET_COMPANY_LIST", []);
        console.error(err);
      }
    },
    async getUserRoles(context) {
      if (context.state.agentRolesList.length) return;
      try {
        const res = await getUserRoles();
        context.commit("SET_AGENT_ROLES_LIST", res.data);
      } catch (err) {
        context.commit("SET_AGENT_ROLES_LIST", []);
        console.error(err);
      }
    },

    // 获取当前用户角色
    async getUserRole(context) {
      try {
        const res = await getUserRole();
        context.commit("SET_AGENT_USER_TYPE", res.data);
      } catch (err) {
        context.commit("SET_AGENT_USER_TYPE", "");
        console.error(err);
      }
    },
  },
};
