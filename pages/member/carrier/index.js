// pages/member/carrier/index.js
//获取应用实例
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');

// 页数
var currentPage = 1;
// 页量
var pageSize = 10;
//物流状态
var status = '';
Page({
  // 设置数据
  data: {
    //投标状态
    status: 2,
    // 列表数据数组
    dataList: [],
    // 下拉刷新，上拉加载
    loading: false,
    // loaded: false,
    carousels: [],
    //承运商ID
    carrierId: ''
  },
  /**
   * 生命周期函数--监听页面加载
   * 进入页面的时候开始加载一次数据
   */
  onLoad: function (options) {
    // 转换
    var that = this;
    if (options.hasOwnProperty('carrierId') == true) { //判断某个属性是否存在
      var carrierId = options.carrierId;
    } else {
      var carrierId = options;
    }
    //console.log(options)
    that.setData({
      carrierId: carrierId
    })
    // 显示加载中
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    // 显示时间
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)
      // 加载物流状态列表
      that.loadCate();
  },
  //加载物流状态列表
  loadCate: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    //console.log(that.data.carrierId)
    console.log(token)
    if(token != ''){
      //发送请求
      wx.request({
        url: t.globalData.api + 'logistics/bid/queryBid?token=' + token + '&bidCarrierId=' + that.data.carrierId + '&bidState=2', //接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          //console.log(res);
          var dataList = res.data.data.list;
          that.setData({
            dataList: dataList
          });
        }
      })
    }
  },
  //Tab切换：加载数据的函数
  switchTab: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(that.data.carrierId)
      //发送请求
      wx.request({
        url: t.globalData.api + 'logistics/bid/queryBid?token=' + token + '&bidCarrierId=' + that.data.carrierId + '&bidState=' + e.currentTarget.dataset.status, //接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        // 成功
        success: function (res) {
          var dataList = res.data.data.list;
          if (res.data.data.totalNum == 0) {
            //没有数据返回
            console.log(res);
            // 显示没有更多数据了
            wx.showToast({
              title: '没有更多数据了……',
              icon: 'none'
            }),
              that.setData({
                dataList: dataList,
                status: e.currentTarget.dataset.status
              });
            console.log(dataList)
            // 显示时间
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
            res.data.data.pageSize -= 1;
            return;
          } else {
            that.setData({
              dataList: dataList,
              status: e.currentTarget.dataset.status
            });
            console.log(dataList)
          }

        },
        // 失败
        fail: function (err) {
          console.log(err);
        }
      })
  },
  //去付款：物流信息费
  payment: function (e) {
    var that = this;
    var routeInfo = e.currentTarget.dataset;
    var carrierId = routeInfo.bidcarrierid;
    var openid = wx.getStorageSync('openid');
    var memberId = wx.getStorageSync('memberId');
    console.log(openid)
    //发送请求
    wx.request({
      url: t.globalData.api + 'payment/weichat_p/yf', //支付接口地址
      method: 'POST',
      data: {
        createIp: "127.0.0.1",//创建订单ip
        openID: openid,//微信openID
        orderType: routeInfo.type,// 订单类型 1：货单，2：保证金，3：物流信息费,
        porGoodBody: "信息费",//商品描述 ,
        porGoodTitle: "信息费",//商品标题 ,
        porOrderAmount: routeInfo.routemessageprice,//信息费(分),
        porOutTradeNo: routeInfo.routesn,//订单号 ,
        shopName: "string",//商家 ,
        userid: memberId,//用户ID
      },
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          var data = res.data.dataObj;
          var prepayId = 'prepay_id=' + data.prepayId;
          console.log(prepayId)
          wx.requestPayment({
            timeStamp: data.timeStamp,
            nonceStr: data.nonceStr,
            package: prepayId,
            signType: data.signType,
            paySign: data.paySign,
            success(res) {
              // wx.redirectTo({
              //   url: '/pages/member/carrier/index?carrierId=' + carrierId,
              // })
              that.onLoad(carrierId);
            },
            fail(res) {
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  //报价详情跳转
  deatil: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/member/bid/index?routeId=' + dataset.id + '&status=' + dataset.bidstate + '&bidCarrierId=' + dataset.bidcarrierid,
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作，刷新
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    var that = this;
    wx.showNavigationBarLoading()
    setTimeout(() => {
      currentPage = 1;
      //that.loadCate(currentPage, pageSize);
      //that.switchTab(currentPage, pageSize); 
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    console.log('上拉')
    if (this.data.loading) return;
    this.setData({
      loading: true
    });
    setTimeout(() => {
      currentPage += 1;
      //that.loadCate(currentPage, pageSize);
      //that.switchTab(currentPage, pageSize);
      that.setData({
        loading: false
      })
    }, 2000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})