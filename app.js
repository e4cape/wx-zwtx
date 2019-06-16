//注意：
//App() 必须在 app.js 中注册，且不能注册多个。
//不要在定义于 App() 内的函数中调用 getApp() ，使用 this 就可以拿到 app 实例。
//不要在 onLaunch 的时候调用 getCurrentPages() ，此时 page 还没有生成。

//引入核心函数
var e = require("utils/core.js");
var icon = require("utils/icons.js");
//app初始化
App({
  //当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
  onLaunch: function (options) {
    // var userinfo = this.getCache("userinfo"); //用户数据会在3个小时过期
    // if(userinfo == ''){
    // 	//重新获取用户数据
    // 	this.getUserInfo();
    // }else{
    //   //初始化APP信息
    //   this.initApp();
    // };
    this.getUserInfo();
    this.initApp();
    this.getMemberInfo();
  },
  //当小程序启动，或从后台进入前台显示，会触发 onShow
  onShow: function () {
  },
  //当小程序从前台进入后台，会触发 onHide
  onHide: function () {

  },
  //当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  onError: function () {

  },
  //封装引入js，都再util目录上
  requirejs: function (e) {
    return require("utils/" + e + ".js")
  },
  //获取用户信息
  getUserInfo: function (t, i) {
    var n = this;
    //获取用户信息及微信登录
    wx.login({
      success: function (res) {
        console.log(res)
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://szyizhitong.com/login/member/memberAuthorization?jsCode=' + res.code,
              data: {},
              method: 'get',//定义传到后台接受的是post方法还是get方法
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (result) {
                console.log(result)
                wx.setStorage({
                  key: 'openid',
                  data: result.data.data.openid
                }),
                wx.setStorage({
                  key: 'session_key',
                  data: result.data.data.session_key
                })
              },
              
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        //首先检测下返回数据
        // if (!o.code) return void e.alert("微信获取用户登录态失败");
        // //返回成功
        // wx.getUserInfo({
        //   success: function (i) {
        //     console.log(i)
        //     var userinfo = i.userInfo; //获取用户信息
        //     //请求业务服务器登录接口
        //     e.post("user/login", { code: o.code, userinfo: userinfo }, function (o) {
        //       console.log(56);
        //       if (o.code != 0) {
        //         console.log(o);
        //       } else {
        //         //登录成功
        //         var data = o.data;
        //         console.log(data);
        //         n.setCache("loginData", data); //存储登录返回的数据
        //         n.setCache("token", data.token); //存储token信息
        //         //拼接用户数据
        //         userinfo.id = data.user_id;
        //         userinfo.openid = data.openid;
        //         userinfo.unionid = data.unionid;
        //         n.setCache("userinfo", userinfo);
        //       }
        //     })
        //   }
        // });
      },
      fail: function () {
        e.alert("获取用户信息失败!")
      }
    })
  },
  //初始化APP信息
  initApp: function () {
  },
  

  //检测服务器返回数据并做处理
  checkData: function (res) {
    var code = res.code;
    var msg = undefined;
    var direct_url = undefined;
    if (code == undefined) {
      //数据不符合规范
      msg = '服务器数据有误';
    }
    if (code == 0) return true;
    if (code == 10001) {
      //token无效或为空;
      msg = 'token无效或为空';
      //清除用户数据并且重新获取token
      this.removeCache("userinfo");
      this.getUserInfo();
    } else if (code == 10002) {
      msg = 'token已过期';
      //刷新token
    } else if (code == 10003) {
      //跳转到收货地址
      wx.showModal({
        title: "新增地址",
        content: '请新增收货地址再进行下单操作',
        showCancel: false,
        confirmText: '新增地址',
        success: function (ares) {
          if (ares.confirm) {
            wx.relaunch({ url: '/pages/member/address/index?form=order' });
          }
        }
      });
      return false;
    } else {
      //其他情况提示错误信息
      msg = res.data.msg;
    }

    //提示信息并跳转
    if (msg != undefined) {
      //提示错误信息
      wx.showToast({
        title: msg,
        image: icon.notice,
        mask: true,
        duration: 1500
      });
      if (direct_url == undefined) direct_url = '/pages/index/index';//默认跳到首页
      //跳转
      setTimeout(function () {
        wx.reLaunch({ url: direct_url }); //关闭所有页面，打开到应用内的某个页面
      }, 1500);
    } else {
      //某些情况不需要提示直接跳转的
      if (direct_url != undefined) {
        wx.redirectTo({ url: direct_url }); //跳转到某个页面
      }
    }
    return false;
  },

  //url封装
  url: function (e) {
    e = e || {};
    var t = {},
      i = "",
      n = "",
      a = this.getCache("usermid");
    i = e.mid || "",
      n = e.merchid || "",
      "" != a ? ("" != a.mid && void 0 !== a.mid || (t.mid = i), "" != a.merchid && void 0 !== a.merchid || (t.merchid = n)) : (t.mid = i, t.merchid = n),
      this.setCache("usermid", t, 7200)
  },
//获取用户信息
getMemberInfo: function(e){
  var that = this;
  var token = wx.getStorageSync('token');
  console.log(token)
  wx.request({
    url: 'https://szyizhitong.com/login/member/getMemberInfo?token=' + token,//请求服务器路线详情接口
    data: {},
    method: 'GET',
    // header: {},   
    success: function (res) {
      console.log(res.data)
      that.globalData.code = res.data.code;
      that.globalData.message = res.data.message;
    }
  })
},
  // globalData: {
  //   appid: "wx2876603f597a997c",
  //   api: "https://ezwtx.com/",
  //   approot: "https://ezwtx.com/",
  //   userInfo: null,
  //   code: '',
  //   message: '',
  // }
  globalData: {
    appid: "wx2876603f597a997c",
    api: "https://szyizhitong.com/",
    approot: "https://szyizhitong.com/",
    userInfo: null,
    code: '',
    message: '',
  }
})