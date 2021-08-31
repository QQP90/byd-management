<template>
  <div>
    <a-tabs v-model="activeKey" @tabClick="tabsChange" :animated="false">
      <a-tab-pane v-for="item in paneList" :key="item.router" :tab="item.name">
      </a-tab-pane>
      <p slot="tabBarExtraContent">
        <span style="cursor: pointer" @click="addUser">
          <a-icon type="edit" theme="filled" /> 手工录入新增</span
        >
        <span style="cursor: pointer; margin-left: 20px" @click="batchAddUser">
          <a-icon type="vertical-align-top" style="font-size: 16px" />
          批量上传新用户名录</span
        >
      </p>
    </a-tabs>
    <router-view></router-view>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      activeKey: "internalUser",
      paneList: [
        {
          name: "内部用户",
          router: "internalUser",
        },
        {
          name: "广告代理",
          router: "adcraft",
        },
      ],
      userAdd: true,
    };
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
      switch (key) {
        case "internalUser":
          this.$router.push("/userManagement/userControl");
          break;
        case "adcraft":
          this.$router.push("/userManagement/adcraft");
          break;
      }
    },
    addUser() {
      if (this.activeKey === "internalUser") {
        this.setInteriorAddUser(true);
      } else {
        this.setAdcraftAddUser(true);
      }
    },
    batchAddUser() {
      if (this.activeKey === "internalUser") {
        this.setInteriorBatchAddUser(true);
      } else {
        this.setAdcraftBatchAddUser(true);
      }
    },
  },
};
</script>
<style lang="less" scoped>

</style>