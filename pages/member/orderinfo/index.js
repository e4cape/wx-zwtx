// pages/member/orderinfo/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mhHidden: true,
    ppHidden: true,
    dataList: [], //产品列表
    orderSellerMessage: '',
    isHot: '',
  },
  goodsList: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: false,
      routeid: e.currentTarget.dataset.routeid,
      routercarrierid: e.currentTarget.dataset.routercarrierid
    });
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  changeModel: function () {
    this.setData({
      mhHidden: true
    });
  },
  pay: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      ppHidden: false,
    });
  },
  //关闭
  payCancel: function () {
    this.setData({
      ppHidden: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this;
    if (options.hasOwnProperty('orderSn') == true) { //判断某个属性是否存在
      var orderSn = options.orderSn;
    } else {
      var orderSn = options;
    }
    wx.request({
      //请求服务器产品详情接口
      url: t.globalData.api + 'mall/api/orderInfo/detail?token=' + token + '&orderSn=' + orderSn,
      //定义传到后台的数据
      data: {},
      method: 'get',//定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        if (data.orderReceiveTime != undefined){
          var orderReceiveTime = time.formatTime(data.orderReceiveTime);
        }else{
          var orderReceiveTime = '';
        }
        that.setData({
          orderAddressee: data.orderAddressee,
          orderContact: data.orderContact,
          orderAddress: data.orderAddress,
          storeName: data.storeName,
          orderState: data.orderState,
          dataList: data.orderGoodsVoList,
          isHot: data.orderGoodsVoList[0].isHot,
          oeOrderSn: data.oeOrderSn,
          orderCreate: time.formatTime(data.orderCreate),
          orderBuyerAccount: data.orderBuyerAccount,
          orderReceiveTime: orderReceiveTime,
          integralMoney: data.integralMoney,
          orderBuyerMessage: data.orderBuyerMessage,
          orderSellerMessage: data.orderSellerMessage,
          totalNum: data.totalNum,
          orderTotal: data.orderTotal,
          listImage: data.listImage
        });
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
  },
  //取消订单
  cancel: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var orderSn = e.currentTarget.dataset.ordersn;
    console.log(orderSn)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/orderInfo/cancel?orderSn=' + orderSn + '&token=' + token, //接口地址
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '取消成功',
            icon: 'none',
            duration: 2000,
          })
          that.onLoad(orderSn)
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  //删除订单
  del: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var orderSn = e.currentTarget.dataset.ordersn;
    console.log(orderSn)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/orderInfo/delete?orderSn=' + orderSn + '&token=' + token, //接口地址
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.navigateTo({
                  url: '/pages/member/orderlist/index?token=' + token + '&status=0',//跳转到订单列表页面
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
      }
    })
  },
  //确认收货
  comfire: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var orderSn = e.currentTarget.dataset.ordersn;
    console.log(orderSn)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/orderInfo/confirmReceipt?orderSn=' + orderSn + '&token=' + token, //接口地址
      method: 'get',
      data: {},
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '收货成功',
            icon: 'none',
            duration: 2000,
          })
          that.onLoad(orderSn)
        } else {
          wx.showToast({
            title: res.data.message,
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