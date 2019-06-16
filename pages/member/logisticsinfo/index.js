// pages/member/logisticsinfo/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 转换
    var that = this;
    var token = wx.getStorageSync('token');
    var routeId = options.routeId;
    var bidCarrierId = options.bidCarrierId;
    that.setData({
      routeId: routeId,
      bidCarrierId: bidCarrierId
    }),
      //发送请求
      wx.request({
      url: t.globalData.api + 'logistics/bid/queryBid?token=' + token + '&bidRouteId=' + routeId + '&bidCarrierId=' + bidCarrierId + '&bidState=2', //接口地址
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
              // routeCreateTime: route.routeCreateTime,
              // routeBeginTime: route.routeBeginTime,
              // routeCarLong: route.routeCarLong,
              // routeCarType: route.routeCarType,
              // routeContactName: route.routeContactName,
              // routeContactPhone: route.routeContactPhone,
              // routeFromAddress: route.routeFromAddress,
              // routeGoodsName: route.routeGoodsName,
              // routeId: route.routeId,
              // routeMaxNumber: route.routeMaxNumber,
              // routeMinNumber: route.routeMinNumber,
              // routeReceiveTime: route.routeReceiveTime,
              // routeToAddress: route.routeToAddress,
              // routeUnit: route.routeUnit
            });
          }
        }
      })
    // 显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 显示时间
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
  //加载物流状态已中标列表
  
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