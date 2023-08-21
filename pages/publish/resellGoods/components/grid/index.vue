<template>
  <view class="gridBox">
    <u-grid :border="false" :col="col" style="border: 1px solid blue">
      <u-grid-item v-for="item in list" :key="item.key">
        <view class="resellGoodsBox" @click="showGoodsPop(item)">
          <view class="resellGoodsImgBox">
            <image class="resellGoodsImg" :src="item.rewardImage" />
            <view v-if="item.pick" class="pick">x{{ item.pick || 0 }}</view>
          </view>
          <view class="name text-hide">{{ item.rewardName }}</view>
          <view class="price">建议价：{{ toYuan(recommendPrice || 0) }}</view>
          <view class="num">x{{ item.showNumber }}</view>
        </view>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
// 工具
import { toYuan } from "@/utils";

export default {
  components: {},
  props: {
    list: {
      type: Array,
      required: true,
      default: [],
    },
    col: {
      type: Number,
      default: 4,
    },
    currentFreeGoodsId: {
      type: Number,
      default: 0,
    },
    recommendPrice: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {
    toYuan(val) {
      return toYuan(val);
    },
    showGoodsPop(item) {
      this.$emit(
        "showPop",
        { ...item, recommendPrice: this.recommendPrice },
        this.currentFreeGoodsId
      );
    },
  },
};
</script>

<style lang="scss">
.title {
  margin-bottom: 16rpx;
}
.gridBox {
  .resellGoodsBox {
    position: relative;
    display: flex;
    flex-direction: column;
    margin-bottom: 10rpx;
    width: 124rpx;

    .resellGoodsImgBox {
      position: relative;

      .resellGoodsImg {
        width: 124rpx;
        height: 124rpx;
        border-radius: 12rpx;
        background-color: #f8f8f8;
      }
      .pick {
        position: absolute;
        bottom: 6rpx;
        width: 100%;
        height: 30rpx;
        border-radius: 0 0 12rpx 12rpx;
        font-size: 20rpx;
        color: #fff;
        text-align: center;
        line-height: 30rpx;
        background-color: rgba($color: #e91f86, $alpha: 0.7);
      }
    }

    .name {
      font-weight: bold;
      font-size: 24rpx;
    }
    .price {
      font-size: 18rpx;
      color: #e91f86;
      line-height: 25rpx;
    }
    .num {
      position: absolute;
      top: 0;
      right: 0;
      border-radius: 30rpx 0 0 30rpx;
      width: 70rpx;
      height: 30rpx;
      background-color: #e91f83;
      text-align: center;
      font-size: 20rpx;
      color: #fff;
      line-height: 30rpx;
    }
  }
}
</style>
