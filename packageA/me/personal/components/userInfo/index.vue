<template>
  <view class="userInfoBox">
    <view class="userInfo">
      <view class="avatorBox span24-18">
        <image
          class="avatorImg"
          mode="aspectFill"
          :src="userInfo.avatarUrl || '/static/images/bgs/avator.png'"
        />
        <view class="userNameBox span24-15 text-hide">
          <view>{{ userInfo.nickname || "用户昵称" }}</view>
          <view class="userId text-hide">ID：{{ userInfo.id || "-" }}</view>
        </view>
      </view>
      <view class="right">
        <!-- <u-image src="/static/images/my/share.png" width="52rpx" height="48rpx" @click="onShare"></u-image> -->
        <image
          v-if="!userId"
          class="mainImg ml-auto"
          src="@/static/images/my/edit.png"
          @click="onEdit"
        />
      </view>
    </view>
    <view class="text-muted py-3">
      <view class="">{{ userInfo.desc }}</view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    userInfo: {
      type: [Object, String],
      default: {},
    },
    // 存在则为查看别人的
    userId: {
      type: [String],
      default: "",
    },
  },
  data() {
    return {};
  },
  onLoad() {},
  // #ifdef MP-WEIXIN
  onShareAppMessage(res) {
    console.log(res);
    if (res.from === "button") {
      console.log(res.target);
    }
    return {
      title: "个人主页",
      path: "/pages/test/test?id=123",
    };
  },
  // #endif
  methods: {
    onShare() {
      uni.$u.mpShare = {
        title: "个人主页1",
        // path: '',
        // 分享图标，路径可以是本地文件路径、代码包文件路径或者网络图片路径。 支持PNG及JPG，默认为当前页面的截图
        // imageUrl: ''
      };
    },
    onEdit() {
      uni.navigateTo({
        url: "/packageA/me/editInfo/index?ifEdit=1",
      });
    },
  },
};
</script>

<style lang="scss">
.userInfoBox {
  .mainImg {
    width: 48rpx;
    height: 48rpx;
  }
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
        font-size: 32rpx;
        color: #333333;

        .userId {
          font-size: 24rpx;
          color: #6d6d6d;
        }
      }
    }
    .right {
      display: flex;
      justify-content: space-between;
      width: 144rpx;
      height: 52rpx;
      border-radius: 26rpx;
      font-size: 24rpx;
      color: #fff;
      text-align: center;
      line-height: 52rpx;
    }
  }
}
</style>
