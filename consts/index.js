// 搜索 类型
export const SEARCH_TYPE = {
  SERIES: 1, // 系列
  IP_STYLE: 2, // 款式
  USER: 3, // 用户
};

// 搜索系列 类型
export const SEARCH_SERIES_TYPE = {
  LATEST: 1, // 最新
  POPULARITY: 2, // 热门
};
	
// 关系 类型
export const RELATION_TYPE = {
  FOLLOW_SERIES: 1, // 关注系列
  LIKE_STYLE: 2, // 喜欢款式
};

// 下单地址类型
export const ORDER_TYPE = {
  PLACE_REWARD_BAG: 0, // Place reward bag
  DIRECT_SHIPMENT: 1, // 直接发货（需要传递地址id）
};

// 订单状态
export const ORDER_STATUS = {
  TO_BE_PAIED: 10, // 待支付
  PAY_SUCCESS: 20, // 支付成功
  INSUFFICIENT_MARGIN: 21, // 支付成功余量不足退款
  SHIPPED: 30, // 已发货
  FINISHED: 40, // 已完成
  CANCELED: 50, // 已取消
}

// 订单状态 10-待支付；20-支付成功；21-支付成功余量不足退款；30-已发货；40-已完成；50-已取消
export const ORDER_STATUS_MAP = {
  TO_BE_PAIED: 10, // 待支付
  TO_BE_SHIPPED: 20, // 待发货
  REFUNDING: 21, // 退款
  TO_BE_RECEIVED: 30, // 待收货
  FINISHED: 40, // 已完成
  CANCELED: 50, // 已取消
}

export const ORDER_STATUS_TEXT_MAP = {
  [ORDER_STATUS_MAP.TO_BE_PAIED]: '待支付', // 待支付
  [ORDER_STATUS_MAP.TO_BE_SHIPPED]: '待发货', // 待发货
  [ORDER_STATUS_MAP.REFUNDING]: '退款', // 退款
  [ORDER_STATUS_MAP.TO_BE_RECEIVED]: '待收货', // 待收货
  [ORDER_STATUS_MAP.FINISHED]: '已完成', // 已完成
  [ORDER_STATUS_MAP.CANCELED]: '已取消', // 已取消
}

// 履约类型
export const AGREEMENT_TYPE_MAP = {
  0: '放原平台赏袋',
  1: '物流发货'
}

// 支付类型
export const PAY_WAY = {
  WECHAT_MINI: 'T_MINIAPP', // 微信小程序
  ALIPAY: 'A_NATIVE', // 支付宝
  BALANCE: 'BALANCE' // 余额
}