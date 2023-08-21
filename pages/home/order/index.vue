<template>
  <view class="orderContainer">
    <CommonContainer title="订单确认">
      <!-- 运输方式 -->
      <view class="deliveryMethodBox">
        <view>
          <view
            class="deliveryMethod"
            @click="chooseExpressType(ORDER_TYPE.PLACE_REWARD_BAG)"
          >
            <view>存至赏袋，方便合并发货</view>
            <u-icon
              :name="
                isDirectShipment ? 'checkmark-circle' : 'checkmark-circle-fill'
              "
              :color="themeColor"
              size="24"
            ></u-icon>
          </view>
          <!-- style="border-bottom: 1px dashed #999" -->
          <view class="deliveryMethod" @click="goToMiniProgram">
            <view class="name">
              {{ platItem.name || "" }}（{{
                platItem.bind ? "已绑定" : "未绑定"
              }}）
            </view>
            <view v-if="!platItem.bind" class="empowerBox">
              <text class="empowerText">去绑定</text>
              <u-icon name="arrow-right" color="#c0c0c0" size="16"></u-icon>
            </view>
          </view>
        </view>
        <!-- 直接发货 -->
        <!-- <view
          class="deliveryMethod"
          @click="chooseExpressType(ORDER_TYPE.DIRECT_SHIPMENT)"
        >
          <view>直接发货</view>
          <u-icon
            :name="
              isDirectShipment ? 'checkmark-circle-fill' : 'checkmark-circle'
            "
            :color="themeColor"
            size="24"
          ></u-icon>
        </view>
        <view class="addressBox">
          <view>
            <view>{{ currentAddressInfo.address || "" }}</view>
            <view
              >{{ currentAddressInfo.username || "" }}
              {{ currentAddressInfo.tel || "" }}</view
            >
          </view>
          <u-icon
            name="arrow-right"
            size="20"
            color="#c0c0c0"
            @click="chooseAddress"
          ></u-icon>
        </view> -->
      </view>
      <!-- 订单 商品信息 -->
      <view class="skuSumFeeBox">
        <view class="skuInfoBox">
          <image class="mainImg" mode="aspectFill" :src="orderInfo.mainUrl" />
          <view class="skuInfo">
            <view class="title">{{ orderInfo.name }}</view>
            <view class="saleUserBox">
              <view class="saleUser" v-for="item in saleList" :key="item.id">
                <image
                  class="saleUserImg"
                  :src="item.avatarUrl || '/static/images/icons/logo.png'"
                />
                <text class="saleUserText"
                  >¥{{ toYuan(item.goodsPrice) }} x{{ item.orderNum }}</text
                >
              </view>
            </view>
            <view class="feeBox">
              <u-number-box
                v-model="totalNum"
                integer
                :max="storeNum || orderInfo.resaleNum"
              ></u-number-box>
            </view>
          </view>
        </view>
        <view class="skuFee">
          <view class="item">
            <view class="left">商品总计</view>
            <view class="right">¥{{ showAmout.totalGoodsAmount }}</view>
          </view>
          <view class="item">
            <view class="left">运费</view>
            <view class="right">{{
              isDirectShipment ? showAmout.deliveryAmount : "免运费"
            }}</view>
          </view>
          <view class="item">
            <view class="left"></view>
            <view class="right" style="display: flex; align-items: baseline">
              <view class="sumNum">共{{ totalNum }}件 合计：</view>
              <text class="sumPriceText sumPrice"
                >￥{{ showAmout.totalAmount }}</text
              >
            </view>
          </view>
        </view>
      </view>
      <!-- 交易说明 -->
      <view class="transactionTipBox">
        <view class="title">交易说明</view>
        <view class="content">{{ orderInfo.description }}</view>
      </view>
    </CommonContainer>
    <!-- 提交按钮 -->
    <view class="submitBox">
      <view class="submit" @click="submit">确认上述信息并支付</view>
    </view>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 常量
import { themeColor } from "@/config/theme";
import { ORDER_TYPE } from "@/consts";
// 工具
import { toYuan, accAdd, setStorage } from "@/utils";
// service
import {
  fetchGoodsDetail,
  fetchOrderPrice,
  fetchOrderPriceBySale,
} from "@/api/home";
import { getAddressList } from "@/api/myInfo";
import { fetchBagList } from "@/api/publish";
import { talentBind } from "@/api/common";

let timer = null;

