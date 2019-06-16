// pages/goods/detail/index.js
var t = getApp(),
  e = t.requirejs("core");
var openid, token, code;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wxHidden: true,//微信授权弹窗
    mhHidden: true,//加入购物车数据输入弹窗
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goodsId: '',//产品ID
    goodsSpecId: '',//规格ID
    goodsStoreId: '',//店铺id
    cartGoodsNorms: '',//购物车填入的规格
    sdSpec1Name: '',//规格1
    sdSpec2Name: '',//规格2
    goodsImage:  '',//产品图片
    goodsName: '',//产品名称
    cartNum: '',//购买数量
    cateId: '',//产品分类ID
    type: '',//0-加入购物车； 1-立即抢购
    memberAvatar: '/static/images/icon/upload.png',
    memberNickname: '',
    goodsDetail: [],//产品详情
    code: '',//token验证返回状态码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goodsId = options.goodsId;
    var that = this;
    code = t.globalData.code;//token验证登录返回状态码
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/api/promotion/detail?goodsId=' + goodsId, //促销产品详情接口地址
      method: 'GET',
      header: {
        'content-type': 'application/json' //默认值
      },
      //成功
      success: function (res) {
        console.log(res);
        if (res.data.data != null) {
          var goodsInfo = res.data.data;
          var str = goodsInfo.goodsDetail;
          if (str != undefined){
            var arr = str.split(",");
          }else{
            var arr = '';
          }
          if (goodsInfo.sdSpec2Name != undefined){
            var sdSpec2Name = goodsInfo.sdSpec2Name;
          }else{
            var sdSpec2Name = '';
          }
          if (goodsInfo.remainingStock != undefined) {
            var remainingStock = goodsInfo.remainingStock;
          } else {
            var remainingStock = '';
          }
          if (goodsInfo.contactsName != undefined) {
            var contactsName = goodsInfo.contactsName;
          } else {
            var contactsName = '';
          }
          if (goodsInfo.contactsPhone != undefined) {
            var contactsPhone = goodsInfo.contactsPhone;
          } else {
            var contactsPhone = '';
          }
          if (goodsInfo.supplier != undefined) {
            var supplier = goodsInfo.supplier;
          } else {
            var supplier = '';
          }
          if (goodsInfo.area != undefined) {
            var area = goodsInfo.area;
          } else {
            var area = '';
          }
          that.setData({
            goodsDefaultImage: goodsInfo.goodsDefaultImage,
            goodsDetail: arr,//产品详情图片
            goodsName: goodsInfo.goodsName,
            sdSpec1Name: goodsInfo.sdSpec1Name,
            sdSpec2Name: sdSpec2Name,
            sdGoodsSellPrice: goodsInfo.sdGoodsSellPrice,
            sdGoodsMarketPrice: goodsInfo.sdGoodsMarketPrice,
            remainingStock: remainingStock,
            contactsName: contactsName,
            contactsPhone: contactsPhone,
            supplier: supplier,
            area: area,
            unit: goodsInfo.unit,
            goodsId: goodsInfo.goodsId,
            goodsSpecId: goodsInfo.goodsSpecId,
            goodsStoreId: goodsInfo.goodsStoreId,
            cateId: goodsInfo.cateId
          });
        }
      }
    })
    that.setData({
      code:code,
    })
  },
