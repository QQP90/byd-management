<template>
  <div>
    <div class="add-media">
      <a-button
        style="width: 160px; border-radius: 0px"
        @click="addMediaModal = true"
        >新增媒体</a-button
      >
    </div>
    <div class="content">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="pageOptions"
        rowKey="mediaId"
        style="width: 642px; border: 1px solid #d9d9d9"
        :loading="loading"
        @change="pageChange"
      >
        <template slot="rechristen" slot-scope="text, record">
          <a href="javascript:;" @click="modifly(record)"> 修改 </a>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-switch
            :defaultChecked="record.stateValue == 1"
            @click="changeState(record)"
          />
        </template>
      </a-table>
    </div>
    <a-modal
      :title="this.info.mediaId ? '修改媒体' : '新增媒体'"
      v-model="addMediaModal"
      width="560px"
      :maskClosable="false"
      @cancel="cancel"
    >
      <a-spin :spinning="spinning">
        <a-input v-model.trim="info.mediaName" />
      </a-spin>
      <p slot="footer" style="text-align: center">
        <a-button style="width: 100px; height: 36px" @click="cancel"
          >取消</a-button
        >
        <a-button
          style="width: 100px; height: 36px; background: #0073c6"
          type="primary"
          @click="submit"
        >
          确定
        </a-button>
      </p>
    </a-modal>
  </div>
</template>

<script>
import {
  addMedia,
  getMediaList,
  updateMedia,
} from "@/service/schedule/mediaManagement";
export default {
  name: "MediaManagement",
  data() {
    return {
      columns: [
        {
          title: "媒体名称",
          dataIndex: "mediaName",
          width: "190px",
          align: "center",
        },
        {
          title: "修改信息",
          dataIndex: "modifly",
          width: "200px",
          align: "center",
          scopedSlots: { customRender: "rechristen" },
        },
        {
          title: "状态",
          dataIndex: "stateName",
          width: "125px",
          align: "center",
        },
        {
          title: "操作",
          dataIndex: "stateValue",
          width: "125px",
          align: "center",
          scopedSlots: { customRender: "operation" },
        },
      ], // 表格表头
      dataSource: [], // 表格数据
      addMediaModal: false, // 控制添加修改媒体模态框
      loading: true, // 表格loading状态
      info: {}, // 新建，修改信息
      spinning: false, // 提交新建，修改信息时loading状态
      pageOptions: {
        total: 10,
        showSizeChanger: false,
        current: 1,
        pageSize: 10,
      }, // 内部用户表格分页
    };
  },
  methods: {
    // 新增媒体接口
    async addMedia(info) {
      try {
        const res = await addMedia(info);
        if (res.flag) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
          throw "error";
        }
      } catch (error) {
        throw "error";
      }
    },
    // 查询所有媒体接口
    async getMediaList() {
      this.loading = true;
      try {
        const res = await getMediaList();
        this.pageOptions.total = res.data.length;
        this.dataSource = res.data;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    // 修改媒体名称,状态接口
    async updateMedia(info) {
      try {
        const res = await updateMedia(info);
        if (res.flag) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
          throw "error";
        }
        this.getMediaList();
      } catch (error) {
        throw "error";
      }
    },
    // 修改状态
    changeState(info) {
      if (info.stateValue == 1) {
        info.state = 0;
      } else {
        info.state = 1;
      }
      this.updateMedia(info);
    },
    // 提交新建、修改信息
    async submit() {
      this.spinning = true;
      try {
        if (this.info.mediaId) {
          await this.updateMedia(this.info);
        } else {
          await this.addMedia(this.info);
        }
        this.getMediaList();
        this.addMediaModal = false;
        this.info = {};
      } catch (error) {
        console.log(error);
      }
      this.spinning = false;
    },
    // 取消 修改/新建
    cancel() {
      this.addMediaModal = false;
      this.info = {};
    },
    // 修改
    modifly(info) {
      this.addMediaModal = true;
      this.info = JSON.parse(JSON.stringify(info));
    },
    // 页面修改
    pageChange(page) {
      this.pageOptions.current = page.current;
    },
  },
  mounted() {
    this.getMediaList();
  },
};
</script>
<style lang="less" scoped>
.add-media {
  padding: 14px 20px;
  background: #f8f8f8;
}
.content {
  background: #ffffff;
  padding: 20px;
  /deep/ .ant-table-thead > tr:first-child > th:last-child {
    border-top-right-radius: 0px;
  }
  /deep/ .ant-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 0px;
  }
}
</style>
