<template>
  <view class="">
    <CommonContainer title="个人主页">
      <!-- 用户信息 -->
      <UserInfo :userInfo="userInfo" :userId="queryParams.userId" />
      <!-- 转卖/求购列表 -->
      <view class="py-1 position-relative">
        <ScrollList
          :value="selectId"
          :list="typeList"
          scroll
          @select="selectScroll"
        />
      </view>
      <!-- 列表 -->
      <view v-if="flowList.length > 0" class="">
        <!-- 平台 -->
        <view class="p-1 font-md font-weight">{{ platsId }}</view>
        <scroll-view
          :scroll-top="0"
          scroll-y="true"
          :refresher-threshold="100"
          style="height: 75vh"
          @scrolltolower="lower"
        >
          <view class="d-flex flex-row flex-wrap j-sb">
            <ListItem
              v-for="item in flowList"
              :key="item.id"
              :info="item"
              :userId="queryParams.userId"
              :talentId="talentId"
            />
          </view>
          <!-- <u-empty v-if="!flowList.length" mode="data" text="没有更多了" ></u-empty> -->
          <u-empty
            v-if="!flowList.length"
            mode="data"
            icon="/static/images/bgs/empty.png"
            text="没有更多了"
          />
          <view
            v-else
            class="d-flex a-center j-center text-light-muted font-md py-3"
          >
            {{ loadtext }}
          </view>
        </scroll-view>
      </view>
      <view v-else class="mt-5">
        <!-- <u-empty mode="data" text="没有更多了" ></u-empty> -->
        <u-empty
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        />
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
import ScrollList from "@/components/scrollList";
import UserInfo from "./components/userInfo";
import ListItem from "./components/listItem";
// service
import { getUserDetail, mySaleList, fetchBagDetail } from "@/api/myInfo";

export default {
  components: {
    CommonContainer,
    ScrollList,
    UserInfo,
    ListItem,
  },
  data() {
    return {
      talentId: "",
      platsId: "",
      selectId: 1,
      typeList: [
        { id: 1, title: "转卖" },
        { id: 2, title: "求购" },
      ],
      flowList: [],
      userInfo: {
        userId: "",
        avatarUrl: "",
        nickname: "用户名",
        intro: "",
        telephone: "",
      },
      resellList: [],
      buyList: [],
      finish: false,
      loadtext: "上拉加载更多",
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        userId: "",
      },
    };
  },
  onLoad(options) {
    const { id = "" } = options || {};
    this.queryParams.userId = id;
    this.getData();
    this.getUserInfo();
  },
  onShow() {
    this.getUserInfo();
  },
  methods: {
    // 触底加载
    lower() {
      if (this.finish) return;
      this.loadtext = "加载中...";
      this.queryParams.pageNo++;
      this.getData();
    },
    async getUserInfo() {
      const data = await getUserDetail({ id: this.queryParams.userId });
      this.userInfo = data || this.userInfo;
    },
    async getData() {
      const data = await mySaleList(this.queryParams);
      this.flowList = data.records ? [...this.flowList, ...data.records] : [];
      this.loadtext = data.records.length < 10 ? "没有更多了" : "上拉加载更多";
      // 结束加载
      this.finish = data.records.length < 10;
      if (data.records && data.records.length > 0 && !this.platsId) {
        const info = await fetchBagDetail({ id: data.records[0].sourceTalent });
        this.platsId = info.name;
        this.talentId = info.id;
      }
    },
    // 切换标签卡
    selectScroll(item) {
      this.selectId = item.id;
      this.flowList = [];
      if (item.id === 1) {
        this.getData();
      } else {
        this.flowList = this.buyList;
      }
    },
  },
};
</script>

<style></style>
