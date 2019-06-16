// pages/news/detail/index.js
var t = getApp(),
  e = t.requirejs("core");
var s = t.requirejs("wxParse/wxParse");
var time = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info : {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var articleId = options.id;
    var that = this;
    //显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url: t.globalData.api + 'login/article/queryArticleInfo?articleId=' + articleId,//请求服务器资讯详情接口
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },   
      success: function (res) {
        console.log(res);
        wx.hideLoading(); //隐藏弹框
        var info = res.data.data;
        //日期处理
        var articleTime = time.formatTime(info.articleTime);
        console.log('info:' + info.articleContent)
        s.wxParse("wxParseData", "html", info.articleContent, that, "0");
        console.log('info:' + info.articleContent)
        //内容处理
         info = {
          articleContent: info.articleContent,
          articleTitle: info.articleTitle,
          articleContent: info.articleContent,
          aticleClick: info.aticleClick,
          aticleLove: info.aticleLove,
          articleFrom: info.articleFrom,
          articleTime: articleTime,
           articleId: info.articleId,
         }
        
        that.setData({
          info: info,
        })
        // console.log('info:' + info)
      }
    })
  },

  /*更新点赞*/
  update_zan: function (e) {
    var that = this;
    var data = e.currentTarget.dataset;
    //console.log(e.currentTarget.dataset)
    wx.request({
      url: t.globalData.api + 'login/article/articleLike?articleId=' + data.articleid,//请求服务器点赞接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        //console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '点赞成功',
            icon: 'none',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '点赞失败',
            icon: 'none',
            duration: 2000,
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