export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      id: null,
      talentId: null,
      goodsSaleId: null,
      themeColor,
      isDirectShipment: false,
      orderInfo: {
        name: "",
      },
      storeNum: 0,
      totalNum: 1,
      showDeliveryAmount: 0,
      originAmout: {
        deliveryAmount: 0,
        totalGoodsAmount: 0,
        totalAmount: 0,
      },
      showAmout: {
        deliveryAmount: 0,
        totalGoodsAmount: 0,
        totalAmount: 0,
      },
      ORDER_TYPE,
      currentAddressInfo: {
        address: "",
        username: "",
        tel: "",
      },
      saleList: [],
      platItem: {},
    };
  },
  onLoad(options) {
    const { id = "", talentId = "", goodsSaleId = "" } = options;
    this.id = +id;
    this.talentId = +talentId;
    this.goodsSaleId = +goodsSaleId;
    this.getGoodsDetail(+id);
    this.getOrderPrice(1);
    this.getAddressList();
    // 查询平台赏袋列表
    this.getBagList();
  },
  onShow() {
    uni.$on("returnAddressData", (data) => {
      if (data && data.currentAddressId) {
        uni.$off("returnAddressData", this.returnAddressData);
        this.getAddressList(data.currentAddressId);
      }
    });
    const bindCode = uni.getStorageSync("weChatBindCode");
    const bindOpenId = uni.getStorageSync("weChatBindOpenId");
    if (bindCode && bindOpenId) {
      this.bind(bindCode, bindOpenId);
    }
  },
  onUnload() {
    clearInterval(timer);
    uni.removeStorageSync("weChatBindCode");
    uni.removeStorageSync("weChatBindOpenId");
  },
  watch: {
    // 修改商品数量
    totalNum(val) {
      this.getOrderPrice(val);
    },
  },
  methods: {
    toYuan(val) {
      return toYuan(val);
    },
    // 商品详情
    async getGoodsDetail(id) {
      const {
        name = "",
        goodsDetail,
        recommendPrice,
        mainUrl,
        resaleNum,
      } = await fetchGoodsDetail({ id });
      this.orderInfo = {
        name,
        description: goodsDetail || "",
        recommendPrice: recommendPrice || 0,
        mainUrl: mainUrl || "",
        resaleNum,
      };
    },
    // 订单价格
    async getOrderPrice(number) {
      let data = null;
      // 购买个人售卖的商品
      if (this.goodsSaleId) {
        let orderDetailList = [
          {
            goodsNum: number,
            goodsSaleId: this.goodsSaleId,
          },
        ];
        data = await fetchOrderPriceBySale({
          addressId: this.currentAddressInfo.id || null,
          orderType: this.isDirectShipment
            ? ORDER_TYPE.PLACE_REWARD_BAG
            : ORDER_TYPE.DIRECT_SHIPMENT,
          payWay: "ALI_QR",
          orderDetailList,
        });
      } else {
        // 购买当前在售价格最低的商品
        data = await fetchOrderPrice({
          goodsId: this.id,
          talentId: this.talentId,
          number,
        });
      }
      const { deliveryAmount = 0, orderAmount = 0, saleList } = data || {};
      if (orderAmount === 0) {
        uni.showToast({
          title: "库存不足",
          icon: "none",
          duration: 2000,
        });
      }
      this.originAmout = {
        deliveryAmount,
        totalGoodsAmount: orderAmount,
        totalAmount: this.isDirectShipment
          ? accAdd(orderAmount, deliveryAmount)
          : orderAmount,
      };
      this.showAmout = {
        deliveryAmount: toYuan(deliveryAmount),
        totalGoodsAmount: toYuan(orderAmount),
        totalAmount: this.isDirectShipment
          ? toYuan(accAdd(orderAmount, deliveryAmount))
          : toYuan(orderAmount),
      };
      this.saleList = saleList || [];
      if (this.goodsSaleId) {
        this.storeNum = saleList[0].storeNum
          ? parseInt(saleList[0].storeNum)
          : 0;
      }
    },
    // 地址列表
    async getAddressList(addressId) {
      const data = await getAddressList();
      const addressList = data || [];
      let current = {};
      if (addressId) {
        current = addressList.filter((item) => item.id === addressId)[0];
      } else {
        current = addressList.length > 0 ? addressList[0] : {};
      }
      const { province = "", city = "", district = "", detail = "" } = current;
      this.currentAddressInfo = {
        ...current,
        address: `${province}${city}${district}${detail}`,
      };
    },
    // 平台赏袋
    async getBagList() {
      const data = await fetchBagList();
      const plats = (data || []).filter((item) => this.talentId === item.id);
      this.platItem = (plats || [])[0] || null;
    },
    goToMiniProgram() {
      const { bind, appid, bindUrl } = this.platItem;
      if (!bind) {
        uni.openEmbeddedMiniProgram({
          appId: appid || "",
          path: `${bindUrl || ""}?weChatSource=free-transaction-miniapp`,
          // develop（开发版），trial（体验版），release（正式版）
          envVersion:
            process.env.NODE_ENV === "production" ? "release" : "trial",
        });
      }
    },
    async bind(bindCode, openid) {
      await talentBind({ bindCode, openid, talendId: this.talentId });
      uni.showToast({
        title: "小程序绑定成功",
        icon: "none",
        duration: 2000,
      });
      uni.removeStorageSync("weChatBindCode");
      uni.removeStorageSync("weChatBindOpenId");
      this.platItem.bind = true;
    },
    // 修改商品数量
    // numChange(e) {
    //   this.totalNum = +e.value;
    //   this.getOrderPrice(+e.value);
    // },
    // 选择发货类型
    chooseExpressType(val) {
      if (val === ORDER_TYPE.PLACE_REWARD_BAG) {
        this.isDirectShipment = false;
        this.originAmout.totalAmount = this.originAmout.totalGoodsAmount;
        this.showAmout.totalAmount = this.showAmout.totalGoodsAmount;
        return;
      }
      if (val === ORDER_TYPE.DIRECT_SHIPMENT) {
        this.isDirectShipment = true;
        this.originAmout.totalAmount = accAdd(
          this.originAmout.totalGoodsAmount,
          this.originAmout.deliveryAmount
        );
        this.showAmout.totalAmount = accAdd(
          this.showAmout.totalGoodsAmount,
          this.showAmout.deliveryAmount
        );
      }
    },
    // 选择地址
    chooseAddress() {
      uni.navigateTo({
        url: `/pages/me/address/index/index?chooseAddress=1&currentAddressId=${
          this.currentAddressInfo.id || ""
        }`,
      });
    },
    // 提交订单
    submit() {
      if (this.showAmout.totalGoodsAmount === 0) {
        uni.showToast({
          title: "库存不足",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      const totalAmount = this.originAmout.totalAmount;
      const params = {
        addressId: this.currentAddressInfo.id || null,
        orderDetailList: this.saleList.map((item) => {
          const nextItem = {
            goodsNum: item.orderNum,
            goodsSaleId: item.id,
          };
          return nextItem;
        }),
        orderType: this.isDirectShipment
          ? ORDER_TYPE.DIRECT_SHIPMENT
          : ORDER_TYPE.PLACE_REWARD_BAG,
        // payWay: "ALI_QR",
      };
      uni.showModal({
        title: "提示",
        content: `请确认订单信息无误？`,
        success: (res) => {
          if (res.confirm) {
            setStorage("createOrderParams", params);
            uni.navigateTo({
              url: `/pages/home/cashier/index?totalAmount=${totalAmount}`,
            });
            // this.createOrder();
          }
        },
      });
    },
  },
};
</script>
<style lang="scss">
.orderContainer {
  // 运输方式
  .deliveryMethodBox {
    // display: flex;
    // justify-content: space-between;
    padding: 20rpx;
    box-sizing: border-box;
    border-radius: 24rpx;
    background-color: #fff;

    .deliveryMethod {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // width: 334rpx;
      height: 80rpx;

      .empowerBox {
        display: flex;
        align-items: center;

        .empowerText {
          font-size: 24rpx;
          color: $uni-text-color-grey;
        }
      }
    }
    .addressBox {
      display: flex;
      justify-content: space-between;
      color: $uni-text-color-grey;
      font-size: 24rpx;
    }
  }
  // 订单商品信息
  .skuSumFeeBox {
    margin-top: 32rpx;
    padding: 26rpx 20rpx 38rpx;
    border-radius: 24rpx;
    background-color: #fff;

    .skuInfoBox {
      display: flex;
      padding-bottom: 32rpx;
      border-bottom: 1px dashed #bbbbbb;

      .mainImg {
        width: 176rpx;
        height: 176rpx;
        background-color: #f3f4f6;
      }

      .skuInfo {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 22rpx;
        width: 450rpx;

        .title {
          font-weight: bold;
          font-size: 26rpx;
          color: #222222;
        }
        .saleUserBox {
          display: flex;
          flex-wrap: wrap;
          margin-top: 22rpx;

          .saleUser {
            display: flex;
            align-items: center;
            margin-right: 10rpx;
            .saleUserImg {
              width: 32rpx;
              height: 32rpx;
              border-radius: 40rpx;
              background-color: $uni-bg-color-grey;
            }
            .saleUserText {
              margin-left: 8rpx;
              font-size: 20rpx;
              color: #bfbfbf;
            }
          }
        }
        .feeBox {
          display: flex;
          flex-direction: row-reverse;
        }
      }
    }
    .skuFee {
      margin-top: 34rpx;
      font-size: 24rpx;
      color: #222222;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 32rpx;

        .right {
          color: #666666;
        }
        .sumNum {
          font-size: 28rpx;
          font-weight: bold;
        }
        .sumPrice {
          font-size: 38rpx;
          font-weight: bold;
          color: #ff3835;
          .sumPriceText {
            font-size: 36rpx;
          }
        }
      }
    }
  }
  // 交易说明
  .transactionTipBox {
    margin-top: 32rpx;
    padding: 20rpx 20rpx 30rpx;
    border-radius: 24rpx;
    background-color: #fff;

    .title {
      color: #333333;
      font-size: 28rpx;
      font-weight: bold;
    }
    .content {
      margin-top: 12rpx;
      font-size: 24rpx;
      color: #9a9a9a;
    }
  }
  .submitBox {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 180rpx;
    background-color: #fff;

    .submit {
      width: 70%;
      color: #fff;
      height: 80rpx;
      line-height: 80rpx;
      font-size: 30rpx;
      font-weight: bold;
      text-align: center;
      border-radius: 50rpx;
      background-color: $uni-bg-color;
    }
  }
}
</style>
