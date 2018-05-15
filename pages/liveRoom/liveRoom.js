// pages/liveRoom/liveRoom.js
import util from '../../utils/util.js';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playurl: util.image('play.png'),
    operationArr: [],
    anchorid: null,
    imglist: [],
    videoArr: [],
    anchorData: {},
    active: '0',
    isModule: "anchorMessage",
    animationData: {},
    isFollow: false,
    height: 512,
    //主播商城
    goodArr: [],
    isSuper: false,
    isScroll: true,
    opacity: 1,
    isBox: {
      imgHeight: 120,
      nickLeft: 60,
      nickTop: 168,
      followTop: 148,
      lineTop: 392,
    }
  },


  /**********选择**********/
  isClick(e) {
    var id = e.currentTarget.dataset.id;
    this.setData({
      active: id
    });
    if (id == '0') {
      this.setData({
        isModule: 'anchorMessage'
      })
    } else {
      this.setData({
        isModule: 'starStore'
      })
    }
  },
  /************预览图片****************/
  toPreview(e) {
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: this.data.imglist
    })
  },
  //去直播间
  toLiveRoom() {
    util.pageJump('realLive', {
      anchorid: this.data.anchorid
    })
  },
  //关注逻辑
  isFollowed() {
    this.data.anchorData.isfriend = this.data.anchorData.isfriend == "0" ? "1" : "0";
    let type = this.data.anchorData.isfriend == "0" ? 1 : 0;

    this.setData({
      anchorData: this.data.anchorData
    })
    util.get('/api/user/UserFollow', {
      userid: util.getUserid(),
      token: util.getToken(),
      fuserid: this.data.anchorid,
      type: type
    }).then(res => {
      if (res.data.code = "1000") {
        util.get('/api/Anchor/AnchorMessage', {
          anchorid: this.data.anchorid,
        }).then((res) => {
          if (res.data.code == "1000") {
            this.data.operationArr[1].num = res.data.data.fansNum;
            this.setData({
              operationArr: this.data.operationArr
            })
          }
        })
      }
    })

  },
  //获取窗口大小
  getSize() {
    this.setData({
      width: wx.getSystemInfoSync().windowWidth,
    })
  },

  //看视频
  toWatch(e) {
    util.pageJump('realVideo', {
      anchorid: e.currentTarget.dataset.userid,
      videoUrl: e.currentTarget.dataset.playaddress,
      livevideoid: e.currentTarget.dataset.videoid
    })
  },
  /***********去商品详情页************/
  toJump(e) {
    util.pageJump('profitDetails', {
      productid: e.currentTarget.dataset.productid,
      anchorid: this.data.anchorid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSize();
    this.setData({
     anchorid: parseInt(options.anchorid)

    });
  },
  onShow: function () {
    this.getAnchorInfo();
    this.getAnchorVideo();
    this.getAnchorProductRecommend();
  },

  getAnchorProductRecommend() {
    util.get('/api/Anchor/AnchorProductRecommend', {
      userid: util.getUserid(),
      token: util.getToken(),
      id: this.data.anchorid,
      type: 0
    }).then((res) => {
      if (res.data.code == "1000") {
        this.setData({
          goodArr: res.data.data
        })
      }
    })
  },
  getAnchorVideo() {
    util.get("/api/Anchor/AnchorVideosList", {
      userid: util.getUserid(),
      token: util.getToken(),
      anchorid: this.data.anchorid,
    }).then((res) => {
      if (res.data.code == "1000") {
        this.data.videoArr = res.data.data[0].videolist;
        this.setData({
          videoArr: this.data.videoArr
        })
      }
    })
  },
  getAnchorInfo() {
    util.get('/api/Anchor/AnchorMessage', {
      anchorid: this.data.anchorid,
    }).then((res) => {
      if (res.data.code == "1000") {
        this.data.anchorData = {
          headurl: res.data.data.headurl,
          idx: res.data.data.idx,
          nickname: res.data.data.nickname,
          isfriend: res.data.data.isfriend,
          livestate: res.data.data.livestate
        }

        this.data.operationArr = [
          { num: res.data.data.follow, title: "关注", color: '#4D93FF' },
          { num: res.data.data.fansNum, title: "粉丝", color: '#FF195B' },
          { num: res.data.data.popularity, title: "人气", color: '#F77843' },
          { num: res.data.data.sendreward, title: "打赏", color: '#F74343' },
        ];

        this.data.imglist = res.data.data.imglist;
        let length = this.data.imglist.length;


        this.setData({
          anchorData: this.data.anchorData,
          operationArr: this.data.operationArr,
          imglist: this.data.imglist,
        })
      }
    })
  },
  /********监听页面滚动***********/
  onPageScroll(e) {
    if (e.scrollTop < 256) {
      e.scrollTop = e.scrollTop < 0 ? 0 : e.scrollTop;
      this.data.height = 512 - e.scrollTop / 256 * 256-31;
      this.data.isBox.imgHeight = 120 - e.scrollTop / 256 * 60;
      this.data.isBox.nickLeft = 60 + e.scrollTop / 256 * 80;
      this.data.isBox.nickTop = 168 - e.scrollTop / 256 * 136;
      this.data.isBox.followTop = 148 - e.scrollTop / 256 * 128;
      this.data.isBox.lineTop = 392 - e.scrollTop / 256 * 292;
      this.data.opacity = 1 - 1.5 * (e.scrollTop / 256 * 1)
    } else if (e.scrollTop >= 256) {
      this.data.height = 223;
      this.data.isBox.imgHeight = 60;
      this.data.isBox.nickLeft = 140;
      this.data.isBox.nickTop = 32;
      this.data.isBox.followTop = 20;
      this.data.isBox.lineTop = 100;
      this.data.opacity = 0
    }
    this.setData({
      height: this.data.height,
      opacity: this.data.opacity,
      isBox: this.data.isBox
    })
  },
  /*****滚动动画****/
  // scrollAnimation(n) {
  //   let animation = wx.createAnimation({
  //     transformOrigin: "50% 50%",
  //     duration: 2000,
  //     timingFunction: "ease",
  //     delay: 0
  //   })

  //   if (n[0].scrollTop >= n[1]) {
  //     animation.translateY(-100).opacity(0).step();
  //     this.data.isSuper = true;
  //     this.data.isScroll = false;
  //     this.data.isOperate = false;
  //     this.setData({
  //       animationData: animation.export(),
  //       isSuper: this.data.isSuper,
  //       isScroll: this.data.isScroll,
  //       isOperate: this.data.isOperate
  //     })
  //   } else {
  //     animation.translateY(0).opacity(1).step();
  //     this.data.isSuper = false;
  //     this.data.isScroll = true;
  //     this.data.isOperate = true;
  //     this.setData({
  //       animationData: animation.export(),
  //       isSuper: this.data.isSuper,
  //       isScroll: this.data.isScroll,
  //       isOperate: this.data.isOperate
  //     })
  //   }
  // }
})