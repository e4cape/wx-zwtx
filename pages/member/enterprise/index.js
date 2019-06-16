// pages/logistics/applycarrier/index.js
var t = getApp(),
  e = t.requirejs("core");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName: "",//企业名称
    businessLicenseUrl: "",//营业执照
    openBankCertificateUrl: "",//银行开户许可证
    memberList: []//采购列表
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    wx.request({
      url: t.globalData.api + 'login/company/companyInfo?token=' + token,//请求服务器企业账号详情接口
      data: {},
      method: 'post',
      // header: {},   
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        if (data != null) {
          var memberList = data.memberList;
          that.setData({
            memberList: memberList,
            companyName: data.companyName,
            businessLicenseUrl: data.businessLicenseUrl,
            openBankCertificateUrl: data.openBankCertificateUrl,
            state: data.state
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
            //businessLicenseUrl
          },
          success: function (res) {
            var data = JSON.parse(res.data);//将json格式的字符串，转换成JSON对象或者数组
            var businessLicenseUrl = data.data;
            //console.log(businessLicenseUrl)
            that.setData({
              businessLicenseUrl: businessLicenseUrl
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
            //openBankCertificateUrl
          },
          success: function (res) {
            var data = JSON.parse(res.data);//将json格式的字符串，转换成JSON对象或者数组
            var openBankCertificateUrl = data.data;
            console.log(openBankCertificateUrl)
            that.setData({
              openBankCertificateUrl: openBankCertificateUrl
            })
          }
        })
      }
    })
  },
  //企业名称ABC企业
  companyName: function (e) {
    console.log(e.detail.value)
    this.setData({
      companyName: e.detail.value
    })
  },
  //处理comfirm的触发事件
  comfirm: function (e) {
    if (this.data.companyName == "") {
      wx.showToast({
        title: '请输入企业名称',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.businessLicenseUrl == "") {
      wx.showToast({
        title: "请上传您的营业执照",
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (this.data.openBankCertificateUrl == "") {
      wx.showToast({
        title: "请上传您的银行开户许可证",
        icon: 'none',
        duration: 1500
      })
      return false;
    }else {
      var token = wx.getStorageSync('token');
      console.log(token)
      wx.request({
        //请求服务器承运商申请接口
        url: t.globalData.api + 'login/company/register?token=' + token,
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          companyName: this.data.companyName,
          businessLicenseUrl: this.data.businessLicenseUrl,
          openBankCertificateUrl: this.data.openBankCertificateUrl
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
              title: '提交审核成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/member/enterprise/index'　　//成功跳转到开通企业账号页面
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