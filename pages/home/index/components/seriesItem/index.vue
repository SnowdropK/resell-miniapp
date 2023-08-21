<template>
  <view class="seriesItemBox" @click="goToDetail">
    <!-- <image
      style="width: 100%"
      mode="widthFix"
      :src="info.iconUrl || info.mainUrl"
    /> -->
    <view style="padding: 0 20rpx 24rpx">
      <view class="ipTitle">{{ info.name || "" }}</view>
      <view v-if="info.searchType === SEARCH_TYPE.SERIES" class="ipData">
        <text>{{ info.followNum || 0 }}人想要</text>
        ｜
        <text>{{ info.resaleUserNum || 0 }}人在卖</text>
      </view>
      <view v-if="info.searchType === SEARCH_TYPE.IP_STYLE" class="ipData">
        <view class="zanBox" @click.stop="follow">
          <u-icon
            :name="info.related ? 'heart-fill' : 'heart'"
            width="30rpx"
            height="24rpx"
            :color="info.related ? '#E93F4A' : ''"
          />
          <text style="margin-left: 8rpx">{{ info.followNum }}</text>
        </view>
        <!-- <view class="salePeopleNumber">
          {{ info.resaleNum || 0 }}人在卖
        </view> -->
        <view class="salePriceBox">
          转￥<text class="salePrice">{{ toYuan(info.minPrice) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// 工具
import { toYuan } from "@/utils";
// 常量
import { SEARCH_TYPE, RELATION_TYPE } from "@/consts";

export default {
  name: "SeriesItem",
  props: {
    searchType: {
      type: [Number, String],
      defaultL: 1,
    },
    info: {
      type: Object,
      defaultL: {},
    },
  },
  data() {
    return {
      SEARCH_TYPE,
    };
  },
  methods: {
    // 分转元
    toYuan(val) {
      return toYuan(val);
    },
    // 跳转至对应详情页
    goToDetail() {
      const { id = "", searchType } = this.info;
      if (searchType === SEARCH_TYPE.SERIES) {
        uni.navigateTo({
          url: `/pages/home/seriesDetail/index?id=${id}`,
        });
        return;
      }
      uni.navigateTo({
        url: `/pages/home/skuDetail/index?id=${id}`,
      });
    },
    follow() {
      const { id: targetId, related } = this.info;
      this.$emit("like", {
        targetId,
        relationType: RELATION_TYPE.LIKE_STYLE,
        related,
        info: this.info,
      });
    },
  },
};
</script>
<style lang="scss">
.seriesItemBox {
  // margin-bottom: 22rpx;
  width: 100%;
  border-radius: 12rpx;
  background-color: #fff;
  overflow: hidden;

  .ipTitle {
    margin-top: 12rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
  }
  .ipData {
    display: flex;
    justify-content: space-between;
    color: #c9c9c9;
    font-size: 24rpx;

    .zanBox {
      display: flex;
      align-items: center;
    }
    .salePriceBox {
      color: #ea5334;

      .salePrice {
        font-size: 36rpx;
        font-weight: bold;
      }
    }
    .salePeopleNumber {
      color: #c9c9c9;
      font-size: 24rpx;
    }
  }
  // .ipData {
  //   color: #c9c9c9;
  //   font-size: 24rpx;
  // }
}
</style>
