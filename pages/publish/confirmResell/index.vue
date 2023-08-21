<template>
  <view class="confirmResellBox">
    <CommonContainer title="确认转卖信息">
      <view class="content">
        <view
          class="box resellGoodsBox"
          :style="{ maxHeight: `${scrollHeight}px` }"
        >
          <view
            class="resellGoodsItem"
            v-for="item in resellList"
            :key="item.key"
          >
            <image class="mainImg" :src="item.rewardImage" />
            <view class="goodsInfo">
              <view>{{ item.rewardName }}</view>
              <view>单价：￥{{ toYuan(item.price) }}</view>
              <view>数量：{{ item.pick }}</view>
            </view>
          </view>
        </view>
      </view>
    </CommonContainer>
    <!-- 转卖操作 -->
    <view class="operateBox shadow-lg">
      <view>
        预计收入
        <text style="color: red; font-size: 40rpx">￥{{ income }}</text>
        <text style="margin-left: 16rpx">手续费:{{ fee }}</text>
      </view>
      <view class="btn" @click="handleResell">确认转卖</view>
    </view>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import { createResellOrder } from "@/api/publish";
// 工具
import { toYuan, accAdd, accMul, accDiv, accSub, toFixed } from "@/utils";

export default {
  name: "ConfirmResell",
  components: {
    CommonContainer,
  },
  props: {},
  data() {
    return {
      saleRate: 0,
      talentId: null,
      saleBagList: [],
      resellList: [],
      income: 0,
      fee: 0,
      scrollHeight: 0,
    };
  },
  onLoad(options) {
    const { saleRate, talentId, list = "" } = options || {};
    this.saleRate = +saleRate;
    this.talentId = +talentId;
    this.resellList = JSON.parse(decodeURIComponent(list));
    this.init();
    this.getScrollHeight("resellGoodsBox");
  },
  methods: {
    // 滚动区高度
    getScrollHeight(className = "scrollBox") {
      const that = this;
      uni.getSystemInfo({
        success: function (res) {
          const windowHeight = res.windowHeight;
          const query = uni.createSelectorQuery();
          query
            .select(`.${className}`)
            .boundingClientRect((rect) => {
              const scrollHeight = windowHeight - rect.top;
              that.scrollHeight = scrollHeight - 130;
            })
            .exec();
        },
      });
    },
    toYuan(val) {
      return toYuan(val);
    },
    init() {
      const saleBagList = [];
      let incomeFen = 0;
      this.resellList.forEach((item) => {
        saleBagList.push({
          freeGoodsId: item.freeGoodsId,
          price: item.price,
          rewardNumber: item.pick,
          rewardType: item.rewardType,
          targetGoodsId: item.targetGoodsId,
        });
        const salePrice = accMul(item.price || 0, item.pick || 0);
        incomeFen = accAdd(salePrice, incomeFen);
      });
      const saleAmount = toFixed(accDiv(incomeFen || 0, 100), 2);
      this.fee = toFixed(
        accDiv(toFixed(accMul(incomeFen || 0, this.saleRate), 2), 100),
        2
      );
      this.income = toFixed(accSub(saleAmount, this.fee), 2);
      this.saleBagList = saleBagList;
    },
    // 创建转卖订单
    async createResellOrder() {
      const data = await createResellOrder({
        talentId: this.talentId,
        saleBagList: this.saleBagList,
      });
      uni.navigateTo({
        url: `/pages/publish/resellSuccess/index`,
      });
    },
    handleResell() {
      if (this.saleBagList.length === 0) {
        uni.$u.toast("请先选择转卖商品");
        return;
      }
      this.createResellOrder();
    },
  },
};
</script>
<style lang="scss">
.confirmResellBox {
  .content {
    padding-bottom: 190rpx;
    .resellGoodsBox {
      padding: 40rpx 40rpx 20rpx;
      overflow: scroll;
      .resellGoodsItem {
        display: flex;
        margin-bottom: 30rpx;
        padding-bottom: 30rpx;
        border-bottom: 1px solid $uni-border-color;

        .mainImg {
          border-radius: 12rpx;
          width: 160rpx;
          height: 160rpx;
          background-color: $uni-bg-color-grey;
        }
        .goodsInfo {
          margin-left: 20rpx;
        }
      }
    }
  }
  .operateBox {
    position: fixed;
    bottom: 0;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    height: 180rpx;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;

    .btn {
      width: 200rpx;
      height: 80rpx;
      border-radius: 14rpx;
      color: #fff;
      line-height: 80rpx;
      text-align: center;
      background-color: $uni-bg-color;
    }
  }
}
</style>
