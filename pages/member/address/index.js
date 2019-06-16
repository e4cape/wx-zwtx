// pages/member/address/index.js
var t = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: []//地址列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    if (token != '') {
      //发送请求
      wx.request({
        url: t.globalData.api + 'login/api/address/list?token=' + token, //地址列表接口地址
        method: 'GET',
        header: {
          'content-type': 'application/json' //默认值
        },
        //成功
        success: function (res) {
          console.log(res);
          if (res.data != null) {
            var dataList = res.data.data;
            console.log(dataList)
            for (var i in dataList){
              var regionName = dataList[i].regionName;
              console.log(dataList[i])
              dataList[i].regionName = regionName.replace(/,/g,'');
            }
            that.setData({
              dataList: dataList
            });
          }
        }
      })
    }
  },
  //设置默认的地址
  setting:function(e){
    console.log(e.detail.value[0])
    var addressId = e.detail.value[0];
    var token = wx.getStorageSync('token');
    var that = this;
    //发送请求
    wx.request({
      url: t.globalData.api + 'login/api/address/setDefault?token=' + token + '&id=' + addressId, //地址列表接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '设置成功',
            icon: 'none',
            duration: 2000,
          })
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  //删除指定地址
  del: function (e) {
    console.log(e.currentTarget.dataset.id)
    var addressId = e.currentTarget.dataset.id;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          //发送请求
          wx.request({
            url: t.globalData.api + 'login/api/address/delete?token=' + token + '&id=' + addressId, //删除指定地址接口地址
            method: 'GET',
            header: {
              'content-type': 'application/json' //默认值
            },
            //成功
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000,
                })
                that.onLoad()
              } else {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  //编辑指定地址
  edit: function (e) {
    //dataset内包含data-*的数据
    var addressId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/editaddress/index?addressId=' + addressId,
    })
  },
  //新增地址
  addAddress: function (e) {
    //dataset内包含data-*的数据
    var addressId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/member/addaddress/index',
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
    this.onLoad()
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