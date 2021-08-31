import { get, post } from "@/api/api.js";


// 查询代理
export const getAgents = (obj = {}) => {
  return post("/schedule-api/schedule/getAgents", obj);
};

// 查询事业部
export const getParentDeptList = (obj = {}) => {
  return post("/schedule-api/schedule/getParentDeptList", obj);
};

// 查询部门
export const getDeptList = (obj = {}) => {
  return post("/schedule-api/schedule/getDeptList", obj);
};

// 查询阅读状态
export const getMessageReadStateList = (obj = {}) => {
  return post("/schedule-api/schedule/getMessageReadStateList", obj);
};

// 查询消息列表
export const getMessageNoticeList = (obj = {}) => {
  return post("/schedule-api/schedule/getMessageNoticeList", obj);
};