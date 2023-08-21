
const http = uni.$u.http
const defaultConfig = { custom: { auth: true }} // 需要带上token

// 登录
export const login = (params) => http.get('/wx/user/login', { params,  custom: { auth: false } })

// 个人中心首页
// 我的赏袋
export const fetchBagList = (params) => http.get('/wx/goods-sale/bag-list', { params })
// 用户详情
export const fetchUserDetail = (params) => http.get('/wx/user/detail', { params })

// 我的订单
// 我卖出的
export const fetchSellOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/order-page-sale-out', data, config)
// 我卖出的-订单详情
export const fetchSellOrderDetail = (data, config = defaultConfig) => http.post('/wx/goods-order/order-page-sale-out/detail', data, config)
// 我买到的
// export const fetchBuyOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/order-page-shopped', data, config)
export const fetchBuyOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/order/page-shopped', data, config)
// 我买到的-订单详情
// export const fetchBuyOrderDetail = (data, config = defaultConfig) => http.post('/wx/goods-order/order-page-shopped/detail', data, config)
export const fetchBuyOrderDetail = (data, config = defaultConfig) => http.post('/wx/goods-order/order/page-shopped-detail', data, config)
// 取消订单
export const cancelOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/cancel-order', data, config)
// 确认收货
export const confirmOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/confirm-order', data, config)

// 余额中心
// 余额详情
export const fetchWalletInfo = (data, config = defaultConfig) => http.post('/wx/hui-fu/my-wallet', data, config)
// 开通余额账户
export const openAccount = (data, config = defaultConfig) => http.post('/wx/hui-fu/open', data, config)
// 余额明细
export const getBalanceHistory = (data, config = defaultConfig) => http.post('/wx/hui-fu/balance-history', data, config)
// 银行卡列表
export const fetchBankList = (data, config = defaultConfig) => http.post('/wx/hui-fu/bank-list', data, config)
// 新增银行卡
export const addBankCard = (data, config = defaultConfig) => http.post('/wx/hui-fu/add-bank', data, config)
// 删除银行卡
export const delBankCard = (data, config = defaultConfig) => http.post('/wx/hui-fu/remove-bank', data, config)
// 查询省
export const fetchProvince = (data, config = defaultConfig) => http.post('/wx/hui-fu/list-province-code', data, config)
// 查询市
export const fetchCity = (data, config = defaultConfig) => http.post('/wx/hui-fu/list-city-by-province-code', data, config)
// 个人商户提现
export const fetchWithdraw = (data, config = defaultConfig) => http.post('/wx/hui-fu/withdraw', data, config)