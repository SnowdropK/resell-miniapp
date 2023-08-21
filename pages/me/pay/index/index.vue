<template>
  <view class="">
    <CommonContainer title="收款方式" :showPadding="false">
      <view
        class="item position-relative"
        v-for="(res, index) in siteList"
        :key="res.id"
      >
        <u-swipe-action>
          <u-swipe-action-item :options="options" @click="onDel(res)">
            <view class="swipe-action p-3 rounded-10">
              <view class="top">
                <view class="pay-type d-flex flex-row a-center">
                  <u-icon
                    v-if="res.accountType == 2"
                    name="weixin-circle-fill"
                    color="#00C800"
                    size="30"
                  ></u-icon>
                  <u-icon
                    v-else
                    name="zhifubao-circle-fill"
                    color="#1296db"
                    size="30"
                  ></u-icon>
                </view>
                <view class="name">{{ res.title }}</view>
                <view v-if="res.mainField" class="tag p">
                  <text
                    :class="
                      res.mainField == 1 ? 'main-bg-color tagText' : 'tagText'
                    "
                    >默认</text
                  >
                </view>
              </view>
              <view class="bottom mb">
                <text class="span24-20 text-hide2">
                  收款到{{ res.accountType == 2 ? "微信" : "支付宝" }}
                  {{ getTel(res.account) }}
                </text>
                <u-icon
                  v-if="!res.default"
                  name="edit-pen"
                  :size="32"
                  color="#999999"
                  @click="editAddress(res, 1)"
                ></u-icon>
              </view>
              <!-- <view class="divider"></view> -->
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
      </view>
      <view class="py-5 my-3"></view>
      <view v-if="siteList.length <= 0" class="mt-5">
        <u-empty
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
      </view>

      <view class="bottom-div">
        <view class="addSite" @click="editAddress"> 新增收款方式 </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
// 工具
import { getTel } from "@/utils/index.js";
// service
import { getPays, delPay } from "@/api/myInfo.js";
export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      siteList: [],
      options: [{ text: "删除" }],
    };
  },
  onLoad() {},
  onShow() {
    this.getData();
  },
  methods: {
    async getData() {
      const data = await getPays();
      this.siteList = data || [];
    },
    editAddress(item, i) {
      let data = "";
      if (i) {
        data = JSON.stringify(item);
      }
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/me/pay/edit/index?data=" + data,
        });
      }, 50);
    },
    onDel(v) {
      // console.log(v);
      uni.showModal({
        title: "提示",
        content: "是否删除？",
        cancelText: "取消",
        confirmText: "删除",
        success: async (res) => {
          if (res.confirm) {
            const data = await delPay(v.id);
            uni.showToast({ title: "删除成功" });
            this.getData();
          }
        },
      });
    },
    // 隐藏手机号
    getTel(tel) {
      return getTel(tel);
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 10rpx 0;
  .mainImg {
    width: 50rpx;
    height: 50rpx;
  }
  .top {
    display: flex;
    font-weight: bold;
    font-size: 34rpx;
    .name {
      margin-left: 30rpx;
    }
    .tag {
      display: flex;
      font-weight: normal;
      align-items: center;
      .tagText {
        display: block;
        width: 60rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #ffffff;
        font-size: 20rpx;
        border-radius: 6rpx;
        text-align: center;
        margin-left: 30rpx;
        background-color: rgb(49, 145, 253);
      }
      .red {
        background-color: red;
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;
    color: #999999;
  }
}
.bottom-div {
  display: flex;
  justify-content: space-around;
  width: calc(100% - 52rpx);
  line-height: 90rpx;
  position: absolute;
  bottom: 0rpx;
  padding: 30rpx;
  background-color: #ffffff;
  z-index: 99;
}
.addSite {
  background-color: $uni-bg-color;
  border-radius: 10rpx;
  font-size: 30rpx;
  width: 90%;
  text-align: center;
  color: #ffffff;
}
.divider {
  width: 100%;
  height: 12rpx;
  position: absolute;
  left: 0;
  background: #efefef;
}
</style>
