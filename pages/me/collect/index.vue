<template>
  <view class="">
    <CommonContainer title="我的收藏">
      <!-- 列表 -->
      <view class="py-1 position-relative">
        <ScrollList
          :value="selectId"
          :list="typeList"
          scroll
          @select="selectScroll"
        />
      </view>
      <!-- 列表 -->
      <view v-if="flowList.length > 0" class="mt-2">
        <ListItem
          :list="flowList"
          :ifStyle="selectId == 2"
          @removeFav="removeFav"
        />
      </view>
      <view v-else class="mt-5">
        <u-empty
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
import ScrollList from "@/components/scrollList";
import ListItem from "./components/listItem";
// service
import { favGoods, favCategory, removeFav } from "@/api/collect.js";

export default {
  components: {
    CommonContainer,
    ScrollList,
    ListItem,
  },
  data() {
    return {
      platsId: "",
      selectId: 1,
      typeList: [
        { id: 1, title: "系列" },
        { id: 2, title: "款式" },
      ],
      flowList: [],
      seriesList: [],
      styleList: [],
    };
  },
  onLoad() {
    // this.getData();
  },
  onShow() {
    this.getData();
  },
  methods: {
    async getData() {
      const series = await favCategory();
      this.seriesList = series.records || [];
      const style = await favGoods();
      this.styleList = style.records || [];
      this.flowList = series.records;
      if (this.selectId == 2) {
        this.flowList = style.records;
      }
    },
    // 切换标签卡
    selectScroll(item) {
      this.selectId = item.id;
      this.flowList = [];
      if (item.id === 1) {
        this.flowList = this.seriesList;
      } else {
        this.flowList = this.styleList;
      }
    },

    // 取消收藏
    removeFav(id) {
      uni.showModal({
        title: "提示",
        content: "是否取消收藏？",
        cancelText: "放弃",
        confirmText: "确定",
        success: async (res) => {
          if (res.confirm) {
            const data = await removeFav({
              targetId: id,
              relationType: this.selectId == 2 ? 2 : 1, // 关系类型:1-关注系列；2-喜欢款式；
            });
            uni.showToast({ title: "取消收藏成功" });
            this.getData();
          }
        },
      });
    },
  },
};
</script>

<style></style>
