<template>
	<view class="wrap">
    <CommonContainer :title="title">
			<view class="top">
				<view class="item">
					<view class="left">收货人</view>
					<input type="text" v-model="form.username" placeholder-class="line" placeholder="请填写收货人姓名" />
				</view>
				<view class="item">
					<view class="left">联系电话</view>
					<input type="text" v-model="form.tel" placeholder-class="line" placeholder="请填写联系电话" />
				</view>
				<view class="item" @click="showRegionPicker">
					<view class="left">所在地区</view>
					<input disabled :value="path" type="text" placeholder-class="line" placeholder="省市区县、乡镇等" />
				</view>
				<view class="item address">
					<view class="left">详细地址</view>
					<u--textarea v-model="form.detail" placeholder-class="line" placeholder="街道、楼牌等" count :maxlength="80"></u--textarea>
				</view>
				<view class="item">
					<view class="left">
						<view class="set">设置默认</view>
					</view>
					<u-switch v-model="form.mainField" class="ml-auto" :activeColor="themeColor" :activeValue="1" :inactiveValue="0"
						@change="setDefault"></u-switch>
				</view>
			</view>
			<view class="p-3">
				<!-- <view class="text-center w-100 main-bg-color text-white font-md rounded py-2" hover-class="main-bg-hover-color" @click="submit">
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
import { addAddress } from "@/api/myInfo.js";
export default {
	components: {
		CommonContainer, mpvueCityPicker,
	},
	data() {
		return {
			show: false,
			isedit:false,
			loading: false,
			title: '新增地址',
			themeColor: themeColor,
			pickerValue: [0, 0, 1],
			form: {
				username: "",
				province: "",
				city: "",
				district: "",
				detail: "",
				tel: "",
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
			this.title = '修改地址'
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
			let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
			if (!this.form.username) {
				uni.showToast({
					title: '请输入收货人姓名',
					icon: 'none'
				});
				return
			}
			if (!reg.test(this.form.tel)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return
			}
			if (!this.form.province) {
				uni.showToast({
					title: '请选择所在地区',
					icon: 'none'
				});
				return
			}
			if (!this.form.detail) {
				uni.showToast({
					title: '请输入详细地址',
					icon: 'none'
				});
				return
			}
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.loading = true;
			const data = await addAddress(this.form)
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
