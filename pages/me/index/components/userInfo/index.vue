<template>
  <view class="userInfoBox">
    <view class="userInfo" @click="goToPersonal">
      <view class="avatorBox">
        <image
          class="avatorImg"
          mode="aspectFill"
          :src="info.avatarUrl || '/static/images/bgs/avator.png'"
        />
        <view class="userNameBox text-hide">
          <view class="text-hide" @click="handleLogin">
            {{ isLogin ? info.nickname || "用户昵称" : "请登录" }}
          </view>
          <view v-if="info.id" class="userId text-hide" @click.stop="getOpenId">
            ID：{{ info.id }}
          </view>
        </view>
      </view>
      <view class="homepage">个人主页</view>
    </view>
    <view class="userData">
      <view class="infoData balance" @click="goToBalance">
        <view class="num">
          {{ toYuan(walletInfo.availableAmount) || 0 }}
        </view>
        <view clas="numType">
          余额<block v-if="!walletInfo.balanceFlag">（未开通）</block>
        </view>
      </view>
      <view class="infoData" @click="goToCollet">
        <view class="num">{{ info.followNum || 0 }}</view>
        <view clas="numType">收藏</view>
      </view>
    </view>
  </view>
</template>

<script>
// 工具
import { toYuan } from "@/utils";
// service
import { login } from "@/api/me";

export default {
  components: {},
  props: {
    info: {
      type: Object,
      required: true,
      default: {},
    },
    walletInfo: {
      type: Object,
      required: true,
      default: {},
    },
    isLogin: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 分转元
    toYuan(val = 0) {
      return toYuan(val || 0);
    },
    handleLogin() {
      if (this.isLogin) return;
      uni.navigateTo({
        url: "",
      });
    },
    // 前往个人中心
    goToPersonal() {
      uni.navigateTo({
        url: "/packageA/me/personal/index",
      });
    },
    // 剪贴板：获取openId
    getOpenId() {
      uni.setClipboardData({
        data: this.info.id || "",
        // success: function () {
        //   console.log("success");
        // },
      });
    },
    // 收藏列表
    goToCollet() {
      uni.navigateTo({
        url: "/pages/me/collect/index",
      });
    },
    // 余额中心
    goToBalance() {
      if (this.walletInfo.balanceFlag) {
        uni.navigateTo({
          url: "/packageA/me/balance/index",
        });
      } else {
        uni.navigateTo({
          url: "/packageA/me/balance/openAccount/index",
        });
      }
    },
  },
};
</script>

<style lang="scss">
.userInfoBox {
  .userInfo {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .avatorBox {
      display: flex;
      align-items: center;

      .avatorImg {
        width: 124rpx;
        height: 124rpx;
        border-radius: 62rpx;
      }

      .userNameBox {
        margin-left: 24rpx;
        width: 280rpx;
        font-size: 32rpx;
        color: #333333;

        .userId {
          font-size: 24rpx;
          color: #6d6d6d;
        }
      }
    }
    .homepage {
      width: 144rpx;
      height: 52rpx;
      border-radius: 26rpx;
      font-size: 24rpx;
      color: #fff;
      text-align: center;
      line-height: 52rpx;
      background-color: #4d03ff;
    }
  }
  .userData {
    margin-top: 20rpx;
    display: flex;
    justify-content: space-between;
    padding: 0 60rpx;

    .balance {
      margin-right: 20rpx;
    }

    .infoData {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .num {
      font-size: 48rpx;
      font-weight: bold;
    }
    .numType {
      color: $uni-text-color-grey;
    }
  }
}
</style>
