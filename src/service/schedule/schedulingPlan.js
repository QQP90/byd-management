import { get, post, put } from "@/api/api.js";
export default class {
  // 代理
  static scheduleGetAgents(data) {
    return post("/schedule-api/schedule/getAgents", data);
  }
  //   时间
  static scheduleGetCampaignDate(data) {
    return post("/schedule-api/schedule/getCampaignDate", data);
  }
  //  项目名称补全
  static scheduleGetCampaignNameByKey(data) {
    return post("/schedule-api/schedule/getCampaignNameByKey", data);
  }
  //   投放状态组件接口
  static scheduleGetDeliveryStatus(data) {
    return post("/schedule-api/schedule/getDeliveryStatus", data);
  }
  // 查询接口
  static getCampaignCreatedDataList(data) {
    return post("/schedule-api/schedule/getCampaignCreatedDataList", data);
  }
  // 查询二级部门接口
  static getDeptList(data) {
    return post("/schedule-api/schedule/getDeptList", data);
  }
  //事业部
  static getParentDeptList(data) {
    return post("/schedule-api/schedule/getParentDeptList", data);
  }
  // 查看推广活动信息接口
  static getPromotingEvent(data) {
    return post("/schedule-api/schedule/getPromotingEvent", data);
  }
  // 修改审核状态接口
  static modifyAuditState(data) {
    return post("/schedule-api/schedule/modifyAuditState", data);
  }
  // 下载排期模板
  static downloadScheduleModel(parmas) {
    const baseApiUrl = process.env.VUE_APP_BASE_URL;
    return get(`/schedule-api/schedule/downloadScheduleModel`, parmas);
  }
  // 下载排期表
  static downloadScheduleTable(parmas) {
    const baseApiUrl = process.env.VUE_APP_BASE_URL;
    return get(`/schedule-api/schedule/downloadScheduleTable`, parmas);
  }
  // 修改
  static modifyScheduleMessages(data) {
    return post("/schedule-api/schedule/modifyScheduleMessages", data);
  }
  // 上传
  static uploadScheduleMessages(data) {
    return post("/schedule-api/schedule/uploadScheduleMessages", data);
  }
  // /schedule/getSchedulePutActiveData
  // 查看
  static getSchedulePutActiveData(data) {
    return post("/schedule-api/schedule/getSchedulePutActiveData", data);
  }
  // 下载监测代码
  static downloadMonitorCode(data) {
    return post("/schedule-api/schedule/downloadMonitorCode", data);
  }
}
