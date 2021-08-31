<template>
  <span @click="download" class="down-load"><slot> 下载 </slot></span>
</template>
<script>
import { _download } from "@/assets/js/util";
export default {
  props: {
    url: {
      type: String,
      default: "",
    },
  },
  computed: {
    downloadUrl() {
      const baseApiUrl = process.env.VUE_APP_BASE_URL;
      // const baseApiUrl = 'http://10.3.101.124:7100';
      const token = localStorage.getItem("token");
      return `${baseApiUrl}${this.url}&authorization=${token}`;
    },
  },
  methods: {
    download() {
      _download(this._download);
    },
  },
};
</script>
<style lang="less" scoped>
.down-load {
  display: inline-block;
  width: 77px;
  color: white;
  text-align: center;
  font-size: 12px;
  cursor: pointer;
}
</style>
