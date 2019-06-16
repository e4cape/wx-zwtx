// pages/login/login.js
var t = getApp();
var token = wx.getStorageSync('token');
Page({
  //定义全局变量data
  data: {
    mobile: "",
    password: "",
  },
  //处理accountInput的触发事件
  accountInput: function (e) {
    var mobile = e.detail.value;//从页面获取到用户输入的手机号
    if (mobile != '') {
      this.setData({ mobile: mobile });//把获取到的密码赋值给全局变量data中的memberPhone
    }
  },
  //处理pwdBlurt的触发事件
  pwdBlur: function (e) {
    var password = e.detail.value;//从页面获取到用户输入的密码
    if (password != '') {
      this.setData({ password: password });//把获取到的密码赋值给全局变量data中的memberPassword
    }
  },
  //处理login的触发事件
  login: function (e) {
    if (this.data.mobile == "") {
      wx.showToast({
        title: '手机号码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.password == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        url: t.globalData.api + 'login/member/user/login',//请求服务器登录接口
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberPhone: this.data.mobile,
          memberPassword: this.data.password,
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          console.log(res.data.data);
          if (res.data.code == 200) {
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            }),
              wx.setStorage({
                key: 'memberType',
                data: res.data.data.memberInfo.memberType
              }),
              wx.setStorage({
              key: 'memberPhone',
              data: res.data.data.memberInfo.memberPhone
              }),
              wx.setStorage({
              key: 'memberId',
              data: res.data.data.memberInfo.memberId
              }), 
              wx.setStorage({
              key: 'memberAccount',
              data: res.data.data.memberInfo.memberAccount
              }),
              wx.showToast({
                title: '登录成功',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.switchTab({
                      url: '../index/index'　　// 登录成功，跳转到首页
                    })
                  }, 2000) //延迟时间
                }
              })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
            })
          }

        },
        fail: function (res) {
          console.log("调用API失败");
        }
      })
    }
  }

  
})