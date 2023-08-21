<template>
  <view class="balanceBox">
    <CommonContainer title="余额中心">
      <view class="content">
        <!-- 账户余额 -->
        <view class="sumPriceBox">
          <view>账户余额</view>
          <view class="balanceAmount">
            ￥{{ toYuan(walletInfo.availableAmount) }}
          </view>
          <view class="withdrawal" @click="goToWithdrawal">提现</view>
          <!-- <view class="withdrawal" @click="goToRealName">实名</view> -->
        </view>
        <!-- 列表 -->
        <view class="scrollBox">
          <u-list height="170">
            <view v-for="item in list" :key="item.id" @click.stop="goTo(item)">
              <u-list-item>
                <u-cell
                  :title="`${item.title}${
                    item.id === 1
                      ? `（金额：${toYuan(walletInfo.processAmount)}）`
                      : ''
                  }`"
                >
                  <u-icon
                    slot="icon"
                    :name="item.iconName"
                    color="#2979ff"
                    size="28"
                  />
                </u-cell>
                <view></view>
              </u-list-item>
            </view>
          </u-list>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 工具
import { toYuan } from "@/utils";
// service
import { fetchWalletInfo } from "@/api/me";

export default {
  name: "Balance",
  components: {
    CommonContainer,
  },
  data() {
    return {
      walletInfo: {},
      list: [
        {
          id: 1,
          title: "待入账明细",
          path: "/packageA/me/balance/recorded/index",
          iconName: "order",
        },
        {
          id: 2,
          title: "余额明细",
          iconName: "rmb-circle",
          path: "/packageA/me/balance/balanceDetails/index",
        },
        {
          id: 4,
          title: "银行卡管理",
          iconName: "grid",
          path: "/packageA/me/balance/bankCard/index",
        },
      ],
    };
  },
  onLoad() {
    this.getWalletInfo();
  },
  methods: {
    // 分转元
    toYuan(val = 0) {
      return val ? toYuan(val) : 0;
    },
    // 余额详情
    async getWalletInfo() {
      const data = await fetchWalletInfo();
      this.walletInfo = data || {};
    },
    goTo(item) {
      uni.navigateTo({
        url: item.path,
      });
    },
    // 提现
    goToWithdrawal() {
      uni.navigateTo({
        url: "/packageA/me/balance/withdrawal/index",
      });
    },
    goToRealName() {
      uni.navigateTo({
        url: "/packageA/me/balance/openAccount/index",
      });
    },
  },
};
</script>

<style lang="scss">
.balanceBox {
  .content {
    .sumPriceBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-radius: 20rpx;
      height: 300rpx;
      background-color: #fff;

      .balanceAmount {
        font-size: 50rpx;
        font-weight: bold;
      }

      .withdrawal {
        margin-top: 40rpx;
        width: 70%;
        height: 60rpx;
        border-radius: 8rpx;
        color: #fff;
        line-height: 60rpx;
        text-align: center;
        background-color: $uni-bg-color;
      }
    }
    .scrollBox {
      margin-top: 26rpx;
      padding: 30rpx 20rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
  }
}
</style>
