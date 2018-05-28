// pages/authorize/authorize.js
const app = getApp();
var Bmob = require('../../utils/bmob.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindGetUserInfo: function (e) {
    if (!e.detail.userInfo) {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    this.signupAndLogin();
  },

  //微信一键登陆注册
  signupAndLogin: function () {
    var that = this;
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
                            //登陆成功
                            wx.navigateBack();
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
                            wx.navigateBack();
                          },
                          error: function (userData, error) {
                            console.log(error)
                            //登录错误
                            wx.hideLoading();
                            wx.showModal({
                              title: '提示',
                              content: '无法登录，请重试',
                              showCancel: false
                            })
                            return;
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
  },

  // login: function () {
  //   let that = this;
  //   let token = wx.getStorageSync('token');
  //   if (token) {
  //     wx.request({
  //       url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/check-token',
  //       data: {
  //         token: token
  //       },
  //       success: function (res) {
  //         if (res.data.code != 0) {
  //           wx.removeStorageSync('token')
  //           that.login();
  //         } else {
  //           // 回到原来的地方放
  //           wx.navigateBack();
  //         }
  //       }
  //     })
  //     return;
  //   }
  //   wx.login({
  //     success: function (res) {
  //       wx.request({
  //         url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/login',
  //         data: {
  //           code: res.code
  //         },
  //         success: function (res) {
  //           if (res.data.code == 10000) {
  //             // 去注册
  //             that.registerUser();
  //             return;
  //           }
  //           if (res.data.code != 0) {
  //             // 登录错误
  //             wx.hideLoading();
  //             wx.showModal({
  //               title: '提示',
  //               content: '无法登录，请重试',
  //               showCancel: false
  //             })
  //             return;
  //           }
  //           wx.setStorageSync('token', res.data.data.token)
  //           wx.setStorageSync('uid', res.data.data.uid)
  //           // 回到原来的地方放
  //           wx.navigateBack();
  //         }
  //       })
  //     }
  //   })
  // },

  // registerUser: function () {
  //   var that = this;
  //   wx.login({
  //     success: function (res) {
  //       var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
  //       wx.getUserInfo({
  //         success: function (res) {
  //           var iv = res.iv;
  //           var encryptedData = res.encryptedData;
  //           // 下面开始调用注册接口
  //           wx.request({
  //             url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/wxapp/register/complex',
  //             data: { code: code, encryptedData: encryptedData, iv: iv }, // 设置请求的 参数
  //             success: (res) => {
  //               wx.hideLoading();
  //               that.login();
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // }
})