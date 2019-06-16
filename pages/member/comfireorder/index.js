// pages/member/comfireorder/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    routeBeginTime: '',
    mhHidden: true,
    goodsId: '',
    cartGoodsNorms: '',
    cartGoodsSpec: '',
    cartGoodsSpecId: '',
    cartNum: '',
    cartState: '',
    unit: '',
    goodsDefaultImage: '',
    goodsName: '',
    isHot: '',
    orderReceiveTime: '',//提货时间
    integralMoney: '',//积分使用
    orderBuyerMessage: '',//买家留言
    addressList: [],//地址列表
    defaultList: {},//默认地址
    goodsCateId: '',//分类ID
    currentTime:'',//当前时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var currentTime = time.formatTime(new Date());
    //console.log(options.cartGoodsNorms)
    var token = wx.getStorageSync('token');
    //console.log(token)
      //发送请求
      wx.request({
        url: t.globalData.api + 'login/api/address/list?token=' + token, //地址列表接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          console.log(res);
          if (res.data != null) {
            var addressList = res.data.data;
            //console.log(addressList)
            //var addressList = res.data.data[0].addressList;
            if (addressList == '') {
              wx.showToast({
                title: '请先新增收货地址',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.redirectTo({
                      url: '/pages/member/address/index'　　//跳转到添加地址页面
                    })
                  }, 3000) //延迟时间
                }
              })
            }
            var defaultList = {};
            // for (var i in addressList) {
            //   var regionName = addressList[i].regionName;
            //   console.log(addressList[i])
            //   addressList[i].regionName = regionName.replace(/,/g, '');
            // }
            for (var i in addressList) {
              if (addressList[i].isDefault == 1) {
                defaultList.addressid = addressList[i].addressId;
                defaultList.addressee = addressList[i].addressee;
                defaultList.phone = addressList[i].phone;
                defaultList.address = addressList[i].regionName.replace(/,/g, '') + addressList[i].address;
                defaultList.isDefault = addressList[i].isDefault;
              }
            }
            that.setData({
              addressList: addressList,
              defaultList: defaultList
            });
          }
        }
      }),
        that.setData({
          cartGoodsNorms: options.cartGoodsNorms,
          cartGoodsSpec: options.cartGoodsSpec,
          cartGoodsSpecId: options.cartGoodsSpecId,
          cartNum: options.cartNum,
          cartState: options.cartState,
          goodsDefaultImage: options.goodsDefaultImage,
          goodsId: options.goodsId,
          goodsName: options.goodsName,
          isHot: options.isHot,
          mprice: options.mprice,
          price: options.price,
          unit: options.unit,
          cartStoreId: options.cartStoreId,
          cartStoreName: options.cartStoreName,
          rank: options.rank,
          goodsCateId: options.goodsCateId,
          currentTime: currentTime,
        });
     
  },
  addressList: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: false,
    });
    var token = wx.getStorageSync('token');
    var memberId = wx.getStorageSync('memberId');
    var that = this;
    wx.request({
      url: t.globalData.api + 'login/api/address/list?token=' + token, //地址列表接口地址
      //定义传到后台的数据
      data: {},
      method: 'GET',//定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        // console.log(res);
        var addressList = res.data.data;
        for (var i in addressList) {
          addressList[i].address = addressList[i].regionName.replace(/,/g, '') + addressList[i].address;

        }
        that.setData({
          addressList: addressList
        });
        console.log(addressList)
      },
      fail: function (res) {
        console.log("调用API失败");
      }
    })
  },
  //选择收货地址
  select: function (e) {
    console.log(e.currentTarget.dataset)
    var that = this;
    that.setData({
      defaultList: e.currentTarget.dataset,
      mhHidden: true,//隐藏弹框
    });
  },
  //关闭弹窗
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //确定按钮
  changeModel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //提货时间
  orderReceiveTime: function (e) {
    console.log(e.detail.value)
    this.setData({
      orderReceiveTime: e.detail.value
    })
  },
  //积分是否抵扣
  checkboxChange(e) {
    console.log(e.detail.value[0])
    this.setData({
      integralMoney: e.detail.value[0]
    })
  },
  //买家留言
  orderBuyerMessage: function (e) {
    console.log(e.detail.value)
    this.setData({
      orderBuyerMessage: e.detail.value
    })
  },
  //提交订单
  checkbuy: function (e) {
    var token = wx.getStorageSync('token');
    var memberId = wx.getStorageSync('memberId');
    var orderInfo = e.currentTarget.dataset;
    var addressId = orderInfo.id;
    var storeId = orderInfo.storeid;
    var storeName = orderInfo.storename;
    var isHot = orderInfo.ishot;
    var orderReceiveTime = new Date(this.data.orderReceiveTime).getTime();
    //console.log(orderReceiveTime)
    //判断是否使用积分
    if (this.data.integralMoney != '') {
      var integralMoney = this.data.integralMoney;
    } else {
      var integralMoney = '';
    }
    //买家留言
    var orderBuyerMessage = this.data.orderBuyerMessage;
    //console.log(orderBuyerMessage)
    var cartList = [],
    // console.log(list)
      cartList = [
        {
          cartBuyerId: memberId,
          cartGoodsId: this.data.goodsId,
          cartGoodsNorms: this.data.cartGoodsNorms,
          cartGoodsSpec: this.data.cartGoodsSpec,
          cartGoodsSpecId: this.data.cartGoodsSpecId,
          //cartId: '',
          cartNum: this.data.cartNum,
          cartState: this.data.cartState,
          cartStoreId: storeId,
          goodsCateId: this.data.goodsCateId,
          goodsImage: this.data.goodsDefaultImage,
          goodsName: this.data.goodsName,
          isHot: this.data.isHot,
          unit: this.data.unit,
        }
      ]
    console.log(cartList)
    wx.request({
      //请求服务器提交订单接口
      url: t.globalData.api + 'mall/api/orderInfo/submitOrder?token=' + token,
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        addressId: addressId,//地址id
        cartList: cartList, //商品列表
        integralMoney: integralMoney,//积分使用
        orderBuyerMessage: orderBuyerMessage,//买家留言
        orderReceiveTime: orderReceiveTime,//提货时间
        storeId: storeId,//店铺id
        storeName: storeName,//店铺名称
      },
      method: 'post',//定义传到后台接受的是post方法还是get方法
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          if (isHot == 1){
            //去支付保证金
            var openid = wx.getStorageSync('openid');
            var money = res.data.data.orderTotal * 0.1 * 100;//订单总额中获取保证金（分）
            var porOutTradeNo = res.data.data.orderSn;//订单编号
            var memberId = wx.getStorageSync('memberId');
            console.log(openid)
            //发送请求
            wx.request({
              url: t.globalData.api + 'payment/weichat_p/yf', //支付接口地址
              method: 'POST',
              data: {
                createIp: "127.0.0.1",//创建订单ip
                openID: openid,//微信openID
                orderType: 2,// 订单类型 1：货单，2：保证金，3：物流费,
                porGoodBody: "保证金",//商品描述 ,
                porGoodTitle: "保证金",//商品标题 ,
                porOrderAmount: money,//订单金额(分),
                porOutTradeNo: porOutTradeNo,//订单号 ,
                shopName: storeName,//商家 ,
                userid: memberId,//用户ID
              },
              header: {
                'content-type': 'application/json' //默认值
              },
              //成功
              success: function (result) {
                console.log(result);
                if (result.data.code == 0) {
                  var data = result.data.dataObj;
                  var prepayId = 'prepay_id=' + data.prepayId;
                  console.log(prepayId)
                  wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: prepayId,
                    signType: data.signType,
                    paySign: data.paySign,
                    success(result) {
                      wx.redirectTo({
                        url: '/pages/member/orderinfo/success',
                      })
                    },
                    fail(result) {
                      console.log(result)
                      wx.redirectTo({
                        url: '/pages/member/orderlist/index?token=' + token + '&status=0'　　//成功跳转到订单管理页面
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: result.data.msg,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              }
            })
          }else{
            wx.showToast({
              title: '提交订单成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.redirectTo({
                    url: '/pages/member/orderlist/index?token=' + token + '&status=0'　　//成功跳转到订单管理页面
                  })
                }, 2000) //延迟时间
              }
            })
          }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
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