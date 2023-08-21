<template>
	<view class="wrap">
    <CommonContainer :title="title">
			<view class="top">
				<view class="d-flex flex-row a-center py-2">
					<u-icon name="zhifubao-circle-fill" color="#1296db" size="30"></u-icon>
					<!-- 微信 -->
					<!-- <u-icon name="weixin-circle-fill" color="#00C800" size="30"></u-icon> -->
					<view class="mx-2 font-md">支付宝收款</view>
				</view>
				<!-- <view class="item">
					<view class="left">收款方式</view>
					<input type="text" v-model="form.title" placeholder-class="line" placeholder="请填写" />
				</view> -->
				<view class="item">
					<view class="left">账号</view>
					<input type="text" v-model="form.account" placeholder-class="line" placeholder="请填写支付宝收款账号" />
				</view>
				<view class="item">
					<view class="left">姓名</view>
					<input type="text" v-model="form.name" placeholder-class="line" placeholder="请填写收款人姓名" />
				</view>
				<view class="item">
					<view class="left">
						<view class="set">设置默认</view>
					</view>
					<u-switch v-model="form.mainField" class="ml-auto" :activeColor="themeColor" :activeValue="1" :inactiveValue="0"
						@change="setDefault"></u-switch>
				</view>
			</view>
			<view class="px-2 text-danger">
				*请仔细核对以上收款信息，填写错误将无法正常收款
			</view>
			<view class="p-3">
				<!-- <view class="text-center w-100 main-bg-color text-white font-md rounded-10 py-2" hover-class="main-bg-hover-color" @click="submit">
					保 存
				</view> -->
				<u-button class="text-center w-100 main-bg-color text-white font-md rounded py-2" :disabled="loading"
					@click="submit" type="primary" text="保 存"></u-button>
			</view>
		</CommonContainer>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="pickerValue" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer"
import mpvueCityPicker from "@/components/uni-ui/mpvue-citypicker/mpvueCityPicker.vue"
// 工具
import { themeColor } from "@/config/theme"
// service 
import { addPay } from "@/api/myInfo.js";
export default {
	components: {
		CommonContainer, mpvueCityPicker,
	},
	data() {
		return {
			show: false,
			isedit:false,
			loading: false,
			title: '新增收款方式',
			themeColor: themeColor,
			pickerValue: [0, 0, 1],
			form: {
				accountType: 1, // 1-支付宝 2-微信
				name: "",
				account: "",
				title: "支付宝收款",
				mainField: 0,
			}
		};
	},
	computed: {
		path() {
			if (this.form.province) {
				return this.form.province  +'-'  +this.form.city + '-' + this.form.district
			}
		}
	},
	onBackPress() {
		if (this.$refs.mpvueCityPicker.showPicker) {
			this.$refs.mpvueCityPicker.pickerCancel()
			return true;
		}
	},
	onUnload() {
		if (this.$refs.mpvueCityPicker.showPicker) {
			this.$refs.mpvueCityPicker.pickerCancel()
		}
	},
	onLoad(e) {
		if (e.data) {
			let result = JSON.parse(e.data)
			this.form = result
			this.isedit = true
			this.title = '修改收款方式'
		}
	},
	methods: {
		setDefault(e) {
			//
		},
		showRegionPicker() {
			this.$refs.mpvueCityPicker.show()
		},
		async submit(){
			let reg = /^1[3-9]\d{9}$/;
			 // 支付宝正则
			let email = /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/
			if (!email.test(this.form.account)) {
				uni.showToast({
					title: '请输入正确的支付宝账号',
					icon: 'none'
				});
				return
			}
			if (!this.form.name) {
				uni.showToast({
					title: '请输入正确的收款人姓名',
					icon: 'none'
				});
				return
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.loading = true;
			const data = await addPay(this.form)
			// 修改
			if (this.isedit) {
				uni.showToast({ title: '修改成功' })
			} else {
				uni.showToast({ title: '创建成功' })
			}
			setTimeout(()=>{
				uni.navigateBack({ delta: 1 })
				uni.showLoading({
					title: '加载中',
					mask: false
				})
				this.loading = false;
			}, 1000)
			// uni.navigateTo({
			// 	url: "/pages/me/pay/index/index",
			// });
		},
		// 三级联动确定
		onConfirm(e) {
			// this.form.path = e.label
			let arr = e.label.split('-')
			this.form.province = arr[0]
			this.form.city = arr[1]
			this.form.district = arr[2]
			this.pickerValue = e.value
		},
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	.mainImg {
		width: 60rpx;
		height: 60rpx;
	}
	.top {
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}
		
		.address {
			padding: 20rpx 0;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.u-button--primary {
		background-color: $uni-bg-color;
	}
	.bottom {
		margin-top: 20rpx;
		padding: 40rpx;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;
		.tag {
			display: flex;
			.left {
				width: 180rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
			}
		}
		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
}
</style>
