<template>
  <a-layout-sider
    :style="{
      flex: '0 0 190px',
      'max-width': '190px',
      'min-width': '190px',
      width: '190px',
    }"
    class="global-sider"
  >
    <div class="sider-logo">
      <img src="@/assets/img/logo.png" alt="" />
      <p>广宣监测系统-管理后台</p>
    </div>

    <a-skeleton
      active
      :paragraph="{
        rows: 2,
        width: ['100%', '100%'],
      }"
      :title="false"
      :loading="menuList.length == 0"
    >
      <a-menu @select="selectMenu" :default-selected-keys="[defaultRoute]">
        <a-menu-item v-for="item in menuList" :key="item.routeName">
          <a-icon :type="item.icon"></a-icon>
          <span>{{ item.name }}</span>
        </a-menu-item>
      </a-menu>
    </a-skeleton>
  </a-layout-sider>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "GlobalSider",
  data() {
    return {
      defaultRoute: "userManagement",
    };
  },
  computed: {
    ...mapState(["menuList"]),
  },
  methods: {
    selectMenu({ key }) {
      this.$router.push({ name: key });
    },
  },
  created() {
    const pattern = new RegExp(/\/[s|u][a-zA-Z]+/);
    const result = pattern.exec(window.location.href);
    if (result) {
      this.$data.defaultRoute = result[0].replace("/", "");
    }
  },
  watch: {},
};
</script>

<style scope lang="scss">
.global-sider {
  background: #0073c6;

  .sider-logo {
    padding-top: 20px;
    text-align: center;
    color: #fff;
    font-size: 16px;
    p {
      margin-top: 10px;
    }
  }

  .ant-menu-inline,
  .ant-menu-vertical,
  .ant-menu-vertical-left {
    border-right: 0;
  }

  .ant-menu {
    background: #0073c6;
    color: #fff;
  }

  .ant-menu-item {
    padding-left: 40px;
  }

  .ant-menu-item:hover,
  .ant-menu-item-active,
  .ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
  .ant-menu-submenu-active,
  .ant-menu-submenu-title:hover {
    color: #0073c6;
    background: #e6f9ff;

    &.ant-menu-item-selected {
      color: #0073c6;
    }
  }

  .ant-skeleton-paragraph {
    li {
      height: 40px;
    }
  }
}
</style>
