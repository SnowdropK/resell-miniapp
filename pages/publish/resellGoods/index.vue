<template>
  <view class="resellGoodsContainer">
    <CommonContainer title="选择转卖商品">
      <view class="content">
        <!-- 转卖商品 -->
        <view class="resellIpBox box">
          <u-collapse
            :border="false"
            @open="openCollapse"
            @close="closeCollapse"
          >
            <u-collapse-item
              v-for="item in bagSkuList"
              :key="item.freeGoodsId"
              :title="`${item.name}（共${item.number}个赏品）`"
              :name="item.freeGoodsId"
            >
              <!-- <u-icon name="tags-fill" size="20" slot="icon"></u-icon>
              <text slot="value" style="color: red">自定义内容</text> -->
              <!-- v-if="(skuIpMap[item.freeGoodsId] || []).length > 0" -->
              <Grid
                v-if="collapseMap[item.freeGoodsId]"
                :currentFreeGoodsId="item.freeGoodsId"
                :list="skuIpMap[item.freeGoodsId]"
                :recommendPrice="item.recommendPrice || 0"
                @showPop="showPop"
              />
            </u-collapse-item>
          </u-collapse>
        </view>
        <!-- 选择转卖商品数量价格弹窗 -->
        <GoodsPop
          v-if="showChooseNumModal"
          :show="showChooseNumModal"
          :info="popInfo"
          :form="popForm"
          :saleRate="platConfig.saleRate"
          @closePop="closePop"
          @save="saveChooseGoods"
        />
      </view>
    </CommonContainer>
    <!-- 下单操作单 -->
    <view class="operateBox shadow-lg">
      <view style="display: flex; align-items: center">
        已选<text class="pickNumber"> {{ pickNumber }} </text> 个/共<text>
          {{ totalNumber }} </text
        >个
        <u-icon
          class="ml-1"
          name="info-circle"
          color="#c0c0c0"
          size="20"
          @click="showTipModal"
        ></u-icon>
      </view>
      <view class="btn" @click="handleResell">一键转卖</view>
    </view>
    <!-- 赏贷shuo -->
    <!-- <u-modal :show="showModal" title="发布成功" :content='content'></u-modal> -->
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 自定义业务组件
import Grid from "./components/grid";
import GoodsPop from "./components/goodsPop";
// 工具
import { accAdd, accMul, accDiv } from "@/utils";
// service
import { fetchPlatConfig } from "@/api/common";
import { fetchBagSkuList, fetchBagSkuIpList } from "@/api/publish";

