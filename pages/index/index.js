var app = getApp()
import util from "../../utils/util.js";
Page({
  data: {
    note: [],
    height:0,
    pageindex:1,//当前页数
    currentLoading:false,
    isFill:false,
    hoturl: util.image('fire.png')
  },
  onLoad(options){
    console.log(options)
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
    this.setData({
      height: app.globalData.height
    })
  },
  onHide(){
    this.setData({
      note:[],
      pageindex: 1,//当前页数
      currentLoading: false,
    })
  },
  lower(){
    this.data.pageindex++;
    this.setData({
      pageindex: this.data.pageindex
    })
    this.getInfo(this.data.pageindex);
  },
  onShow: function () {
    this.getInfo(this.data.pageindex);
  },
  getInfo(pageindex) {
    var that = this;
    util.get('/api/Anchor/AnchorArea', {
      type: 1,
      pagesize: 12,
      pageindex: pageindex,
      appVersion: '2.0.2',
      sources:3,     
    }).then(res => {
      console.log(res)
      if (res.data.code == "1000" && res.data.index == that.data.pageindex) {
        if (res.data.dataJCHG.length > 0) {
          var note = []
          if (res.data.dataDT.length > 0){
            var note1 = [...note, ...res.data.dataDT];
            var note2 = [...note1, ...res.data.dataJCHG]
            note = note2
    
          }else{
            note = res.data.dataJCHG
          }
          that.setData({
            note: [...that.data.note, ...note]
          })
          
          console.log(that.data.note)
        }
        if (res.data.dataJCHG.length == 0) {
          that.setData({
            currentLoading: true
          })
        }
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        console.log('分享成功index！' + JSON.stringify(res));
      },
      fail: function (res) {
        console.log('分享失败index！' + res);
      }
    }
  },

  gotoLiveRoom:function(e){
    console.log(e)
    if (e.currentTarget.dataset.livestate == 1){
      util.pageJump('realLive', {
        roomid: e.currentTarget.dataset.liveid,
        anchorid: e.currentTarget.dataset.anchorid
      })
    }else{
      // util.get("/api/Anchor/AnchorVideosList", {
      //   userid: util.getUserid(),
      //   token: util.getToken(),
      //   anchorid: e.currentTarget.dataset.anchorid,
      // }).then((res) => {
      //   console.log(res)
      //   if (res.data.code == "1000") {
      //     var videoArr = res.data.data[0].videolist;
      //     var videoData = videoArr[0]

      //   }
      // })
      util.pageJump('realVideo', {
        anchorid: e.currentTarget.dataset.anchorid,
        videoUrl: e.currentTarget.dataset.playaddress,
        livevideoid: e.currentTarget.dataset.videoid
      })
    }
    
  },
  /**
   * 获取主播的视屏录像
   */
  getAnchorVideo() {
    
  },
})

