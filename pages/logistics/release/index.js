// pages/logistics/release/index.js
var t = getApp(),
  e = t.requirejs("core");
var time = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mhHidden: true,
    routeFromCity: ['请选择装货地'],//装货地
    fromMarket: '',//装货地省
    fromCity: '',//装货地的市
    fromArea: '',//装货地的县
    routeFromAddress: "",//装货地详细地址
    routeToCity: ['请选择卸货地'],//卸货地
    toMarket: '',//卸货地的省份
    toCity: '',//卸货地的市,
    toArea: '',//卸货地的县
    routeToAddress: "",//卸货地详细地址
    routeCarLong: [],//车长
    routeCarType: [],//车型
    routeUnit: "",//货运单位，单位 1-吨（默认）2-立方
    routeMinNumber: "",//货运量，最小量
    routeMaxNumber: "",//货运量，最大量
    routeGoodsName: "",//货物名称
    routeContactName: "",//货物联系人姓名
    routeContactPhone: "",//联系人手机
    routeBeginTime: "",//路线装货开始时间
    routeReceiveTime: "",//期望送达时间
    routeId: '',//用来判断是否重发
    routeState: '',
    checkCarLong:'',
    checkCarType:'',
    currentTime: '',//当前时间
  },
  //装货地
  routeFromCity: function (e) {
    //console.log(e.detail.value)
    var routeCity = e.detail.value;
    var routeFromCity = routeCity[0] + routeCity[1] + routeCity[2];
    console.log(routeCity[1])
    this.setData({
      fromMarket: routeCity[0],//装货地的省份
      fromCity: routeCity[1],//装货地的市
      fromArea: routeCity[2],//装货地的县 ,
      routeFromCity: routeFromCity,
      //fromCity: routeCity[1]
    })
  },
  routeFromAddress: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeFromAddress: e.detail.value
    })
  },
  //卸货地
  routeToCity: function (e) {
    //console.log(e.detail.value)
    var routeCity = e.detail.value;
    var routeToCity = routeCity[0] + routeCity[1] + routeCity[2];
    console.log(routeCity[1])
    this.setData({
      toMarket: routeCity[0],//卸货地的省份
      toCity: routeCity[1],//卸货地的市,
      toArea: routeCity[2],//卸货地的县
      routeToCity: routeToCity
    })
  },
  routeToAddress: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeToAddress: e.detail.value
    })
  },
  //车长车型
  routeCarLong: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeCarLong: e.detail.value
    })
  },
  routeCarType: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeCarType: e.detail.value
    })
  },
  //货运单位，单位 1-吨（默认）2-立方
  routeUnit: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeUnit: e.detail.value
    })
  },
  //货运量，最小量
  routeMinNumber: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeMinNumber: e.detail.value
    })
  },
  //货运量，最大量
  routeMaxNumber: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeMaxNumber: e.detail.value
    })
  },
  //货物名称
  routeGoodsName: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeGoodsName: e.detail.value
    })
  },
  //货物联系人姓名
  routeContactName: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeContactName: e.detail.value
    })
  },
  //联系人手机
  routeContactPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeContactPhone: e.detail.value
    })
  },
  //路线装货开始时间
  routeBeginTime: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeBeginTime: e.detail.value
    })
  },
  //期望送达时间
  routeReceiveTime: function (e) {
    console.log(e.detail.value)
    this.setData({
      routeReceiveTime: e.detail.value
    })
  },
  //选择车型车长
  car: function(e){
    var data = e.currentTarget.dataset;
    var routeFromCity = data.routefromcity;
    var routeFromAddress = data.routefromaddress;
    var routeToCity = data.routetocity;
    var routeToAddress = data.routetoaddress;
    var fromMarket = data.frommarket;//装货地省
    var fromCity = data.fromcity;//装货地的市
    var fromArea = data.fromarea;//装货地的县
    var toMarket = data.tomarket;//卸货地的省份
    var toCity = data.tocity;//卸货地的市,
    var toArea = data.toarea;//卸货地的县
    var routeUnit = data.routeunit;//单位
    var routeMinNumber = data.routeminnumber;//最小货运量
    var routeMaxNumber = data.routemaxnumber; //最大货运量
    var routeGoodsName = data.routegoodsname;//货物名称
    var routeContactName = data.routecontactname;//联系人
    var routeContactPhone = data.routecontactphone;//联系号码
    var routeBeginTime = data.routebegintime;//装货时间
    var routeReceiveTime = data.routereceivetime;//收货时间
    wx.navigateTo({
      url: '/pages/logistics/car/index?routeFromCity=' + routeFromCity + '&routeFromAddress=' + routeFromAddress + '&routeToCity=' + routeToCity + '&routeToAddress=' + routeToAddress + '&fromMarket=' + fromMarket + '&fromCity=' + fromCity + '&fromArea=' + fromArea + '&toMarket=' + toMarket + '&toCity=' + toCity + '&toArea=' + toArea + '&routeUnit=' + routeUnit + '&routeMinNumber=' + routeMinNumber + '&routeMaxNumber=' + routeMaxNumber + '&routeGoodsName=' + routeGoodsName + '&routeContactName=' + routeContactName + '&routeContactPhone=' + routeContactPhone + '&routeBeginTime=' + routeBeginTime + '&routeReceiveTime=' + routeReceiveTime,
    })
  },
  //车型车长弹窗
  offer: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: false
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
  //处理comfirm的触发事件
  comfirm: function (e) {
    console.log(this.data.routeFromCity)
    if (this.data.routeFromCity == "") {
      wx.showToast({
        title: '装货地不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeFromAddress == "") {
      wx.showToast({
        title: '装货地详细地址不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeToCity == "") {
      wx.showToast({
        title: '卸货地不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeToAddress == "") {
      wx.showToast({
        title: '卸货地详细地址不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeMinNumber == "") {
      wx.showToast({
        title: '货运量最小值不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeMaxNumber == "") {
      wx.showToast({
        title: '货运量最大值不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeGoodsName == "") {
      wx.showToast({
        title: '请输入货物名称',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.routeContactName == "") {
      wx.showToast({
        title: '请输入联系人名称',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.routeContactPhone == "") {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.routeContactPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var token = wx.getStorageSync('token');
      console.log(token)
      var memberAccount = wx.getStorageSync('memberAccount');
      var routeId = this.data.routeId;
      if (routeId){
        var url = t.globalData.api + 'logistics/route/repeatRoute?token=' + token
        var routeState = this.data.routeState;
        var routeId = routeId;
      }else{
        var url = t.globalData.api + 'logistics/route/addRoute?token=' + token;
        var routeState = 0;
        var routeId = '';
      }
      wx.request({
        //请求服务器发布物流路线接口
        url: url,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          routeFromMarket: this.data.fromMarket,//装货地的省份
          routeFromCity: this.data.fromCity,//装货地的市
          routeFromArea: this.data.fromArea,//装货地的县 ,
          routeFromAddress: this.data.routeFromAddress,//装货地的地址
          routeToMarket: this.data.toMarket,//卸货地的省份
          routeToCity: this.data.toCity,//卸货地的市,
          routeToArea: this.data.toArea,//卸货地的县
          routeToAddress: this.data.routeToAddress,// 卸货地的地址 
          routeCarLong: this.data.checkCarLong,//货车长度,
          routeCarType: this.data.checkCarType,//货车类型,
          routeUnit: this.data.routeUnit,//单位 1-吨（默认）2-立方
          routeMinNumber: this.data.routeMinNumber,//最小量
          routeMaxNumber: this.data.routeMaxNumber,//最大量
          routeGoodsName: this.data.routeGoodsName,//货物名称
          routeContactName: this.data.routeContactName,//货物联系人姓名
          routeContactPhone: this.data.routeContactPhone,//联系人手机
          routeCreateUser: memberAccount,//发布人
          routeBeginTime: this.data.routeBeginTime,//路线开始时间
          routeReceiveTime: this.data.routeReceiveTime,//期望送达时间
          routeState: routeState,//待审核
          routeId: routeId,
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
              title: '发布货源成功,会尽快审核...',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.redirectTo({
                    url: '/pages/member/logistics/index'　　//成功跳转到我的物流页面
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
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var currentTime = time.formatTime(new Date());//当前时间
    console.log(options)
    var routeId = options.routeId;
    /*车型车长返回的参数 */
    var checkCarLong = options.checkCarLong;
    var checkCarType = options.checkCarType;
    var routeFromCity = options.routeFromCity;
    var routeFromAddress = options.routeFromAddress;
    var routeToCity = options.routeToCity;
    var routeToAddress = options.routeToAddress;
    var fromMarket = options.fromMarket;
    var fromCity = options.fromCity;
    var fromArea = options.fromArea;
    var toMarket = options.toMarket;
    var toCity = options.toCity;
    var toArea = options.toArea;
    var routeUnit = options.routeUnit;
    var routeMinNumber = options.routeMinNumber;
    var routeMaxNumber = options.routeMaxNumber;
    var routeGoodsName = options.routeGoodsName;
    var routeContactName = options.routeContactName;
    var routeContactPhone = options.routeContactPhone;
    var routeBeginTime = options.routeBeginTime;
    var routeReceiveTime = options.routeReceiveTime;
    /*车型车长返回的参数end */
    var that = this;
    if (routeId != undefined){
    wx.request({
      //请求服务器获取物流路线详情接口
      url: t.globalData.api + 'logistics/route/routeDetil?routeId=' + routeId,
      data: '',
      header: { 'content-type': 'application/json'},
      method: 'GET',
      success: function(res) {
        console.log(res);
        var data = res.data.data;
        that.setData({
          routeFromCity: data.routeFromMarket + data.routeFromCity + data.routeFromArea,//装货地
          fromMarket: data.routeFromMarket,//装货地的省份
          fromCity: data.routeFromCity,//装货地的市
          fromArea: data.routeFromArea,//装货地的县 ,
          routeFromAddress: data.routeFromAddress,//装货地详细地址
          routeToCity: data.routeToMarket + data.routeToCity + data.routeToArea,//卸货地
          toMarket: data.routeToMarket,//卸货地的省份
          toCity: data.routeToCity,//卸货地的市,
          toArea: data.routeToArea,//卸货地的县
          routeToAddress: data.routeToAddress,//卸货地详细地址
          checkCarLong: data.routeCarLong,//车长
          checkCarType: data.routeCarType,//车类型
          routeUnit: data.routeUnit,//1吨2方
          routeMinNumber: data.routeMinNumber,//最小量
          routeMaxNumber: data.routeMaxNumber,//最大量
          routeGoodsName: data.routeGoodsName,//货物名称
          routeContactName: data.routeContactName,//联系人
          routeContactPhone: data.routeContactPhone,//联系电话
          routeBeginTime: data.routeBeginTime,//装货时间
          routeReceiveTime: data.routeReceiveTime,//送达时间
          routeId: routeId,//用来判断是否重发
          routeState: data.routeState,//状态
        })
      },
      fail: function(res) {
        console.log("调用API失败");
      },
    })
    }
    //获取车型车长返回的参数显示出来
    if (checkCarLong != undefined || checkCarType != undefined || routeFromCity != undefined || routeFromAddress != undefined || routeToCity != undefined || routeToAddress != undefined || fromMarket != undefined || fromCity != undefined || fromArea != undefined || toMarket != undefined || toCity != undefined || toArea != undefined || routeUnit != undefined || routeMinNumber != undefined || routeMaxNumber != undefined || routeGoodsName != undefined || routeContactName != undefined || routeContactPhone != undefined || routeBeginTime != undefined || routeReceiveTime != undefined) {
    that.setData({
      checkCarLong: checkCarLong,
      checkCarType: checkCarType,
      routeFromCity: routeFromCity,
      routeFromAddress: routeFromAddress,
      routeToCity: routeToCity,
      routeToAddress: routeToAddress,
      fromMarket: fromMarket,
      fromCity: fromCity,
      fromArea: fromArea,
      toMarket: toMarket,
      toCity: toCity,
      toArea: toArea,
      routeUnit: routeUnit,
      routeMinNumber: routeMinNumber,
      routeMaxNumber: routeMaxNumber,
      routeGoodsName: routeGoodsName,
      routeContactName: routeContactName,
      routeContactPhone: routeContactPhone,
      routeBeginTime: routeBeginTime,
      routeReceiveTime: routeReceiveTime,
    })
    }
    that.setData({
      currentTime: currentTime,
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