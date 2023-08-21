import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	// 这个代表全局可以访问数据对象，在组件中声明的 data 属性
	state: {
		loginState: !!uni.getStorageSync('loginState') ? true : false,
		userInfo: !!uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {
			avatarUrl: '/static/nopic.png',
			nickname: "用户",
			telephone: "",
			openId: "",
			sessionKey: "",
			userState: 1,
		}
	},
	// 实时监听 state 内的数据对象变化
	getters: {

	},
	// 同步设置 state 的值
	mutations: {
		userLogin(state, userInfo) {
			state.loginState = true
			state.userInfo = userInfo
			uni.setStorageSync('loginState', 'ok')
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		},
		userLogout(state) {
			state.loginState = false
			state.userInfo = {
				avatarUrl: '/static/nopic.png',
				nickname: "用户",
				telephone: "",
				openId: "",
				sessionKey: "",
				userState: 1,
			}
			uni.removeStorageSync('userInfo')
			uni.removeStorageSync('loginState')
			uni.removeStorageSync('token')
		}
	},
	// 通过提交 mutations 内部的方法，异步更新 state 的状态，官方推荐都使用这种方法比较合适
	actions: {
		userLoginAction(context, userInfo) {
			context.commit('userLogin', userInfo)
		},
		userLogoutAction(context) {
			context.commit('userLogout')
		}
	}
})
export default store
