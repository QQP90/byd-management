import { get, post, put } from "@/api/api.js";

// 权限控制
export const getUserRoleRootList = (obj = {}) => {
  return post("/user-api/user/getUserRoleRootList", obj);
};
