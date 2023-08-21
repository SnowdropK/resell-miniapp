<template>
	<view class="d-flex flex-wrap pt history-list">
		<view class="mr-1 mb-1 px item" v-for="(item,index) in historyList" :key="index">
			<u-tag
				:text="item"
				:borderColor="tagColor"
				:bgColor="tagColor"
				shape="circle"
				color="#C2C2C2"
				plain
				@click="search(item)"
				style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis; text-align: center;"
			></u-tag>
		</view>
	</view>
</template>

<script>
	export default {
		name:"search-tag",
		props: {
			list: {
				type: Array,
				default: []
			}
		},
		data() {
			return {
				historyList: this.list,
				tagColor: '#ffffff',
			};
		},
		watch: {
			list(val) {
				this.historyList = val
			},
		},
		methods:{
			search(v) {
				this.$emit('search', v)
			}
		}
	}
</script>

<style lang="scss" scoped>
.history-list {
	max-height: 130rpx;
	overflow-y: auto;
	.item {
		max-width: 48%;
	}
}
</style>