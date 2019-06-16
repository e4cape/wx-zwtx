// pages/logistics/index/index.js
var t = getApp(),
  e = t.requirejs("core"),
  u = t.requirejs("util");
// 当前页
var currentPage = 1;
// 页量
var pageSize = 10;
//var memberType = wx.getStorageSync('memberType');
var openid, token, code;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    banner:'',
    wxHidden: true,//微信授权弹窗
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mhHidden: true,
    dataList: [],//物流列表
    // 下拉刷新，上拉加载
    loading: false,
    // loaded: false,
    routeid: "",//路线ID
    carrierId: "",//承运商ID
    token: "",
    memberType: '',
    carrierState: '',
    bidPrice:'', //报价/吨
    bidNumber:'', //报价承载量
    memberAvatar: '/static/images/icon/upload.png',
    memberNickname: '',
    code: '',//token验证返回状态码

  },
  //点击报价按钮跳出弹框
  offer: function (e) {
    //console.log(e.currentTarget.dataset);
    var memberType = e.currentTarget.dataset.membertype;
    if (memberType == 3 || memberType == 4){
      this.setData({
        mhHidden: false,
        routeid: e.currentTarget.dataset.routeid,
        routercarrierid: e.currentTarget.dataset.routercarrierid,
        bidPrice: '', //弹框清空报价
        bidNumber: '',//弹框清空报价
      });
    }else{
      wx.showToast({
        title: '非承运商不能报价',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    // 转换
    var that = this;
    //加载封面图
    that.loadBanner();
    var token = wx.getStorageSync('token');
    wx.request({
      url: t.globalData.api + 'login/carrier/carrierInfo?token=' + token,//请求服务器承运商详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        //console.log(res)
        var data = res.data.data;
        if (data != null) {
          that.setData({
            carrierState: data.carrierState,
            carrierId: data.carrierId
          })
        }
      }
    }),
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,//请求服务器路线详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        var data = res.data.data;
        // console.log(res.data.data.memberType)
        if (data != undefined &&data.memberType != undefined){
          var memberType = data.memberType;
        }else{
          var memberType = '';
        }
          that.setData({
            memberType: memberType
          })
      }
    })
    // 加载物流列表信息
    that.logisticsList();
  },
  //加载封面图
  loadBanner: function () {
    var that = this;
    wx.request({
      url: t.globalData.api + 'basics/banner/queryBanner?bannerLocation=4&bannerSource=2', //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      success: function (res) {
        if (res.data != undefined && res.data.code == 200) {
          if (res.data.data.length > 0) {
            that.setData({ banner: res.data.data[0].bannerImage });
          }
        }
      }
    });
  },
  //加载物流列表信息
  logisticsList: function (e) {
    var that = this;
    //var token = wx.getStorageSync('token');
   // console.log(token)
    //发送请求
    wx.request({
      url: t.globalData.api + 'logistics/route/pageListNoToken?type=0', //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        wx.hideLoading(); //隐藏加载框
        console.log(res)
        //没有数据返回
        if (res.data.data.totalNum == 0) {
          // 显示没有更多数据了
          wx.showToast({
            title: '没有更多数据了……',
            icon: 'none'
          }),
          // 显示时间
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
          res.data.data.pageSize -= 1;
          return;
        }else{
          that.setData({
            dataList: res.data.data.items
          });
        }
        
      }
    })
  },
  //货源详情跳转
  deatil: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/logistics/detail/index?routeId=' + dataset.id,
    })
  },
  //发布货源
  release: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var token = wx.getStorageSync('token');
    var memberType = that.data.memberType;
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          if (memberType != 3 && memberType != 4) {
            wx.navigateTo({
              url: '/pages/logistics/release/index',
            })
          } else {
            wx.showToast({
              title: '承运商不能发布货源',
              icon: 'none',
              duration: 1000
            })
            return false;
          }
          that.setData({
            wxHidden: true,
          });
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //承运商物流按钮
  carrier: function (e) {
    //dataset内包含data-*的数据
    var that = this;
    var token = wx.getStorageSync('token');
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          var dataset = e.currentTarget.dataset;
          //console.log(dataset)
          wx.navigateTo({
            url: '/pages/member/carrier/index?carrierId=' + dataset.id,
          })
          that.setData({
            wxHidden: true,
          });
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //普通物流按钮
  logistics: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          wx.navigateTo({
            url: '/pages/member/logistics/index',
          })
          that.setData({
            wxHidden: true,
          });
        } else {
          that.setData({
            wxHidden: false,
          });
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
              code: res.data.code,
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
  //处理bidPriceInput的触发事件
  bidPriceInput: function (e) {
    var bidPrice = e.detail.value;//从页面获取到一吨的报价
    if (bidPrice != '') {
      this.setData({ bidPrice: bidPrice });//把获取到的密码赋值给data中的bidPrice
    }
  },
  //处理bidNumberInput的触发事件
  bidNumberInput: function (e) {
    var bidNumber = e.detail.value;//从页面获取到车辆承载量
    if (bidNumber != '') {
      this.setData({ bidNumber: bidNumber });//把获取到的密码赋值给data中的bidNumber
    }
  },
  //处理changeModel的触发事件
  changeModel: function (e) {
    console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: true
    });
    if (this.data.bidPrice == "") {
      wx.showToast({
        title: '报价不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (this.data.bidNumber == "") {
      wx.showToast({
        title: '车载承载量不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var token = wx.getStorageSync('token');
      console.log(token)
      wx.request({
        //请求服务器报价接口
        url: t.globalData.api + 'logistics/bid/addBid?token=' + token,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          bidRouteId: e.currentTarget.dataset.routeid,
          bidCarrierId: e.currentTarget.dataset.routercarrierid,
          bidPrice: this.data.bidPrice,
          bidNumber: this.data.bidNumber,
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '报价成功',
              icon: 'none',
              duration: 2000,
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
   * 页面相关事件处理函数--监听用户下拉动作，刷新
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    var that = this;
    wx.showNavigationBarLoading()
    setTimeout(() => {
      currentPage = 1;
      //that.logisticsList(currentPage, pageSize);
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
      //that.logisticsList(currentPage, pageSize);
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