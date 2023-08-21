<template>
  <view class="realNameContainer">
    <CommonContainer title="余额开户">
      <view class="content">
        <view class="realNameFormbox">
          <u--form
            labelPosition="left"
            :model="form"
            :rules="rules"
            labelWidth="100"
            ref="ruleForm"
          >
            <u-form-item label="姓名" prop="realName" borderBottom>
              <u--input
                v-model="form.realName"
                placeholder="请输入真实姓名"
                clearable
                border="none"
              ></u--input>
            </u-form-item>
            <u-form-item label="身份证" prop="idCard" borderBottom>
              <u--input
                v-model="form.idCard"
                placeholder="请输入身份证号"
                clearable
                border="none"
              ></u--input>
            </u-form-item>
            <u-form-item
              label="有效期开始"
              prop="idCardStart"
              borderBottom
              @click="showStart = true"
            >
              <view>{{
                form.idCardStart
                  ? formatterDatetime(form.idCardStart)
                  : "请选择"
              }}</view>
              <u-datetime-picker
                ref="datetimePicker"
                v-model="form.idCardStart"
                :show="showStart"
                mode="date"
                :minDate="0"
                @confirm="showStart = false"
                @cancel="showStart = false"
              ></u-datetime-picker>
            </u-form-item>
            <u-form-item
              label="有效期截止"
              prop="idCardEnd"
              borderBottom
              @click="showEnd = true"
            >
              <view>{{
                form.idCardEnd ? formatterDatetime(form.idCardEnd) : "请选择"
              }}</view>
              <u-datetime-picker
                :show="showEnd"
                v-model="form.idCardEnd"
                mode="date"
                :minDate="0"
                :maxDate="maxDateStamp"
                @confirm="showEnd = false"
                @cancel="showEnd = false"
              ></u-datetime-picker>
            </u-form-item>
            <u-form-item label="有效期长期" prop="idCardEnd" borderBottom>
              <view><u-switch v-model="longTermCheck"></u-switch></view>
            </u-form-item>
            <u-form-item label="+86" prop="phone" borderBottom>
              <u--input
                v-model="form.phone"
                placeholder="请输入手机号"
                clearable
                border="none"
              ></u--input>
            </u-form-item>
          </u--form>
        </view>
      </view>
    </CommonContainer>
    <view class="realNameBtnBox">
      <view class="tip">
        <view style="display: inline-block">
          <u-checkbox-group v-model="checkboxValue" placement="column">
            <u-checkbox name="checkAgreement"> </u-checkbox>
          </u-checkbox-group>
        </view>
        阅读并同意
        <text class="webview" @click="goToWebView('balanceAgreement')"
          >《余额服务协议》</text
        >
        <text class="webview" @click="goToWebView('commitmentLetter')"
          >《开户愿意承诺书》</text
        >
        <text class="webview" @click="goToWebView('protectionPolicy')">
          《个人隐私保护政策》
        </text>
        <text class="webview" @click="goToWebView('deductionAgreement')"
          >《扣款授权协议》</text
        >
      </view>
      <view class="realNameBtn" @click="openBalanceAccount">
        同意授权并开通
      </view>
    </view>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// service
import { openAccount } from "@/api/me";

export default {
  name: "OpenAccount",
  components: {
    CommonContainer,
  },
  data() {
    return {
      longTermCheck: false,
      form: {
        realName: "",
        idCard: "",
        idCardStart: null,
        idCardEnd: null,
        phone: "",
      },
      rules: {
        realName: {
          type: "string",
          required: true,
          message: "请填写姓名",
          trigger: ["blur", "change"],
        },
        idCard: {
          type: "string",
          required: true,
          message: "请填写身份证号",
          trigger: ["blur", "change"],
        },
        idCardStart: {
          type: "number",
          required: true,
          message: "请填写有效期开始时间",
          trigger: ["blur", "change"],
        },
        // idCardEnd: {
        //   type: "number",
        //   required: true,
        //   message: "请填写有效期截止时间",
        //   trigger: ["blur", "change"],
        // },
        phone: {
          type: "string",
          required: true,
          message: "请填写手机号",
          trigger: ["blur", "change"],
        },
      },
      checkboxValue: [],
      showStart: false,
      showEnd: false,
      maxDateStamp: new Date(
        new Date().setFullYear(new Date().getFullYear() + 10)
      ).getTime(),
    };
  },
  watch: {
    longTermCheck(val) {
      if (val) {
        this.form.idCardEnd = null;
      }
    },
    "form.idCardEnd"(val) {
      if (val) {
        this.longTermCheck = false;
      }
    },
  },
  onLoad() {
    const now = new Date();
    const tenYearsLater = new Date(
      now.getFullYear() + 20,
      now.getMonth(),
      now.getDate()
    );
    this.maxDateStamp = tenYearsLater.getTime();
  },
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.ruleForm.setRules(this.rules);
  },
  methods: {
    formatterDatetime(val, show = true) {
      const date = new Date(val);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return val
        ? show
          ? `${year}-${month}-${day}`
          : `${year}${month}${day}`
        : null;
    },
    // 前往余额中心首页
    goToBanlanceHome() {
      uni.navigateTo({
        url: "/packageA/me/balance/index",
      });
    },
    // 开通余额账户：接口
    async openAccount() {
      try {
        const { idCardStart, idCardEnd } = this.form;
        const params = {
          ...this.form,
          idCardStart: this.formatterDatetime(idCardStart, false),
          idCardEnd: this.formatterDatetime(idCardEnd, false),
        };
        await openAccount(params);
        uni.showToast({
          title: "开户成功",
          icon: "success",
          duration: 2000,
        });
        this.goToBanlanceHome();
      } catch {
        uni.showToast({
          title: "出错了",
          icon: "error",
          duration: 2000,
        });
      }
    },
    openBalanceAccount() {
      if (!(this.checkboxValue && this.checkboxValue.length > 0)) {
        uni.showToast({
          title: "请勾选协议！",
          icon: "error",
          duration: 2000,
        });
        return;
      }
      this.$refs.ruleForm
        .validate()
        .then((res) => {
          this.openAccount();
        })
        .catch((errors) => {
          uni.$u.toast("请填写正确");
        });
    },
    goToWebView(type) {
      uni.navigateTo({
        url: "/packageA/me/webView/index?url=",
      });
    },
  },
};
</script>

<style lang="scss">
.realNameContainer {
  .content {
    .realNameFormbox {
      padding: 10rpx 30rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
  }
  .realNameBtnBox {
    position: fixed;
    bottom: 50rpx;
    z-index: 999;
    text-align: center;
    width: 100%;

    .tip {
      margin-bottom: 20rpx;
      display: inline-block;
      width: 90%;
      padding: 0 30rpx;
      font-size: 24rpx;
      text-align: left;
    }
    .webview {
      color: #2979ff;
    }
    .realNameBtn {
      display: inline-block;
      width: 80%;
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
