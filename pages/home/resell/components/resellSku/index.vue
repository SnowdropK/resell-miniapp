<template>
  <view class="resellSkuBox" @click="goToSkuDetail">
    <image
      class="mainImg"
      mode="aspectFit"
      :src="info.mainUrl || info.attachUrl"
    />
    <view class="infoBox">
      <!-- 标题 -->
      <view class="title">{{ info.name }}</view>
      <!-- 标签 -->
      <view class="tagBox">
        <view class="tag">最高¥{{ toYuan(info.maxPrice) }}</view>
        <view class="tag">最低¥{{ toYuan(info.minPrice) }}</view>
        <view class="tag">累计成交{{ info.totalSale }}</view>
      </view>
      <!-- 底部信息 -->
      <view class="btBox">
        <view class="seriesTitle">{{ info.categoryDetail }}</view>
        <view class="salePrice">
          ￥<text class="salePriceText">{{ toYuan(info.minPrice) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// 工具
import { toYuan } from "@/utils";

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
    // 分转元
    toYuan(val) {
      return toYuan(val);
    },
    goToSkuDetail() {
      const { id = "" } = this.info;
      uni.navigateTo({
        url: `/pages/home/skuDetail/index?id=${id}`,
      });
    },
    // goToOrder(id) {
    //   uni.navigateTo({
    //     url: `/pages/home/order/index?id=${id}`,
    //   });
    // },
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
    margin-left: 20rpx;

    .title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
    }
    .tagBox {
      display: flex;
      margin-top: 12rpx;

      .tag {
        margin-right: 16rpx;
        width: 148rpx;
        height: 48rpx;
        border-radius: 12rpx;
        text-align: center;
        line-height: 48rpx;
        color: #bfbfbf;
        font-size: 20rpx;
        background-color: #f9f9f9;
      }
    }
    .btBox {
      display: flex;
      justify-content: space-between;
      padding-right: 20rpx;
      align-items: center;
      margin-top: 8rpx;
      font-size: 20rpx;

      .seriesTitle {
        width: 320rpx;
        font-size: 20rpx;
        color: #bfbfbf;
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
