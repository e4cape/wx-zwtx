// pages/member/userinfo/index.js
var t = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mhHidden: true,
    memberNickname: '',
    memberAvatar: '/static/images/icon/upload.png',//昵称头像
    memberIntegral: ''//会员积分
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.token)
    var that = this;
    var memberAvatar = wx.getStorageSync('memberAvatar');
    var memberNickname = wx.getStorageSync('memberNickname');
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + options.token,//请求服务器路线详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        if (data.memberAvatar != null) {
          that.setData({
            memberAvatar: data.memberAvatar,
          })
        } else {
          console.log(11111)
          that.setData({
            memberAvatar: memberAvatar,
          })
        }
        if (data.memberNickname != null) {
          that.setData({
            memberNickname: data.memberNickname,
          })
        } else {
          console.log(2222)
          that.setData({
            memberNickname: memberNickname,
          })
        }
        that.setData({
          memberAccount: data.memberAccount,
          memberPhone: data.memberPhone,
          memberIntegral: data.memberIntegral
        })
      }
    })
  },
 
  // 图片上传
  upload: function () {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        //console.log(tempFilePaths)
        wx.uploadFile({
          url: t.globalData.api + 'basics/goods/good/uploadimg',
          filePath: tempFilePaths[0],
          name: 'file',
          data: {
            //memberAvatar
          },
          success: function (res) {
            var data = JSON.parse(res.data);//将json格式的字符串，转换成JSON对象或者数组
            var memberAvatar = data.data;
            console.log(memberAvatar)
            that.setData({
              memberAvatar: memberAvatar
            })
            var token = wx.getStorageSync('token');
            var memberId = wx.getStorageSync('memberId');
            console.log(token)
            wx.request({
              url: t.globalData.api + 'login/member/updateMember?token=' + token + '&memberId=' + memberId,//请求服务器修改会员头像接口
              //定义传到后台的数据
              data: {
                memberId: memberId,
                memberAvatar: memberAvatar
              },
              method: 'post',//定义传到后台接受的是post方法还是get方法
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '修改成功',
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
        })
      }
    })
  },
  update: function (e) {
    //console.log(e.currentTarget.dataset);
    this.setData({
      mhHidden: false,
    });
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
 
  //处理NickNameInput的触发事件
  NickNameInput: function (e) {
    var memberNickname = e.detail.value;//从页面获取到用户输入的密码
    if (memberNickname != '') {
      this.setData({ memberNickname: memberNickname });//把获取到的密码赋值给全局变量data中的memberNickname
    }
  },
  //处理confirm的触发事件
  confirm: function (e) {
    this.setData({
      mhHidden: true
    });
    if (this.data.memberNickname == "") {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none',
        duration: 1000
      })
      return false;
    } else {
      var token = wx.getStorageSync('token');
      var memberId = wx.getStorageSync('memberId');
      console.log(token)
      wx.request({
        url: t.globalData.api + 'login/member/updateMember?token=' + token + '&memberId=' + memberId,//请求服务器修改密码接口
        //定义传到后台的数据
        data: {
          memberId: memberId,
          memberNickname: this.data.memberNickname
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            wx.showToast({
              title: '修改成功',
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