import util from "./utils/util"
//app.js
App({
  onLaunch: function (options) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              wx.login({
                complete: function (res) {
                  let code = res.code;
                  wx.getUserInfo({
                    complete: function (res) {
                      let iv = res.iv;
                      let encryptedData = res.encryptedData;

                      let getData = {
                        type: 1,
                        iv: iv,
                        encryptedData: encryptedData,
                        code: code
                      }

                      if (options.query.higheruserid) {
                        getData.higheruserid = options.query.higheruserid
                      }

                      util.get('/api/user/WeChatSmallProgramInfo', getData)
                        .then((res) => {
                          if (res.data.code == 1000) {
                            util.setStorageSync('userid', res.data.data.userid)
                            util.setStorageSync('token', res.data.data.token);
                          }
                        })
                    }
                  })
                }
              })
            } else {
              wx.authorize({
                scope: 'scope.userInfo',
                success: res => {
                  wx.getUserInfo({
                    complete: res => {
                      wx.login({
                        complete: function (res) {
                          let code = res.code;
                          wx.getUserInfo({
                            complete: function (res) {
                              let iv = res.iv;
                              let encryptedData = res.encryptedData;

                              let getData = {
                                type: 1,
                                iv: iv,
                                encryptedData: encryptedData,
                                code: code
                              }

                              if (options.query.higheruserid) {
                                getData.higheruserid = options.query.higheruserid
                              }

                              util.get('/api/user/WeChatSmallProgramInfo', getData)
                                .then((res) => {
                                  if (res.data.code == 1000) {
                                    util.setStorageSync('userid', res.data.data.userid)
                                    util.setStorageSync('token', res.data.data.token);
                                  }
                                })
                            }
                          })
                        }
                      })
                    }
                  })
                }
              })
            }
          }
        })
      }
    })
    //
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.windowHeight
      },
    })
  },
  globalData: {
    userInfo: null,
    height: 0
  }
})