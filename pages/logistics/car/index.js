// pages/logistics/car/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carLong: [
      {name:4.2,selected:0},
      { name: 5, selected: 0 },
      { name: 6.2, selected: 0 },
      { name: 7.7, selected: 0 }, 
      { name: 8.2, selected: 0 },
      { name: 8.7, selected: 0 },
      { name: 9.6, selected: 0 },
      { name: 11.7, selected: 0 }, 
      { name: 12.5, selected: 0 }, 
      { name: 13, selected: 0 }, 
      { name: 15, selected: 0 }, 
      { name: 16, selected: 0 }, 
      { name: 17.5, selected: 0 }
      ],
    carType: [
      { name: '平板', selected: 0 },
      { name: '高栏', selected: 0 },
      { name: '厢式', selected: 0 },
      { name: '集装箱', selected: 0 },
      { name: '自卸', selected: 0 },
      { name: '保温', selected: 0 },
      { name: '高低板', selected: 0 },
      { name: '面包车', selected: 0 },
      { name: '棉被车', selected: 0 },
      { name: '飞翼车',selected: 0 },
      ],
    carLongNum:0,
    checkCarLong:'',
    carTypeNum:0,
    checkCarType: '',
    checkedCarLong:'',
    checkedCarType:'',
    routeFromCity:'',//装货地
    routeFromAddress: '',//装货地详细地址
    routeToCity: '',//卸货地
    routeToAddress: '',//卸货地详细地址
    fromMarket: '',//装货地省
    fromCity: '',//装货地市
    fromArea: '',//装货地县
    toMarket: '',//卸货地省
    toCity: '',//卸货地市
    toArea: '',//卸货地县
    routeUnit: '',//单位
    routeMinNumber: '',//最小货量
    routeMaxNumber: '',//最大货量
    routeGoodsName: '',//货物名称
    routeContactName: '',//联系人
    routeContactPhone: '',//联系电话
    routeBeginTime: '',//装货时间
    routeReceiveTime: '',//收货时间
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.setData({
      routeFromCity: options.routeFromCity,
      routeFromAddress: options.routeFromAddress,
      routeToCity: options.routeToCity,
      routeToAddress: options.routeToAddress,
      fromMarket: options.fromMarket,
      fromCity: options.fromCity,
      fromArea: options.fromArea,
      toMarket: options.toMarket,
      toCity: options.toCity,
      toArea: options.toArea,
      routeUnit: options.routeUnit,
      routeMinNumber: options.routeMinNumber,
      routeMaxNumber: options.routeMaxNumber,
      routeGoodsName: options.routeGoodsName,
      routeContactName: options.routeContactName,
      routeContactPhone: options.routeContactPhone,
      routeBeginTime: options.routeBeginTime,
      routeReceiveTime: options.routeReceiveTime,
    })

  },
  /**车长选择**/
  carLong: function (e) {
    var that = this;
    var carLongNum = that.data.carLongNum; //选中数量
    var checkCarLong = that.data.checkCarLong; //选中车长
    var value = e.currentTarget.dataset.value;
    var selected = e.currentTarget.dataset.selected;
    var carLong = that.data.carLong;
    for (var i = 0; i < carLong.length; i++) {
      if(selected == 1){
        if (carLong[i].name == value) {
          carLong[i].selected = 0;
          carLongNum = carLongNum - 1;
          checkCarLong = checkCarLong.replace(value + '米/', "");
        }
      }else{
        if (carLongNum < 3) {
          if (carLong[i].name == value) {
            carLong[i].selected = 1;
            carLongNum = carLongNum + 1;
            checkCarLong += value + '米/';
          }
        } else {
          wx.showToast({
            title: '最多只能选3个',
            icon: 'none',
            duration: 1000
          })
        }
      }
    }
    console.log(carLongNum)
    console.log(checkCarLong)
    var checkedCarLong = checkCarLong.substring(0, checkCarLong.lastIndexOf('/'));
    // console.log(checkedCarLong)
    that.setData({
      carLongNum: carLongNum,
      carLong: carLong,
      checkCarLong: checkCarLong,
      checkedCarLong: checkedCarLong
    })
  },
  /**车型选择**/
  carType: function (e) {
    var that = this;
    var carTypeNum = that.data.carTypeNum; //选中数量
    var checkCarType = that.data.checkCarType; //选中车型
    var value = e.currentTarget.dataset.value;
    var selected = e.currentTarget.dataset.selected;
    var carType = that.data.carType;
    for (var i = 0; i < carType.length; i++) {
      if (selected == 1) {
        if (carType[i].name == value) {
          carType[i].selected = 0;
          carTypeNum = carTypeNum - 1;
          checkCarType = checkCarType.replace(value + '/', "");
        }
      }else{
        if (carTypeNum < 3) {
          if (carType[i].name == value) {
            carType[i].selected = 1;
            carTypeNum = carTypeNum + 1;
            checkCarType += value + '/';
          }
        } else {
          wx.showToast({
            title: '最多只能选3个',
            icon: 'none',
            duration: 1000
          })
        }
      }
      
    }
    console.log(checkCarType)
    var checkedCarType = checkCarType.substring(0, checkCarType.lastIndexOf('/'));
    console.log(checkedCarType)
    that.setData({
      carTypeNum: carTypeNum,
      carType: carType,
      checkCarType: checkCarType,
      checkedCarType: checkedCarType,
    })
  },
  //传值到发布货源页面
  comfirm: function(e){
    var that = this;
    var checkCarLong = that.data.checkedCarLong;
    var checkCarType = that.data.checkedCarType;
    var routeFromCity = that.data.routeFromCity;
    var routeFromAddress = that.data.routeFromAddress;
    var routeToCity = that.data.routeToCity;
    var routeToAddress = that.data.routeToAddress;
    var fromMarket = that.data.fromMarket;
    var fromCity = that.data.fromCity;
    var fromArea = that.data.fromArea;
    var toMarket = that.data.toMarket;
    var toCity = that.data.toCity;
    var toArea = that.data.toArea;
    var routeUnit = that.data.routeUnit;
    var routeMinNumber = that.data.routeMinNumber;
    var routeMaxNumber = that.data.routeMaxNumber;
    var routeGoodsName = that.data.routeGoodsName;
    var routeContactName = that.data.routeContactName;
    var routeContactPhone = that.data.routeContactPhone;
    var routeBeginTime = that.data.routeBeginTime;
    var routeReceiveTime = that.data.routeReceiveTime;
    wx.navigateTo({
      url: '/pages/logistics/release/index?checkCarLong=' + checkCarLong + '&checkCarType=' + checkCarType + '&routeFromCity=' + routeFromCity + '&routeFromAddress=' + routeFromAddress + '&routeToCity=' + routeToCity + '&routeToAddress=' + routeToAddress + '&fromMarket=' + fromMarket + '&fromCity=' + fromCity + '&fromArea=' + fromArea + '&toMarket=' + toMarket + '&toCity=' + toCity + '&toArea=' + toArea + '&routeUnit=' + routeUnit + '&routeMinNumber=' + routeMinNumber + '&routeMaxNumber=' + routeMaxNumber + '&routeGoodsName=' + routeGoodsName + '&routeContactName=' + routeContactName + '&routeContactPhone=' + routeContactPhone + '&routeBeginTime=' + routeBeginTime + '&routeReceiveTime=' + routeReceiveTime,
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