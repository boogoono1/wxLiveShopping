// pages/yellowDiamond/yellowDiamond.js
import util from '../../utils/util.js';
Page({
  data: {
  num:0
  },
//充值
  recharge(){
    util.pageJump('recharge', {
      num: this.data.num
    })
  },
  //去直播大厅
  call(){
    if(this.data.num>0){
       wx.switchTab({
         url: '../index/index'
       })
    }else{
      util.showModal({
        content:'余额不足，是否充值',
        confirmText:'充值',
        confirmColor:'#e3656f',
        complete:(res)=>{
          if (res.confirm) {
          util.pageJump('recharge',{
            num:this.data.num
          })
          } else if (res.cancel) {
           
          }
        }
      })
    }
  },
  onLoad: function (options) {
    this.setData({
      num: options.num
    })
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '黄钻',
    });
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#E3656F',
    })
  }
})