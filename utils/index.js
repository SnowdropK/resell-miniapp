// 工具函数
// 加
export const accAdd = (num1, num2) => {
  let r1
  let r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  const n = r1 >= r2 ? r1 : r2
  return (Math.round(num1 * m + num2 * m) / m).toFixed(n)
}

// 减
export const accSub = (num1, num2) => {
  let r1
  let r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  const n = r1 >= r2 ? r1 : r2
  return (Math.round(num1 * m - num2 * m) / m).toFixed(n)
}

// 乘
export const accMul = (arg1, arg2) => {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
  } catch (e) {
    // console.error('出错了')
  }
  try {
    m += s2.split('.')[1].length
  } catch (e) {
    // console.error('出错了')
  }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

// 除
export const accDiv = (arg1, arg2) => {
  var t1 = 0,
    t2 = 0,
    r1,
    r2
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
    // console.error('出错了')
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
    // console.error('出错了')
  }

  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

// 保留n位小数
export const toFixed = (number, n) => {
  n = +n || 0
  return Math.round(number * Math.pow(10, n)) / Math.pow(10, n)
}

// 分转元
export const toYuan = (val) => {
  return isNaN(val) ? 0 : accDiv(val, 100);
}

// 设置storage
export function setStorage(key, val) {
  uni.setStorageSync(key, JSON.stringify(val));
}
// 获取storage
export function getStorage(key) {
  return JSON.parse(uni.getStorageSync(key));
}

// 删除storage
export function removeStorage(key) {
  uni.removeStorageSync(key);
}

// 格式化列表参数
export const getQueryParams = (params, list) => {
  return {
    ...params,
    pageNo: list.length > 0 ? params.pageNo : params.pageNo - 1,
  };
}

// 隐藏手机号中间四位
export const getTel = (tel) => {
	var reg = /^(\d{3})\d{4}(\d{4})$/;  
	return tel.replace(reg, "$1****$2");
}