import { get, post, put } from "@/api/api.js";
export default class {
  // 新增
  static scheduleAddAgent(data) {
    return post("/schedule-api/schedule/addAgent", data);
  }
  //   列表
  static scheduleGetAgentList(data) {
    return post("/schedule-api/schedule/getAgentList", data);
  }
  //   修改代理
  static scheduleModifyAgentName(data) {
    return post("/schedule-api/schedule/modifyAgentName", data);
  }
  //   修改状态
  static scheduleModifyAgentState(data) {
    return post("/schedule-api/schedule/modifyAgentState", data);
  }
}
