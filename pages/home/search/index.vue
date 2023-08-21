<template>
  <view class="">
    <CommonContainer title="搜索">
      <search-header
				v-if="isHot"
        :keyword="keyword"
        :reset="resetHistory"
        @commit="search"
      ></search-header>
      <!-- 搜索历史 -->
      <view v-if="isHot" class="my-3">
        <view v-if="showHistory" class="d-flex">
          <text class="font-35">最近搜索</text>
					<view class="ml-auto" @click="clearHistory">
						<u-icon
						  size="20"
						  name="trash-fill"
						  :color="themeColor"
						></u-icon>
					</view>
        </view>
        <search-tag :list="historyList" @search="search"></search-tag>
        <view class="py-1 scroll-div">
          <ScrollList :list="typeList" @select="selectScroll" />
        </view>
        <view class="">
          <view
            class="d-flex a-center my-2"
            v-for="(item, index) in list"
            :key="index"
						@click="onDetail(item)"
          >
            <view v-if="index < 3" class="">
							<image class="img-sort" :src="imgList[index].img" />
            </view>
            <view v-else class="text-sort">{{ index + 1 }}</view>
						<image class="mainImg mx-2" :src="item.iconUrl || item.mainUrl" mode="aspectFill" />
            <view class="span24-12 text-hide">{{ item.name }}</view>
          </view>
        </view>
      </view>
			
			<!-- 搜索结果 -->
			<SearchList v-else :searchValue="keyword" @clear="clearSearch" />
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import ScrollList from "@/components/scrollList";
import SearchHeader from "@/components/searchHeader/index.vue";
// 自定义业务组件
import SearchTag from "./components/searchTag.vue";
import SearchList from "./components/searchList.vue";
// 常量
import { themeColor } from "@/config/theme";
// service
import { hotTopList, favTopList } from "@/api/search";

export default {
  name: "Search",
  components: {
    CommonContainer,
    ScrollList,
    SearchHeader,
    SearchTag,
		SearchList,
  },
  data() {
    return {
      keyword: "",
      selectId: 1,
      showHistory: false,
      resetHistory: false,
      themeColor: themeColor,
      typeList: [
        { id: 1, title: "热门系列" },
        { id: 2, title: "热门款式" },
      ],
      imgList: [
        { id: 1, img: require("@/static/images/search/first.png") },
        { id: 2, img: require("@/static/images/search/second.png") },
        { id: 3, img: require("@/static/images/search/third.png") },
      ],
      historyList: [],
      list: [],
			 // 系列列表
      seriesList: [],
			 // 款式列表
      styleList: [],
			// 搜索框是否有值，无值时展示热门列表，有值则为搜索结果列表
			isHot: true,
    };
  },
  watch: {
    historyList(v) {
      this.showHistory = v.length > 0;
    },
  },
  onShow() {
    // 加载历史记录
    this.getHistoryList();
  },
  created() {
    this.hotTopList();
    this.favTopList();
  },
  methods: {
    // 热门款式
    async hotTopList() {
      const data = await hotTopList();
      this.styleList = data || [];
      // console.log(data);
    },
    // 热门系列
    async favTopList() {
      const data = await favTopList();
      this.seriesList = data || [];
      this.list = data || [];
    },
		// 加载历史记录
		getHistoryList() {
			let history = uni.getStorageSync("searchHistory");
			this.historyList = history ? JSON.parse(history) : [];
			if (this.historyList.length > 0) {
			  this.showHistory = true;
			}
		},
    // 搜索
    search(v) {
      // this.keyword = v;
			this.clearSearch(v);
    },
    // 切换标签卡
    selectScroll(item) {
      this.selectId = item.id;
      if (item.id === 1) {
        this.list = this.seriesList;
      } else {
        this.list = this.styleList;
      }
    },
		// 详情
		onDetail(item) {
			if (this.selectId === 1) {
			  uni.navigateTo({
			    url: "/pages/home/seriesDetail/index?id=" + item.id,
			  });
			} else {
			 uni.navigateTo({
			   url: "/pages/home/skuDetail/index?id=" + item.id,
			 });
			}
		},
    // 清除搜索记录
    clearHistory() {
      uni.showModal({
        title: "提示",
        content: "是否清除搜索历史？",
        cancelText: "取消",
        confirmText: "清除",
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync("searchHistory");
            this.showHistory = false;
            this.resetHistory = true;
            this.historyList = [];
          }
        },
      });
    },
		// 返回热门列表状态
		clearSearch(v) {
			this.keyword = v || '';
			if (v) {
				this.isHot = false;
			} else {
				this.isHot = true;
			}
			this.getHistoryList();
		},
    goBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
.text-sort {
  width: 64rpx;
  font-size: 40rpx;
  color: #ff4f1a;
  text-align: center;
}
.img-sort {
	width: 64rpx;
	height: 60rpx;
}
.mainImg {
	width: 64rpx;
	height: 64rpx;
	background-color: $uni-bg-color-grey;
}
</style>
