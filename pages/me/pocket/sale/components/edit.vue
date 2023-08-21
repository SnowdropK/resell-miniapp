<template>
	<view class="sale-model">
		<u-modal
			:show="show"
			:closeOnClickOverlay="true"
			:showCancelButton="true"
			@confirm="confirm"
			@cancel="close"
		>
			<view class="slot-content">
				<view class="header">{{ title }}</view>
				<view class="info">
					<view class="left">
						<!-- <image class="mainImg ml-auto" :src="formData.mainUrl" /> -->
						<image class="w-100 h100 ml-auto" :src="formData.mainUrl" mode="aspectFit"></image>
					</view>
					<view class="right">
						<view class="font-md">{{ formData.goodsTitle }}</view>
						<view class="">可转卖数量：{{ formData.canUpNum }}</view>
						<view class="">建议售价：<text v-if="formData.recommendPrice">￥</text>{{ toYuan(formData.recommendPrice) || '-' }}</view>
					</view>
				</view>
				<view class="price">
					<text class="price-num">价格：</text>
					<input
						class="price-input"
						placeholder="请输入价格"
						border="surround"
						v-model="formData.goodsPrice"
						fontSize="13"
						type="digit"
						@input="checkPrice"
					></input>
				</view>
				<!-- <u--form
				  labelPosition="left"
				  ref="formData"
				  :model="formData"
				  :rules="rules"
				  labelWidth="106rpx"
				>
					<u-form-item label="价格：" prop="goodsPrice">
						<input
							placeholder="请输入价格"
							v-model="formData.goodsPrice"
							:max="8"
							type="digit"
							@input="checkPrice"
						></input>
					</u-form-item>
				</u--form> -->
				<view class="num-box">
					<view class="num">数量：</view>
					<u-number-box v-model="formData.storeNum" :min="1" :max="formData.canUpNum" integer button-size="25"></u-number-box>
					<view class="charge text-hide">手续费：{{ fee }}</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
// 工具
import { toYuan, accMul, accDiv, toFixed } from "@/utils";
// service 
import { fetchPlatConfig } from "@/api/common";
import { updateSale, updateSaleInfo } from "@/api/myInfo";

export default {
	name: 'EditSale',
	props: {
		saleInfo: {
			type: Object,
			default: {},
		},
		show: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: '编辑转卖信息',
		},
	},
	filters: {
		formatter(value) {
			return parseFloat(value).toFixed(2);
		}
	},
	data() {
		return {
			showModel: false,
			form: {
				mainUrl: '',
				goodsTitle: '',
				goodsNum: 0,
				goodsPrice: 0,
				recommendPrice: 0,
				canUpNum: 0,
				storeNum: 0,
				charge: 0,
			},
			formData: {
				goodsPrice: 0,
			},
			goodsPrice: 0,
      saleRate: 0,
			// fee: 0,
			rules: {
			  goodsPrice: [
			    {
			      type: "number",
			      required: true,
			      message: "请填写价格",
			      trigger: ["blur", "change"],
			    },
			    {
			      validator: (rule, value, callback) => {
			        return +value > 0;
			      },
			      message: "价格不能为0",
			      // 触发器可以同时用blur和change
			      trigger: ["change", "blur"],
			    },
			    {
			      // 自定义验证函数
			      validator: (rule, value, callback) => {
			        return +value <= 1000000;
			      },
			      message: "价格不能超过100万",
			      trigger: ["change", "blur"],
			    },
			  ],
			},
		}
	},
	watch: {},
	computed: {
		// 手续费
		fee() {
			const price = accMul(+this.formData.goodsPrice || 0, 100);
			const sumPrice = accMul(this.formData.storeNum || 0, price);
			return toFixed(
				accDiv(toFixed(accMul(+sumPrice, +this.saleRate), 2), 100),
				2
			);
		},
	},
  onReady() {
    // this.$refs.formData.setRules(this.rules);
  },
	created() {
		this.fetchPlatConfig();
		this.getData();
	},
	methods: {
		async getData(){
			const info = await updateSaleInfo({ id: this.saleInfo.id || '' });
			this.formData = info || this.form;
			this.formData.goodsPrice = this.toYuan(info.goodsPrice);
			// this.formData.goodsNum = this.formData.storeNum;
		},
		// 获取手续费数据
    async fetchPlatConfig() {
      const data = await fetchPlatConfig();
			// saleRate 售卖费率  saleNum售卖数
      this.saleRate = data.saleRate || 0;
    },
		// 提交修改
		confirm() {
			if (this.formData.goodsPrice <= 0 || !this.formData.goodsPrice) {
				uni.showToast({
					title: '请输入正确的金额',
					icon: 'none'
				});
				return
			}
			this.formData.goodsPrice = accMul(+this.formData.goodsPrice, 100)
			this.$emit('confirm', this.formData)
		},
		// 关闭/取消
		close() {
			this.$emit('confirm')
		},
    toYuan(val) {
      return toYuan(val);
    },
		// 限制
		checkPrice(val){
			// console.log(v);
			let v = val.detail.value
			// this.formData.goodsPrice = +v;
			if(v && v.length > 8) {
				v = v.slice(0,8)
			}
			// setTimeout(() => {
			//   this.formData.goodsPrice = toFixed(+v, 2);
			// }, 100);
			var price = '' + v;
			price = price
				.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
				.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
				.replace('.', '$#$')
				.replace(/\./g, '')
				.replace('$#$', '.')
				.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
			if (price.indexOf('.') < 0 && price != '') {
				// 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
				price = parseFloat(price);
			}
			
			this.$nextTick(() => {
				// this.formData.goodsPrice = parseFloat(price);
				this.formData.goodsPrice = price;
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.sale-model {
	::v-deep {
		.u-modal__content {
			padding: 30rpx!important;
		}
		.u-form-item__body__left {
			width: 106rpx;
		}
		.u-form-item__body {
			padding: 0;
			margin: 20rpx 0;
		}
		.u-form-item__body__left__content__label {
			font-size: 28rpx!important;
		}
		// .u-input {
		// 	padding: 6rpx 10rpx!important;
		// 	border: 3rpx solid #dadbde !important;
		// 	height: 50rpx;
		// }
		// .u-border {
		// 	border: 3rpx solid #dadbde !important;
		// }
	}
	.price-input {
		height: 50rpx;
		padding: 6rpx 10rpx!important;
		border: 3rpx solid #dadbde !important;
		border-radius: 8rpx;
	}
	.left {
		width: 120rpx;
		height: 150rpx;
		overflow: hidden;
	}
	.mainImg {
		width: 120rpx;
		height: 150rpx;
		border-radius: 3rpx;
	}
	.slot-content {
		width: 100%;
		.header {
			text-align: left;
			font-size: 30rpx;
			border-bottom: 1px solid #dfdfdf;
		}
		.info {
			display: flex;
			margin-top: 20rpx;
			.right {
				margin-left: 20rpx;
			}
		}
		.price {
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-top: 30rpx;
		}
		.price-num {
			width: 102rpx;
		}
		.num-box {
			display: flex;
			flex-direction: row;
			align-items: flex-end;
			margin-top: 30rpx;
			.num, .price-num {
				width: 102rpx;
			}
			.charge {
				width: 236rpx;
				margin-left: 10rpx;
				text-align: center;
			}
		}
	}
}
</style>