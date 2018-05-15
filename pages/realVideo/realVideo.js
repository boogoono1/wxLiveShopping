import util from "../../utils/util.js"
var page = undefined
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isfriend: '',//是否关注
    Diamonds: '', //黄钻余额
    PinkDiamonds: '', //粉钻余额
    salesnum: '',//商品最大件数
    rmturl: '',//直播流地址
    anchorName: '',//主播名字
    anchorid: 0,//主播id
    userid:util.getUserid(),
    roomid: 0,//房间id
    roomserverip: '',//房间聊天室服务武器地址
    videoUrl:'',//视频的直播地址
    livevideoid:'',//视频的id
    anchorImg: '',//主播头像

    stateViewanimation: {},
    inputBulletAnimation: {},
    selectedGoodListAnimation: {},
    bulletAnimation: {},
    bulletWordStyle: {},
    inputBulletHidden: true,
    selectedGoodListHidden: true,
    goodDetailHidden: true,
    bulletWordHidden: false,
    goodSpecoalHidden: false,


    imageData: {
      "shoppingCart": util.image('shoppingCart_2.png'),
      "decrease": util.image('minus.png'),
      "add": util.image('plus.png'),
      "close": util.image('closeStatus.png'),
      "closeWindow": util.image('close.png'),
      "state": util.image('state.png'),
      'goodSelected': util.image('goodSelected.png')
    },

    doommData: [],

    scrollTop: 999,
    bulletInput: '',
    socketOpen: false,
    timer1: '',
    colorBullet: true,
    bulletDataArray: [],
    bulletDataRecod:[],
    nickname: '',//发弹幕人的名字

    windowWidth: 0,//窗口宽度
    model: '',//手机机型
    navHight: 0,
    playerHeight: 0,
    bulletHeight: 0,
    bulletBottomHeight: 0,


    recommenList: [],
    goodDetailData: {},
    goodParameters: [],
    selectGoodInfo: {}, //选中的商品的信息
    goodSizeStatu: 0,
    goodCount: 1,

    ifMultiSku: false,
    iscur: {},
    isattrtext: {},
    prices: "",
    imgurl: "",
    attrshow: false,
    pI: {},
    skuid:'',
    arrts: "",
    priceInfo: "",

  },
  /**
   * 生命周期函数--监听页面加载
   * https://app.boogoo.tv:444/api/Anchor/AnchorVideoRoom?anchorid=10000
   * https://app.boogoo.tv:444/api/LiveVideo/GetLiveVideoChatLog弹幕记录
   */
  onLoad: function (options) {
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    console.log(options)
    var that = this
    var videoUrl = ''

    util.get("/api/Anchor/AnchorVideosList", {
      userid: util.getUserid(),
      token: util.getToken(),
      anchorid: options.anchorid
    }).then((res) => {
      if (res.data.code == "1000") {
        console.log('获取到主播的视频', res.data.data[0].videolist)
        var videolist = res.data.data[0].videolist
        var video = videolist.filter((ele) => {
          return ele.videoid == options.livevideoid
        })
        console.log('video', video)
        videoUrl = video[0].playaddress
        this.setData({
          videoUrl: videoUrl,
        })
      }
    })
    this.setData({
      anchorid: options.anchorid,
      livevideoid: options.livevideoid
    })
    
    that.initData()

    page = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowWidth: res.windowWidth,
          screenHeight: res.screenHeight,
          navHight: res.screenHeight * 0.1,
          playerHeight: res.screenHeight * 0.5,
          bulletHeight: res.screenHeight * 0.4,
          model: res.model

        })
      }
    })
  },

  onShow: function () {
    util.get('/api/LiveVideo/GetLiveVideoChatLog', {
      livevideoid: this.data.livevideoid
    }).then((res) => {
      if (res.data.code != 1000) {
        console.log('数据出错',res)
      } else {


        var bulletOriginData = res.data.data
        console.log('origin', bulletOriginData)
        var bulletDataArray = []//滚屏的弹幕
        var bulletDataRecod = []//滚屏的弹幕
        for (var i = 0; i<bulletOriginData.length; i++){
          var bulletObj = {};//滚屏弹幕
          var bulletReco = {};//弹幕记录
          bulletObj.text = bulletOriginData[i].content;
          bulletObj.time = parseInt((i + 1) * 5);
          bulletObj.color = '#E3656F';
          bulletReco.content = bulletOriginData[i].content
          bulletReco.name = bulletOriginData[i].nikename
          bulletDataArray.push(bulletObj)
          bulletDataRecod.push(bulletReco)
        }
        console.log('bububullet', bulletDataArray, bulletDataRecod)

        this.setData({
          bulletDataArray: bulletDataArray,
          bulletDataRecod: bulletDataRecod
        })
        console.log('返回聊天记录', res)
        
      }
    })
  },
  /**
   * 页面初始化数据
   * 获取商品列表信息
   * 获取主播房间信息
   * /api/User/UserAccountMessage
   */
  initData: function () {
    var that = this
    util.get('/api/Anchor/AnchorMessage', {
      userid: util.getUserid(),
      token: util.getToken(),
      anchorid: this.data.anchorid,
    }).then((res) => {
      that.setData({
        isfriend: res.data.data.isfriend,
      })
    })
    util.get('/api/Anchor/AnchorProductRecommend', {
      id: that.data.anchorid
    }).then((res) => {
      if (res.data.code != 1000) {
        console.log('数据出错')
      } else {
        console.log('返回主播推荐商品', res)
        var recommenList = []
        recommenList = res.data.data
        for (var i = 0; i < recommenList.length; i++) {
          recommenList[i].selected = 0
        }
        console.log('recommenList........', recommenList)
        that.setData({
          recommenList: recommenList
        })
      }
    })
    util.get('/api/Anchor/AnchorVideoRoom', {
      anchorid: that.data.anchorid
    }).then((res) => {
      if (res.data.code != 1000) {
        console.log('数据出错')
      } else {
        console.log('返回主播的直播间信息ididi', res)
        if (res.data.isLive == 1) {
          that.setData({
            roomid: res.data.data[0].roomid,
            roomserverip: res.data.data[0].roomserverip,
            anchorImg: res.data.data.headurl,
            rmturl: res.data.data.rtmpserverip,
            anchorName: res.data.data.nickname,
          })
        } else {
          that.setData({
            roomid: res.data.data.roomid,
            roomserverip: res.data.data.roomserverip,
            anchorName: res.data.data.nickname,
            anchorImg: res.data.data.headurl
          })
        }
      }
    })
    util.get('/api/user/UserInformation', {

    }).then((res) => {
      if (res.data.code != 1000) {
        console.log('数据出错',res)
      } else {
        console.log('返回用户的信息', res)
        that.setData({
          nickname: res.data.data[0].nickname
        })
        // that.startSocket()
      }
    })
  },
  /**
     * 向上打开商品的详情页面
     * /api/Product/ProductPrice
     */
  /**
     * 向上打开商品的详情页面
     * /api/Product/ProductPrice
     */
  openGoodDetail: function (e) {
    console.log('dakaixingqingde', e)
    var that = this
    let listGoodIndex = e.currentTarget.dataset.productid
    let index = e.currentTarget.dataset.index
    let recommenList = that.data.recommenList
    for (var i = 0; i < recommenList.length; i++) {
      if (i == index) {
        recommenList[i].selected = 1
      } else {
        recommenList[i].selected = 0
      }

    }

    console.log(listGoodIndex)

    that.setData({
      goodDetailHidden: false,
      goodCount: 1,
      recommenList: recommenList
    })
    util.get('/api/Product/ProductPrice', {
      productid: listGoodIndex,
      type: 1
    }).then((res) => {
      if (res.data.code != 1000) {
        console.log('查询商品的属性出错：', res)
      } else {
        console.log('shangpingxiangqingshuju', res)
        var priceInfo = res.data.data.priceInfo;
        var pI = this.data.pI
        var arrts = res.data.data.attrInfo;
        var price = priceInfo[0].price
        var goodImgurl = priceInfo[0].imgurl
        var parama = [];
        for (let i = 0; i < arrts.length; i++) {
          var paraObj = {}
          var attrValueList = arrts[i].attrValueList
          for (let j = 0; j < attrValueList.length; j++) {
            paraObj.name = attrValueList[0].attrname
            paraObj.id = attrValueList[0].attrid
            paraObj.upperid = attrValueList[0].attrupperid
            if (j == 0) {
              attrValueList[j].selected = 1
            } else {
              attrValueList[j].selected = 0
            }
          }
          parama.push(paraObj)
        }
        pI.productid = listGoodIndex
        pI.attribute = parama

        //获取改变后的价格图像
        let newSkuid = [];
        for (let i = 0; i < parama.length; i++) {
          newSkuid.push(parama[i].id);
        }
        //获得排列组合
        let arrange = this.permute([], newSkuid);
        let newArr = [];
        for (let i = 0; i < arrange.length; i++) {
          newArr = priceInfo.filter(ele => {
            return ele.skuid == arrange[i].join(':')
          });

          if (newArr.length > 0) {
            var skuid = newArr[0].skuid;
            this.setData({
              goodParameters: arrts,
              priceInfo: priceInfo,
              salesnum: newArr[0].stock,
              price: newArr[0].price,
              imgurl: newArr[0].imgurl,
              skuid: skuid
            })
          }
        }
        console.log('piipipippiiiiiiii', pI)
      }
    })
    util.get('/api/Product/ProductInfo', {
      productid: listGoodIndex,
      type: 1,
      anchorid: this.data.anchorid
    }).then((res) => {
      if (res.data.code != 1000) {
        console.log('数据访问出错！')
      } else {
        console.log('dedededede', res)
        let goodDetailData = {}
        goodDetailData = res.data.data;
        that.setData({
          goodDetailData: goodDetailData,
        })
      }
    })

  },
  /**
   * 取消或选择规格
   *iscur: {},//当前的商品子属性attrid
    isattrtext: {},//当前的商品子属性
    prices: "",//当前确定的价格
    imgurl: "",//当前图片
    attrshow: false,//属性层
    pI: "",//商品信息
    arrts: "",//商品属性
    priceInfo: "", //sku价格表
   */
  selectOrcancle: function (e) {
    let selectindex = e.currentTarget.dataset.selectindex
    let attrupperid = e.currentTarget.dataset.upperid
    let goodParameters = this.data.goodParameters
    var pI = this.data.pI
    let priceInfo = this.data.priceInfo

    var paramid;
    for (var i = 0; i < goodParameters.length; i++) {
      if (goodParameters[i].attrid == attrupperid) {
        paramid = i
      }
    }
    var selectAttrInfo = goodParameters[paramid].attrValueList
    for (var i = 0; i < selectAttrInfo.length; i++) {
      if (i == selectindex) {
        selectAttrInfo[i].selected = 1
      } else {
        selectAttrInfo[i].selected = 0
      }
    }
    if (priceInfo[selectindex].stock == 0) {
      util.showToast({ 'title': '库存不足' })
      this.setData({
        goodCount: 0,
      })
    } else {
      this.setData({
        goodCount: 1,
      })
    }

    var att = {}
    att.name = selectAttrInfo[selectindex].attrname//属性名字
    att.id = selectAttrInfo[selectindex].attrid//属性id
    att.upperid = attrupperid//属性上层id
    pI.attribute[paramid] = att
    console.log('selectdata::::', pI)

    //获取改变后的价格图像
    var attridArr = pI.attribute
    let newSkuid = [];
    for (let i = 0; i < attridArr.length; i++) {
      newSkuid.push(attridArr[i].id);
    }
    //获得排列组合
    let arrange = this.permute([], newSkuid);
    let newArr = [];
    for (let i = 0; i < arrange.length; i++) {
      newArr = priceInfo.filter(ele => {
        return ele.skuid == arrange[i].join(':')
      });

      if (newArr.length > 0) {
        var skuid = newArr[0].skuid;
        this.setData({
          goodParameters: goodParameters,
          salesnum: newArr[0].stock,
          price: newArr[0].price,
          imgurl: newArr[0].imgurl,
          skuid: skuid
        })
      }
    }

  },
  //排列组合
  permute(temArr, testArr) {
    let permuteArr = [];
    let arr = testArr;
    function innerPermute(temArr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (temArr.length == len - 1) {
          if (temArr.indexOf(arr[i]) < 0) {
            permuteArr.push(temArr.concat(arr[i]));
          }
          continue;
        }
        if (temArr.indexOf(arr[i]) < 0) {
          innerPermute(temArr.concat(arr[i]));
        }
      }
    }
    innerPermute(temArr);
    return permuteArr;
  },
  /**
   * 减少数量
   */
  decreaseCount: function () {
    console.log('------------', this.data.goodCount)
    var goodCount = this.data.goodCount
    if (goodCount == 1) {
      goodCount = 1
      util.showToast({ 'title': '已经到最小件数了' })
    } else {
      goodCount--
    }
    this.setData({
      goodCount: goodCount
    })

  },
  /**
   * 增加数量
   */
  addCount: function () {
    console.log('++++++')
    var goodCount = this.data.goodCount + 1
    if (goodCount > this.data.salesnum) {
      util.showToast({ 'title': '已经超出最大件数' })
      return
    }
    this.setData({
      goodCount: goodCount
    })
  },
  /**
     * 加入购物车
     * /api/Product/AddShoppingCart
     * skuid
     * anchorid
     * num
     * productid
     * entertype 1首页 2直播 3.录播
     */
  addCart: function () {
    console.log('addcart')
    let tempSkuid = "";
    for (let i = 0; i < this.data.pI.attribute.length; i++) {
      if (i != 0) {
        tempSkuid += ":"
      }
      tempSkuid += this.data.pI.attribute[i].id
    }
    console.log('canshu', tempSkuid, this.data.anchorid)
    util.get('/api/Product/AddShoppingCart', {
      skuid: this.data.skuid,
      anchorid: this.data.anchorid,
      num: this.data.goodCount,
      productid: this.data.goodDetailData.productid,
      entertype: 3
    }).then((res) => {
      if (res.data.code == 1000) {
        util.showToast({ 'title': '加入购物车成功' })
      } else if (res.data.code == 7000){
        util.showToast({ 'title': '库存不足' })
      } else{
        util.showToast({ 'title': '加入购物车失败' })
        console.log(res)
      }
    })
  },
  /**
   * 立即购买
   */
  buyNow: function () {

    util.pageJump('orderConfirm', {
      productid: this.data.goodDetailData.productid,
      skuid: this.data.skuid,
      producttype: 1,
      buynumber: this.data.goodCount,
      anchorid: this.data.anchorid,
      enterid: this.data.livevideoid,
      entertype: 2
    })
  },
  gotoCarft() {
    util.pageJump('cart', {

    })
  },
  /**
   * 关注主播
   * /api/user/UserFollow
   * 查询是否关注
   * https://app.boogoo.tv:444/api/user/UserIsFollow
   */
  attentionAnchor: function () {

    var isfriend = this.data.isfriend
    console.log('isisisis', isfriend)
    if (isfriend == 0) {
      isfriend = 0
    } else {
      isfriend = 1
    }

    util.get('/api/user/UserFollow', {
      userid: util.getUserid(),
      token: util.getToken(),
      fuserid: this.data.anchorid,
      type: parseInt(isfriend)
    }).then((res) => {
      if (res.data.code == 1000) {
        if (isfriend == 0) {
          isfriend = 1
        } else {
          isfriend = 0
        }
        this.setData({
          isfriend: isfriend
        })

      }else{
        util.showToast({'title':'操作失败'})
      }
    })
   

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 关闭商品的详情展示
   */
  closeDetailWindow() {
    var recommenList = []
    recommenList = this.data.recommenList
    for (var i = 0; i < recommenList.length; i++) {
      recommenList[i].selected = 0
    }
    this.setData({
      goodDetailHidden: true,
      recommenList: recommenList
    })
  },

})

