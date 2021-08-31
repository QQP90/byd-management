<template>
  <div class="schedule">
    <a-tabs
      v-if="paneList.length > 0"
      v-model="activeKey"
      @tabClick="tabsChange"
      :animated="false"
    >
      <a-tab-pane v-for="item in paneList" :key="item.router" :tab="item.name">
      </a-tab-pane>
    </a-tabs>
    <router-view v-if="paneList.length > 0"></router-view>
  </div>
</template>

<script>
import { initSchedulePaneList } from "@/assets/js/util";
import { mapState, mapMutations } from "vuex";
export default {
  name: "ScheduleIndex",
  data() {
    return {
      activeKey: "projectInitiation",
      paneList: [
        {
          name: "项目立项",
          router: "projectInitiation",
        },
        {
          name: "排期计划",
          router: "schedulingPlan",
        },
        {
          name: "车型管理",
          router: "carManagement",
        },
        {
          name: "代理管理",
          router: "agentManagement",
        },
        {
          name: "媒体管理",
          router: "mediaManagement",
        },
        {
          name: "消息通知",
          router: "messageNotification",
        },
      ],
      userAdd: true,
    };
  },
  created() {
    const { userAuth } = this;

    if (userAuth) {
      const { paneList } = initSchedulePaneList(userAuth);

      this.paneList = paneList;
    }
  },
  mounted() {
    for (let i = 0, len = this.paneList.length; i < len; i++) {
      let active = this.paneList[i].router;
      if (this.$route.path.indexOf(active) > -1) {
        this.activeKey = active;
        return;
      }
    }
  },
  methods: {
    ...mapMutations("user", {
      setInteriorAddUser: "SET_INTERIOR_ADD_USER",
      setInteriorBatchAddUser: "SET_INTERIOR_BATCH_ADD_USER",
      setAdcraftAddUser: "SET_ADCRAFT_ADD_USER",
      setAdcraftBatchAddUser: "SET_ADCRAFT_BATCH_ADD_USER",
    }),
    tabsChange(key) {
      this.$router.push(`/schedule/${key}`);
    },
  },
  computed: {
    ...mapState(["userAuth"]),
  },
  watch: {
    // userAuth(newVal) {
    //   if (newVal) {
    //     const self = this;
    //     const { paneList } = initAuth(newVal);
    //     paneList.some((item) => {
    //       const active = item.router;
    //       if (self.$route.path.indexOf(active) > -1) {
    //         self.activeKey = active;
    //         return;
    //       }
    //     });
    //     this.paneList = paneList;
    //   }
    // },
  },
};
</script>
<style lang="less" scoped></style>
