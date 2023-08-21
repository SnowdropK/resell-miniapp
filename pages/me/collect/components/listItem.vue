<template>
	<view class="">
		<view v-for="(item, index) in tempList" :key="item.id" class="mb-2 shadow">
			<u-swipe-action :autoClose="true">
				<u-swipe-action-item
					:options="options"
					@click="removeFav(item.id)"
				>
					<view class="p-2 rounded-20 mb-2 position-relative d-flex" v-if="ifStyle" @click="onSku(item)">
						<image class="mainUrl" :src="item.mainUrl || '/static/images/my/goodImg.png'" mode="aspectFill" :style="{ width: imgSize,height: imgSize }" />
						<view class="p-1 ml-2">
							<view class="font-weight">{{ item.name }}</view>
							<view class="level font-sm">{{ item.categoryDetail }}</view>
							<view class="position-absolute price">
							  <text v-if="item.recommendPrice" class="font-sm">￥</text>
							  <text class="price-text">{{ toYuan(item.recommendPrice) || '-' }}</text>
							</view>
						</view>
					</view>
					<view v-else class="p-2 rounded-20 mb-2 position-relative d-flex" @click="onSeries(item)">
						<image class="iconUrl" :src="item.iconUrl || '/static/images/my/goodImg.png'" mode="aspectFill" :style="{ width: imgSize,height: imgSize }" />
						<view class="p-1 ml-2">
							<view class="font-weight">{{ item.parentName || '-' }}</view>
							<view v-if="item.name" class="border rounded-30 main-border-color main-text-color text-center px-2">{{ item.name }}</view>
							<slot name="style" :price="item.price"></slot>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</view>
	</view>
</template>

<script>
// 工具
import { toYuan } from "@/utils";
	
export default {
	name: 'ListItem',
	components: { },
	props:{
		name: {
			type: String,
			default: ''
		},
		imgSize: {
			type: String,
			default: '120rpx'
		},
		list: {
			type: Array,
			default: []
		},
		ifStyle: {
			type: Boolean,
			default: false
		},
	},
	watch: {
		list(v) {
			this.tempList = v
		}
	},
	data() {
		return {
			tempList: this.list,
			options: [{ text: '取消收藏' }],
		}
	},
	computed: {},
	methods:{
		onUser(id) {
			// uni.navigateTo({
			//   url: "",
			// });
		},
		// 系列
		onSeries(item) {
			if (item.deleted) {
				uni.showToast({ title: '该系列已失效' });
				return;
			}
			uni.navigateTo({
			  url: "/pages/home/seriesDetail/index?id=" + item.id,
			});
		},
		// 款式
		onSku(item) {
			if (item.deleted) {
				uni.showToast({ title: '该款式已失效' });
				return;
			}
			uni.navigateTo({
			  url: "/pages/home/skuDetail/index?id=" + item.id,
			});
		},
		// 取消收藏
		removeFav(id) {
			this.$emit('removeFav', id);
		},
    toYuan(val) {
      return toYuan(val);
    },
	}
}
</script>

<style lang="scss" scoped>
.level {
	color: #BFBFBF;
}
.avatarUrl {
	width: 90rpx;
	height: 90rpx;
	border-radius: 90rpx;
}
.iconUrl, .mainUrl {
	border-radius: 10rpx;
}
.price {
  color: #ea5334;
  right: 20px;
  bottom: 10px;
  font-size: 28rpx;
  .price-text {
    font-size: 40rpx;
  }
}
</style>