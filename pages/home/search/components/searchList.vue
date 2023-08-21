<template>
  <view class="">
    <search-header :keyword="keyword" @commit="search"></search-header>
    <!-- 筛选 -->
    <view class="mt-2">
      <ScrollList
        :defaultId="selectId"
        :list="typeList"
        :scroll="false"
        @select="selectScroll"
      />
    </view>

    <scroll-view
      :scroll-top="0"
      scroll-y="true"
      :refresher-threshold="100"
      style="margin-top: 28rpx; height: 70vh"
      @scrolltolower="loadMore"
    >
      <!-- 全部 -->
      <view v-if="selectId === 1" class="">
        <list-item
          v-if="seriesList.length > 0"
          name="系列"
          :list="seriesList"
          @onMore="onMore"
        ></list-item>
        <list-item
          v-if="styleList.length > 0"
          name="款式"
          :ifStyle="true"
          :list="styleList"
          @onMore="onMore"
        >
          <template v-slot:style="{ price }">
            <!-- slot="style" slot-scope="props" -->
            <view class="position-absolute price">
              <text v-if="price">￥</text>
              <text class="price-text">{{ toYuan(price) || "-" }}</text>
            </view>
          </template>
        </list-item>
        <list-item
          v-if="userList.length > 0"
          name="用戶"
          :list="userList"
          :ifUser="true"
          @onMore="onMore"
        ></list-item>
        <u-empty
          v-if="!userList.length & !styleList.length & !seriesList.length"
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
      </view>
      <!-- 系列 -->
      <view v-if="selectId === 2" class="">
        <list-item name="系列" :more="false" :list="seriesList"></list-item>
        <u-empty
          v-if="!seriesList.length"
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
        <!-- 上拉加载更多 -->
        <view
          v-else
          class="d-flex a-center j-center text-light-muted font-md py-3"
          @click="loadMore"
        >
          {{ loadtext }}
        </view>
      </view>
      <!-- 款式 -->
      <view v-if="selectId === 3" class="">
        <list-item
          name="款式"
          :more="false"
          :ifStyle="true"
          :list="styleList"
          imgSize="160rpx"
        >
          <template v-slot:style="{ price }">
            <view class="position-absolute price">
              <text v-if="price">￥</text>
              <text class="price-text">{{ toYuan(price) || "-" }}</text>
            </view>
          </template>
        </list-item>
        <u-empty
          v-if="!styleList.length"
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
        <view
          v-else
          class="d-flex a-center j-center text-light-muted font-md py-3"
        >
          {{ loadtext }}
        </view>
      </view>
      <!-- 用戶 -->
      <view v-if="selectId === 4" class="">
        <list-item
          name="用戶"
          :more="false"
          :list="userList"
          :ifUser="true"
        ></list-item>
        <u-empty
          v-if="!userList.length"
          mode="data"
          icon="/static/images/bgs/empty.png"
          text="没有更多了"
        ></u-empty>
        <view
          v-else
          class="d-flex a-center j-center text-light-muted font-md py-3"
        >
          {{ loadtext }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import SearchHeader from "@/components/searchHeader/index.vue";
import ScrollList from "@/components/scrollList";
// 自定义业务组件
import ListItem from "./list.vue";
import CardTitle from "./cardTitle.vue";
// 工具
import { toYuan } from "@/utils";
// service
import { searchAll, searchSort } from "@/api/search";

export default {
  name: "searchList",
  components: {
    CommonContainer,
    SearchHeader,
    ScrollList,
    ListItem,
    CardTitle,
  },
  props: {
    searchValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 1.上拉加载更多 2.加载中... 3.没有更多了
      loadtext: "上拉加载更多",
      keyword: this.searchValue,
      searchParams: {
        pageNo: 1,
        pageSize: 10,
        search: "",
        // 搜索类型：1-系列；2-款式；3-用户
        searchType: 1,
      },
      list: [],
      typeList: [
        { id: 1, title: "全部" },
        { id: 2, title: "系列" },
        { id: 3, title: "款式" },
        { id: 4, title: "用户" },
      ],
      selectId: 1,
      seriesList: [],
      // 款式列表
      styleList: [],
      userList: [],
    };
  },
  watch: {
    searchValue(v) {
      this.keyword = v;
    },
  },
  created() {
    // 加载数据
    this.searchAll();
  },
  methods: {
    // 搜索全部
    async searchAll(v) {
      const data = await searchAll({ search: this.keyword, pageSize: 3 });
      // console.log(this.keyword);
      this.seriesList = data.categoryList || [];
      this.styleList = data.goodsList || [];
      this.userList = data.userList || [];
    },
    // 搜索单个
    async searchSort() {
      const data = await searchSort(this.searchParams);
      if (data) {
        this.seriesList = data.categoryList
          ? [...this.seriesList, ...data.categoryList]
          : [];
        this.styleList = data.goodsList
          ? [...this.styleList, ...data.goodsList]
          : [];
        this.userList = data.userList
          ? [...this.userList, ...data.userList]
          : [];
      }
      // 加载状态
      this.filterText(data);
    },
    // 初始化搜索
    initSearch() {
      this.selectId = 1;
      this.searchParams.pageNo = 1;
    },
    // 加载更多/触底加载
    loadMore() {
      if (this.loadtext === "没有更多了" || this.selectId == 1) return;
      this.loadtext = "加载中...";
      this.searchParams.pageNo++;
      this.searchSort();
    },
    // 搜索
    search(v) {
      if (!v) {
        this.$emit("clear");
        return;
      }
      this.keyword = v;
      this.initSearch();
      this.searchAll();
    },
    // 切换标签卡
    selectScroll(item) {
      // console.log(item);
      this.selectId = item.id;
      this.searchParams.pageNo = 1;
      this.searchParams.search = this.keyword;
      this.seriesList = [];
      this.styleList = [];
      this.userList = [];

      if (item.id === 1) {
        this.searchAll();
      } else {
        this.searchParams.searchType = item.id - 1;
        this.searchSort();
      }
    },
    onMore(v) {
      console.log(v);
      if (v === "系列") {
        this.selectId = 2;
        this.searchParams.searchType = 1;
      } else if (v === "款式") {
        this.searchParams.searchType = 2;
        this.selectId = 3;
      } else {
        this.searchParams.searchType = 3;
        this.selectId = 4;
      }
      this.searchSort();
    },
    // 过滤加载状态
    filterText(data) {
      let list = [];
      if (data) {
        if (this.selectId === 2) {
          list = data.categoryList;
        } else if (this.selectId === 3) {
          list = data.goodsList;
        } else if (this.selectId === 4) {
          list = data.userList;
        }
      }
      this.loadtext = list.length < 10 ? "没有更多了" : "上拉加载更多";
    },
    toYuan(val) {
      return toYuan(val);
    },
    goBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.border {
  border: 3rpx solid;
}
.price {
  color: #ea5334;
  right: 20px;
  bottom: 10px;
  font-size: 28rpx;
  .price-text {
    font-size: 40rpx;
  }
}
</style>
