// pages/book/book.js
var Bmob = require('../../utils/bmob.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotels: [],
    rooms: [],
    curNavId: '',
    curIndex: 0
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
          curNavId: results[0].id
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
    var Room = Bmob.Object.extend("Room");
    // query.equalTo("hotel", this.data.curNav);
    query = new Bmob.Query(Room);
    // 查询所有数据
    query.find({
      success: function (results) {
        console.log(results)
        that.setData({
          rooms: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
  },

  //事件处理函数
  switchRightTab: function (e) {
    let id = e.target.dataset.id,
    index = parseInt(e.target.dataset.index);
    this.setData({
      curNavId: id,
      curIndex: index
    })
  },

  // 跳转订房详情
  go_roomdetail: function (e) {
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: 'room/room?id=' + id,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})