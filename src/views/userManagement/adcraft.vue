<template>
  <div>
    <div class="search-box">
      <div>
        <a-select
          v-model="companyIds"
          mode="tags"
          placeholder="请选择公司"
          :max-tag-count="0"
          style="width: 150px"
        >
          <a-select-option
            v-for="item in companyList"
            :key="item.companyId"
            :value="item.companyId"
          >
            {{ item.companyName }}
          </a-select-option>
        </a-select>
        <a-select
          placeholder="角色"
          v-model="roleIds"
          mode="tags"
          :max-tag-count="0"
          style="width: 120px"
        >
          <a-select-option
            v-for="item in agentRolesList"
            :key="item.roleId"
            :value="item.roleId"
            >{{ item.roleName }}</a-select-option
          >
        </a-select>
        <a-input
          placeholder="手机号查找"
          v-model="searchPhone"
          style="width: 120px"
        />
      </div>
      <div>
        <a-button @click="resetSearch"> 重置 </a-button>
        <a-button type="primary" @click="selectAdUsers(1)"> 查询 </a-button>
      </div>
    </div>

    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="userId"
      :scroll="{ x: 'max-content' }"
      :pagination="pageOptions"
      @change="pageChange"
      :loading="searchLoading"
    >
      <template slot="modelNum" slot-scope="text, record">
        <a href="javascript:;" @click="getModelList(record.modelRootVoList)">{{
          text
        }}</a>
      </template>
      <template slot="password" slot-scope="text, record">
        <a href="javascript:;" @click="setAdUserPassword(record.userId)"
          >重置</a
        >
      </template>
      <template slot="operation" slot-scope="text, record">
        <a
          href="javascript:;"
          v-if="record.forbid === false"
          class="type-red"
          @click="setAdUserForbidRoot(record.userId, true)"
          >禁用</a
        >
        <a
          href="javascript:;"
          v-if="record.forbid === true"
          @click="setAdUserForbidRoot(record.userId, false)"
          >启用</a
        >
      </template>
    </a-table>

    <!-- 模块权限模态框 -->
    <a-modal
      title="模块权限"
      v-model="moduleShow"
      :confirmLoading="moduleLoading"
      okText="确认"
      cancelText="重置"
      @ok="updateAdUserModelRoot"
    >
      <a-table
        :columns="modalcolumns"
        :dataSource="modaldataSource"
        rowKey="modelId"
        :pagination="false"
      >
        <template slot="upLoad" slot-scope="text, record, index">
          <a-checkbox
            :checked="record.uploadRoot"
            @change="
              $set(modaldataSource[index], 'uploadRoot', !record.uploadRoot)
            "
          ></a-checkbox>
        </template>
        <template slot="downLoad" slot-scope="text, record, index">
          <a-checkbox
            :checked="record.downloadRoot"
            @change="
              $set(modaldataSource[index], 'downloadRoot', !record.downloadRoot)
            "
          ></a-checkbox>
        </template>
      </a-table>
    </a-modal>

    <!-- 项目权限模态框 -->
    <!-- <a-modal
      v-model="projectShow"
      title="项目权限"
      @ok="getUserProjectRoot"
      :bodyStyle="{ height: '50vh', overflow: 'auto' }"
    >
      <a-table
        :columns="projectPowerColumns"
        :dataSource="projectPowerScource"
        rowKey="deptId"
        :pagination="false"
      >
        <template slot="browse" slot-scope="text, record, index">
          <a-checkbox
            :checked="record.browseRoot"
            @change="
              $set(projectPowerScource[index], 'browseRoot', !record.browseRoot)
            "
          >
          </a-checkbox>
        </template>
        <template slot="downLoad" slot-scope="text, record, index">
          <a-checkbox
            :checked="record.downloadRoot"
            @change="
              $set(
                projectPowerScource[index],
                'downloadRoot',
                !record.downloadRoot
              )
            "
          >
          </a-checkbox>
        </template>
      </a-table>
    </a-modal> -->

    <!-- 手工录入数据 -->
    <a-modal
      title="手工录入新增"
      v-model="newAccountModalOpen"
      class="handmade-modal"
      @cancel="closeFormModal"
      @ok="newAccountSubmit"
    >
      <a-table
        :columns="addUserColumns"
        :pagination="false"
        :dataSource="addUser"
        rowKey="id"
      >
        <template slot="phone" slot-scope="text, record, index">
          <a-input
            placeholder="输入手机号"
            v-model="addUser[index].phone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
        </template>
        <template slot="userName" slot-scope="text, record, index">
          <a-input v-model="addUser[index].userName" placeholder="输入姓名" />
        </template>
        <template slot="companyId" slot-scope="text, record, index">
          <a-select
            v-model="addUser[index].companyId"
            mode="tags"
            placeholder="请选择公司"
            :max-tag-count="0"
            style="width: 150px"
          >
            <a-select-option
              v-for="item in companyList"
              :key="item.companyId"
              :value="item.companyId"
            >
              {{ item.companyName }}
            </a-select-option>
          </a-select>
        </template>

        <template slot="roleId" slot-scope="text, record, index">
          <a-select
            v-model="addUser[index].roleId"
            placeholder="角色"
            style="width: 100px"
          >
            <a-select-option
              v-for="item in agentRolesList"
              :key="item.roleId"
              :value="item.roleId"
              >{{ item.roleName }}</a-select-option
            >
          </a-select>
        </template>
      </a-table>
    </a-modal>

    <!-- 批量录入 -->
    <a-modal
      title="批量上传新用户名录"
      v-model="getAdcraftBatchAddUser"
      @ok="getAdcraftBatchAddUser = false"
      @cancle="getAdcraftBatchAddUser = false"
      :maskClosable="false"
    >
      <a-spin :spinning="upLoadSpin">
        <a-form>
          <a-form-item label="选择导入文件" :labelCol="{ span: 5 }">
            <UpLoadFile type="agent" @change="uploadFile">
              <a-button>浏览文件</a-button>
            </UpLoadFile>
          </a-form-item>
          <a-form-item label="下载模版" :labelCol="{ span: 5 }"
            ><a-button @click="downLoad">点击下载模版</a-button></a-form-item
          >
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
import UpLoadFile from "@/components/UpLoadFile/UpLoadFile.vue";
import {
  setAdUserForbidRoot,
  setAdUserPassword,
  updateAdUserModelRoot,
  getUserProjectRoot,
  insertAdUsers,
  selectAdUsers,
} from "@/service/internalUser/user";
const columns = [
  {
    title: "用户ID",
    dataIndex: "userId",
    align: "center",
  },
  {
    title: "手机号码",
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "姓名",
    dataIndex: "userName",
    align: "center",
  },
  {
    title: "公司名称",
    dataIndex: "companyName",
    align: "center",
  },
  {
    title: "角色",
    dataIndex: "roleName",
    align: "center",
  },
  {
    title: "模块权限",
    dataIndex: "modelNum",
    scopedSlots: { customRender: "modelNum" },
    align: "center",
  },
  {
    title: "注册时间",
    dataIndex: "createdDate",
    align: "center",
  },
  {
    title: "禁用时间",
    dataIndex: "forbidDate",
    align: "center",
  },
  {
    title: "密码重置",
    dataIndex: "password",
    scopedSlots: { customRender: "password" },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    align: "center",
  },
];
function addUser() {
  const addUser = [];
  for (let i = 0; i < 5; i++) {
    addUser.push({
      id: parseInt(Math.random(0, 1) * 10000),
      phone: "",
      userName: "",
      roleId: undefined,
      companyId: undefined,
    });
  }
  return addUser;
}
const addUserColumns = [
  {
    title: "手机号码",
    dataIndex: "phone",
    width: 150,
    align: "center",
    scopedSlots: {
      customRender: "phone",
    },
  },
  {
    title: "姓名",
    dataIndex: "userName",
    width: 150,
    align: "center",
    scopedSlots: {
      customRender: "userName",
    },
  },
  {
    title: "公司",
    dataIndex: "companyId",
    align: "center",
    scopedSlots: {
      customRender: "companyId",
    },
  },
  {
    title: "角色",
    dataIndex: "roleId",
    align: "center",
    scopedSlots: {
      customRender: "roleId",
    },
  },
];
export default {
  components: { UpLoadFile },
  data() {
    return {
      moduleShow: false, // 模块权限模态框是否显示
      projectShow: false, // 项目权限模态框是否显示
      companyIds: [], // 公司id
      roleIds: [], // 选择的角色id
      searchPhone: "",

      tableData: [], // table 数据
      addUserDeptList: [], // 添加用户的模态框二级部门数据
      columns, // 数据表头
      upLoadSpin: false, // 控制上传loading
      modalcolumns: [
        {
          title: "功能模块",
          dataIndex: "modelName",
        },
        {
          title: "上传",
          dataIndex: "upLoad",
          scopedSlots: {
            customRender: "upLoad",
          },
        },
        {
          title: "下载",
          dataIndex: "downLoad",
          scopedSlots: {
            customRender: "downLoad",
          },
        },
      ], // 模块权限表头
      dataSource: [], // 内部用户数据
      modaldataSource: [], // 模块权限数据
      projectPowerColumns: [
        {
          title: "一级部门",
          dataIndex: "parentDeptName",
        },
        {
          title: "二级部门",
          dataIndex: "deptName",
        },
        {
          title: "浏览",
          dataIndex: "browse",
          scopedSlots: {
            customRender: "browse",
          },
        },
        {
          title: "下载",
          dataIndex: "downLoad",
          scopedSlots: {
            customRender: "downLoad",
          },
        },
      ], // 项目权限表头
      projectPowerScource: [], // 项目权限数据
      addUserColumns, // 手动添加用户表头
      addUser: addUser(), // 手动添加用户数据
      pageOptions: {
        total: 10,
        showSizeChanger: false,
        hideOnSinglePage: true,
        current: 1,
        pageSize: 10,
        showTotal: (total) => `共有 ${total} 条数据`,
      }, // 内部用户表格分页
      searchLoading: true,
      moduleLoading: false,
    };
  },
  computed: {
    ...mapState("user", {
      adcraftAddUser: "adcraftAddUser",
      adcraftBatchAddUser: "adcraftBatchAddUser",
      companyList: "companyList",
      agentRolesList: "agentRolesList",
    }),
    newAccountModalOpen: {
      get() {
        return this.adcraftAddUser;
      },
      set(val) {
        this.setAdcraftAddUser(val);
      },
    },
    getAdcraftBatchAddUser: {
      get() {
        return this.adcraftBatchAddUser;
      },
      set(val) {
        this.setAdcraftBatchAddUser(val);
      },
    },
  },
  methods: {
    ...mapMutations("user", {
      setAdcraftAddUser: "SET_ADCRAFT_ADD_USER",
      setAdcraftBatchAddUser: "SET_ADCRAFT_BATCH_ADD_USER",
    }),
    ...mapActions("user", {
      getCompanies: "getCompanies",
      getUserRoles: "getUserRoles",
    }),
    // 获取用户信息
    async selectAdUsers(page) {
      this.searchLoading = true;
      const { searchPhone, roleIds, companyIds, pageOptions } = this;
      try {
        const res = await selectAdUsers({
          phone: searchPhone,
          roleId: roleIds.toString(),
          companyId: companyIds.toString(),
          currentPage: page || pageOptions.current,
          pageSize: 10,
        });
        this.pageOptions.total = res.data.total;
        this.tableData = res.data.list;
        this.searchLoading = false;
      } catch (err) {
        console.error(err);
      }
    },
    // 分页
    pageChange(page) {
      this.pageOptions.current = page.current;
      this.selectAdUsers();
    },

    // 重置
    resetSearch() {
      this.companyIds = [];
      this.roleIds = [];
      this.searchPhone = "";
    },
    // 禁用用户
    async setAdUserForbidRoot(userId, forbid) {
      try {
        const res = await setAdUserForbidRoot({
          userId,
          forbid,
        });
        this.selectAdUsers();
        if (res.flag) {
          this.$message.success(forbid ? "禁用成功!" : "启用成功!");
        }
      } catch (err) {
        console.error(err);
      }
    },
    // 重置用户密码
    async setAdUserPassword(userId) {
      try {
        const res = await setAdUserPassword({ userId });
        if (res.flag) {
          this.$message.success("重置密码成功!");
        }
      } catch (err) {
        console.error(err);
      }
    },

    newAccountSubmit() {
      const rulePhone = []; // 验证号码的项
      const ruleList = []; // 验证的项
      const errInputList = []; // 填写错误的项
      const upList = []; // 传递的参数

      this.addUser.forEach((item, index) => {
        ruleList[index] = [];
        for (let key in item) {
          if (key !== "id" && Boolean(item[key])) {
            ruleList[index].push(item);
            if (key === "phone" && !/^1[3-9]\d{9}$/.test(item[key])) {
              rulePhone.push(index + 1);
            }
          }
        }
      });

      ruleList.forEach((item, index) => {
        if (0 < item.length && item.length < 4) {
          errInputList.push(index + 1);
        } else if (item.length === 4) {
          upList.push({
            phone: this.addUser[index].phone,
            userName: this.addUser[index].userName,
            companyId: this.addUser[index].companyId.toString(),
            roleId: this.addUser[index].roleId,
          });
        }
      });

      if (errInputList.length) {
        this.$message.error(`第${errInputList.toString()}行，请正确输入信息！`);
        return;
      }

      if (rulePhone.length) {
        this.$message.error(
          `第${rulePhone.toString()}行，请正确输入电话号码！`
        );
        return;
      }

      this.insertAdUsers(upList);
    },
    // 新增用户
    async insertAdUsers(params) {
      if (params.length < 1) {
        this.$message.error("信息不能为空");
        return;
      }
      try {
        const res = await insertAdUsers({
          list: params,
        });
        if (res.flag) {
          this.$message.success(res.message);
          this.closeFormModal();
          this.selectAdUsers(1);
        } else {
          this.$message.info(res.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
    closeFormModal() {
      this.addUser = addUser();
      this.newAccountModalOpen = false;
    },

    uploadFile(bool) {
      this.upLoadSpin = bool;
      if (!bool) {
        this.getAdcraftBatchAddUser = false;
        this.selectAdUsers(1);
      }
    },
    // 获取项目权限
    getDeptList(obj) {
      this.projectPowerScource = obj;
      this.projectShow = true;
    },
    // 获取模块权限
    getModelList(obj) {
      this.modaldataSource = obj;
      this.moduleShow = true;
    },
    // 修改模块权限
    async updateAdUserModelRoot() {
      this.moduleLoading = true;
      const { modaldataSource } = this;
      try {
        const obj = {
          userId: modaldataSource[0].userId,
          list: modaldataSource,
        };
        const res = await updateAdUserModelRoot(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.moduleShow = false;
          this.modaldataSource = [];
          this.selectAdUsers();
        } else {
          this.$message.error(res.message);
        }
        this.moduleLoading = false;
      } catch (error) {
        this.moduleLoading = false;
        console.error(error);
      }
    },
    // 获取用户项目权限
    async getUserProjectRoot() {
      const { projectPowerScource } = this;
      try {
        const obj = {
          userId: projectPowerScource[0].userId,
          list: projectPowerScource,
        };
        const res = await getUserProjectRoot(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.projectShow = false;
          this.projectPowerScource = [];
          this.selectAdUsers();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.error(error);
      }
    },
    downLoad() {
      const baseApiUrl = process.env.VUE_APP_FILE_URL;
      const userAgent = navigator.userAgent;
      const downLoadUrl = `${baseApiUrl}fileExcel/广告代理批量上传模板.xlsx?_t=${Date.parse(
        new Date()
      )}`;
      if (userAgent.indexOf("Chrome") > -1) {
        window.open(downLoadUrl, "_blank");
      } else {
        let a = document.createElement("a");

        //2.给a标签的href赋上下载地址
        a.href = downLoadUrl;

        //3.让a标签不显示在视图中
        a.style.display = "none";

        //4.将a标签append到文档中
        document.body.appendChild(a);

        //5.a标签自点击
        a.click();

        //6.点击下载后，销毁这个节点
        document.body.removeChild(a);
        // window.location.href = this.downloadUrl;
      }
    },
  },
  mounted() {
    this.getCompanies();
    this.getUserRoles();
    this.selectAdUsers();
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.search-box {
  width: 100%;
  min-height: 60px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0;
  margin-bottom: 20px;
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
.type-red {
  color: #c40606;
}
/deep/ .ant-table-body tbody tr:nth-child(2n-1) {
  background-color: white;
}
/deep/ .ant-table-body tbody tr:nth-child(2n) {
  background-color: #f7f7f7;
}
.handmade-modal {
  /deep/ .ant-modal {
    min-width: max-content !important;
  }
}
/deep/ .ant-table-thead > tr > th {
  background-color: #e8f3fa;
}
</style>
