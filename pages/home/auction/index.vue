<template>
  <view class="auctionContainer">
    <CommonContainer title="拍卖列表">
      <Search style="width: 96%" />
      <view class="content">
        <!-- 分类列表 -->
        <view style="margin-top: 32rpx">
          <ScrollList :list="categoryList" />
        </view>
        <!-- 标签列表 -->
        <view class="tagsBox">
          <u-tag
            v-for="item in tags"
            class="tag"
            :text="item.title"
            :key="item.id"
            :color="currentId === item.id ? '#fff' : '#C2C2C2'"
            :borderColor="currentId === item.id ? themeColor : '#fff'"
            :bgColor="currentId === item.id ? themeColor : '#fff'"
            shape="circle"
            @click="handleClickTag(item)"
          ></u-tag>
        </view>
        <!-- 转卖ip sku列表 -->
        <view class="skuListBox">
          <scroll-view
            v-if="skuList.length > 0"
            :scroll-top="scrollTop"
            scroll-y="true"
            style="height: 80vh"
            @scrolltolower="lower"
          >
            <view v-for="item in skuList" :key="item.id">
              <AuctionSku :info="item" />
            </view>
          </scroll-view>
          <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
        </view>
      </view>
    </CommonContainer>
  </view>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import Search from "@/components/search";
import ScrollList from "@/components/scrollList";
// 自定义业务组件
import AuctionSku from "./components/auctionSku";
// 常量
import { themeColor } from "@/config/theme";
// service
import { fetchCategoryList } from "@/api/home";

export default {
  name: "Auction",
  components: {
    CommonContainer,
    Search,
    AuctionSku,
    ScrollList,
  },
  data() {
    return {
      themeColor,
      tags: [
        { id: 1, title: "最新截拍" },
        { id: 2, title: "最多竞拍" },
        { id: 3, title: "最低价格" },
      ],
      categoryList: [],
      skuList: [],
      currentId: null,
    };
  },
  onLoad() {
    const current = this.tags.length ? this.tags[0] : {};
    this.currentId = current.id;
    this.getCategoryList();
  },
  methods: {
    lower() {
      //  this.getCategoryList({ pageNo: this.queryParams.pageNo + 1 });
    },
    async getCategoryList() {
      const data = await fetchCategoryList();
      const nextCategoryList = (data || []).map((item) => ({
        id: item.id,
        title: item.name,
      }));
      this.categoryList = [{ id: "", title: "全部" }, ...nextCategoryList];
    },
    handleClickTag(item) {
      this.currentId = item.id === this.currentId ? null : item.id;
    },
  },
};
</script>
<style lang="scss">
.auctionContainer {
  .content {
    .tagsBox {
      display: flex;
      justify-content: space-between;
      margin-top: 32rpx;
      .tag {
      }
    }
    .skuListBox {
      margin-top: 32rpx;
    }
  }
}
</style>
