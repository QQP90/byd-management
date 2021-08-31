<template>
  <div class="car-management-ctn">
    <div class="header">
      <div>
        <a-button class="add-btn" @click="toggleNewModel">新增—车系</a-button>
      </div>
      <div>
        <a-button class="add-btn" @click="toggleNewSubmodel"
          >新增—子车系</a-button
        >
      </div>
    </div>

    <div class="body">
      <!-- 车系 -->
      <div>
        <a-table
          :columns="modelColumns"
          :data-source="modelData"
          :pagination="{
            pageSize: 10,
            current: modelCurrent,
            total: modelTotal,
          }"
          @change="modelPageChange"
          :loading="modelTableLoading"
          rowKey="modelId"
        >
          <template slot="modify" slot-scope="text, record">
            <a
              class="modify-btn"
              href="javascript:;"
              @click="renameModel(record)"
              >修改</a
            >
          </template>
          <template slot="control" slot-scope="text, record">
            <a-switch
              :default-checked="record.state == 1 ? true : false"
              @change="modelStatusChange(record, ...arguments)"
            />
          </template>
        </a-table>
      </div>

      <!-- 子车系 -->
      <div>
        <a-table
          :columns="submodelColumns"
          :data-source="submodelData"
          :pagination="{
            pageSize: 10,
            current: submodelCurrent,
            total: submodelTotal,
          }"
          @change="submodelPageChange"
          :loading="submodelTableLoading"
          rowKey="subModelId"
        >
          <template slot="modify" slot-scope="text, record">
            <a
              :class="record.useState ? 'modify-btn' : 'modify-btn disabled'"
              href="javascript:;"
              @click="renameSubmodel(record)"
              >修改</a
            >
          </template>
          <template slot="control" slot-scope="text, record">
            <a-switch
              :disabled="!record.useState"
              :checked="record.state == 1 ? true : false"
              @change="submodelStatusChange(record, ...arguments)"
            />
          </template>
        </a-table>
      </div>
    </div>

    <!-- 车系弹框 -->
    <a-modal
      v-model="newModelOpen"
      :title="modifyModel ? '修改车系名称' : '新增车系'"
      @cancel="clearNewModel"
    >
      <div>
        <a-input
          style="height: 42px"
          v-model="newModelInput"
          placeholder="输入车系名字"
        ></a-input>
      </div>

      <template slot="footer">
        <div class="custom-footer">
          <a-button @click="closeNewModel">取消</a-button>
          <a-button type="primary" @click="submitModel">确定</a-button>
        </div>
      </template>
    </a-modal>

    <!-- 子车系弹框 -->
    <a-modal
      v-model="newSubmodelOpen"
      :title="modifySubmodel ? '修改子车系名称' : '新增子车系'"
      @cancel="clearNewSubmodel"
    >
      <div class="newSubmodel-ctn">
        <a-select
          v-if="!modifySubmodel"
          class="newSubmodel-select"
          placeholder="选择车系"
          v-model="newSubmodelSelect"
        >
          <a-select-option
            v-for="item in modelSelectList"
            :key="item.modelId"
            :value="item.modelId"
          >
            {{ item.modelName }}
          </a-select-option>
        </a-select>
        <a-input
          :style="
            modifySubmodel ? `height: 42px` : `width: 320px; height: 42px`
          "
          v-model="newSubmodelInput"
          placeholder="输入子车系名字"
        ></a-input>
      </div>

      <template slot="footer">
        <div class="custom-footer">
          <a-button @click="closeNewSubmodel">取消</a-button>
          <a-button type="primary" @click="submitSubmodel">确定</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  getModelDataList,
  getSubModelDataList,
  addModelData,
  addSubModelData,
  getModelData,
  updateModelName,
  updateSubModelName,
  updateModelState,
  updateSubModelState,
} from "@/service/schedule/carManagement";

