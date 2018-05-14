// pages/attention/attention.js
var app = getApp()
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attetionAnchoList:[],
    imageData: { 'threeDot': util.image('threeWhitedot.png'),
      'redRightMore': util.image('redRightMore.png'),
      'upClose': util.image('upClose.png'),
      'expendMore': util.image('expendMore.png')},
    isfollow:'',
    open:false,
    img:util.image('nofollow.png'),
    isHidden:false,
    isBlank:true
  },
  /******去主播个人页******/
  toAnchor(e){
   util.pageJump('liveRoom',{
     anchorid: e.currentTarget.dataset.id
   })
  },

  /**
   * 收起或者是关闭cell
   */
  openOtherCell:function(e){
    var listIndex = e.currentTarget.dataset.index;
    var attetionAnchoList = this.data.attetionAnchoList;
    var finalAttentionAnchorList;
    if (attetionAnchoList[listIndex].openStatus){
      finalAttentionAnchorList = this.addStatus(attetionAnchoList)
      finalAttentionAnchorList[listIndex].openStatus = false
    }else{
      finalAttentionAnchorList = this.addStatus(attetionAnchoList)
    }
    this.setData({
      attetionAnchoList: finalAttentionAnchorList
    })
  },
  /**
   * 取消关注和关注主播
   */
  cancleAndAttention:function(e){
    console.log('quxiaoguanzhu',e)
    var anchorid = e.currentTarget.dataset.anchorid//操作的主播id
    var isfollow = e.currentTarget.dataset.isfollow//当前关注的状态
    var index = e.currentTarget.dataset.index//当前点击的index
    var attetionAnchoList = this.data.attetionAnchoList;
    util.get('/api/user/UserFollow', {
      userid: util.getUserid(),
      token: util.getToken(),
      fuserid: anchorid,
      type: isfollow
    }).then((res) => {
      if(res.data.code == 1000){
        if (attetionAnchoList[index].isfollow == 1){
          attetionAnchoList[index].isfollow = 0
        }else{
          attetionAnchoList[index].isfollow = 1
        }

        this.setData({
          attetionAnchoList: attetionAnchoList
        })
      }else{
        util.showToast({'title':'操作失败'})
      }
    })

  },

  
  /**
   * 获取初始化数据
   */
  initStatus:function(){
    //获取初始列表
    var that = this
    util.get('/api/User/FriendMylist', {
      token: util.getToken(),
      userid: util.getUserid()
    }).then((res)=>{
      if (res.data.code != 1000) {
        console.log('数据访问出错！')
      } else {
        var attetionAnchoList = res.data.data
        for (var i = 0; i < attetionAnchoList.length; i++) {
          attetionAnchoList[i].openStatus = true
        }
        if (that.addStatus(res.data.data).length == 0) {
          this.data.isBlank=false

        } else {
          this.data.isBlank=true
        }
        
        that.setData({
          isHidden:true,
          isBlank:this.data.isBlank,
          attetionAnchoList: that.addStatus(res.data.data)
        })
      } 
    })
    //获取主播的关注状态
    util.get('/api/Anchor/AnchorMessage', {
      userid: util.getUserid(),
      token: util.getToken(),
      anchorid: this.data.anchorid,
    }).then((res) => {
      console.log(res)
    })
  },
  /**
  * 给重置cell都设置隐藏属性
  */
  addStatus: function (attetionAnchoList) {
    for (var i = 0; i < attetionAnchoList.length; i++) {
      attetionAnchoList[i].openStatus = true
    }
    return attetionAnchoList
  },
  /**
   * 查看视频录像
   */
  gotovideo:function(e){

    util.pageJump('realVideo', {
      anchorid: e.currentTarget.dataset.anchorid,
      videoUrl: e.currentTarget.dataset.playaddress,
      videoid: e.currentTarget.dataset.videoid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initStatus()
  },

})