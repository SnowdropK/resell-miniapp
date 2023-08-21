<template>
  <view
    class="scrollListBox"
    :style="{
      overflow: scroll ? 'scroll' : '',
      justifyContent: scroll ? '' : 'space-between',
    }"
  >
    <view
      class="scrollItem"
      :style="{
        color: cuurentId === item.id ? themeColor : '',
        marginRight: scroll ? '36rpx' : '0rpx',
      }"
      v-for="item in list"
      :key="item.id"
      @click="click(item)"
    >
      <view class="title text-hide">
        {{ item.title }}
      </view>
      <u--image
        v-if="cuurentId === item.id"
        src="/static/images/icons/chooseIcon.png"
        width="44rpx"
        height="8rpx"
      />
    </view>
  </view>
</template>

<script>
import { themeColor } from "@/config/theme";

export default {
  name: "ScrollList",
  props: {
    defaultId: {
      type: [Number, String],
      default: null,
    },
    list: {
      type: Array,
      default: [],
    },
    scroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      cuurentId: null,
      currentIndex: 0,
      themeColor,
    };
  },
  watch: {
    // 搜索页 “更多” 需要传值过来
    defaultId(v) {
      this.cuurentId = v;
    },
    list: {
      handler(nextList) {
        if (this.defaultId) {
          this.cuurentId = this.defaultId;
          return;
        }
        const defaultItem = nextList && nextList.length > 0 ? nextList[0] : {};
        this.cuurentId = defaultItem.id;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    click(item) {
      this.cuurentId = item.id;
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss">
.scrollListBox {
  display: flex;
  width: 100%;
  font-size: 32rpx;
  color: #333333;

  .scrollItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 64rpx;
    text-align: center;

    .title {
      min-width: 96rpx;
    }
  }
}
</style>
