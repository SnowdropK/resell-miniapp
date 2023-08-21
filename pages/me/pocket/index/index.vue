<template>
  <view class="pocket-index">
    <CommonContainer title="赏袋">
      <view v-if="!empower" class="pocket-box">
        <view class="">申请授权后，可以看到赏袋商品</view>
        <view class="pocket-login" @click="goToMiniProgram">
          前往小程序授权
        </view>
      </view>
      <view v-else class="pocket-list">
        <o-collapse
          v-if="key"
          :item-style="itemStyle"
          event-type="close"
          :arrow="arrow"
          :accordion="accordion"
          @change="change"
        >
          <o-collapse-item
            ref="collapse"
            :change-value="changeValue"
            v-for="(item, index) in bagSkuList"
            :key="index"
            :index="index"
            :title="item.goodsName"
            @change="itemChange(item, index)"
          >
            <view slot="value" class="font-sm"
              >共<text class="text-color">{{ item.showNumber || 0 }}</text
              >个赏品</view
            >
            <view class="u-collapse-content d-flex flex-row flex-wrap">
              <view
                v-if="skuIpMap[item.goodsId]"
                class="collapse-item"
                v-for="(item2, index2) in skuIpMap[item.goodsId]"
                :key="index2"
              >
                <view class="position-relative img-box">
                  <image
                    class="pocket-img"
                    :src="item2.rewardImage"
                    mode="aspectFill"
                  />
                  <view class="bg-main">{{ item2.number }}</view>
                </view>
                <view class="text-hide py-1 font"
                  ><text class="mr-2">{{ item2.rewardType }}</text
                  >{{ item2.rewardName }}</view
                >
                <view class="main-text-color font-sm"
                  >出货时间：<text v-if="!item2.deliveryTime">-</text></view
                >
                <view
                  v-if="item2.deliveryTime"
                  class="main-text-color font-sm text-hide"
                  >{{ item2.deliveryTime.split(" ")[0] }}</view
                >
                <view class="main-text-color font-sm text-hide"
                  >建议价：{{ toYuan(item2.retrievePrice) || "-" }}</view
                >
              </view>
            </view>
          </o-collapse-item>
        </o-collapse>
      </view>
      <!-- 底部 -->
      <view
        class="bottom position-absolute left-0 right-0 shadow bg-white"
        :class="isIOSClass ? 'iosClass' : 'andClass'"
      >
        <view class="button shadow" @click="onList">正在出售</view>
        <view class="button shadow" @click="resellGoods"> 我要转卖</view>
        <view class="button shadow" @click="onPlats">申请发货</view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
import OCollapse from "@/components/uni-ui/u-collapse/u-collapse.vue";
import OCollapseItem from "@/components/uni-ui/u-collapse-item/u-collapse-item.vue";
// 工具
import { toYuan, accAdd, accMul, accDiv } from "@/utils";
// 常量
import { themeColor } from "@/config/theme";
// service
import {
  fetchBagDetail,
  fetchBagSkuIpList,
  fetchBagSkuList,
  bagGroupIp,
  bagListInIp,
} from "@/api/myInfo.js";
import { talentBind } from "@/api/common";