//加入购物车
  addcart: function (e) {
    var that = this;
    openid = wx.getStorageSync('openid');
    token = wx.getStorageSync('token');
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          console.log(e.currentTarget.dataset);
          that.setData({
            mhHidden: false,
            wxHidden: true,
            goodsId: e.currentTarget.dataset.goodsid,
            goodsSpecId: e.currentTarget.dataset.goodsspecid,
            goodsStoreId: e.currentTarget.dataset.goodsstoreid,
            sdSpec1Name: e.currentTarget.dataset.sdspec1name,
            sdSpec2Name: e.currentTarget.dataset.sdspec2name,
            goodsImage: e.currentTarget.dataset.image,
            goodsName: e.currentTarget.dataset.goodsname,
            cateId: e.currentTarget.dataset.cateid,
            type: e.currentTarget.dataset.type
          });
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //立即购买
  buy: function (e) {
    var that = this;
    openid = wx.getStorageSync('openid');
    token = wx.getStorageSync('token');
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          console.log(e.currentTarget.dataset);
          that.setData({
            mhHidden: false,
            wxHidden: true,
            goodsId: e.currentTarget.dataset.goodsid,
            goodsSpecId: e.currentTarget.dataset.goodsspecid,
            goodsStoreId: e.currentTarget.dataset.goodsstoreid,
            sdSpec1Name: e.currentTarget.dataset.sdspec1name,
            sdSpec2Name: e.currentTarget.dataset.sdspec2name,
            goodsImage: e.currentTarget.dataset.image,
            goodsName: e.currentTarget.dataset.goodsname,
            cateId: e.currentTarget.dataset.cateid,
            type: e.currentTarget.dataset.type
          });
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //允许授权登录
  bindGetUserInfo: function (e) {
    console.log(e.detail.userInfo);
    //return false;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      t.getUserInfo(); //重新获取用户信息
      openid = wx.getStorageSync('openid'); //重新赋值openid

      //请求服务器登录接口
      wx.request({
        url: t.globalData.api + 'login/member/user/login',
        //定义传到后台的数据
        data: {
          //从全局变量data中获取数据
          memberOpenid: openid
        },
        method: 'post',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            token = res.data.data.token; //赋值token
            var memberInfo = res.data.data.memberInfo;
            wx.setStorage({
              key: 'token',
              data: res.data.data.token
            }),
              wx.setStorage({
                key: 'memberPhone',
                data: memberInfo.memberPhone
              }),
              wx.setStorage({
                key: 'memberId',
                data: memberInfo.memberId
              }),
              wx.setStorage({
                key: 'memberAccount',
                data: memberInfo.memberAccount
              }),
              wx.setStorage({
                key: 'memberAvatar',
                data: e.detail.userInfo.avatarUrl
              }),
              wx.setStorage({
                key: 'memberNickname',
                data: e.detail.userInfo.nickName
              })
            //用户已经授权过
            if (memberInfo.memberAvatar != null) {
              that.setData({
                memberAvatar: memberInfo.memberAvatar,
              })
            } else {
              console.log(11111)
              that.setData({
                memberAvatar: e.detail.userInfo.avatarUrl,
              })
            }
            if (memberInfo.memberNickname != null) {
              that.setData({
                memberNickname: memberInfo.memberNickname,
              })
            } else {
              console.log(2222)
              that.setData({
                memberNickname: e.detail.userInfo.nickName,
              })
            }
            that.setData({
              wxHidden: true,
              code: res.data.code,
            });
            that.onShow();
          }
          else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
              success: function () {
                setTimeout(function () {
                  //要延时执行的代码
                  wx.navigateTo({
                    url: '/pages/register/register'　　// 跳转到注册页面
                  })
                }, 2000) //延迟时间
              }
            })
          }
        },
      })
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //处理cartGoodsNorms 的触发事件
  cartGoodsNorms: function (e) {
    var cartGoodsNorms = e.detail.value;//从页面获取到一吨的报价
    if (cartGoodsNorms != '') {
      this.setData({ cartGoodsNorms: cartGoodsNorms });//把获取到的密码赋值给data中的cartGoodsNorms
    }
  },
  //处理cartNum的触发事件
  cartNum: function (e) {
    var cartNum = e.detail.value;//从页面获取到一吨的报价
    if (cartNum != '') {
      this.setData({ cartNum: cartNum });//把获取到的密码赋值给data中的cartNum
    }
  },
  //提交购物车；立即下单
  comfire: function (e) {
    this.setData({
      mhHidden: true
    });
    var token = wx.getStorageSync('token');
    console.log(token)
    var memberId = wx.getStorageSync('memberId');
    if (this.data.cateId == 1){
      var cartGoodsNorms = this.data.cartGoodsNorms;
      if (cartGoodsNorms == ''){
        wx.showToast({
          title: "请输入规格",
          icon: 'none',
          duration: 2000,
        })
        return false;
      }
    }else{
      var cartGoodsNorms = '';
    }
    if (this.data.cartNum == ''){
      wx.showToast({
        title: "请输入需求量",
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    if (token != ''){
      var type = this.data.type;
      if (this.data.sdSpec1Name != '' && this.data.sdSpec2Name != '') {
        var cartGoodsSpecs = this.data.sdSpec1Name + '|' + this.data.sdSpec2Name;//规格
      } else if (this.data.sdSpec1Name == '' && this.data.sdSpec2Name != '') {
        var cartGoodsSpecs = this.data.sdSpec2Name;//规格
      } else if (this.data.sdSpec2Name == '' && this.data.sdSpec1Name != '') {
        var cartGoodsSpecs = this.data.sdSpec1Name;//规格
      }
      //加入购物车
      if (type == 0){
        var url = t.globalData.api + 'mall/cart/addCart?token=' + token;
        wx.request({
          //请求服务器加入购物车接口
          url: url,
          //定义传到后台的数据
          data: {
            //从全局变量data中获取数据
            cartBuyerId: memberId,//购买者id
            cartGoodsId: this.data.goodsId,//购物车商品id
            cartGoodsNorms: cartGoodsNorms,//填入的规格
            cartGoodsSpec: cartGoodsSpecs,//规格 
            cartGoodsSpecId: this.data.goodsSpecId,//规格 id
            cartNum: this.data.cartNum,//商品数量 
            cartState: 1,// 选中状态 1-选中 2-未选中或不可选 ,
            cartStoreId: this.data.goodsStoreId,//店铺Id 
            goodsImage: this.data.goodsImage,//商品图片
            goodsName: this.data.goodsName,//商品名称
            isHot: 1, //是否热销
            goodsCateId: this.data.cateId
          },
          method: 'post',//定义传到后台接受的是post方法还是get方法
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              wx.showToast({
                title: '加入购物车成功',
                icon: 'none',
                duration: 2000,
                success: function () {
                  setTimeout(function () {
                    //要延时执行的代码
                    wx.navigateTo({
                      url: '/pages/member/cart/index?token=' + token　　//成功跳转到购物车页面
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
      }else if(type == 1){//立即抢购
        var url = t.globalData.api + 'mall/cart/orderImmediately?token=' + token;
        var goodsCateId = this.data.cateId;
        var cartGoodVo = {
          cartGoodsNorms: this.data.cartGoodsNorms,//填入的规格
          cartGoodsSpec: cartGoodsSpecs,//规格
          cartGoodsSpecId: this.data.goodsSpecId,//规格 id
          cartNum: this.data.cartNum,//商品数量 
          cartState: 1,//选中
          goodsDefaultImage: this.data.goodsImage,//商品图片
          goodsId: this.data.goodsId,//商品id
          goodsName: this.data.goodsName,//商品名称
          goodsCateId: this.data.cateId,//产品分类ID
          // isHot: 1, //是否热销
        };
        wx.request({
          //请求服务器加入购物车接口
          url: url,
          //定义传到后台的数据
          data: {
            //从全局变量data中获取数据
            cartBuyerId: memberId,//购买者id
            cartStoreId: this.data.goodsStoreId,//店铺Id 
            cartGoodVo: cartGoodVo
          },
          method: 'post',//定义传到后台接受的是post方法还是get方法
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            console.log(res);
            var cartGoodsNorms = res.data.data.cartGoodVo.cartGoodsNorms,
              cartGoodsSpec = res.data.data.cartGoodVo.cartGoodsSpec,
              cartGoodsSpecId = res.data.data.cartGoodVo.cartGoodsSpecId,
              cartNum = res.data.data.cartGoodVo.cartNum,
              cartState = res.data.data.cartGoodVo.cartState,
              goodsDefaultImage = res.data.data.cartGoodVo.goodsDefaultImage,
              goodsId = res.data.data.cartGoodVo.goodsId,
              goodsName = res.data.data.cartGoodVo.goodsName,
              isHot = res.data.data.cartGoodVo.isHot,
              mprice = res.data.data.cartGoodVo.mprice,
              price = res.data.data.cartGoodVo.price,
              unit = res.data.data.cartGoodVo.unit,
              cartStoreId = res.data.data.cartStoreId,
              cartStoreName = res.data.data.cartStoreName,
              rank = res.data.data.rank;
            if (res.data.code == 200) {
              wx.navigateTo({
                url: '/pages/member/comfireorder/index?cartGoodsNorms=' + cartGoodsNorms + '&cartGoodsSpec=' + cartGoodsSpec + '&cartGoodsSpecId=' + cartGoodsSpecId + '&cartNum=' + cartNum + '&cartState=' + cartState + '&goodsDefaultImage=' + goodsDefaultImage + '&goodsId=' + goodsId + '&goodsName=' + goodsName + '&isHot=' + isHot + '&mprice=' + mprice + '&price=' + price + '&unit=' + unit + '&cartStoreId=' + cartStoreId + '&cartStoreName=' + cartStoreName + '&rank=' + rank + '&goodsCateId=' + goodsCateId,　　//成功跳转到确认订单页面
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