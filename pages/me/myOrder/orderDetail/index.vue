<template>
  <view class="orderDetailBox">
    <CommonContainer title="订单详情">
      <view class="content">
        <!-- 订单状态 -->
        <view class="orderStatusBox box">
          <view class="title">{{
            ORDER_STATUS_TEXT_MAP[orderDetail.orderStatus] || ""
          }}</view>
          <view class="tip">{{ orderDetail.orderStatusDesc }}</view>
          <view
            v-if="orderDetail.consignee && orderDetail.mobile"
            class="userInfo"
          >
            {{ orderDetail.consignee }}
            {{ orderDetail.mobile }}
          </view>
          <view v-if="orderDetail.address" class="address">
            {{ orderDetail.address }}
          </view>
          <view
            v-if="AGREEMENT_TYPE_MAP[orderDetail.agreementType || '']"
            @click="goToAttachUrl"
          >
            {{
              AGREEMENT_TYPE_MAP[orderDetail.agreementType || ""] ||
              "放原平台赏袋"
            }}
          </view>
        </view>
        <!-- 订单 商品信息 -->
        <view class="skuSumFeeBox">
          <view class="skuInfoBox">
            <image
              class="mainImg"
              mode="aspectFill"
              :src="orderDetail.mainUrl"
            />
            <view class="skuInfo">
              <view class="title">{{ orderDetail.goodsTitle }}</view>
              <view class="feeBox">
                <view style="text-align: right"
                  >￥{{ toYuan(orderDetail.goodsPrice) }}</view
                >
                <view style="text-align: right"
                  >x{{ orderDetail.goodsNum }}</view
                >
              </view>
            </view>
          </view>
          <view class="skuFee">
            <view class="item">
              <view class="left">商品价格</view>
              <view class="right">
                ￥{{ toYuan(orderDetail.goodsPriceAmount) }}
              </view>
            </view>
            <view class="item">
              <view class="left">运费</view>
              <view class="right"
                >¥{{ toYuan(orderDetail.deliveryAmount) }}</view
              >
            </view>
            <view class="item">
              <view class="left sumNum"
                >实付款<text class="tip">（在担保账户中）</text></view
              >
              <view class="right sumPrice">
                ￥<text class="sumPriceText">{{
                  toYuan(orderDetail.goodsPriceAmount)
                }}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 订单信息 -->
        <view class="orderInfoBox box">
          <view class="title">订单信息</view>
          <view class="item">
            订单编号：{{ orderDetail.orderId }}
            <view class="copy" @click="copyOrderId">复制</view>
          </view>
          <view class="item">下单时间：{{ orderDetail.orderCreateTime }}</view>
          <view class="item">支付时间：{{ orderDetail.payTime }}</view>
          <view v-if="orderDetail.orderShipTime" class="item"
            >发货时间：{{ orderDetail.orderShipTime }}</view
          >
          <view v-if="orderDetail.orderDoneTime" class="item"
            >交易完成时间：{{ orderDetail.orderDoneTime }}</view
          >
          <view v-if="orderDetail.refundTime" class="item"
            >退款时间：{{ orderDetail.refundTime }}</view
          >
        </view>
      </view>
    </CommonContainer>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 工具
import { toYuan, accAdd, accSub } from "@/utils";
// 常量
import { ORDER_STATUS_TEXT_MAP, AGREEMENT_TYPE_MAP } from "@/consts";
// servie
import { fetchBuyOrderDetail, fetchSellOrderDetail } from "@/api/me";

export default {
  name: "OrderDetail",
  components: {
    CommonContainer,
  },
  props: {},
  data() {
    return {
      orderType: "",
      orderDetail: {},
      ORDER_STATUS_TEXT_MAP,
      AGREEMENT_TYPE_MAP,
    };
  },
  onLoad(options) {
    const { id = "", orderType } = options;
    this.orderType = orderType;
    this.getOrderDetail(+id);
  },
  methods: {
    toYuan(val) {
      return toYuan(val);
    },
    accAdd(val1 = 0, val2 = 0) {
      return accAdd(val1, val2);
    },
    async getOrderDetail(id) {
      const data =
        this.orderType === "buyOrder"
          ? await fetchBuyOrderDetail({ id })
          : await fetchSellOrderDetail({ id });
      const { orderAmount = 0, deliveryAmount = 0 } = data || {};
      this.orderDetail = {
        ...data,
        // sumGoodsPrice: this.toYuan(accSub(orderAmount, deliveryAmount)),
      };
    },
    // 售卖附件链接
    goToAttachUrl() {
      uni.navigateTo({
        url: `${this.orderDetail.attachUrl}`,
      });
    },
    // 复制订单号
    copyOrderId() {
      const { orderId } = this.orderDetail;
      uni.setClipboardData({
        data: `${orderId}` || "",
      });
    },
  },
};
</script>
<style lang="scss">
.orderDetailBox {
  color: #222222;
  .content {
    // 订单状态
    .orderStatusBox {
      .title {
        font-size: 38rpx;
        font-weight: bold;
      }
      .tip {
        color: #a9a6a6;
      }
      .userInfo {
        margin-top: 10rpx;
        padding-top: 10px;
        border-top: 1px dashed #bbbbbb;
      }
      .address {
        color: #a9a6a6;
      }
    }
    // 订单商品信息
    .skuSumFeeBox {
      margin-top: 24rpx;
      padding: 26rpx 20rpx 38rpx;
      border-radius: 24rpx;
      background-color: #fff;

      .skuInfoBox {
        display: flex;
        padding-bottom: 32rpx;
        border-bottom: 1px dashed #bbbbbb;

        .mainImg {
          width: 176rpx;
          height: 176rpx;
          background-color: $uni-bg-color-grey;
        }

        .skuInfo {
          display: flex;
          justify-content: space-between;
          margin-left: 22rpx;
          width: 450rpx;

          .title {
            font-weight: bold;
            font-size: 26rpx;
            color: #222222;
          }
          .feeBox {
            flex-grow: 1;
            color: #bbbbbb;
          }
        }
      }
      .skuFee {
        margin-top: 34rpx;
        font-size: 28rpx;
        color: #222222;

        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10rpx;

          .right {
            color: #666666;
          }
          .sumNum {
            font-size: 28rpx;
            font-weight: bold;

            .tip {
              font-size: 22rpx;
              color: #a9a6a6;
            }
          }
          .sumPrice {
            font-weight: bold;
            color: #ff3835;
            .sumPriceText {
              font-size: 36rpx;
            }
          }
        }
      }
    }
    .orderInfoBox {
      margin-top: 24rpx;
      padding: 26rpx 20rpx 38rpx;
      border-radius: 24rpx;
      background-color: #fff;

      .title {
        font-size: 34rpx;
        font-weight: bold;
      }
      .item {
        margin-top: 10rpx;
        display: flex;
        align-items: center;

        .copy {
          margin-left: 14rpx;
          display: inline-block;
          width: 70rpx;
          height: 30rpx;
          border-radius: 16rpx;
          font-size: 20rpx;
          text-align: center;
          line-height: 30rpx;
          color: #999;
          border: 1px solid #999;
        }
      }
    }
  }
}
</style>
