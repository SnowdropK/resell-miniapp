const http = uni.$u.http
const defaultConfig = { custom: { auth: true }} // 需要带上token

// 我的赏袋平台
export const fetchBagList = (params) => http.get('/wx/goods-sale/bag-list', { params })
// 赏袋平台下的款式列表
export const fetchBagSkuList = (params) => http.get('/wx/goods-sale/bag-goods-by-talent', { params })
// 赏袋平台下款式的赏品IP列表
export const fetchBagSkuIpList = (params) => http.get('/wx/goods-sale/bag-sale', { params })
// 创建转卖
export const createResellOrder = (data, config = defaultConfig) => http.post('/wx/goods-sale/create-bag-sale', data, config)
