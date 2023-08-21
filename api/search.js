const http = uni.$u.http

// 	搜索全部
export const searchAll = (data) => http.get('/wx/home/home-search-all', { data })

// 搜索排序接口（单个）
export const searchSort = (data) => http.get('/wx/home/search-sort-page',  { data })

// 热门款式前十个
export const hotTopList = (params) => http.get('/wx/goods/hot-top-list', params)

// 热门系列前十个
export const favTopList = (params) => http.get('/wx/category/list-top-fav', params)
