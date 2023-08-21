<template>
  <view class="pocket-main">
    <CommonContainer title="正在出售">
      <search-header
        :keyword="queryParams.goodsTitle"
        @commit="search"
      ></search-header>
      <!-- 列表 -->
      <view class="">
        <scroll-view
          :scroll-top="scrollTop"
          scroll-y="true"
          :refresher-threshold="100"
          style="margin-top: 28rpx; height: 75vh"
          @scrolltolower="lower"
        >
          <view
            class="info shadow px-2 py-3 rounded-10 bg-white"
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="left">
              <image
                class="w-100 h100 ml-auto"
                :src="item.mainUrl"
                mode="aspectFit"
              ></image>
            </view>
            <view class="center">
              <view class="font-md font-weight">{{ item.goodsTitle }}</view>
              <view class=""
                >单价：{{ "￥" + toYuan(item.goodsPrice) || "-" }}</view
              >
              <view class="">数量：{{ item.storeNum }}</view>
            </view>
            <view class="right">
              <u-icon
                name="edit-pen"
                :color="themeColor"
                size="28"
                @click="showModel(item)"
              ></u-icon>
              <u-icon
                class="ml-2"
                name="trash"
                :color="themeColor"
                size="28"
                @click="deleteItem(item)"
              ></u-icon>
            </view>
          </view>
          <u-empty
            v-if="!list.length"
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
        </scroll-view>
      </view>
    </CommonContainer>
    <EditSale
      v-if="showEdit"
      :sale-info="editInfo"
      :show="showEdit"
      @confirm="confirm"
    />
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
import SearchHeader from "@/components/searchHeader/index.vue";
import EditSale from "./components/edit.vue";
// 工具
import { toYuan, accSub } from "@/utils";
// 常量
import { themeColor } from "@/config/theme";
// service
import { mySaleList, updateSale, deleteSale } from "@/api/myInfo";

export default {
  components: {
    CommonContainer,
    SearchHeader,
    EditSale,
  },
  data() {
    return {
      keyword: "",
      scrollTop: 0,
      showEdit: false,
      themeColor: themeColor,
      editInfo: {},
      list: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        goodsTitle: "",
      },
      finish: false,
      loadtext: "上拉加载更多",
    };
  },
  onShow() {
    this.getData("init");
  },
  methods: {
    // 触底加载
    lower() {
      if (this.finish) return;
      this.loadtext = "加载中...";
      this.queryParams.pageNo++;
      this.getData();
    },
    // 获取列表数据
    async getData(i) {
      const data = await mySaleList(this.queryParams);
      if (data) {
        if (i) {
          this.list = data.records;
        } else {
          this.list = data.records ? [...this.list, ...data.records] : [];
        }
        this.loadtext =
          data.records.length < 10 ? "没有更多了" : "上拉加载更多";
        // 结束加载
        this.finish = data.records.length < 10;
      }
    },
    // 搜索
    search(v) {
      // console.log(v);
      // this.keyword = v;
      this.list = [];
      this.queryParams.goodsTitle = v;
      this.queryParams.pageNo = 1;
      this.getData();
    },
    // 显示修改框
    showModel(item) {
      this.editInfo = JSON.parse(JSON.stringify(item));
      this.showEdit = true;
    },
    // 删除
    deleteItem(item) {
      uni.showModal({
        title: "提示",
        content: "是否删除？",
        cancelText: "取消",
        confirmText: "确定",
        success: async (res) => {
          if (res.confirm) {
            const data = await deleteSale({ id: item.id });
            uni.showToast({
              title: "删除成功",
              icon: "none",
            });
            this.getData("del");
          }
        },
      });
    },
    // 提交修改
    async confirm(v) {
      this.showEdit = false;
      if (v) {
        console.log(v);
        const data = await updateSale({
          id: v.id,
          goodsPrice: v.goodsPrice,
          storeNum: v.storeNum,
        });
        uni.showToast({
          title: "修改成功",
          icon: "none",
        });
        this.list = [];
        this.queryParams.pageNo = 1;
        this.getData("edit");
      }
    },
    toYuan(val) {
      return toYuan(val);
    },
    // 跳转
    onList() {
      uni.navigateTo({
        url: "/pages/me/pocket/sale/index",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pocket-main {
  .left {
    width: 120rpx;
    height: 150rpx;
    overflow: hidden;
  }
  .mainImg {
    // width: 120rpx;
    // height: 150rpx;
    border-radius: 3rpx;
  }
  .info {
    display: flex;
    align-items: center;
    margin-top: 24rpx;
    .center {
      display: flex;
      flex-direction: column;
      margin-left: 28rpx;
    }
    .right {
      display: flex;
      margin-left: auto;
      margin-top: auto;
    }
  }
}
</style>
