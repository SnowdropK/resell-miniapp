<template>
  <view class="cashierContainer">
    <CommonContainer title="收银台">
      <view class="content">
        <view class="totalAmountBox">￥{{ toYuan(totalAmount) }}</view>
        <view class="payListBox">
          <view
            class="payItem"
            v-for="item in payList"
            :key="item.id"
            @click="pickPay(item.key)"
          >
            <u-icon :name="item.icon" :color="item.color" size="32" />
            <view class="payTitle">
              {{ item.title }}
              {{
                item.key === PAY_WAY.BALANCE
                  ? walletInfo.balanceFlag
                    ? `：￥${toYuan(walletInfo.availableAmount) || 0}`
                    : "（未开通）"
                  : ""
              }}
              <block
                v-if="
                  item.key === PAY_WAY.BALANCE &&
                  walletInfo.availableAmount < totalAmount
                "
              >
                （余额不足）
              </block>
            </view>
            <u-icon
              v-if="
                (item.key !== PAY_WAY.BALANCE || walletInfo.balanceFlag) &&
                item.key !== PAY_WAY.WECHAT_MINI
              "
              :name="
                item.key === currentPayWay
                  ? 'checkmark-circle-fill'
                  : 'checkmark-circle'
              "
              :color="themeColor"
              size="22"
            />
          </view>
        </view>
        <view class="submitBox">
          <view class="submitBtn" @click="handleCreateOrder">确认支付</view>
        </view>
      </view>
    </CommonContainer>
    <!-- 二维码弹窗 -->
    <QrCodeModal
      v-if="showQrCodeModal"
      :val="qrCodeUrl"
      @close="closeQrCodeModal"
    />
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 自定义业务组件
import QrCodeModal from "./components/qrCodeModal";
// 常量
import { themeColor } from "@/config/theme";
import { ORDER_TYPE, ORDER_STATUS, PAY_WAY } from "@/consts";
// 工具
import { toYuan, accAdd, getStorage, removeStorage } from "@/utils";
// service
import {
  fetchGoodsDetail,
  createOrder,
  fetchCreateOrderDetail,
} from "@/api/home";
import { fetchWalletInfo } from "@/api/me";

let timer = null;

