<template>
  <view class="bankCardContainer">
    <CommonContainer title="银行卡管理">
      <view class="content">
        <!-- 列表 -->
        <scroll-view
          class="scrollBox"
          :style="{ height: `${scrollHeight}px` }"
          scroll-y="true"
          @scrolltolower="scrolltolower"
        >
          <view v-if="list.length > 0">
            <u-swipe-action>
              <u-swipe-action-item
                v-for="item in list"
                :key="item.id"
                :options="options"
                @click="handleDelBankCard(item)"
              >
                <view v-for="item in list" :key="item.id" class="bankCardBox">
                  <view class="carCode">
                    {{ item.bankNo }}
                  </view>
                  <block>
                    <u-icon
                      v-if="isChooseBankCard"
                      :name="
                        item.id === currentCardId
                          ? 'checkmark-circle-fill'
                          : 'checkmark-circle'
                      "
                      :color="themeColor"
                      size="24"
                      @click="pickBankCard(item)"
                    ></u-icon>
                    <view v-else class="bindBox">已绑定</view>
                  </block>
                </view>
              </u-swipe-action-item>
            </u-swipe-action>
          </view>
          <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
        </scroll-view>
      </view>
    </CommonContainer>
    <view class="addBankCardBox">
      <view
        v-if="isChooseBankCard"
        class="addBankCardBtn"
        style="margin-right: 10rpx"
        @click="goToWithdraw"
        >确定</view
      >
      <view class="addBankCardBtn" @click="goToAddBankCard">添加银行卡</view>
    </view>
    <!-- <u-modal
      :show="show"
      title="提示"
      content="请确认是否解绑银行卡？"
      :showCancelButton="true"
      @confirm="confirm"
      @cancel="show = false"
    ></u-modal> -->
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// 常量
import { themeColor } from "@/config/theme";
// service
import { fetchBankList, delBankCard } from "@/api/me";

export default {
  name: "BankCard",
  components: {
    CommonContainer,
  },
  data() {
    return {
      themeColor,
      list: [],
      isChooseBankCard: false,
      currentCardId: null,
      currentBankNo: null,
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#f56c6c",
          },
        },
      ],
      scrollHeight: 0,
    };
  },
  onLoad(options) {
    const { chooseBankCard, currentCardId } = options;
    this.isChooseBankCard = +chooseBankCard === 1;
    this.currentCardId = +currentCardId;
    this.getScrollHeight();
  },
  onShow() {
    this.getBankCardList();
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
              var scrollHeight = windowHeight - rect.top;
              that.scrollHeight = scrollHeight;
            })
            .exec();
        },
      });
    },
    async getBankCardList() {
      const data = await fetchBankList();
      this.list = data || [];
    },
    async delBankCard(id) {
      try {
        await delBankCard({ id });
        uni.showToast({
          title: "成功删除银行卡",
          icon: "none",
        });
        this.getBankCardList();
      } catch {
        uni.showToast({
          title: "出错了",
          icon: "none",
        });
      }
    },
    // 删除银行卡
    handleDelBankCard(item) {
      uni.showModal({
        title: "提示",
        content: `请确认是否删除银行卡`,
        success: (res) => {
          if (res.confirm) {
            this.delBankCard(item.id);
          }
        },
      });
    },
    // 选择银行卡
    pickBankCard(item) {
      this.currentCardId = this.currentCardId === item.id ? null : item.id;
      this.currentBankNo =
        this.currentBankNo === item.bankNo ? null : item.bankNo;
    },
    // 解绑银行卡
    // unbind() {
    //   this.show = true;
    // },
    // 带着银行卡id返回提现
    goToWithdraw() {
      uni.$emit("returnBankCardData", {
        currentCardId: this.currentCardId,
        currentBankNo: this.currentBankNo,
      });
      uni.navigateBack();
    },
    // 前往添加银行卡
    goToAddBankCard() {
      uni.navigateTo({
        url: "/packageA/me/balance/addBankCard/index",
      });
    },
  },
};
</script>

<style lang="scss">
.bankCardContainer {
  .content {
    .scrollBox {
      margin-top: 20rpx;
      /* 减去头部和底部的高度 */
      // height: calc(100vh - 230rpx);
      overflow-y: auto; /* 允许垂直滚动 */

      .bankCardBox {
        margin-bottom: 10rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14rpx 30rpx;
        border-radius: 8rpx;
        background-color: #fff;

        .carCode {
          font-size: 40rpx;
          font-weight: bold;
        }
        .bindBox {
          color: #999;
          font-size: 20rpx;
        }
      }
    }
  }
  .addBankCardBox {
    position: fixed;
    bottom: 50rpx;
    z-index: 999;
    display: flex;
    justify-content: space-between;
    text-align: center;
    width: 100%;
    padding: 0 20rpx;
    box-sizing: border-box;
    .addBankCardBtn {
      display: inline-block;
      flex: 1;
      width: 100%;
      padding: 16rpx 30rpx;
      border-radius: 10rpx;
      color: #fff;
      font-size: 30rpx;
      text-align: center;
      background-color: $uni-bg-color;
    }
  }
}
</style>
