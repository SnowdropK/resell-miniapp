<template>
	<view class="">
    <CommonContainer title="帮助">
			<u-cell-group>
				<u-cell title="基础问题" :isLink="true" size="large" @click="onWeb(list[0].url)"></u-cell>
				<u-cell title="二手交易" :isLink="true" size="large" @click="onWeb(list[1].url)"></u-cell>
				<u-cell title="转卖须知" :isLink="true" size="large" @click="onWeb(list[2].url)"></u-cell>
			</u-cell-group>
		</CommonContainer>
	</view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
// service
import { helpList } from "@/api/myInfo.js";

export default {
	components: {
		CommonContainer,
	},
	data() {
		return {
			list: [
				{ url: 'https://img.u7ka.com/static_file/help/qa.txt' },
				{ url: 'https://img.u7ka.com/static_file/help/platform_intro.txt' },
				{ url: 'https://img.u7ka.com/img/web/1/2023-04-23/1682240526021_%E4%BA%A4%E6%98%93%E8%AF%B4%E6%98%8E%E5%8F%8A%E7%BB%93%E7%AE%97%E6%B5%81%E7%A8%8B.docx' },
			],
			fileType: ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx' ],
		}
	},
	onLoad() {
		this.getHelpList()
	},
	methods: {
		async getHelpList() {
			const data = await helpList()
			this.list = data || this.list
		},
		onWeb(v) {
			const temp = v.split('.')
			const type = temp[temp.length - 1]
			console.log(type);
			if (type && this.fileType.includes(type)) {
				this.previewFile(v, type)
				return
			}
			uni.navigateTo({
				url: "/packageA/me/webView/index?url=" + v,
			})
		},
		// 文件预览
		previewFile(url,typeName) {
			console.log('e =====> 预览',url,'typeName',typeName);
			// 支持预览的文件类型
			// 微信小程序
			// let fileType = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx' ]; 
			// if(!fileType.includes(typeName)) {
			//   return uni.showToast({
			//     title: '不支持预览当前文件类型',
						//     icon: 'none'
			//   })
			// }
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			// 下载文件资源到本地
			uni.downloadFile({
				url: url,
				success: function(res) {
					console.log('downloadFile ==> ',res)
					uni.hideLoading();
					var filePath = res.tempFilePath;
					if(!this.fileType.includes(typeName)) {
						return false;
					}
					uni.showLoading({
						title: '正在打开',
						mask: true
					})
					// 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx。
					uni.openDocument({
						filePath: filePath,
						fileType: typeName, // 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx 
						// showMenu: true, // 允许出现分享功能
						success: res => {
							uni.hideLoading();
							console.log('打开文档成功',res);
						},
						fail: openError => {
							uni.hideLoading();
							console.log('fail:' + JSON.stringify(openError));
						}
					});
				},
				fail: function(err) {
					uni.hideLoading();
					console.log('fail:' + JSON.stringify(err));
				}
			});
		},
	},
}
</script>

<style lang="scss" scoped>
	
</style>