export default {
  components: {
    CommonContainer,
    QrCodeModal,
  },
  data() {
    return {
      themeColor,
      PAY_WAY,
      currentPayWay: null,
      totalAmount: 0,
      qrCodeUrl: "",
      showQrCodeModal: false,
      walletInfo: {
        balanceFlag: false,
      },
      // 支付方式
      payList: [
        {
          id: 1,
          key: PAY_WAY.BALANCE,
          title: "可用余额",
          icon: "rmb-circle",
          color: "#d98201",
        },
        {
          id: 2,
          key: PAY_WAY.ALIPAY,
          title: "支付宝支付",
          icon: "zhifubao-circle-fill",
          color: "#03a1e9",
        },
        {
          id: 3,
          key: PAY_WAY.WECHAT_MINI,
          title: "微信支付（暂未开通）",
          icon: "weixin-circle-fill",
          color: "#03bf17",
        },
      ],
    };
  },
  onLoad(options) {
    const { totalAmount } = options;
    this.totalAmount = +totalAmount;
    this.getWalletInfo();
  },
  onUnload() {
    clearInterval(timer);
    removeStorage("createOrderParams");
  },
  onShow() {},
  methods: {
    toYuan(val = 0) {
      return val ? toYuan(val) : 0;
    },
    // 余额详情
    async getWalletInfo() {
      const data = await fetchWalletInfo();
      this.walletInfo = data || {};
    },
    // 选择支付方式
    pickPay(key) {
      if (key === PAY_WAY.BALANCE && !this.walletInfo.balanceFlag) return;
      if (key === PAY_WAY.WECHAT_MINI) return;
      this.currentPayWay = key;
    },
    // 关闭弹窗
    closeQrCodeModal() {
      this.showQrCodeModal = false;
      clearInterval(timer);
      // uni.navigateBack({
      //   delta: 2,
      // });
    },
    // 获取支付宝订单支付详情
    async getCreateOrderDetail(orderId) {
      const { orderStatus } = await fetchCreateOrderDetail({ orderId });
      if (orderStatus === ORDER_STATUS.PAY_SUCCESS) {
        uni.showToast({
          title: "支付成功",
          icon: "none",
        });
        this.closeQrCodeModal();
        uni.showModal({
          title: "提示",
          content: `支付宝支付成功`,
          showCancel: false,
          confirmText: "知道了",
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack({
                delta: 2,
              });
            }
          },
        });
      }
      if (orderStatus === ORDER_STATUS.INSUFFICIENT_MARGIN) {
        uni.showToast({
          title: "库存不足",
          icon: "none",
        });
        this.closeQrCodeModal();
      }
    },
    // 初始化轮询
    initCreateOrderDetail(orderId) {
      this.getCreateOrderDetail(orderId);
      timer = setInterval(() => {
        this.getCreateOrderDetail(orderId);
      }, 1500);
    },
    // 创建订单：接口
    async createOrder() {
      uni.showLoading({
        title: "加载中",
      });
      try {
        const params = getStorage("createOrderParams") || {};
        params.payWay = this.currentPayWay;
        const {
          id: orderId,
          payOrderResp,
          amountTransferResp,
        } = await createOrder(params);
        // 支付宝
        if (params.payWay === PAY_WAY.ALIPAY) {
          const { qrCode } = payOrderResp || {};
          this.qrCodeUrl = qrCode || "";
          // 显示收款弹窗
          this.showQrCodeModal = true;
          this.initCreateOrderDetail(orderId);
        }
        // 余额
        if (params.payWay === PAY_WAY.BALANCE) {
          uni.showModal({
            title: "提示",
            content: `余额支付成功`,
            showCancel: false,
            confirmText: "知道了",
            success: (res) => {
              if (res.confirm) {
                uni.navigateBack({
                  delta: 2,
                });
              }
            },
          });
        }
      } catch {
        uni.showToast({
          title: "报错了",
          icon: "error",
        });
      } finally {
        uni.hideLoading();
      }
    },
    // 创建订单
    handleCreateOrder() {
      if (!this.currentPayWay) {
        uni.showModal({
          title: "提示",
          showCancel: false,
          confirmText: "知道了",
          content: `请选择支付方式`,
        });
        return;
      }
      uni.showModal({
        title: "提示",
        content: `是否使用该支付方式支付！`,
        success: (res) => {
          if (res.confirm) {
            this.createOrder();
          }
        },
      });
    },
    /**
     * 调用微信支付
     */
    // openWxPay(info) {
    //   // console.log(info)
    //   let that = this;
    //   // console.log(paySign)
    //   uni.requestPayment({
    //     timeStamp: info.timeStamp + "",
    //     nonceStr: info.nonceStr,
    //     package: "prepay_id=" + info.prepayId,
    //     signType: info.signType,
    //     paySign: info.paySign,
    //     success(res) {
    //       // console.log(res)
    //       if (res.errMsg === "requestPayment:ok") {
    //         that.confirmPayOrder(info);
    //       } else {
    //         wx.showToast({
    //           title: "支付失败",
    //           icon: "none",
    //         });
    //         that.closeOrder(info);
    //       }
    //     },
    //     fail(res) {
    //       uni.showToast({
    //         title: "支付失败",
    //         icon: "none",
    //       });
    //       that.closeOrder(info);
    //       // console.log(res)
    //     },
    //   });
    // },
  },
};
</script>
<style lang="scss">
.cashierContainer {
  .content {
    padding: 20rpx;
    border-radius: 24rpx;
    background-color: #fff;

    .totalAmountBox {
      display: flex;
      justify-content: center;
      font-size: 70rpx;
      font-weight: bold;
    }
    .payListBox {
      padding: 10rpx 20rpx 30rpx;

      .payItem {
        display: flex;
        align-items: center;
        padding: 10rpx 0;
        border-bottom: 1px solid #eee;

        .payTitle {
          margin-left: 18rpx;
          flex: 1;
        }
      }
    }
    .submitBox {
      margin-top: 30rpx;
      display: flex;
      justify-content: center;

      .submitBtn {
        width: 100%;
        height: 80rpx;
        color: #fff;
        font-weight: bold;
        line-height: 80rpx;
        border-radius: 40rpx;
        text-align: center;
        background-color: $uni-bg-color;
      }
    }
  }
}
</style>
