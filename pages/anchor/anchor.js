// pages/anchor/anchor.js
import util from '../../utils/util.js';
let app=getApp();
Page({

  data: {
     anchorArr:[],
     height:0,
     pageindex:1,
     isFill: false,
     currentLoading: false,
     tabbarImg: {
       tab1: util.image('home.png'),
       tab2: util.image('live-1.png'),
       tab3: util.image('Mycenter_1.png'),
     }
  },
 toIndex(){
   util.pageJump('index')
 },
 toUser(){
   util.pageJump('user')
 },
  toJump(e){
    util.pageJump('liveRoom',{
      anchorid: e.currentTarget.dataset.id
    })
  },
  onReachBottom(){
    this.data.pageindex++;
    this.getData(this.data.pageindex);
    this.setData({
      pageindex:this.data.pageindex
    })
  },
  onLoad(){
    if (app.globalData.isIphoneX) {
      this.setData({
        isFill: true
      })
    }
    this.setData({
      height: app.globalData.height
    })
    this.getData();
  },
  getData(pageindex){
    util.get('/api/Anchor/AnchorArea',{
      type:0,
      pagesize: 12,
      pageindex: pageindex
    }).then((res)=>{
      if (res.data.code == "1000" && res.data.index == this.data.pageindex) {
        if(res.data.data.length>0){
          this.setData({
            anchorArr: [...this.data.anchorArr, ...res.data.data]
          })
        }
        if(res.data.data.length==0){
          this.setData({
            currentLoading:true
          })
          util.showToast({
            title: "已经看到最后啦"
          })
        }
      }
    })
  },



})