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
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    specTypeList: [],//商品规格属性列表
    specName: '',
    specWeight: '',
    goodsId: '',
    storeId: '',
    goodsNum: 1,
    cartGoodsNorms: '',//输入规格
    goodsImages: '',
    goodsName: '',
    goodsCateId: '',//分类ID
    goodsSpecId: '',//规格ID
    check_num:0,
    active:0,
    new_specNames: '',
    new_specIds:'',
    new_specNameTexts:'',
    sdGoodsMarketPrice: '',
    sdGoodsStorage: '',
    sdGoodsSellPrice: '',
    sdGoodsStorage: '',
    check_num: '',
    specId: '',
    goodsPrice: '',
    status: 0 ,//促销政策
    storePromote:[],
    storeNorm: [],
    mHidden: true,
    height: '120rpx',
    gaodu: '120rpx',
    mmHidden: true,
    mhHidden: true,
    hhHidden: true,
    memberAvatar: '/static/images/icon/upload.png',
    memberNickname: '',
    code: '',//token验证返回状态码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var storeId = options.storeId;
    var goodsId = options.goodsId;
    var that = this;
    //显示加载框
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    //请求店铺和产品详情
    wx.request({
      url: t.globalData.api + 'mall/api/store/detail?storeId=' + storeId,//请求服务器店铺详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res);
        if(res.data.code == 200){
          var arr = [];
          if (res.data.data.storePromote != undefined){
            var str = res.data.data.storePromote;
            arr = str.split(",");
            if (res.data.data.storePromote.length > 80) {
              that.setData({
                mhHidden: false
              });
            }
          }
          if (res.data.data.storeIntroduce != undefined){
            if (res.data.data.storeIntroduce.length > 80) {
              that.setData({
                mHidden: false,
                //mhHidden: false
              });
            }
          }
          
          // 传递数据给ui详情页显示
          that.setData({
            address: res.data.data.address,
            area: res.data.data.area,
            contactsName: res.data.data.contactsName,
            contactsPhone: res.data.data.contactsPhone,
            storeBrand: res.data.data.storeBrand,
            storeIntroduce: res.data.data.storeIntroduce,
            storeLogo: res.data.data.storeLogo,
            storeBanner: res.data.data.storeBanner,
            storeName: res.data.data.storeName,
            storeId: storeId,
            storePromote: arr,
          });

          //请求商品详情
          wx.request({
            url: t.globalData.api + 'mall/api/goods/storeIdDetail?storeId=' + storeId,//请求服务器产品详情接口
            data: {},
            method: 'GET',
            // header: {},   
            success: function (res) {
              wx.hideLoading(); //隐藏弹框
              console.log(res);
              if(res.data.code == 200){
                // 传递数据
                that.setData({
                  specTypeList: res.data.data.specTypeList,
                  goodsImages: res.data.data.goodsDefaultImage,
                  goodsName: res.data.data.goodsName,
                  goodsPrice: res.data.data.goodsPrice,
                  //goodsStorage: res.data.data.goodsStorage,
                  unit: res.data.data.unit,
                  goodsId: goodsId,
                  goodsCateId: res.data.data.goodsCateId
                });
              }else{
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000,
                })
              }
            }
          });
        }else{
          wx.hideLoading(); //隐藏弹框
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    });
  },
  //展开
  open: function(e){
    var that = this;
    var height = e.currentTarget.dataset.height;
    that.setData({
      height: height,
      mHidden: true,
      mmHidden:false,
    })
  },
  opening: function (e) {
    var that = this;
    var gaodu = e.currentTarget.dataset.gaodu;
    that.setData({
      gaodu: gaodu,
      mhHidden: true,
      hhHidden: false,
    })
  },
  //关闭
  close: function (e) {
    var that = this;
    var height = e.currentTarget.dataset.height;
    that.setData({
      height: height,
      mHidden: false,
      mmHidden:true,
    })
  },
  closeing: function (e) {
    var that = this;
    var gaodu = e.currentTarget.dataset.gaodu;
    that.setData({
      gaodu: gaodu,
      mhHidden: false,
      hhHidden: true,
    })
  },
  //促销政策
  storePromote: function(e){
    var that = this;
    var status = e.currentTarget.dataset.status;
    var storeId = this.data.storeId;
    wx.request({
      url: t.globalData.api + 'mall/api/store/detail?storeId=' + storeId,//请求服务器店铺详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        var arr = [];
        var str = res.data.data.storePromote;
        if(str != undefined){
          var arr = str.split(",");
        }
        // 传递数据给ui详情页显示
        that.setData({
          storePromote: arr,
          status: status,
          mhHidden: false,
        });
      }
    })
  },
  //质量指标
  storeNorm: function (e) {
    var that = this;
    var status = e.currentTarget.dataset.status;
    var storeId = this.data.storeId;
    //console.log(status)
    console.log(storeId)
    wx.request({
      url: t.globalData.api + 'mall/api/store/detail?storeId=' + storeId,//请求服务器店铺详情接口
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        //console.log(res)
        var arr = [];
        var str = res.data.data.storeNorm;
        if(str != undefined){
          var arr = str.split(",");
          console.log(arr)
        }
        // 传递数据给ui详情页显示
        that.setData({
          storeNorm: arr,
          status: status,
          mhHidden: true,
        });
      }
    })
  },
  //输入规格
  cartGoodsNorms: function(e){
    var that = this;
    var cartGoodsNorms = e.detail.value;
    console.log(cartGoodsNorms)
    that.setData({
      cartGoodsNorms: cartGoodsNorms,
    })
 },
  //单个更新购买数量
  jian: function (e) {
    var that = this;
    var goodsNum = e.currentTarget.dataset.goodsnum;
    console.log(goodsNum)
    if (goodsNum > 1) {
      that.setData({
        goodsNum: goodsNum - 1,
      })
    } else {
      wx.showToast({
        title: '购买数量最少不能低于1',
        icon: 'none',
        duration: 2000,
      })
    }
  },
  //单个更新增加购买数量
  jia: function (e) {
    var that = this;
    var goodsNum = e.currentTarget.dataset.goodsnum;
    that.setData({
      goodsNum: goodsNum + 1,
    })
    console.log(goodsNum)
  },
  //输入购买数量
  inputGoodsNum: function (e) {
    var that = this;
    var goodsNum = e.detail.value;
    that.setData({
      goodsNum: goodsNum,
    })
  },
  //选中名称
  select: function(e){
    var specId = e.currentTarget.dataset.specid;//选中是属性id
    var specTypeList = this.data.specTypeList;
    var that = this;
    var click_spec = e.currentTarget.dataset.specid; //当前选中的值
    var check_num = 0;//选中的数量
    var specIds = ''; //声明拼接属性ids
    var specNames = '';//声明拼接属性names
    var specNameTexts = '';//声明拼接属性NameTexts
    
    specTypeList.forEach(function(item,index){ //循环处理属性列表
      var selectTarget = null;
      item.specList.forEach(function (val, key) { //循环处理属性值列表
        if (click_spec == val.specId){
          specTypeList[index].active = 1; //该规格被选中
          val.select = 1; //该值被选中
          val.current = true; //选中的对象
          selectTarget = index; //选中的对象
        }else{
          val.current = false; //非当前选中对象
        }
        console.log('selectTarget:' + selectTarget)
        if(selectTarget != null){
          specTypeList[selectTarget]['specList'].forEach((function(v,k){
            if(v.current != true){
              specTypeList[selectTarget]['specList'][k].select = 0; //设该值被选中
            }
          }))
        }
        //重新赋值
        specTypeList[index]['specList'][key] = val; 
      })
    });
    
    specTypeList.forEach(function (item, index) { //循环处理属性列表
      //循环找到选中的值
      if (item.active == 1) {
        check_num = check_num + 1;
        item.specList.forEach(function (val, key) {
          if (val.select == 1) {
            specIds = specIds + val.specId + ',';
            specNames = specNames + val.specName + ' ';
            specNameTexts = specNameTexts + val.specName + '|';
          }
        });
      }
    });
    //console.log(specIds);
    // console.log(specNames);
    var new_specIds = specIds.substring(0, specIds.lastIndexOf(','));
    var new_specNames = specNames.substring(0, specNames.lastIndexOf(' '));
    var new_specNameTexts = specNameTexts.substring(0, specNameTexts.lastIndexOf('|'));
    var arr = new_specIds.split(',');
    console.log('属性：' + arr)
      if (arr[1] != undefined){ //如果规格属性有两个
        var url = t.globalData.api + 'mall/api/goods/specData?goodsId=' + this.data.goodsId + '&spec1Id=' + arr[0] + '&spec2Id=' + arr[1];
      } else { //规格属性只有一个
        var url = t.globalData.api + 'mall/api/goods/specData?goodsId=' + this.data.goodsId + '&spec1Id=' + arr[0];
      }
      if (check_num == specTypeList.length){
      wx.request({
        url: url,
        data: {},
        method: 'get',//定义传到后台接受的是post方法还是get方法
        header: {
          'content-type': 'application/json' // 默认值
        },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200){
        that.setData({
          sdGoodsMarketPrice: res.data.data.sdGoodsMarketPrice,
          goodsPrice: res.data.data.sdGoodsSellPrice,
          sdGoodsStorage: res.data.data.sdGoodsStorage,
          new_specNames: new_specNames,
          new_specIds: new_specIds,
          new_specNameTexts: new_specNameTexts,
          check_num: check_num,
        })
        }else{
          //商品无库存显示不选中状态
          specTypeList.forEach(function (item, index) { //循环处理属性列表
            item.specList.forEach(function (val, key) { //循环处理属性值列表
              if (click_spec == val.specId) {
                specTypeList[index].active = 0; //该规格被选中
                val.select = 0; //该值被选中
                val.current = false; //选中的对象
              }
            });
          });
          //弹框提示显示报错异常
          wx.showToast({
            title: res.data.message, 
            icon: 'none',
            duration: 2000,
          });
          that.setData({
            sdGoodsMarketPrice: '',
            sdGoodsSellPrice: '',
            sdGoodsStorage: '', //对应属性规格
            new_specNames:'', //已选属性
            new_specIds: '', //已选属性ids
            new_specNameTexts: '',//已选属性NameTexts
            check_num:0,
            specTypeList: specTypeList
          })
          //  that.onLoad()
        }
      },
      fail: function (res) {
          console.log("调用API失败");
        }
    })
    }
    that.setData({
      specTypeList: specTypeList,
      specId: specId,
    })
    console.log(specTypeList)
  },
  //提交购物车
  addcart: function (e) {
    var that = this;
    openid = wx.getStorageSync('openid');
    token = wx.getStorageSync('token');
    var memberId = wx.getStorageSync('memberId');
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          if (that.data.new_specNameTexts == '') {
            wx.showToast({
              title: '请选择产品属性',
              icon: 'none',
              duration: 1000
            })
            return false;
          }
          if (that.data.goodsCateId == 1) {
            if (that.data.cartGoodsNorms == '') {
              wx.showToast({
                title: '请输入规格',
                icon: 'none',
                duration: 1000
              })
              return false;
            }
          }
          if (that.data.check_num != that.data.specTypeList.length) {
            wx.showToast({
              title: '请选择产品属性',
              icon: 'none',
              duration: 2000,
            })
            return false;
          } else {
            var url = t.globalData.api + 'mall/cart/addCart?token=' + token;
            wx.request({
              //请求服务器加入购物车接口
              url: url,
              //定义传到后台的数据
              data: {
                //从全局变量data中获取数据
                cartBuyerId: memberId,//购买者id
                cartGoodsId: that.data.goodsId,//购物车商品id
                cartGoodsNorms: that.data.cartGoodsNorms,//填入的规格
                cartGoodsSpec: that.data.new_specNameTexts,//规格
                cartGoodsSpecId: that.data.new_specIds,//规格 id
                cartNum: that.data.goodsNum,//商品数量 
                cartState: 1,// 选中状态 1-选中 2-未选中或不可选 ,
                cartStoreId: that.data.storeId,//店铺Id 
                goodsImage: that.data.goodsImages,//商品图片
                goodsName: that.data.goodsName,//商品名称
                isHot: 0, //是否热销
                goodsCateId: that.data.goodsCateId
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
                    title: '您选择的属性产品库存不足',
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
          that.setData({
            wxHidden: true,
          });
        } else {
          that.setData({
            wxHidden: false,
          });
        }
      }
    })
  },
  //立即下单
  buy: function (e) {
    var that = this;
    openid = wx.getStorageSync('openid');
    token = wx.getStorageSync('token');
    var memberId = wx.getStorageSync('memberId');
    //判断token是否失效
    wx.request({
      url: t.globalData.api + 'login/member/getMemberInfo?token=' + token,
      data: {},
      method: 'GET',
      // header: {},   
      success: function (res) {
        console.log(res.data.code)
        if (token != '' && res.data.code != 401) {
          if (that.data.new_specNameTexts == '') {
            wx.showToast({
              title: '请选择产品属性',
              icon: 'none',
              duration: 1000
            })
            return false;
          }
          if (that.data.goodsCateId == 1) {
            if (that.data.cartGoodsNorms == '') {
              wx.showToast({
                title: '请输入规格',
                icon: 'none',
                duration: 1000
              })
              return false;
            }
          }
          if (that.data.check_num == that.data.specTypeList.length) {
            var url = t.globalData.api + 'mall/cart/orderImmediately?token=' + token;
            var goodsCateId = that.data.goodsCateId;
            var cartGoodVo = {
              cartGoodsNorms: that.data.cartGoodsNorms,//填入的规格
              cartGoodsSpec: that.data.new_specNameTexts,//规格
              cartGoodsSpecId: that.data.new_specIds,//规格 id
              cartNum: that.data.goodsNum,//商品数量 
              cartState: 1,//选中
              goodsDefaultImage: that.data.goodsImages,//商品图片
              goodsId: that.data.goodsId,//商品id
              goodsName: that.data.goodsName,//商品名称
              goodsCateId: that.data.goodsCateId,//产品分类ID
              //isHot: 0, //是否热销
            };
            wx.request({
              //请求服务器加入购物车接口
              url: url,
              //定义传到后台的数据
              data: {
                //从全局变量data中获取数据
                cartBuyerId: memberId,//购买者id
                cartStoreId: that.data.storeId,//店铺Id 
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
                    title: '您选择的属性产品库存不足',
                    icon: 'none',
                    duration: 2000,
                  })
                }
              },
              fail: function (res) {
                console.log("调用API失败");
              }
            })
          } else {
            wx.showToast({
              title: '请选择产品属性',
              icon: 'none',
              duration: 2000,
            })
          }
          that.setData({
            wxHidden: true,
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