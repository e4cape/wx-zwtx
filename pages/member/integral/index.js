// pages/member/integral/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],//积分变动列表
    memberIntegral: ''//会员总积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    if (token != '') {
      //发送请求
      wx.request({
        url: t.globalData.api + 'login/integral/integralDetail?token=' + token, //积分变动列表接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          console.log(res);
          if (res.data.data != null) {
            var dataList = res.data.data.list;
            for (var i in dataList) {
              dataList[i].integralTime = time.formatTime(dataList[i].integralTime);
            }
            that.setData({
              dataList: dataList
            });
          }
        }
      }),
        wx.request({
          url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,//请求服务器路线详情接口
          data: {},
          method: 'GET',
          // header: {},   
          success: function (res) {
            console.log(res)
            var data = res.data.data;
            if (data != null) {
              that.setData({
                memberIntegral: data.memberIntegral
              })
            }
          }
        })
    }
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
    this.onLoad();
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