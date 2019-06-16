// pages/member/setting/index.js
var t = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //关于我们
  aboutUs: function (e) {
    //dataset内包含data-*的数据
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.navigateTo({
      url: '/pages/member/setting/about?token=' + token,
    })
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + options.token,//请求服务器路线详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        that.setData({
          memberAvatar: data.memberAvatar,
          memberAccount: data.memberAccount,
          memberNickname: data.memberNickname,
          memberPhone: data.memberPhone
        })
      }
    })
  },
  //会员退出
  out: function (e) {
    //dataset内包含data-*的数据
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: t.globalData.api + 'login/member/logout?token=' + token,//请求服务器路线详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res)
        if (res.data.code == 200) {
          wx.clearStorage()
          wx.showToast({
            title: '退出成功',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.switchTab({
                  url: '/pages/index/index'　　//退出成功跳转到首页
                })
              }, 2000) //延迟时间
            }
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
                  url: '/pages/login/login'　　//跳转到登录页面
                })
              }, 2000) //延迟时间
            }
          })
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