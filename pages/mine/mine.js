// pages/mine/mine.js
const app = getApp();
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    curUser: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    //是否有用户信息
    var info = wx.getStorageSync('userInfo');
    if (info) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }

    //用当前用户判断是否已经登陆
    var currentUser = Bmob.User.current();
    //已经登陆则直接跳转
    if (currentUser) {
      that.setData({
        curUser:currentUser
      })
      return;
    }else{
      that.signupAndLogin();
    }
    
  },

  //微信一键登陆注册
  signupAndLogin:function(){
    wx.login({
      success: function (res) {
        if (res.code) {
          Bmob.User.requestOpenId(res.code, {
            success: function (userData) {
              wx.getUserInfo({
                success: function (result) {
                  var userInfo = result.userInfo
                  var nickName = userInfo.nickName
                  var openId = userData.openid;

                  var User = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(User);
                  query.limit(1);
                  query.equalTo("openId", openId);
                  query.find({
                    success: function (results) {
                      if (results.length == 1) { //登陆
                        Bmob.User.logIn(results[0].get("username"), query._where.openId, {
                          success: function (res) {
                            that.setData({
                              curUser: res
                            })
                          },
                          error: function (user, error) {
                            // The login failed. Check error to see why.
                          }
                        });
                      } else { //注册
                        var user = new Bmob.User();
                        user.set("username", nickName);
                        user.set("password", query._where.openId);
                        user.set("openId", query._where.openId);
                        user.set("userData", userData);
                        user.set("score", 10);
                        user.signUp(null, {
                          success: function (res) {
                            console.log("注册成功!");
                          },
                          error: function (userData, error) {
                            console.log(error)
                          }
                        });
                      }
                    },
                    error: function (error) {
                      console.log("查询失败: " + error.code + " " + error.message);
                    }
                  });
                }
              })
            },
            error: function (error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
            }
          });

        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
  }

})