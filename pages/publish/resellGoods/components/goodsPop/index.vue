<template>
  <u-popup
    :show="show"
    mode="bottom"
    :closeable="true"
    :closeOnClickOverlay="false"
    :safeAreaInsetTop="true"
    @close="close"
  >
    <view class="goodsPopBox">
      <u--form
        labelPosition="left"
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        labelWidth="200rpx"
      >
        <u-form-item label="赏品名" borderBottom>
          <view>{{ info.rewardName }}</view>
        </u-form-item>
        <u-form-item label="价格" prop="showPrice" borderBottom>
          <u--input
            v-model="ruleForm.showPrice"
            :placeholder="`建议转卖：￥${toYuan(info.recommendPrice)}`"
            border="surround"
            type="digit"
            @change="priceBlur"
          ></u--input>
          <!-- <view class="showFormItem">
            <u-number-box
              v-model="ruleForm.showPrice"
              :min="0"
              :max="info.showNumber"
              :decimalLength="2"
            ></u-number-box>
            <text style="color: #999; font-size: 24rpx; margin-left: 20rpx">{{
              `建议转卖：￥${toYuan(info.recommendPrice)}`
            }}</text>
          </view> -->
        </u-form-item>
        <u-form-item label="数量" prop="pick" borderBottom>
          <view class="showFormItem">
            <u-number-box
              v-model="ruleForm.pick"
              :min="0"
              :max="info.showNumber"
              :step="1"
            ></u-number-box>
            <text style="color: #999; font-size: 24rpx; margin-left: 20rpx"
              >库存：{{ info.showNumber || 0 }}</text
            >
          </view>
        </u-form-item>
        <u-form-item label="手续费" borderBottom>
          <text>{{ fee }}</text>
        </u-form-item>
      </u--form>
      <view class="submitBtn" @click="save">确 定</view>
    </view>
  </u-popup>
</template>
<script>
// 工具
import { toYuan, accMul, accDiv, toFixed } from "@/utils";

export default {
  name: "goodsPop",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: {},
    },
    form: {
      type: Object,
      default: false,
    },
    // recommendPrice: {
    //   type: Number,
    //   default: 0,
    // },
    saleRate: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    show: {
      handler(val) {
        if (val) {
          this.ruleForm = this.form;
        }
      },
      immediate: true,
    },
  },
  computed: {
    // 手续费
    fee() {
      const price = accMul(+this.ruleForm.showPrice || 0, 100);
      const sumPrice = accMul(this.ruleForm.pick || 0, price);
      return toFixed(
        accDiv(toFixed(accMul(+sumPrice, +this.saleRate), 2), 100),
        2
      );
    },
  },
  data() {
    return {
      ruleForm: {
        showPrice: null,
        pick: 0,
      },
      rules: {
        showPrice: [
          {
            type: "number",
            required: true,
            message: "请填写价格",
            trigger: ["blur", "change"],
          },
          {
            // 自定义验证函数
            validator: (rule, value, callback) => {
              return +value > 0;
            },
            message: "价格不能为0",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
          {
            // 自定义验证函数
            validator: (rule, value, callback) => {
              return +value <= 1000000;
            },
            message: "价格不能超过100万",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
        // pick: [
        //   {
        //     validator: (rule, value, callback) => {
        //       return value > 0;
        //     },
        //     required: true,
        //     message: "请填写数量",
        //     trigger: ["change", "blur"],
        //   },
        // ],
      },
    };
  },
  mounted() {},
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.ruleForm.setRules(this.rules);
  },
  methods: {
    toYuan(val) {
      return toYuan(val);
    },
    priceBlur(val = 0) {
      // 表单有个坑爹的地方，检测到前后两次的值相同就不会进行渲染
      // 四舍五入后要是和输入前值一样，就不会渲染，导致显示和赋值不一样
      // 所以要先进行两次渲染
      this.ruleForm.showPrice = +val;
      setTimeout(() => {
        this.ruleForm.showPrice = toFixed(+val, 2);
      }, 100);
    },
    valChange() {},
    save() {
      this.$refs.ruleForm
        .validate()
        .then((res) => {
          this.$emit("save", this.ruleForm);
        })
        .catch((errors) => {
          uni.$u.toast("请填写正确");
        });
    },
    close() {
      setTimeout(() => {
        this.$emit("closePop");
      }, 100);
    },
  },
};
</script>
<style lang="scss">
.goodsPopBox {
  padding: 0 50rpx;

  .showFormItem {
    display: flex;
    align-items: center;
  }

  .submitBtn {
    margin-top: 40rpx;
    height: 80rpx;
    border-radius: 14rpx;
    color: #fff;
    line-height: 80rpx;
    text-align: center;
    background-color: $uni-bg-color;
  }
}
</style>
