<template>
  <view class="gridBox">
    <view v-if="title" class="title">{{ title }}</view>
    <u-grid :border="false" :col="col">
      <u-grid-item v-for="item in list" :key="item.id" @click="click(item)">
        <view v-if="item.id === 3">
          <button
            class="gridItem"
            style="
              margin: 0 !important;
              color: #fff !important;
              border: none !important;
              height: 70rpx !important;
              width: 20rpx !important;
              text-align: center !important;
            "
            plain="true"
            open-type="contact"
          >
            <u-icon
              :customStyle="{ paddingTop: 20 + 'rpx' }"
              :name="item.icon"
              :size="24"
              color="#9c9c9c"
            />
          </button>
          <text>{{ item.title }}</text>
        </view>
        <view v-else class="gridItem">
          <u-icon
            :customStyle="{ paddingTop: 20 + 'rpx' }"
            :name="item.icon"
            :size="24"
            color="#9c9c9c"
          />
          <text style="text-align: center">{{ item.title }}</text>
        </view>
      </u-grid-item>
    </u-grid>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    list: {
      type: Array,
      required: true,
      default: [],
    },
    col: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    click(item) {
      // if (this.isBag) {
      //   uni.navigateToMiniProgram({
      //     appId: item.appid,
      //     path: item.shopUrl,
      //     success(res) {
      //       // 打开成功
      //       console.log("打开成功");
      //     },
      //   });
      //   return;
      // }
      if (item.id === 3) return;
      uni.navigateTo({
        url: `${item.path}?id=${item.id}`,
      });
    },
  },
};
</script>

<style lang="scss">
.title {
  margin-bottom: 16rpx;
}
.gridBox {
  padding: 16rpx;
  border-radius: 20rpx;
  background-color: #fff;

  .gridItem {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
