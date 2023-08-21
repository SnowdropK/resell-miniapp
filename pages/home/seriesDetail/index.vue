<template>
  <div class="seriesDetailContainer">
    <CommonContainer title="系列">
      <view class="content">
        <!-- 头部 -->
        <view class="seriesHeaderBox">
          <view class="seriesHeader">
            <image
              class="seriesImg"
              mode="aspectFill"
              :src="seriesDetail.iconUrl"
            />
            <view class="seriesInfo">
              <view>
                <view class="seriesTitle">{{ seriesDetail.name }}</view>
                <view class="followNumber"
                  >{{ seriesDetail.followNum }}人关注</view
                >
              </view>
            </view>
          </view>
          <!-- 操作按钮 -->
          <view class="seriesHeaderBtns">
            <view
              class="followBtn btn"
              @click.stop="
                follow({
                  targetId: categoryId,
                  relationType: RELATION_TYPE.FOLLOW_SERIES,
                  related: seriesDetail.related,
                })
              "
              >{{ seriesDetail.related ? "已关注" : "关 注" }}</view
            >
            <!-- <view class="saleBtn btn" @click="sale">出 售</view> -->
          </view>
        </view>
        <!-- 搜索栏 -->
        <view style="margin-top: 32rpx">
          <Search @search="handleSearch" />
        </view>
        <!-- 转卖ip sku列表：瀑布流 -->
        <!-- style="margin-top: 32rpx; max-height: 83vh" -->
        <scroll-view
          class="scrollBox"
          :style="{ height: `${scrollHeight}px` }"
          :scroll-top="scrollTop"
          scroll-y="true"
          @scrolltolower="lower"
        >
          <!-- <WaterFlow :list="flowList">
            <template v-slot:left="{ leftList }">
              <SkuItem
                v-for="item in leftList"
                :key="item.id"
                :info="item"
                @like="like"
              />
            </template>
            <template v-slot:right="{ rightList }">
              <SkuItem
                v-for="item in rightList"
                :key="item.id"
                :info="item"
                @like="like"
              />
            </template>
          </WaterFlow> -->
          <!-- <WaterFall v-model="flowList" ref="uWaterfall">
            <template v-slot:left="{ leftList }">
              <SkuItem
                v-for="item in leftList"
                :key="item.id"
                :info="item"
                @like="like"
              />
            </template>
            <template v-slot:right="{ rightList }">
              <SkuItem
                v-for="item in rightList"
                :key="item.id"
                :info="item"
                @like="like"
              />
            </template>
          </WaterFall> -->
          <custom-waterfalls-flow
            v-if="flowList.length > 0"
            ref="uWaterfall"
            :value="flowList"
            :column="2"
            :columnSpace="1.5"
            imageKey="mainUrl"
            @imageClick="imageClick"
          >
            <!-- #ifdef MP-WEIXIN -->
            <view
              v-for="(item, index) in flowList"
              :key="index"
              slot="slot{{index}}"
            >
              <SkuItem :info="item" @like="like" />
            </view>
            <!-- #endif -->
            <!-- #ifndef MP-WEIXIN -->
            <template v-slot:default="item">
              <SkuItem :info="item" @like="like" />
            </template>
            <!-- #endif -->
          </custom-waterfalls-flow>
          <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
          <view
            class="scrollBottom"
            v-if="
              flowList.length >= 2 &&
              nextPageList &&
              nextPageList.length < queryParams.pageSize
            "
          >
            到底了~
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
// import WaterFlow from "@/components/waterFlow";
// import WaterFall from "@/components/waterFall";
import CustomWaterfallsFlow from "@/components/custom-waterfalls-flow";
// 自定义业务组件
import SkuItem from "./components/skuItem";
// 常量
import { SEARCH_TYPE, RELATION_TYPE } from "@/consts";
// utils
import { getQueryParams } from "@/utils";
// service
import { fetchSeriesDetail } from "@/api/home";
import { addRelation, deleteRelation, fetchGoodsList } from "@/api/common";

