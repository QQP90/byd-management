<template>
  <div>
    <div class="upload">
      <div>
        <div class="push">
          <a-button class="a-btn" @click="handleShowPush(1)">
            上传排期表
          </a-button>
        </div>
        <div class="push">
          <a-button class="a-btn" @click="handleShowPush(2)">
            修改排期表
          </a-button>
        </div>
      </div>
      <div class="reset">
        <a-button style="margin-right:12px" @click="reset">重置</a-button>
        <a-button type="primary" @click="search">查询</a-button>
      </div>
    </div>
    <div class="select_condition">
      <div>
        <!-- 开始日 -->
        <a-date-picker
          v-model="sentData.startTime"
          style="width: 160px"
          class="startTime"
          :disabled-date="disabledStarTime"
          format="YYYY-MM-DD"
        />
        <!-- 结束日 -->
        <a-date-picker
          v-model="sentData.endTime"
          :disabled-date="disabledEndTime"
          format="YYYY-MM-DD"
          style="width: 160px"
          class="endTime"
        />
        <!-- 事业部名称 -->
        <a-select
          style="width: 160px;
          margin-right:20px"
          mode="tags"
          v-model="sentData.parentDeptId"
          @change="deptIdChange"
          placeholder="事业部名称"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in projectDeptDate"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
          >
            {{ item.parentDeptName }}
          </a-select-option>
        </a-select>
        <!-- 部门名称 -->
        <a-select
          style="width: 160px;margin-right:20px"
          mode="tags"
          v-model="sentData.deptId"
          placeholder="部门名称"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in deptSec"
            :key="item.deptId"
            :value="item.deptId"
          >
            {{ item.deptName }}
          </a-select-option>
        </a-select>
        <!-- 代理 -->
        <a-select
          v-if="userAuth && userAuth.roleId != 4"
          style="width: 160px;margin-right:20px"
          v-model="sentData.agentId"
          placeholder="代理"
          mode="tags"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in agents"
            :key="item.agentId"
            :value="item.agentId"
          >
            {{ item.agentName }}
          </a-select-option>
        </a-select>
        <a-select
          v-if="userAuth && userAuth.roleId == 4"
          style="width: 160px;margin-right:20px"
          :disabled="true"
          v-model="sentData.agentId"
        >
          <a-select-option
            v-for="item in agents"
            :key="item.agentId"
            :value="item.agentId"
          >
            {{ item.agentName }}
          </a-select-option>
        </a-select>
        <!-- 状态 -->
        <a-select
          style="width: 160px;margin-right:20px"
          v-model="sentData.state"
          placeholder="请选择投放状态"
          mode="tags"
          :max-tag-count="1"
        >
          <a-select-option
            v-for="item in statusList"
            :key="item.id"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>
      <div>
        <a-auto-complete
          v-model="sentData.campaignName"
          :data-source="projectData"
          style="width: 160px"
          placeholder="项目名称"
          @search="onSearch"
        >
          <a-input>
            <a-icon slot="suffix" type="search" class="certain-category-icon" />
          </a-input>
        </a-auto-complete>
      </div>
    </div>
    <!-- table -->
    <a-table
      :scroll="{ x: 'max-content' }"
      :columns="tableColumns"
      :loading="loading"
      :data-source="dataSource"
      rowKey="campaginId"
      @change="handleTableChange"
      :pagination="pageOptions"
    >
      <template slot="carList" slot-scope="text, record">
        <div
          style="display:inline-block"
          v-for="(item, index) in record.list"
          :key="index"
        >
          <span v-if="index + 1 == record.list.length"> {{ item }} </span>
          <span v-else> {{ item }}- </span>
        </div>
      </template>
      <template slot="xzpqmb" slot-scope="text, record">
        <span v-if="record.auditState == 0 && record.scheduleState == '已排期'"
          >下载排期模板
        </span>
        <span v-else class="default" @click="downPlanForm(record, 1)">
          下载排期模板
        </span>
      </template>
      <template slot="deliveryState" slot-scope="text, record">
        <span v-if="record.deliveryState == 1">投放中</span>
        <span v-if="record.deliveryState == 2">已结束</span>
        <span v-if="record.deliveryState == 3">未开始</span>
      </template>
      <template slot="xzpqb" slot-scope="text, record">
        <span
          v-if="record.auditState == 1 && record.scheduleState == '已排期'"
          class="default"
          @click="downPlanForm(record, 2)"
        >
          下载排期表
        </span>
        <span v-else>
          下载排期表
        </span>
      </template>
      <template slot="xzjcdm" slot-scope="text, record">
        <span
          v-if="record.auditState == 1 && record.scheduleState == '已排期'"
          class="default"
          @click="downloadMonitorCode(record)"
        >
          下载监测代码
        </span>
        <span v-else>
          下载监测代码
        </span>
      </template>
      <template slot="auditState" slot-scope="text, record">
        <span class="default" v-if="record.auditState == 0">
          未审核
        </span>
        <span class="through" v-if="record.auditState == 1">
          审核通过
        </span>
        <span class="default" v-if="record.auditState == 2">
          审核不通过
        </span>
      </template>

      <template slot="check" slot-scope="text, record">
        <span v-if="record.scheduleState == '未排期'">查看</span>
        <span v-else class="default" @click="handleRowId(record)">
          查看
        </span>
      </template>
    </a-table>
    <!-- 上传排期表 -->
    <a-modal
      class="push_modal"
      @cancel="handleCancel"
      :title="null"
      centered
      width="400px"
      v-model="isShowPush"
      :footer="null"
    >
      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-button> <a-icon type="upload" /> 选择导入文件 </a-button>
      </a-upload>
      <div class="modalPush">
        <a-button
          class="ant-btn"
          @click="handleCancel"
          style="margin-right:20px"
        >
          取消
        </a-button>
        <a-button
          class="ant-btn"
          :type="typePrimary"
          :disabled="fileList.length === 0"
          :loading="uploading"
          style="margin-top: 16px"
          @click="handleUpload"
        >
          {{ uploading ? "上传中" : "上传" }}
        </a-button>
      </div>
    </a-modal>
    <!-- 查看 -->
    <a-modal
      class="push_modal"
      @cancel="handleCancel"
      title="推广活动"
      centered
      v-model="isShowCheck"
      :footer="null"
    >
      <a-spin :spinning="spinning">
        <scheduleCheck
          :columns="columns"
          :disable="disable"
          @saveAudit="handleSaveAudit"
          :campaignId="currentCampaignId"
          :tableDataProps="tableDataProps"
        >
        </scheduleCheck>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import SchedulingPlanApi from "@/service/schedule/schedulingPlan";
