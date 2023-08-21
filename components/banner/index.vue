<template>
  <view class="bannerBox">
    <u-swiper
      height="200rpx"
      :list="list1"
      circular
      indicator
      :indicatorActiveColor="themeColor"
      @change="change"
      @click="click"
    ></u-swiper>
  </view>
</template>

<script>
// 常量
import { themeColor } from "config/theme";

export default {
  data() {
    return {
      themeColor,
      list1: [
        "https://cdn.uviewui.com/uview/swiper/swiper1.png",
        "https://cdn.uviewui.com/uview/swiper/swiper2.png",
        "https://cdn.uviewui.com/uview/swiper/swiper3.png",
      ],
    };
  },
  onLoad() {},
  methods: {
    change() {},
    click() {},
  },
};
</script>
<style lang="scss">
.bannerBox {
  margin-top: 32rpx;
  width: 100%;
  height: 200rpx;
  overflow: hidden;
  border-radius: 24rpx;
}
</style>
