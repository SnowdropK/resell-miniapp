<template>
	<view class="set-up-main">
		<CommonContainer title="卖家设置">
			<view class="top">
				<view class="item" @click="showRegionPicker">
					<view class="left">发货城市</view>
					<input disabled :value="path" type="text" placeholder-class="line" placeholder="请选择省、市、区" />
				</view>
				<view class="item">
					<view class="left">
						<view class="set">运费</view>
					</view>
					<u-radio-group
						v-model="radiovalue"
						placement="row"
						@change="groupChange"
					>
						<u-radio :activeColor="themeColor" label="默认运费" :name="1"></u-radio>
						<u-radio class="ml-2" :activeColor="themeColor" label="包邮" :name="2"></u-radio>
					</u-radio-group>
				</view>
				<view class="item">
					<view class="left">默认运费</view>
					￥
					<u--input
						placeholder="请输入默认运费"
						border="none"
						v-model="form.tel"
						fontSize="13"
						type="number"
						@input="checkPrice(form.tel, 1)"
					></u--input>
					<!-- <input type="number" v-model="form.tel" @input="checkPrice" placeholder-class="line" placeholder="请填写默认运费" /> -->
				</view>
				<view class="item">
					<view class="left">包邮金额</view>
					￥
					<u--input
						placeholder="请输入默认运费"
						border="none"
						v-model="form.price"
						fontSize="13"
						type="number"
						@input="checkPrice(form.price, 2)"
					></u--input>
					<!-- <input type="number" v-model="form.price" placeholder-class="line" placeholder="请填写默认运费" /> -->
				</view>
				<view class="item address">
					<view class="left">交易说明</view>
					<u--textarea v-model="form.detail" placeholder-class="line" placeholder="请填写交易说明" count :maxlength="30"></u--textarea>
				</view>
			</view>
			<view class="p-3">
				<view class="text-center w-100 main-bg-color text-white font-md rounded py-2" hover-class="main-bg-hover-color" @click="submit">
					保 存
				</view>
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
			themeColor: themeColor,
			pickerValue: [0, 0, 1],
			radiovalue: 1,
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
		groupChange(e) {
			console.log(this.radiovalue);
		},
		showRegionPicker() {
			this.$refs.mpvueCityPicker.show()
		},
		async submit(){
			let reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
			if (!reg.test(this.form.tel)) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'none'
				});
				return
			}
			const data = await addAddress(this.form)
			// 修改
			if (this.isedit) {
				uni.showToast({ title: '修改成功' })
			} else {
				uni.showToast({ title: '创建成功' })
			}
			// uni.navigateTo({
			// 	url: "/pages/me/address/index/index",
			// });
			setTimeout(()=>{
				uni.navigateBack({ delta: 1 })
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
		// 限制
		checkPrice(v, type){
			var price = '' + v;
			price = price.replace(/\D+/, '')
			
			this.$nextTick(() => {
				if (type === 1) {
					this.form.tel = parseFloat(price);
				} else {
					this.form.price = parseFloat(price);
				}
			})
		}
	}
};
</script>

<style lang="scss" scoped>
.set-up-main {
	/deep/ .line {
		color: $u-light-color;
		font-size: 28rpx;
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