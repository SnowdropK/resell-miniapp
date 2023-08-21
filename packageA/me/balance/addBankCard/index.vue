<template>
  <view class="bankCardContainer">
    <CommonContainer title="添加银行卡">
      <view class="content">
        <view class="addBankFormbox">
          <u--form
            labelPosition="left"
            :model="form"
            :rules="rules"
            labelWidth="100"
            ref="ruleForm"
          >
            <u-form-item label="姓名" prop="bankHandlerName" borderBottom>
              <u--input
                v-model="form.bankHandlerName"
                border="none"
                :disabled="true"
              ></u--input>
            </u-form-item>
            <u-form-item label="银行卡号" prop="bankNo" borderBottom>
              <u--input v-model="form.bankNo" border="none"></u--input>
            </u-form-item>
            <u-form-item
              label="银行所在省"
              prop="huiFuProvId"
              clearable
              @click="showProv = true"
              borderBottom
            >
              <view>{{ huiFuProvText || "" }}</view>
              <u-picker
                :show="showProv"
                :columns="provinceList"
                keyName="name"
                @confirm="changeProv"
                @cancel="showProv = false"
              ></u-picker>
            </u-form-item>
            <u-form-item
              label="银行所在市"
              prop="huiFuAreaId"
              @click="handleShowCity"
              borderBottom
            >
              <view>{{ huiFuAreaText || "" }}</view>
              <u-picker
                :show="showCity"
                :columns="cityList"
                keyName="name"
                @confirm="changeCity"
                @cancel="showCity = false"
              ></u-picker>
            </u-form-item>
          </u--form>
        </view>
        <view class="tip"
          >仅能添加本人银行卡，请仔细核对以上银行卡信息，填写错误将无法正常提现</view
        >
        <view class="saveBtnBox">
          <view class="saveBtn" @click="save">保存</view>
        </view>
      </view>
    </CommonContainer>
  </view>
</template>

<script>
// 自定义公共组件
import CommonContainer from "@/components/commonContainer";
// service
import {
  addBankCard,
  fetchWalletInfo,
  fetchProvince,
  fetchCity,
} from "@/api/me";

export default {
  name: "AddBankCard",
  components: {
    CommonContainer,
  },
  data() {
    return {
      provinceList: [],
      cityList: [],
      showProv: false,
      showCity: false,
      form: {
        bankHandlerName: "",
        bankNo: "",
        huiFuProvId: null,
        huiFuAreaId: null,
        defaultUser: true,
      },
      huiFuProvText: "",
      huiFuAreaText: "",
      rules: {
        bankNo: {
          type: "string",
          required: true,
          message: "请填写银行卡号",
          trigger: ["blur", "change"],
        },
        huiFuProvId: {
          type: "string",
          required: true,
          message: "请填写银行所在省",
          trigger: ["blur", "change"],
        },
        huiFuAreaId: {
          type: "string",
          required: true,
          message: "请填写银行所在市",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  onLoad() {
    this.getWalletInfo();
    this.getProvince();
  },
  onReady() {
    //如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
    this.$refs.ruleForm.setRules(this.rules);
  },
  methods: {
    // 余额详情
    async getWalletInfo() {
      const data = await fetchWalletInfo();
      const { realName } = data || {};
      this.form = {
        ...this.form,
        bankHandlerName: realName || "",
      };
    },
    // 获取省
    async getProvince() {
      const data = await fetchProvince();
      this.provinceList = [data || []];
    },
    // 获取市
    async getCity(id) {
      const data = await fetchCity({ id });
      this.cityList = [data || []];
    },
    // 显示城市
    handleShowCity() {
      if (!this.form.huiFuProvId) {
        uni.showToast({
          title: "请先选择省！",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      this.showCity = true;
    },
    // 修改省
    changeProv(e) {
      const {
        // columnIndex,
        // index,
        value,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        // picker = this.$refs.uPicker,
      } = e;
      const val = value[0] ? value[0] : {};
      const { code: id = null, name } = val;
      this.huiFuProvText = name || "";
      this.form = {
        ...this.form,
        huiFuProvId: id || null,
      };
      this.showProv = false;
      this.getCity(id);
    },
    // 修改市
    changeCity(e) {
      const {
        // columnIndex,
        // index,
        value,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        // picker = this.$refs.uPicker,
      } = e;
      const val = value[0] ? value[0] : {};
      const { code: id = null, name } = val;
      this.huiFuAreaText = name || "";
      this.form = {
        ...this.form,
        huiFuAreaId: id || null,
      };
      this.showCity = false;
    },
    // 添加银行卡
    async addBankCard() {
      try {
        const params = this.form;
        await addBankCard(params);
        uni.showToast({
          title: "添加成功",
          icon: "success",
          duration: 2000,
        });
        uni.navigateBack();
      } catch {
        uni.showToast({
          title: "出错了",
          icon: "error",
          duration: 2000,
        });
      }
    },
    save() {
      this.$refs.ruleForm
        .validate()
        .then((res) => {
          this.addBankCard();
        })
        .catch((errors) => {
          uni.$u.toast("请填写正确");
        });
    },
  },
};
</script>

<style lang="scss">
.bankCardContainer {
  .content {
    .addBankFormbox {
      padding: 10rpx 30rpx;
      border-radius: 20rpx;
      background-color: #fff;
    }
    .tip {
      margin-top: 20rpx;
      color: red;
      font-size: 24rpx;
    }
    .saveBtnBox {
      margin-top: 20rpx;
      text-align: center;

      .saveBtn {
        display: inline-block;
        width: 80%;
        padding: 10rpx 30rpx;
        border-radius: 10rpx;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
        background-color: $uni-bg-color;
      }
    }
  }
}
</style>
