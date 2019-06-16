// pages/member/orderlist/index.js
//获取应用实例
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
var openid, token;
// 页数
var pageNum = 1;
// 页量
var pageSize = 10;
//订单状态
var status = '';
Page({
  // 设置数据
  data: {
    wxHidden: true,//微信授权弹窗
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    memberAvatar: '/static/images/icon/upload.png',
    memberNickname: '',
    //订单状态
    status: 0,
    // 列表数据数组
    dataList: [],
    // 下拉刷新，上拉加载
    loading: false,
    // loaded: false,
    carousels: [],
    mhHidden: true,
    orderMenu: [
      { name: '全部订单', status: 0 },
      { name: '待确认', status: 1 },
      { name: '待发货', status: 20 },
      { name: '待收货', status: 30 },
      { name: '已完成', status: 40 }
    ],
  },
  pay: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: false,
    });
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //处理changeModel的触发事件
  changeModel: function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: true
    });
  },
  /**
   * 生命周期函数--监听页面加载
   * 进入页面的时候开始加载一次数据
   */
  onLoad: function (options) {
    var that = this;
    //初始加载订单
    var token = wx.getStorageSync('token');
    if (options.hasOwnProperty('status') == true) { //判断某个属性是否存在
      var status = options.status;
    } else {
      var status = options;
    }
    // console.log(1)
    // console.log(status)
    // 
    if (token != '') {
      if (status == 0) {
        var url = t.globalData.api + 'mall/api/orderInfo/queryMyOrder?token=' + token; //接口地址
      } else {
        console.log(1221222)
        var url = t.globalData.api + 'mall/api/orderInfo/queryMyOrder?token=' + token + '&orderState=' + status;
      }
      //发送请求
      wx.request({
        url: url, //接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          //console.log(res);
          if (res.data.data.total == 0) {
            //没有数据返回
            //console.log(res);
            // 显示没有更多数据了
            that.setData({
              dataList: res.data.data.list,
              status: status
            });
            //console.log(res.data.data.dataList)
            wx.showToast({
              title: '没有更多数据了……',
              icon: 'none'
            }),
              //console.log(dataList)
              // 显示时间
              setTimeout(function () {
                wx.hideToast()
              }, 1000)
            res.data.data.pageSize -= 1;
            return;
          }
          if (res.data.data != null) {
            var dataList = res.data.data.list;
            for (var i in dataList) {
              //日期处理
              dataList[i].orderCreate = time.formatTime(dataList[i].orderCreate);
            }
            that.setData({
              dataList: dataList,
              status: status
            });
          }
        }
      })
    }
    // 显示时间
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)
  },
  //Tab切换：加载数据的函数
  switchTab: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          var status = e.currentTarget.dataset.status;
          if (status == 0) {
            var url = t.globalData.api + 'mall/api/orderInfo/queryMyOrder?token=' + token;
          } else {
            var url = t.globalData.api + 'mall/api/orderInfo/queryMyOrder?token=' + token + '&orderState=' + status;
          }
          //发送请求
          wx.request({
            url: url, //接口地址
            method: 'GET',
            header: {
              'content-type': 'application/json' //默认值
            },
            // 成功
            success: function (res) {
              console.log(res);
              if (res.data.data != null) {
                var dataList = res.data.data.list;
                if (res.data.data.total == 0) {
                  //没有数据返回
                  console.log(res);
                  // 显示没有更多数据了
                  wx.showToast({
                    title: '没有更多数据了……',
                    icon: 'none'
                  }),
                    that.setData({
                      dataList: dataList,
                      status: status
                    });
                  //console.log(dataList)
                  // 显示时间
                  setTimeout(function () {
                    wx.hideToast()
                  }, 1000)
                  res.data.data.pageSize -= 1;
                  return;
                } else {
                  for (var i in dataList) {
                    //日期处理
                    dataList[i].orderCreate = time.formatTime(dataList[i].orderCreate);
                  }
                  that.setData({
                    dataList: dataList,
                    status: status
                  });
                  console.log(dataList)
                }
              } else {
                wx.showToast({
                  title: '没有更多数据了……',
                  icon: 'none'
                })
                that.setData({
                  status: status
                });
              }
            },
            // 失败
            fail: function (err) {
              console.log(err);
            }
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //订单列表详情跳转
  detail: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/member/orderinfo/index?orderSn=' + dataset.ordersn,
    })
  },
  //取消订单
  cancel: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var orderSn = e.currentTarget.dataset.ordersn;
    var status = e.currentTarget.dataset.status;
    console.log(orderSn)
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用取消方法了
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
                that.onLoad(status)
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //删除订单
  del: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var orderSn = e.currentTarget.dataset.ordersn;
    var status = e.currentTarget.dataset.status;
    console.log(orderSn)
    wx.showModal({
      title: '提示',
      content: '确定要删除订单吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
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
                })
                that.onLoad(status)
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //去付款：保证金
  payment: function(e){
    var that = this;
    var orderInfo = e.currentTarget.dataset;
    var money = orderInfo.ordertotal * 0.1 * 100;
    var openid = wx.getStorageSync('openid');
    console.log(openid)
    //发送请求
    wx.request({
      url: t.globalData.api + 'payment/weichat_p/yf', //支付接口地址
      method: 'POST',
      data: {
        createIp: "127.0.0.1",//创建订单ip
        openID: openid,//微信openID
        orderType: orderInfo.type,// 订单类型 1：货单，2：保证金，3：物流费,
        porGoodBody: "保证金",//商品描述 ,
        porGoodTitle: "保证金",//商品标题 ,
        porOrderAmount: money,//订单金额(分),
        porOutTradeNo: orderInfo.ordersn,//订单号 ,
        shopName: orderInfo.storename,//商家 ,
        userid: orderInfo.orderbuyerid,//用户ID
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
              wx.redirectTo({
                url: '/pages/member/orderinfo/success',
              })
            },
            fail(res) { 
              console.log(res)
            }
          })
            // dataObj :
            // appId: "wx2876603f597a997c"
            // nonceStr:"KwUU6yL1d97KIJ7z" //随机字符串，长度为32个字符以下
            // payOrderID: "s155970706498759704"
            // paySign:"EBD5DD57DD5EB778A19A2CC624D638BD" //签名
            // prepayId:"wx051157500867561e3759b5c91553194800" //统一下单接口返回的 prepay_id 参数值
            // signType:"MD5" //签名算法
            // timeStamp:1559707070126 //时间戳
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
  //确认收货
  comfire: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var orderSn = e.currentTarget.dataset.ordersn;
    var status = e.currentTarget.dataset.status;
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
          that.onLoad(status)
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
  //允许授权登录
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo);
    //return false;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      t.getUserInfo(); //重新获取用户信息
      openid = wx.getStorageSync('openid'); //重新赋值openid

      //请求服务器登录接口
      wx.request({
        url: t.globalData.api + 'login/member/user/login',
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberOpenid: openid
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            token = res.data.data.token; //赋值token
            var memberInfo = res.data.data.memberInfo;
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            }),
              wx.setStorage({
                key: 'memberPhone',
                data: memberInfo.memberPhone
              }),
              wx.setStorage({
                key: 'memberId',
                data: memberInfo.memberId
              }),
              wx.setStorage({
                key: 'memberAccount',
                data: memberInfo.memberAccount
              }),
              wx.setStorage({
                key: 'memberAvatar',
                data: e.detail.userInfo.avatarUrl
              }),
              wx.setStorage({
                key: 'memberNickname',
                data: e.detail.userInfo.nickName
              })
            //用户已经授权过
            if (memberInfo.memberAvatar != null) {
              that.setData({
                memberAvatar: memberInfo.memberAvatar,
              })
            } else {
              console.log(11111)
              that.setData({
                memberAvatar: e.detail.userInfo.avatarUrl,
              })
            }
            if (memberInfo.memberNickname != null) {
              that.setData({
                memberNickname: memberInfo.memberNickname,
              })
            } else {
              console.log(2222)
              that.setData({
                memberNickname: e.detail.userInfo.nickName,
              })
            }
            that.setData({
              wxHidden: true,
            });
            that.onShow();
          }
          else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/register/register'　　// 跳转到注册页面
                  })
                }, 2000) //延迟时间
              }
            })
          }
        },
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作，刷新
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    var that = this;
    wx.showNavigationBarLoading()
    setTimeout(() => {
      pageNum = 1;
      //that.onLoad(pageNum, pageSize);
      //that.switchTab(pageNum, pageSize); 
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
    if (that.data.loading) return;
    that.setData({
      loading: true
    });
    setTimeout(() => {
      pageNum += 1;
      //that.onLoad(pageNum, pageSize);
      //that.switchTab(pageNum, pageSize);
      that.setData({
        loading: false
      })
    }, 2000)
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
    // var that = this;
    // var status = 0;
    // that.setData({
    //   status: status
    // })
    // this.onLoad()
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