export default {
  name: "ResellGoods",
  components: {
    CommonContainer,
    Grid,
    GoodsPop,
  },
  data() {
    return {
      // collapseList: [],
      platConfig: {},
      showChooseNumModal: false,
      talentId: null,
      currentFreeGoodsId: 0,
      currentGoods: {},
      bagSkuList: [],
      skuIpMap: {},
      collapseMap: {},
      pickNumber: 0,
      totalNumber: 0,
      popInfo: {
        key: null,
        rewardName: "",
        showNumber: 0,
        recommendPrice: 0,
      },
      popForm: {
        showPrice: null,
        pick: 0,
      },
    };
  },
  onLoad(options) {
    const { id } = options;
    this.talentId = +id;
    // 获取平台配置
    this.fetchPlatConfig();
    // 赏袋平台下款式的赏品IP列表
    this.getBagSkuList();
  },
  methods: {
    // 获取平台配置
    async fetchPlatConfig() {
      const data = await fetchPlatConfig();
      this.platConfig = data;
    },
    // 赏袋平台下款式的赏品IP列表
    async getBagSkuIpList(goodsId) {
      const data = await fetchBagSkuIpList({
        talentId: this.talentId,
        goodsId,
      });
      this.skuIpMap[goodsId] = (data || []).map((item) => {
        item.pick = 0;
        item.showPrice = null;
        item.price = 0;
        item.fee = 0;
        item.key = `${item.targetGoodsId}${item.rewardType}`;
        return item;
      });
      // 重新触发列表渲染
      this.bagSkuList = [...this.bagSkuList];
      // this.bagSkuList.map((item) => {
      //   if (item.freeGoodsId === goodsId) {
      //     item.skuIps = nextSkuIps;
      //   }
      //   return item;
      // });

      // if (Object.keys(this.skuIpMap).length === bagSkuList.length) {
      //   this.bagSkuList = bagSkuList;
      // }
    },
    // 赏袋平台下的款式列表
    async getBagSkuList() {
      const data = await fetchBagSkuList({ talentId: this.talentId });
      let totalNumber = 0;
      // this.collapseList = (data || []).map((item) => item.freeGoodsId);
      // const bagSkuList = [data[0], { ...data[0], freeGoodsId: 7 }] || [];
      (data || []).forEach((item, index) => {
        totalNumber = accAdd(totalNumber, item.showNumber);
        // this.getBagSkuIpList(item.freeGoodsId, bagSkuList);
      });
      this.bagSkuList = data || [];
      this.totalNumber = totalNumber;
    },
    // 折叠面板事件：打开
    openCollapse(key) {
      this.collapseMap[key] = true;
      if (this.skuIpMap[key]) return;
      this.getBagSkuIpList(key);
    },
    // 折叠面板事件：关闭
    closeCollapse(key) {
      this.collapseMap = { ...this.collapseMap, [key]: false };
    },
    // 显示商品选择弹窗
    showPop(item, currentFreeGoodsId) {
      this.showChooseNumModal = true;
      this.currentGoods = item;
      this.popInfo = {
        key: item.key,
        rewardName: item.rewardName,
        showNumber: item.showNumber,
        recommendPrice: item.recommendPrice,
      };
      this.popForm = { showPrice: item.showPrice, pick: item.pick };
      this.currentFreeGoodsId = currentFreeGoodsId;
    },
    // 关闭商品选择弹窗
    closePop() {
      this.showChooseNumModal = false;
      this.currentGoods = {};
      this.popInfo = {
        key: null,
        rewardName: "",
        showNumber: 0,
        recommendPrice: 0,
      };
      this.popForm = {
        showPrice: null,
        pick: 0,
      };
    },
    // 保存选择的商品信息
    saveChooseGoods(form) {
      const list = this.skuIpMap[this.currentFreeGoodsId];
      let pickNumber = 0;
      this.skuIpMap[this.currentFreeGoodsId] = list.map((item) => {
        if (item.key === this.popInfo.key) {
          item = {
            ...item,
            price: accMul(+form.showPrice, 100),
            showPrice: form.showPrice,
            pick: form.pick,
          };
        }
        return item;
      });
      Object.keys(this.skuIpMap).forEach((id) => {
        this.skuIpMap[id].forEach((item) => {
          pickNumber = accAdd(pickNumber, item.pick);
        });
      });
      this.pickNumber = pickNumber;
      this.closePop();
    },
    // 一键转卖
    handleResell() {
      const { saleRate } = this.platConfig;
      const list = [];
      this.bagSkuList.forEach((item) => {
        (this.skuIpMap[item.freeGoodsId] || []).forEach((skuIpItem) => {
          if (skuIpItem.pick) {
            list.push({ ...skuIpItem, freeGoodsId: item.freeGoodsId });
          }
        });
      });
      if (list.length === 0) {
        uni.$u.toast("请选择转卖商品");
        return;
      }
      uni.navigateTo({
        url: `/pages/publish/confirmResell/index?talentId=${
          this.talentId
        }&saleRate=${saleRate}&list=${encodeURIComponent(
          JSON.stringify(list)
        )}`,
      });
    },
    showTipModal() {
      uni.showModal({
        title: "赏袋说明",
        showCancel: false,
        confirmText: "知道了",
        content:
          "当前仅展示可在本平台转卖的赏品，如有想要转卖未展示的商品请联系相应平台客服",
      });
    },
  },
};
</script>
<style lang="scss">
.resellGoodsContainer {
  .u-collapse {
    .u-collapse-item {
      .u-collapse-item__content {
        height: auto !important;
      }
    }
  }
  .content {
    padding-bottom: 120rpx;
    .resellIpBox {
      height: 70vh;
      overflow: scroll;
      margin-bottom: 32rpx;
      padding: 40rpx 0;
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

    .pickNumber {
      color: red;
      font-size: 40rpx;
    }

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
