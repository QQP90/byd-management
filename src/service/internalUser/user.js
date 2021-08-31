import { get, post, put } from "@/api/api.js";

// 查询所有部门信息
export const getAllDepts = (obj = {}) => {
  return get("/user-api/user/getAllDepts", obj);
};

// 查询内部用户信息
export const getUsersByCondition = (obj = {}) => {
  return post("/user-api/user/getUsersByCondition", obj);
};

// 修改用户密码
export const modifyUserPassword = (obj = {}) => {
  return post("/user-api/user/modifyUserPassword", obj);
};

// 修改用户状态
export const modifyUserStatus = (obj = {}) => {
  return post("/user-api/user/modifyUserStatus", obj);
};

// 获取所有用户角色信息
export const getAllUserRoles = () => {
  return get("/user-api/user/getAllUserRoles");
};

// 重置用户密码
export const resetUserPassword = (obj = {}) => {
  return post("/user-api/user/resetUserPassword", obj);
};

// 手动新增用户
export const addNewUser = (obj = {}) => {
  return post("/user-api/user/addUser", obj);
};

// 上传文件添加用户
export const upLoadUser = (formData) => {
  return post("/user-api/user/importUsersMessages", formData);
};

// 修改用户模块权限
export const getUserModelRoot = (obj) => {
  return post("/user-api/user/getUserModelRoot", obj);
};

// 修改项目模块权限
export const getUserProjectRoot = (obj) => {
  return post("/user-api/user/getUserProjectRoot", obj);
};

// 查询所有公司
export const getCompanies = (obj = {}) => {
  return post("/user-api/user/getCompanies", obj);
};

// 查询代理角色
export const getUserRoles = (obj = {}) => {
  return post("/user-api/user/getUserRoles", obj);
};

// 手动新增代理
export const insertAdUsers = (obj = {}) => {
  return post("/user-api/user/insertAdUsers", obj);
};

// 查询广告代理列表
export const selectAdUsers = (obj = {}) => {
  return post("/user-api/user/selectAdUsers", obj);
};

// 上传文件添加代理
export const importAdvertisingMessages = (formData) => {
  return post("/user-api/user/importAdvertisingMessages", formData);
};

// 修改代理权限
export const updateAdUserModelRoot = (formData) => {
  return post("/user-api/user/updateAdUserModelRoot", formData);
};

// 重置代理密码
export const setAdUserPassword = (formData) => {
  return post("/user-api/user/setAdUserPassword", formData);
};

// 修改代理状态
export const setAdUserForbidRoot = (obj = {}) => {
  return post("/user-api/user/setAdUserForbidRoot", obj);
};
// 权限控制
export const getUserRole = (obj = {}) => {
  return post("/user-api/user/getUserRole", obj);
};
