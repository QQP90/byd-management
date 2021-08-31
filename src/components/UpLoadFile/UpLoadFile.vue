<template>
  <span>
    <a-upload
      name="file"
      :accept="accept"
      :showUploadList="false"
      :customRequest="customRequest"
      :beforeUpload="beforeUpload"
    >
      <slot></slot>
    </a-upload>
  </span>
</template>
<script>
import {
  upLoadUser,
  importAdvertisingMessages,
} from "@/service/internalUser/user";
export default {
  props: {
    accept: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "user",
    },
  },
  data() {
    return {};
  },
  methods: {
    customRequest(data) {
      const formData = new FormData();
      formData.append("file", data.file);
      this.saveFile(formData);
    },
    beforeUpload(data) {
      this.$emit("change", true);
    },
    async saveFile(formData) {
      const { type } = this;
      try {
        let res;
        if (type === "agent") {
          res = await importAdvertisingMessages(formData);
        } else {
          res = await upLoadUser(formData);
        }

        this.$message.success(res.data.massage);
      } catch (err) {
        this.$message.error(err);
      }
      this.$emit("change", false);
    },
  },
};
</script>
