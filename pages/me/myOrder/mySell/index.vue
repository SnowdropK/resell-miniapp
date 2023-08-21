<template>
  <view class="mySellBox">
    <CommonContainer title="我卖出的">
      <view class="content">
        <!-- 订单类型列表 -->
        <view class="scrollBox">
          <ScrollList
            :list="orderTypeList"
            :scroll="false"
            @select="handleSelectOrderType"
          />
        </view>
        <!-- 订单状态列表 -->
        <view class="orderStatusBox">
          <u-tag
            v-for="item in orderStatusList"
            class="tag"
            :text="item.title"
            :key="item.id"
            :color="currentOrderStatus === item.val ? '#fff' : '#C2C2C2'"
            :borderColor="currentOrderStatus === item.val ? themeColor : '#fff'"
            :bgColor="currentOrderStatus === item.val ? themeColor : '#fff'"
            shape="circle"
            @click="handleClickTag(item)"
          ></u-tag>
        </view>
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
              orderList.length >= 5 &&
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
import ScrollList from "@/components/scrollList";
// 自定义业务组件
import OrderItem from "../components/orderItem";
// 常量
import { themeColor } from "@/config/theme";
import { ORDER_STATUS_MAP } from "@/consts";
// servie
import { fetchSellOrder } from "@/api/me";

export default {
  name: "MySell",
  components: {
    CommonContainer,
    ScrollList,
    OrderItem,
  },
  data() {
    return {
      themeColor,
      currentOrderStatus: null,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        goodsTitle: "",
        orderId: null,
        status: null,
      },
      orderTypeList: [
        { id: 1, title: "转卖订单" },
        { id: 2, title: "闲置订单" },
      ],
      orderStatusList: [
        { id: 1, title: "全部", val: null },
        { id: 2, title: "待发货", val: ORDER_STATUS_MAP.TO_BE_SHIPPED },
        { id: 3, title: "待收货", val: ORDER_STATUS_MAP.TO_BE_RECEIVED },
        { id: 4, title: "已完成", val: ORDER_STATUS_MAP.FINISHED },
        { id: 5, title: "退款中", val: ORDER_STATUS_MAP.REFUNDING },
      ],
      orderList: [],
      scrollHeight: 0,
      nextPageList: null,
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
    handleSelectOrderType(item) {
      if (item.id === 2) {
        this.orderList = [];
        return;
      }
      this.getSellOrderList({ status: null, pageNo: 1 });
    },
    handleClickTag(item) {
      this.currentOrderStatus =
        item.val === this.currentOrderStatus ? null : item.val;
      this.getSellOrderList({ status: this.currentOrderStatus, pageNo: 1 });
    },
  },
};
</script>
<style lang="scss">
.mySellBox {
  .content {
    .scrollBox {
      padding: 0 100rpx;
    }
    .orderStatusBox {
      display: flex;
      justify-content: space-between;
      margin-top: 32rpx;
      font-size: 24rpx;
    }
    .orderListBox {
      margin-top: 32rpx;
      /* 减去头部和底部的高度 */
      // height: calc(100vh - 426rpx);
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
