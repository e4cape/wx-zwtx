// pages/search/index.js
var t = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mHidden: true,//搜索弹窗
    typeName: '商品',
    typeValue: 1,//商品
    keyword: '',//搜索关键词
    dataList: [],//搜索列表
    searchRecords: {},//历史记录
  },
  //获取搜索类型弹窗
  searchType: function(e){
    var that = this;
    that.setData({
      mHidden: false,
    })
  },
  //获取搜索类型
  product: function (e) {
    var that = this;
    that.setData({
      mHidden: true,
      typeName: '商品',
      typeValue: 1,
    })
  },
  //获取商品搜索类型
  store: function (e) {
    var that = this;
    that.setData({
      mHidden: true,
      typeName: '店铺',
      typeValue: 2,
    })
  },
  //获取搜索关键词
  keywordInput: function(e){
    var that = this;
    var keyword = e.detail.value;
    that.setData({
      keyword: keyword,
    })
  },
  //键盘搜索按钮
  inputSearch:function(){
    this.search();
  },
  //请求服务器搜索接口
  search: function(e){
    var that = this;
    var type = that.data.typeValue;
    var keyword = that.data.keyword;
    wx.request({
      url: t.globalData.api + 'mall/api/home/search?type=' + type + '&keyword=' + keyword,//搜索接口
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        type: type,
        keyword: keyword,
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        console.log(res);
        var dataList = res.data.data.list;
        //console.log(dataList);
        if (res.data.data.total == 0) {
          //没有数据返回
          console.log(res);
          // 显示没有更多数据了
          wx.showToast({
            title: '没有更多数据了……',
            icon: 'none'
          }),
            console.log(dataList)
          that.setData({
            dataList: dataList
          });
          // 显示时间
          setTimeout(function () {
            wx.hideToast()
          }, 2000)
          //res.data.data.pageSize -= 1;
          return;
        } else {
          that.setData({
            dataList: dataList
          });
        }
        that.onLoad()
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //产品详情跳转
  storeClick: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/shop/detail/index?storeId=' + dataset.storeid + '&goodsId=' + dataset.goodsid,
    })
  },
  //Tab切换：加载对应店铺的数据的函数
  switchTab: function (e) {
    var that = this;
    var cateId = e.currentTarget.dataset.cateid;
    var storeId = e.currentTarget.dataset.storeid;
    wx.navigateTo({
      url: '/pages/goods/list/index?storeId=' + storeId + '&cateId=' + cateId,
    })
  },
  //获取关键词进行赋值
  getKeyword: function(e){
    var that = this;
    var keyword = e.currentTarget.dataset.keyword;
    console.log(keyword)
    that.setData({
      keyword: keyword
    })
  },
  //获取历史记录
  getRecord: function () {
    var text = '';
    var keyword = wx.getStorageSync("searchRecords")
    console.log(keyword)
    var searchRecords = [];
    searchRecords = [
      {
        keyword: keyword
      }
    ]
    this.setData({
      searchRecords: searchRecords
    })
  },
  //设置搜索记录
  setRecord: function (searchRecords, value, time) {
    // var keyword = this.data.keyword;
    // wx.setStorageSync('searchRecords', keyword);
    // this.getRecord()
    var postfix = '_deadtime';
    var value = this.data.keyword;
    wx.setStorageSync('searchRecords', value);
      // var t = time ? time : 24;
      // var seconds = parseInt(t * 3600);
      // if (seconds > 0) {
      //   var timestamp = Date.parse(new Date());
      //   timestamp = timestamp / 1000 + seconds;
      //   wx.setStorageSync(searchRecords + postfix, timestamp + "")
      // } else {
      //   wx.removeStorageSync(searchRecords + postfix)
      // }
    this.getRecord()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRecord();
   this.setRecord();
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