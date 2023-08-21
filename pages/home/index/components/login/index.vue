<template>
  <view style="margin-top: 500rpx">
    <u-button type="primary" text="登录" @click="handleLogin"></u-button>
  </view>
</template>
<script>
// vuex
import { mapState, mapActions } from "vuex";
// utils
import { setToken, setUserInfo } from "@/utils/auth";
// service
import { login } from "@/api/me";

export default {
  name: "Login",
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapState(["loginState", "userInfo"]),
  },
  methods: {
    ...mapActions(["userLoginAction"]),
    async login(loginRes) {
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
      setUserInfo(userInfo);
      uni.$u.toast("登录成功");
      uni.reLaunch({
        url: "/pages/home/index/index",
      });
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
<style lang="scss"></style>
