<template>
  <view class="">
    <card-title
      v-if="name"
      :name="name"
      :num="num"
      :more="more"
      @onMore="onMore"
    ></card-title>
    <view
      v-for="(item, index) in tempList"
      :key="index"
      class="p-2 bg-white rounded-20 shadow mb-2 position-relative"
    >
      <view class="d-flex a-center" v-if="ifUser" @click="onUser(item.id)">
        <image class="avatarUrl" :src="item.avatarUrl" mode="aspectFill" />
        <view class="p-1 ml-2 span24-15">
          <view class="font-weight text-hide">{{ item.nickname || "-" }}</view>
          <view class="text-light-muted">
            有
            <text class="main-text-color letter-s font-sm font-weight">{{
              item.saleNum || 0
            }}</text>
            件商品在售
          </view>
        </view>
      </view>
      <view class="d-flex" v-else-if="ifStyle" @click="onSku(item.id)">
        <image
          class="mainUrl"
          :src="item.mainUrl"
          :style="{ width: imgSize, height: imgSize }"
          mode="aspectFill"
        />
        <view class="p-1 ml-2 span24-14">
          <view class="font-weight text-hide2">{{ item.name }}</view>
          <view class="level font-sm text-hide2">{{
            item.categoryDetail
          }}</view>
          <slot
            name="style"
            :price="item.minPrice || item.recommendPrice || ''"
          ></slot>
        </view>
      </view>
      <view v-else class="d-flex" @click="onSeries(item.id)">
        <image
          class="iconUrl"
          :src="item.iconUrl"
          :style="{ width: imgSize, height: imgSize }"
          mode="aspectFill"
        />
        <view class="p-1 ml-2 span24-15">
          <view class="font-weight text-hide">{{ item.name || "-" }}</view>
          <view
            v-if="item.parentName"
            class="border rounded-30 main-border-color main-text-color text-center px-2 text-hide"
            >{{ item.parentName }}</view
          >
          <slot name="style" :price="item.price"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CardTitle from "./cardTitle.vue";
export default {
  name: "listItem",
  components: {
    CardTitle,
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    num: {
      type: [String, Number],
      default: "",
    },
    imgSize: {
      type: String,
      default: "120rpx",
    },
    list: {
      type: Array,
      default: [],
    },
    ifStyle: {
      type: Boolean,
      default: false,
    },
    ifUser: {
      type: Boolean,
      default: false,
    },
    more: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    list(v) {
      this.tempList = v;
    },
  },
  data() {
    return {
      tempList: this.list,
    };
  },
  computed: {},
  methods: {
    onMore() {
      this.$emit("onMore", this.name);
    },
    onUser(id) {
      uni.navigateTo({
        url: "/packageA/me/personal/index?id=" + id,
      });
    },
    // 系列
    onSeries(id) {
      uni.navigateTo({
        url: "/pages/home/seriesDetail/index?id=" + id,
      });
    },
    // 款式
    onSku(id) {
      uni.navigateTo({
        url: "/pages/home/skuDetail/index?id=" + id,
      });
    },
  },
};
</script>

<style scoped>
.level {
  color: #bfbfbf;
}
.avatarUrl {
  width: 90rpx;
  height: 90rpx;
  border-radius: 90rpx;
}
.iconUrl,
.mainUrl {
  border-radius: 10rpx;
}
</style>
