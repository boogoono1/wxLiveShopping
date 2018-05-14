import util from "../../utils/util.js"
var page = undefined
Page({
  
    data: {
        isfriend: '',//是否关注
        Diamonds: '', //黄钻余额
        PinkDiamonds: '', //粉钻余额
        salesnum: '',//商品最大件数
        rmturl: '',//直播流地址
        anchorName:'',//主播名字
        anchorid: 0,//主播id
        userid: util.getUserid(),
        roomid: 0,//房间id
        roomserverip: '',//房间聊天室服务武器地址
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
        focus:false,
        
        socketBullet: {},//弹幕

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
        arrts: "",
        priceInfo: "",
        

    },
    /**
     * 生命周期函数--监听页面加载
     * https://app.boogoo.tv:444/api/Anchor/AnchorVideoRoom?anchorid=10000
     */
    onLoad: function(options) {
        console.log(options)
        var that = this
        that.setData({
            anchorid: options.anchorid,
        })
        that.initData()

        page = this
        wx.getSystemInfo({
            success: function(res) {
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
        var livePlayerContext = wx.createLivePlayerContext('livePlayer', this)
        console.log('livePlayerContext',)
    },
    /**
     * 页面初始化数据
     * 获取商品列表信息
     * 获取主播房间信息
     * /api/User/UserAccountMessage
     */
    initData: function() {
        var that = this
        util.get('/api/User/UserAccountMessage', {
            type: 4
        }).then((res) => {
            console.log('diamonds', res)
            this.setData({
                Diamonds: res.data.data.Diamonds,
                PinkDiamonds: res.data.data.PinkDiamonds
            })
        })
        util.get('/api/Anchor/AnchorMessage', {
            userid: util.getUserid(),
            token: util.getToken(),
            anchorid: this.data.anchorid,
        }).then((res) => {
          console.log('isisisisifriendly', res.data.data.isfriend)
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
                for (var i = 0; i < recommenList.length;i++){
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
                  console.log('roominfo', res.data.data[0].roomid,
                    res.data.data[0].roomserverip,
                    res.data.data[0].headurl,
                    res.data.data[0].rtmpserverip,
                    res.data.data[0].nickname,
                  )
                    that.setData({
                        roomid: res.data.data[0].roomid,
                        roomserverip: res.data.data[0].roomserverip,
                        anchorImg: res.data.data[0].headurl,
                        rmturl:res.data.data[0].rtmpserverip,
                        anchorName: res.data.data[0].nickname,
                    })
                } else {
                    that.setData({
                        roomid: res.data.data.roomid,
                        roomserverip: res.data.data.roomserverip,
                        anchorName: res.data.data.nickname,
                        anchorImg: res.data.data.headurl
                    })
                }

                that.startSocket()
            }
        })
        util.get('/api/user/UserInformation', {

        }).then((res) => {
          console.log('userinfofofofof', res)
            if (res.data.code != 1000) {
                console.log('数据出错')
            } else {
                console.log('ssususususuus',res)
                that.setData({
                        nickname: res.data.data[0].nickname
                    })
                    // that.startSocket()
            }
        })
    },
    /**
     *  打开弹幕输入框 
     */
    openBulletInputView: function() {
        var inputHidden;
        if (this.data.inputBulletHidden) {
            inputHidden = false;
            let animation = wx.createAnimation({
                duration: 200,
                timingFunction: 'ease-in',
                delay: 0
            })
            animation.translate(-30, -60).step({ duration: 0 })
            this.setData({
                inputBulletHidden: inputHidden,
                stateViewanimation: animation.export()
            })
        } else {
            inputHidden = true;
            let animation = wx.createAnimation({
                duration: 200,
                timingFunction: 'ease-in',
                delay: 0
            })
            animation.translate(3, 4).step({ duration: 0 })
            this.setData({
                inputBulletHidden: inputHidden,
                stateViewanimation: animation.export()
            })
        }

    },
    /**
     * 开启彩色弹幕
     */
    startColorBullet: function() {
      var colorBullet = this.data.colorBullet
      console.log('colorBulletcolorBullet',colorBullet)
      if (colorBullet) {
            if (this.data.Diamonds >= 1 || this.data.PinkDiamonds >= 1) {
                colorBullet = false
            } else {
                colorBullet = true
            }

        }else{
          colorBullet = true
        }
        this.setData({
            colorBullet: colorBullet
        })
    },
    bindKeyInput: function(e) {
        this.setData({
            bulletInput: e.detail.value
        })
    },

    /**
     * 通过按钮触发 发送弹幕
     * bulletColor 弹幕颜色
     * bulletWord 弹幕的内容
     * 1.向socket发
     * 2.向屏幕上发
     * 3.向弹幕记录发
     */
    sendBullet: function() {
        var that = this
        var bulletColor
        var bulletWord
        bulletWord = this.data.bulletInput
        if (bulletWord == '') {
            console.log('bulletWordweikong')
            util.showToast({'title':'内容不能为空'})
            return
        }
        //聊天数据模型
        let bulletObj = {
            type: 10003,
            body: {
                Message: bulletWord
            }
        }
        //弹幕的数据模型
        let bulletObj1 = {
          type: 10037,
          // type: 10003,
          body: {
            message: bulletWord
          }
        }
        
        let bulletObjLocal = {
            "name": that.data.nickname,
            "content": bulletWord,
            "status": "1"
        }
        console.log('bulletObjLocalbulletObjLocal',bulletObj)
        if (that.data.colorBullet) {
            that.sendBulletMessageToSocket(bulletObj)
            that.setData({
                bulletDataArray: that.data.bulletDataArray.concat(bulletObjLocal),
                scrollTop: that.data.scrollTop + 50,
                bulletWord: '',
                bulletInput:''
            })
        } else {

            bulletColor = getRandomColor()
                //1
            that.sendBulletMessageToSocket(bulletObj1)

            //2将发送的弹幕放到直播页面上
            doommList.push(new Doomm(bulletObj.content, Math.ceil(Math.random() * 250 + 100), 5, '#E3656F'));
            that.setData({
                bulletDataArray: that.data.bulletDataArray.concat(bulletObjLocal),
                doommData: doommList,
                scrollTop: that.data.scrollTop + 50,
                bulletWord: '',
                bulletInput: ''
            })

        }








    },
    /**
     * 公用方法：开启scoket并开始监听socket状态
     */
    startSocket: function() {
        var that = this

        wx.connectSocket({
            // url: 'ws://106.14.177.29:7101/ws'
          url: 'ws://wsxiaochengxu.boogoo.tv:7101/ws'
        })
        wx.onSocketOpen(function(res) {
            console.log('正在监听socket的开启状态！！！')
            that.setData({
                socketOpen: true
            })
            that.gotoLogin()
            console.log('此时的socket已经打开', res)
        })
        wx.onSocketMessage(function(res) {
            console.log(res)
            let socketMessage = res.data
            let socketData = JSON.parse(socketMessage)
            if (socketData.type == '10003') {
                console.log('1111111111')
                let bulletObj = {}
                bulletObj.name = socketData.body.from.name
                bulletObj.content = socketData.body.message
                bulletObj.status = 1
                    //在这里接收socket信息并且将信息放到公屏
                doommList.push(new Doomm(bulletObj.content, Math.ceil(Math.random() * 250 + 100), 5, '#E3656F'));
                //在这里接受socket信息并且将信息放到弹幕列表
                that.setData({
                    bulletDataArray: that.data.bulletDataArray.concat(bulletObj),
                    doommData: doommList,
                    scrollTop: that.data.scrollTop + 50,
                })
            }
        })
        wx.onSocketError(function(res) {
            console.log('WebSocket连接打开失败，请检查！', res)
            util.showToast({ 'title': 'WebSocket连接打开失败：'+JSON.stringify(res)})
        })

        wx.onSocketClose(function(res) {
            clearInterval(that.data.timer1)
            that.setData({
                socketOpen: false,
            })
            console.log('WebSocket 已关闭！', res)
        })

    },
    /**
     * 公用方法:通过获取用户信息和主播房间信息登录到直播间的房间
     */
    gotoLogin: function() {
        var that = this
        var socketMsgQueue = []
        console.log('zhixinglogin', that.data.roomid)
        let userObj = {
            type: 10001,
            body: {
                userid: util.getUserid(),
                barid: parseInt(that.data.roomid),
                token: util.getToken(),
            }
        }
        let heartBeatObj = {
            type: 100,
            body: {}
        }
        this.sendBulletMessageToSocket(userObj)
        this.setData({
            timer1: setInterval(function() {
                // console.log('zhixingxintiao')
                that.sendBulletMessageToSocket(heartBeatObj)
            }, 5000)
        })

    },
    /**
     * 公用方法：向socket发送消息
     */
    sendBulletMessageToSocket: function(msg) {
        var that = this
        console.log(msg)
        if (that.data.socketOpen) {
            wx.sendSocketMessage({
                data: JSON.stringify(msg),
                success: function(res) {
                    console.log('sendsuccess', res)
                },
                fail: function(res) {
                    console.log('sendfail', res)
                },
                complete: function(res) {

                },
            })
        } else {
            console.log('socket已关闭请先开启socket')
            that.startSocket()
        }
    },


    /**
     * 从右侧伸出goodList
     */
    animationFromRightToLeft() {
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: 'ease-in',
            delay: 0
        })
        animation.translateX(-this.data.windowWidth).step()
        this.setData({
            selectedGoodListAnimation: animation.export()
        })
    },
    animationBackToOrigin() {
        var animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease-in'
        })
        animation.translateX(this.data.windowWidth).step()
        this.setData({
            selectedGoodListAnimation: animation.export()
        })
    },
    /**
     * 展开商品列表
     */
    openGoodList: function() {

        this.setData({
            selectedGoodListHidden: false,
            goodSpecoalHidden: true
        })
        this.animationFromRightToLeft()
    },
    /**
     * 收起商品列表
     */
    closeGoodList: function() {
        var bulletH = (100 + Math.random(0, 500));
        console.log(bulletH)

        var bulletWordStyle = { 'top': '', '': '' }
        this.animationBackToOrigin()

        this.setData({
            selectedGoodListHidden: true,
            goodDetailHidden: true,
            goodSpecoalHidden: false
        })

    },

    /**
     * 向上打开商品的详情页面
     * /api/Product/ProductPrice
     */
    openGoodDetail: function(e) {
      console.log('dakaixingqingde',e)
        var that = this
        let listGoodIndex = e.currentTarget.dataset.productid
        let index = e.currentTarget.dataset.index
        let recommenList = that.data.recommenList
        for (var i = 0; i < recommenList.length; i++) {
          if (i == index){
            recommenList[i].selected = 1
          }else{
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
                      paraObj.upperid = arrts[i].attrupperid
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
                console.log('piipipippiiiiiiii', pI)
                that.setData({
                    goodParameters: arrts,
                    priceInfo: priceInfo,
                    price: price,
                    imgurl: goodImgurl,
                    pI: pI
                })

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
                    salesnum: res.data.data.salesnum
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
    selectOrcancle: function(e) {
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
        var price = priceInfo[paramid].price
        var imgurl = priceInfo[paramid].imgurl
        var att = {}
        att.name = selectAttrInfo[selectindex].attrname//属性名字
        att.id = selectAttrInfo[selectindex].attrid//属性id
        att.upperid = attrupperid//属性上层id
        pI.attribute[paramid] = att
        console.log('selectdata::::', pI)
        this.setData({
            goodParameters: goodParameters,
            price: price,
            imgurl: imgurl,
            pI: pI
        })
    },
    /**
     * 减少数量
     */
    decreaseCount: function() {
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
    addCount: function() {
        console.log('++++++')
        var goodCount = this.data.goodCount + 1
        if (goodCount > this.data.salesnum) {
            util.showToast({ 'title': '已经超出最大件数' })
            return
        }else{
          util.showToast({ 'title': '添加成功' })
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
    addCart: function() {
        console.log('addcart')
        let tempSkuid = "";
        for (let i = 0; i < this.data.pI.attribute.length; i++) {
          if (i != 0) {
            tempSkuid += ":"
          }
          tempSkuid += this.data.pI.attribute[i].id
        }
        util.get('/api/Product/AddShoppingCart',{
          skuid: tempSkuid,
          anchorid:this.data.anchorid,
          num: this.data.goodCount,
          productid: this.data.goodDetailData.productid,
          entertype:2
        }).then((res)=>{
          if(res.data.code == 1000){
            util.showToast({'title':'加入购物车成功'})
          }else{
            util.showToast({ 'title': '加入购物车失败' })
            console.log(res)
          }
          
        })
 
    
    },
    /**
     * 立即购买
     */
    buyNow: function() {
      console.log(this.data.pI)
        let tempSkuid = "";
        for (let i = 0; i < this.data.pI.attribute.length; i++) {
            if (i != 0) {
                tempSkuid += ":"
            }
            tempSkuid += this.data.pI.attribute[i].id
        }
        console.log(tempSkuid);

        util.pageJump('orderConfirm', {
            productid: this.data.goodDetailData.productid,
            skuid: tempSkuid,
            producttype: 1,
            buynumber: this.data.goodCount,
            anchorid: this.data.anchorid,
            entertype: 2
        })
    },
    /**
     * 关注主播
     * /api/user/UserFollow
     * 查询是否关注
     * https://app.boogoo.tv:444/api/user/UserIsFollow
     */
    attentionAnchor: function() {

        var isfriend = this.data.isfriend
        console.log('isisisis', isfriend)
        if (isfriend == 0) {
            isfriend = 0
        } else {
            isfriend = 1
        }

        util.get('/api/user/UserFollow', {
            fuserid: this.data.anchorid,
            type: parseInt(isfriend)
        }).then((res) => {
            console.log(res)
            if (res.data.code == 1000) {
              if (isfriend == 0) {
                isfriend = 1
              } else {
                isfriend = 0
              }
              this.setData({
                isfriend: isfriend
              })
            }
        })
       

    },
    gotoCarft(){
      util.pageJump('cart', {
        
      })
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        wx.closeSocket(function(res) {

            console.log('此时已经关闭socket', res)
        })
        clearInterval(this.data.timer1)
    },
    closeDetailWindow(){
      var recommenList = []
      recommenList = this.data.recommenList
      for (var i = 0; i < recommenList.length; i++) {
        recommenList[i].selected = 0
      }
      this.setData({
        goodDetailHidden:true,
        recommenList: recommenList
      })
    },
    error(e){
      console.log('livePlayererro:',e)
    },
    statechange(e){
      console.log('livePlayeerstate',e)
    }

})

var doommList = [];
var i = 0; //用做唯一的wx:key
class Doomm {
    constructor(text, top, time, color) {
        this.text = text;
        this.top = top;
        this.time = time;
        this.color = color;
        this.display = true;
        let that = this;
        this.id = i++;
        setTimeout(function() {
                doommList.splice(doommList.indexOf(that), 1); //动画完成，从列表中移除这项
                page.setData({
                    doommData: doommList
                })
            }, 6000) //定时器动画完成后执行。
    }
}

function getRandomColor() {
    let rgb = []
    for (let i = 0; i < 3; ++i) {
        let color = Math.floor(Math.random() * 256).toString(16)
        color = color.length == 1 ? '0' + color : color
        rgb.push(color)
    }
    return '#' + rgb.join('')
}

// class socket{
//   constructor(url,protocal,mes){
//     this.url = url
//     this.protocal = protocal
//     this.mes = mes
//   }
//   function
// }