// pages/member/orderinfo/success.js
var app = getApp();
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
  //订单列表
  orderList: function (e) {
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