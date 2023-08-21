<template>
  <view class="resellSuccessBox">
    <CommonContainer title="提示">
      <view class="content">
        <view class="successBox">
          <view class="successTipBox">
            <u-icon name="checkmark-circle-fill" color="#4cd964" size="64" />
            <text class="successText">转卖成功</text>
          </view>
          <view style="margin-top: 100rpx">
            <Banner />
          </view>
          <view style="margin-top: 100rpx">
            <u-button
              type="primary"
              shape="circle"
              :plain="true"
              text="回到首页"
              @click="goToIndex"
            ></u-button>
          </view>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import Banner from "@/components/banner";
// 常量
import { themeColor } from "config/theme";

export default {
  name: "ResellSuccess",
  components: {
    CommonContainer,
    Banner,
  },
  props: {},
  data() {
    return {
      themeColor,
    };
  },
  methods: {
    goToIndex() {
      uni.switchTab({
        url: "/pages/home/index/index",
      });
    },
  },
};
</script>
<style lang="scss">
.resellSuccessBox {
  .content {
    .successBox {
      margin-top: 110rpx;
      padding-bottom: 150rpx;

      .successTipBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 80rpx;
        .successText {
          margin-top: 20rpx;
          font-size: 38rpx;
        }
      }
    }
  }
}
</style>
