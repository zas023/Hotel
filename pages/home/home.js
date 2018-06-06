// pages/home/home.js
var Bmob = require('../../utils/bmob.js');
Page({

  data: {
    hotels: [],
    rooms: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var Hotel = Bmob.Object.extend("Hotel");
    var query = new Bmob.Query(Hotel);
    // 查询所有数据
    query.find({
      success: function (results) {
        that.setData({
          hotels: results
        })
        if(results.length>0){
          that.setData({
            markers: [{
              iconPath: "../../../images/map.png",
              id: 0,
              latitude: results[0].get("latitude"),
              longitude: results[0].get("longitude"),
              title: results[0].name,
              width: 30,
              height: 30
            }]
          })
        }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    var Room = Bmob.Object.extend("Room");
    query = new Bmob.Query(Room);
    // 查询所有数据
    query.find({
      success: function (results) {
        that.setData({
          rooms: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },

  // 跳转预订页面
  go_book: function (e) {
    wx.switchTab({
      url: '../book/book'
    })
  },

  // 跳转订房详情
  go_roomdetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../book/room/room?id=' + id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})