export default {
  name: "CarManagement",
  data() {
    return {
      newModelOpen: false,
      modifyModel: null,
      newSubmodelOpen: false,
      modifySubmodel: null,
      newModelInput: "",
      newSubmodelInput: "",
      newSubmodelSelect: undefined,
      modelSelectList: [],
      modelData: [],
      modelCurrent: 1,
      modelTotal: 0,
      modelTableLoading: true,
      submodelData: [],
      submodelCurrent: 1,
      submodelTotal: 0,
      submodelTableLoading: true,
    };
  },
  computed: {
    modelColumns() {
      return [
        {
          title: "车系名称",
          dataIndex: "modelName",
          align: "center",
        },
        {
          title: "修改信息",
          dataIndex: "modify",
          align: "center",
          scopedSlots: { customRender: "modify" },
        },
        {
          title: "状态",
          dataIndex: "stateName",
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
    submodelColumns() {
      return [
        {
          title: "车系名称",
          dataIndex: "modelName",
          align: "center",
        },
        {
          title: "子车系名称",
          dataIndex: "subModelName",
          align: "center",
        },
        {
          title: "修改信息",
          dataIndex: "modify",
          align: "center",
          scopedSlots: { customRender: "modify" },
        },
        {
          title: "状态",
          dataIndex: "stateName",
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
    toggleNewModel() {
      this.newModelOpen = !this.newModelOpen;
    },
    toggleNewSubmodel() {
      this.newSubmodelOpen = !this.newSubmodelOpen;
    },
    clearNewModel() {
      this.newModelInput = "";
    },
    clearNewSubmodel() {
      this.newSubmodelInput = "";
      this.newSubmodelSelect = undefined;
      this.modifySubmodel = null;
    },
    submitNewModel() {
      const { newModelInput } = this;

      if (!newModelInput) {
        this.$message.warning("车系名称不能为空");
        return;
      }

      this.addModelData({
        modelName: newModelInput,
      });
      this.closeNewModel();

      this.modelCurrent = 1;
    },
    closeNewModel() {
      this.toggleNewModel();
      this.clearNewModel();
    },
    submitNewSubmodel() {
      const { newSubmodelInput, newSubmodelSelect } = this;

      if (!newSubmodelSelect) {
        this.$message.warning("车系不能为空");
        return;
      }

      if (!newSubmodelInput) {
        this.$message.warning("子车系名称不能为空");
        return;
      }

      this.addSubModelData({
        modelId: newSubmodelSelect,
        subModelName: newSubmodelInput,
      });
      this.closeNewSubmodel();

      this.submodelCurrent = 1;
    },
    closeNewSubmodel() {
      this.toggleNewSubmodel();
      this.clearNewSubmodel();
    },
    renameModel(record) {
      this.modifyModel = record;
      this.newModelInput = record.modelName;
      this.toggleNewModel();
    },
    submitModifyModel() {
      const { modifyModel, newModelInput } = this;

      if (!newModelInput) {
        this.$message.warning("车系名称不能为空");
        return;
      }

      this.updateModelName({
        modelId: modifyModel.modelId,
        modelName: newModelInput,
      });

      this.modifyModel = null;

      this.closeNewModel();
    },
    submitModel() {
      const { modifyModel } = this;
      if (modifyModel) {
        this.submitModifyModel();
      } else {
        this.submitNewModel();
      }
    },
    renameSubmodel(record) {
      if (record.useState) {
        this.modifySubmodel = record;
        this.newSubmodelInput = record.subModelName;
        this.newSubmodelSelect = record.modelId;
        this.toggleNewSubmodel();
      }
    },
    submitModifySubmodel() {
      const { modifySubmodel, newSubmodelInput, newSubmodelSelect } = this;

      if (!newSubmodelInput) {
        this.$message.warning("子车系名称不能为空");
        return;
      }

      this.updateSubModelName({
        modelId: newSubmodelSelect,
        subModelId: modifySubmodel.subModelId,
        subModelName: newSubmodelInput,
      });

      this.modifySubmodel = null;

      this.closeNewSubmodel();
    },
    submitSubmodel() {
      const { modifySubmodel } = this;
      if (modifySubmodel) {
        this.submitModifySubmodel();
      } else {
        this.submitNewSubmodel();
      }
    },
    modelStatusChange(record, checked) {
      this.updateModelState({
        modelId: record.modelId,
        state: checked ? "1" : "0",
      });
    },
    submodelStatusChange(record, checked) {
      this.updateSubModelState({
        subModelId: record.subModelId,
        state: checked ? "1" : "0",
      });
    },
    modelPageChange(options) {
      const { current } = options;
      this.modelCurrent = current
      this.modelTableLoading = true;
      this.getModelDataList({
        currentPage: current,
        pageSize: 10,
      });
    },
    submodelPageChange(options) {
      const { current } = options;
      this.submodelCurrent = current
      this.submodelTableLoading = true;
      this.getSubModelDataList({
        currentPage: current,
        pageSize: 10,
      });
    },
    async getModelDataList(obj) {
      try {
        const res = await getModelDataList(obj);
        const { data } = res;
        this.modelTableLoading = false;
        this.modelTotal = data.total;
        this.modelData = data.list;
      } catch (error) {
        this.modelTableLoading = false;
        this.modelTotal = 0;
        this.modelData = [];
        console.error(error);
      }
    },
    async getSubModelDataList(obj) {
      try {
        const res = await getSubModelDataList(obj);
        const { data } = res;
        this.submodelTableLoading = false;
        this.submodelTotal = data.total;
        this.submodelData = data.list;
      } catch (error) {
        this.submodelTableLoading = false;
        this.submodelTotal = 0;
        this.submodelData = [];
        console.error(error);
      }
    },
    async addModelData(obj) {
      this.modelTableLoading = true;

      try {
        const res = await addModelData(obj);
        this.$message.success("新增车系成功");
        this.modelCurrent = 1;
        this.getModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
      } catch (error) {
        this.modelTableLoading = false;
        console.error(error);
      }
    },
    async addSubModelData(obj) {
      this.submodelTableLoading = true;

      try {
        const res = await addSubModelData(obj);
        this.$message.success("新增子车系成功");
        this.submodelCurrent = 1;
        this.getSubModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
      } catch (error) {
        this.submodelTableLoading = false;
        console.error(error);
      }
    },
    async getModelData(obj) {
      try {
        const res = await getModelData(obj);
        this.modelSelectList = res.data;
      } catch (error) {
        this.modelSelectList = [];
        console.error(error);
      }
    },
    async updateModelName(obj) {
      this.modelTableLoading = true;

      try {
        const res = await updateModelName(obj);
        this.$message.success("修改车系成功");
        this.modelCurrent = 1;
        this.getModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
      } catch (error) {
        this.modelTableLoading = false;
        console.error(error);
      }
    },
    async updateSubModelName(obj) {
      this.submodelTableLoading = true;

      try {
        const res = await updateSubModelName(obj);
        this.$message.success("修改子车系成功");
        this.submodelCurrent = 1;
        this.getSubModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
      } catch (error) {
        this.submodelTableLoading = false;
        console.error(error);
      }
    },
    async updateModelState(obj) {
      this.modelTableLoading = true;
      this.submodelTableLoading = true;

      try {
        const res = await updateModelState(obj);
        this.$message.success("修改车系状态成功");
        this.modelCurrent = 1;
        this.submodelCurrent = 1;
        this.getModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
        this.getSubModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
        this.getModelData();
      } catch (error) {
        this.modelTableLoading = false;
        this.submodelTableLoading = false;
        console.error(error);
      }
    },
    async updateSubModelState(obj) {
      this.submodelTableLoading = true;

      try {
        const res = await updateSubModelState(obj);
        this.$message.success("修改车系状态成功");
        this.submodelCurrent = 1;
        this.getSubModelDataList({
          currentPage: 1,
          pageSize: 10,
        });
      } catch (error) {
        this.submodelTableLoading = false;
        console.error(error);
      }
    },
  },
  mounted() {
    this.getModelDataList({
      currentPage: 1,
      pageSize: 10,
    });
    this.getSubModelDataList({
      currentPage: 1,
      pageSize: 10,
    });
    this.getModelData();
  },
};
</script>

<style lang="less" scoped>
.car-management-ctn {
  width: 100%;
  .header {
    display: flex;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #f8f8f8;

    & > div {
      padding: 0 20px;
      width: 50%;
      .add-btn {
        border-radius: 2px;
        width: 160px;
        height: 32px;
        font-size: 12px;
      }
    }
  }
  .body {
    display: flex;
    width: 100%;
    min-height: 100px;
    background: #ffffff;
    & > div {
      padding: 20px;
      width: 50%;

      /deep/ .ant-table {
        border: 1px solid #d9d9d9;
        .ant-table-thead {
          tr {
            th {
              border-radius: 0;
              background: #c1d7ec;
            }
          }
        }
        .ant-table-tbody {
          tr:last-child {
            td {
              border-bottom: 0;
            }
          }
        }
      }

      .modify-btn {
        color: #0073c6;
        &.disabled {
          color: #a4b5c2;
          cursor: not-allowed;
        }
      }
    }
  }
}

/deep/ .ant-modal-footer {
  border: 0;
}

.custom-footer {
  text-align: center;
  /deep/ .ant-btn {
    border-radius: 2px;
    width: 100px;
    height: 36px;
    line-height: 36px;
    &:not(.ant-btn-primary) {
      margin-right: 10px;
    }
  }
}

.newSubmodel-ctn {
  display: flex;
  .newSubmodel-select {
    margin-right: 20px;
    width: 140px;
    height: 42px;
    line-height: 42px;
    /deep/ .ant-select-selection {
      height: 42px;
      line-height: 42px;
      .ant-select-selection__rendered {
        height: 42px;
        line-height: 42px;
      }
    }
  }
}
</style>