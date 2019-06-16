var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
	return typeof t
}
	: function (t) {
		return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
	},
	e = require("jquery");
//需要通过module.exports暴露接口，才能引用
module.exports = {
	toQueryPair: function (t, e) {
		return void 0 === e ? t : t + "=" + encodeURIComponent(null === e ? "" : String(e))
	},
	//获取url,拼接好完整的api数据
	getUrl: function (api, params) {
		var url = getApp().globalData.api + api;
		if (params != undefined) {
			if (typeof params == 'string') {
				//字符串类型的参数
				url = url + '?' + params;
			} else {
				//键值对类型的参数
				url = url + '?' + e.param(params);
			}
		}
		return url;
	},
	//api为url,params为参数，func为回调，loading为加载标志，method为post或get的标志,true为post,false为get，del_cokie为删除cookie
	json: function (api, params, func, loading, method, del_cokie) {
		var self = this;
		var app = getApp();
		var userinfo = app.getCache("userinfo");
		var token = app.getCache("token");
		//参数处理
		params = params || {};
		if(userinfo != ''){
			params.openid = userinfo.openid;
		}
		if (token != '') {
			params.token = token
		}
		//显示加载中
		loading && self.loading();
		if(method == true){
			//post请求
			var url = self.getUrl(api);
		}else{
			//get请求
			var url = self.getUrl(api,params);
		}
		//拼接请求数据
		var request = {
			url: url,
			method: method ? "POST" : "GET",
			header: {
				"Content-type": method ? "application/x-www-form-urlencoded" : "application/json",
				Cookie: "PHPSESSID=" + userinfo.openid
			}
		};
		//是否删除cokie
		del_cokie || delete request.header.Cookie;
		if(method == true){
			//post请求拼接数据
			request.data = e.param(params);
		}
		//回调函数
		if (func != undefined) {
			request.success = function (res) {
				loading && self.hideLoading();//隐藏loading
				if (res.errMsg == 'request:ok' && typeof func == 'function') {
					func(res.data);
				}
			}
		}

		//请求微信数据请求接口
		wx.request(request)
	},
	//post请求
	post: function (t, e, n, o, i) {
		this.json(t, e, n, o, true, i)
	},
	//get请求
	get: function (t, e, n, o, i) {
		this.json(t, e, n, o, false, i)
	},
	getDistanceByLnglat: function (t, e, n, o) {
		function i(t) {
			return t * Math.PI / 180
		}
		var a = i(e),
			c = i(o),
			r = a - c,
			s = i(t) - i(n),
			u = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(r / 2), 2) + Math.cos(a) * Math.cos(c) * Math.pow(Math.sin(s / 2), 2)));
		return u *= 6378137,
			u = Math.round(1e4 * u) / 1e7
	},
	//弹出框封装
	alert: function (e, n) {
		"object" === (void 0 === e ? "undefined" : t(e)) && (e = JSON.stringify(e)),
			wx.showModal({
				title: "提示",
				content: e,
				showCancel: false,
				success: function (t) {
					t.confirm && "function" == typeof confirm && n()
				}
			})
	},
	//确认框封装
	confirm: function (e, n, o) {
		"object" === (void 0 === e ? "undefined" : t(e)) && (e = JSON.stringify(e)),
			wx.showModal({
				title: "提示",
				content: e,
				showCancel: true,
				success: function (t) {
					t.confirm ? "function" == typeof n && n() : "function" == typeof o && o()
				}
			})
	},
	//加载框封装
	loading: function (t) {
		void 0 !== t && "" != t || (t = "加载中"),
			wx.showToast({
				title: t,
				icon: "loading",
				duration: 5e6
			})
	},
	//加载完成，隐藏加载框
	hideLoading: function () {
		wx.hideToast()
	},
	//自定义弹框内容
	toast: function (t, e) {
		e || (e = "success"),
			wx.showToast({
				title: t,
				icon: e,
				duration: 1000
			})
	},
	//成功操作提示
	success: function (t) {
		wx.showToast({
			title: t,
			icon: "success",
			duration: 1000
		})
	},
	//上传操作
	upload: function (callback) {
		var e = this;
		wx.chooseImage({
			success: function (n) {
        // console.log(n)
				e.loading("正在上传...");
        var o = e.getUrl("imageWeb", {file: "file"}); //url
				var i = n.tempFilePaths; //集合
        console.log(o)
        console.log(i)
				wx.uploadFile({
					url: o,
					filePath: i[0],
					name: "file",
					success: function (n) {
            console.log(n)
						e.hideLoading();
						var o = JSON.parse(n.data);
						if (0 != o.code)
							e.alert("上传失败");
            else if ("function" == typeof callback) {
							var i = o.data.path;
              //触发回掉
              callback(i);
						}
					}
				})
			}
		})
	},
	pdata: function (t) {
		return t.currentTarget.dataset
	},
	data: function (t) {
		return t.target.dataset
	},
	phone: function (t) {
		var e = this.pdata(t).phone;
		wx.makePhoneCall({
			phoneNumber: e
		})
	},
	pay: function (e, n, o) {
		return "object" == (void 0 === e ? "undefined" : t(e)) && ("function" == typeof n && (e.success = n, "function" == typeof o && (e.fail = o), void wx.requestPayment(e)))
	},
	cartcount: function (t) {
		this.get("member/cart/count", {}, function (e) {
			t.setData({
				cartcount: e.cartcount
			})
		})
	},
	//分享消息定义
	onShareAppMessage: function (t) {
		var e = getApp(),
			n = e.getCache("sysset"),
			o = n.share || {},
			i = e.getCache("userinfo"),
			a = "",
			c = n.shopname || "",
			r = n.description || "";
		return o.title && (c = o.title),
			o.desc && (r = o.desc),
			i && (a = i.id),
			t = t || "/pages/index/index",
			t = -1 != t.indexOf("?") ? t + "&" : t + "?", {
				title: c,
				desc: r,
				path: t + "id=" + a
			}
	}
}