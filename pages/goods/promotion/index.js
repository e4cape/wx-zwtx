// pages/goods/promotion/index.js
var t = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],//促销专区列表产品
    pageNum: 1,    //分页请求
    pages: '',    //总页数
    isloading: true,    //是否显示加载动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var promotionArea = options.promotionArea;
      //发送请求
      wx.request({
        url: t.globalData.api + 'mall/api/promotion/list?promotionArea=' + promotionArea + '&pageNum=' + that.data.pageNum, //促销专区列表接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          console.log(res);
          if (res.data.data.total == 0) {
            // 显示没有更多数据了
            wx.showToast({
              title: '没有更多数据了……',
              icon: 'none'
            }),
              that.setData({
                dataList: dataList,
                isloading: true,
              });
            // 显示时间
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
          } else {
          if (res.data != null) {
            var dataList = res.data.data.list;
            //处理剩余库存百分比
            dataList.forEach(function(item,index){
              dataList[index].percentage = item.remainingStock / item.activityStock * 100; //百分比 = 剩余库存/活动库存
            })
            that.setData({
              dataList: dataList, 
              isloading: true,
              pages: res.data.data.pages,
            });
          }
          }
        }
      })
  },
  //产品详情页面
  detail: function (e) {
    //dataset内包含data-*的数据
    var goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/goods/detail/index?goodsId=' + goodsId,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作，刷新
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();    //在当前页面显示导航条加载动画
    //this.onLoad();    //刷新页面
    setTimeout(function () {
      wx.hideNavigationBarLoading();    //在当前页面隐藏导航条加载动画
      wx.stopPullDownRefresh();    //停止下拉动作
    }, 2000)
  },
  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    var pageNum = this.data.pageNum;
    var pages = this.data.pages + 1;
    pageNum++;
    if (pageNum > pages) {
      return;
    }
    this.setData({
      isloading: false,
      pageNum: pageNum
    })
    // this.onLoad();
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})