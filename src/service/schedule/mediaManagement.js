import { get, post } from "@/api/api.js";

// 新增媒体接口
export const addMedia = (obj = {}) => {
  return post("/schedule-api/schedule/addMedia", obj);
};

// 查询所有媒体接口
export const getMediaList = (obj = {}) => {
  return post("/schedule-api/schedule/getMediaList", obj);
};

// 修改媒体名称,状态接口
export const updateMedia = (obj = {}) => {
  return post("/schedule-api/schedule/updateMedia", obj);
};
