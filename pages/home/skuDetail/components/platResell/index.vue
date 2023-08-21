<template>
  <view class="platResellBox" :hidden="hidden">
    <view class="title">平台转卖</view>
    <view class="platResellInfo boxBg" v-for="item in allPlats" :key="item.id">
      <!-- sku信息 -->
      <view class="skuInfoBox">
        <image class="skuImg" mode="aspectFill" :src="info.iconUrl" />
        <view class="skuInfo">
          <view class="skuTitle">代发货：{{ item.name }}</view>
          <view class="seriesTitle">全新未拆盒</view>
          <view class="tagsBox">
            <view v-for="tagItem in tags" :key="tagItem.id" class="tag">
              {{ tagItem.title }}
            </view>
          </view>
        </view>
      </view>
      <!-- 在售信息 -->
      <view class="onSaleBox">
        <view class="onSaleInfo">
          <view class="onSaleInfoTextBox">
            在售<text class="onSaleInfoText">
              {{ info.resaleNum || 0 }}
              <block v-if="info.minPrice">(最低¥{{ info.minPrice }})</block>
            </text>
          </view>
          <view
            v-if="allListMap[item.id].length"
            class="salePrice"
            @click="goToOrder(item.id)"
          >
            ￥<text class="salePriceText">{{ info.minPrice }}</text
            >购买>
          </view>
          <view v-else class="salePrice">库存不足</view>
        </view>
        <!-- 多平台转卖用户列表 -->
        <view class="platSaleUserBox">
          <u-collapse :border="false">
            <u-collapse-item title="在售信息" :name="item.id">
              <view v-if="allListMap[item.id].length" class="saleUserBox">
                <u-grid :border="false" :col="3">
                  <u-grid-item
                    v-for="currentItem in allListMap[item.id]"
                    :key="currentItem.id"
                    @click="click(item)"
                  >
                    <view class="saleUser">
                      <view class="saleImgBox">
                        <image
                          class="saleImg"
                          :src="
                            currentItem.avatarUrl ||
                            '/static/images/icons/logo.png'
                          "
                        />
                        <text class="saleImgText"
                          >¥{{ currentItem.showGoodsPrice || 0 }}</text
                        >
                      </view>
                      <view class="saleNum">
                        x{{ currentItem.storeNum || 0 }}
                      </view>
                    </view>
                  </u-grid-item>
                </u-grid>
              </view>
              <view v-else style="text-align: center">暂无转卖信息</view>
            </u-collapse-item>
          </u-collapse>
        </view>
      </view>
    </view>
    <!-- 最近成交记录 -->
    <view class="recentRecordsBox boxBg">
      <view class="title">最近成交记录</view>
      <view v-if="recentRecords.length > 0" class="recentRecords">
        <view v-for="item in recentRecords" :key="item.id" class="records">
          <view class="left">
            <image
              class="leftImg"
              :src="item.avatarUrl || '/static/images/icons/logo.png'"
            />
            <text class="nickname">{{ item.nickname }}</text>
            <view class="tag">{{ item.tag || "全新未拆封" }}</view>
          </view>
          <view class="right">
            <text class="price">￥{{ item.showAmount }}</text>
            <text class="time">{{ item.createTime }}</text>
          </view>
        </view>
      </view>
      <u-empty v-else mode="list" icon="/static/images/bgs/empty.png" />
    </view>
  </view>
</template>
<script>
// 工具
import { toYuan } from "@/utils";
// service
import { fetchResellList, fetchStyleOrderRecods } from "@/api/home";

