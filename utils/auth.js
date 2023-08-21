// 登录权限判断

// 设置token
export function setToken(token) {
  uni.setStorageSync("token", token);
}

// 获取token
export function getToken() {
  return uni.getStorageSync("token")
}

// 清除token
export function clearToken() {
  uni.removeStorageSync("token")
}

// 设置用户信息
export function setUserInfo(userInfo) {
  uni.setStorageSync("userInfo", JSON.stringify(userInfo));
}

// 获取用户信息
export function getUserInfo() {
  return JSON.parse(uni.getStorageSync("userInfo"));
}


// 白名单 不需要验证token
export const whiteList = [
	'/pages/login/index', // 登录
	'/pages/home/index/index', // 首页
	'/pages/home/resell/index', // 转卖
	'/pages/home/auction/index', // 拍卖
	'/pages/home/seriesDetail/index', // 系列详情
	'/pages/home/skuDetail/index' // 款式详情
]
//登录页
const loginPage = "/pages/login/index"
export function initPermission() {
  // 页面跳转拦截器
  // "switchTab"
  const list = ["navigateTo", "redirectTo", "reLaunch"];
  //用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch 这3个路由方法添加拦截器
	list.forEach(item => {
		uni.addInterceptor(item, {
			invoke(e) { // 调用前拦截
				//获取用户的token
        const token = getToken()
					//获取要跳转的页面路径（url去掉"?"和"?"后的参数）
				let url = e.url.split('?')[0];
				// 如果在whiteList里面就不需要登录
				if (whiteList.includes(url)) {
					return e
				} else {
					//需要登录
					if (!token) {
						uni.navigateTo({
							url: loginPage
						})
						return false
					} else {
						return e
					}
				}
			},
			fail(err) { // 失败回调拦截 
				console.log(err);
			}
		})
	})
}
