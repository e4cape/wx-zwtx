// pages/member/bid/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var routeId = options.routeId;
    that.setData({
      routeId: routeId
    }),
      wx.request({
        url: t.globalData.api + 'logistics/route/routeDetil?routeId=' + routeId,//请求服务器路线详情接口
        data: {},
        method: 'GET',
        // header: {},   
        success: function (res) {
          console.log(res)
          var data = res.data.data;
          that.setData({
            routeCreateTime: data.routeCreateTime,
            routeBeginTime: data.routeBeginTime,
            routeCarLong: data.routeCarLong,
            routeCarType: data.routeCarType,
            routeContactName: data.routeContactName,
            routeContactPhone: data.routeContactPhone,
            routeFromAddress: data.routeFromAddress,
            routeGoodsName: data.routeGoodsName,
            routeId: data.routeId,
            routeMaxNumber: data.routeMaxNumber,
            routeMinNumber: data.routeMinNumber,
            routeReceiveTime: data.routeReceiveTime,
            routeToAddress: data.routeToAddress,
            routeUnit: data.routeUnit,
            routeSn: data.routeSn
          })
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