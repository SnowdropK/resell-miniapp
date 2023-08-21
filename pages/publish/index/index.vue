<template>
  <view class="publishContainer">
    <CommonContainer title="发布" :showBack="false">
      <view class="content">
        <!-- 闲置数量图片 -->
        <view class="publishBgBox">
          <image src="@/static/images/bgs/publishBg.png" mode="aspectFit" />
          <view class="leaveUnused">{{ platConfig.saleNum }}</view>
        </view>
        <!-- 转卖 -->
        <view class="resellBox" @click="goToRsellPlats">
          <image class="resellImg" src="@/static/images/bgs/giftBg.png" />
          <view class="tipBox">
            <view>一键转卖</view>
            <view class="tipTitle">赏袋转卖赚钱</view>
          </view>
          <u-icon name="arrow-right" size="28"></u-icon>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// service
import { fetchPlatConfig } from "@/api/common";

export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      platConfig: {},
    };
  },
  onLoad() {
    this.fetchPlatConfig();
  },
  methods: {
    async fetchPlatConfig() {
      const data = await fetchPlatConfig();
      this.platConfig = data;
    },
    goToRsellPlats() {
      uni.navigateTo({
        url: `/pages/publish/resellPlats/index`,
      });
    },
  },
};
</script>

<style lang="scss">
.publishContainer {
  .content {
    .publishBgBox {
      position: relative;
      top: -70rpx;

      .leaveUnused {
        position: absolute;
        left: 42rpx;
        bottom: 130rpx;
        font-size: 60rpx;
        font-weight: bold;
      }
    }
    .resellBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -80rpx;
      padding: 64rpx 40rpx 64rpx 30rpx;
      border-radius: 24rpx;
      background-color: #fff;

      .resellImg {
        width: 106rpx;
        height: 110rpx;
        background-color: $uni-bg-color-grey;
      }
      .tipBox {
        margin-left: 46rpx;
        flex-grow: 1;
        color: #333333;
        font-size: 36rpx;
        font-weight: bold;

        .tipTitle {
          margin-top: 10rpx;
          font-size: 28rpx;
          color: #c2c2c2;
          font-weight: normal;
        }
      }
    }
  }
}
</style>
