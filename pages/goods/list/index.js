// pages/news/index.js
//获取应用实例
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
//分类id
var cateId = '';
Page({
  // 设置数据
  data: {
    cateId: '',
    storeId:'',
    //产品分类品牌列表
    listBrand: [],
    pageNum: 1,    //分页请求
    pages: '',    //总页数
    isloading: true,    //是否显示加载动画
    // 列表数据数组
    dataList: [],
    carousels: [],
    mhHidden: true,//筛选弹框隐藏
    cdHidden: true,//产地
    cHidden: false,
    ccHidden: true,
    saleAsc: false,
    saleDesc: true,
    priceAsc: false,
    priceDesc: true,
    addressList: [],//产地
    areaName: '',//产地名称
    regionId: '',//产地ID
    weight: '',//克重
  },
  //销量升序
  saleAsc: function (e) {
    var that = this;
    var cateId = that.data.cateId;
    console.log(cateId)
    that.setData({
      saleAsc: true,
      saleDesc: false,
    });
    wx.request({
      url: t.globalData.api + 'mall/api/goods/index', //接口地址
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        cateId: cateId,
        order: 'sell_volume',
        sort: 'asc',
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var dataList = res.data.data.list;
        console.log(dataList);
        // if (res.data.data.pageNum == 1) {
        //   dataList = [];
        // }
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

      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //销量降序
  saleDesc: function (e) {
    var that = this;
    var cateId = that.data.cateId;
    console.log(cateId)
    that.setData({
      saleAsc: false,
      saleDesc: true,
    });
    wx.request({
      url: t.globalData.api + 'mall/api/goods/index', //接口地址
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        cateId: cateId,
        order: 'sell_volume',
        sort: 'desc',
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var dataList = res.data.data.list;
        console.log(dataList);
        // if (res.data.data.pageNum == 1) {
        //   dataList = [];
        // }
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

      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //价格升序
  priceAsc: function (e) {
    var that = this;
    var cateId = that.data.cateId;
    console.log(cateId)
    that.setData({
      priceAsc: true,
      priceDesc: false,
    });
    wx.request({
      url: t.globalData.api + 'mall/api/goods/index', //接口地址
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        cateId: cateId,
        order: 'goods_price',
        sort: 'asc',
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var dataList = res.data.data.list;
        console.log(dataList);
        // if (res.data.data.pageNum == 1) {
        //   dataList = [];
        // }
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

      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //价格降序
  priceDesc: function (e) {
    var that = this;
    var cateId = that.data.cateId;
    console.log(cateId)
    that.setData({
      priceAsc: false,
      priceDesc: true,
    });
    wx.request({
      url: t.globalData.api + 'mall/api/goods/index', //接口地址
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        cateId: cateId,
        order: 'goods_price',
        sort: 'desc',
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var dataList = res.data.data.list;
        console.log(dataList);
        // if (res.data.data.pageNum == 1) {
        //   dataList = [];
        // }
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

      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //点击筛选显示弹窗
  search: function(e){
    console.log(12)
    var that =this;
    that.setData({
      mhHidden: false,
    });
  }, 
   //点击筛选关闭弹窗
  unsearch: function(e) {
    console.log(13)
    var that = this;
    that.setData({
      mhHidden: true,
    });
  },
  //点击产地显示
  click: function (e) {
    var that = this;
    that.setData({
      cdHidden: false,
      cHidden:true,
      ccHidden: false,
    });
    wx.request({
      url: t.globalData.api + 'basics/region/getRegion', //接口地址
      //定义传到后台的数据
      data: {},
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var addressList = res.data.data;
          that.setData({
            addressList: addressList
          });
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //点击产地关闭
  unclick: function (e) {
    var that = this;
    that.setData({
      cdHidden: true,
      cHidden: false,
      ccHidden: true,
    });
  },
  //输入克重
  weight: function (e) {
    var that = this;
    var weight = e.detail.value;
    that.setData({
      weight: weight,
    })
  },
//选择产地
  selectArea: function(e){
    var that = this;
    var areaName = e.currentTarget.dataset.areaname;
    var regionId = e.currentTarget.dataset.regionid; 
    that.setData({
      areaName: areaName,
      regionId: regionId,
    })
  },
  //重置
  reset: function(e){
    var that = this;
    that.setData({
      weight:'',
      regionId: '',
    })
  },
  //筛选
  comfire: function (e) {
    var that = this;
    var cateId = that.data.cateId,
      areaName = that.data.areaName;
    // console.log(cateId)
    if (cateId == 1){
      var weight = that.data.weight;
    }else{
      var weight = '';
    }
    wx.request({
      url: t.globalData.api + 'mall/api/goods/index', //接口地址
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        cateId: cateId,
        areaName: areaName,
        weight: weight,
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var dataList = res.data.data.list;
        console.log(dataList);
        // if (res.data.data.pageNum == 1) {
        //   dataList = [];
        // }
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

      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
    that.setData({
      mhHidden: true,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   * 进入页面的时候开始加载一次数据
   */
  onLoad: function (options) {
    var cateId = options.cateId;
    //var storeId = options.storeId;
    //console.log(cateId)
    //console.log(storeId)
    // 转换
    var that = this;
    //加载产品分类品牌
    wx.request({
      url: t.globalData.api + 'mall/api/store/listBrand?cateId=' + cateId, //接口地址
      //定义传到后台的数据
      method: 'get',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var listBrand = res.data.data.list;
        console.log(listBrand);
        // if (res.data.data.pageNum == 1) {
        //   listBrand = [];
        // }
        if (res.data.data.total == 0) {
          //没有数据返回
          //console.log(res);
          // 显示没有更多数据了
          wx.showToast({
            title: '没有更多数据了……',
            icon: 'none'
          }),
            that.setData({
            listBrand: listBrand
            });
            //console.log(listBrand)
          // 显示时间
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
          //res.data.data.pageSize -= 1;
          return;
        } else {
          if (res.data.data.total == 9) {
            that.setData({
              mHidden: true

            });
          }
          that.setData({
            listBrand: listBrand
          });
        }

      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
    // 加载产品列表
      wx.request({
        url: t.globalData.api + 'mall/api/goods/index?pageNum=' + that.data.pageNum, //接口地址
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          cateId: cateId
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
            //console.log(res);
            // 显示没有更多数据了
            wx.showToast({
              title: '没有更多数据了……',
              icon: 'none'
            }),
            that.setData({
              dataList: dataList,
              isloading: true
            });
            // 显示时间
            setTimeout(function () {
              wx.hideToast()
            }, 1000)
            //res.data.data.pageSize -= 1;
            return;
          } else {
            that.setData({
              dataList: dataList,
              isloading: true,
              pages: res.data.data.pages,
            });
          }

        },
        // 失败
        fail: function (err) {
          console.log(err);
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
    }, 1000)
    that.setData({
      cateId: cateId,
      //storeId: storeId,
    })
  },
  //Tab切换：加载对应店铺的数据的函数
  switchTab: function (e) {
    var that = this;
    var cateId = e.currentTarget.dataset.cateid;
    var storeId = e.currentTarget.dataset.storeid;
      //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/goods/index?pageNum=' + that.data.pageNum, //接口地址
      //定义传到后台的数据
      data: {
        //从全局变量data中获取数据
        cateId: cateId,
        storeId: storeId
      },
      method: 'post',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        var dataList = res.data.data.list;
        if (res.data.data.total == 0) {
          //没有数据返回
          //console.log(res);
          // 显示没有更多数据了
          wx.showToast({
            title: '没有更多数据了……',
            icon: 'none'
          }),
            that.setData({
              dataList: dataList,
              isloading: true,
            });
          //console.log(dataList)
          // 显示时间
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
          //res.data.data.pageSize -= 1;
          return;
        } else {
          that.setData({
            dataList: dataList,
            isloading: true,
            pages: res.data.data.pages,
          });
        }

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})