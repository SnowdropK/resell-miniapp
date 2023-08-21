<template>
  <view class="vajraBox">
    <view
      v-for="item in list"
      :key="item.id"
      class="item"
      @click="goToDetail(item)"
    >
      <image class="vajraImg" mode="aspectFill" :src="item.iconUrl" />
      <text class="vajraName">{{ item.name }}</text>
    </view>
  </view>
</template>

<script>
// service
import { fetchRecommendCategory } from "@/api/home";

export default {
  data() {
    return {
      list: [
        { id: 1, iconUrl: "", name: "系列" },
        { id: 2, iconUrl: "", name: "系列" },
        { id: 3, iconUrl: "", name: "系列" },
        { id: 4, iconUrl: "", name: "系列" },
        {
          id: "all",
          iconUrl: "/static/images/icons/logo.png",
          name: "全部系列",
        },
      ],
    };
  },
  mounted() {
    this.getRecommendCategory();
  },
  methods: {
    goToDetail(item) {
      if (item.id === "all") {
        // 跳转至全部系列
        uni.navigateTo({
          url: `/pages/home/class/index`,
        });
        return;
      }
      uni.navigateTo({
        url: `/pages/home/seriesDetail/index?id=${item.id}`,
      });
    },
    async getRecommendCategory() {
      const data = await fetchRecommendCategory();
      this.list = [
        ...data,
        {
          id: "all",
          iconUrl: "/static/images/icons/logo.png",
          name: "全部系列",
        },
      ];
    },
  },
};
</script>
<style lang="scss">
.vajraBox {
  display: grid;
  grid-template-columns: repeat(5, 20%);
  height: 184rpx;
  box-sizing: border-box;
  padding: 26rpx 18rpx 28rpx;
  border-radius: 24rpx;
  background-color: #fff;

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .vajraImg {
      border-radius: 44rpx;
      width: 88rpx;
      height: 88rpx;
      background-color: $uni-bg-color-grey;
    }
    .vajraName {
      margin-top: 22rpx;
      color: #333;
      font-weight: bold;
      font-size: 20rpx;
    }
  }
}
</style>
