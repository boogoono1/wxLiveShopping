// pages/user/user.js
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headurl: "",
    nickname: "",
    idx: "",
    optionArr: [
      { url: util.image('pay_1.png'), title: '待付款' },
      { url: util.image('pay_2.png'), title: '待发货' },
      { url: util.image('pay_3.png'), title: '待收货' },
      { url: util.image('pay_4.png'), title: '已完成' },
      { url: util.image('pay_5.png'), title: '全部订单' },
    ],
    accountArr: [],
    serviceArr: [
      { url: util.image('shoppingCart_2.png'), title: '购物车', nav: 'cart' },
      { url: util.image('my_follow.png'), title: '我的关注', nav: 'attention' },
      { url: util.image('Record_1.png'), title: '足迹', nav: 'footprint' },
      { url: util.image('serve_1.png'), title: '客服中心', nav: 'serviceHelp' },
    ],

  },

  //订单页跳转
  toOrder(e) {
    let id = e.currentTarget.dataset.id;
    util.pageJump('order', { id: id })
  },
  //账户页跳转
  toAccount(e) {
    let id = e.currentTarget.dataset.id[0];
    let num=e.currentTarget.dataset.id[1];
    if (id == 0) {
      util.pageJump('myAccount', {
        id: 0
      })
    } else if (id == 1) {
      util.pageJump('pinkDiamond',{
        num: this.data.pinkdiamonds
      })
    }
    else if (id == 2) {
      util.pageJump('yellowDiamond',{
        num: this.data.diamonds
      })
    } else if (id == 3) {
      util.pageJump('coupon')
    }
  },
  //服务项跳转
  toJump(e) {

    let nav = e.currentTarget.dataset.nav;

    util.pageJump(nav)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '播购直播',
    });

    util.get('/api/user/UserDetailed', {
      token: util.getToken(),
      userid: util.getUserid()
    }).then((res) => {
      if (res.data.code == '1000') {
        this.setData({
          headurl: res.data.data.userinfo.headurl,
          nickname: res.data.data.userinfo.nickname,
          idx: res.data.data.userinfo.idx,
          pinkdiamonds: res.data.data.userinfo.pinkdiamonds,
          diamonds: res.data.data.userinfo.diamonds,
          accountArr: [
            { url: util.image('my_core.png'), title: '我的账户' },
            { num: this.toTenThousand(res.data.data.userinfo.pinkdiamonds), title: '粉钻' },
            { num: this.toTenThousand(res.data.data.userinfo.diamonds), title: '黄钻' },
            { num: this.toTenThousand(res.data.data.userinfo.couponnum), title: '优惠劵' },
            { num: this.toTenThousand(res.data.data.userinfo.fansNum), title: '粉丝' },
          ]
        })
      }
    })

  },
  // 5位数转换
  toTenThousand(num) {
    num = parseInt(num);
    return num > 9999 ? (num / 10000).toFixed(1) + 'w' : num;
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})