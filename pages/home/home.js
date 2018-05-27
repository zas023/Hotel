// pages/home/home.js
var Bmob = require('../../utils/bmob.js');
Page({

  data: {
    hotels: [],
    rooms: []
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
          hotels: results,
        })
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