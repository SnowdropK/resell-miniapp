<template>
	<view class="pt-1">
		<u-search
			shape="round"
			v-model="temp"
			:showAction="false"
			:searchIconColor="themeColor"
			borderColor="#ffffff"
			bgColor="#ffffff"
			placeholder="搜索关键词"
			@search="search"
			@clear="clear"
		/>
	</view>
</template>

<script>
import { themeColor } from "@/config/theme";
export default {
	name:"search-header",
	props: {
		keyword: {
			type: String,
			default: ''
		},
		// 清空搜索历史
		reset: {
			type: Boolean,
			default: false
		},
		back: {
			type: Boolean,
			default: false
		},
	},
	data() {
		return {
			temp: this.keyword || '',
			// temp: '',
			themeColor: themeColor,
			historyList: [],
		};
	},
	watch: {
		keyword(v) {
			this.temp = v || ''
		},
		temp(v) {
			if (!v) {
				this.$emit("commit", '');
			}
		},
		reset(v) {
			if (v) {
				this.historyList = []
			}
		}
	},
	created() {
		this.getHistoryList();
	},
	methods:{
		getHistoryList() {
			let history = uni.getStorageSync('searchHistory')
			this.historyList = history ? JSON.parse(history) : []
		},
		// 清空则返回搜索
		clear() {
			this.$emit("commit", '');
			// if (this.back) {
			// 	uni.navigateBack();
			// }
		},
		search(v) {
			// 去除空格
			let search = v.replace(/[, ]/g,'')
			if (search === '') {
				return uni.showToast({
					title: '关键词不能为空',
					icon: 'none'
				});
			}
			// #ifdef APP-PLUS
			plus.key.hideSoftKeybord()
			// #endif
			// #ifndef APP-PLUS
			uni.hideKeyboard()
			// #endif
			this.$emit("commit", search)
			
			setTimeout(() => {
				this.addHistory(search)
			}, 50)
		},
		// 加入搜索记录
		addHistory(search) {
			let index = this.historyList.indexOf(search)
			if (index === -1) {
				this.historyList.unshift(search)
			} else {
				this.historyList.unshift(this.historyList.splice(index,1)[0])
			}
			// console.log(this.historyList);
			// 移除最后一条
			if (this.historyList.length > 18) {
				this.historyList.splice(this.historyList.length - 1,1)
			}
			uni.setStorageSync('searchHistory', JSON.stringify(this.historyList))
		},
		
	}
}
</script>

<style>

</style>