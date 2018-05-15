// pages/order/order.js
import util from '../../utils/util.js';
let app = getApp();
let v = Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleArr: [
      "全部", "待付款", "待发货", "待收货", "已完成",
    ],
    nonPaymentArr: [],//未付款
    achieveArr: [],//已完成
    waitShipmentsArr: [],//待发货
    waitReceivingArr: [],//待收货
    current: 0,
    height: 0,
    duration: 300,
    allarr: [],
    waitPaymentLoading: true,
    allLoading: true,
    waitDeliverLoading: true,
    waitReceivingLoading: true,
    achieveLoading: true,
    noOrder1: true,//无货图
    noOrder2: true,
    noOrder3: true,
    noOrder4: true,
    noOrder5: true,
    unllImage: util.image('noOrder.png')
  },
  //点击切换
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
  /*****跳转订单详情******/
  orderDetail(e) {
    console.log(e)
    util.pageJump('orderDetail', {
      orderid: e.currentTarget.dataset.orderid
    })
  },
  /**********查看物流******/
checkLogistics(){
  util.showModal({
    confirmColor: '#e3656f',
   content:'请到APP中查看详情'
  })
},
/**********确定订单*************/
  confirmOrder(e){
   util.showModal({
     title:'提示',
     content:'您是否确认订单',
     confirmColor: '#e3656f',
     complete:(res)=>{
       if(res.confirm){
         util.get('/api/Product/ConfirmReceipt', {
           orderid: e.currentTarget.dataset.orderid
         }).then(res => {
          if(res.data.code=='1000'){
            util.get('/api/Product/ProductOrderSearch', {
            }).then((res) => {
              for (let i = 0; i < res.data.data.length; i++) {
                let allPrice = 0;//每单总价
                let allNum = 0;//每单总数
                for (let j = 0; j < res.data.data[i].prolist.length; j++) {
                  allPrice += parseFloat(res.data.data[i].prolist[j].price) * parseInt(res.data.data[i].prolist[j].num);
                  allNum += parseInt(res.data.data[i].prolist[j].num);
                }
                res.data.data[i].allNum = that.strip(allNum);
                res.data.data[i].allPrice = that.strip(allPrice);
              }
              //待付款
              let nonPayment = res.data.data.filter((ele) => {
                return ele.orderstate == '0';
              });
              //待发货
              let waitShipments = res.data.data.filter((ele) => {
                return ele.orderstate == "1";
              })
              //待收货
              let waitReceiving = res.data.data.filter((ele) => {
                return ele.orderstate == "2";
              })
              //已完成
              let achieve = res.data.data.filter((ele) => {
                return ele.orderstate == "3"
              })

              this.setData({
                nonPaymentArr: nonPayment,
                achieveArr: achieve,
                waitShipmentsArr: waitShipments,
                waitReceivingArr: waitReceiving,
                achieveArr: achieve,
                allarr: res.data.data,
              });
            })

         setTimeout(()=>{
           util.showToast({
             title: '订单已完成'
           });
         },500)
          }
         })
       }
     }
   })
  },
  //再次购买
  agpay() {

  },
  //取消订单
  removeOrder(e) {
    let orderid = e.currentTarget.dataset.id
    let that = this;
    util.showModal({
      title: '提示',
      content: '您确定要取消此订单',
      confirmColor: '#e3656f',
      complete: function (res) {
        if (res.confirm) {
          util.get('/api/Product/DeleteOrder', {
            orderid: orderid
          }).then((res) => {
            if (res.data.code == '1000') {
              util.get('/api/Product/ProductOrderSearch', {
              }).then((res) => {
                for (let i = 0; i < res.data.data.length; i++) {
                  let allPrice = 0;//每单总价
                  let allNum = 0;//每单总数
                  for (let j = 0; j < res.data.data[i].prolist.length; j++) {
                    allPrice += parseFloat(res.data.data[i].prolist[j].price) * parseInt(res.data.data[i].prolist[j].num);
                    allNum += parseInt(res.data.data[i].prolist[j].num);
                  }
                  res.data.data[i].allNum = that.strip(allNum);
                  res.data.data[i].allPrice = that.strip(allPrice);
                }
                //待付款
                let nonPayment = res.data.data.filter((ele) => {
                  return ele.orderstate == '0';
                });
                //待发货
                let waitShipments = res.data.data.filter((ele) => {
                  return ele.orderstate == "1";
                })
                //待收货
                let waitReceiving = res.data.data.filter((ele) => {
                  return ele.orderstate == "2";
                })
                //已完成
                let achieve = res.data.data.filter((ele) => {
                  return ele.orderstate == "3"
                })

                that.setData({
                  nonPaymentArr: nonPayment,
                  achieveArr: achieve,
                  waitShipmentsArr: waitShipments,
                  waitReceivingArr: waitReceiving,
                  achieveArr: achieve,
                  allarr: res.data.data,
                });
              })

              setTimeout(() => {
                util.showToast({
                  title: '订单已取消'
                });
              }, 500)

            }
          })
        } else {
          return;
        }
      }
    })

  },
  //提醒发货
  remind() {
    util.showToast({
      title: '已提醒发货',
    })
  },
  /**********立即支付*************/
  pay(e) {
    this.payment(e.currentTarget.dataset.id)
  },
  /***********支付方法*************/
  payment(orderlist) {
    util.get('/api/Product/OrderPayXCX', {
      paytype: 1,
      orderlist: orderlist
    }).then(res => {
      if (res.data.code == 1000) {
        wx.requestPayment({
          timeStamp: res.data.data.timeStamp,
          nonceStr: res.data.data.nonceStr,
          package: res.data.data.package,
          signType: res.data.data.signType,
          paySign: res.data.data.paySign,
          complete: function (res) {
            if (res.errMsg == 'requestPayment:ok') {
              util.showToast({ title: '支付成功' });
              util.get('/api/Product/ProductOrderSearch', {
              }).then((res) => {
                for (let i = 0; i < res.data.data.length; i++) {
                  let allPrice = 0;//每单总价
                  let allNum = 0;//每单总数
                  for (let j = 0; j < res.data.data[i].prolist.length; j++) {
                    allPrice += parseFloat(res.data.data[i].prolist[j].price) * parseInt(res.data.data[i].prolist[j].num);
                    allNum += parseInt(res.data.data[i].prolist[j].num);
                  }
                  res.data.data[i].allNum = that.strip(allNum);
                  res.data.data[i].allPrice = that.strip(allPrice);
                }
                //待付款
                let nonPayment = res.data.data.filter((ele) => {
                  return ele.orderstate == '0';
                });
                //待发货
                let waitShipments = res.data.data.filter((ele) => {
                  return ele.orderstate == "1";
                })
                //待收货
                let waitReceiving = res.data.data.filter((ele) => {
                  return ele.orderstate == "2";
                })
                //已完成
                let achieve = res.data.data.filter((ele) => {
                  return ele.orderstate == "3"
                })

                this.setData({
                  nonPaymentArr: nonPayment,
                  achieveArr: achieve,
                  waitShipmentsArr: waitShipments,
                  waitReceivingArr: waitReceiving,
                  achieveArr: achieve,
                  allarr: res.data.data,
                });
              })

            }
            else if (res.errMsg == 'requestPayment:fail cancel') {
              util.showToast({ title: '用户取消支付' });
            }
            else {
              util.showToast({ title: '未知错误' })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id == '0') {
      this.setData({
        current: 1
      })
    } else if (options.id == '1') {
      this.setData({
        current: 2
      })
    } else if (options.id == '2') {
      this.setData({
        current: 3
      })
    }
    else if (options.id == '3') {
      this.setData({
        current: 4
      })
    } else {
      this.setData({
        current: 0
      })
    }
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })

  },


  getData() {
    util.get('/api/Product/ProductOrderSearch', {
    }).then((res) => {
      if (res.data.code == "1000") {
        console.log(res.data.data)
        for (let i = 0; i < res.data.data.length; i++) {
          let allPrice = 0;//每单总价
          let allNum = 0;//每单总数
          for (let j = 0; j < res.data.data[i].prolist.length; j++) {
            allPrice += parseFloat(res.data.data[i].prolist[j].price) * parseInt(res.data.data[i].prolist[j].num);
            allNum += parseInt(res.data.data[i].prolist[j].num);
          }
          res.data.data[i].allNum = this.strip(allNum);
          res.data.data[i].allPrice = this.strip(allPrice);
        }
        //待付款
        let nonPayment = res.data.data.filter((ele) => {
          return ele.orderstate == '0';
        });

        //待发货
        let waitShipments = res.data.data.filter((ele) => {
          return ele.orderstate == "1";
        })
        //待收货
        let waitReceiving = res.data.data.filter((ele) => {
          return ele.orderstate == "2";
        })
        //已完成
        let achieve = res.data.data.filter((ele) => {
          return ele.orderstate == "3"
        })
        if (nonPayment.length == 0) {
          this.data.noOrder2 = false;
        }
        if (res.data.data.length == 0) {
          this.data.noOrder1 = false;
        }
        if (achieve.length == 0) {
          this.data.noOrder5 = false;
        }
        if (waitShipments.length == 0) {
          this.data.noOrder3 = false;
        }
        if (waitReceiving.length == 0) {
          this.data.noOrder4 = false;
        }
        this.setData({
          nonPaymentArr: nonPayment,
          achieveArr: achieve,
          waitShipmentsArr: waitShipments,
          waitReceivingArr: waitReceiving,
          achieveArr: achieve,
          allarr: res.data.data,
          waitPaymentLoading: false,
          allLoading: false,
          achieveLoading: false,
          waitDeliverLoading: false,
          waitReceivingLoading: false,
          noOrder1: this.data.noOrder1,
          noOrder2: this.data.noOrder2,
          noOrder3: this.data.noOrder3,
          noOrder4: this.data.noOrder4,
          noOrder5: this.data.noOrder5
        });
      }
    })
  },
  /*****浮点数转换*****/
  strip(num, precision = 3) {
    return +parseFloat(num.toPrecision(precision));
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.getData();
  },

})