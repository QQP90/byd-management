<template>
  <div id="app">
    <a-config-provider :locale="zh_CN">
      <BaseLayout />
    </a-config-provider>
  </div>
</template>

<script>
import BaseLayout from "@/components/BaseLayout/BaseLayout.vue";
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import { GetQueryValue } from "@/assets/js/util";
import moment from "moment";
import { mapActions } from "vuex";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  name: "App",
  components: {
    BaseLayout,
  },
  computed: {},
  data() {
    return {
      zh_CN,
    };
  },
  created() {
    const token = GetQueryValue("token");

    if (token) {
      localStorage.clear();
      localStorage.setItem("token", token);
    }
  },
  methods: {},
};
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>
