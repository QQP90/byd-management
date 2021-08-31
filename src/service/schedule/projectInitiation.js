import { get, post } from "@/api/api.js";

// 获取代理名称组件数据
export const getProjectAgentData = () => {
  return post("/schedule-api/schedule/getProjectAgentData");
};

// 查询项目立项信息
export const getProjectApprovalDataList = (obj = {}) => {
  return post("/schedule-api/schedule/getProjectApprovalDataList", obj);
};

// 获取项目时间组件数据
export const getProjectTimeData = () => {
  return post("/schedule-api/schedule/getProjectTimeData");
};

// 获取二级部门组件数据
export const getProjectDeptData = () => {
  return post("/schedule-api/schedule/getProjectDeptData");
};

// 获取一级事业部组件数据
export const getProjectParentDeptData = () => {
  return post("/schedule-api/schedule/getProjectParentDeptData");
};

// 获取投放状态组件数据
export const getProjectStateData = () => {
  return post("/schedule-api/schedule/getProjectStateData");
};

// 获取投放目标组件数据
export const getPutCampaignTypeData = () => {
  return post("/schedule-api/schedule/getPutCampaignTypeData");
};

// 获取子车系组件数据
export const getSubModelData = () => {
  return post("/schedule-api/schedule/getSubModelData");
};

// 新建推广活动
export const insertProjectPutActive = (obj = {}) => {
  return post("/schedule-api/schedule/insertProjectPutActive", obj);
};

// 修改推广活动
export const updateProjectPutActive = (obj = {}) => {
  return post("/schedule-api/schedule/updateProjectPutActive", obj);
};

// 根据项目名模糊匹配
export const getCampaignNameList = (obj = {}) => {
  return post("/schedule-api/schedule/getCampaignNameList", obj);
};

// 获取活动阶段组件数据
export const getActivePhaseData = () => {
  return post("/schedule-api/schedule/getActivePhaseData");
};

// 获取媒体组件数据
export const getProjectMediaData = () => {
  return post("/schedule-api/schedule/getProjectMediaData");
};
