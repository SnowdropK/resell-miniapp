<template>
  <view class="">
    <CommonContainer :title="title" :showPadding="false">
      <u-cell-group>
        <u-cell title="头像">
					<view slot="value" class="avatarUrl">
						<button type="balanced" open-type="chooseAvatar" @chooseavatar="upload">
							<image :src="userInfo.avatarUrl || '/static/images/bgs/avator.png'" mode="aspectFill" class="refreshIcon"></image>
						</button>
					</view>
          <!-- <u-avatar slot="value" :src="userInfo.avatarUrl || '/static/images/bgs/avator.png'" mode="aspectFill" size="50"></u-avatar> -->
        </u-cell>

        <u-action-sheet
          :actions="listActions"
          :show="showAction"
          cancelText="取消"
          @close="showAction = false"
          @select="selectClick"
        >
					<!-- #ifdef MP-WEIXIN -->
					<view class="font-35 h120 border-bottom-light">微信头像</view>
					<!-- #endif -->
					<view class="font-35 h120 border-bottom-light" @click="upload">上传</view>
        </u-action-sheet>
        <u-cell title="昵称" isLink size="large" @click="showEditModel">
          <text slot="value" class="u-slot-value">{{
            userInfo.nickname || userInfo.userName || '用户昵称'
          }}</text>
        </u-cell>
        <u-cell v-if="!ifEdit" title="手机号" size="large">
					<view slot="value">
						<button v-if="!userInfo.telephone" size="mini" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取手机号</button>
						<text v-else class="u-slot-value">{{
						  getTel(userInfo.telephone) || '-'
						}}</text>
					</view>
        </u-cell>
        <u-cell v-else title="简介">
          <u--textarea
            slot="value"
            v-model="userInfo.intro"
            placeholder="请输入内容"
            count
            maxlength="30"
						@confirm="saveInfo"
          ></u--textarea>
        </u-cell>
        <view v-if="!ifEdit" class="divider"></view>
        <view v-if="!ifEdit">
          <u-cell
            title="收款方式"
            isLink
            size="large"
            url="/pages/me/pay/index/index"
          ></u-cell>
          <u-cell
            title="管理地址"
            isLink
            size="large"
            url="/pages/me/address/index/index"
          ></u-cell>
        </view>
      </u-cell-group>
    </CommonContainer>

    <!-- 修改昵称 -->
    <u-modal
      :show="showEdit"
      title="修改昵称"
      :show-cancel-button="true"
      cancelText="取消"
      confirmText="保存"
      @cancel="showEdit = false"
      @confirm="confirmName"
    >
      <view class="slot-content">
				<input type="nickname" class="weui-input" :value="username" @blur="bindblur"
					placeholder="请输入昵称" @input="bindinput"/>
      </view>
    </u-modal>
  </view>
</template>

