import App from './App'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === "object" || typeof obj === "function") &&
      typeof obj.then === "function"
    );
  }

  // 统一 vue2 API Promise 化返回格式与 vue3 保持一致
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) { }

// main.js
import uView from 'uview-ui';
Vue.use(uView);
// 引入uView对小程序分享的mixin封装
// let mpShare = require('uview-ui/libs/mixin/mpShare.js');
import mpShare from "@/utils/share.js"
Vue.mixin(mpShare)

// 引入 store 
import store from '@/store/index.js'
Vue.prototype.$store = store

const app = new Vue({
  ...App
})

// 引入请求封装，将app参数传递到配置中
require('@/config/request.js')(app)

// http接口API集中管理引入部分
// import httpApi from '@/common/http.api.js'
// Vue.use(httpApi, app)

// http拦截器，此为需要加入的内容=
// import httpInterceptor from '@/common/http.interceptor.js'
// 这里需要写在最后，是为了等Vue创建对象完成，引入"app"对象(也即页面的"this"实例)
// Vue.use(httpInterceptor, app)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif