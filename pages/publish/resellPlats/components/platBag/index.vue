<template>
  <view class="platBagBox" @click="goToMiniProgram">
    <view class="name">
      {{ info.name }}
      <text v-if="!info.bind && isLogin" class="unBind">（未绑定）</text>
      <text v-if="!isLogin" class="unBind">（未登录）</text>
    </view>
    <view class="empowerBox">
      <text v-if="!info.bind" class="empowerText">前往授权</text>
      <u-icon name="arrow-right" size="20"></u-icon>
    </view>
  </view>
</template>
<script>
export default {
  name: "PlatBag",
  props: {
    info: {
      type: Object,
      default: {},
    },
    isLogin: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    goToMiniProgram() {
      if (!this.isLogin) {
        uni.$u.toast("请登录");
        return;
      }
      const { bind, appid, bindUrl } = this.info;
      this.$emit("clickPlatBag", this.info);
      if (!bind) {
        uni.openEmbeddedMiniProgram({
          appId: appid || "",
          path: `${bindUrl || ""}?weChatSource=free-transaction-miniapp`,
          // develop（开发版），trial（体验版），release（正式版）
          envVersion:
            process.env.NODE_ENV === "production" ? "release" : "trial",
          // extraData: {
          //   weChatSource: "free-transaction-miniapp",
          // },
        });
        return;
      }
      uni.navigateTo({
        url: `/pages/publish/resellGoods/index?id=${this.info.id}`,
      });
    },
  },
};
</script>
<style lang="scss">
.platBagBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14rpx;
  border-radius: 14rpx;
  padding: 30rpx 24rpx;
  background-color: #fff;

  .name {
    font-size: 28rpx;
    font-weight: bold;

    .unBind {
      color: #999;
      font-size: 24rpx;
    }
  }

  .empowerBox {
    display: flex;
    align-items: center;

    .empowerText {
      font-size: 24rpx;
      color: $uni-text-color-grey;
    }
  }
}
</style>
