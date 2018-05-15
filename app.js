import util from "./utils/util"
//app.js
let app = App({
  onLaunch: function (options) {
    let _this = this;

    wx.getSetting({ // 查看是否授权
      complete: res => {
        if (res.authSetting['scope.userInfo']) { // 授权状态执行
          _this.globalData.isLogin = true; // 显示 登录触发 的 button
          console.log('this.globalData.isLogin', _this.globalData.isLogin)
          wx.login({ // 获取 code 
            complete: res => {
              let code = res.code;
              wx.getUserInfo({ // 获取 iv 和 encrypedData 
                complete: res => {
                  let iv = res.iv;
                  let encryptedData = res.encryptedData;

                  let getData = {
                    type: 0, // 获取账号信息 
                    iv: iv,
                    encryptedData: encryptedData,
                    code: code
                  }

                  if (options.query.higheruserid) { // 获取是否为有上级编号
                    getData.higheruserid = options.query.higheruserid
                  }

                  util.get('/api/user/WeChatSmallProgramInfo', getData)
                    .then((res) => {
                      if (res.data.code == 1000) {
                        util.setStorageSync('userid', res.data.data.userid)
                        util.setStorageSync('token', res.data.data.token);
                        console.log(res.data.data.userid, res.data.data.token);
                        console.log('userid token 写入成功');
                      }
                    })
                }
              })
            }
          })
        }
      }
    })

    wx.getSystemInfo({
      complete: function (res) {
        if (res.model == 'iPhone X') {
          _this.globalData.isIphoneX = true;
        }
      }
    })
    /*****更新应用****/
    const updateManager = wx.getUpdateManager()
    // 请求完新版本信息的回调
    updateManager.onCheckForUpdate(function (res) {

    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        confirmColor: '#e3656f',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      util.showToast({ title: '新版本下载失败' });
    })

    wx.getSystemInfo({
      success: (res) => {
        this.globalData.height = res.windowHeight
      },
    })
  },
  onShow: function (options) {
    let _this = this;

    if (options.query.higheruserid != null && options.query.higheruserid != 0) {
      this.globalData.higheruserid = options.query.higheruserid;
    }

  },
  onHide() {
    if (typeof this.globalData.livePlayer == object) {
      this.globalData.livePlayer.stop();
    }

  },
  globalData: {
    userInfo: null,
    height: 0,
    higheruserid: 0,
    flag: false,
    isLogin: true,
    livePlayer: null,
    isIphoneX: false
  }
})