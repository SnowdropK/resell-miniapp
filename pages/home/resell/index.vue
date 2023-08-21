<template>
  <view class="resellContainer">
    <CommonContainer title="转卖列表">
      <view class="content">
        <!-- 分类列表 -->
        <ScrollList :list="categoryList" @select="handleSelectCategory" />
        <!-- 标签列表 -->
        <view class="tagsBox">
          <u-tag
            v-for="item in sortTags"
            class="tag"
            :text="item.title"
            :key="item.id"
            :color="currentSortField === item.id ? '#fff' : '#C2C2C2'"
            :borderColor="currentSortField === item.id ? themeColor : '#fff'"
            :bgColor="currentSortField === item.id ? themeColor : '#fff'"
            shape="circle"
            @click="handleClickTag(item)"
          ></u-tag>
        </view>
        <!-- 转卖ip goods列表 -->
        <view class="goodsListBox">
          <scroll-view
            :scroll-top="scrollTop"
            scroll-y="true"
            class="scrollBox"
            :style="{ height: `${scrollHeight}px` }"
            @scrolltolower="lower"
          >
            <block v-if="goodsList.length > 0">
              <view v-for="item in goodsList" :key="item.id">
                <ResellSku :info="item" />
              </view>
            </block>
            <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
            <view
              class="scrollBottom"
              v-if="
                goodsList.length >= queryParams.pageSize &&
                nextPageList &&
                nextPageList.length < queryParams.pageSize
              "
            >
              到底了~
            </view>
          </scroll-view>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import ScrollList from "@/components/scrollList";
// 自定义业务组件
import ResellSku from "./components/resellSku";
// utils
import { getQueryParams } from "@/utils";
// 常量
import { themeColor } from "@/config/theme";
import { SEARCH_TYPE } from "@/consts";
// service
import { fetchCategoryList } from "@/api/home";
import { fetchGoodsList } from "@/api/common";

export default {
  name: "Resell",
  components: {
    CommonContainer,
    ResellSku,
    ScrollList,
  },
  data() {
    return {
      themeColor,
      categoryList: [],
      sortTags: [
        { id: 1, title: "最新转卖" },
        { id: 2, title: "最多购买" },
        { id: 3, title: "最多在售" },
        { id: 4, title: "最低价格" },
      ],
      goodsList: [],
      currentSortField: 1,
      queryParams: {
        categoryId: null,
        sortField: 1,
        searchType: SEARCH_TYPE.IP_STYLE,
        pageNo: 1,
        pageSize: 10,
        hasSaleNum: true,
      },
      scrollHeight: 0,
      nextPageList: null,
    };
  },
  onLoad() {
    this.getCategoryList();
    this.getList();
  },
  onReady() {
    this.getScrollHeight();
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
              that.scrollHeight = scrollHeight - 32;
            })
            .exec();
        },
      });
    },
    lower() {
      this.getList({ pageNo: this.queryParams.pageNo + 1 });
    },
    handleSelectCategory(item) {
      this.goodsList = [];
      this.getList({ categoryId: item.id, pageNo: 1 });
    },
    handleClickTag(item) {
      this.goodsList = [];
      this.currentSortField =
        item.id === this.currentSortField ? null : item.id;
      this.getList({ sortField: this.currentSortField, pageNo: 1 });
    },
    async getCategoryList() {
      const data = await fetchCategoryList();
      const nextCategoryList = (data || []).map((item) => ({
        id: item.id,
        title: item.name,
      }));
      this.categoryList = [{ id: "", title: "全部" }, ...nextCategoryList];
    },
    async getList(restParams) {
      const params = {
        ...this.queryParams,
        ...restParams,
      };
      const data = await fetchGoodsList(params);
      const { goodsList = [] } = data || {};
      this.queryParams = getQueryParams(params, goodsList);
      this.goodsList = [...this.goodsList, ...goodsList];
      this.nextPageList = goodsList || [];
    },
  },
};
</script>
<style lang="scss">
.resellContainer {
  .content {
    .tagsBox {
      display: flex;
      justify-content: space-between;
      margin-top: 32rpx;
    }
    .goodsListBox {
      margin-top: 32rpx;

      .scrollBox {
        overflow-y: auto;

        .scrollBottom {
          padding-bottom: 50rpx;
          color: #999;
          text-align: center;
        }
      }
    }
  }
}
</style>
