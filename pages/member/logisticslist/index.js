// pages/member/logisticslist/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    bidList: [],
    bidRouteId: '',//路线ID
    bidCarrierId: '',//承运商ID
    bidCarrierName: '',//承运商名称
    mhHidden: true,
  },
  select: function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: false,
      bidRouteId: e.currentTarget.dataset.bidrouteid,
      bidCarrierId: e.currentTarget.dataset.bidcarrierid,
      bidCarrierName: e.currentTarget.dataset.bidcarriername
    });
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //处理changeModel的触发事件选择报价
  changeModel: function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: true
    });
      var token = wx.getStorageSync('token'),
        bidcarrierid = e.currentTarget.dataset.bidcarrierid,
        bidrouteid = e.currentTarget.dataset.bidrouteid;
      console.log(token)
      wx.request({
        //请求服务器报价选中接口
        url: t.globalData.api + 'logistics/bid/chooseBid?token=' + token + '&bidRouteId=' + bidrouteid + '&bidCarrierId=' + bidcarrierid,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          bidRouteId: bidrouteid,
          bidCarrierId: bidcarrierid
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '选择成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/member/logisticsinfo/index?routeId=' + bidrouteid + '&bidCarrierId=' + bidcarrierid,　　//报价详情选中页面
                  })
                }, 2000) //延迟时间
              }
            })
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
            })
          }
        },
        fail: function (res) {
          console.log("调用API失败");
        }
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    // 转换
    var that = this;
    var token = wx.getStorageSync('token');
    var routeId = options.routeId;
    that.setData({
      routeId: routeId
    }),
      // 加载物流路线详情
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
            routeFromMarket: data.routeFromMarket,
            routeFromCity: data.routeFromCity,
            routeFromArea: data.routeFromArea,
            routeFromAddress: data.routeFromAddress,
            routeGoodsName: data.routeGoodsName,
            routeId: data.routeId,
            routeMaxNumber: data.routeMaxNumber,
            routeMinNumber: data.routeMinNumber,
            routeReceiveTime: data.routeReceiveTime,
            routeToMarket: data.routeToMarket,
            routeToCity: data.routeToCity,
            routeToArea: data.routeToArea,
            routeToAddress: data.routeToAddress,
            routeUnit: data.routeUnit,
            routeSn: data.routeSn,
            routeGuidePrice: data.routeGuidePrice,
          })
        }
      })
    // 加载物流报价列表
    wx.request({
      url: t.globalData.api + 'logistics/bid/queryBid?token=' + token + '&bidRouteId=' + routeId, //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res.data);
        if (res.data.data != undefined) {
          var dataList = res.data.data.list;
          console.log(dataList);
          for (var i in dataList) {
            //日期处理
            dataList[i].bidTime = time.formatTime(dataList[i].bidTime);
          }
          that.setData({
            dataList: dataList

          });
        } else {
          wx.showToast({
            title: '报价选择没有更多数据了……',
            icon: 'none'
          })
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
  loadList: function (e) {
    var that = this;
    
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