const http = uni.$u.http
const config = { header: {'Content-Type': 'application/x-www-form-urlencoded'} }

// 上传
export const uploadImg = (data) => http.post('/wx/home/upload/sts', {})
// 获取用户信息接口
export const getUserInfo = (params) => http.get('/wx/user/info', { params })
// 用户的基础信息：查询别人需要传递id，查询自己不需要
export const getUserDetail = (params) => http.get('/wx/user/detail', { params })
// 更新用户信息
export const updateUserInfo = (data) => http.post('/wx/user/update/user/info', data)
// 微信鉴权+更新用户信息【手机号】
export const updatePhone = (data) => http.post('/wx/user/update/user/info/phone', data)
 
// 查询用户发布的转卖商品列表
export const mySaleList = (params) => http.get('/wx/goods-sale/list-my-sale-time-desc', { params })
// 编辑信息回显
export const updateSaleInfo = (data) => http.post('/wx/goods-sale/bag-sale/update/info', data)
// 转卖编辑
export const updateSale = (data) => http.post('/wx/goods-sale/bag-sale/update', data)
// 转卖编辑
export const deleteSale = (data) => http.post('/wx/goods-sale/bag-sale/remove', data)


 // 赏袋
 // 赏袋列表-按平台
 export const fetchBagDetail = (params) => http.get('/wx/talent/detail', { params })
 // 赏袋平台下款式的赏品IP列表
 export const fetchBagSkuIpList = (params) => http.get('/wx/goods-sale/bag-sale', { params })
 // 赏袋平台下的款式列表
 export const fetchBagSkuList = (params) => http.get('/wx/goods-sale/bag-goods-by-talent', { params })
 // 打开某平台的赏袋-按IP聚合
 export const bagGroupIp = (params) => http.get('/wx/free/reward-bag/get-bag-list-group-ip', { params })
 // 打开赏袋列表-显示具体IP下赏品信息
 export const bagListInIp = (params) => http.get('/wx/free/reward-bag/get-bag-list-in-group-ip', { params })
 
 // 地址
 // 添加地址/更新地址
 export const addAddress = (data) => http.post('/wx/address/update-address', data)
 // 删除地址
 export const deleteAddress = (id) => http.post('/wx/address/remove-address?id=' + id)
 // 地址列表
 export const getAddressList = (params) => http.get('/wx/address/my-address', { params })
 
 // 导入微信地址
 export const getWXAddress = () => http.post('/wx/address/batch-add-address')
 
 // 支付管理
 // 新增、修改
 export const addPay = (data) => http.post('/wx/app/pay-account/upsert', data)
 // 查询
 export const getPays = () => http.post('/wx/app/pay-account/list')
 // 删除
 export const delPay = (id) => http.get('/wx/app/pay-account/delete?id=' + id)
 
// 帮助
 export const helpList = () => http.post('/wx/home/help-data-list')