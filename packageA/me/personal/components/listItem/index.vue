<template>
  <view class="listItemBox shadow" @click="goToDetail">
		<image class="w-100" :src="info.iconUrl || info.mainUrl" mode="aspectFill"></image>
    <view style="padding: 0 20rpx 24rpx">
      <view class="ip-title text-hide2">{{ info.goodsTitle || '' }}</view>
      <view class="d-flex a-end">
			 <text v-if="info.storeNum" class="text-light-muted font-sm">x{{ info.storeNum }}</text>
			 <view class="ml-auto resell-price">
				<text v-if="info.goodsPrice" class="font-sm">￥</text>
				<text class="font-35">{{ toYuan(info.goodsPrice) || '-' }}</text>
			 </view>
      </view>
    </view>
  </view>
</template>
<script>
// 工具
import { toYuan } from "@/utils";

export default {
  name: "ListItem",
  props: {
    info: {
      type: Object,
      defaultL: {},
    },
		talentId: {
      type: String,
      default: '',
    },
		// 别人的
		userId: {
      type: String,
      default: '',
    },
  },
  methods: {
    goToDetail() {
      const { goodsId = "", id } = this.info;
			let url = `/pages/home/skuDetail/index?id=${goodsId}`;
			if (this.userId) {
				url = `/pages/home/order/index?id=${goodsId}&goodsSaleId=${id}&talentId=${this.talentId}`;
			}
      uni.navigateTo({
				url: url,
        // url: `/pages/home/skuDetail/index?id=${goodsId}`,
      });
    },
    // 分转元
    toYuan(val) {
      return toYuan(val);
    },
  },
};
</script>
<style lang="scss">
.listItemBox {
  margin-bottom: 30rpx;
  width: 44vw;
  border-radius: 12rpx;
  background-color: #fff;
  overflow: hidden;

  .ip-title {
    margin-top: 12rpx;
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
  }
	.resell-price {
		color: #EA5334;
	}
}
</style>
