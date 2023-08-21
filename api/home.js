const http = uni.$u.http
const defaultConfig = { custom: { auth: true }} // 需要带上token

// 注意：get请求的配置等，都在第二个参数中
// custom: { auth: true, toast: false, catch: false } : 假设不需要在响应拦截器中自动弹出的toast，以及不想写catch(如果promise中进行reject，但是却没有catch的话会报错)

// 获取分类
export const fetchRecommendCategory = (params) => http.get('/wx/category/top-new-category', { params })
// 分类列表
export const fetchCategoryList = (params) => http.get('/wx/category/list-by-parent', { params })
// 系列详情
export const fetchSeriesDetail = (params) => http.get('/wx/category/detail', { params })

// 分类树
export const categoryTree = (params) => http.get('/wx/category/list-group', { params })


// 款式详情页面
// 款式详情
export const fetchGoodsDetail = (params) => http.get('/wx/goods/detail', { params })
// 查询款式和租户下面的转卖列表
export const fetchResellList = (params) => http.get('/wx/goods-sale/list-sale-price-desc', { params })
// 该款式下的最近订单记录
export const fetchStyleOrderRecods = (data, config = defaultConfig) => http.post('/wx/goods-order/order-record', data, config)


// 订单确认
// 轮训下单后的订单详情
export const fetchCreateOrderDetail = (params) => http.get('/wx/goods-order/my-order-detail', { params })
// 订单价格计算-款式下直接按最低价计算
export const fetchOrderPrice = (data, config = defaultConfig) => http.post('/wx/goods-order/price', data, config)
export const fetchOrderPriceBySale = (data, config = defaultConfig) => http.post('/wx/goods-order/price-by-sale', data, config)

// 下单
// export const createOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/create-order', data, config)
export const createOrder = (data, config = defaultConfig) => http.post('/wx/goods-order/create-order-dg', data, config)
