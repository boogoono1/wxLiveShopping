// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0
  },
  rechargeOne() {
   console.log('6元')
  },
  rechargeTwo() {
    console.log('30元')
  },
  rechargeThree() {
    console.log('98元')
  },
  rechargeFour() {
    console.log('198元')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      num: options.num
    });
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})