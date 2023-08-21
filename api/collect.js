const http = uni.$u.http

// 我的收藏 款式
export const favGoods = (data) => http.get('/wx/goods/fav-page', data)
// 我的收藏 系列
export const favCategory = (data) => http.get('/wx/category/fav-page', data)
// 取消收藏
export const removeFav = (data) => http.post('/wx/relation/remove-relation', data)
