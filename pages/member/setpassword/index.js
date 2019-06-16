// pages/login/login.js
var t = getApp();
Page({
  //定义全局变量data
  data: {
    oldPassword: "",
    newPassword: "",
    repassword: "",
  },
  //处理pwdInput的触发事件
  pwdInput: function (e) {
    var oldPassword = e.detail.value;//从页面获取到用户输入的密码
    if (oldPassword != '') {
      this.setData({ oldPassword: oldPassword });//把获取到的密码赋值给全局变量data中的oldPassword
    }
  },
  //处理upwdBlur的触发事件
  upwdBlur: function (e) {
    var newPassword = e.detail.value;//从页面获取到用户输入的密码
    if (newPassword != '') {
      this.setData({ newPassword: newPassword });//把获取到的密码赋值给全局变量data中的newPassword
    }
  }, 
  //处理repasswordInput的触发事件
  repasswordInput: function (e) {
    var repassword = e.detail.value;//从页面获取到用户输入的密码
    if (repassword != '') {
      this.setData({ repassword: repassword });//把获取到的密码赋值给全局变量data中的repassword
    }
  }, 
  //处理confirm的触发事件
  confirm: function (e) {
    if (this.data.oldPassword == "") {
      wx.showToast({
        title: '原密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    // if (this.data.oldPassword.length < 6) {
    //   wx.showToast({
    //     title: '请输入正确的原密码',
    //     icon: 'none',
    //     duration: 1000
    //   })
    //   return false;
    // }
    if (this.data.newPassword == "") {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 1000
      })
      return false;
    } 
    if (this.data.newPassword.length < 6) {
      wx.showToast({
        title: '请输入六位以上密码',
        icon: 'none',
        duration: 1000
      })
      return false;
    } 
    if (this.data.repassword != this.data.newPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none',
        duration: 1000
      })
      return false;
    }else {
      var token = wx.getStorageSync('token');
      var memberPhone = wx.getStorageSync('memberPhone');
      console.log(token)
      wx.request({
        url: t.globalData.api + 'login//member/update/password?token=' + token,//请求服务器修改密码接口
        //定义传到后台的数据
        data: {
          newPassword: this.data.newPassword,
          oldPassword: this.data.oldPassword,
          phone: memberPhone
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log("调用API成功");
          console.log(res);
          if (res.data.code == 200) {
            wx.clearStorage()
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/login/login'　　// 修改成功，跳转到登录页
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
  }
})