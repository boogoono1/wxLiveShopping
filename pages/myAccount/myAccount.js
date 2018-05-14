// pages/myAccount/myAccount.js
import util from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArr: ['粉钻', '黄钻', '优惠劵'],
    pinkDiamondNum: 0,
    yellowDiamondNum: 0,
    discountsNum: 0,
    pinkUrl: [
      util.image('pinkbg.png'), util.image('pinkbg-2.png'), util.image('pink.png')
    ],
    yellowUrl: [util.image('pinkbg.png'), util.image('yellowbg-2.png'), util.image('yellow.png')],
    discountsUrl: util.image('couponbg-2.png'),
    active: 0,
    startX: 0,
    endX: 0,
    asideRight: -500,
    screenWidth: 0
  },

  isClick(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      active: id
    })
  },
  //移动
  move(e) {
    this.setData({
      active: e.detail.current
    })
  },
  
  //跳转粉钻
  toPink(e) {
  let num= e.currentTarget.dataset.num;
  util.pageJump('pinkDiamond',{
    num:num
  })
  },
  //跳转黄钻
  toYellow(e) {
    let num = e.currentTarget.dataset.num;
    util.pageJump('yellowDiamond',{
      num:num
    })
  },
  //跳转优惠卷
  toDiscounts(e) {
    let num = e.currentTarget.dataset.num;
    util.pageJump('coupon',{
      num:num
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active: parseInt(options.id)
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '我的账户',
    });
    util.get('/api/user/UserDetailed', {
      token: util.getToken(),
      userid: util.getUserid()
    }).then((res)=>{
      if (res.data.code == '1000') {
        this.setData({
          pinkDiamondNum: res.data.data.userinfo.pinkdiamonds,
          yellowDiamondNum: res.data.data.userinfo.diamonds,
          discountsNum: res.data.data.userinfo.couponnum
        })
      }
    })
  },
})