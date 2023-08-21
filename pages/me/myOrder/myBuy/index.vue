<template>
  <view class="myBuyBox">
    <CommonContainer title="我买到的" :scroll="false">
      <view class="content">
        <view class="searchOperateBox">
          <RenDropdownFilter
            :filterData="filterData"
            :defaultIndex="defaultIndex"
            @onSelected="onSelected"
          />
          <!-- 搜索框 -->
          <Search
            class="search"
            :placeholder="
              searchKey === 'goodsTitle' ? '请输入商品名' : '请输入订单号'
            "
            @search="search"
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
              <BuyOrderItem
                :info="item"
                :isBuy="true"
                @operate="getBuyOrderList()"
              />
            </view>
          </view>
          <!-- <u-list v-if="orderList.length > 0">
            <u-list-item v-for="item in orderList" :key="item.id">
              <BuyOrderItem
                :info="item"
                :isBuy="true"
                @operate="getBuyOrderList()"
              />
            </u-list-item>
          </u-list> -->
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
import Search from "@/components/search";
import RenDropdownFilter from "@/components/ren-dropdown-filter";
// 自定义业务组件
import BuyOrderItem from "../components/buyOrderItem";
// 常量
import { themeColor } from "@/config/theme";
import { ORDER_STATUS_MAP } from "@/consts";
// servie
import { fetchBuyOrder } from "@/api/me";

export default {
  name: "MyBuy",
  components: {
    CommonContainer,
    Search,
    RenDropdownFilter,
    BuyOrderItem,
  },
  data() {
    return {
      searchKey: "goodsTitle",
      themeColor,
      currentOrderStatus: null,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        goodsTitle: "",
        orderId: null,
        status: null,
      },
      orderStatusList: [
        { id: 1, title: "全部", val: null },
        { id: 2, title: "待发货", val: ORDER_STATUS_MAP.TO_BE_SHIPPED },
        { id: 3, title: "待收货", val: ORDER_STATUS_MAP.TO_BE_RECEIVED },
        { id: 4, title: "已完成", val: ORDER_STATUS_MAP.FINISHED },
        { id: 5, title: "退款中", val: ORDER_STATUS_MAP.REFUNDING },
      ],
      orderList: [],
      filterData: [
        [
          { text: "商品名", value: "goodsTitle" },
          { text: "订单号", value: "orderId" },
        ],
      ],
      defaultIndex: [0],
      scrollHeight: 0,
      nextPageList: null,
    };
  },
  onLoad() {
    this.getBuyOrderList();
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
    onSelected(res) {
      const searchKey = res[0][0].value;
      this.searchKey = searchKey;
    },
    // 购买订单列表
    async getBuyOrderList(restParams) {
      const params = {
        ...this.queryParams,
        ...restParams,
      };
      const nextOrderList = params.pageNo === 1 ? [] : this.orderList;
      try {
        const { records } = await fetchBuyOrder(params);
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
      this.getBuyOrderList({ pageNo: this.queryParams.pageNo + 1 });
    },
    // 搜索
    search(val) {
      if (this.searchKey === "orderId" && isNaN(val)) {
        uni.showToast({
          title: "请输入数字",
          icon: "error",
          duration: 2000,
        });
        return;
      }
      this.getBuyOrderList({ [this.searchKey]: val, pageNo: 1 });
    },
    // 选择订单类型
    handleSelectOrderType(item) {
      if (item.id === 2) {
        this.orderList = [];
        return;
      }
      this.getBuyOrderList({ status: null, pageNo: 1 });
    },
    // 选择标签
    handleClickTag(item) {
      this.currentOrderStatus =
        item.val === this.currentOrderStatus ? null : item.val;
      this.getBuyOrderList({ status: this.currentOrderStatus, pageNo: 1 });
    },
  },
};
</script>
<style lang="scss">
.myBuyBox {
  .content {
    .searchOperateBox {
      // position: sticky;
      // top: 180rpx;
      display: flex;
      align-items: center;
      border-radius: 100rpx;
      // overflow: hidden;
      background-color: #fff;
      .search {
        flex: 1;
      }
    }
    .scrollBox {
      padding: 0 100rpx;
    }
    .orderStatusBox {
      // z-index: 99999;
      // position: sticky;
      // top: 256rpx;
      margin-top: 32rpx;
      display: flex;
      justify-content: space-between;
      font-size: 24rpx;
    }
    .orderListBox {
      // height: 100%;
      // overflow: scroll;
      // height: 60vh;
      margin-top: 32rpx;
      /* 减去头部和底部的高度 */
      // height: calc(100vh - 398rpx);
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