<script>
import CommonContainer from "@/components/commonContainer";
// 工具
import { getTel } from "@/utils";
// service
import { uploadImg, getUserDetail, updateUserInfo, updatePhone } from "@/api/myInfo.js";
import { getStorage } from "@/utils/index";
export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      ifEdit: false,
      showEdit: false,
      showAction: false,
			sessionKey: '',
      title: "个人设置",
			ossInfo: {},
      username: "",
      userInfo: {
        avatarUrl: "",
        nickname: "用户名",
        intro: "",
        telephone: "",
      },
      fileList: [{ url: "https://cdn.uviewui.com/uview/album/1.jpg" }],
      listActions: [
        { name: "预览", },
        { name: "上传", },
      ],
      instantly: true,
      width: "180rpx",
      height: "180rpx",
    };
  },
  onLoad(e) {
    if (e.ifEdit) {
      this.ifEdit = true;
      this.title = "编辑资料";
    }
		this.getUserDetail();
  },
  methods: {
		// 获取用户手机号
		async getPhoneNumber(e){
			this.sessionKey = getStorage('sessionKey');
			if(this.sessionKey && e.detail.errMsg == "getPhoneNumber:ok"){
				const data = await updatePhone({
					encryptedData: e.detail.encryptedData,
					iv: e.detail.iv,
					sessionKey: this.sessionKey,
					// openId: this.openId,
					appid: uni.getAccountInfoSync().miniProgram.appId,
				})
				uni.showToast({
					title: '获取成功！',
					icon: 'success',
					duration: 2000
				})
				this.getUserDetail();
			}
		},
		async getUserDetail() {
			const data = await getUserDetail();
			this.userInfo = data || this.userInfo
			this.userInfo.intro = this.userInfo.intro || ''
		},
    // 修改昵称
    showEditModel() {
      this.showEdit = true;
      this.username = this.userInfo.nickname;
    },
    // 确认修改昵称
    confirmName(e) {
      this.userInfo.nickname = this.username;
      this.showEdit = false;
			this.saveInfo();
    },
		// 保存修改
		async saveInfo() {
			const data = await updateUserInfo({
				nickname: this.userInfo.nickname,
				intro: this.userInfo.intro,
				avatarUrl: this.userInfo.avatarUrl,
			});
			uni.showToast({
				title: '修改成功！',
				icon: 'success',
				duration: 2000
			})
			this.getUserDetail();
		},
		// 获取OSS信息
		async getOssInfo() {
			try {
				const data = await uploadImg();
				this.ossInfo = data
			} catch {
				uni.showToast({
					title: '出错了！',
					icon: 'error',
					duration: 2000
				})
			}
		},
    async upload(e) {
			await this.getOssInfo();
			console.log(e);
			var that = this
			this.showAction = false;
			// 获取微信头像
			let {
					avatarUrl: imageSrc
				} = e.detail;
			
			// uni.chooseImage({
			// 	count: 1,
			// 	sizeType: ['compressed'],
			// 	sourceType: ['album'],
			// 	success: res => {
					let tiemr = new Date();
					// var imageSrc = res.tempFilePaths[0];
					let nameStr = `${this.ossInfo.dir}avator${new Date().getTime()}.png`
					let ossUrl = 'https://img-u7ka.oss-cn-beijing.aliyuncs.com';
					uni.uploadFile({
						url: that.ossInfo.host,
						filePath: imageSrc,
						fileType: 'image',
						name: 'file',
						formData: {
							name: nameStr,
							key: nameStr,
							success_action_status: '200', // 让服务端返回200, 默认会返204
							policy: that.ossInfo.policy,
							OSSAccessKeyId: that.ossInfo.accessId,
							signature: that.ossInfo.signature,
						},
						success: async (res) => {
							if(res.statusCode == '200') {
								// this.userInfo.avatarUrl = ossUrl + "/" + nameStr;
								that.userInfo.avatarUrl = that.ossInfo.host+ nameStr;
								that.saveInfo();
							} else {
								console.log(res);
							}
						}
					});
			// 	}
			// });
		},
		// 获取微信昵称
		bindblur(e) {
			this.username = e.detail.value;
		},
		bindinput(e){
			this.username = e.detail.value;
		},
    // 选择上传或预览
    selectClick(index) {
      console.log(index);
    },
    // 预览
    onPreview() {},
		// 隐藏手机号
		getTel(tel) {
			if (tel) {
				return getTel(tel)
			}
		},
  },
};
</script>

<style lang="scss" scoped>
.u-upload {
  flex: none;
}
.u-input {
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}
.h120 {
  height: 120rpx;
  line-height: 120rpx;
}
.border-bottom-light {
  border-bottom: 1px solid #ededed;
}
.avatarUrl {
	button {
		border-radius: 50%;
		// background: #fff;
		line-height: 80rpx;
		height: auto;
		width: auto;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		.refreshIcon {
			width: 130rpx;
			height: 130rpx;
			border-radius: 50%;
		}
		.jt{
			width: 14rpx;
			height: 28rpx;
		}
	}
}
</style>
