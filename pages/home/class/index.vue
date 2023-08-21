<template>
  <view>
    <CommonContainer title="分类" :showPadding="false">
      <view v-if="!showLoading" class="d-flex class-box">
        <scroll-view
          id="leftScroll"
          class="scroll-top"
          scroll-y="true"
          :scroll-top="leftScrollTop"
					style="flex: 1;height: 100%;"
        >
          <view
            class="py-1 left-scroll-item"
            hover-class="bg-light-secondary"
            v-for="(item, index) in cate"
            :key="index"
          >
            <view
              class="py-1 font-md text-center text-hide span24-22 px"
              @click="changeCate(index)"
              :class="
                activeIndex === index ? 'class-active' : 'class-no text-muted'
              "
              >{{ item.name }}</view
            >
          </view>
        </scroll-view>
        <scroll-view
          scroll-y="true"
          class="scroll-bottom"
          :scroll-top="rightScrollTop"
          :scroll-with-animation="true"
          @scroll="onRightScroll"
					style="flex: 3.5;height: 100%;"
        >
          <view
            class="row right-scroll-item d-flex flex-column"
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="px-2 pt-2 class-title"> {{ item.name }} </view>
            <view class="d-flex flex-row flex-wrap">
              <view
                class="span24-8 text-center py-2"
                v-for="(item2, index2) in item.freeCategoryList"
                :key="index2"
                @click="onSeries(item2.id)"
              >
                <image class="iconUrl" :src="item2.iconUrl" mode="aspectFill" />
                <text class="d-block text-center name-hide">{{ item2.name }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 组件
import CommonContainer from "@/components/commonContainer";
// service
import { categoryTree } from "@/api/home";

export default {
  components: {
    CommonContainer,
  },
  data() {
    return {
      showLoading: true,
      text: "分类页",
      // 当前选中的分类
      activeIndex: 0,
      cate: [],
      list: [],
      // 存放
      leftDomsTop: [],
      rightDomsTop: [],
      rightScrollTop: 0,
      leftScrollTop: 0,
      cateItemHeight: 0,
			
			ifClick: false,
    };
  },
  watch: {
    async activeIndex(newValue, oldValue) {
      // 获取scroll-view高度 scrolltop
      this.$nextTick(() => {
        const query = uni.createSelectorQuery().in(this);
        query
          .select("#leftScroll")
          .fields(
            {
              size: true,
              scrollOffset: true,
            },
            (data) => {
              let H = data.height;
              let ST = data.scrollTop;
              // 下边
              if (this.leftDomsTop[newValue] + this.cateItemHeight > H + ST) {
                return (this.leftScrollTop =
                  this.leftDomsTop[newValue] + this.cateItemHeight - H);
              }
              // 上边
              if (ST > this.cateItemHeight) {
                this.leftScrollTop = this.leftDomsTop[newValue];
              }
            }
          )
          .exec();
      });
    },
  },
  onLoad() {
    this.getData();
    this.getItemTopArr();
  },
  onReady() {
   
  },
  methods: {
    getItemTopArr() {},
    // 获取节点信息
    async getData() {
      const data = await categoryTree();
      this.cate = data || [];
      this.list = data || [];

      // 等渲染
      this.$nextTick(() => {
        this.showLoading = false;
      });
			this.getNode();
    },
		getNode() {
			this.$nextTick(() => {
			  setTimeout(() => {
			    const query = uni.createSelectorQuery().in(this);
			    let left = [];
			    let right = [];
			    query
			      .selectAll(".left-scroll-item")
			      .fields(
			        {
			          size: true,
			          rect: true,
			        },
			        (data) => {
			          this.leftDomsTop = data.map((v) => {
			            this.cateItemHeight = v.height;
			            return v.top;
			          });
			        }
			      )
			      .exec();
			    query
			      .selectAll(".right-scroll-item")
			      .fields(
			        {
			          size: false,
			          rect: true,
			        },
			        (data) => {
			          this.rightDomsTop = data.map((v) => v.top);
			        }
			      )
			      .exec();
			  }, 100);
			});
		},
    // 点击左边分类
    changeCate(index) {
			this.ifClick = true;
			
      this.activeIndex = index;
      // 右边scroll-view滚动到对应区域  【分类标题头 - 100】不要则删去
      this.rightScrollTop = this.rightDomsTop[index] - 100;
    },
    // 监听右边滚动事件
    async onRightScroll(e) {
			// 防止跳行
			if (this.ifClick) {
				this.ifClick = false;
				return;
			}
			// console.log(this.rightDomsTop);
      // 匹配当前scrollTop所处的索引
      this.rightDomsTop.forEach((v, k) => {
        if (v - 100 < e.detail.scrollTop) {
          // 这里 k+1 处理，出问题删掉+1
          // console.log(v, e.detail.scrollTop);
          this.activeIndex = k;
          return false;
        }
      });
    },
    // 系列
    onSeries(id) {
      uni.navigateTo({
        url: "/pages/home/seriesDetail/index?id=" + id,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.class-title {
  font-size: 32rpx;
}
.class-box {
	width: 100%;
  height: calc(100vh - 230rpx);
  box-sizing: border-box;
	overflow-x: hidden;
}
.class-active {
  // border-left: 8rpx solid $uni-bg-color;
  background-color: $uni-bg-color;
  color: #ffffff;
}
.class-no {
  color: $uni-bg-color;
}
.scroll-top {
  flex: 1;
  height: 100%;
}
.scroll-bottom {
  flex: 3.5;
  height: 100%;
}
.border-light-class {
  border-color: #cfd1f8;
}
.iconUrl {
  border-radius: 20rpx;
  width: 140rpx;
  height: 140rpx;
}
.name-hide {
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
