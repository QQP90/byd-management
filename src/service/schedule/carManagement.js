import { get, post } from "@/api/api.js";


// 查询车系表格数据
export const getModelDataList = (obj = {}) => {
  return post("/schedule-api/schedule/getModelDataList", obj);
};

// 查询子车系表格数据
export const getSubModelDataList = (obj = {}) => {
  return post("/schedule-api/schedule/getSubModelDataList", obj);
};

// 新增车系
export const addModelData = (obj = {}) => {
  return post("/schedule-api/schedule/addModelData", obj);
};

// 新增子车系
export const addSubModelData = (obj = {}) => {
  return post("/schedule-api/schedule/addSubModelData", obj);
};

// 获取车系列表
export const getModelData = (obj = {}) => {
  return post("/schedule-api/schedule/getModelData", obj);
};

// 修改车系
export const updateModelName = (obj = {}) => {
  return post("/schedule-api/schedule/updateModelName", obj);
};

// 修改子车系
export const updateSubModelName = (obj = {}) => {
  return post("/schedule-api/schedule/updateSubModelName", obj);
};

// 禁用、启用车系
export const updateModelState = (obj = {}) => {
  return post("/schedule-api/schedule/updateModelState", obj);
};
// 禁用、启用子车系
export const updateSubModelState = (obj = {}) => {
  return post("/schedule-api/schedule/updateSubModelState", obj);
};