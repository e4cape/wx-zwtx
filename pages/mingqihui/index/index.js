//获取应用实例
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
var s = t.requirejs("wxParse/wxParse");
// 页数
var pageNum = 1;
// 页量
var pageSize = 10;
//分类id
var cateId = '';
Page({
  // 设置数据
  data: {
    banner:'',
    //分类数据列
    dataCate: [],
    // 列表数据数组
    dataList: [],
    // 下拉刷新，上拉加载
    loading: false,
    // loaded: false,
    carousels: [],
    acId: '',
  },
  /**
   * 生命周期函数--监听页面加载
   * 进入页面的时候开始加载一次数据
   */
  onLoad: function (options) {
    // 转换
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //加载封面图
    that.loadBanner();
    // 加载文章分类
    that.loadCate();
    // 显示加载中
  },
  //加载封面图
  loadBanner: function () {
    var that = this;
    wx.request({
      url: t.globalData.api + 'basics/banner/queryBanner?bannerLocation=2&bannerSource=2', //接口地址
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
//加载店铺分类
  loadCate: function (e) {
    var that = this;
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/catelog/query', //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        // console.log(res);
        // console.log(res.data.data.list);
        var list = res.data.data;
        // console.log(list);

        list.forEach((v,index)=>{
          if(index==0){
            wx.request({
              url: t.globalData.api + 'mall/api/store/listBrand?currentPage=1&pageSize=10&cateId=' + v.cateId, //接口地址
              method: 'GET',
              header: {
                'content-type': 'application/json' //默认值
              }, 
              success: function (result) {
              //  console.log(result);
                wx.hideLoading(); //隐藏弹框
                var dataList = result.data.data.list;
                // console.log(dataList);
                // dataList.forEach((v,index)=>{
                // });
                that.setData({
                  dataList: dataList,
                  storeId: v.storeId,
                })
              }
            })
          }
        })
        that.setData({
          dataCate: res.data.data
        });
      }
    })
  },
  //Tab切换：加载数据的函数
  switchTab:function(e){
    var cateId = e.currentTarget.dataset.id;
    // console.log(cateId);
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //刷新新闻类目
    wx.request({
      url: t.globalData.api + 'mall/api/catelog/query', //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (result) {
        var dataCate = result.data.data;
        // console.log(dataCate);
        that.setData({
          dataCate: dataCate,
          cateId: cateId,
        })
      },
    }),
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/store/listBrand?currentPage=1&pageSize=10&cateId=' + e.currentTarget.dataset.id, //接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        wx.hideLoading(); //隐藏弹框
        var dataList = res.data.data.list;
        // console.log(dataList);
        if (res.data.data.total == 0) {
          //没有数据返回
          // console.log(res);
          // 显示没有更多数据了
          wx.showToast({
            title: '没有更多数据了……',
            icon: 'none'
          }),
            that.setData({
              dataList: dataList
            });
          // console.log(dataList)
          // 显示时间
          setTimeout(function () {
            wx.hideToast()
          }, 1000)
          res.data.data.pageSize -= 1;
          return;
        }else{
          that.setData({
            dataList: dataList
          });
          // console.log(dataList)
        }
        
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //新闻详情跳转
  newsClick: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    //console.log(dataset)
    wx.navigateTo({
      url: '/pages/mingqihui/detail/index?storeId=' + dataset.id,
    })
  }
})
