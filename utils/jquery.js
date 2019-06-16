function n(r, e, i, o) {
  var u;
  if (s.isArray(e))
    s.each(e, function (e, u) {
      i || l.test(r) ? o(r, u) : n(r + "[" + ("object" === (void 0 === u ? "undefined" : t(u)) ? e : "") + "]", u, i, o)
    });
  else if (i || "object" !== s.type(e))
    o(r, e);
  else
    for (u in e)
      n(r + "[" + u + "]", e[u], i, o)
}
function r(n) {
  var r = n.length,
    t = s.type(n);
  return !s.isWindow(n) && (!(1 !== n.nodeType || !r) || ("array" === t || "function" !== t && (0 === r || "number" == typeof r && r > 0 && r - 1 in n)))
}
var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (n) {
  return typeof n
} : function (n) {
  return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
},
  e = {},
  i = [],
  o = i.push,
  u = i.indexOf,
  f = e.toString,
  a = e.hasOwnProperty,
  c = "1.10.2".trim,
  l = /\[\]$/,
  s = {
		//判断是否为方法
    isFunction: function (n) {
      return "function" === s.type(n)
    },
		//判断是否为数组
    isArray: Array.isArray || function (n) {
      return "array" === s.type(n)
    },
    isWindow: function (n) {
      return null != n && n == n.window
    },
		//判断是否为数字
    isNumeric: function (n) {
      return !isNaN(parseFloat(n)) && isFinite(n)
    },
    type: function (n) {
      return null == n ? String(n) : "object" === (void 0 === n ? "undefined" : t(n)) || "function" == typeof n ? e[f.call(n)] || "object" : void 0 === n ? "undefined" : t(n)
    },
    isPlainObject: function (n) {
      var r;
      if (!n || "object" !== s.type(n) || n.nodeType || s.isWindow(n))
        return false;
      try {
        if (n.constructor && !a.call(n, "constructor") && !a.call(n.constructor.prototype, "isPrototypeOf"))
          return false
      } catch (n) {
        return false
      }
      if (s.support.ownLast)
        for (r in n)
          return a.call(n, r);
      for (r in n);
      return void 0 === r || a.call(n, r)
    },
    isEmptyObject: function (n) {
      var r;
      for (r in n)
        return false;
      return true
    },
    
    //格式化时间戳
    time: function (value) {
      var secondTime = parseInt(value); //秒
      var minuteTime = 0;  //分
      var hourTime = 0;  //时
      var dateTime = 0;  //天
      if (secondTime > 60) {  //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
          //如果小时大于24，将分钟转换成天
          if (hourTime > 24) {
            //获取天数，获取小时除以24，得到整天数
            dateTime = parseInt(hourTime / 24);
            //获取天数后取佘的小时，获取小时除以24取佘的小时
            hourTime = parseInt(hourTime % 24);
          }
        }
      }
      var result = "" + parseInt(secondTime) + "";
      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + ":" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + ":" + result;
      }
      if (dateTime > 0){
        result = "" + parseInt(dateTime) + "天" + result;
      }
      return result;
    },
		//each循环
    each: function (n, t, e) {
      var i = 0,
        o = n.length,
        u = r(n);
      if (e) {
        if (u)
          for (; i < o && false !== t.apply(n[i], e); i++);
        else
          for (i in n)
            if (false === t.apply(n[i], e))
              break
      } else if (u)
        for (; i < o && false !== t.call(n[i], i, n[i]); i++);
      else
        for (i in n)
          if (false === t.call(n[i], i, n[i]))
            break;
      return n
    },
		//去除留白
    trim: c && !c.call("\ufeff?") ? function (n) {
      return null == n ? "" : c.call(n)
    } : function (n) {
      //return null == n ? "" : (n + "").replace(rtrim, "") //估计rtrim压缩变了名称
      return null == n ? "" : (n + "").replace(l, "")
    },
    makeArray: function (n, t) {
      var e = t || [];
      return null != n && (r(Object(n)) ? s.merge(e, "string" == typeof n ? [n] : n) : o.call(e, n)),
        e
    },
		//判断是否在数组
    inArray: function (n, r, t) {
      var e;
      if (r) {
        if (u)
          return u.call(r, n, t);
        for (e = r.length, t = t ? t < 0 ? Math.max(0, e + t) : t : 0; t < e; t++)
          if (t in r && r[t] === n)
            return t
      }
      return -1
    },
		//数组合并
    merge: function (n, r) {
      var t = r.length,
        e = n.length,
        i = 0;
      if ("number" == typeof t)
        for (; i < t; i++)
          n[e++] = r[i];
      else
        for (; void 0 !== r[i];)
          n[e++] = r[i++];
      return n.length = e,
        n
    },
		//是否为手机
    isMobile: function (n) {
      return "" !== s.trim(n) && /^1[3|4|5|7|8][0-9]\d{8}$/.test(s.trim(n))
    },
		//保留小数点
    toFixed: function (n, r) {
      var t = parseInt(r) || 0;
      if (t < -20 || t > 100)
        throw new RangeError("Precision of " + t + " fractional digits is out of range");
      var e = Number(n);
      if (isNaN(e))
        return "NaN";
      var i = "";
      if (e <= 0 && (i = "-", e = -e), e >= Math.pow(10, 21))
        return i + e.toString();
      var o;
      if (r = Math.round(e * Math.pow(10, t)), o = 0 == r ? "0" : r.toString(), 0 == t)
        return i + o;
      var u = o.length;
      if (u <= t) {
        o = Math.pow(10, t + 1 - u).toString().substring(1) + o,
          u = t + 1
      }
      if (t > 0) {
        o = o.substring(0, u - t) + "." + o.substring(u - t)
      }
      return i + o
    }
  };
s.extend = function () {
  var n,
    r,
    e,
    i,
    o,
    u,
    f = arguments[0] || {},
    a = 1,
    c = arguments.length,
    l = false;
  for ("boolean" == typeof f && (l = f, f = arguments[1] || {}, a = 2), "object" === (void 0 === f ? "undefined" : t(f)) || s.isFunction(f) || (f = {}), c === a && (f = this, --a); a < c; a++)
    if (null != (n = arguments[a]))
      for (r in n)
        e = f[r], i = n[r], f !== i && (l && i && (s.isPlainObject(i) || (o = s.isArray(i))) ? (o ? (o = false, u = e && s.isArray(e) ? e : []) : u = e && s.isPlainObject(e) ? e : {}, f[r] = s.extend(l, u, i)) : void 0 !== i && (f[r] = i));
  return f
},
  s.param = function (r, t) {
    var e,
      i = [],
      o = function (n, r) {
        r = s.isFunction(r) ? r() : null == r ? "" : r,
          i[i.length] = encodeURIComponent(n) + "=" + encodeURIComponent(r)
      };
    if (void 0 === t && (t = false), s.isArray(r) || r.jquery && !s.isPlainObject(r))
      s.each(r, function () {
        o(this.name, this.value)
      });
    else
      for (e in r)
        n(e, r[e], t, o);
    return i.join("&").replace(/%20/g, "+")
  },
  module.exports = s

