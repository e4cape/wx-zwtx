// pages/rememberpassword/index.js
var t = getApp();
Page({
  /**
   * 页面的初始数据
   * data为全局变量
   */
  data: {
    memberPhone: "",//手机号
    code: "",//验证码
    codename: '获取验证码',
    memberPassword: "",//密码
    repassword: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //处理accountInput的触发事件
  accountInput: function (e) {
    var memberPhone = e.detail.value;//从页面获取到用户输入的手机号
    if (memberPhone != '') {
      this.setData({ memberPhone: memberPhone });//把获取到的密码赋值给data中的memberPhone
    }
  },
  //处理codeInput的触发事件
  codeInput: function (e) {
    var code = e.detail.value;//从页面获取到用户手机验证码
    if (code != '') {
      this.setData({ code: code });//把获取到的密码赋值给data中的code
    }
  },
  //处理pwdBlur的触发事件
  pwdBlur: function (e) {
    var memberPassword = e.detail.value;//从页面获取到用户输入的密码
    if (memberPassword != '') {
      this.setData({ memberPassword: memberPassword });//把获取到的密码赋值给date中的memberPassword
    }
  },
  //处理repasswordInput的触发事件
  repasswordInput: function (e) {
    var repwd = e.detail.value;//从页面获取到用户输入的密码
    if (repwd != '') {
      this.setData({ repassword: repwd });//把获取到的密码赋值给data中的repassword
    }
  },
  //获取验证码
  getCode: function () {
    var a = this.data.memberPhone;
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.memberPhone == "") {
      wx.showToast({
        title: '手机号不能为空！',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.memberPhone)) {
      wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      /*wx.showToast({
         title: '1238888',
         icon: 'none',
         duration: 1000
       })
       return false;*/
      wx.request({
        data: {},
        //请求服务器获取手机验证码接口
        'url': t.globalData.api +'login/member/mobileregister?memberPhone=' + a,
        method: 'get',//定义传到后台接受的是post方法还是get方法
        success(res) {
          console.log(res)
          // _this.setData({
          //   iscode: res.data.data
          // })
          var num = 61;
          var timer = setInterval(function () {
            num--;
            if (num <= 0) {
              clearInterval(timer);
              _this.setData({
                codename: '重新发送',
                disabled: false
              })

            } else {
              _this.setData({
                codename: num + "s"
              })
            }
          }, 1000)
        }
      })
    }
  },
  getVerificationCode() {
    this.getCode();
    var _this = this
    _this.setData({
      disabled: true
    })
  },
  //处理confirm的触发事件
  confirm: function (e) {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.memberPhone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.memberPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } 
    // else if (this.data.code != this.data.iscode) {
    //   wx.showToast({
    //     title: '验证码错误',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false;
    // }
    if (this.data.memberPassword.length < 6) {
      wx.showToast({
        title: '请输入六位以上的密码',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.memberPassword == "") {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.memberPassword != this.data.repassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      wx.request({
        //请求服务器会员用户忘记密码接口
        url: 'https://szyizhitong.com/login/member/forget/password',
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberPhone: this.data.memberPhone,
          code: this.data.code,
          memberPassword: this.data.memberPassword,
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          if (res.data.code == 200) {
            wx.clearStorage()
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/login/login'　　//修改密码成功跳转到登录页面
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