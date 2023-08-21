<template>
  <div class="skuDetailContainer">
    <CommonContainer title="款式">
      <view class="content">
        <!-- 头部 -->
        <SkuHeader :info="goodsInfo" @changeGoodsInfo="changeGoodsInfo" />
        <!-- 分类 -->
        <view style="margin-top: 32rpx">
          <ScrollList
            :list="typeList"
            :defaultId="3"
            :scroll="false"
            @select="hadleSelectType"
          />
        </view>
        <!-- 展示区 -->
        <view class="showBox">
          <!-- 资料 -->
          <Profile :hidden="currentId !== TYPE.PROFILE" :info="profileInfo" />
          <!-- 平台转卖 -->
          <PlatResell :hidden="currentId !== TYPE.RESELL" :info="resellInfo" />
          <!-- 全网 -->
          <WholeNetwork
            :hidden="currentId !== TYPE.WHOLE_NETWORK"
            :miniProgramList="miniProgramList"
          />
        </view>
      </view>
    </CommonContainer>
  </div>
</template>
<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
import ScrollList from "@/components/scrollList";
// 自定义业务组件
import SkuHeader from "./components/skuHeader";
import Profile from "./components/profile";
import PlatResell from "./components/platResell";
import WholeNetwork from "./components/wholeNetwork";
// 工具
import { toYuan } from "@/utils";
// service
import { fetchGoodsDetail } from "@/api/home";

const TYPE = {
  PROFILE: 1,
  IDLE: 2,
  RESELL: 3,
  WANT_TO_MY: 4,
  WHOLE_NETWORK: 5,
};

export default {
  components: {
    CommonContainer,
    ScrollList,
    SkuHeader,
    Profile,
    PlatResell,
    WholeNetwork,
  },
  data() {
    return {
      skuId: null,
      profileInfo: {
        imgs: [],
        goodsDetail: "",
      },
      goodsInfo: {
        id: null,
        mainUrl: "",
        name: "",
        followNum: 0,
        tags: [],
      },
      resellInfo: {
        id: null,
        iconUrl: "",
        minPrice: 0,
        maxPrice: 0,
        recommendPrice: 0,
        resaleNum: 0,
        plats: "",
        appFreeTalentVOList: [],
      },
      miniProgramList: [],
      TYPE,
      currentId: TYPE.RESELL,
      typeList: [
        { id: TYPE.PROFILE, title: "资料" },
        // { id: 2, title: "闲置" },
        { id: TYPE.RESELL, title: "转卖" },
        // { id: 4, title: "求购" },
        { id: TYPE.WHOLE_NETWORK, title: "全网" },
      ],
    };
  },
  onLoad(options) {
    const { id } = options || {};
    this.skuId = +id;
    this.getGoodsDetail();
  },
  methods: {
    async getGoodsDetail() {
      const id = this.skuId;
      const data = await fetchGoodsDetail({ id });
      const detail = data || {};
      // 资料
      this.profileInfo = {
        imgs: data.attachUrl.split(","),
        goodsDetail: data.goodsDetail || "",
      };
      // skus商品信息
      this.goodsInfo = {
        id,
        mainUrl: data.mainUrl || "",
        name: data.name || "",
        followNum: data.followNum || 0,
        related: data.related,
        tags: data.categoryDetail ? data.categoryDetail.split(",") : [],
      };
      // 转卖信息
      this.resellInfo = {
        id,
        iconUrl: (detail.appFreeTalentVOList || [])[0].iconUrl,
        // propertyDetail: detail.propertyDetail || "",
        minPrice: toYuan(detail.minPrice),
        maxPrice: toYuan(detail.maxPrice),
        resaleNum: detail.resaleNum,
        recommendPrice: toYuan(detail.recommendPrice),
        plats: (detail.appFreeTalentVOList || [])
          .map((item) => item.name)
          .join("、"),
        appFreeTalentVOList: detail.appFreeTalentVOList || [],
        // talentId: 1, //appFreeTalentVOList
      };
      // 全网渠道
      this.miniProgramList = detail.appFreeTalentVOList || [];
    },
    changeGoodsInfo() {
      this.getGoodsDetail();
    },
    hadleSelectType(item) {
      this.currentId = item.id;
    },
  },
};
</script>
<style lang="scss">
.skuDetailContainer {
  .content {
  }
}
</style>
