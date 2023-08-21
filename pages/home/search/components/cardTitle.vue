<template>
	<view class="px py-2">
		<view class="d-flex a-center">
			<view class="">
				<text class="">{{ name }}</text>
				<text v-if="num" class="ml-1 text-color">{{ num }}</text>
			</view>
			<view v-if="more" class="ml-auto d-flex" @click="clickMore">
				<text>更多</text>
				<u-icon size="12" name="arrow-right"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'CardTitle',
	props: {
		name: {
			type: String,
			default: ''
		},
		num: {
			type: [String, Number],
			default: ''
		},
		more: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			
		}
	},
	methods: {
		clickMore() {
			this.$emit('onMore')
		}
	}
}
</script>

<style scoped>
.text-color {
	color: #EA5334;
}
</style>