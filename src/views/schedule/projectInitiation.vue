<template>
  <div>
    <!-- 新建推广活动，下载项目信息表 -->
    <div class="search-box ranking">
      <div>
        <a-button @click="activityModalShow = true">新建推广活动</a-button>
        <a-button @click="downLoadInfo">下载项目信息表</a-button>
      </div>
      <div>
        <a-button @click="reset"> 重置 </a-button>
        <a-button type="primary" @click="getProjectApprovalDataList(1)">
          查询
        </a-button>
      </div>
    </div>
    <!-- 搜索项 -->
    <div class="search-box ranking" style="background-color: #eff1f2">
      <div>
        <a-date-picker
          placeholder="项目开始月"
          v-model="startTime"
          :disabledDate="startTimeDisable"
        ></a-date-picker>
        <a-date-picker
          placeholder="项目结束月"
          v-model="endTime"
          :disabledDate="endTimeDisable"
        ></a-date-picker>
        <a-select
          :maxTagCount="1"
          placeholder="请选择一级事业部"
          mode="multiple"
          style="width: 160px"
          v-model="parentDeptId"
          @change="parentDeptIdChange"
        >
          <a-select-option
            v-for="item in parentDeptData"
            :key="item.parentDeptId"
            :value="item.parentDeptId"
          >
            {{ item.parentDeptName }}
          </a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          placeholder="请选择部门"
          mode="multiple"
          style="width: 160px"
          v-model="deptId"
        >
          <a-select-option
            v-for="item in secondDept"
            :key="item.deptId"
            :value="item.deptId"
          >
            {{ item.deptName }}</a-select-option
          >
        </a-select>
        <!-- 代理名称组件 -->
        <a-select
          :maxTagCount="1"
          placeholder="请选择代理"
          mode="multiple"
          style="width: 160px"
          v-model="agentId"
        >
          <a-select-option
            v-for="item in agentData"
            :key="item.agentId"
            :value="item.agentId"
          >
            {{ item.agentName }}
          </a-select-option>
        </a-select>
        <a-select
          :maxTagCount="1"
          placeholder="请选择投放状态"
          mode="multiple"
          style="width: 160px"
          v-model="state"
        >
          <a-select-option
            v-for="item in stateData"
            :key="item.putId"
            :value="item.putId"
          >
            {{ item.putName }}
          </a-select-option>
        </a-select>
      </div>
      <div>
        <a-auto-complete
          placeholder="项目名称"
          v-model="campaignName"
          :dataSource="campaignNameList"
          @search="getCampaignNameList"
        >
          <a-input>
            <a-icon slot="suffix" type="search" />
          </a-input>
        </a-auto-complete>
      </div>
    </div>
    <a-table
      :columns="dataColumns"
      :dataSource="dataSource"
      rowKey="campaignId"
      :scroll="{ x: 'max-content' }"
      :pagination="pageOptions"
      @change="(page) => getProjectApprovalDataList(page.current)"
      :loading="loading"
    >
      <template slot="select" slot-scope="text, record">
        <a-checkbox
          :value="record.campaignId"
          :checked="selectActiveList.indexOf(record.campaignId) > -1"
          @change="selectActive"
        ></a-checkbox>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a href="javascript:;" @click="modiflyInfo(record)"> 修改 </a>
      </template>
    </a-table>
    <a-modal
      :title="modiflyCampaignId != null ? '修改推广活动' : '新建推广活动'"
      v-model="activityModalShow"
      width="620px"
      :maskClosable="false"
      @cancel="cancel"
    >
      <a-spin :spinning="spinning">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 19 }"
          :maskClosable="false"
          ref="form"
        >
          <a-form-model-item label="项目编号">
            <a-input
              placeholder="请输入项目编号"
              v-decorator="['campaignNo', rules.required('请输入项目编号')]"
            />
          </a-form-model-item>
          <a-form-model-item label="推广活动名称">
            <a-input
              placeholder="请输入推广活动名称"
              v-decorator="[
                'campaignName',
                rules.required('请输入推广活动名称'),
              ]"
            />
          </a-form-model-item>
          <a-form-model-item
            label="投放周期"
            style="margin-bottom: 0"
            :required="true"
          >
            <a-form-item :style="{ display: 'inline-block' }">
              <a-date-picker
                placeholder="项目开始日期"
                style="width: 190px"
                v-decorator="['startTime', rules.startTime]"
              ></a-date-picker>
            </a-form-item>
            <span style="margin: 0 29px">至</span>
            <a-form-item :style="{ display: 'inline-block' }">
              <a-date-picker
                placeholder="项目结束日期"
                style="width: 190px"
                v-decorator="['endTime', rules.endTime]"
              ></a-date-picker>
            </a-form-item>
          </a-form-model-item>
          <a-form-model-item
            label="投放部门"
            style="margin-bottom: 0"
            :required="true"
          >
            <a-form-item :style="{ display: 'inline-block' }">
              <a-select
                style="width: 208px; margin-right: 36px"
                placeholder="请选择一级事业部"
                v-decorator="[
                  'parentDeptId',
                  rules.selectRequired('请选择事业部'),
                ]"
                @change="setFormDept"
              >
                <a-select-option
                  v-for="item in parentDeptData"
                  :key="item.parentDeptId"
                  :value="item.parentDeptId"
                >
                  {{ item.parentDeptName }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :style="{ display: 'inline-block' }">
              <a-select
                style="width: 208px"
                placeholder="请选择部门"
                v-decorator="['deptId', rules.selectRequired('请选择部门')]"
              >
                <a-select-option
                  v-for="item in formDept"
                  :key="item.deptId"
                  :value="item.deptId"
                >
                  {{ item.deptName }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-form-model-item>
          <a-form-model-item label="子车系">
            <a-select
              mode="multiple"
              :max-tag-count="1"
              placeholder="请选择子车系"
              v-decorator="[
                'subModelId',
                {
                  rules: [
                    {
                      type: 'array',
                      required: true,
                      message: '请选择子车系',
                    },
                  ],
                },
              ]"
            >
              <a-select-option
                v-for="item in subModelData"
                :key="item.subModelId"
                >{{ item.subModelName }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="投放区域">
            <a-input
              placeholder="请输入投放区域"
              v-decorator="['putArea', rules.required('请输入投放区域')]"
            />
          </a-form-model-item>

          <a-row>
            <a-col :span="12">
              <a-form-model-item
                label="投放目标"
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
              >
                <a-select
                  placeholder="投放目标"
                  v-decorator="[
                    'putCampaignType',
                    rules.selectRequired('请选择投放目标'),
                  ]"
                >
                  <a-select-option
                    v-for="item in campaignTypeData"
                    :key="item.campaignTypeId"
                    >{{ item.campaignTypeName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="12">
              <a-form-model-item
                label="活动阶段"
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
              >
                <a-select
                  v-decorator="[
                    'activePhaseId',
                    rules.selectRequired('请选择活动阶段'),
                  ]"
                  placeholder="活动阶段"
                >
                  <a-select-option
                    v-for="item in activePhaseData"
                    :key="item.activePhaseId"
                    >{{ item.activePhaseName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item></a-col
            >
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-model-item
                label="是否参与打榜"
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
              >
                <a-select
                  v-decorator="[
                    'isPlayList',
                    rules.selectRequired('请选择是否参与打榜'),
                  ]"
                  placeholder="是否参与打榜"
                >
                  <a-select-option key="1">是</a-select-option>
                  <a-select-option key="0">否</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
            <a-col :span="12">
              <a-form-model-item
                label="是否补量"
                :label-col="{ span: 10 }"
                :wrapper-col="{ span: 14 }"
              >
                <a-select
                  placeholder="是否补量"
                  v-decorator="[
                    'isFillAmount',
                    rules.selectRequired('请选择是否补量'),
                  ]"
                >
                  <a-select-option key="1">是</a-select-option>
                  <a-select-option key="0">否</a-select-option>
                </a-select>
              </a-form-model-item></a-col
            >
          </a-row>
          <a-form-model-item label="代理名称">
            <a-select
              style="width: 208px"
              placeholder="请选择代理"
              v-decorator="['agentId', rules.selectRequired('请选择代理')]"
            >
              <a-select-option v-for="item in agentData" :key="item.agentId">{{
                item.agentName
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="媒体名称">
            <a-select
              style="width: 208px"
              placeholder="请选择媒体"
              v-decorator="['mediaId', rules.selectRequired('请选择媒体')]"
            >
              <a-select-option v-for="item in mediaData" :key="item.mediaId">{{
                item.mediaName
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="预估总费用">
            <a-input
              placeholder="请输入预估总费用"
              v-decorator="['forecastCost', rules.cost]"
            />
          </a-form-model-item>
          <a-form-model-item label="预估曝光量">
            <a-input
              placeholder="请输入预估曝光量"
              v-decorator="[
                'forecastImpl',
                rules.turingNum('请输入预估点击量'),
              ]"
            />
          </a-form-model-item>
          <a-form-model-item label="预估点击量">
            <a-input
              placeholder="请输入预估点击量"
              v-decorator="[
                'forecastClick',
                rules.turingNum('请输入预估点击量'),
              ]"
            />
          </a-form-model-item>
          <a-form-model-item label="预估留资量">
            <a-input
              placeholder="请输入预估留资量"
              v-decorator="[
                'forecastLeads',
                rules.turingNum('请输入预估留资量'),
              ]"
            />
          </a-form-model-item>
        </a-form>
      </a-spin>
      <p slot="footer" style="text-align: center">
        <a-button @click="cancel">重置</a-button>
        <a-button type="primary" @click="submit"> 确定 </a-button>
      </p>
    </a-modal>
  </div>
</template>

<script>
import {
  getProjectAgentData,
  getProjectApprovalDataList,
  getProjectTimeData,
  getProjectDeptData,
  getProjectParentDeptData,
  getProjectStateData,
  getPutCampaignTypeData,
  getSubModelData,
  insertProjectPutActive,
  updateProjectPutActive,
  getCampaignNameList,
  getActivePhaseData,
  getProjectMediaData,
} from "@/service/schedule/projectInitiation";
import moment from "moment";
import { _debounce, _download } from "@/assets/js/util";
//       {
//         campaignName: "", // 推广活动名称
//         activePhaseId: "", // 活动阶段id
//         agentId: "", // 代理id
//         campaignId: "", // 推广活动id (修改时使用)
//         campaignNo: "", // 项目编号
//         deptId: "", // 部门id
//         endTime: "", // 结束
//         forecastClick: "", // 预计点击量
//         forecastCost: "", // 预计总费用
//         forecastImp: "", // 预计曝光量
//         forecastLeads: "", // 预计留资量
//         isFillAmount: "", // 是否补量（1是0否）
//         isPlayList: "", // 是否参与打榜（1是0否）
//         mediaId: "", // 媒体名称
//         parentDeptId: "", // 事业部id
//         putArea: "", // 投放区域
//         putCampaignType: "", // 投放目标类型
//         startTime: "", // 开始
//         subModelId: "", // 子车系id
//       }, // 新建、 修改 推广活动字段名
export default {
  name: "ProjectInitiation",
  data() {
    return {
      startTime: null, // 开始时间
      endTime: null, // 结束时间
      parentDeptId: [], // 父级部门ID
      deptId: [], // 子部门ID
      agentId: [], // 代理选项
      state: [], // 状态
      campaignName: "", // 项目名
      campaignId: [], // 项目id
      loading: true, // 表格信息加载
      pageOptions: {
        total: 10,
        showSizeChanger: false,
        current: 1,
        pageSize: 10,
      }, // 内部用户表格分页
      selectActiveList: [], // 选择的活动ID
      form: this.$form.createForm(this), // 创建表单
      spinning: false, // 上传表单loading
      dataColumns: [
        {
          title: "选择",
          fixed: "left",
          scopedSlots: { customRender: "select" },
        },
        {
          title: "项目编号",
          key: "campaignNo",
          dataIndex: "campaignNo",
        },
        {
          title: "推广活动名称",
          key: "campaignName",
          dataIndex: "campaignName",
        },
        {
          title: "开始日期",
          key: "startTime",
          dataIndex: "startTime",
        },
        {
          title: "结束日期",
          key: "endTime",
          dataIndex: "endTime",
        },
        {
          title: "事业部",
          key: "parentDeptName",
          dataIndex: "parentDeptName",
        },
        {
          title: "部门",
          key: "deptName",
          dataIndex: "deptName",
        },
        {
          title: "子车系",
          key: "subModelName",
          dataIndex: "subModelName",
        },
        {
          title: "投放区域",
          key: "putArea",
          dataIndex: "putArea",
        },
        {
          title: "投放目标",
          key: "putCampaignName",
          dataIndex: "putCampaignName",
        },
        {
          title: "活动阶段",
          key: "activePhaseName",
          dataIndex: "activePhaseName",
        },
        {
          title: "是否参与打榜",
          dataIndex: "isPlayList",
          key: "isPlayList",
          customRender: (text) => <span>{text == 1 ? "是" : "否"}</span>,
        },
        {
          title: "是否补量",
          key: "isFillAmount",
          dataIndex: "isFillAmount",
          customRender: (text) => <span>{text == 1 ? "是" : "否"}</span>,
        },
        {
          title: "代理名称",
          key: "agentName",
          dataIndex: "agentName",
        },
        {
          title: "媒体名称",
          key: "mediaName",
          dataIndex: "mediaName",
        },
        {
          title: "预估总费用",
          key: "forecastCost",
          dataIndex: "forecastCost",
        },
        {
          title: "预估曝光量",
          key: "forecastImpl",
          dataIndex: "forecastImpl",
        },
        {
          title: "预估点击量",
          key: "forecastClick",
          dataIndex: "forecastClick",
        },
        {
          title: "预估留资量",
          key: "forecastLeads",
          dataIndex: "forecastLeads",
        },
        {
          title: "操作",
          fixed: "right",
          scopedSlots: { customRender: "operation" },
        },
      ],
      dataSource: [], // 表格数据
      activityModalShow: false, // 新增推广任务、修改推广任务模态框
      agentData: [], // 代理名称组件数据
      approvalDataList: [], // 查询项目立项信息
      timeData: [], // 项目时间组件数据
      deptData: [], // 二级部门组件数据
      parentDeptData: [], // 一级事业部组件数据
      stateData: [], // 投放状态组件数据
      campaignTypeData: [], // 投放目标组件数据
      subModelData: [], // 子车系组件数据
      campaignNameList: [], // 模糊搜索项目名
      activePhaseData: [], // 活动阶段数据数组
      mediaData: [], // 媒体类型数据
      modiflyCampaignId: null, // 修改活动项目时需要的id
      rules: {
        required(message) {
          return {
            trigger: "blur",
            rules: [
              {
                required: true,
                message,
                whitespace: true,
              },
            ],
          };
        },
        selectRequired(message) {
          return {
            rules: [
              {
                required: true,
                message,
                whitespace: true,
              },
            ],
          };
        },
        startTime: {
          rules: [
            {
              required: true,
              validator: (rule, value, cb) => {
                const endTime = this.form.getFieldValue("endTime");
                if (!value) {
                  cb("请选择开始时间");
                  return;
                }
                if (endTime) {
                  if (value > endTime) {
                    cb("不能超过结束时间");
                  } else {
                    cb();
                  }
                } else {
                  cb();
                }
              },
            },
          ],
        },
        endTime: {
          rules: [
            {
              required: true,
              validator: (rule, value, cb) => {
                const startTime = this.form.getFieldValue("startTime");
                if (!value) {
                  cb("请选择结束时间");
                  return;
                }
                if (startTime) {
                  if (value < startTime) {
                    cb("不能少于开始时间");
                  } else {
                    cb();
                  }
                } else {
                  cb();
                }
              },
            },
          ],
        },
        cost: {
          trigger: "blur",
          rules: [
            {
              required: true,
              validator: (rule, value, cb) => {
                if (value && value.trim) {
                  if (isNaN(value)) {
                    cb("请输入正确的金额");
                  } else if (
                    value.indexOf(".") > -1 &&
                    value.toString().split(".").length > 2
                  ) {
                    cb("请输入正确的金额");
                  } else {
                    cb();
                  }
                } else {
                  cb("请输入金额");
                }
              },
            },
          ],
        },
        turingNum(message) {
          return {
            trigger: "blur",
            rules: [
              {
                required: true,
                validator: (rule, value, cb) => {
                  if (!value) {
                    cb(message);
                  } else if (!Number(value)) {
                    cb("请输入正整数");
                  } else {
                    cb();
                  }
                },
              },
            ],
          };
        },
      },
      formDept: [], // 表单二级部门选项
      oldSearchOption: null, // 旧的搜索选项
    };
  },
  async mounted() {
    this.getProjectAgentData();
    this.getProjectDeptData();
    this.getProjectParentDeptData();
    this.getProjectStateData();
    this.getPutCampaignTypeData();
    this.getSubModelData();
    this.getActivePhaseData();
    this.getProjectMediaData();
    await this.getProjectTimeData();
    this.getProjectApprovalDataList();
  },
  computed: {
    // 二级部门选择项
    secondDept() {
      const { deptData, parentDeptId } = this;
      let lis = [];
      if (parentDeptId.length) {
        for (let i = 0, len = parentDeptId.length; i < len; i++) {
          for (let index = 0, len = deptData.length; index < len; index++) {
            if (
              Number(parentDeptId[i]) === Number(deptData[index].parentDeptId)
            ) {
              lis = [...lis, ...deptData[index].list];
              break;
            }
          }
        }
      } else {
        deptData.forEach((item) => {
          lis = [...lis, ...item.list];
        });
      }
      return lis;
    },
  },
  methods: {
    // 获取代理名称组件数据
    async getProjectAgentData() {
      try {
        const res = await getProjectAgentData();
        this.agentData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 查询项目立项信息
    async getProjectApprovalDataList(page) {
      this.loading = true;
      if (page) this.pageOptions.current = page;
      const {
        startTime,
        endTime,
        parentDeptId,
        deptId,
        agentId,
        state,
        campaignName,
        pageOptions,
        oldSearchOption,
      } = this;
      try {
        const obj = {
          startTime: startTime ? moment(startTime).format("YYYY-MM-DD") : "",
          endTime: endTime ? moment(endTime).format("YYYY-MM-DD") : "",
          parentDeptId: parentDeptId.toString(),
          deptId: deptId.toString(),
          agentId: agentId.toString(),
          state: state.toString(),
          campaignName,
          pageSize: pageOptions.pageSize,
        };
        if (oldSearchOption != JSON.stringify(obj)) {
          this.selectActiveList = [];
        }
        const res = await getProjectApprovalDataList({
          ...obj,
          currentPage: page || pageOptions.current,
        });
        this.oldSearchOption = JSON.stringify(obj);
        this.dataSource = res.data.list;
        this.pageOptions.total = res.data.total;
      } catch (error) {
        console.log(error);
      }
      this.loading = false;
    },
    // 获取项目时间组件数据
    async getProjectTimeData() {
      try {
        const res = await getProjectTimeData();
        this.timeData = res.data;
        this.startTime = moment(res.data.startTime);
        this.endTime = moment(res.data.endTime);
      } catch (error) {
        console.log(error);
      }
    },
    // 获取二级部门组件数据
    async getProjectDeptData() {
      try {
        const res = await getProjectDeptData();
        this.deptData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取一级事业部组件数据
    async getProjectParentDeptData() {
      try {
        const res = await getProjectParentDeptData();
        this.parentDeptData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取投放状态组件数据
    async getProjectStateData() {
      try {
        const res = await getProjectStateData();
        this.stateData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取投放目标组件数据
    async getPutCampaignTypeData() {
      try {
        const res = await getPutCampaignTypeData();
        this.campaignTypeData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取子车系组件数据
    async getSubModelData() {
      try {
        const res = await getSubModelData();
        this.subModelData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 根据项目名模糊匹配
    getCampaignNameList: _debounce(async function () {
      try {
        const res = await getCampaignNameList({
          campaignName: this.campaignName,
        });
        this.campaignNameList = res.data;
      } catch (error) {
        console.log(error);
      }
    }),
    // 新建推广活动
    async insertProjectPutActive(obj) {
      this.spinning = true;
      try {
        const res = await insertProjectPutActive(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.activityModalShow = false;
          this.cancel();
          this.pageOptions.current = 1;
          this.getProjectApprovalDataList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
      this.spinning = false;
    },
    // 修改推广活动
    async updateProjectPutActive(obj) {
      this.spinning = true;
      try {
        const res = await updateProjectPutActive(obj);
        if (res.flag) {
          this.$message.success(res.message);
          this.activityModalShow = false;
          this.cancel();
          this.getProjectApprovalDataList();
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
      this.spinning = false;
    },
    // 获取活动阶段组件数据
    async getActivePhaseData() {
      try {
        const res = await getActivePhaseData();
        this.activePhaseData = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 获取媒体组件数据
    async getProjectMediaData() {
      try {
        const res = await getProjectMediaData();
        this.mediaData = res.data;
      } catch (error) {
        console.log(error);
      }
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
    // 选择开始时间禁用
    startTimeDisable(current) {
      if (this.endTime == null) {
        return (
          moment(this.timeData.startTime) > current ||
          current > moment(this.timeData.endTime)
        );
      } else {
        return (
          moment(this.timeData.startTime) > current ||
          current > moment(this.endTime)
        );
      }
    },
    // 选择结束时间禁用
    endTimeDisable(current) {
      if (this.startTime == null) {
        return (
          moment(this.timeData.startTime) > current ||
          current > moment(this.timeData.endTime)
        );
      } else {
        return (
          moment(this.startTime) > current ||
          current > moment(this.timeData.endTime)
        );
      }
    },
    // 提交表单
    submit() {
      this.form.validateFields((errors, value) => {
        if (errors) return;
        value.startTime = moment(value.startTime).format("YYYY-MM-DD");
        value.endTime = moment(value.endTime).format("YYYY-MM-DD");
        value.subModelId = value.subModelId.join(",");
        if (this.modiflyCampaignId != null) {
          value.campaignId = this.modiflyCampaignId;
          this.updateProjectPutActive(value);
        } else {
          this.insertProjectPutActive(value);
        }
      });
    },
    cancel() {
      this.formDept = [];
      this.modiflyCampaignId = null;
      this.form.resetFields();
    },
    // 设置表单的二级部门选项
    setFormDept() {
      const { deptData } = this;
      this.$nextTick(() => {
        const val = this.form.getFieldValue("parentDeptId");
        this.form.setFieldsValue({ deptId: undefined });
        let lis = [];
        if (val) {
          for (let i = 0, len = deptData.length; i < len; i++) {
            if (Number(val) === Number(deptData[i].parentDeptId)) {
              lis = deptData[i].list;
            }
          }
        }
        this.formDept = lis;
      });
    },
    // 修改活动信息
    modiflyInfo(info) {
      this.activityModalShow = true;
      this.$nextTick(() => {
        const {
          campaignName, // 推广活动名称
          activePhaseId, // 活动阶段id
          agentId, // 代理id
          campaignId, // 推广活动id (修改时使用)
          campaignNo, // 项目编号
          deptId, // 部门id
          endTime, // 结束
          forecastClick, // 预计点击量
          forecastCost, // 预计总费用
          forecastImpl, // 预计曝光量
          forecastLeads, // 预计留资量
          isFillAmount, // 是否补量（1是0否）
          isPlayList, // 是否参与打榜（1是0否）
          mediaId, // 媒体名称
          parentDeptId, // 事业部id
          putArea, // 投放区域
          putCampaignType, // 投放目标类型
          startTime, // 开始
          subModelId, // 子车系id
        } = info;
        this.modiflyCampaignId = campaignId; // 推广活动id (修改时使用), // 推广活动id (修改时使用)  campaignId, // 推广活动id (修改时使用)
        const obj = {
          campaignName, // 推广活动名称
          activePhaseId, // 活动阶段id
          agentId, // 代理id
          campaignNo, // 项目编号
          deptId, // 部门id
          endTime, // 结束
          forecastClick, // 预计点击量
          forecastCost, // 预计总费用
          forecastImpl, // 预计曝光量
          forecastLeads, // 预计留资量
          isFillAmount, // 是否补量（1是0否）
          isPlayList, // 是否参与打榜（1是0否）
          mediaId, // 媒体名称
          parentDeptId, // 事业部id
          putArea, // 投放区域
          putCampaignType, // 投放目标类型
          startTime, // 开始
          subModelId: subModelId.split(","), // 子车系id
        };
        this.form.setFieldsValue(obj);
      });
    },
    // 点击多选框
    selectActive(e) {
      const checked = e.target.checked;
      const value = e.target.value;
      if (checked) {
        this.selectActiveList.push(value);
      } else {
        const index = this.selectActiveList.indexOf(value);
        if (index > -1) this.selectActiveList.splice(index, 1);
      }
    },
    // 下载项目信息
    downLoadInfo() {
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      const token = localStorage.getItem("token");
      const {
        startTime,
        endTime,
        parentDeptId,
        deptId,
        agentId,
        state,
        campaignName,
        selectActiveList,
      } = this;
      if (!startTime && !endTime) {
        this.$message.info("开始时间和结束时间必选一项");
        return;
      }
      if (!selectActiveList.length) {
        this.$message.info("请选择需要下载的项目信息");
        return;
      }
      const obj = {
        startTime: startTime ? moment(startTime).format("YYYY-MM-DD") : "",
        endTime: endTime ? moment(endTime).format("YYYY-MM-DD") : "",
        parentDeptId: parentDeptId.toString(),
        deptId: deptId.toString(),
        agentId: agentId.toString(),
        state: state.toString(),
        campaignName,
        campaignId: selectActiveList.toString(),
      };
      const url = `${baseApiUrl}/schedule-api/schedule/downloadProjectDataList?startTime=${obj.startTime}&endTime=${obj.endTime}&parentDeptId=${obj.parentDeptId}&deptId=${obj.deptId}&state=${obj.state}&campaignName=${obj.campaignName}&campaignId=${obj.campaignId}&authorization=${token}`;
      _download(url);
    },
    // 重置搜索信息
    reset() {
      this.startTime = moment(this.timeData.startTime);
      this.endTime = moment(this.timeData.endTime);
      this.parentDeptId = [];
      this.deptId = [];
      this.agentId = [];
      this.state = [];
      this.campaignName = "";
    },
  },
};
</script>
<style lang="less" scoped>
.project-title {
  background-color: #fff;
  padding: 10px 20px 0;
  > * {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
</style>