export default {
  name: "PlatResell",
  props: {
    hidden: {
      type: Boolean,
      required: true,
      defalut: false,
    },
    info: {
      type: Object,
      defalut: {},
    },
  },
  data() {
    return {
      // collapseList: [],
      allPlats: [],
      tags: [
        { id: 1, title: "现货" },
        { id: 2, title: "可转卖" },
      ],
      list: [],
      allListMap: {},
      recentRecords: [],
    };
  },
  mounted() {},
  watch: {
    info: {
      handler() {
        // 该款式下的最近订单记录
        this.getStyleOrderRecods();
        // 获取所有平台的数据
        this.getAllPlatResellInfo();
      },
      deep: true,
    },
  },
  methods: {
    // 转卖列表
    async getResellList(goodsId, talentId) {
      const { records = [] } = await fetchResellList({
        goodsId,
        talentId,
        pageNo: 1,
        pageSize: 6,
      });
      this.allListMap[talentId] = records.map((item) => {
        item.showGoodsPrice = toYuan(item.goodsPrice);
        return item;
      });
      if (
        Object.keys(this.allListMap).length ===
        this.info.appFreeTalentVOList.length
      ) {
        this.allPlats = this.info.appFreeTalentVOList;
      }
    },
    // 获取所有平台的数据
    getAllPlatResellInfo() {
      const { id: goodsId, appFreeTalentVOList = [] } = this.info;
      // this.collapseList = appFreeTalentVOList.map((item) => item.id);
      appFreeTalentVOList.forEach((item) => {
        const talentId = item.id;
        this.getResellList(goodsId, talentId);
      });
    },
    // 该款式下的最近订单记录
    async getStyleOrderRecods() {
      const { id: goodsId } = this.info;
      const { records = [] } = await fetchStyleOrderRecods({ goodsId });
      this.recentRecords = records.map((item) => {
        item.showAmount = toYuan(item.amount);
        return item;
      });
    },
    goToOrder(talentId) {
      const { id = "" } = this.info;
      uni.navigateTo({
        url: `/pages/home/order/index?id=${id}&talentId=${talentId}`,
      });
    },
  },
};
</script>
<style lang="scss">
.platResellBox {
  margin-top: 40rpx;

  .boxBg {
    margin-top: 32rpx;
    padding: 20rpx 20rpx 32rpx;
    border-radius: 24rpx;
    background-color: #fff;
  }

  .platResellInfo {
    // sku信息
    .skuInfoBox {
      display: flex;
      width: 100%;

      .skuImg {
        border-radius: 6rpx;
        width: 138rpx;
        height: 138rpx;
        background-color: $uni-bg-color-grey;
      }

      .skuInfo {
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .skuTitle {
          font-size: 28rpx;
          color: #333333;
        }
        .seriesTitle {
          font-size: 24rpx;
          color: #bfbfbf;
        }
        .tagsBox {
          display: flex;
          margin-top: 12rpx;

          .tag {
            margin-right: 20rpx;
            height: 30rpx;
            padding: 0 18rpx;
            font-size: 20rpx;
            color: $uni-bg-color;
            border: 1px solid $uni-bg-color;
            border-radius: 20rpx;
            line-height: 30rpx;
          }
        }
      }
    }
    // 在售信息
    .onSaleBox {
      margin-top: 22rpx;

      .onSaleInfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28rpx;
        color: #bfbfbf;

        .onSaleInfoText {
          color: #ff3535;
        }

        .salePrice {
          font-size: 24rpx;
          color: #ea5334;
          .salePriceText {
            font-size: 38rpx;
            font-weight: bold;
          }
        }
      }

      .platSaleUserBox {
        margin-top: 32rpx;
        width: 100%;

        .saleUserBox {
          // display: flex;
          // flex-wrap: wrap;
          // justify-content: space-between;

          .saleUser {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 28rpx;
            padding: 0 12rpx 0 8rpx;
            max-width: 180rpx;
            height: 60rpx;
            line-height: 60rpx;
            border-radius: 40rpx;
            background-color: #f9f9f9;

            .saleImgBox {
              display: flex;
              align-items: center;

              .saleImg {
                border-radius: 40rpx;
                width: 28rpx;
                height: 28rpx;
                background-color: $uni-bg-color-grey;
              }

              .saleImgText {
                margin-left: 8rpx;
                font-size: 24rpx;
                font-weight: bold;
                color: #333333;
              }
            }
            .saleNum {
              margin-left: 30rpx;
              font-size: 20rpx;
              color: #acacac;
            }
          }
        }
      }
    }
  }
  // 最近成交记录
  .recentRecordsBox {
    .title {
      font-size: 28rpx;
      color: #333333;
    }
    .recentRecords {
      margin-top: 24rpx;

      .records {
        display: flex;
        justify-content: space-between;
        margin-bottom: 32rpx;

        .left {
          display: flex;
          align-items: center;

          .leftImg {
            border-radius: 40rpx;
            width: 48rpx;
            height: 48rpx;
            background-color: $uni-bg-color-grey;
          }

          .nickname {
            margin-left: 16rpx;
            width: 60rpx;
            color: #333333;
            font-size: 20rpx;
          }
          .tag {
            margin-left: 12rpx;
            padding: 4rpx 6rpx;
            border-radius: 4rpx;
            font-size: 20rpx;
            line-height: 28rpx;
            color: #a65630;
            background: linear-gradient(314deg, #ffcc94 0%, #fadfb6 100%);
          }
        }
        .right {
          display: flex;
          align-items: center;
          font-size: 20rpx;

          .price {
            margin-right: 28rpx;
            color: #333333;
          }
          .time {
            width: 80rpx;
            color: #a8a8a8;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
