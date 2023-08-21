<template>
  <view class="profileBox" :hidden="hidden">
    <view class="imgBox">
      <view class="title">相册</view>
      <u-scroll-list :indicatorActiveColor="themeColor">
        <view v-for="img in info.imgs" :key="img" style="margin-right: 12rpx">
          <u--image radius="12rpx" width="160rpx" height="160rpx" :src="img" />
        </view>
      </u-scroll-list>
    </view>
    <view class="saleTime">
      <rich-text class="detail" :nodes="info.goodsDetail"></rich-text>
    </view>
  </view>
</template>
<script>
// 常量
import { themeColor } from "config/theme";

export default {
  name: "Profile",
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
      themeColor,
      content:
        '<p><span style=\\"color: rgb(126, 140, 141);\\">发售时间：2022.12.25</span></p><p><span style=\\"color: rgb(126, 140, 141);\\">IP：火影忍者</span></p><p><span style=\\"color: rgb(126, 140, 141);\\">公司：集英社</span></p><p><strong style=\\"color: rgb(126, 140, 141);\\">设计师：岸本齐史</strong></p><p><span style=\\"color: rgb(126, 140, 141);\\">发售价格：2000元</span></p><p><strong style=\\"color: rgb(126, 140, 141);\\">发售款式：</strong><strong style=\\"color: rgb(230, 0, 0);\\">漩涡鸣人</strong></p><p><span style=\\"color: rgb(126, 140, 141);\\">材质：手办</span></p><p><span style=\\"color: rgb(194, 133, 255);\\">尺寸：23寸</span></p><p><span style=\\"color: rgb(126, 140, 141);\\">配件：底座</span></p><p><s style=\\"color: rgb(126, 140, 141);\\">购买方式：淘宝</s></p><p><em style=\\"color: rgb(126, 140, 141);\\">发售数量：34343</em></p><p><u style=\\"color: rgb(126, 140, 141);\\">别名：九尾</u></p>',
      // imgs: [
      //   {
      //     id: 1,
      //     price: 35,
      //     title: "北国风光，千里冰封，万里雪飘",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg",
      //   },
      //   {
      //     id: 2,
      //     price: 75,
      //     title: "望长城内外，惟余莽莽",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23325_s.jpg",
      //   },
      //   {
      //     id: 3,
      //     price: 385,
      //     title: "大河上下，顿失滔滔",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg",
      //   },
      //   {
      //     id: 4,
      //     price: 784,
      //     title: "欲与天公试比高",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23369_s.jpg",
      //   },
      //   {
      //     id: 5,
      //     price: 7891,
      //     title: "须晴日，看红装素裹，分外妖娆",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg",
      //   },
      //   {
      //     id: 6,
      //     price: 2341,
      //     shop: "李白杜甫白居易旗舰店",
      //     title: "江山如此多娇，引无数英雄竞折腰",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg",
      //   },
      //   {
      //     id: 7,
      //     price: 661,
      //     shop: "李白杜甫白居易旗舰店",
      //     title: "惜秦皇汉武，略输文采",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23344_s.jpg",
      //   },
      //   {
      //     id: 8,
      //     price: 1654,
      //     title: "唐宗宋祖，稍逊风骚",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg",
      //   },
      //   {
      //     id: 9,
      //     price: 1678,
      //     title: "一代天骄，成吉思汗",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg",
      //   },
      //   {
      //     id: 10,
      //     price: 924,
      //     title: "只识弯弓射大雕",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg",
      //   },
      //   {
      //     id: 11,
      //     price: 8243,
      //     title: "俱往矣，数风流人物，还看今朝",
      //     shop: "李白杜甫白居易旗舰店",
      //     image:
      //       "http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg",
      //   },
      // ],
    };
  },
};
</script>
<style lang="scss">
.profileBox {
  margin-top: 40rpx;

  .imgBox {
    .title {
      font-size: 28rpx;
      color: #333333;
    }
    .imgs {
      border: 1px solid red;
      // display: flex;
    }
  }
}
</style>
