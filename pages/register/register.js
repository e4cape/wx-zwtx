// pages/register/register.js
var t = getApp();
Page({
  /**
   * 页面的初始数据
   * data为全局变量
   */
  data: {
    memberPhone: "",//手机号
    code: "",//验证码
    //iscode: null,//用于存放验证码接口里获取到的code
    codename: '获取验证码',
    memberPassword: "",//密码
    repassword: "",
    mhHidden: true,
    check: 0,//未勾选
    mmHidden: false,
    state: 0,//未注册
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var userInfo = options.userInfo,
      encryptedData = options.encryptedData;
      this.setData({
        
      })
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
    var that = this;
    var phone = e.detail.value;//从页面获取到用户输入的手机号
    if (phone != '') {
      that.setData({ memberPhone: phone });//把获取到的密码赋值给data中的memberPhone
    }
    wx.request({
      //请求服务器微信小程序通过手机号判断用户是否注册接口
      url: t.globalData.api + 'login/member/tel?phone=' + phone,
      //定义传到后台的数据
      data: {},
      method: 'get',//定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res)
        if (res.data.data == 1){
          that.setData({ 
            mmHidden: true,
            state: res.data.data,
          });
        }else{
          that.setData({
            mmHidden: false,
            state: res.data.data,
          });
        }
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
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
    var pwd = e.detail.value;//从页面获取到用户输入的密码
    if (pwd != '') {
      this.setData({ memberPassword: pwd });//把获取到的密码赋值给data中的memberPassword
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
    console.log(a);
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
      wx.request({
        data: {},
        //请求服务器获取手机验证码接口
        url: t.globalData.api +'login/member/mobileregister?memberPhone='+a,
        method: 'get',//定义传到后台接受的是post方法还是get方法
        success(res) {
          console.log(res)
          //  _this.setData({
          //    iscode: res.data
          //  })
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
//通过判断改变状态时value值是否为1来来判断是否被选中 
//1代表选中   0代表没有选中 
gouxuan: function (e) {
    if (e.detail.value == 1) {
     var check = 1
    }
    else {
    var check = 0
    }
  this.setData({ check: check });
  console.log(check);
  },
  //处理register的触发事件
  register: function (e) {
    var openid = wx.getStorageSync('openid');
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.memberPhone == "") {
      wx.showToast({
        title: '手机号或者账号不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.state != 1) {
     if (!myreg.test(this.data.memberPhone)) {
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
    }
    if (this.data.memberPassword != this.data.repassword) {
        wx.showToast({
          title: '两次密码不一致',
          icon: 'none',
          duration: 1000
        })
        return false;
      } 
    }
    if (this.data.check != 1) {
      wx.showToast({
        title: '请勾选用户完善资料协议',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else{
    //已注册账号
    if (this.data.state == 1) {
      wx.request({
        //请求服务器注册接口
        url: t.globalData.api + 'login/member/register',
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberPhone: this.data.memberPhone,
          memberOpenid: openid,
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          if (res.data.code == 200) {
            console.log(res.data.data);
            //console.log(openid);
            wx.showToast({
              title: '完善资料成功',
              icon: 'none',
              duration: 3000,
              success: function () {
                wx.request({
                  url: t.globalData.api + 'login/member/user/login',//请求服务器登录接口
                  //定义传到后台的数据
                  data: {
                    //从全局变量data中获取数据
                    memberOpenid: res.data.data

                  },
                  method: 'post',//定义传到后台接受的是post方法还是get方法
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log(res);
                    if (res.data.code == 200) {
                      console.log('注册token:' + res.data.data.token);
                      wx.setStorage({
                        key: 'token',
                        data: res.data.data.token
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
                        wx.switchTab({
                          url: '/pages/index/index'　　// 登录成功，跳转到首页
                        })
                    } else {
                      wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000,
                        success: function () {
                          setTimeout(function () {
                            //要延时执行的代码
                            wx.navigateTo({
                              url: '/pages/register/register'　　//跳转到注册页面
                            })
                          }, 3000) //延迟时间
                        }
                      })
                    }

                  },
                  fail: function (res) {
                    console.log("调用API失败");
                  }
                })
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
     }else{
      wx.request({
        //请求服务器注册接口
        url: t.globalData.api + 'login/member/register',
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberPhone: this.data.memberPhone,
          code: this.data.code,
          memberPassword: this.data.memberPassword,
          memberSource: 2,
          memberOpenid: openid,
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '完善资料成功',
              icon: 'none',
              duration: 3000,
              success: function () {
                wx.request({
                  url: t.globalData.api + 'login/member/user/login',//请求服务器登录接口
                  //定义传到后台的数据
                  data: {
                    //从全局变量data中获取数据
                    memberOpenid: openid
                  },
                  method: 'post',//定义传到后台接受的是post方法还是get方法
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    console.log(res.data.data);
                    if (res.data.code == 200) {
                      console.log('注册token:' + res.data.data.token);
                      wx.setStorage({
                        key: 'token',
                        data: res.data.data.token
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
                        wx.switchTab({
                          url: '/pages/index/index'　　// 登录成功，跳转到首页
                        })
                    } else {
                      wx.showToast({
                        title: res.data.message,
                        icon: 'none',
                        duration: 2000,
                        success: function () {
                          setTimeout(function () {
                            //要延时执行的代码
                            wx.navigateTo({
                              url: '/pages/register/register'　　//跳转到注册页面
                            })
                          }, 3000) //延迟时间
                        }
                      })
                    }

                  },
                  fail: function (res) {
                    console.log("调用API失败");
                  }
                })
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
  },
  /*用户完善资料弹框*/
  blue: function () {
    this.setData({
      mhHidden: false
    });
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //处理changeModel的触发事件
  changeModel: function (e) {
    this.setData({
      mhHidden: true
    });
  },
})