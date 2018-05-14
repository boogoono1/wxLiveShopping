// pages/anchor/anchor.js
import util from '../../utils/util.js';
let app=getApp();
Page({

  data: {
     anchorArr:[],
     height:0,
     pageindex:1,
     currentLoading: false
  },

  toJump(e){
    util.pageJump('liveRoom',{
      anchorid: e.currentTarget.dataset.id
    })
  },
  lower(){
    this.data.pageindex++;
    this.getData(this.data.pageindex);
    this.setData({
      pageindex:this.data.pageindex
    })
  },
  onLoad(){
    this.setData({
      height: app.globalData.height
    })
  },
  onHide(){
    this.setData({
      anchorArr:[],
      pageindex: 1,
      currentLoading: false
    })
  },
  onShow: function () {
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
        }
      }
    })
  },



})