<template>
  <view class="qrCodeModalBox">
    <u-modal
      :show="true"
      title="支付宝"
      confirmText="取消支付"
      @confirm="confirm"
    >
      <view class="slot-content">
        <QrCode
          :val="val"
          :size="400"
          :iconSize="50"
          icon="/static/images/icons/logo.png"
          :loadMake="true"
        />
        <view style="text-align: center">长按保存二维码图片</view>
      </view>
    </u-modal>
  </view>
</template>
<script>
// 三方组件
import QrCode from "@/components/tki-qrcode/tki-qrcode.vue";

export default {
  name: "QrCodeModal",
  components: {
    QrCode,
  },
  props: {
    val: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    confirm() {
      this.$emit("close");
    },
  },
};
</script>
<style lang="scss">
.qrCodeModalBox {
  .slot-content {
    margin-top: 40rpx;
  }
}
</style>
