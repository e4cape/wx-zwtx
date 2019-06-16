// pages/logistics/applycarrier/index.js
var t = getApp(),
  e = t.requirejs("core");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carrierName: "",//承运商姓名
    carrierIdcard: "",//身份证
    carrierPhone: "",//手机号
    carrierZidcardImage: "",//身份证正面照片，序列化存储
    carrierFidcardImage: "",//身份证反面照片，序列化存储 
    businessLicenseImage: "",//营业执照
    carrierState: 404,//非承运商状态
    carrierCheck: '',//审核理由
    carrierId: '',//承运商ID
    carrierMemberId: ''//用户ID
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: t.globalData.api + 'login/carrier/carrierInfo?token=' + token,//请求服务器承运商详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        if (data != null){
        that.setData({
          businessLicenseImage: data.businessLicenseImage,
          carrierFidcardImage: data.carrierFidcardImage,
          carrierIdcard: data.carrierIdcard,
          carrierName: data.carrierName,
          carrierPhone: data.carrierPhone,
          carrierZidcardImage: data.carrierZidcardImage,
          carrierState: data.carrierState,
          carrierCheck: data.carrierCheck,
          carrierId: data.carrierId,
          carrierMemberId: data.carrierMemberId
        })
        }
      }
    })
  },
  // 图片上传
  upload: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths)
        wx.uploadFile({
          url: t.globalData.api + 'basics/goods/good/uploadimg',
          filePath: tempFilePaths[0],
          name: 'file',
          data: {
            //carrierZidcardImage
          },
          success: function (res) {
            var data = JSON.parse(res.data);//将json格式的字符串，转换成JSON对象或者数组
            var carrierZidcardImage = data.data;
            //console.log(carrierZidcardImage)
            that.setData({
              carrierZidcardImage: carrierZidcardImage
            })
          }
        })
      }
    })
  },
  uploadFile: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: t.globalData.api + 'basics/goods/good/uploadimg',
          filePath: tempFilePaths[0],
          name: 'file',
          data: {
            //carrierFidcardImage
          },
          success: function (res) {
            var data = JSON.parse(res.data);//将json格式的字符串，转换成JSON对象或者数组
            var carrierFidcardImage = data.data;
            console.log(carrierFidcardImage)
            that.setData({
              carrierFidcardImage: carrierFidcardImage
            })
          }
        })
      }
    })
  },
  uoloadImg: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: t.globalData.api + 'basics/goods/good/uploadimg',
          filePath: tempFilePaths[0],
          name: 'file',
          data: {
            //businessLicenseImage
          },
          success: function (res) {
            var data = JSON.parse(res.data);//将json格式的字符串，转换成JSON对象或者数组
            var businessLicenseImage = data.data;
            console.log(businessLicenseImage)
            that.setData({
              businessLicenseImage: businessLicenseImage
            })
          }
        })
      }
    })
  },
  //承运商姓名
  carrierName: function (e) {
    console.log(e.detail.value)
    this.setData({
      carrierName: e.detail.value
    })
  },
  //身份证
  carrierIdcard: function (e) {
    console.log(e.detail.value)
    this.setData({
      carrierIdcard: e.detail.value
    })
  },
  //手机号
  carrierPhone: function (e) {
    console.log(e.detail.value)
    this.setData({
      carrierPhone: e.detail.value
    })
  },
  //身份证正面照片，序列化存储
  
  //身份证反面照片，序列化存储
  carrierFidcardImage: function (e) {
    console.log(e.detail.value)
    this.setData({
      carrierFidcardImage: e.detail.value
    })
  },
  //营业执照
  businessLicenseImage: function (e) {
    console.log(e.detail.value)
    this.setData({
      businessLicenseImage: e.detail.value
    })
  },
  //提交承运商申请
  comfirm: function (e) {
    if (this.data.carrierName == "") {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
    if (this.data.carrierIdcard == "") {
      wx.showToast({
        title: '请输入您的身份证号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!reg.test(this.data.carrierIdcard)) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.carrierPhone == "") {
      wx.showToast({
        title: '请输入您的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.carrierPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    console.log(this.data.carrierZidcardImage)
    if (this.data.carrierZidcardImage == "") {
      wx.showToast({
        title: "请上传您的身份证正面照",
        icon: 'none',
        duration: 1500
      })
      return false;
    } 
    if (this.data.carrierFidcardImage == "") {
      wx.showToast({
        title: "请上传您的身份证反面照",
        icon: 'none',
        duration: 1500
      })
      return false;
    } 
    if (this.data.businessLicenseImage == "") {
      wx.showToast({
        title: "请上传您的营业执照",
        icon: 'none',
        duration: 1500
      })
      return false;
    }else {
      var token = wx.getStorageSync('token');
      //console.log(token)
      wx.request({
        //请求服务器承运商申请接口
        url: t.globalData.api + 'login/carrier/applyCarrier?token=' + token,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          carrierName: this.data.carrierName,
          carrierIdcard: this.data.carrierIdcard,
          carrierPhone: this.data.carrierPhone,
          carrierZidcardImage: this.data.carrierZidcardImage,
          carrierFidcardImage: this.data.carrierFidcardImage,
          businessLicenseImage: this.data.businessLicenseImage,
          carrierState: 2//申请中
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
         // console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '提交审核成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.redirectTo({
                    url: '/pages/logistics/applycarrier/index'　　//成功跳转到承运商详情页面
                  })
                }, 2000) //延迟时间
              }
            })
          }else if(res.data.code == 401){
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/login/login'　　//跳转到登录页面
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
  //重新提交运输申请
  reapply: function (e) {
    if (this.data.carrierName == "") {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (this.data.carrierIdcard == "") {
      wx.showToast({
        title: '请输入您的身份证号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!reg.test(this.data.carrierIdcard)) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.carrierPhone == "") {
      wx.showToast({
        title: '请输入您的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else if (!myreg.test(this.data.carrierPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    console.log(this.data.carrierZidcardImage)
    if (this.data.carrierZidcardImage == "") {
      wx.showToast({
        title: "请上传您的身份证正面照",
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.carrierFidcardImage == "") {
      wx.showToast({
        title: "请上传您的身份证反面照",
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.businessLicenseImage == "") {
      wx.showToast({
        title: "请上传您的营业执照",
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      var token = wx.getStorageSync('token');
      //console.log(token)
      wx.request({
        //请求服务器承运商申请接口
        url: t.globalData.api + 'login/carrier/carrierAgain?token=' + token,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          carrierName: this.data.carrierName,
          carrierIdcard: this.data.carrierIdcard,
          carrierPhone: this.data.carrierPhone,
          carrierZidcardImage: this.data.carrierZidcardImage,
          carrierFidcardImage: this.data.carrierFidcardImage,
          businessLicenseImage: this.data.businessLicenseImage,
          carrierMemberId: this.data.carrierMemberId,
          carrierId: this.data.carrierId,
          carrierCheck: this.data.carrierCheck,
          carrierState: 0,//申请中
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          // console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '恭喜您！提交审核成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/logistics/applycarrier/index'　　//成功跳转到承运商详情页面
                  })
                }, 2000) //延迟时间
              }
            })
          } else if (res.data.code == 401) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/login/login'　　//跳转到登录页面
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