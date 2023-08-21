<template>
  <view class="skuHeaderBox">
    <view class="skuHeader">
      <image class="skuImg" mode="aspectFill" :src="info.mainUrl" />
      <view class="skuInfo">
        <view>
          <view class="skuTitle">{{ info.name }}</view>
          <view class="followNumber">{{ info.followNum }}人想要</view>
        </view>
        <!-- <image class="skuShare" src="/static/images/icons/share.png" /> -->
      </view>
    </view>
    <!-- 操作按钮 -->
    <view class="skuHeaderBtns">
      <view class="collectBtn btn" @click="collect">{{
        info.related ? "已收藏" : "收 藏"
      }}</view>
    </view>
    <!-- 标签 -->
    <view class="tagsBox">
      <view v-for="item in info.tags" :key="item" class="tag text-hide">{{
        item
      }}</view>
    </view>
  </view>
</template>

<script>
// 常量
import { RELATION_TYPE } from "@/consts";
// service
import { addRelation, deleteRelation } from "@/api/common";

export default {
  name: "SkuHeader",
  props: {
    info: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    // 收藏
    async collect() {
      const { id: targetId, related } = this.info;
      // 取消 喜欢
      if (related) {
        await deleteRelation({
          targetId,
          relationType: RELATION_TYPE.LIKE_STYLE,
        });
      } else {
        // 喜欢
        await addRelation({ targetId, relationType: RELATION_TYPE.LIKE_STYLE });
      }
      uni.showToast({
        title: !related ? "收藏成功" : "取消收藏了",
        icon: "none",
      });
      this.$emit("changeGoodsInfo");
    },
  },
};
</script>
<style lang="scss">
.skuHeaderBox {
  .skuHeader {
    display: flex;
    justify-content: space-between;

    .skuImg {
      width: 124rpx;
      height: 124rpx;
      border-radius: 12rpx;
      background-color: $uni-bg-color-grey;
    }

    .skuInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: 24rpx;
      width: 78%;

      .skuTitle {
        font-size: 32rpx;
        font-weight: bold;
        color: #333333;
      }
      .followNumber {
        font-size: 24rpx;
        color: #7b7b7b;
      }
      .skuShare {
        width: 48rpx;
        height: 48rpx;
      }
    }
  }
  .skuHeaderBtns {
    margin-top: 32rpx;

    .btn {
      height: 80rpx;
      border-radius: 12rpx;
      font-size: 32rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
    }
    .collectBtn {
      background-color: #4966ff;
    }
  }
  .tagsBox {
    display: flex;
    margin-top: 40rpx;
    width: 100%;
    overflow-x: scroll;

    .tag {
      display: inline-block;
      margin-left: 20rpx;
      min-width: 80rpx;
      height: 52rpx;
      border-radius: 26rpx;
      padding: 0 18rpx;
      text-align: center;
      line-height: 52rpx;
      color: #c2c2c2;
      font-size: 24rpx;
      background-color: #fff;
    }
  }
}
</style>
