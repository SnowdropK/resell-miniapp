<template>
  <view class="salesZoneBox">
    <view class="zone left" @click="goToResell">
      <text>转卖专区</text>
      <u--image
        src="/static/images/icons/sale.png"
        width="80rpx"
        height="80rpx"
      ></u--image>
    </view>
    <!-- <view class="zone right" @click="goToAuction">
      <text>拍卖</text>
      <u--image
        src="/static/images/icons/auction.png"
        width="80rpx"
        height="80rpx"
      ></u--image>
    </view> -->
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 跳转转卖专区
    goToResell() {
      uni.navigateTo({
        url: `/pages/home/resell/index`,
      });
    },
    // 跳转拍卖专区
    goToAuction() {
      uni.navigateTo({
        url: `/pages/home/auction/index`,
      });
    },
  },
};
</script>
<style lang="scss">
.salesZoneBox {
  display: flex;
  justify-content: space-between;
  margin-top: 34rpx;
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;

  .zone {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    // width: 334rpx;
		// 暂时-s
		width: 100%;
		padding-right: 40rpx;
		// 暂时-e
    height: 162rpx;
    border-radius: 24rpx;
    padding-left: 22rpx;
    // padding-right: 26rpx;
  }
	.zone text {
		width: 200rpx;
		text-align: center;
	}
  .left {
    background-image: linear-gradient(136deg, #9c8bfc 0%, #806ef9 100%);
  }
  .right {
    background-image: linear-gradient(317deg, #8aecc9 0%, #52d2d5 100%);
  }
}
</style>