export default {
  components: {
    CommonContainer,
    Search,
    // WaterFlow,
    // WaterFall,
    CustomWaterfallsFlow,
    SkuItem,
  },
  data() {
    return {
      categoryId: null,
      RELATION_TYPE,
      queryParams: {
        categoryId: null,
        pageNo: 1,
        pageSize: 10,
        search: "",
        searchType: SEARCH_TYPE.IP_STYLE,
      },
      seriesDetail: {
        iconUrl: "",
        followNum: 0,
        name: "",
        related: false,
      },
      flowList: [],
      nextPageList: null,
      scrollHeight: 0,
    };
  },
  onLoad(options) {
    const { id = "" } = options || {};
    this.categoryId = +id;
    this.getSeriesDetail();
    this.getGoodsList({ categoryId: +id });
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
      this.getGoodsList({ pageNo: this.queryParams.pageNo + 1 });
    },
    /**
     * 系列详情
     */
    async getSeriesDetail() {
      const data = await fetchSeriesDetail({ id: this.categoryId });
      const { iconUrl = "", followNum = 0, name = "", related = false } =
        data || {};
      this.seriesDetail = { iconUrl, followNum, name, related };
    },

    /**
     * 商品列表
     */
    async getGoodsList(restParams = {}) {
      const params = { ...this.queryParams, ...restParams };
      const data = await fetchGoodsList(params);
      const { goodsList = [] } = data || {};
      this.queryParams = getQueryParams(params, goodsList);
      this.flowList = [...this.flowList, ...goodsList];
      this.nextPageList = goodsList || [];
    },
    imageClick(info) {
      const { id = "" } = info;
      uni.navigateTo({
        url: `/pages/home/skuDetail/index?id=${id}`,
      });
    },
    /**
     * 关注
     */
    async follow({ targetId, relationType, related }) {
      // 取消 关注
      if (related) {
        this.cancelFollow(targetId, relationType);
        return;
      }
      // 关注
      await addRelation({ targetId, relationType });
      this.getSeriesDetail();
      uni.showToast({
        title: "关注成功",
        icon: "none",
      });
    },
    /**
     * 取消 关注
     */
    async cancelFollow(targetId, relationType) {
      await deleteRelation({ targetId, relationType });
      this.getSeriesDetail();
      uni.showToast({
        title: "取消成功",
        icon: "none",
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
      // this.$refs.uWaterfall.modify(targetId, "related", true);
      // this.$refs.uWaterfall.modify(targetId, "followNum", info.followNum + 1);
      this.flowList = this.flowList.map((item) => {
        if (targetId === item.id) {
          item.related = true;
          item.followNum = info.followNum + 1;
        }
        return item;
      });
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
      // this.$refs.uWaterfall.modify(targetId, "related", false);
      // this.$refs.uWaterfall.modify(targetId, "followNum", info.followNum - 1);
      this.flowList = this.flowList.map((item) => {
        if (targetId === item.id) {
          item.related = false;
          item.followNum = info.followNum - 1;
        }
        return item;
      });
      uni.showToast({
        title: "取消赞了",
        icon: "none",
      });
    },
    /**
     * 出售
     */
    sale() {},
    handleSearch(val) {
      this.flowList = [];
      this.getGoodsList({ search: val, pageNo: 1 });
    },
  },
};
</script>
<style lang="scss">
.seriesDetailContainer {
  // height: 100%;
  // background-color: #f9f9f9;

  .content {
    .seriesHeaderBox {
      .seriesHeader {
        display: flex;
        justify-content: space-between;

        .seriesInfo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 24rpx;
          width: 78%;

          .seriesTitle {
            font-size: 32rpx;
            font-weight: bold;
            color: #333333;
          }
          .followNumber {
            font-size: 24rpx;
            color: #7b7b7b;
          }
        }
      }
      .seriesImg {
        border-radius: 12rpx;
        width: 124rpx;
        height: 124rpx;
        background-color: $uni-bg-color-grey;
      }
      .seriesHeaderBtns {
        // display: flex;
        // justify-content: space-between;
        margin-top: 32rpx;

        .btn {
          // width: 334rpx;
          height: 80rpx;
          border-radius: 12rpx;
          font-size: 32rpx;
          line-height: 80rpx;
          text-align: center;
          color: #fff;
        }
        .followBtn {
          // background-color: #ff8249;
          background-color: #4966ff;
        }
        .saleBtn {
          background-color: #4966ff;
        }
      }
    }
    .scrollBox {
      margin-top: 32rpx;

      .scrollBottom {
        padding-top: 20rpx;
        padding-bottom: 50rpx;
        color: #999;
        text-align: center;
      }
    }
  }
}
</style>
