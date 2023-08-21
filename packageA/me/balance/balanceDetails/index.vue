<template>
  <view class="balanceDetailsContainer">
    <CommonContainer title="余额明细">
      <view class="content">
        <!-- 状态列表 -->
        <ScrollList
          :scroll="false"
          :list="statusList"
          @select="handleSelectStatus"
        />
        <!-- 列表 -->
        <scroll-view
          class="scrollBox"
          scroll-y="true"
          :style="{ height: `${scrollHeight}px` }"
          @scrolltolower="scrolltolower"
        >
          <view v-if="list.length > 0">
            <view v-for="item in list" :key="item.id" class="balanceBar">
              <view>
                <view>{{ item.tradeDesc || "" }}</view>
                <view>{{ item.createTime }}</view>
              </view>
              <view>{{ toYuan(item.amount) }}</view>
            </view>
          </view>
          <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
          <view
            class="scrollBottom"
            v-if="
              list.length >= 10 &&
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
// 工具
import { toYuan, getScrollHeight } from "@/utils";
// service
import { getBalanceHistory } from "@/api/me";

export default {
  name: "BalanceDetails",
  components: {
    CommonContainer,
    ScrollList,
  },
  data() {
    return {
      queryParams: {
        pageNo: 1,
        pageSize: 15,
      },
      statusList: [
        { id: 1, title: "全部", val: null },
        { id: 2, title: "收入", val: 2 },
        { id: 3, title: "支出", val: 1 },
      ],
      list: [],
      nextPageList: null,
      scrollHeight: 0,
    };
  },
  onLoad() {
    this.getList();
    this.getScrollHeight("scrollBox");
  },
  methods: {
    // 分转元
    toYuan(val = 0) {
      return val ? toYuan(val) : 0;
    },
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
    async getList(restParams = {}) {
      const params = {
        ...this.queryParams,
        ...restParams,
      };
      const nextList = params.pageNo === 1 ? [] : this.list;
      try {
        const { records } = await getBalanceHistory(params);
        this.list = [...nextList, ...(records || [])];
        this.nextPageList = records || [];
        this.queryParams = params;
      } catch {
        uni.showToast({
          title: "出错了",
          icon: "error",
          duration: 2000,
        });
      }
    },
    handleSelectStatus(item) {
      this.getList({ tradeType: item.val, pageNo: 1 });
    },
    scrolltolower() {
      this.getList({ pageNo: this.queryParams.pageNo + 1 });
    },
  },
};
</script>

<style lang="scss">
.balanceDetailsContainer {
  .content {
    .scrollBox {
      margin-top: 20rpx;
      /* 减去头部和底部的高度 */
      // height: calc(100vh - 200rpx);
      overflow-y: auto; /* 允许垂直滚动 */

      .balanceBar {
        margin-bottom: 10rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10rpx 30rpx;
        background-color: #fff;
      }
      .scrollBottom {
        padding-bottom: 50rpx;
        color: #999;
        text-align: center;
      }
    }
  }
}
</style>
