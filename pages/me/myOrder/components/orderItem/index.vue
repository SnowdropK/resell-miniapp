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
          <view class="title">{{ info.goodsTitle || "" }}</view>
          <view>
            <!-- <view class="priceTag">
              ￥<text class="priceNum">{{
                toYuan(info.goodsPrice)
              }}</text>
            </view> -->
            <view class="num">x {{ info.goodsNum || 0 }}</view>
          </view>
        </view>
        <!-- 底部信息 -->
        <view class="btBox">
          <text class="expressFee">
            运费: <text>￥{{ toYuan(info.deliveryAmount) }}</text></text
          >
          <text v-if="true" class="actualPrice">
            实付款:
            <text class="priceTag">￥</text>
            <text class="priceNum">{{ toYuan(info.goodsPriceAmount) }}</text>
          </text>
        </view>
        <!-- 操作按钮 -->
        <view
          v-if="isBuy && OPRATE_BTN_TEXT[info.orderStatus || '']"
          class="operateBtnBox"
        >
          <view class="operateBtn" @click.stop="handleOperate">
            {{ OPRATE_BTN_TEXT[info.orderStatus || ""] || "" }}
          </view>
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

const OPRATE_BTN_TEXT = {
  [ORDER_STATUS_MAP.TO_BE_SHIPPED]: "取消订单",
  [ORDER_STATUS_MAP.TO_BE_RECEIVED]: "确认收货",
};

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
      OPRATE_BTN_TEXT,
    };
  },
  methods: {
    // 分转元
    toYuan(val) {
      return toYuan(val || 0);
    },
    goToOrderDetail() {
      const orderType = this.isBuy ? "buyOrder" : "sellOrder";
      const { id } = this.info;
      uni.navigateTo({
        url: `/pages/me/myOrder/orderDetail/index?id=${id}&orderType=${orderType}`,
      });
    },
    async operateOrder() {
      const { orderStatus, orderId: id } = this.info;
      // 取消订单
      if (orderStatus === ORDER_STATUS_MAP.TO_BE_SHIPPED) {
        await cancelOrder({ id });
      }
      // 确认收货
      if (orderStatus === ORDER_STATUS_MAP.TO_BE_RECEIVED) {
        await confirmOrder({ id });
      }
      this.$emit("operate");
    },
    // 操作
    handleOperate() {
      const that = this;
      uni.showModal({
        title: "提示",
        content: `请确认是否${OPRATE_BTN_TEXT[this.info.orderStatus]}`,
        success: function (res) {
          if (res.confirm) {
            that.operateOrder();
          }
        },
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
      .operateBtnBox {
        text-align: right;
        .operateBtn {
          display: inline-block;
          margin-top: 31rpx;
          border-radius: 8rpx;
          font-size: 24rpx;
          padding: 6rpx 30rpx;
          color: #4d03ff;
          border: 1px solid #4d03ff;
          text-align: center;
        }
      }
    }
  }
}
</style>
