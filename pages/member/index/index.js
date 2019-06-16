var app = getApp();
var core = app.requirejs('core');
var openid, token, code;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    wxHidden: true,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    memberAvatar:'/static/images/icon/upload.png',
    memberIntegral: '',//会员积分,
    memberType: '',
    memberNickname: '', 
    code: '',//token验证返回状态码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    openid = wx.getStorageSync('openid');
    token = wx.getStorageSync('token');
    var message = app.globalData.message;//token验证登录返回状提示信息
    var memberAvatar = wx.getStorageSync('memberAvatar');
    var memberNickname = wx.getStorageSync('memberNickname');
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,//请求服务器路线详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.switchTab({
            url: '/pages/member/index/index'
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
        var data = res.data.data;
        if (data.memberAvatar != null){
          that.setData({
            memberAvatar: data.memberAvatar,
          })
        } else {
          console.log(11111)
          that.setData({
            memberAvatar: memberAvatar,
          })
        }
        if (data.memberNickname != null){
          that.setData({
            memberNickname: data.memberNickname,
          })
        }else{
          console.log(2222)
          that.setData({
            memberNickname: memberNickname,
          })
        }
        that.setData({
          memberIntegral: data.memberIntegral,
          memberType: data.memberType,
        })
      }
    })
  },
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo);
    //return false;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      app.getUserInfo(); //重新获取用户信息
      openid = wx.getStorageSync('openid'); //重新赋值openid

      //请求服务器登录接口
      wx.request({
        url: app.globalData.api + 'login/member/user/login',
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
          console.log(res);
          if (res.data.code == 200) {
            token = res.data.data.token; //赋值token
            var memberInfo = res.data.data.memberInfo;
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            }),
              wx.setStorage({
                key: 'memberPhone',
                data: memberInfo.memberPhone
              }),
              wx.setStorage({
                key: 'memberId',
                data: memberInfo.memberId
              }),
              wx.setStorage({
                key: 'memberAccount',
                data: memberInfo.memberAccount
              }),
            wx.setStorage({
              key: 'memberAvatar',
              data: e.detail.userInfo.avatarUrl
            }),
            wx.setStorage({
              key: 'memberNickname',
              data: e.detail.userInfo.nickName
            })
            //用户已经授权过
            if (memberInfo.memberAvatar != null) {
              that.setData({
                memberAvatar: memberInfo.memberAvatar,
              })
            } else {
              // console.log(11111)
              that.setData({
                memberAvatar: e.detail.userInfo.avatarUrl,
              })
            }
            if (memberInfo.memberNickname != null) {
              that.setData({
                memberNickname: memberInfo.memberNickname,
              })
            } else {
              // console.log(2222)
              that.setData({
                memberNickname: e.detail.userInfo.nickName,
              })
            }
            that.setData({
              wxHidden: true,
              code: res.data.code,
            });
            that.onShow();
          }
          else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/register/register'　　// 跳转到注册页面
                  })
                }, 2000) //延迟时间
              }
            })
          }
        },
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  /*微信授权登录*/
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
  //获取用户信息
  getUserInfo: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        console.log(123)
        that.setData({
          code: res.data.code,
        })
      }
    })
  },
  //会员详情
  memberInfo: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var status = e.currentTarget.dataset.status;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          wx.navigateTo({
            url: '/pages/member/userinfo/index?token=' + token,
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  }, 
  
  //订单列表
  orderList: function(e) {
    //dataset内包含data-*的数据
    var that = this;
    var status = e.currentTarget.dataset.status;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.navigateTo({
            url: '/pages/member/orderlist/index?status=' + status,
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
    
  },
  //企业账号
  enterprise: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.navigateTo({
            url: '/pages/member/enterprise/index',
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //地址管理
  address: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.navigateTo({
            url: '/pages/member/address/index?token=' + token,
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //我的积分
  integral: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.navigateTo({
            url: '/pages/member/integral/index?token=' + token,
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //联系客服
  service: function (e) {
    //dataset内包含data-*的数据
    var token = wx.getStorageSync('token');
    console.log(token)
      wx.navigateTo({
        url: '/pages/member/service/index?token=' + token,
      })
  },
  //设置
  setting: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: app.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.navigateTo({
            url: '/pages/member/setting/index/index',
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
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
    this.onLoad()
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

  }
})