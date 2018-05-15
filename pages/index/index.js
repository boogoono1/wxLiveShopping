var app = getApp()
import util from "../../utils/util.js";
Page({
  data: {
    note: [],
    height: 0,
    pageindex: 1,//当前页数
    currentLoading: false,
    hoturl: util.image('fire.png'),
    isLogin: false,
    tabbarImg: {
      tab1: util.image('home-1.png'),
      tab2: util.image('live.png'),
      tab3: util.image('Mycenter_1.png'),
    },
    isFill:false
  },
  login() {
    wx.getSetting({ // 查看是否授权
      complete: res => {
        if (res.authSetting['scope.userInfo']) { // 授权状态执行
          wx.login({ // 获取 code 
            complete: res => {
              let code = res.code;
              wx.getUserInfo({ // 获取 iv 和 encrypedData 
                complete: res => {
                  let iv = res.iv;
                  let encryptedData = res.encryptedData;

                  let getData = {
                    type: 1, // 获取账号信息 
                    iv: iv,
                    encryptedData: encryptedData,
                    code: code
                  }

                  if (app.globalData.higheruserid != 0) { // 获取是否为有上级编号
                    getData.higheruserid = app.globalData.higheruserid
                  }

                  util.get('/api/user/WeChatSmallProgramInfo', getData)
                    .then((res) => {
                      if (res.data.code == 1000) {
                        util.setStorageSync('userid', res.data.data.userid)
                        util.setStorageSync('token', res.data.data.token);
                        this.data.isLogin = true;
                        app.globalData.isLogin = true;
                        this.setData({
                          isLogin: true
                        })
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
  },
  toAnchor() {
    util.pageJump('anchor')
  },
  toUser() {
    util.pageJump('user')
  },
  onLoad(options) {
    this.data.isLogin = app.globalData.isLogin;
    if (app.globalData.isIphoneX){
       this.setData({
         isFill: true
       })
     }
    wx.getSetting({ // 查看是否授权
      complete: res => {
        if (res.authSetting['scope.userInfo']) { // 授权状态执行
          if (options.type == 1) {
            util.pageJump('realLive', {
              anchorid: options.anchorid,
              roomid: options.roomid
            })
          }
          else if (options.type == 2) {
            util.pageJump('realVideo', {
              anchorid: options.anchorid,
              livevideoid: options.livevideoid
            })
          }
          else if (options.type == 3) {
            util.pageJump('liveRoom', {
              anchorid: options.anchorid
            })
          }
        }
      }
    })

    this.setData({
      isLogin: this.data.isLogin,
      height: app.globalData.height,
    })
    this.getInfo();

    this.setData({
      isLogin: this.data.isLogin
    })
  },
  onShow() {


  },
  /*****上拉加载********/
  onReachBottom(e) {
    this.data.pageindex++;
    this.setData({
      pageindex: this.data.pageindex
    })

    this.getInfo();
  },
  /*****下拉刷新*****/
  onPullDownRefresh() {
    this.data.note = [];
    this.data.pageindex = 1;
    this.getInfo();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1500)

  },
  getInfo() {
    var that = this;
    util.get('/api/Anchor/AnchorArea', {
      type: 1,
      pagesize: 12,
      pageindex: this.data.pageindex,
      appVersion: '2.0.2',
      sources: 3,
    }).then(res => {
      console.log(res)
      if (this.data.pageindex == 1) {
        this.JCHGArr = [];
      }
      if (res.data.code == "1000" && res.data.index == that.data.pageindex) {
        that.JCHGArr = [...that.JCHGArr, ...res.data.dataJCHG];
        if (res.data.dataDT.length == 12) {
          that.data.note = [...that.data.note, ...res.data.dataDT];
        } else if (res.data.dataDT.length > 0) {
          let newArr = that.JCHGArr.slice(0, 12 - res.data.dataDT.length);
          that.data.note = [...that.data.note, ...res.data.dataDT, ...newArr]
          that.JCHGArr.splice(0, 12 - res.data.dataDT.length)
        } else {
          that.data.note = [...that.data.note, ...res.data.dataJCHG]
        }
        if (res.data.dataJCHG.length == 0 && res.data.dataDT.length == 0) {
          that.data.currentLoading = true;
          util.showToast({
            title: "已经看到最后啦"
          })
        }
        that.setData({
          note: that.data.note,
          currentLoading: that.data.currentLoading
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },

  gotoLiveRoom: function (e) {
    if (e.currentTarget.dataset.livestate == 1) {
      util.pageJump('realLive', {
        roomid: e.currentTarget.dataset.liveid,
        anchorid: e.currentTarget.dataset.anchorid
      })
    } else {
      util.pageJump('realVideo', {
        anchorid: e.currentTarget.dataset.anchorid,
        videoUrl: e.currentTarget.dataset.playaddress,
        livevideoid: e.currentTarget.dataset.videoid
      })
    }
  },

})

