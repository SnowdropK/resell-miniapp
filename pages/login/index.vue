<template>
  <view class="loginContainer">
    <image
      class="avatorImg shadow-lg"
      mode="aspectFill"
      src="/static/images/icons/logo.png"
    />
    <u-button
      class="loginBtn"
      color="linear-gradient(to right, #6b31f7, #d533ba)"
      text="登 录"
      @click="handleLogin"
    ></u-button>
  </view>
</template>
<script>
// vuex
import { mapState, mapActions } from "vuex";
// utils
import { setToken, setUserInfo } from "@/utils/auth";
import { setStorage } from "@/utils/index";

// 常量
import { themeColor } from "@/config/theme";
// service
import { login } from "@/api/me";

export default {
  name: "Login",
  data() {
    return {
      loading: false,
    };
  },
  onLoad() {},
  computed: {
    ...mapState(["loginState", "userInfo"]),
  },
  methods: {
    ...mapActions(["userLoginAction"]),
    async login(loginRes) {
      this.loading = true;
      const params = {
        appid: uni.getAccountInfoSync().miniProgram.appId,
        code: loginRes.code,
        // pid,
      };
      if (this.userInfo.openId) params.pid = this.userInfo.openId;
      const {
        avatarUrl,
        nickname,
        openId,
        sessionKey,
        telephone,
        token,
        userState,
      } = await login(params);
      this.loading = false;
      uni.$u.toast("登录成功");
      const userInfo = {
        avatarUrl: avatarUrl || "",
        nickname: nickname || "",
        telephone: telephone || "",
        openId: openId || "",
        sessionKey: sessionKey || "",
        userState: userState || 0,
      };
      this.userLoginAction(userInfo);
      setToken(token);
      setStorage("sessionKey", sessionKey);
      setUserInfo(userInfo);
      setTimeout(() => {
        uni.navigateBack();
      }, 400);
    },
    handleLogin() {
      uni.getProvider({
        service: "oauth",
        success: (res) => {
          const { provider = [] } = res || {};
          const plat = provider[0] ? provider[0] : "weixin";
          uni.login({
            provider: plat,
            success: (loginRes) => {
              this.login(loginRes);
            },
            fail: () => {
              console.log("登录失败");
            },
          });
        },
      });
    },
  },
};
</script>
<style lang="scss">
.loginContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 354rpx 28rpx 0;

  .avatorImg {
    margin-bottom: 160rpx;
    width: 164rpx;
    height: 164rpx;
    border-radius: 82rpx;
  }
  .loginBtn {
    margin-top: 160rpx;
  }
}
</style>
