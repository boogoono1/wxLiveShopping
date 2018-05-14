// pages/coupon/coupon.js
import util from '../../utils/util.js';
let app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    duration:300,
    noMoneyOffArr: [],//未使用满减劵
    noDiscountArr: [],//未使用折扣劵
    noGeneralArr: [],//未使用通用劵
    moneyOffArr: [],
    discountArr: [],
    generalArr: [],
    height: 0,
    windowHeight:0,
    contentHeight:0,
    usedImgUrl: util.image('coupon_bg_already_used.png'),
    failedImgUrl: util.image('coupon_bg_failed.png'),
    imgUrl: util.image('coupon_bg_already_received.png'),
    duration: 500,
    isHidden:false
  },

  isClick(e) {
    this.setData({
      current: e.currentTarget.dataset.id
    })
  },
  change(e) {
    this.setData({
      current: e.detail.current
    })
  },
  onLoad() {
        this.setData({
          windowHeight: app.globalData.height,
          height: app.globalData.height,
          contentHeight:app.globalData.height
        })
  },

  onShow: function () {
    util.get('/api/Product/GetUserCouponList', {
      userid: util.getUserid(),
      token: util.getToken(),
      state: 0
    }).then((res) => {
      if (res.data.code == "1000") {
        /****************全部***************************/
        let allArr = res.data.data;
        let discountArr = allArr.filter((ele) => {
          return ele.coupontype == 1;
        })
        let moneyOffArr = allArr.filter((ele) => {
          return ele.coupontype == 3;
        })
        let generalArr = allArr.filter((ele) => {
          return ele.coupontype == 2;
        })
        for (let i = 0; i < moneyOffArr.length; i++) {
          moneyOffArr[i].satisfy = moneyOffArr[i].couponcontent.split('|')[0];
          moneyOffArr[i].replace = moneyOffArr[i].couponcontent.split('|')[1];
        }
        this.toTime(moneyOffArr)
        this.toTime(discountArr)
        this.toTime(generalArr)
        this.setData({
          moneyOffArr: moneyOffArr,
          discountArr: discountArr,
          generalArr: generalArr
        })

        /**************未使用***************/
        let noUseArr = res.data.data.filter((ele) => {
          return ele.state == 0;
        })
        let noDiscountArr = noUseArr.filter((ele) => {
          return ele.coupontype == 1;
        })
        let noMoneyOffArr = noUseArr.filter((ele) => {
          return ele.coupontype == 3;
        })
        let noGeneralArr = noUseArr.filter((ele) => {
          return ele.coupontype == 2;
        })
        for (let i = 0; i < noMoneyOffArr.length; i++) {
          noMoneyOffArr[i].satisfy = noMoneyOffArr[i].couponcontent.split('|')[0];
          noMoneyOffArr[i].replace = noMoneyOffArr[i].couponcontent.split('|')[1];
        }
        this.setData({
          noMoneyOffArr: noMoneyOffArr ,
          noDiscountArr: noDiscountArr,
          noGeneralArr:noGeneralArr,
          isHidden:true
        });
      }
    })
  },
  //截取时间
  toTime(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].validperiodstart = arr[i].validperiodstart.split(' ')[0].split('-')[1] + '.' + arr[i].validperiodstart.split(' ')[0].split('-')[2];
      arr[i].validperiodend = arr[i].validperiodend.split(' ')[0].split('-')[1] + '.' + arr[i].validperiodend.split(' ')[0].split('-')[2];
    }
  }

})
