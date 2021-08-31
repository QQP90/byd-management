<template>
  <div class="message-ctn">
    <div class="search-box">
      <div>
        <a-range-picker
          v-model="rangeTime"
          :disabled-date="disableDate"
          style="width: 230px"
        ></a-range-picker>

        <!-- 事业部 -->
        <a-select
          v-model="businessIds"
          placeholder="事业部名称"
          mode="multiple"
          style="width: 160px"
          :maxTagCount="1"
          @change="businessChange"
        >
          <a-select-option
            v-for="item in firstDeptList"
            :key="`first${item.parentDeptId}`"
            :value="item.parentDeptId"
          >
            {{ item.parentDeptName }}
          </a-select-option>
        </a-select>

        <!-- 部门 -->
        <a-select
          v-model="departmentIds"
          placeholder="部门名称"
          mode="multiple"
          style="width: 160px"
          :maxTagCount="1"
        >
          <a-select-option
            v-for="item in departmentOptions"
            :key="`second${item.id}`"
            :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>

        <!-- 代理 -->
        <a-select
          v-model="agentIds"
          placeholder="代理名称"
          mode="multiple"
          style="width: 160px"
          :maxTagCount="1"
        >
          <a-select-option
            v-for="item in agentList"
            :key="item.agentId"
            :value="item.agentId"
          >
            {{ item.agentName }}
          </a-select-option>
        </a-select>

        <!-- 阅读状态 -->
        <a-select
          v-model="readStatusIds"
          placeholder="阅读状态"
          mode="multiple"
          style="width: 160px"
          :maxTagCount="1"
        >
          <a-select-option
            v-for="item in readStatusList"
            :key="`read${item.value}`"
            :value="item.value"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </div>

      <div>
        <a-button @click="resetSearch"> 重置 </a-button>
        <a-button type="primary" @click="search()"> 查询 </a-button>
      </div>
    </div>

    <div>
      <a-table
        :loading="tableLoading"
        :columns="tableColumns"
        :data-source="tableData"
        :pagination="{
          pageSize: 10,
          current: tableCurrent,
          total: tableTotal,
        }"
        row-key="massageCode"
      >
        <template slot="control" slot-scope="text, record">
          <a
            v-if="record.auditStatus == 0"
            href="javascript:;"
            @click="toExamine(record)"
            >去审核</a
          >
          <span v-else>已审核</span>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  getAgents,
  getParentDeptList,
  getDeptList,
  getMessageReadStateList,
  getMessageNoticeList,
} from "@/service/schedule/messageNotification";

import moment from "moment";

export default {
  name: "MessageNotification",
  data() {
    return {
      rangeTime: [moment().subtract(1, "weeks"), moment()],
      // rangeTime: [moment("2020-01-01"), moment()],
      firstDeptList: [],
      businessIds: [],
      departmentList: [],
      departmentIds: [],
      agentList: [],
      agentIds: [],
      readStatusList: [],
      readStatusIds: [],
      tableData: [],
      tableLoading: true,
      tableCurrent: 1,
      tableTotal: 0,
    };
  },
  computed: {
    departmentOptions() {
      const { businessIds, departmentList } = this;
      const list = departmentList.map((item) => {
        return {
          name: item.deptName,
          id: item.deptId,
          parentId: item.parentDeptId,
        };
      });

      let newList = [];

      if (businessIds.length === 0) {
        newList = [...list];
      } else {
        list.forEach((item) => {
          businessIds.forEach((value) => {
            if (item.parentId === value) {
              newList.push(item);
            }
          });
        });
      }

      return newList;
    },

    tableColumns() {
      return [
        {
          title: "消息编码",
          dataIndex: "massageCode",
          align: "center",
        },
        {
          title: "时间",
          dataIndex: "createTime",
          align: "center",
        },
        {
          title: "内容",
          dataIndex: "content",
          align: "center",
        },
        {
          title: "代理",
          dataIndex: "agentName",
          align: "center",
        },
        {
          title: "推广活动ID",
          dataIndex: "campaginId",
          align: "center",
        },
        {
          title: "推广活动名称",
          dataIndex: "campaginName",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "control",
          align: "center",
          scopedSlots: { customRender: "control" },
        },
      ];
    },
  },
  methods: {
    businessChange() {
      const { departmentOptions, departmentIds } = this;

      const newDepValue = [];

      departmentOptions.forEach((item) => {
        const { id } = item;

        departmentIds.some((value) => {
          if (id === value) {
            newDepValue.push(value);
            return;
          }
        });
      });

      this.departmentIds = newDepValue;
    },
    resetSearch() {
      this.businessIds = [];
      this.departmentIds = [];
      this.agentIds = [];
      this.readStatusIds = [];
    },
    search(page) {
      const { rangeTime, businessIds, departmentIds, agentIds } = this;

      this.tableLoading = true;

      this.getMessageNoticeList({
        startTime: rangeTime[0].format("YYYY-MM-DD"),
        endTime: rangeTime[1].format("YYYY-MM-DD"),
        parentDeptId: businessIds.toString(),
        deptId: departmentIds.toString(),
        agentId: agentIds.toString(),
        auditStatus: "",
        currentPage: page || 1,
        pageSize: 10,
      });
    },
    toExamine(params) {
      const url = `${window.location.origin}/schedule/schedulingPlan?promotionalActiveId=${params.campaginId}`;

      let winOpen = window.open("", "_blank");

      setTimeout(function () {
        winOpen.location.href = url;
      }, 0);
    },
    disableDate(current) {
      return current < moment("2021-01-01") || current > moment();
    },
    async getAgents() {
      try {
        const res = await getAgents();
        this.agentList = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getParentDeptList() {
      try {
        const res = await getParentDeptList();
        this.firstDeptList = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getDeptList(obj) {
      try {
        const res = await getDeptList(obj);
        this.departmentList = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getMessageReadStateList() {
      try {
        const res = await getMessageReadStateList();
        this.readStatusList = res.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getMessageNoticeList(obj) {
      try {
        const res = await getMessageNoticeList(obj);
        this.tableLoading = false;
        this.tableData = res.data.list;
        this.tableTotal = res.data.total;
      } catch (error) {
        this.tableLoading = false;
        console.error(error);
      }
    },
  },
  mounted() {
    this.getAgents();
    this.getParentDeptList();
    this.getDeptList({ parentDeptId: "" });
    this.getMessageReadStateList();
    this.search();
  },
};
</script>

<style lang="less" scoped>
.message-ctn {
  .search-box {
    padding: 14px 20px;
    background: #fff;
  }
}
</style>