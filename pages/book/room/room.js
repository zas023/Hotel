// pages/book/roomdetail/room.js
var app = getApp();
var Bmob = require('../../../utils/bmob.js');
var openid, stat, b, c, d, stime, etime, snum, msg;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: '',
    date: '',
    date1: '',
    array: [],
    index: 0,
    totalPrice: "",
    showView: true,
    showMine: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Room = Bmob.Object.extend("Room");
    var query = new Bmob.Query(Room);
    query.get(options.id, {
      success: function (result) {
        var n = result.get("left_num");
        // 查询成功
        that.setData({
          room: result,
          array: Array.from({ length: n }, (v, k) => k + 1),
        })
      },
      error: function (object, error) {
        // 查询失败
      }
    });
    // 显示隐藏
    showView: (options.showView == "true" ? true : false)
    showMine: (options.showMine == "false" ? false : true)
  },

  // 改变表单状态
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  // 改变按钮状态
  changeMine: function () {
    var that = this;
    that.setData({
      showMine: (!that.data.showMine)
    })
    that.onChangeShowState()
  },
  // 改变日期
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date1: e.detail.value
    })
  },
  // 改变数量
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  // 底部弹窗
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 提交预订信息
  formSubmit: function (e) {
    var that = this;
    var a = e.detail.value;
    var userId = Bmob.User.current().id;

    if (that.data.room == '' && userId==null){
      return;
    }

    // 计算天数差
    var date1 = a.kdate;
    var date2 = a.jdate;
    var Num = a.num;
    var aDate, oDate1, oDate2, iDays
    aDate = date1.split("-")
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
    aDate = date2.split("-")
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
    // return iDays 
    console.log(iDays);
    var totalNum = iDays * Num;
    // 总价钱
    var total = totalNum * that.data.room.get("price");
    that.setData({
      totalPrice: total
    })
    if (a.name != "" && a.phone != "" && totalNum > 0) {
      var Order = Bmob.Object.extend("Order");
      var order = new Order();
      order.set("userId", userId);
      order.set("room_num", a.num);
      order.set("day_num", iDays);
      order.set("name", a.name);
      order.set("phone", a.phone);
      order.set("startdate", that.strToData(a.kdate));
      order.set("enddate", that.strToData(a.jdate));
      order.set("room", that.data.room);
      order.set("price", total);
      order.set("status","待支付");
      order.save(null, {
        success: function (result) {
          console.log("创建成功, objectId:" + result.id);
          wx.showToast({
            title: "预约成功",
            icon: 'success',
            duration: 1000,
            mask: true
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../mine/mine'
            })
          }, 2000)
        },
        error: function (result, error) {
          console.log(error)
          // 添加失败
          wx.showToast({
            title: '提交失败',
            icon: 'loading',
            duration: 2000,
            mask: true
          })
        }
      });

      //   wx.request({
      //     url: con.set_order,
      //     data: {
      //       wxappid: con.wyy_user_wxappid,
      //       // preid: id,
      //       name: a.name,
      //       openid: app.globalData.openid,
      //       phone: a.phone,
      //       startdate: a.kdate,
      //       enddate: a.jdate,
      //       roomnum: a.num,
      //       roomname: b,
      //       price: c,
      //       id: d
      //     },
      //     method: 'POST',
      //     header: {
      //       "Content-Type": "application/x-www-form-urlencoded"
      //     },
      //     success(res) {
      //       var zhifu = res.data;
      //       console.log(res.data);
      //       stat = res.data.status;
      //       msg = res.data.errMsg;
      //       console.log(msg)
      //       // 计算天数差
      //       var date1 = a.kdate;
      //       var date2 = a.jdate;
      //       var Num = a.num;
      //       var aDate, oDate1, oDate2, iDays
      //       aDate = date1.split("-")
      //       oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
      //       aDate = date2.split("-")
      //       oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
      //       iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
      //       // return iDays 
      //       console.log(iDays);
      //       var totalNum = iDays * Num;
      //       console.log(totalNum)
      //       // 总价钱
      //       var totalPrice = totalNum * c;
      //       console.log(totalPrice)
      //       that.setData({
      //         totalPrice: totalPrice
      //       })
      //       if (stat == 1) {
      //         // 调用支付
      //         wx.requestPayment({
      //           'timeStamp': zhifu.timeStamp,
      //           'nonceStr': zhifu.nonceStr,
      //           'package': zhifu.package,
      //           'signType': zhifu.signType,
      //           'paySign': zhifu.paySign,
      //           'success': function (res1) {
      //             console.log(zhifu.out_trade_no)
      //             console.log(res1)
      //             if (res1.errMsg == "requestPayment:ok") {
      //               console.log(con.wyy_user_wxappid)
      //               wx.request({
      //                 url: con.order_success,
      //                 data: {
      //                   wxappid: con.wyy_user_wxappid,
      //                   out_trade_no: zhifu.out_trade_no,
      //                   id: d,
      //                   orderNum: a.num
      //                 },
      //                 method: 'GET',
      //                 header: {
      //                   "Content-Type": 'application/json'
      //                 },
      //                 success: function (res1) {
      //                   console.log(zhifu.out_trade_no)
      //                   console.log(res1)
      //                   that.setData({

      //                   })
      //                   console.log(res1.data);
      //                   if (res1.data.status == 1) {
      //                     wx.showToast({
      //                       title: res1.data.errMsg,
      //                       icon: 'success',
      //                       duration: 1000,
      //                       mask: true
      //                     })
      //                     setTimeout(function () {
      //                       wx.switchTab({
      //                         url: '../../../mine/mine'
      //                       })
      //                     }, 2000)
      //                   } else {
      //                     wx.showToast({
      //                       title: '支付失败',
      //                       icon: 'loading',
      //                       duration: 2000,
      //                       mask: true
      //                     })
      //                   }
      //                 }
      //               });
      //             } else {
      //               wx.showToast({
      //                 title: '支付失败',
      //                 icon: 'loading',
      //                 duration: 2000,
      //                 mask: true
      //               })
      //             }

      //           },
      //           'fail': function (res) {
      //             console.log(res)
      //             wx.showToast({
      //               title: '支付失败',
      //               icon: 'loading',
      //               duration: 1000,
      //               mask: true
      //             })
      //           },
      //           'complete': function (res) {

      //           }
      //         })
      //       }

      //       else {
      //         wx.showToast({
      //           title: msg,
      //           icon: 'loading',
      //           duration: 2000,
      //           mask: true
      //         })
      //       }
      //     }
      //   })
      //   that.showModal();
      // } else {
      //   wx.showToast({
      //     title: '提交失败，您的信息不全或房间数超出！',
      //     icon: 'loading',
      //     duration: 2000,
      //     mask: true
      //   })
    } else {
      wx.showToast({
        title: '您的信息不正确',
        icon: 'loading',
        duration: 2000,
        mask: true
      })
    }
  },

  strToData: function(dateString) { 
    if(dateString) {
      var arr1 = dateString.split(" ");
      var sdate = arr1[0].split('-');
      var date = new Date(sdate[0], sdate[1] - 1, sdate[2]);
      return date;
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})