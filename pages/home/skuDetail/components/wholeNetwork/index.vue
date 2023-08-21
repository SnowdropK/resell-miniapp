<template>
  <view class="wholeNetworkBox" :hidden="hidden">
    <view class="title">全网渠道</view>
    <view class="miniProgramBox">
      <view
        class="miniProgram"
        v-for="item in miniProgramList"
        :key="item.id"
        @click="goToMiniProgram(item)"
      >
        <view class="miniProgramInfo">
          <image
            class="miniProgramLogo"
            :src="item.iconUrl || 'https://img-u7ka.oss-cn-beijing.aliyuncs.com/img/web/1/2023-03-19/1679195117931_logo.jpg'"
          />
          <view class="miniProgramName">{{ item.name }} ></view>
        </view>
        <view class="actionBtn">去抽赏</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  name: "WholeNetworkBox",
  props: {
    hidden: {
      type: Boolean,
      required: true,
      defalut: false,
    },
    miniProgramList: {
      type: Array,
      defalut: [],
    },
  },
  data() {
    return {};
  },
  methods: {
    goToMiniProgram(item) {
      uni.navigateToMiniProgram({
        appId: item.appid,
        path: item.shopUrl,
        success(res) {
          // 打开成功
          console.log("打开成功");
        },
      });
    },
  },
};
</script>
<style lang="scss">
.wholeNetworkBox {
  margin-top: 40rpx;

  .title {
    padding-bottom: 16rpx;
  }

  .miniProgramBox {
    padding: 20rpx 20rpx 32rpx;
    border-radius: 24rpx;
    background-color: #fff;

    .miniProgram {
      display: flex;
      justify-content: space-between;
      margin-top: 36rpx;

      .miniProgramInfo {
        display: flex;
        align-items: center;

        .miniProgramLogo {
          width: 70rpx;
          height: 70rpx;
          border-radius: 5rpx;
        }
        .miniProgramName {
          margin-left: 10rpx;
        }
      }

      .actionBtn {
        height: 50rpx;
        padding: 0 14rpx;
        color: #fff;
        font-size: 22rpx;
        line-height: 50rpx;
        border-radius: 14rpx;
        background-color: $uni-bg-color;
      }
    }
  }
}
</style>
