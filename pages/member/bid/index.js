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
    var token = wx.getStorageSync('token');
    var routeId = options.routeId;
    var bidCarrierId = options.bidCarrierId;
    var status = options.status;
    that.setData({
      routeId: routeId,
      status: status
    })
      wx.request({
        url: t.globalData.api + 'logistics/bid/queryBid?token=' + token + '&bidRouteId=' + routeId + '&bidCarrierId=' + bidCarrierId + '&bidState=' + status, //接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          console.log(res);
          if (res.data.data != undefined) {
            var dataList = res.data.data.list;
            //var route = res.data.data.route;
            for (var i in dataList) {
              //日期处理
              dataList[i].bidTime = time.formatTime(dataList[i].bidTime);
            }
            that.setData({
              dataList: dataList,
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