<template>
  <view class="resellPlatsContainer">
    <CommonContainer title="选择转卖平台">
      <view class="content">
        <template v-if="plats.length > 0">
          <view v-for="item in plats" :key="item.id">
            <PlatBag
              :info="item"
              :isLogin="isLogin"
              @clickPlatBag="getCurrent"
            />
          </view>
        </template>
        <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 自定义业务组件
import PlatBag from "./components/platBag";
// utils
import { getToken } from "@/utils/auth";
// service
import { fetchBagList } from "@/api/publish";
import { talentBind } from "@/api/common";

export default {
  name: "ResellPlats",
  components: {
    CommonContainer,
    PlatBag,
  },
  data() {
    return {
      plats: [],
      currentPlatBag: {},
      isLogin: true,
      // bindCode: "",
      // bindOpenId: "",
    };
  },
  onLoad() {
    this.getBagList();
  },
  onUnload() {
    uni.removeStorageSync("weChatBindCode");
    uni.removeStorageSync("weChatBindOpenId");
  },
  onShow() {
    this.isLogin = !!getToken();
    const bindCode = uni.getStorageSync("weChatBindCode");
    const bindOpenId = uni.getStorageSync("weChatBindOpenId");
    if (bindCode && bindOpenId) {
      this.bind(bindCode, bindOpenId);
    }
  },
  methods: {
    async bind(bindCode, openid) {
      await talentBind({ bindCode, openid, talendId: this.currentPlatBag.id });
      uni.showToast({
        title: "小程序绑定成功",
        icon: "none",
        duration: 2000,
      });
      uni.removeStorageSync("weChatBindCode");
      uni.removeStorageSync("weChatBindOpenId");
      this.getBagList();
    },
    // 平台赏袋
    async getBagList() {
      const data = await fetchBagList();
      this.plats = data || [];
    },
    getCurrent(val) {
      this.currentPlatBag = val;
    },
  },
};
</script>
<style lang="scss"></style>
