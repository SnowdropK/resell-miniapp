<template>
  <view class="meContainer">
    <CommonContainer title="我的" :showBack="false">
      <view class="content">
        <!-- 个人中心头像、昵称等信息 -->
        <UserInfo
          :info="avatorInfo"
          :walletInfo="walletInfo"
          :isLogin="isLogin"
        />
        <!-- 我的交易 -->
        <view class="grid">
          <Grid title="我的交易" :list="TransactionList" />
        </view>
        <!-- 赏袋 -->
        <view v-if="rewardBagList.length" class="grid">
          <Grid title="赏袋" :isBag="true" :list="rewardBagList" />
        </view>
        <!-- 服务中心 -->
        <view class="grid">
          <Grid title="服务中心" :list="serviceList" />
        </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 自定义业务组件
import UserInfo from "./components/userInfo";
import Grid from "./components/grid";
// utils
import { getToken, setUserInfo } from "@/utils/auth";
// service
import { fetchBagList, fetchUserDetail, fetchWalletInfo } from "@/api/me";

export default {
  components: {
    CommonContainer,
    UserInfo,
    Grid,
  },
  data() {
    return {
      avatorInfo: {},
      walletInfo: {
        balanceFlag: false,
      },
      rewardBagList: [],
      TransactionList: [
        {
          id: 1,
          title: "我卖出的",
          icon: "rmb-circle-fill",
          path: "/pages/me/myOrder/mySell/index",
        },
        {
          id: 2,
          title: "我买到的",
          icon: "order",
          path: "/pages/me/myOrder/myBuy/index",
        },
      ],
      serviceList: [
        {
          id: 1,
          title: "设置",
          icon: "setting-fill",
          path: "/packageA/me/editInfo/index",
        },
        {
          id: 2,
          title: "帮助",
          icon: "file-text-fill",
          path: "/pages/me/helps/index/index",
        },
        { id: 3, title: "客服", icon: "server-man", path: "" },
      ],
      isLogin: true,
    };
  },
  onLoad() {
    this.getBagList();
  },
  onShow() {
    this.isLogin = !!getToken();
    if (this.isLogin) {
      this.getUserDetail();
      this.getWalletInfo();
    } else {
      this.avatorInfo = {};
      this.walletInfo = {};
    }
  },
  methods: {
    // 用户详情
    async getUserDetail() {
      const data = await fetchUserDetail();
      this.avatorInfo = data;
      setUserInfo(data);
    },
    // 余额详情
    async getWalletInfo() {
      const data = await fetchWalletInfo();
      this.walletInfo = data || {};
    },
    // 我的赏袋
    async getBagList() {
      const data = await fetchBagList();
      this.rewardBagList = (data || []).map((item) => {
        const { id, appid, name: title, shopUrl } = item;
        const nextItem = {
          id,
          appid,
          icon: "bag",
          title,
          shopUrl,
          path: "/pages/me/pocket/index/index",
        };
        return nextItem;
      });
    },
  },
};
</script>

<style lang="scss">
.meContainer {
  .content {
    .grid {
      margin-top: 14rpx;
    }
  }
}
</style>
