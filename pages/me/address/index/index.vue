<template>
  <view class="">
    <CommonContainer title="管理地址" :showPadding="false">
      <view
        class="item position-relative"
        v-for="item in siteList"
        :key="item.id"
      >
        <u-swipe-action>
          <u-swipe-action-item :options="options" @click="delAddress(item.id)">
            <view class="swipe-action p-3 rounded-10">
              <view class="top">
                <view class="name text-ellipsis">{{ item.username }}</view>
                <view class="phone">{{ getTel(item.tel) }}</view>
                <view v-if="item.mainField" class="tag">
                  <text
                    :class="
                      item.mainField == 1
                        ? 'main-bg-color p tagText'
                        : 'tagText'
                    "
                    >默认</text
                  >
                </view>
              </view>
              <view class="bottom text-hide2 mb">
                <text class="span24-20">
                  {{ item.province + item.city + item.district + item.detail }}
                </text>
                <u-icon
                  v-if="isChooseAddress"
                  :name="
                    item.id === currentAddressId
                      ? 'checkmark-circle-fill'
                      : 'checkmark-circle'
                  "
                  :color="themeColor"
                  size="24"
                  @click="pickAddress(item)"
                ></u-icon>
                <u-icon
                  v-else
                  name="edit-pen"
                  :size="32"
                  color="#999999"
                  @click="editAddress(item, 1)"
                ></u-icon>
              </view>
              <!-- <view class="divider"></view> -->
            </view>
          </u-swipe-action-item>
        </u-swipe-action>
      </view>
      <view class="py-5 my-3"></view>
      <view v-if="siteList.length <= 0" class="mt-5">
        <u-empty
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
      </view>

      <view class="footer shadow-lg">
        <view v-if="isChooseAddress" class="bottom-div">
          <view
            v-if="isChooseAddress"
            class="addSite"
            style="border-radius: 40rpx; width: 100%"
            @click="goToCreateOrder"
          >
            确 定
          </view>
        </view>
        <view v-else class="bottom-div">
          <view class="addSite" @click="editAddress"> 新增地址 </view>
          <view class="import-address shadow-lg" @click="getWxAddress">
            导入微信地址
          </view>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
// 常量
import { themeColor } from "@/config/theme";
// 工具
import { getTel } from "@/utils/index.js";
// service
import {
  getAddressList,
  deleteAddress,
  getWXAddress,
  addAddress,
} from "@/api/myInfo.js";

export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      currentAddressId: "",
      siteList: [],
      options: [{ text: "删除" }],
      isChooseAddress: false,
      themeColor,
      userAddress: {},
    };
  },
  onLoad(options) {
    const { chooseAddress, currentAddressId } = options;
    this.isChooseAddress = +chooseAddress === 1;
    this.currentAddressId = +currentAddressId;
  },
  onShow() {
    this.getData();
  },
  methods: {
    async getData() {
      const data = await getAddressList({ mainField: 1 });
      this.siteList = data;
    },
    // 选择下单页使用的地址
    pickAddress(item) {
      this.currentAddressId = item.id;
    },
    // 带着地址id返回创建订单
    goToCreateOrder() {
      uni.$emit("returnAddressData", {
        currentAddressId: this.currentAddressId,
      });
      uni.navigateBack();
    },
    editAddress(item, i) {
      let data = "";
      if (i) {
        data = JSON.stringify(item);
      }
      setTimeout(() => {
        uni.navigateTo({
          url: "/pages/me/address/editAddress/index?data=" + data,
        });
      }, 50);
    },
    // 删除地址
    delAddress(id) {
      uni.showModal({
        title: "提示",
        content: "是否删除地址？",
        cancelText: "取消",
        confirmText: "删除",
        success: async (res) => {
          if (res.confirm) {
            const data = await deleteAddress(id);
            uni.showToast({ title: "删除成功" });
            this.getData();
          }
        },
      });
    },
    // 导入微信地址
    async importAddress() {
      // const data = await getWXAddress();
      // uni.showToast({ title: "导入成功" });
      // this.getData();
    },
    getWxAddress() {
      let that = this;
      // #ifdef MP
      uni.authorize({
        scope: "scope.address",
        success: function () {
          uni.chooseAddress({
            success: function (resAddress) {
              const addressData = {
                username: resAddress.userName,
                province: resAddress.provinceName,
                city: resAddress.cityName,
                district: resAddress.countyName,
                detail: resAddress.detailInfo,
                tel: resAddress.telNumber,
                mainField: 0,
              };
              that.addAddress(addressData);
            },
            fail: function (res) {
              console.log(res);
              if (res.errMsg == "chooseAddress:cancel")
                return that.$util.Tips({
                  title: "取消选择",
                });
            },
          });
        },
        fail: function (res) {
          // console.log(res);
          uni.showModal({
            title: "您已拒绝导入微信地址权限",
            content: "是否进入权限管理，调整授权？",
            success(res) {
              if (res.confirm) {
                uni.openSetting({
                  success: function (res) {},
                });
              } else if (res.cancel) {
                return that.$util.Tips({ title: "已取消！" });
              }
            },
          });
        },
      });
      // #endif
    },
    // 添加
    async addAddress(address) {
      const data = await addAddress(address);
      uni.showToast({ title: "导入成功" });
    },
    // 隐藏手机号
    getTel(tel) {
      return getTel(tel);
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 10rpx 0;
  .top {
    display: flex;
    font-weight: bold;
    font-size: 34rpx;
    .phone {
      margin-left: 60rpx;
    }
    .tag {
      display: flex;
      font-weight: normal;
      align-items: center;
      .tagText {
        display: block;
        width: 60rpx;
        height: 34rpx;
        line-height: 34rpx;
        color: #ffffff;
        font-size: 20rpx;
        border-radius: 6rpx;
        text-align: center;
        margin-left: 30rpx;
        background-color: rgb(49, 145, 253);
      }
      .red {
        background-color: red;
      }
    }
  }
  .bottom {
    display: flex;
    margin-top: 20rpx;
    font-size: 28rpx;
    justify-content: space-between;
    color: #999999;
  }
}
.footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 99;
  .bottom-div {
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    padding: 30rpx 20rpx;
    justify-content: space-around;
    width: calc(100% - 52rpx);
    line-height: 80rpx;
  }
}

.addSite,
.import-address {
  background-color: $uni-bg-color;
  border-radius: 10rpx;
  font-size: 30rpx;
  width: 45%;
  text-align: center;
  color: #ffffff;
}
.import-address {
  background-color: #ffffff;
  color: #000000;
}
.divider {
  width: 100%;
  height: 12rpx;
  position: absolute;
  left: 0;
  background: #efefef;
}
</style>
