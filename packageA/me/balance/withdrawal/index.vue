<template>
  <view class="withdrawalContainer">
    <CommonContainer title="提现">
      <view class="content">
        <view class="withdrawalBox">
          <view class="pickBankCard" @click="goToBankCard">
            <view v-if="!currentCardId">请选择提现银行卡</view>
            <view v-else>提现至银行卡：{{ currentBankNo || "" }}</view>
            <view>></view>
          </view>
          <view style="margin-top: 32rpx">
            <view>提现金额</view>
            <view class="withdrawalInputBox">
              <view style="font-size: 48rpx; font-weight: bold">￥</view>
              <u--input
                v-model="amountYuan"
                placeholder="提现金额"
                clearable
                border="surround"
                type="digit"
                @change="priceBlur"
              ></u--input>
            </view>
            <view class="withdrawalTipBox">
              <view class="withdrawalTip">
                可提现余额{{ toYuan(availableAmount) }}元，少于1元无法提现
                应监管要求此渠道每日提现额度最高3000元
              </view>
              <view class="allWithdrawal" @click="allWithdrawal">全部提现</view>
            </view>
          </view>
        </view>
        <view class="saveBtnBox">
          <view class="saveBtn" @click="handleWithdrawal">确认提现</view>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 工具
import { toYuan, accMul, accDiv, toFixed } from "@/utils";
// service
import { fetchWithdraw, fetchWalletInfo, fetchBankList } from "@/api/me";

export default {
  name: "Withdrawal",
  components: {
    CommonContainer,
  },
  data() {
    return {
      params: {
        amountFen: null,
        cardId: "",
      },
      availableAmount: 0,
      amountYuan: null,
      currentCardId: "",
      currentBankNo: "",
    };
  },
  onShow() {
    uni.$on("returnBankCardData", (data) => {
      if (data) {
        uni.$off("returnBankCardData", this.returnBankCardData);
        this.currentCardId = data.currentCardId || "";
        this.currentBankNo = data.currentBankNo || "";
        this.params.cardId = data.currentCardId || "";
      }
    });
  },
  onLoad() {
    this.getWalletInfo();
    this.getBankCardList();
  },
  methods: {
    toYuan(val) {
      return toYuan(val);
    },
    async getBankCardList() {
      const data = await fetchBankList();
      const defaultBankCard = (data || [])[0] || {};
      const { id, bankNo } = defaultBankCard;
      this.currentCardId = id || "";
      this.currentBankNo = bankNo || "";
      this.params.cardId = id || "";
    },
    // 余额详情
    async getWalletInfo() {
      const data = await fetchWalletInfo();
      const { availableAmount } = data || {};
      this.availableAmount = availableAmount || 0;
    },
    priceBlur(val = 0) {
      //单有个坑爹的地方，检测到前后两次的值相同就不会进行渲染
      // 四舍五入后要是和输入前值一样，就不会渲染，导致显示和赋值不一样
      // 所以要先进行两次渲染
      this.amountYuan = +val;
      setTimeout(() => {
        const amountYuan = toFixed(+val, 2);
        this.amountYuan = amountYuan;
        this.params.amountFen = accMul(amountYuan, 100);
      }, 100);
    },
    goToBankCard() {
      uni.navigateTo({
        url: `/packageA/me/balance/bankCard/index?chooseBankCard=1&currentCardId=${
          this.currentCardId || ""
        }`,
      });
    },
    // 全部提现
    allWithdrawal() {
      this.amountYuan = accDiv(this.availableAmount, 100);
      this.params.amountFen = this.availableAmount;
    },
    async getWithdraw() {
      try {
        await fetchWithdraw(this.params);
        uni.showModal({
          title: "提示",
          content: `提现申请已提交，预计下一个工作日到账，请耐心等候！`,
          showCancel: false,
          confirmText: "知道了",
          success: (res) => {
            if (res.confirm) {
              uni.navigateBack();
            }
          },
        });
      } catch {
        uni.showToast({
          title: "出错了！",
          icon: "error",
          duration: 2000,
        });
      }
    },
    // 确认提现
    handleWithdrawal() {
      if (+this.params.amountFen < 100) {
        uni.showToast({
          title: "少于1元无法提现！",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (!this.params.amountFen) {
        uni.showToast({
          title: "请输入提现金额！",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      this.getWithdraw();
    },
  },
};
</script>

<style lang="scss">
.withdrawalContainer {
  .content {
    .withdrawalBox {
      margin-top: 10rpx;
      padding: 10rpx 30rpx;
      border-radius: 10rpx;
      background-color: #fff;

      .pickBankCard {
        display: flex;
        justify-content: space-between;
        padding: 30rpx 0 20rpx;
        border-bottom: 1px dashed #999;
      }
      .withdrawalInputBox {
        display: flex;
        // align-items: center;
        padding-top: 20rpx;
      }
      .withdrawalTipBox {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .withdrawalTip {
          width: 500rpx;
          font-size: 22rpx;
          color: #999;
        }
        .allWithdrawal {
          color: #2979ff;
        }
      }
    }
    .saveBtnBox {
      margin-top: 40rpx;
      text-align: center;

      .saveBtn {
        display: inline-block;
        width: 80%;
        padding: 10rpx 30rpx;
        border-radius: 10rpx;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        background-color: $uni-bg-color;
      }
    }
  }
}
</style>
