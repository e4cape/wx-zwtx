// pages/member/editaddress/index.js
var t = getApp(),
  e = t.requirejs("core");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressee: "",//收货人
    phone: "",//收货人电话
    regionId: [''],//所在地区
    regionCode: [''],//所在地区编码
    address: "",//收货人详细地址
    addressId: "",//地址ID
    isDefault: ''
  },
  //收货人
  addressee: function (e) {
    //console.log(e.detail.value)
    var addressee = e.detail.value;
    this.setData({
      addressee: addressee
    })
  },
  //收货人电话
  phone: function (e) {
    console.log(e.detail.value)
    this.setData({
      phone: e.detail.value
    })
  },
  //所在地区
  regionId: function (e) {
    var regionId = e.detail.value;
    var regionCode = e.detail.code[0] + ',' + e.detail.code[1] + ',' + e.detail.code[2];
    console.log(regionCode)
    this.setData({
      regionId: regionId,
      regionCode: regionCode
    })
  },
  //收货人详细地址
  address: function (e) {
    console.log(e.detail.value)
    this.setData({
      address: e.detail.value
    })
  },
  //处理comfirm的触发事件
  comfirm: function (e) {
    console.log(this.data.addressee)
    if (this.data.addressee == "") {
      wx.showToast({
        title: '收货人名称不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.regionId == "") {
      wx.showToast({
        title: '所在地区不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.address == "") {
      wx.showToast({
        title: '详细地址不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var token = wx.getStorageSync('token');
      var addressId = this.data.addressId;
      var isDefault = this.data.isDefault;
      //console.log(addressId)
      var memberId = wx.getStorageSync('memberId');
      var addressee = this.data.addressee;
      var phone = this.data.phone;
      var regionId = this.data.regionCode;
      // var regionId = e.currentTarget.dataset.regionid;
      console.log(regionId)
      var address = this.data.address;
      wx.request({
        //请求服务器注册接口
        url: t.globalData.api + 'login/api/address/save?token=' + token,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberId: memberId,
          addressee: addressee,
          phone: phone,
          regionId: regionId,
          address: address,
          isDefault: isDefault,
          addressId: addressId
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '修改地址成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/member/address/index?token=' + token　　//成功跳转到地址管理页面页面
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
    var token = wx.getStorageSync('token');
    var addressId = options.addressId;
    var that = this;
    //发送请求
    wx.request({
      url: t.globalData.api + 'login/api/address/detail?token=' + token + '&id=' + addressId, //地址详情接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.data != null) {
          var addressInfo = res.data.data;
          that.setData({
            addressee: addressInfo.addressee,
            phone: addressInfo.phone,
            regionId: addressInfo.regionName,
            regionCode: addressInfo.regionId,
            address: addressInfo.address,
            addressId: addressId,
            isDefault: addressInfo.isDefault
          });
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