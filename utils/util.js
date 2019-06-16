// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// const formatNumber = n => {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }
const $init = (page) => {
  page.$data = objectUtil.$copy(page.data, true)
}

const $digest = (page) => {
  let data = page.data
  let $data = page.$data
  let ready2set = {}

  for (let k in data) {
    if (!objectUtil.$isEqual(data[k], $data[k])) {
      ready2set[k] = data[k]
      $data[k] = objectUtil.$copy(data[k], true)
    }
  }

  if (Object.keys(ready2set).length) {
    page.setData(ready2set)
  }
}
function formatTime(date) {
  var date = new Date(date);
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()


  return [year, month, day].map(formatNumber).join('/') + ' '
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
module.exports = {
  formatTime: formatTime,  // 日期转时间戳
  $init,
  $digest
}