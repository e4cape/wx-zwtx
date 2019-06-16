// pages/member/logistics/index.js
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
    //物流状态
    status: 1,
    // 列表数据数组
    dataList: [],
    // 下拉刷新，上拉加载
    loading: false,
    // loaded: false,
    carousels: []
  },
  /**
   * 生命周期函数--监听页面加载
   * 进入页面的时候开始加载一次数据
   */
  onLoad: function (options) {
    // 转换
    var that = this;
    // 加载物流状态列表
    that.loadCate();
    // 显示加载中
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    // 显示时间
    // setTimeout(function () {
    //   wx.hideLoading()
    // }, 1000)
  },
  //加载物流状态列表
  loadCate: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var routeCreateUser = wx.getStorageSync('memberAccount');
    console.log(token)
    if (token != ''){
    //发送请求
    wx.request({
      url: t.globalData.api + 'logistics/route/pageList?token=' + token + '&routeCreateUser=' + routeCreateUser + '&status=1', //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if(res.data.data != null){
          var dataList = res.data.data.items;
          for (var i in dataList) {
            //日期处理
            dataList[i].routeBeginTime = time.formatTime(dataList[i].routeBeginTime);
          }
          that.setData({
            dataList: dataList
          });
        }
      }
    })
    }
  },
  //Tab切换：加载数据的函数
  switchTab: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var routeCreateUser = wx.getStorageSync('memberAccount');
    console.log(token)
      //发送请求
      wx.request({
        url: t.globalData.api + 'logistics/route/pageList?token=' + token + '&routeCreateUser=' + routeCreateUser + '&status=' + e.currentTarget.dataset.status, //接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        // 成功
        success: function (res) {
          console.log(res);
          if (res.data.data != null) {
          var dataList = res.data.data.items;
          // console.log(dataList);
          // if (res.data.data.pageNum == 1) {
          //   dataList = [];
          // }
          if (res.data.data.totalNum == 0) {
            //没有数据返回
            // console.log(res);
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
            for (var i in dataList) {
              //日期处理
              dataList[i].routeBeginTime = time.formatTime(dataList[i].routeBeginTime);
            }
            that.setData({
              dataList: dataList,
              status: e.currentTarget.dataset.status
            });
            console.log(dataList)
          }
          }else{
            wx.showToast({
              title: '没有更多数据了……',
              icon: 'none'
            })
            that.setData({
              status: e.currentTarget.dataset.status
            });
          }
        },
        // 失败
        fail: function (err) {
          console.log(err);
        }
      })
  },
  //报价列表详情跳转
  offerClick: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/member/logisticslist/index?routeId=' + dataset.id,
    })
  },
  //报价详情跳转
  deatil: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/member/route/index?routeId=' + dataset.id + '&status=' + dataset.routestate + '&bidCarrierId=' + dataset.bidcarrierid,
    })
  },
  //删除物流路线
  deleteRoute: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var routeId = e.currentTarget.dataset.id;
    console.log(routeId)
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //发送请求
          wx.request({
            url: t.globalData.api + 'logistics/route/deleteRoute?routeId=' + routeId + '&token=' + token, //接口地址
            method: 'POST',
            data: {
              token: token,
              routeId: routeId
            },
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
                that.onLoad();
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
  //重发物流路线
  repeat: function(e) {
      //dataset内包含data-*的数据
      var dataset = e.currentTarget.dataset;
      console.log(dataset)
      wx.navigateTo({
        url: '/pages/logistics/release/index?routeId=' + dataset.id,
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