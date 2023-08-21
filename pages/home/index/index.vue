<template>
  <div class="indexContainer">
    <CommonContainer title="首页" :showBack="false">
      <template v-slot:search>
        <view @click="goToSearch">
          <Search class="search" />
        </view>
      </template>
      <view class="content">
        <!-- style="height: 86vh" -->
        <scroll-view
          class="scrollBox"
          :scroll-top="scrollTop"
          scroll-y="true"
          :style="{ height: `${scrollHeight}px` }"
          @scrolltolower="lower"
        >
          <!-- 金刚位 -->
          <VajraBox />
          <!-- 专区 -->
          <SalesZone />
          <!-- 轮播图 -->
          <Banner />
          <view class="ipListBox">
            <!-- <view
            style="
              position: sticky;
              top: 200rpx;
              z-index: 999999999;
              background-color: #fff;
            "
          >
          </view> -->
            <ScrollList :list="typeList" @select="select" />
            <!-- ip列表，瀑布流展示 -->
            <!-- <WaterFlow
              v-if="flowList.length > 0"
              v-model="flowList"
              style="margin-top: 28rpx"
              ref="uWaterfall"
            >
              <template v-slot:left="{ leftList }">
                <SeriesItem
                  v-for="item in leftList"
                  :key="item.id"
                  :info="item"
                  :searchType="currentSearchType"
                  @like="like"
                />
              </template>
              <template v-slot:right="{ rightList }">
                <SeriesItem
                  v-for="item in rightList"
                  :key="item.id"
                  :info="item"
                  :searchType="currentSearchType"
                  @like="like"
                />
              </template>
            </WaterFlow> -->
            <custom-waterfalls-flow
              v-if="flowList.length > 0"
              ref="uWaterfall"
              :value="flowList"
              :column="2"
              :columnSpace="1.5"
              :imageKey="imageKey"
              @imageClick="imageClick"
            >
              <!-- #ifdef MP-WEIXIN -->
              <view
                v-for="(item, index) in flowList"
                :key="index"
                slot="slot{{index}}"
              >
                <SeriesItem
                  :info="item"
                  :searchType="currentSearchType"
                  @like="like"
                />
              </view>
              <!-- #endif -->
              <!-- #ifndef MP-WEIXIN -->
              <template v-slot:default="item">
                <SeriesItem
                  :info="item"
                  :searchType="currentSearchType"
                  @like="like"
                />
              </template>
              <!-- #endif -->
            </custom-waterfalls-flow>
            <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
            <view
              class="scrollBottom"
              v-if="
                flowList.length >= queryParams.pageSize &&
                nextPageList &&
                nextPageList.length < queryParams.pageSize
              "
            >
              到底了~
            </view>
          </view>
        </scroll-view>
      </view>
    </CommonContainer>
  </div>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import Search from "@/components/search";
import ScrollList from "@/components/scrollList";
import Banner from "@/components/banner";
// import WaterFlow from "@/components/waterFlow";
// import WaterFall from "@/components/waterFall";
import CustomWaterfallsFlow from "@/components/custom-waterfalls-flow";
// 自定义业务组件
import VajraBox from "./components/vajraBox";
import SalesZone from "./components/salesZone";
import SeriesItem from "./components/seriesItem";
// 常量
import { SEARCH_TYPE, SEARCH_SERIES_TYPE } from "@/consts";
// utils
import { getQueryParams } from "@/utils";
import { getToken } from "@/utils/auth";
// service
import { fetchGoodsList, addRelation, deleteRelation } from "@/api/common";

