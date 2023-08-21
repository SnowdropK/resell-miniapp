<template>
  <view class="skuItemBox" @click="goToSkuDetail">
    <!-- <image style="width: 100%" mode="widthFix" :src="info.mainUrl" /> -->
    <view style="padding: 0 20rpx 24rpx">
      <view class="skuTitle">{{ info.name }}</view>
      <view class="skuData">
        <view class="zanBox" @click.stop="follow">
          <u-icon
            :name="info.related ? 'heart-fill' : 'heart'"
            width="30rpx"
            height="24rpx"
            :color="info.related ? '#E93F4A' : ''"
          />
          <text style="margin-left: 8rpx">{{ info.followNum }}</text>
        </view>
        <view v-if="info.minPrice || info.recommendPrice" class="salePriceBox">
          转￥<text class="salePrice">
            {{ toYuan(info.minPrice || info.recommendPrice) }}
          </text>
        </view>
        <view v-else>暂无售卖</view>
      </view>
    </view>
  </view>
</template>
<script>
// 常量
import { RELATION_TYPE } from "@/consts";
// 工具
import { toYuan } from "@/utils";

export default {
  name: "SkuItem",
  props: {
    info: {
      type: Object,
      defaultL: {},
    },
  },
  methods: {
    // 分转元
    toYuan(val) {
      return toYuan(val);
    },
    goToSkuDetail() {
      const { id = "" } = this.info;
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
.skuItemBox {
  margin-bottom: 22rpx;
  width: 100%;
  border-radius: 12rpx;
  background-color: #fff;
  overflow: hidden;

  .skuTitle {
    margin-top: 12rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
  }
  .skuData {
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
  }
}
</style>
