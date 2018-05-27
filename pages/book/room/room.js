// pages/book/roomdetail/room.js
var app = getApp();
var Bmob = require('../../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room: '',
    date: '2018-05-27',
    date1: '2018-05-28',
    array: [1, 2, 3, 4, 5, 6, 7, 8],
    index: 0,
    openid: "",
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
        // 查询成功，调用get方法获取对应属性的值
        console.log(result)
        that.setData({
          room: result
        })
      },
      error: function (object, error) {
        // 查询失败
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})