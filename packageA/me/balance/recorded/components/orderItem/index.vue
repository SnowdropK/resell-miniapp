<template>
  <view class="orderItemBox" @click="goToOrderDetail">
    <view class="orderItemStatus">
      <text>{{ ORDER_STATUS_TEXT_MAP[info.orderStatus || ""] || "" }}</text>
    </view>
    <view class="orderInfoBox">
      <image class="mainImg" mode="aspectFill" :src="info.mainUrl" />
      <view class="infoBox">
        <!-- 标题 -->
        <view class="headBox">
          <view class="title">{{ info.goodsTitle }}</view>
          <view>
            <!-- <view class="priceTag">
              ￥<text class="priceNum">{{
                toYuan(info.goodsPrice)
              }}</text>
            </view> -->
            <view class="num">x {{ info.goodsNum }}</view>
          </view>
        </view>
        <!-- 底部信息 -->
        <view class="btBox">
          <text class="expressFee">
            运费: <text>￥{{ toYuan(info.deliveryAmount || 0) }}</text></text
          >
          <text v-if="true" class="actualPrice">
            实付款:
            <text class="priceTag">￥</text>
            <text class="priceNum">{{
              toYuan(info.goodsPriceAmount || 0)
            }}</text>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// 自定义公共组件
// 工具
import { toYuan } from "@/utils";
// 常量
import { ORDER_STATUS_MAP, ORDER_STATUS_TEXT_MAP } from "@/consts";
import { cancelOrder, confirmOrder } from "@/api/me";

export default {
  name: "OrderItemBox",
  components: {},
  props: {
    info: {
      type: Object,
      default: {},
    },
    // 是否是我买到的
    isBuy: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      ORDER_STATUS_MAP,
      ORDER_STATUS_TEXT_MAP,
    };
  },
  methods: {
    // 分转元
    toYuan(val) {
      return toYuan(val);
    },
    goToOrderDetail() {
      // const orderType = this.isBuy ? "buyOrder" : "sellOrder";
      const { id } = this.info;
      uni.navigateTo({
        url: `/pages/me/myOrder/orderDetail/index?id=${id}&orderType=sellOrder`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.orderItemBox {
  margin-bottom: 32rpx;
  padding: 20rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
  background-color: #fff;

  .orderItemStatus {
    color: #c2c2c2;
    text-align: right;
  }

  .orderInfoBox {
    display: flex;
    margin-top: 6rpx;
    .priceTag {
      color: #dd524d;
    }
    .priceNum {
      color: #dd524d;
      font-size: 30rpx;
      font-weight: bold;
    }

    .mainImg {
      border-radius: 12rpx;
      width: 160rpx;
      height: 160rpx;
      background-color: $uni-bg-color-grey;
    }

    .infoBox {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
      flex-grow: 1;

      .headBox {
        display: flex;
        justify-content: space-between;

        .title {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
        }
        .num {
          margin-top: -6rpx;
          color: $uni-text-color-grey;
          text-align: right;
        }
      }
      .btBox {
        text-align: right;

        .expressFee {
          color: #c0c0c0;
          margin-right: 34rpx;
        }
      }
    }
  }
}
</style>
