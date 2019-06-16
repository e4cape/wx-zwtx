var t = getApp();
t.requirejs("core");
//数量控制
module.exports.number = function (t, e) {
  var o = e.currentTarget.dataset,
    a = o.value,
    s = (o.hasOwnProperty("min") && parseInt(o.min), o.hasOwnProperty("max") ? parseInt(o.max) : 999);
  return "minus" === e.target.dataset.action ? a > 1 && a-- : "plus" === e.target.dataset.action && (a < s || 0 == s ? a++ : this.toast(t, "最多购买5件")),
    a
},
//弹框封装
  module.exports.toast = function (t, e, o) {
    o || (o = 1500),
      t.setData({
        FoxUIToast: {
          show: true,
          text: e
        }
      });
    setTimeout(function () {
      t.setData({
        FoxUIToast: {
          show: false
        }
      })
    }, o)
  },
	//提示封装
  module.exports.notify = function (t, e, o, a) {
    a || (a = 1500),
      o || (o = "default"),
      t.setData({
        FoxUINotify: {
          show: true,
          text: e,
          style: o
        }
      });
    setTimeout(function () {
      t.setData({
        FoxUINotify: {
          show: false
        }
      })
    }, a)
  }