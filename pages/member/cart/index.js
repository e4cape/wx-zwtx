// pages/member/cart/index.js
var t = getApp(),
  e = t.requirejs("core");
var openid, token, code;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wxHidden: true,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    dataList: [],
    // 金额
    totalPrice: 0, // 总价，初始为0
    checkedAll: false,
    mhHidden: true,
    hHidden: '',
    hhHidden: true,
    mmHidden: false,
    mmhhHidden: true,
    numHidden: false,
    specHidden: true,
    secHidden: true,
    memberAvatar: '/static/images/icon/upload.png',
    memberNickname: '',
    cartGoodsSpec1Id: '',
    cartGoodsSpec2Id: '',
    cartGoodsSpec1Name: '',
    cartGoodsSpec2Name:'',
  },
  edit: function (e) {
    //console.log(e.currentTarget.dataset);
    if (e.currentTarget.dataset.value == 0){
    this.setData({
      mhHidden: false,
      hHidden: true,
      hhHidden: false,
      numHidden: true,
    });
    }
  },
  complete: function () {
    this.setData({
      mhHidden: true,
      hHidden: false,
      hhHidden: true,
      numHidden:false,
    });
  },
  onLoad: function (options) {
    openid = wx.getStorageSync('openid');
    token = wx.getStorageSync('token');
    var that = this;
    // 显示加载中
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    // 显示时间
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
    that.get_cart();
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          that.setData({
            wxHidden: true,
          });
          wx.switchTab({
            url: '/pages/member/cart/index'
          })
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
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
              code:res.data.code,
            });
            that.onShow();
          }
          else{
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
  //购物车列表
  get_cart: function (e) {
  var that = this;
  var token = wx.getStorageSync('token');
  var memberId = wx.getStorageSync('memberId');
    // console.log(token)
    if(token != '') {
  //发送请求
  wx.request({
    url: t.globalData.api + 'mall/cart/queryCart?token=' + token, //购物车列表接口地址
    data: {
      cartBuyerId: memberId,//购买者id
      //cartState: 2,//不选中状态
    },
    method: 'POST',
    header: {
      'content-type': 'application/json' //默认值
    },
    // 成功
    success: function (res) {
      console.log(res);
      if (res.data.code == 200){
        var dataList = res.data.data;
        dataList.forEach(function (item, index) {
          var count = 0;
          var total_price = 0;
          var item_length = item.list.length;
          var check_length = 0;
          var check_all = 0;//未全部选中
            item.list.forEach(function(val,key){
              var str = dataList[index].list[key].cartGoodsSpec; 
              var arr = str.split("|");
              var string = dataList[index].list[key].cartGoodsSpecId;
              var array = string.split(",");
              dataList[index].list[key].cartGoodsSpec1Name = arr[0],//规格名称1
              dataList[index].list[key].cartGoodsSpec2Name = arr[1]//规格名称2
              dataList[index].list[key].cartGoodsSpec1Id = array[0],//规格id1
                dataList[index].list[key].cartGoodsSpec2Id = array[1]//规格id2
                if(val.cartState == 1){ //选中
                  count += val.cartNum;
                  total_price += val.cartNum * val.price;//总价
                  check_length = check_length + 1;//选中长度
                }
              if (check_length == item_length){
                check_all = 1;
              }
              dataList[index].count= count,
              dataList[index].total_price= total_price,
              dataList[index].check_all = check_all;
          
              val.specTypeList.forEach(function (v, k) {
                //定义picker的键值
                var spec_key = val.cartId + '_' + val.goodsId + '_' + k;
                dataList[index].list[key][spec_key] = []; //先定义为数组
                v.specList.forEach(function (vk, kv) {
                  dataList[index].list[key].specTypeList[k].specList[kv].cartId = val.cartId;//购物车id
                  dataList[index].list[key].specTypeList[k].specList[kv].cartNum = val.cartNum;//购卖数量
                  dataList[index].list[key].specTypeList[k].specList[kv].cartGoodsNorms = val.cartGoodsNorms;//输入规格
                  dataList[index].list[key].specTypeList[k].specList[kv].goodsName = val.goodsName;
                  dataList[index].list[key].specTypeList[k].specList[kv].mprice = val.mprice;
                  dataList[index].list[key].specTypeList[k].specList[kv].price = val.price;
                  dataList[index].list[key].specTypeList[k].specList[kv].cartState = val.cartState;
                  dataList[index].list[key].specTypeList[k].specList[kv].goodsCateId = val.goodsCateId;

                  //拼接属性数据
                  dataList[index].list[key][spec_key].push({ id: vk.specId, name: vk.specName });
                });
              });
            })
        });
        that.setData({
          dataList: dataList,
        });
      }else{
        wx.showToast({
          title:res.data.message,
          icon: 'none',
          duration: 2000,
        })
      }
      
    },
    // 失败
    fail: function (err) {
      console.log(err);
    }
  })
}
},
/*微信授权登录*/
  modelCancel: function () {
    this.setData({
      mhHidden: true
    });
  },
  //处理changeModel的触发事件
  changeModel: function (e) {
    this.setData({
      mhHidden: true
    });
  },
  //确认订单
    placeOrder: function (e) {
      //dataset内包含data-*的数据
      var token = wx.getStorageSync('token');
      var cartStoreId = e.currentTarget.dataset.cartstoreid;
      var count = e.currentTarget.dataset.count;//购买总数
      console.log(token)
      if (token != '') {
        if (count !=0){
        wx.navigateTo({
          url: '/pages/member/checkbuy/index?token=' + token + '&cartStoreId=' + cartStoreId,
        })
        }else{
          wx.showToast({
            title: '请选中要购买的产品',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    },
  //批量更新购物车被选中状态值
  checkedAll: function (e) {
    var that = this;
    var token = wx.getStorageSync('token'),
      list = e.currentTarget.dataset.list;
   // console.log(token)
    var state = 1;
    //console.log(state)
    // console.log(e.currentTarget.dataset.id)
    // console.log(token)
    //发送请求
    for (var i in list) {
      console.log(list[i].cartId)
      console.log(state)
      console.log(list[i].cartGoodsSpecId)
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
     
      data: {
        cartId: list[i].cartId,//购物车id
        cartNum: list[i].cartNum,//购买数量
        cartGoodsNorms: list[i].cartGoodsNorms,//商品规格
        cartGoodsSpecId: list[i].cartGoodsSpecId,//规格ID
        goodsId: list[i].goodsId,//商品ID
        goodsName: list[i].goodsName,//商品名称
        mprice: list[i].mprice,
        price: list[i].price,
        cartState: state,//选中状态
        goodsCateId: list[i].goodsCateId //产品分类ID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        if(res.data.code == 200){
          that.onLoad()
        }else{
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
    }
  },
  //批量更新购物车是否被选中状态值
  unCheckedAll: function (e) {
    var that = this;
    var token = wx.getStorageSync('token'),
      list = e.currentTarget.dataset.list;
    //console.log(list)
    var state = 2;
    //console.log(state)
    // console.log(e.currentTarget.dataset.id)
    // console.log(token)
    //发送请求
    for (var i in list) {
      // console.log(list[i].cartId)
      // console.log(state)
      // console.log(list[i].cartGoodsSpecId)
      wx.request({
        url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址

        data: {
          cartId: list[i].cartId,//购物车id
          cartNum: list[i].cartNum,//购买数量
          cartGoodsNorms: list[i].cartGoodsNorms,//商品规格
          cartGoodsSpecId: list[i].cartGoodsSpecId,//规格ID
          goodsId: list[i].goodsId,//商品ID
          goodsName: list[i].goodsName,//商品名称
          mprice: list[i].mprice,
          price: list[i].price,
          cartState: state,//选中状态
          goodsCateId: list[i].goodsCateId //产品分类ID
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' //默认值
        },
        // 成功
        success: function (res) {
          //console.log(res);
          if (res.data.code == 200) {
            that.onLoad()
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
            })
          }
        },
        // 失败
        fail: function (err) {
          console.log(err);
        }
      })
    }
  },
  //单个更新购物车是否被选中状态值
  Checks1: function(e){
    var that = this;
    var token = wx.getStorageSync('token'),
      data = e.currentTarget.dataset,
      cartState = data.cartstate;
    if (cartState == 2) {
      var state = 1;
    }
    if (cartState == 1){
      var state = 2;
    }
    // console.log(state)
    // console.log(e.currentTarget.dataset.id)
    // console.log(token)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
      data: {
        cartId: data.cartid,//购物车id
        cartNum: data.cartnum,//购买数量
        cartGoodsNorms: data.cartgoodsnorms,//商品规格
        cartGoodsSpecId: data.cartgoodsspecid,//规格ID
        goodsId: data.goodsid,//商品ID
        goodsName: data.goodsname,//商品名称
        mprice: data.mprice,
        price: data.price,
        cartState: state,//选中状态
        goodsCateId: data.goodscateid //产品分类ID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        if (res.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //单个更新购物车购买数量
  jian: function (e) {
    var that = this;
    var token = wx.getStorageSync('token'),
      data = e.currentTarget.dataset,
      cartnum = data.cartnum;
    if (cartnum > 1){
      //发送请求
      wx.request({
        url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
        data: {
          cartId: data.cartid,//购物车id
          cartNum: cartnum - 1,//购买数量
          cartGoodsNorms: data.cartgoodsnorms,//商品规格
          cartGoodsSpecId: data.cartgoodsspecid,//规格ID
          goodsId: data.goodsid,//商品ID
          goodsName: data.goodsname,//商品名称
          mprice: data.mprice,
          price: data.price,
          cartState: data.cartState,
          goodsCateId: data.goodscateid //产品分类ID
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' //默认值
        },
        // 成功
        success: function (res) {
          //console.log(res);
          if (res.data.code == 200) {
            that.onLoad()
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 2000,
            })
          }
        },
        // 失败
        fail: function (err) {
          console.log(err);
        }
      })
    }else{
      wx.showToast({
        title: '购买数量最少不能低于1',
        icon: 'none',
        duration: 2000,
      })
    }
  },
  //单个更新购物车增加购买数量
  jia: function (e) {
    var that = this;
    var token = wx.getStorageSync('token'),
      data = e.currentTarget.dataset,
      cartnum = data.cartnum;
    // console.log(cartnum)
    // console.log(e.currentTarget.dataset.id)
    // console.log(token)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
      data: {
        cartId: data.cartid,//购物车id
        cartNum: cartnum + 1,//购买数量
        cartGoodsNorms: data.cartgoodsnorms,//商品规格
        cartGoodsSpecId: data.cartgoodsspecid,//规格ID
        goodsId: data.goodsid,//商品ID
        goodsName: data.goodsname,//商品名称
        mprice: data.mprice,
        price: data.price,
        cartState: data.cartState,
        goodsCateId: data.goodscateid //产品分类ID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //单个更新购物车直接输入购买数量
  goodsNum: function (e) {
    var that = this;
    var token = wx.getStorageSync('token'),
      data = e.currentTarget.dataset,
      cartnum = e.detail.value;
    //console.log(cartId)
    //console.log(token)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
      data: {
        cartId: data.cartid,//购物车id
        cartNum: cartnum,//购买数量
        cartGoodsNorms: data.cartgoodsnorms,//商品规格
        cartGoodsSpecId: data.cartgoodsspecid,//规格ID
        goodsId: data.goodsid,//商品ID
        goodsName: data.goodsname,//商品名称
        mprice: data.mprice,
        price: data.price,
        cartState: data.cartState,
        goodsCateId: data.goodscateid //产品分类ID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        if (res.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //更新规格
  cartGoodsNorms: function(e){
    var that = this;
    var token = wx.getStorageSync('token'),
      data = e.currentTarget.dataset,
      cartGoodsNorms = e.detail.value; //获取输入的规格值
    //console.log(cartId)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
      data: {
        cartId: data.cartid,//购物车id
        cartNum: data.cartnum,//购买数量
        cartGoodsNorms: cartGoodsNorms,//商品规格
        cartGoodsSpecId: data.cartgoodsspecid,//规格ID
        goodsId: data.goodsid,//商品ID
        goodsName: data.goodsname,//商品名称
        mprice: data.mprice,
        price: data.price,
        cartState: data.cartState,
        goodsCateId: data.goodscateid //产品分类ID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        if (res.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
  },
  // //更新规格名称
  // bindPickerChange: function (e) {
  //   var key = e.currentTarget.dataset.key;
  //   console.log(key);

  //   var that = this;
  //   // var cartId = e.currentTarget.dataset.cartid; //操作购物车id
  //   // var dataList = that.data.dataList; //购物车列表
  //   // var specList = [];
  //   // for (var i = 0; i < dataList.length; i ++){
  //   //   var list = dataList[i].list;
  //   //   for(var j = 0; j < list.length; j ++){
  //   //     //获取选中的购物车的商品的规格
  //   //     if (cartId == list[j].cartId){
  //   //       var specTypeList = list[j].specTypeList;
  //   //       //判断商品规格不为空
  //   //       if (specTypeList != undefined && specTypeList.length > 0){
  //   //         var spec_list = specTypeList[0].specList;
  //   //         for (var s = 0; s < spec_list.length; s ++){
  //   //           specList += [{ 'goodsName': spec_list[s].goodsName, 'specId': spec_list[s].specId}]
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   // }
  //   console.log(e.detail.value)
  //   that.setData({
  //     index: e.detail.value, //选中的值
  //     specHidden: false,
  //     // cartGoodsSpec2Id: e.currentTarget.dataset.specid,
  //     // cartGoodsSpec2Name: e.currentTarget.dataset.specname,
  //   })
  // },
  // //关闭
  // closespec: function (e) {
  //   var that = this;
  //   that.setData({
  //     specHidden: true,
  //   })
  // },
  //更新规格名称
  bindPickerChange: function (e) {
    var spec_key = e.currentTarget.dataset.key; //获取拼接的picker键值
    var cartId = e.currentTarget.dataset.cartid; //购物车id
    var specTypeIndex = e.currentTarget.dataset.index; //规格类型键值
    console.log(e.detail.value);
    console.log(spec_key);
    console.log(cartId);
    var that = this;
    var dataList = that.data.dataList; //获取购物车列表数据
    var paramsData = {}; //声明paramsData
    var cartNum = '',
        cartGoodsNorms = '',
        goodsId = '',
        goodsName = '',
        mprice = '',
        price = '',
        cartState = '',
        goodsCateId = '',
        cartGoodsSpec1Id = '',
        cartGoodsSpec1Name = '',
        cartGoodsSpec2Id = '',
        cartGoodsSpec2Name = '';
    dataList.forEach(function(item,index){ //店铺
      item.list.forEach(function (value,key){ //商品
        if (cartId == value.cartId){
          cartNum = value.cartNum; //数量
          cartGoodsNorms = value.cartGoodsNorms; //规格长度
          goodsId = value.goodsId;
          goodsName = value.goodsName;
          mprice = value.mprice;
          price = value.price;
          cartState = value.cartState;
          goodsCateId = value.goodsCateId;
          value[spec_key].forEach(function(val,k){ //选择的规格
            if (e.detail.value == k){
              //判断当前操作的键值为第一个属性
              if (specTypeIndex == 0){
                cartGoodsSpec1Id = val.id; //获取到操作的第一个属性id
                cartGoodsSpec1Name = val.name; //获取到操作的第一个属性值
                //判断如果有默认两个属性属性
                if (cartGoodsSpec2Id != undefined){
                  cartGoodsSpec2Id = value.cartGoodsSpec2Id; //原有的值
                  cartGoodsSpec2Name = value.cartGoodsSpec2Name; //原有的值
                }
              }else{
                cartGoodsSpec1Id = value.cartGoodsSpec1Id; //原有的值
                cartGoodsSpec1Name = value.cartGoodsSpec1Name; //原有的值
                cartGoodsSpec2Id = val.id; //获取到操作的第二个属性id
                cartGoodsSpec2Name = val.name; //获取到操作的第二个属性值
              }
            }
          })
        }
      })
    })
    paramsData = {
      cartId: cartId,//购物车id
      cartNum: cartNum,//购买数量
      cartGoodsNorms: cartGoodsNorms,//商品规格
      cartGoodsSpec: cartGoodsSpec1Name + '|' + cartGoodsSpec2Name,//规格名称
      cartGoodsSpecId: cartGoodsSpec1Id + ',' + cartGoodsSpec2Id,//规格ID
      goodsId: goodsId,//商品ID
      goodsName: goodsName,//商品名称
      mprice: mprice,
      price: price,
      cartState: cartState,
      goodsCateId: goodsCateId //产品分类ID
    }
    console.log(paramsData);
    var token = wx.getStorageSync('token');
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
      data: paramsData,
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
    this.setData({
      specHidden: true
    });
  },
  //更新规格名称2
  bindChange: function (e) {
    var that = this;
    that.setData({
      secHidden: false,
      cartGoodsSpec1Id: e.currentTarget.dataset.specid,
      cartGoodsSpec1Name: e.currentTarget.dataset.specname,
    })
  },
  //关闭
  closespecc: function (e) {
    var that = this;
    that.setData({
      secHidden: true,
    })
  },
  selectSec: function (e) {
    var that = this;
    var token = wx.getStorageSync('token'),
      data = e.currentTarget.dataset;
    var cartGoodsSpec1Id = that.data.cartGoodsSpec1Id;
    var cartGoodsSpec2Id = data.cartgoodsspec2id; 
    var cartGoodsSpecId = cartGoodsSpec1Id + ',' + cartGoodsSpec2Id;
    var cartGoodsSpec1Name = that.data.cartGoodsSpec1Name;
    var cartGoodsSpec2Name = data.cartgoodsspec2name;
    var cartGoodsSpec = cartGoodsSpec1Name + '|' + cartGoodsSpec2Name;
    //console.log(cartId)
    //console.log(token)
    //发送请求
    wx.request({
      url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
      data: {
        cartId: data.cartid,//购物车id
        cartNum: data.cartnum,//购买数量
        cartGoodsNorms: data.cartgoodsnorms,//商品规格
        cartGoodsSpec: cartGoodsSpec,//规格名称
        cartGoodsSpecId: cartGoodsSpecId,//规格ID
        goodsId: data.goodsid,//商品ID
        goodsName: data.goodsname,//商品名称
        mprice: data.mprice,
        price: data.price,
        cartState: data.cartState,
        goodsCateId: data.goodscateid //产品分类ID
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' //默认值
      },
      // 成功
      success: function (res) {
        //console.log(res);
        if (res.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      // 失败
      fail: function (err) {
        console.log(err);
      }
    })
    this.setData({
      secHidden: true
    });
  },
  //批量选中删除
  selectAll: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    var state = 1; //选中状态
    var dataList = that.data.dataList; //获取购物车列表
    dataList.forEach(function(item,index){ //店铺
      item.list.forEach(function(value,key){ //商品列表
        wx.request({
          url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
          data: {
            cartId: value.cartId,//购物车id
            cartNum: value.cartNum,//购买数量
            cartGoodsNorms: value.cartGoodsNorms,//商品规格
            cartGoodsSpecId: value.cartGoodsSpecId,//规格ID
            goodsId: value.goodsId,//商品ID
            goodsName: value.goodsName,//商品名称
            mprice: value.mprice,
            price: value.price,
            cartState: state,//选中状态
            goodsCateId: value.goodsCateId //产品分类ID
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' //默认值
          },
          // 成功
          success: function (res) {
            //console.log(res);
            if (res.data.code == 200) {
              that.onLoad()
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          // 失败
          fail: function (err) {
            console.log(err);
          }
        })
      })
    })
  },
  //批量非选中删除
  unSelectAll: function (e) {
    var that = this;
    var token = wx.getStorageSync('token');
    console.log(token)
    var state = 2; //选中状态
    var dataList = that.data.dataList; //获取购物车列表
    dataList.forEach(function (item, index) { //店铺
      item.list.forEach(function (value, key) { //商品列表
        wx.request({
          url: t.globalData.api + 'mall/cart/updateCart?token=' + token, //更新选中的购物车产品接口地址
          data: {
            cartId: value.cartId,//购物车id
            cartNum: value.cartNum,//购买数量
            cartGoodsNorms: value.cartGoodsNorms,//商品规格
            cartGoodsSpecId: value.cartGoodsSpecId,//规格ID
            goodsId: value.goodsId,//商品ID
            goodsName: value.goodsName,//商品名称
            mprice: value.mprice,
            price: value.price,
            cartState: state,//不选中状态
            goodsCateId: value.goodsCateId //产品分类ID
          },
          method: 'POST',
          header: {
            'content-type': 'application/json' //默认值
          },
          // 成功
          success: function (res) {
            //console.log(res);
            if (res.data.code == 200) {
              that.onLoad()
            } else {
              wx.showToast({
                title: res.data.message,
                icon: 'none',
                duration: 2000,
              })
            }
          },
          // 失败
          fail: function (err) {
            console.log(err);
          }
        })
      })
    })
  },
  //删除选中的购物车产品
  deleteSelect: function (e) {
  var that = this;
  var token = wx.getStorageSync('token'),
    dataList = e.currentTarget.dataset.datalist;
  var state = 1;
    //发送请求
    var cartId = '';
    dataList.forEach(function (item, index) {
      item.list.forEach(function (val, key) {
        if (val.cartState == 1) {
          cartId += val.cartId + ','
        }
      })
    })
    var cartIds = cartId.substring(0, cartId.lastIndexOf(','));
    console.log(cartIds)
    //判断选择的商品不为空
    if (cartIds != ''){
      wx.showModal({
        title: '提示',
        content: '确定要删除选中的商品吗？',
        success: function (sm) {
          if (sm.confirm) {
            // 用户点击了确定 可以调用删除方法了

            wx.request({
              url: t.globalData.api + 'mall/cart/deleteCart?token=' + token + '&cartId=' + cartIds, //删除选中的购物车产品接口地址
              data: {
                cartId: cartIds,//购物车id
              },
              method: 'POST',
              header: {
                'content-type': 'application/json' //默认值
              },
              // 成功
              success: function (res) {
                //console.log(res);
                if (res.data.code == 200) {
                  that.onLoad()
                } else {
                  wx.showToast({
                    title: res.data.message,
                    icon: 'none',
                    duration: 2000,
                  })
                }
              },
              // 失败
              fail: function (err) {
                console.log(err);
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showToast({
        title: '请选择需要删除的商品',
        icon: 'none',
        duration: 2000
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