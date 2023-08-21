<template>
  <view class="searchBox">
    <u-search
      v-model="searchText"
      shape="round"
      :showAction="false"
      :searchIconColor="themeColor"
      borderColor="#ffffff"
      bgColor="#ffffff"
      :placeholder="placeholder"
      @search="search"
    />
  </view>
</template>

<script>
// 常量
import { themeColor } from "@/config/theme";

export default {
  name: "Search",
  props: {
    title: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "搜索关键词",
    },
  },
  data() {
    return {
      searchText: "",
      themeColor,
    };
  },
  mounted() {},
  methods: {
    search() {
      this.$emit("search", this.searchText);
    },
  },
};
</script>

<style lang="scss">
.searchBox {
  font-weight: normal;
}
</style>
