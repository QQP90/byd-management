<template>
  <a-layout-header class="global-header">
    <div @click="logout">
      <a-icon type="logout" />
      <span>退出登录</span>
    </div>

    <div @click="toHome">
      <a-icon type="appstore" theme="filled" />
      <span>广宣检测系统</span>
    </div>
  </a-layout-header>
</template>

<script>
const platformUrl = process.env.VUE_APP_PLATFORM_URL;

export default {
  name: "GlobalHeader",
  data() {
    return {};
  },
  methods: {
    toHome() {
      let winOpen = window.open("", "_blank");
      const token = localStorage.getItem("token");

      setTimeout(function () {
        winOpen.location.href = `${platformUrl}?token=${token}`;
      }, 0);
    },
    logout() {
      localStorage.clear();
      window.location.href = `${platformUrl}login`;
    },
  },
};
</script>

<style scope lang="scss">
.global-header {
  height: 50px;
  line-height: 50px;
  background: #fff;
  color: #141934;

  & > div {
    float: right;
    margin: 0 20px;
    cursor: pointer;
    & > span {
      padding-left: 2px;
    }
  }
}
</style>
