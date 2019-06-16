//index.js
//获取应用实例
var app = getApp();
var icon = app.requirejs('icons');
var core = app.requirejs('core');
Page({
  data: {
    //motto: 'Hello World',
    appPictureUrl: '/static/images/n.png',
    //分类数据列
    dataCate: [],
    //促销专区
    promotionBanner: [],
    //最新资讯
    articleList:[],
    // 列表数据数组
    dataList: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    show:0,
    list:[],
    page:1,
    nothing:true,
    loading:false,
    //广告列表
    bannerList: [],
    indicatorDots: true,  //小点
    autoplay: true,  //是否自动轮播
    interval: 6000,  //间隔时间
    duration: 2000,  //滑动时间
    height:320,
  },
  //轮播图处理
  setContainerHeight:function(e){
    //图片原始宽度
    var imgWidth = e.detail.width;
    //图片原始高度
    var imgHeight = e.detail.height;
    //同步获取设备宽度
    var sysInfo = wx.getSystemInfoSync();
    console.log("sysInfo:",sysInfo);
    //获取屏幕宽度
    var screenWidth = sysInfo.screenWidth;
    //获取屏幕和原图比例
    var scale = screenWidth / imgWidth;
    //设置容器高度
    this.setData({
      height: imgHeight * scale
    })
    console.log(this.data.height);

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //联系客服
  service: function (e) {
    //dataset内包含data-*的数据
      wx.navigateTo({
        url: '/pages/member/service/index',
      })
  },
  onLoad: function () {
    // 转换
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    // 加载首页数据
    wx.request({
      url: app.globalData.api + 'mall/api/home/index?type=2', //接口地址,type=2小程序
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res)
        wx.hideLoading();//隐藏加载框
        //赋予首页数据
        that.setIndexData(res.data.data);
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  //赋予首页数据
  setIndexData(data){
    this.setData({
      bannerList: data.homeBanners,
      dataCate: data.CatelogList,
      cateName: data.CatelogList[0].cateName,
      cateId: data.CatelogList[0].cateId,
      goodsList: data.CatelogList[0].goodsList,//成品纸列表
      promotionBanner: data.promotionBanner,
      articleList:data.articleList
    });
  },
  //产品分类触发跳转
  cateClick: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    //console.log(dataset)
    wx.navigateTo({
      url: '../goods/list/index?cateId=' + dataset.id,
    })
  },
  //促销专区
  promotion: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
      wx.navigateTo({
        url: '/pages/goods/promotion/index?promotionArea=' + dataset.id,
      })
  },
  //新闻详情跳转
  newsClick: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    //console.log(dataset)
    wx.navigateTo({
      url: '/pages/news/detail/index?id=' + dataset.id,
    })
  },
  //店铺详情跳转
  storeClick: function (e) {
    //dataset内包含data-*的数据
    var dataset = e.currentTarget.dataset;
    console.log(dataset)
    wx.navigateTo({
      url: '/pages/shop/detail/index?storeId=' + dataset.storeid + '&goodsId=' + dataset.goodsid,
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }

})