export default {
  components: {
    CommonContainer,
    Search,
    VajraBox,
    SalesZone,
    Banner,
    ScrollList,
    // WaterFlow,
    // WaterFall,
    CustomWaterfallsFlow,
    SeriesItem,
  },
  data() {
    return {
      queryParams: {
        searchType: SEARCH_TYPE.SERIES,
        categorySortField: SEARCH_SERIES_TYPE.LATEST,
        pageNo: 1,
        pageSize: 10,
      },
      typeList: [
        {
          id: 1,
          title: "最新系列",
          searchType: SEARCH_TYPE.SERIES,
          categorySortField: SEARCH_SERIES_TYPE.LATEST,
        },
        {
          id: 2,
          title: "热门系列",
          searchType: SEARCH_TYPE.SERIES,
          categorySortField: SEARCH_SERIES_TYPE.POPULARITY,
        },
        {
          id: 3,
          title: "热门款式",
          searchType: SEARCH_TYPE.IP_STYLE,
          categorySortField: SEARCH_SERIES_TYPE.POPULARITY,
        },
      ],
      currentSearchType: SEARCH_TYPE.SERIES,
      flowList: [],
      isLogin: !!getToken("token"),
      imageKey: "iconUrl",
      nextPageList: null,
      scrollHeight: 0,
    };
  },
  onLoad() {
    this.getCategoryList();
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
              that.scrollHeight = scrollHeight;
            })
            .exec();
        },
      });
    },
    lower() {
      this.getCategoryList({ pageNo: this.queryParams.pageNo + 1 });
    },
    /**
     * 跳转至搜索页
     */
    goToSearch() {
      uni.navigateTo({
        url: "/pages/home/search/index",
      });
    },
    /**
     * 系列列表
     */
    async getCategoryList(restParams = {}) {
      const params = { ...this.queryParams, ...restParams };
      const data = await fetchGoodsList(params);
      const { categoryList = [], goodsList = [] } = data || {};
      if (params.searchType === SEARCH_TYPE.SERIES) {
        this.nextPageList = categoryList || [];
        this.flowList = [...this.flowList, ...categoryList].map((item) => {
          item.searchType = SEARCH_TYPE.SERIES;
          return item;
        });
        this.queryParams = getQueryParams(params, categoryList);
      } else if (params.searchType === SEARCH_TYPE.IP_STYLE) {
        this.nextPageList = goodsList || [];
        this.flowList = [...this.flowList, ...goodsList].map((item) => {
          item.searchType = SEARCH_TYPE.IP_STYLE;
          return item;
        });
        this.queryParams = getQueryParams(params, goodsList);
      }
    },
    select(info) {
      const queryParams = {
        searchType: info.searchType,
        categorySortField: info.categorySortField,
        pageNo: 1,
      };
      this.imageKey =
        info.searchType === SEARCH_TYPE.IP_STYLE ? "mainUrl" : "iconUrl";
      this.flowList = [];
      this.getCategoryList(queryParams);
    },
    imageClick(info) {
      const { id = "", searchType } = info;
      if (searchType === SEARCH_TYPE.SERIES) {
        uni.navigateTo({
          url: `/pages/home/seriesDetail/index?id=${id}`,
        });
        return;
      }
      uni.navigateTo({
        url: `/pages/home/skuDetail/index?id=${id}`,
      });
    },
    /**
     * 喜欢
     */
    async like({ targetId, relationType, related, info }) {
      // 取消 喜欢
      if (related) {
        this.cancelLike(targetId, relationType, info);
        return;
      }
      // 喜欢
      await addRelation({ targetId, relationType });
      this.flowList = this.flowList.map((item) => {
        if (targetId === item.id) {
          item.related = true;
          item.followNum = info.followNum + 1;
        }
        return item;
      });
      // this.$refs.uWaterfall.modify(targetId, "related", true);
      // this.$refs.uWaterfall.modify(targetId, "followNum", info.followNum + 1);
      uni.showToast({
        title: "点赞了",
        icon: "none",
      });
    },
    /**
     * 取消 喜欢
     */
    async cancelLike(targetId, relationType, info) {
      await deleteRelation({ targetId, relationType });
      this.flowList = this.flowList.map((item) => {
        if (targetId === item.id) {
          item.related = false;
          item.followNum = info.followNum - 1;
        }
        return item;
      });
      // this.$refs.uWaterfall.modify(targetId, "related", false);
      // this.$refs.uWaterfall.modify(targetId, "followNum", info.followNum - 1);
      uni.showToast({
        title: "取消赞了",
        icon: "none",
      });
    },
  },
};
</script>

<style lang="scss">
.indexContainer {
  // height: 100vh;
  color: #333333;
  background-color: #f9f9f9;

  .search {
    position: absolute;
    top: 100rpx;
    left: 26rpx;
    width: 260rpx;
  }

  .content {
    .scrollBox {
      margin-top: 32rpx;
      .scrollBottom {
        padding-bottom: 50rpx;
        color: #999;
        text-align: center;
      }
    }
    .ipListBox {
    }
  }
}
</style>
