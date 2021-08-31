<template>
  <a-layout class="global-ctn">
    <GlobalSider />

    <a-layout>
      <GlobalHeader />
      <a-layout-content class="body-ctn">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapActions } from "vuex";
import GlobalSider from "./GlogalSider.vue";
import GlobalHeader from "./GlogalHeader.vue";
import userControl from "@/router/userManagement";
import schedule from "@/router/schedule";
export default {
  name: "BaseLayout",
  components: {
    GlobalSider,
    GlobalHeader,
  },
  async created() {
    await this.getUserRoleRootList();
  },
  methods: {
    ...mapActions(["getUserRoleRootList"]),
  },
};
</script>

<style scope lang="scss">
.global-ctn {
  min-height: 100%;

  .body-ctn {
    padding: 20px;
    background: #eff1f2;
  }
}
</style>
