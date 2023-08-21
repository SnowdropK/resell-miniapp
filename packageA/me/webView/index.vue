<template>
  <view>
    <!-- <CommonContainer title="帮助"> -->
    <web-view :src="url" :webview-styles="webviewStyles"></web-view>
    <!-- </CommonContainer> -->
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      url: "",
      webviewStyles: {
        pre: {
          "white-space": "pre-wrap",
          // 'font-size': '40rpx'
        },
      },
    };
  },
  onLoad(options) {
    if (options.url) {
      this.url = decodeURIComponent(options.url);
    }
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
