<script>
import { initPermission } from "@/utils/auth";

export default {
  onLaunch: function (options) {
    initPermission();
    // console.log("App onLaunch");
    // const token = uni.getStorageSync("token");
    // if (token) {
    //   //存在则关闭启动页进入首页
    //   // plus.navigator.closeSplashscreen();
    //   uni.reLaunch({
    //     url: "/pages/home/index/index",
    //   });
    // } else {
    //   //不存在则跳转至登录页
    //   // uni.reLaunch({
    //   //   url: "/pages/login/index",
    //   // });
    // }
  },
  onShow: function (options) {
    const { referrerInfo } = options;
    const { appId, extraData } = referrerInfo || {};
    const { weChatSource, bindCode, openId } = extraData || {};
    if (extraData && !!weChatSource) {
      uni.setStorageSync("weChatBindCode", bindCode);
      uni.setStorageSync("weChatBindOpenId", openId);
    }
  },
  onHide: function () {
    console.log("App Hide");
  },
};
</script>

/* App.vue */
<style lang="scss">
@import "uview-ui/index.scss";
/* 公共样式 */
@import "/common/style/common.css";
/* 基础样式库 */
@import "/common/style/free-main.css";
page {
  // height: 100vh;
  background-color: #f9f9f9;
}
</style>