export default {
  components: {
    CommonContainer,
    OCollapse,
    OCollapseItem,
  },
  data() {
    return {
      platsId: "", // 平台id
      platsInfo: {},
      empower: false, // 是否授权过
      themeColor: themeColor,
      bagSkuList: [],
      skuIpMap: {},
      totalNumber: 0,
      key: true,
      collapseList: [],
      itemStyle: {},
      accordion: true,
      arrow: true,
      changeValue: -1,
      isIOSClass: false,
    };
  },
  onLoad(e) {
    this.platsId = e.id || "";
    this.isIOS();

    const bindCode = uni.getStorageSync("weChatBindCode");
    const bindOpenId = uni.getStorageSync("weChatBindOpenId");
    if (bindCode && bindOpenId) {
      this.bind(bindCode, bindOpenId);
      return;
    }
    this.getPlatsInfo();
  },
  onShow() {},
  onUnload() {
    uni.removeStorageSync("weChatBindCode");
    uni.removeStorageSync("weChatBindOpenId");
  },
  methods: {
    // 获取平台售卖信息
    async getPlatsInfo() {
      const data = await fetchBagDetail({ id: this.platsId });
      this.platsInfo = data || {};
      // console.log(data);
      if (data && data.bind) {
        this.empower = data.bind;
      }
      this.bagGroupIp();
    },
    // ip列表
    async bagGroupIp() {
      const data = await bagGroupIp({ talentId: this.platsId });
      let totalNumber = 0;
      (data || []).forEach((item) => {
        totalNumber = accAdd(totalNumber, item.showNumber);
        // this.bagListInIp(item.goodsId, data);
        this.bagSkuList = data;
      });
      this.totalNumber = totalNumber;
    },
    itemChange(e, i) {
      // console.log(e, i);
      this.bagListInIp(e.goodsId, i);
    },
    // ip下的商品列表
    async bagListInIp(id, i) {
      // id, bagSkuList = []
      // console.log(id);
      const data = await bagListInIp({ goodsId: id, talentId: this.platsId });
      this.skuIpMap[id] = (data || []).map((item) => {
        item.price = null;
        item.key = `${item.goodsId}${item.rewardType}`;
        return item;
      });
      this.$nextTick(() => {
        this.$refs.collapse[i].queryRect();
      });
      this.changeValue = i;
      // console.log(Object.keys(this.skuIpMap));
    },
    change(index) {
      let str = "";
      if (Array.isArray(index)) {
        let arr = index.map((val) => {
          return Number(val) + 1;
        });
        index = arr.join(",");
      } else {
        index = Number(index) + 1;
      }
      console.log(`点击了第${index}个`);
    },
    // 跳转出售列表
    onList() {
      uni.navigateTo({
        url: "/pages/me/pocket/sale/index",
      });
    },
    // 去转卖列表
    resellGoods() {
      uni.navigateTo({
        url: "/pages/publish/resellGoods/index?id=" + this.platsId,
      });
    },
    // 绑定
    async bind(bindCode, openid) {
      await talentBind({ bindCode, openid, talendId: this.platsId });
      uni.showToast({
        title: "小程序绑定成功",
        icon: "none",
        duration: 2000,
      });
      uni.removeStorageSync("weChatBindCode");
      uni.removeStorageSync("weChatBindOpenId");
      this.getPlatsInfo();
    },
    goToMiniProgram() {
      this.getPlatsInfo();
      if (!this.empower) {
        uni.openEmbeddedMiniProgram({
          appId: this.platsInfo.appid || "",
          path: `${
            this.platsInfo.bindUrl || ""
          }?weChatSource=free-transaction-miniapp`,
          // develop（开发版），trial（体验版），release（正式版）
          envVersion:
            process.env.NODE_ENV === "production" ? "release" : "trial",
          // extraData: {
          //   weChatSource: "free-transaction-miniapp",
          // },
        });
        return;
      }
      // uni.navigateTo({
      //   url: `/pages/publish/resellGoods/index?id=${this.platsId}`,
      // });
    },
    // 跳转对应平台
    onPlats() {
      // this.platsInfo
      // #ifdef MP-WEIXIN
      uni.navigateToMiniProgram({
        appId: this.platsInfo.appid,
        path: this.platsInfo.bindUrl,
        success(res) {
          // 打开成功
          console.log(res);
        },
      });
      // #endif
      // #ifdef H5
      uni.showToast({
        title: "暂不支持此功能，请前往微信小程序",
        icon: "none",
      });
      // #endif
      // app的还没写
      // #ifndef APP-PLUS
      //
      // #endif
    },
    toYuan(val) {
      return toYuan(val);
    },
    styleChange(index) {
      if (index == 0) {
        this.itemStyle = {
          border: "1px solid rgb(230, 230, 230)",
          marginTop: "20px",
          padding: "0 8rpx",
        };
      } else {
        this.itemStyle = {};
      }
      this.changeStatus();
    },
    // 判断系统
    isIOS() {
      switch (uni.getSystemInfoSync().platform) {
        case "android":
          this.isIOSClass = false;
          break;
        case "ios":
          this.isIOSClass = true;
          break;
        default:
          this.isIOSClass = false;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.pocket-index {
  ::v-deep {
    .u-collapse-item__content__text {
      padding: 0 30rpx;
    }
  }
  .pocket-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    font-size: 29rpx;
    height: 60vh;
    .pocket-login {
      width: 300rpx;
      margin-top: 30rpx;
      padding: 10rpx 20rpx;
      border-radius: 40rpx;
      text-align: center;
      font-size: 30rpx;
      color: #ffffff;
      background-color: $uni-bg-color;
    }
  }
  .pocket-list {
    padding-bottom: 55rpx;
    .collapse-item {
      display: flex;
      flex-direction: column;
      width: 25%;
      margin-bottom: 20rpx;
    }
    .text-color {
      margin: 0 5rpx;
      font-size: 32rpx;
      color: $uni-color-primary;
      letter-spacing: 3rpx;
    }
    .pocket-img {
      width: 140rpx;
      height: 140rpx;
    }
    .img-box {
      width: 140rpx;
      height: 140rpx;
    }
    .bg-main {
      position: absolute;
      top: 0;
      right: 0;
      width: 80rpx;
      height: 30rpx;
      line-height: 30rpx;
      text-align: center;
      color: #ffffff;
      font-size: 24rpx;
      border-radius: 0 0 0 30rpx;
      background-color: $uni-bg-color;

      // border-top: 40rpx solid $uni-bg-color;
      // border-left: 40rpx solid transparent;
    }
  }
  .andClass {
    padding: 25rpx 20rpx;
  }
  .iosClass {
    padding: 25rpx 20rpx 50rpx;
  }
  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    bottom: 0;
    .button {
      width: 30%;
      border-radius: 10rpx;
      text-align: center;
      color: #ffffff;
      background-color: $uni-bg-color;
      padding: 10rpx 5rpx;
    }
    // .button:hover {
    // 	background-color: #6c22ff;
    // }
  }
}
</style>
