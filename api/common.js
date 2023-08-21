const http = uni.$u.http
const defaultConfig = { custom: { auth: true }} // 需要带上token

// 系列下的商品列表：搜索聚合接口
export const fetchGoodsList = (params) => http.get('/wx/home/search-sort-page', { params })
// 新增 关注/喜欢等关系
export const addRelation = (data, config = defaultConfig) => http.post('/wx/relation/add-relation', data, config)
// 取消 关注/喜欢等关系
export const deleteRelation = (data, config = defaultConfig) => http.post('/wx/relation/remove-relation', data, config)
// 平台数据
export const fetchPlatConfig = (data, config = defaultConfig) => http.post('/wx/home/static-data', data, config)
// 平台绑定
export const talentBind = (data, config = defaultConfig) => http.post('/wx/talent/bind', data, config)