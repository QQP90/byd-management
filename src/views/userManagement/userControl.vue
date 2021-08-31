<template>
  <div>
    <div class="search-box ranking">
      <div>
        <a-select
          v-model="parentDeptId"
          mode="multiple"
          @change="parentDeptIdChange"
          placeholder="事业部名称"
          :max-tag-count="0"
          style="width: 150px"
        >
          <a-select-option
            v-for="item in allDepts"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
          >
            {{ item.parentDeptName }}
          </a-select-option>
        </a-select>
        <a-select
          v-model="deptId"
          mode="multiple"
          placeholder="部门名称"
          style="width: 150px"
          :max-tag-count="0"
        >
          <a-select-option
            v-for="item in secondDept"
            :key="item.deptId"
            :value="item.deptId"
          >
            {{ item.deptName }}</a-select-option
          >
        </a-select>
        <a-select
          placeholder="角色"
          v-model="roleId"
          mode="multiple"
          :max-tag-count="0"
          style="width: 120px"
        >
          <a-select-option
            v-for="item in userRoles"
            :key="item.roleId"
            :value="item.roleId"
            >{{ item.roleName }}</a-select-option
          >
        </a-select>
        <a-input placeholder="工号查找" v-model="jobId" style="width: 120px" />
      </div>
      <div>
        <a-button @click="reset()"> 重置 </a-button>
        <a-button type="primary" @click="getUsersByCondition(1)">
          查询
        </a-button>
      </div>
    </div>
    <a-table
      :columns="columns"
      :dataSource="tableData"
      rowKey="userId"
      :scroll="{ x: 'max-content' }"
      :pagination="pageOptions"
      @change="pageChange"
      :loading="loading"
    >
      <template slot="modelTotal" slot-scope="text, record">
        <a href="javascript:;" @click="getModelList(record)">{{ text }}</a>
      </template>
      <template slot="deptTotal" slot-scope="text, record">
        <a href="javascript:;" @click="getDeptList(record)">{{ text }}</a>
      </template>
      <template slot="password" slot-scope="text, record">
        <a href="javascript:;" @click="resetUserPassword(record.userId)"
          >重置</a
        >
      </template>
      <template slot="operation" slot-scope="text, record">
        <a
          href="javascript:;"
          v-if="record.userStatus === '0'"
          class="type-red"
          @click="disable(record.userId, 1)"
          >禁用</a
        >
        <a
          href="javascript:;"
          v-if="record.userStatus === '1'"
          @click="disable(record.userId, 0)"
          >启用</a
        >
      </template>
    </a-table>
    <!-- 模块权限模态框 -->
    <a-modal
      title="模块权限"
      v-model="moduleShow"
      okText="确认"
      cancelText="重置"
      @ok="getUserModelRoot"
      :maskClosable="false"
    >
      <a-table
        :columns="modalcolumns"
        :dataSource="modaldataSource"
        rowKey="modelId"
        :pagination="false"
        :loading="upLoadSpin"
      >
        <template slot="upLoad" slot-scope="text, record, index">
          <a-checkbox
            :checked="record.uploadRoot"
            @change="
              $set(modaldataSource[index], 'uploadRoot', !record.uploadRoot)
            "
          ></a-checkbox>
        </template>
      </a-table>
    </a-modal>
    <!-- 项目权限模态框 -->
    <a-modal
      v-model="projectShow"
      title="项目权限"
      @ok="getUserProjectRoot"
      :bodyStyle="{ height: '50vh', overflow: 'auto' }"
      :maskClosable="false"
    >
      <a-table
        :columns="projectPowerColumns"
        :dataSource="projectPowerScource"
        rowKey="deptId"
        :pagination="false"
        :loading="upLoadSpin"
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
    </a-modal>
    <!-- 手工录入数据 -->
    <a-modal
      title="手工录入新增"
      v-model="getInteriorAddUser"
      class="handmade-modal"
      @cancel="closeFormModal"
      @ok="saveUser"
      :maskClosable="false"
    >
      <a-table
        :columns="addUserColumns"
        :pagination="false"
        :dataSource="addUser"
        rowKey="id"
        :loading="upLoadSpin"
      >
        <template slot="jobId" slot-scope="text, record, index">
          <a-input v-model="addUser[index].jobId" />
        </template>
        <template slot="phone" slot-scope="text, record, index">
          <a-input
            v-model="addUser[index].phone"
            onkeyup="value=value.replace(/[^\d]/g,'')"
          />
        </template>
        <template slot="userName" slot-scope="text, record, index">
          <a-input v-model="addUser[index].userName" />
        </template>
        <template slot="parentDeptId" slot-scope="text, record, index">
          <a-select
            v-model="addUser[index].parentDeptId"
            style="width: 150px"
            @change="(value) => addUserParentDeptChange(value, index)"
            placeholder="请选择一级部门"
          >
            <a-select-option
              v-for="item in allDepts"
              :key="item.parentDeptId"
              :value="item.parentDeptId"
            >
              {{ item.parentDeptName }}
            </a-select-option>
          </a-select>
        </template>
        <template slot="deptId" slot-scope="text, record, index">
          <a-select
            v-model="addUser[index].deptId"
            style="width: 150px"
            placeholder="请选择二级部门"
          >
            <a-select-option
              v-for="item in addUserDeptList[index]"
              :key="item.deptId"
              :value="item.deptId"
              >{{ item.deptName }}</a-select-option
            >
          </a-select>
        </template>
        <template slot="roleId" slot-scope="text, record, index">
          <a-select
            v-model="addUser[index].roleId"
            placeholder="角色"
            style="width: 100px"
          >
            <a-select-option
              v-for="item in userRoles"
              :key="item.roleId"
              :value="item.roleId"
              >{{ item.roleName }}</a-select-option
            >
          </a-select>
        </template>
      </a-table>
    </a-modal>
    <a-modal
      title="批量上传新用户名录"
      v-model="getInteriorBatchAddUser"
      @ok="getInteriorBatchAddUser = false"
      @cancle="getInteriorBatchAddUser = false"
      :maskClosable="false"
    >
      <a-spin :spinning="upLoadSpin">
        <a-form>
          <a-form-item label="选择导入文件" :labelCol="{ span: 5 }">
            <UpLoadFile @change="uploadFile">
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
  getUsersByCondition,
  modifyUserStatus,
  resetUserPassword,
  addNewUser,
  getUserModelRoot,
  getUserProjectRoot,
} from "@/service/internalUser/user";
const columns = [
  {
    title: "用户ID",
    dataIndex: "userId",
  },
  {
    title: "工号",
    dataIndex: "jobId",
  },
  {
    title: "手机号码",
    dataIndex: "phone",
  },
  {
    title: "姓名",
    dataIndex: "userName",
  },
  {
    title: "一级部门",
    dataIndex: "parentDeptName",
  },
  {
    title: "二级部门",
    dataIndex: "deptName",
  },
  {
    title: "角色",
    dataIndex: "roleName",
  },
  {
    title: "模块权限",
    dataIndex: "modelTotal",
    scopedSlots: { customRender: "modelTotal" },
  },
  {
    title: "项目权限",
    dataIndex: "deptTotal",
    scopedSlots: { customRender: "deptTotal" },
  },
  {
    title: "注册时间",
    dataIndex: "createdDate",
  },
  {
    title: "禁用时间",
    dataIndex: "forbidDate",
  },
  {
    title: "密码重置",
    dataIndex: "password",
    scopedSlots: { customRender: "password" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
function addUser() {
  const addUser = [];
  for (let i = 0; i < 5; i++) {
    addUser.push({
      id: parseInt(Math.random(0, 1) * 10000),
      jobId: "",
      phone: "",
      userName: "",
      deptId: undefined,
      roleId: undefined,
      parentDeptId: undefined,
    });
  }
  return addUser;
}

const addUserColumns = [
  {
    title: "工号",
    dataIndex: "jobId",
    width: 150,
    align: "center",
    scopedSlots: {
      customRender: "jobId",
    },
  },
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
    title: "一级部门",
    dataIndex: "parentDeptId",
    align: "center",
    scopedSlots: {
      customRender: "parentDeptId",
    },
  },
  {
    title: "二级部门",
    dataIndex: "deptId",
    align: "center",
    scopedSlots: {
      customRender: "deptId",
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
      jobId: "", // 员工编号
      roleId: [], // 选择的角色id
      parentDeptId: [], // 选择一级部门list
      deptId: [], // 选择二级部门list
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
          title: "浏览",
          dataIndex: "upLoad",
          scopedSlots: {
            customRender: "upLoad",
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
      loading: true, // 加载数据loading
    };
  },
  computed: {
    ...mapState("user", {
      interiorAddUser: "interiorAddUser", // 控制内部用户手动添加用户模态框
      interiorBatchAddUser: "interiorBatchAddUser", // 控制内部用户批量添加用户模态框
      allDepts: "allDepts", // 部门数据
      userRoles: "userRoles", // 用户角色
    }),
    // store模态框v-modal值处理
    getInteriorAddUser: {
      get() {
        return this.interiorAddUser;
      },
      set(val) {
        this.setInteriorAddUser(val);
      },
    },
    // store模态框v-modal值处理
    getInteriorBatchAddUser: {
      get() {
        return this.interiorBatchAddUser;
      },
      set(val) {
        this.setInteriorBatchAddUser(val);
      },
    },
    // 二级部门选择项
    secondDept() {
      const { allDepts, parentDeptId } = this;
      let lis = [];
      if (parentDeptId.length) {
        for (let i = 0, len = parentDeptId.length; i < len; i++) {
          for (let index = 0, len = allDepts.length; index < len; index++) {
            if (
              Number(parentDeptId[i]) === Number(allDepts[index].parentDeptId)
            ) {
              lis = [...lis, ...allDepts[index].list];
              break;
            }
          }
        }
      } else {
        allDepts.forEach((item) => {
          lis = [...lis, ...item.list];
        });
      }
      return lis;
    },
  },
  methods: {
    ...mapMutations("user", {
      setInteriorAddUser: "SET_INTERIOR_ADD_USER", // 设置手动添加用户模态框val
      setInteriorBatchAddUser: "SET_INTERIOR_BATCH_ADD_USER", // 设置批量添加用户模态框val
    }),
    ...mapActions("user", {
      getAllUserRoles: "getAllUserRoles", // 获取用户角色
      getAllDepts: "getAllDepts", // 获取所有部门
    }),
    // 获取用户信息
    async getUsersByCondition(page) {
      this.loading = true;
      const { jobId, roleId, deptId, parentDeptId, pageOptions } = this;
      try {
        const res = await getUsersByCondition({
          jobId: jobId.toString(),
          roleId: roleId.toString(),
          parentDeptId: deptId.length ? "" : parentDeptId.toString(),
          deptId: deptId.toString(),
          currentPage: page || pageOptions.current,
          pageSize: 10,
        });
        this.pageOptions.total = res.data.total;
        this.tableData = res.data.list;
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    // 分页
    pageChange(page) {
      this.pageOptions.current = page.current;
      this.getUsersByCondition();
    },
    // 一级部门选择回调
    parentDeptIdChange() {
      const { deptId, secondDept } = this;
      const deptIdLis = [];
      secondDept.forEach((item, i) => {
        if (deptId.indexOf(item.deptId) > -1) {
          deptIdLis.push(item.deptId);
        }
      });
      this.deptId = deptIdLis;
    },
    // 重置
    reset() {
      this.deptId = [];
      this.parentDeptId = [];
      this.jobId = "";
      this.roleId = [];
    },
    // 禁用用户
    async disable(userId, userStatus) {
      try {
        const res = await modifyUserStatus({
          userId,
          userStatus,
        });
        this.getUsersByCondition();
        if (res.flag) {
          console.log(userStatus);
          const message = userStatus ? "禁用成功!" : "启用成功!";
          this.$message.success(message);
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 重置用户密码
    async resetUserPassword(userId) {
      try {
        const res = await resetUserPassword({ userId });
        if (res.flag) {
          this.$message.success("重置密码成功!");
        }
      } catch (err) {
        console.log(err);
      }
    },
    // 保存用户
    saveUser() {
      const rulePhone = []; // 验证号码的项
      const ruleList = []; // 验证的项
      const errInputList = []; // 填写错误的项
      const upList = []; // 传递的参数
      this.addUser.forEach((item, index) => {
        console.log(item);
        ruleList[index] = [];
        for (let key in item) {
          if (
            key !== "id" &&
            key != "deptId" &&
            key != "parentDeptId" &&
            Boolean(item[key])
          ) {
            ruleList[index].push(item[key]);
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
          upList.push(this.addUser[index]);
        }
      });
      if (errInputList.length) {
        this.$message.error(`第${errInputList.toString()}行，请正确输入信息！`);
      } else {
        if (rulePhone.length) {
          this.$message.error(
            `第${rulePhone.toString()}行，请正确输入电话号码！`
          );
        } else {
          this.addNewUser(upList);
        }
      }
    },
    // 新增用户
    async addNewUser(lis) {
      if (lis.length < 1) {
        this.$message.error("信息不能为空");
        return;
      }
      this.upLoadSpin = true;
      try {
        const list = JSON.parse(JSON.stringify(lis));
        list.forEach((item) => {
          delete item.id;
          delete item.parentDeptId;
        });
        const obj = {
          list,
        };
        const res = await addNewUser(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.closeFormModal();
          this.getUsersByCondition(1);
        } else {
          this.$message.info(res.message);
        }
      } catch (err) {
        console.log(err);
      }
      this.upLoadSpin = false;
    },
    // 关闭模态框
    closeFormModal() {
      this.addUser = addUser();
      this.getInteriorAddUser = false;
    },
    // 新增用户
    addUserParentDeptChange(value, index) {
      const { allDepts } = this;
      let lis = [];
      for (let i = 0, len = allDepts.length; i < len; i++) {
        if (allDepts[i].parentDeptId === value) {
          lis = allDepts[i].list;
          break;
        }
      }
      this.addUser[index].deptId = undefined;
      this.$set(this.addUserDeptList, index, lis);
    },
    // 上传新增用户文件回调
    uploadFile(bool) {
      this.upLoadSpin = bool;
      if (!bool) {
        this.getInteriorBatchAddUser = false;
        this.getUsersByCondition(1);
      }
    },
    // 获取项目权限
    getDeptList(obj) {
      this.projectPowerScource = obj.deptVoList;
      this.projectPowerScource[0].userId = obj.userId;
      this.projectShow = true;
    },
    // 获取模块权限
    getModelList(obj) {
      this.modaldataSource = obj.modelRootVoList;
      this.modaldataSource[0].userId = obj.userId;
      this.moduleShow = true;
    },
    // 修改用户角色模块权限
    async getUserModelRoot() {
      this.upLoadSpin = true;
      const { modaldataSource } = this;
      try {
        const obj = {
          userId: modaldataSource[0].userId,
          list: modaldataSource,
        };
        const res = await getUserModelRoot(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.moduleShow = false;
          this.modaldataSource = [];
          this.getUsersByCondition();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
      this.upLoadSpin = false;
    },
    // 修改用户项目权限
    async getUserProjectRoot() {
      const { projectPowerScource } = this;
      this.upLoadSpin = true;
      try {
        const obj = {
          userId: projectPowerScource[0].userId,
          list: projectPowerScource,
        };
        console.log(JSON.stringify(obj));
        const res = await getUserProjectRoot(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.projectShow = false;
          this.projectPowerScource = [];
          this.getUsersByCondition();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
      this.upLoadSpin = false;
    },
    // 下载新增用户模板
    downLoad() {
      const baseApiUrl = process.env.VUE_APP_FILE_URL;
      const userAgent = navigator.userAgent;
      const downLoadUrl = `${baseApiUrl}fileExcel/批量上传模板.xlsx?_t=${Date.parse(
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
    this.getAllDepts();
    this.getAllUserRoles();
    this.getUsersByCondition();
  },
  watch: {},
};
</script>
<style lang="less" scoped>
// .search-box {
//   width: 100%;
//   min-height: 60px;
//   background: #ffffff;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 10px 20px 0;
//   margin-bottom: 20px;
//   > div {
//     display: flex;
//     flex-wrap: wrap;
//     > * {
//       margin-right: 20px;
//       margin-bottom: 10px;
//     }
//     > *:last-child {
//       margin-right: 0;
//     }
//   }
//   > div:last-child {
//     width: 168px;
//     flex-shrink: 0;
//   }
// }
.type-red {
  color: #c40606;
}
</style>
