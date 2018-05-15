// pages/pinkDiamond/pinkDiamond.js
import util from '../../utils/util.js'
Page({
  data: {
  num:0,
  pinkBg:util.image('pinkbg.png'),
  pinkbg2:util.image('pinkbg-2.png'),
  pink:util.image('pink.png')
  },
  toStore(){
    util.showModal({
      content:'请前往APP查看详情',
      confirmColor: '#e3656f'
    });
  },
  
  launchAppError: function (e) {
    console.log(e.detail.errMsg)
  } ,
  onLoad: function (options) {
   this.setData({
     num:options.num
   })
  },
  onShow: function () {
  wx.setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#E3656F',
  })
  }
})