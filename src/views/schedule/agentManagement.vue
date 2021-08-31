<template>
  <div>
    <div class="add">
      <a-button class="add-btn" @click="addProcy(1)">新增代理</a-button>
    </div>

    <div class="content">
      <a-table
        max-width="891"
        :columns="columns"
        :loading="loading"
        :data-source="tableData"
        rowKey="agentId"
        :pagination="false"
      >
        <template slot="changeInfo" slot-scope="text, record">
          <span class="default" @click="addProcy(record)">
            修改
          </span>
        </template>

        <template slot="state" slot-scope="text, record">
          <span v-if="record.state == 1">正常</span>
          <span v-if="record.state == 0">已停用</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a-switch :checked="record.state == 1" @change="onChange(record)" />
        </template>
      </a-table>
    </div>
    <a-modal
      class="push_modal"
      @cancel="handleCancel"
      :title="procyTitle"
      centered
      width="560px"
      v-model="isShow"
      :footer="null"
    >
      <a-input v-model="procyName"></a-input>
      <div class="modalPush">
        <a-button
          class="ant-btn"
          @click="handleCancel"
          style="margin-right:20px"
        >
          取消
        </a-button>
        <a-button class="ant-btn" type="primary" @click="confirm">
          确定
        </a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import agentManagement from "@/service/schedule/agentManagement";

export default {
  name: "AgentManagement",
  data() {
    return {
      procyTitle: "",
      procyName: "",
      tableData: [],
      columns: [
        {
          title: "代理ID",
          align: "center",
          key: "agentId",
          dataIndex: "agentId",
        },
        {
          title: "代理名称",
          align: "center",
          key: "agentName",
          dataIndex: "agentName",
        },
        {
          title: "修改信息",
          key: "changeInfo",
          align: "center",
          dataIndex: "changeInfo",
          scopedSlots: { customRender: "changeInfo" },
        },
        {
          title: "状态",
          align: "center",
          key: "state",
          dataIndex: "state",
          scopedSlots: { customRender: "state" },
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          dataIndex: "action",
          scopedSlots: { customRender: "action" },
        },
      ],
      addtype: -1,
      loading: false,
      isShow: false,
      agentId: "",
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    onChange(val) {
      let state = val.state == 1 ? 0 : 1;
      this.scheduleModifyAgentState({ agentId: val.agentId, state });
    },
    //
    addProcy(num) {
      this.isShow = true;
      this.addtype = num;
      this.procyName = "";
      if (num == 1) {
        this.procyTitle = "新增代理名称";
      } else {
        this.procyTitle = "修改代理名称";
        this.procyName = num.agentName;
        this.agentId = num.agentId;
      }
    },
    handleCancel() {
      this.isShow = false;
    },
    confirm() {
      if (this.addtype == 1) {
        this.add({ agentName: this.procyName });
      } else {
        this.scheduleModifyAgentName({
          agentId: this.agentId,
          modifiedName: this.procyName,
        });
      }
    },
    // 新增
    add(obj) {
      agentManagement.scheduleAddAgent(obj).then((res) => {
        this.$message.success(res.message);
        this.isShow = false;
        this.getList();
      });
    },
    // 查询
    getList() {
      this.loading = true;
      agentManagement
        .scheduleGetAgentList()
        .then((res) => {
          this.tableData = res.data;
          this.loading = false;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    // 修改状态
    scheduleModifyAgentState(obj) {
      agentManagement
        .scheduleModifyAgentState(obj)
        .then((res) => {
          this.$message.success(res.message);
          this.isShow = false;
          this.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    scheduleModifyAgentName(obj) {
      agentManagement
        .scheduleModifyAgentName(obj)
        .then((res) => {
          this.$message.success(res.message);
          this.isShow = false;
          this.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.add {
  padding: 0 0 14px 20px;
  .add-btn {
    color: #212121;
    font-size: 12px;
    width: 160px;
    height: 32px;
    background: #ffffff;
  }
}
.content {
  background: #fff;
  padding: 20px;
}
/deep/.ant-table {
  width: 891px;
  border: 1px solid #d9d9d9;
}
/deep/.ant-table-column-title {
  font-weight: 600;
}
.modalPush {
  text-align: center;
  .ant-btn {
    width: 100px;
    height: 36px;
    margin-top: 41px;
  }
}
.default {
  font-size: 14px;
  color: #0073c6;
  cursor: pointer;
}
</style>