import { _download } from "@/assets/js/util";
import { mapState } from "vuex";
import scheduleCheck from "./components/scheduleCheck";
export default {
  name: "schedulingPlan",
  data() {
    return {
      isShowPush: false,
      isShowCheck: false,
      disable: false,
      loading: false,
      currentCampaignId: "",
      fileList: [],
      uploading: false,
      spinning: false,
      sentData: {
        state: [],
        currentPage: 1,
        pageSize: 10,
        startTime: null,
        agentId: [],
        endTime: null,
        deptId: [],
        campaignName: "",
        parentDeptId: [],
      },
      typePrimary: "",
      agents: [], //代理
      projectDeptDate: [],
      columns: [],
      rowId: null,
      deptSec: [],
      projectData: [],
      statusList: [],
      keyIndexDayDataList: [],
      tableDataProps: [], //传递数据
      pageOptions: {
        total: 10,
        showTotal: (total) => `共有 ${total} 条数据`,
      },
      tableColumns: [
        {
          title: "事业部",
          fixed: "left",
          align: "center",
          key: "parentDeptName",
          dataIndex: "parentDeptName",
        },
        {
          title: "部门",
          align: "center",
          key: "deptName",
          dataIndex: "deptName",
        },
        {
          title: "车系",
          align: "center",
          key: "carList",
          dataIndex: "carList",
          scopedSlots: { customRender: "carList" },
        },
        {
          title: "推广活动ID",
          align: "center",
          key: "campaginId",
          dataIndex: "campaginId",
        },
        {
          title: "推广活动",
          align: "center",
          key: "campaginName",
          dataIndex: "campaginName",
        },
        {
          title: "开始日期",
          align: "center",
          key: "putStartTime",
          dataIndex: "putStartTime",
        },
        {
          title: "结束日期",
          align: "center",
          key: "putEndTime",
          dataIndex: "putEndTime",
        },
        {
          title: "代理名称",
          align: "center",
          key: "agentName",
          dataIndex: "agentName",
        },
        {
          title: "媒体名称",
          align: "center",
          key: "mediaName",
          dataIndex: "mediaName",
        },

        {
          title: "投放状态",
          align: "center",
          key: "deliveryState",
          dataIndex: "deliveryState",
          scopedSlots: { customRender: "deliveryState" },
        },
        {
          title: "排期状态",
          align: "center",
          fixed: "right",
          key: "scheduleState",
          dataIndex: "scheduleState",
        },
        {
          title: "查看",
          align: "center",
          fixed: "right",
          key: "check",
          dataIndex: "check",
          scopedSlots: { customRender: "check" },
        },
        {
          title: "审核状态",
          align: "center",
          fixed: "right",
          key: "auditState",
          dataIndex: "auditState",
          scopedSlots: { customRender: "auditState" },
        },

        {
          title: "下载排期模板",
          fixed: "right",
          align: "center",
          key: "xzpqmb",
          dataIndex: "xzpqmb",
          scopedSlots: { customRender: "xzpqmb" },
        },
        {
          title: "下载排期表",
          align: "center",
          fixed: "right",
          key: "xzpqb",
          dataIndex: "xzpqb",
          scopedSlots: { customRender: "xzpqb" },
        },
        {
          title: "下载监测代码",
          align: "center",
          fixed: "right",
          key: "xzjcdm",
          dataIndex: "xzjcdm",
          scopedSlots: { customRender: "xzjcdm" },
        },
      ],
      dataSource: [],
      endOpen: false,
      uploadingType: -1, //上传类型
    };
  },
  components: { scheduleCheck },
  async mounted() {
    await this.getRouterParmas();
    await this.scheduleGetAgents();
    await this.scheduleGetDeliveryStatus();
    await this.getParentDeptList();
    await this.getDeptList();
    await this.scheduleGetCampaignDate();
    console.log(this.userAuth, 78);
  },
  methods: {
    moment,
    getRouterParmas() {
      if (Object.keys(this.$route.query).length) {
        this.sentData.campaignId = this.$route.query.promotionalActiveId;
        // this.getCampaignCreatedDataList(this.sentData);
      }
    },
    // 日期列表
    dateList(strt, end) {
      let dateStart = moment(strt);
      let dateEnd = moment(end);
      let timeValues = [];
      let count = moment(dateEnd).diff(dateStart, "day");
      for (let index = 0; index < count; index++) {
        if (dateEnd >= dateStart) {
          timeValues.push(moment(dateStart).format("YYYY-MM-DD"));
          dateStart = dateStart.add(1, "days");
        }
      }
      timeValues.push(dateEnd.format("YYYY-MM-DD"));
      return timeValues;
    },
    // 过滤二级部门
    deptIdChange(val) {
      let parentDeptId = val.toString();
      this.getDeptList({ parentDeptId });
    },
    // 比较时间
    disabledStarTime(startValue) {
      const endValue = this.sentData.endTime;
      return startValue.valueOf() > moment(endValue, "YYYY-MM-DD");
    },
    handleTableChange(val) {
      this.sentData.currentPage = val.current;
      this.sentData.pageSize = val.pageSize;

      this.getCampaignCreatedDataList();
    },
    //比较时间
    disabledEndTime(endValue) {
      const startValue = this.sentData.startTime;
      return (
        startValue.valueOf() > endValue.valueOf() ||
        endValue > moment(this.keyIndexDayDataList[0].endTime, "YYYY-MM-DD")
      );
    },

    // 自动搜索
    onSearch(searchText) {
      this.scheduleGetCampaignNameByKey({ keyWord: searchText });
    },
    // 上传排期表
    handleShowPush(type) {
      this.isShowPush = true;
      this.uploadingType = type;
    },

    handleCancel() {
      this.fileList = [];
      this.isShowPush = false;
      this.isShowCheck = false;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
      this.typePrimary = "";
    },
    beforeUpload(file) {
      this.fileList = [];
      this.fileList = [...this.fileList, file];
      this.typePrimary = "primary";
      return false;
    },
    handleUpload() {
      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("file", file);
      });
      this.uploading = true;
      if (this.uploadingType == 1) {
        SchedulingPlanApi.uploadScheduleMessages(formData)
          .then((res) => {
            if (res.code == 20000) {
              this.uploading = false;
              this.isShowPush = false;
              this.$message.success("上传成功");
              this.search();
            }
          })
          .catch((err) => {
            this.fileList = [];
            this.typePrimary = "";
            this.uploading = false;
          });
      } else {
        SchedulingPlanApi.modifyScheduleMessages(formData)
          .then((res) => {
            this.uploading = false;
            this.isShowPush = false;
            this.$message.success("修改成功");
            this.search();
          })
          .catch((err) => {
            this.fileList = [];
            this.typePrimary = "";
            this.uploading = false;
          });
      }
    },
    // 下载监测代码
    downloadMonitorCode(row) {
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      const token = localStorage.getItem("token");
      let url = `/schedule-api/schedule/downloadMonitorCode?campaignId=${row.campaginId}`;

      let downloadUrl = `${baseApiUrl}${url}&authorization=${token}`;
      _download(downloadUrl);
    },
    // 下载排期表
    downPlanForm(row, type) {
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      const token = localStorage.getItem("token");
      let urlTypeStr =
        type == 2 ? "downloadScheduleTable" : "downloadScheduleModel";
      let auditStr =
        type == 1
          ? `&scheduleState=${row.scheduleState}&auditState=${row.auditState}`
          : `&auditState=${row.auditState}`;
      let url = `/schedule-api/schedule/${urlTypeStr}?parentDeptName=${
        row.parentDeptName
      }&deptName=${
        row.deptName
      }&subModelName=${row.list.toString()}&campaignName=${
        row.campaginName
      }&campaignId=${row.campaginId}&putStartTime=${
        row.putStartTime
      }&putEndTime=${row.putEndTime}&agentName=${row.agentName}&mediaName=${
        row.mediaName
      }${auditStr}`;

      let downloadUrl = `${baseApiUrl}${url}&authorization=${token}`;
      _download(downloadUrl);
    },
    // 点击查看
    handleRowId(row) {
      if (row.auditState == 2 && row.scheduleState == "已排期") {
        this.disable = true;
      } else {
        this.disable = false;
      }
      this.columns = [];
      this.isShowCheck = true;
      this.spinning = true;
      let columns = this.dateList(row.putStartTime, row.putEndTime);
      for (let index = 0; index < columns.length; index++) {
        let obj = {
          title: columns[index],
          align: "center",
          key: columns[index],
          dataIndex: columns[index],
        };
        this.columns.push(obj);
      }
      this.currentCampaignId = row.campaginId;
      SchedulingPlanApi.getSchedulePutActiveData({
        campaignId: row.campaginId,
      }).then((res) => {
        this.tableDataProps = [];
        this.spinning = false;
        res.data.forEach((v) => {
          v = { ...v, ...v.timeMap };
          delete v.timeMap;
          this.tableDataProps.push(v);
        });
      });
    },
    // 审核
    handleSaveAudit(obj) {
      if (obj.auditState == 0) {
        this.handleCancel();
      } else {
        this.modifyAuditState(obj);
      }
    },
    // 查询代理
    scheduleGetAgents() {
      SchedulingPlanApi.scheduleGetAgents().then((res) => {
        if (Object.prototype.hasOwnProperty.call(res.data, "length")) {
          this.agents = res.data;
        } else {
          this.agents.push(res.data);
          this.sentData.agentId = res.data.agentId;
        }
      });
    },
    // 时间接口
    scheduleGetCampaignDate() {
      SchedulingPlanApi.scheduleGetCampaignDate().then((res) => {
        this.sentData.startTime = moment(res.data[0].startTime);
        this.sentData.endTime = moment(res.data[0].endTime);
        this.keyIndexDayDataList = res.data;

        setTimeout(() => {
          this.getCampaignCreatedDataList();
        }, 500);
      });
    },
    // 模糊查询列表
    scheduleGetCampaignNameByKey(obj) {
      SchedulingPlanApi.scheduleGetCampaignNameByKey(obj).then((res) => {
        this.projectData = res.data;
      });
    },
    // 状态
    scheduleGetDeliveryStatus() {
      SchedulingPlanApi.scheduleGetDeliveryStatus().then((res) => {
        this.statusList = res.data;
      });
    },
    // 搜索
    getCampaignCreatedDataList() {
      this.loading = true;
      // 参数处理
      let obj = { ...this.sentData };
      obj.deptId = this.sentData.deptId.toString();
      obj.agentId = this.sentData.agentId.toString();
      obj.state = this.sentData.state.toString();
      obj.parentDeptId = this.sentData.parentDeptId.toString();
      obj.putStartTime = moment(this.sentData.startTime).format("YYYY-MM-DD");
      obj.putEndTime = moment(this.sentData.endTime).format("YYYY-MM-DD");
      delete obj.startTime;
      delete obj.endTime;
      SchedulingPlanApi.getCampaignCreatedDataList(obj)
        .then((res) => {
          this.dataSource = [...res.data.list];
          this.loading = false;
          this.pageOptions.total = res.data.total;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error("查询失败");
        });
    },
    // 事业部
    getParentDeptList() {
      SchedulingPlanApi.getParentDeptList().then((res) => {
        this.projectDeptDate = res.data;
      });
    },
    // 部门
    getDeptList(obj) {
      SchedulingPlanApi.getDeptList(obj).then((res) => {
        this.deptSec = res.data;
      });
    },

    // 修改审核状态接口
    modifyAuditState(obj) {
      SchedulingPlanApi.modifyAuditState(obj)
        .then((res) => {
          this.$message.success("审核成功");
          this.handleCancel();
          this.getCampaignCreatedDataList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    reset() {
      const { userAuth } = this;

      this.sentData = {
        state: [],
        currentPage: 1,
        pageSize: 10,
        deptId: [],
        startTime: moment(this.keyIndexDayDataList[0].startTime),
        endTime: moment(this.keyIndexDayDataList[0].endTime),
        campaignName: "",
        parentDeptId: [],
      };
      if (userAuth && userAuth.roleId != 4) {
        this.sentData.agentId = [];
      }
    },
    search() {
      this.getCampaignCreatedDataList();
    },
  },
  computed: {
    ...mapState({ userAuth: (state) => state.userAuth }),
  },
};
</script>
<style lang="less" scoped>
.select_condition {
  width: 100%;
  min-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0 20px;
  > div {
    display: flex;
    flex-wrap: wrap;
    > * {
      margin-right: 20px;
      margin-bottom: 10px;
    }
    > *:last-child {
      margin-right: 0;
    }
  }
  > div:last-child {
    width: 168px;
    flex-shrink: 0;
  }
}
.upload {
  padding: 0 20px;
  height: 60px;
  display: flex;
  line-height: 60px;
  justify-content: space-between;
  background: #ffffff;
  opacity: 1;
  font-size: 12px;
  > div {
    display: flex;
    .push {
      margin-right: 20px;
      .a-btn {
        width: 160px;
      }
    }
  }
  .reset {
    margin: 14px;
  }
}
.push_modal /deep/.ant-modal-body {
  text-align: center;
}
/deep/.ant-table-column-title {
  font-weight: 600;
}
/deep/.ant-table {
  border: 1px solid #d9d9d9;
}
.modalPush {
  .ant-btn {
    width: 100px;
  }
}

.startTime,
.endTime {
  margin-right: 20px;
}
.default,
.through,
.reback {
  color: #0073c6;
  font-size: 14px;
}
.default {
  cursor: pointer;
}
.reback {
  color: #595959;
}
</style>
