<template>
  <div class="test-wrap" style="width:1000px">
    <a-table
      :scroll="{ x: 'max-content' }"
      :columns="columnsRow"
      :data-source="tableDataProps"
      rowKey="campaignAdsoltId"
    >
      <template slot="isPlayList" slot-scope="text, record">
        <span v-if="record.isPlayList == 1">是</span>
        <span v-if="record.isPlayList == 0">否</span>
      </template>
      <template slot="isFillAmount" slot-scope="text, record">
        <span v-if="record.isFillAmount == 1">是</span>
        <span v-if="record.isFillAmount == 0">否</span>
      </template>
      <template slot="isGiving" slot-scope="text, record">
        <span v-if="record.isGiving == 1">是</span>
        <span v-if="record.isGiving == 0">否</span>
      </template>
      <template slot="isSpecial" slot-scope="text, record">
        <span v-if="record.isSpecial == 1">是</span>
        <span v-if="record.isSpecial == 0">否</span>
      </template>
    </a-table>
    <div class="rightBackFooter">
      <a-button class="ant-btn" @click="handleClick(0)">
        取消
      </a-button>
      <a-button
        class="ant-btn"
        :disabled="disable"
        type="danger"
        @click="handleClick(2)"
      >
        审核不通过
      </a-button>
      <a-button
        class="ant-btn"
        :disabled="disable"
        :type="disable ? '' : 'primary'"
        @click="handleClick(1)"
      >
        审核通过
      </a-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      default: 0,
      type: Number,
    },
    disable: {
      default: false,
      type: Boolean,
    },
    columns: {
      default: () => [],
      type: Array,
    },
    tableDataProps: {
      default: () => [],
      type: Array,
    },
    campaignId: {
      default: "",
      type: String,
    },
  },
  data() {
    return {
      // tableData: [{ id: 1, xmxx: "234567", parentDeptName: "56789" }],
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
          title: "子车系",

          align: "center",
          key: "subModelName",
          dataIndex: "subModelName",
        },
        {
          title: "活动阶段",

          align: "center",
          key: "activePhaseName",
          dataIndex: "activePhaseName",
        },
        {
          title: "推广活动名称",

          align: "center",
          key: "campaignName",
          dataIndex: "campaignName",
        },
        {
          title: "推广活动ID",

          align: "center",
          key: "campaignId",
          dataIndex: "campaignId",
        },
        {
          title: "项目编号",

          align: "center",
          key: "campaignNo",
          dataIndex: "campaignNo",
        },
        {
          title: "开始日期",

          align: "center",
          key: "startTime",
          dataIndex: "startTime",
        },
        {
          title: "结束日期",

          align: "center",
          key: "endTime",
          dataIndex: "endTime",
        },
        {
          title: "投放目标",

          align: "center",
          key: "putCampaignName",
          dataIndex: "putCampaignName",
        },
        {
          title: "参与打榜",
          align: "center",
          key: "isPlayList",
          dataIndex: "isPlayList",
          scopedSlots: { customRender: "isPlayList" },
        },
        {
          title: "是否补量",

          align: "center",
          key: "isFillAmount",
          dataIndex: "isFillAmount",
          scopedSlots: { customRender: "isFillAmount" },
        },

        //
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
          title: "预估曝光量",

          align: "center",
          key: "forecastImpl",
          dataIndex: "forecastImpl",
        },
        {
          title: "预估点击量",

          align: "center",
          key: "forecastClick",
          dataIndex: "forecastClick",
        },
        {
          title: "预支留资量",

          align: "center",
          key: "forecastLeads",
          dataIndex: "forecastLeads",
        },
        {
          title: "预估总费用",

          align: "center",
          key: "forecastCost",
          dataIndex: "forecastCost",
        },
        {
          title: "投放区域",

          align: "center",
          key: "putArea",
          dataIndex: "putArea",
        },
        {
          title: "终端类型",

          align: "center",
          key: "deviceType",
          dataIndex: "deviceType",
        },
        {
          title: "投放位置",

          align: "center",
          key: "putLocation",
          dataIndex: "putLocation",
        },
        {
          title: "广告位名称",

          align: "center",
          key: "adslotName",
          dataIndex: "adslotName",
        },
        {
          title: "广告位名称ID",
          align: "center",
          key: "trackingId",
          dataIndex: "trackingId",
        },
        {
          title: "广告形式",

          align: "center",
          key: "adslotType",
          dataIndex: "adslotType",
        },
        //
        {
          title: "广告尺寸",

          align: "center",
          key: "adslotSize",
          dataIndex: "adslotSize",
        },
        {
          title: "落地页URL",

          align: "center",
          key: "locationUrl",
          dataIndex: "locationUrl",
        },
        {
          title: "是否赠送",
          align: "center",
          key: "isGiving",
          dataIndex: "isGiving",
          scopedSlots: { customRender: "isGiving" },
        },
        {
          title: "购买方式",

          align: "center",
          key: "buyType",
          dataIndex: "buyType",
        },
        {
          title: "结算方式",

          align: "center",
          key: "settlementType",
          dataIndex: "settlementType",
        },
        {
          title: "投放数量",

          align: "center",
          key: "putNum",
          dataIndex: "putNum",
        },
        {
          title: "广告位刊例价",
          align: "center",
          key: "quotedPrice",
          dataIndex: "quotedPrice",
        },
        {
          title: "广告位刊例总价",

          align: "center",
          key: "quotedTotalPrice",
          dataIndex: "quotedTotalPrice",
        },
        {
          title: "折扣",

          align: "center",
          key: "discount",
          dataIndex: "discount",
        },
        {
          title: "综合折扣",

          align: "center",
          key: "totalDiscount",
          dataIndex: "totalDiscount",
        },
        {
          title: "净总价（广告位折后价）",

          align: "center",
          key: "netPrice",
          dataIndex: "netPrice",
        },
        {
          title: "单价（广告位折后单价）",

          align: "center",
          key: "unitPrice",
          dataIndex: "unitPrice",
        },
        {
          title: "是否专项",

          align: "center",
          key: "isSpecial",
          dataIndex: "isSpecial",
          scopedSlots: { customRender: "isSpecial" },
        },
        {
          title: "预估总曝光量",

          align: "center",
          key: "forecastTotalImpl",
          dataIndex: "forecastTotalImpl",
        },
        {
          title: "预估总点击量",

          align: "center",
          key: "forecastTotalClick",
          dataIndex: "forecastTotalClick",
        },
        {
          title: "预估总留资量",

          align: "center",
          key: "forecastTotalLeave",
          dataIndex: "forecastTotalLeave",
        },
        {
          title: "支持第三方曝光检测",

          align: "center",
          key: "thirdImpl",
          dataIndex: "thirdImpl",
        },
        {
          title: "支持第三方点击检测",

          align: "center",
          key: "thirdClick",
          dataIndex: "thirdClick",
        },
      ],
    };
  },
  watch: {
    id(val) {
      console.log(val, 67);
    },
  },
  computed: {
    columnsRow() {
      const { columns, tableColumns } = this;
      return [...tableColumns, ...columns];
    },
  },
  methods: {
    handleClick(typeNum) {
      let campaignAdsoltIds = this.tableDataProps.map((v) => {
        // console.log(v, 789);
        return v.campaignAdsoltId;
      });
      let obj = {
        campaignAdsoltId: campaignAdsoltIds.toString(),
        auditState: typeNum,
        campaignId: this.campaignId,
      };
      this.$emit("saveAudit", obj);
    },
  },
};
</script>

<style lang="less" scoped>
.rightBackFooter {
  text-align: right;
  padding: 20px 0 0;
  .ant-btn {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
}
/deep/.ant-table-thead > tr > th {
  background: #c1d7ec;
}
</style>
