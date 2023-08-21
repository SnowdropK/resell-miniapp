<template>
  <view class="resellSkuBox">
    <image class="mainImg" :src="info.iconUrl || info.mainUrl" />
    <view class="infoBox">
      <!-- 标题 -->
      <view class="titleBox">
        <text>{{ info.title }}</text>
        <view class="offerPrice">{{ info.saleNum }}次出价</view>
      </view>
      <!-- 系列 -->
      <view class="seriesTitle">{{ info.sereistitle }}</view>
      <!-- 底部信息 -->
      <view class="btBox">
        <view class="saleUser">
          <image
            class="saleUserImg"
            mode="aspectFit"
            :src="info.iconUrl || info.mainUrl"
          />
          <text class="saleUserName">{{ info.name || "" }}</text>
        </view>
        <view class="salePrice" @click.stop="goToOrder(info.id)">
          当前价￥<text class="salePriceText">{{ info.salePrice }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "ResellSkuBox",
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  methods: {
    goToOrder(id) {
      uni.navigateTo({
        url: `/pages/home/order/index?id=${id}`,
      });
    },
  },
};
</script>
<style lang="scss">
.resellSkuBox {
  display: flex;
  margin-bottom: 32rpx;
  padding: 20rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  background-color: #fff;

  .mainImg {
    border-radius: 12rpx;
    width: 160rpx;
    height: 160rpx;
    background-color: $uni-bg-color-grey;
  }

  .infoBox {
    width: 100%;
    margin-left: 20rpx;

    .titleBox {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;

      .offerPrice {
        margin-left: 12rpx;
        padding: 0 14rpx;
        height: 40rpx;
        border-radius: 20rpx;
        font-size: 28rpx;
        font-weight: normal;
        text-align: center;
        line-height: 40rpx;
        color: $uni-bg-color;
        border: 1px solid $uni-bg-color;
      }
    }
    .seriesTitle {
      margin-top: 12rpx;
      font-size: 20rpx;
      color: #bfbfbf;
    }
    .btBox {
      display: flex;
      justify-content: space-between;
      padding-right: 20rpx;
      align-items: center;
      margin-top: 8rpx;
      font-size: 20rpx;

      .saleUser {
        display: flex;
        align-items: center;

        .saleUserImg {
          border-radius: 32rpx;
          width: 32rpx;
          height: 32rpx;
          background-color: $uni-bg-color-grey;
        }

        .saleUserName {
          margin-left: 8rpx;
          color: #bfbfbf;
          font-size: 20rpx;
        }
      }

      .salePrice {
        font-size: 24rpx;
        font-weight: bold;
        color: #ea5334;

        .salePriceText {
          font-size: 36rpx;
        }
      }
    }
  }
}
</style>
