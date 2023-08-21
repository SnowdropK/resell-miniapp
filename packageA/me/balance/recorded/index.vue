<template>
  <view class="recordedContainer">
    <CommonContainer title="待入账明细">
      <view class="content">
        <!-- 订单列表 -->
        <scroll-view
          class="orderListBox"
          :style="{ height: `${scrollHeight}px` }"
          scroll-y="true"
          @scrolltolower="scrolltolower"
        >
          <view v-if="orderList.length > 0">
            <view v-for="item in orderList" :key="item.id">
              <OrderItem :info="item" />
            </view>
          </view>
          <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
          <view
            class="scrollBottom"
            v-if="
              orderList.length >= 10 &&
              nextPageList &&
              nextPageList.length < queryParams.pageSize
            "
          >
            到底了~
          </view>
        </scroll-view>
      </view>
    </CommonContainer>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 自定义业务组件
import OrderItem from "./components/orderItem";
// 常量
import { themeColor } from "@/config/theme";
import { ORDER_STATUS_MAP } from "@/consts";
// servie
import { fetchSellOrder } from "@/api/me";

export default {
  name: "Recorded",
  components: {
    CommonContainer,
    OrderItem,
  },
  data() {
    return {
      themeColor,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        goodsTitle: "",
        orderId: null,
        status: null,
        transferStatusBoolean: false,
      },
      orderList: [],
      nextPageList: null,
      scrollHeight: 0,
    };
  },
  onLoad() {
    this.getSellOrderList();
    this.getScrollHeight("orderListBox");
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
              var scrollHeight = windowHeight - rect.top;
              that.scrollHeight = scrollHeight;
            })
            .exec();
        },
      });
    },
    async getSellOrderList(restParams) {
      const params = {
        ...this.queryParams,
        ...restParams,
      };
      const nextOrderList = params.pageNo === 1 ? [] : this.orderList;
      try {
        const { records } = await fetchSellOrder(params);
        this.queryParams = { ...params };
        this.orderList = [...nextOrderList, ...(records || [])];
        this.nextPageList = records || [];
      } catch {
        uni.showToast({
          title: "出错了",
          icon: "error",
          duration: 2000,
        });
      }
    },
    scrolltolower() {
      this.getSellOrderList({ pageNo: this.queryParams.pageNo + 1 });
    },
  },
};
</script>
<style lang="scss">
.recordedContainer {
  .content {
    .orderListBox {
      margin-top: 32rpx;
      /* 减去头部和底部的高度 */
      // height: calc(100vh - 230rpx);
      overflow-y: auto; /* 允许垂直滚动 */

      .scrollBottom {
        padding-bottom: 50rpx;
        color: #999;
        text-align: center;
      }
    }
  }
}
</style>
