// pages/ordersConfirm/orderConfirm.js
import util from "../../utils/util"
import Base64 from '../../utils/base64/base64.modified';
var iosProvinceS = [];
var iosCityS = [];
let app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    receivingAddressData: {
      name: " ",
      phone: " ",
      areaname: " ",
      detailaddress: " ",
      addressid: 0
    },
    alterAddressData: {},//修改地址的地址模型
    state: 0,//地址默认状态
    receivingAddressDataList: [],
    anchorInfo: [],
    orderInfo: [],
    count: 1,
    total: 0.00,
    selectCouponIndex: '',
    couponInfoList: [],
    couponListData: [],
    ImageData: {
      "addressImg": util.image('2_07.png'),
      "rightArrow": util.image('rights.png'),
      "anchorImg": util.image('2_07.png'),
      "goodImg": util.image('2_07.png'),
      "titleImg1": util.image('shopping_cart.png'),
      "titleImg2": util.image('vehicle.png'),
      "titleImg3": util.image('ticket.png'),
      "titleImg4": util.image('evaluate.png'),
      "titleImg5": util.image('coupon.png'),
      "add": util.image('plus.png'),
      "decrease": util.image('minus.png'),
      "bottomImage": util.image('5_01.png'),
      "selected": util.image('1_02.png')
    },
    productid: null,
    skuid: null,
    producttype: null,
    buynumber: null,
    anchorid: null,
    entertype: null,
    enterid: null,
    isEdit: true,
    idAdd: 0,//判断是新增地址还是修改地址
    showSelectAdd: false,
    region: ['浙江省', '杭州市', '江干区'],
    closeurl: util.image('close.png'),
    // isEditeAdd:true,
    DetailedSite: '',//收货详细地址
    recipients: '',//收件人
    isHidden: false,
    cartList: [],
    selectCouponIndex: -1,
    phone: '',
    selectproviceid: '',
    selectcityid: '',
    isSwitch:false,
    isFill:false
  },
  bindMultiPickerColumnChange: function (e) {
    var multycolumn = e.detail.column;//选中的列
    var multyValue = e.detail.value;//选中的行
    var proviceid;//选中的省的id
    proviceid = iosProvinceS[multyValue].id
    var iosCityS1 = iosCityS.filter((item) => {
      return item.parentId == proviceid
    })
    var iosCityS2 = iosCityS1.map((ele) => {
      return ele.value
    })
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (multyValue) {
          case e.detail.value:
            data.multiArray[1] = iosCityS2;
            break;
        }
        data.multiIndex[1] = 0;
        break;
      case 1:
        switch (multyValue) {
          case e.detail.value:
            data.multiArray[1] = iosCityS2[e.detail.value];
            break;
        }
        break;
    }

    this.setData(data);
  },
  //手机号
  bindKeyInput(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
       * 收件人
       */
  recipients(e) {
    this.setData({
      recipients: e.detail.value
    })
  },
  /**
   * 收货详细地址
   */
  DetailedSite(e) {
    this.setData({
      DetailedSite: e.detail.value
    })
  },
  /*********选中默认地址*********/
  switchChange(e) {
    this.setData({
      state: e.detail.value == true ? 1 : 0
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.isIphoneX){
       this.setData({
         isFill:true
       })
    }
    util.showLoad('正在生成订单...');
    let _data = this.data;
    if (options.cartList) {
      _data.producttype = 1;
      _data.cartList = JSON.parse(options.cartList);

      this.initData(2);
    }
    else {
      _data.productid = options.productid
      _data.skuid = options.skuid // 18646
      _data.producttype = options.producttype // 18646
      _data.buynumber = options.buynumber // 18646
      _data.anchorid = options.anchorid // 18646
      _data.entertype = options.entertype // 18646

      // _data.productid = 18646
      // _data.skuid = 1933
      // _data.producttype = 1
      // _data.buynumber = 1
      // _data.anchorid = 10000
      // _data.entertype = 2
      // _data.enterid = 1
      // 接受一个录像id

      if (_data.entertype == 1) {
        _data.enterid = 0;
      } else if (_data.entertype == 2) {
        _data.enterid = _data.anchorid;
      }
      if (_data.entertype == 2) {
        _data.enterid = _data.anchorid; // 传入录像id
      }

      this.initData(1);

    }

    this.getAddressInfo();
    util.hideLoad();
  },
  onShow: function () {
  },
  /**
   * 初始化数据
   * 1 常规进入
   * 2 购物车进入
   */

  initData: function (index) {

    let _this = this.data;


    if (index == 1) {
      _this.orderInfo = [{
        anchorid: _this.anchorid, // 主播id,从url上截取
        headerimg: "", // 主播头像
        anchorname: "", // 主播名称
        subtotal: "", // 小计
        number: '', // 该主播下购买总数
        hasCoupon: false,
        select: -1,
        data: []
      }];

      this.getAnchorInfo(0);

      this.getProductInfo(0);

      this.getCoupon(this.data.productid);

    } else if (index == 2) {
      util.get('/api/Product/CreateProductOrderTime', {
        cartlist: _this.cartList.join(',')
      }).then(res => {
        if (res.data.code == 1000) {
          let couponList = [];
          for (let i = 0; i < res.data.data.length; i++) {
            _this.orderInfo.push({
              anchorid: res.data.data[i].anchorid,
            })
            this.getAnchorInfo(i);
          }

          for (let i = 0; i < res.data.data.length; i++) {
            for (let j = 0; j < res.data.data[i].prolist.length; j++) {
              this.getProductInfo(i, j, res.data.data[i].prolist[j].productid, res.data.data[i].prolist[j].skuid, res.data.data[i].prolist[j].attrdesc, res.data.data[i].prolist[j].num, res.data.data[i].prolist[j].cartid);
              couponList.push(res.data.data[i].prolist[j].productid);
            }
          }
          this.getCoupon(couponList.join(','));
        }
        else {
          util.showToast('忘了好像出了小差')
        }
      })
    }

    this.getcity();
  },
  /**
   * 价格计算
   */
  calculation() {
    this.data.total = 0;
    for (let i = 0; i < this.data.orderInfo.length; i++) {
      this.data.orderInfo[i].subtotal = 0.00;
      for (let j = 0; j < this.data.orderInfo[i].data.length; j++) {
        this.data.orderInfo[i].subtotal += parseFloat(this.data.orderInfo[i].data[j].price * this.data.orderInfo[i].data[j].num);
      }
      this.data.total += parseFloat(this.data.orderInfo[i].subtotal);
      this.data.orderInfo[i].subtotal = this.data.orderInfo[i].subtotal.toFixed(2);
    }
    this.data.total = this.data.total.toFixed(2);
    this.setData({
      total: this.data.total,
      orderInfo: this.data.orderInfo
    })
  },
  /**
   * 获取主播信息 
   */
  getAnchorInfo(index) {
    let anchorid = this.data.orderInfo[index].anchorid;
    util.get('/api/Anchor/AnchorMessage', {
      anchorid: anchorid
    }).then((res) => {
      if (res.data.code == 1000) {
        if (this.data.orderInfo[index] == undefined) {
          this.data.orderInfo[index] = {};
        }
        this.data.orderInfo[index].headerimg = res.data.data.headurl;
        this.data.orderInfo[index].anchorname = res.data.data.nickname;
        this.data.orderInfo[index].anchorid = res.data.data.anchorid;
        this.data.orderInfo[index].subtotal = 0.00;
        this.data.orderInfo[index].number = this.data.buynumber;
        this.data.orderInfo[index].hasCoupon = false;
        this.data.orderInfo[index].data = [];

        this.setData({
          orderInfo: this.data.orderInfo
        })
      }
    })
  },
  /**
   * 获取商品信息
   */
  getProductInfo(index, productIndex = -1, productid, skuid, attrdesc, num, cartid) {
    console.log(index, productIndex, productid, skuid, attrdesc, num, cartid)
    if (productIndex != -1) {
      util.get('/api/Product/ProductInfo', {
        productid: productid,
        type: this.data.producttype
      }).then(res => {
        if (res.data.code == 1000) {
          let tempData = res.data.data;
          if (this.data.orderInfo[index] == undefined) {
            this.data.orderInfo[index] = {
              data: []
            };
          }

          if (this.data.orderInfo[index].data == undefined) {
            this.data.orderInfo[index] = {
              data: []
            };
          }

          this.data.orderInfo[index].data.push({
            productid: tempData.productid, //商品id
            productname: tempData.name, //商品名称
            productimg: tempData.infoimg[0], //商品图片
            skutext: attrdesc, //sku名称
            skuid: skuid, //skuid
            num: parseInt(num), //购买个数
            price: tempData.price, //价格
            cartid: cartid, //默认设置0
            classid: tempData.classid,
            couponnumber: ''
          })

          util.get('/api/Product/ProductPrice', {
            productid: productid,
            type: this.data.producttype
          }).then(res => {
            if (res.data.code == 1000) {
              tempData = res.data.data;
              for (let i = 0; i < tempData.priceInfo.length; i++) {
                if (tempData.priceInfo[i].skuid == this.data.skuid) {
                  let tempN = this.data.orderInfo[index].data.length - 1;
                  this.data.orderInfo[index].data[tempN].skutext = tempData.priceInfo[i].attrdesc
                  this.data.orderInfo[index].data[tempN].productimg = tempData.priceInfo[i].imgurl
                  this.data.orderInfo[index].data[tempN].stock = tempData.priceInfo[i].stock
                  this.data.orderInfo[index].data[tempN].price = tempData.priceInfo[i].price
                }
              }

              this.calculation(); // 计算价格

              this.setData({
                orderInfo: this.data.orderInfo
              })
            }

          })
        }
      })
    }
    else {
      util.get('/api/Product/ProductInfo', {
        productid: this.data.productid,
        type: this.data.producttype
      }).then(res => {
        if (res.data.code == 1000) {

          let tempData = res.data.data;
          if (this.data.orderInfo[index] == undefined) {
            this.data.orderInfo[index] = {
              data: []
            };
          }
          this.data.orderInfo[index].data.push({
            productid: tempData.productid, //商品id
            productname: tempData.name, //商品名称
            productimg: tempData.infoimg[0], //商品图片
            skutext: '', //sku名称
            skuid: this.data.skuid, //skuid
            num: parseInt(this.data.buynumber), //购买个数
            price: tempData.price, //价格
            cartid: 0, //默认设置0
            classid: tempData.classid,
            couponnumber: ''
          })

          util.get('/api/Product/ProductPrice', {
            productid: this.data.productid,
            type: this.data.producttype
          }).then(res => {
            if (res.data.code == 1000) {
              tempData = res.data.data;
              for (let i = 0; i < tempData.priceInfo.length; i++) {
                if (tempData.priceInfo[i].skuid == this.data.skuid) {
                  let tempN = this.data.orderInfo[index].data.length - 1;
                  this.data.orderInfo[index].data[tempN].skutext = tempData.priceInfo[i].attrdesc
                  this.data.orderInfo[index].data[tempN].productimg = tempData.priceInfo[i].imgurl
                  this.data.orderInfo[index].data[tempN].stock = tempData.priceInfo[i].stock
                  this.data.orderInfo[index].data[tempN].price = tempData.priceInfo[i].price
                }
              }

              this.calculation(); // 计算价格

              this.setData({
                orderInfo: this.data.orderInfo
              })
            }
          })
        }
      })
    }

  },
  /**
   * 获取优惠券
   */
  getCoupon: function (productlist) {
    for (let i = 0; i < this.data.orderInfo.length; i++) {
      this.data.orderInfo[i]['couponnumber'] = "";
      this.data.orderInfo[i]['select'] = -1;
    }
    util.get('/api/Product/GetUserCouponList', {
      productlist: productlist
    }).then((res) => {
      if (res.data.code == 1000) {
        for (let i = 0; i < res.data.data.length; i++) { // 优惠券数据显示模式修改
          let tempCouponList = [];
          for (let j = 0; j < res.data.data[i].usercouponList.length; j++) {
            // res.data.data[i].usercouponList[j].validperiodstart = moment(moment(res.data.data[i].usercouponList[j].validperiodstart).unix() * 1000).format('MM.DD');
            // res.data.data[i].usercouponList[j].validperiodend = moment(moment(res.data.data[i].usercouponList[j].validperiodend).unix() * 1000).format('MM.DD');

            res.data.data[i].usercouponList[j]['price'] = res.data.data[i].usercouponList[j].couponcontent;

            if (res.data.data[i].usercouponList[j].coupontype == 1) {
              res.data.data[i].usercouponList[j]['mode1'] = "现金折扣券";
            }
            else if (res.data.data[i].usercouponList[j].coupontype == 2) {
              res.data.data[i].usercouponList[j]['mode1'] = '直抵' + res.data.data[i].usercouponList[j].couponcontent;
            }
            else if (res.data.data[i].usercouponList[j].coupontype == 3) {
              res.data.data[i].usercouponList[j]['mode1'] = '满' + res.data.data[i].usercouponList[j].couponcontent.split('|')[0] + '减' + res.data.data[i].usercouponList[j].couponcontent.split('|')[1];
              res.data.data[i].usercouponList[j]['price'] = res.data.data[i].usercouponList[j].couponcontent.split('|')[1];
              res.data.data[i].usercouponList[j]['minPrice'] = res.data.data[i].usercouponList[j].couponcontent.split('|')[0];
            }

            tempCouponList.push(res.data.data[i].usercouponList[j]);
          }
          res.data.data[i] = tempCouponList;
        }
        let tempN = 0;
        let oldResData = res.data.data;
        res.data.data = [];

        for (let i = 0; i < this.data.orderInfo.length; i++) { // 几个订单
          let tempCouponList = [];
          for (let j = 0; j < this.data.orderInfo[i].data.length; j++) { // 每个订单有多少商品
            for (let k = 0; k < oldResData[tempN].length; k++) {

              let isHas = false;
              for (let l = 0; l < tempCouponList.length; l++) {
                if (tempCouponList[l].couponname == oldResData[tempN][k].couponname) {
                  isHas = true;
                }
              }
              if (!isHas) {
                tempCouponList.push(oldResData[tempN][k])
              }
            }
          }
          res.data.data.push(tempCouponList);
        }

        this.data.couponListData = res.data.data

        for (let i = 0; i < this.data.orderInfo.length; i++) {
          this.data.orderInfo[i].select = -1;
          if (this.data.couponListData[i].length > 0) {
            this.data.orderInfo[i].hasCoupon = true;
          }
          else {
            this.data.orderInfo[i].hasCoupon = false;
          }
        }

        console.log(this.data.couponListData)
      }
    })
  },
  /**
   * 获取收货地址
   */
  getAddressInfo() {
    util.get('/api/product/AddressInfo', {
    }).then((res) => {
      if (res.data.code == 1000) {
        if (res.data.data.length != 0) {
          this.data.isHidden = true;
        } else {
          this.data.isHidden = false;
        }
        this.setData({
          receivingAddressData: res.data.data[0],
          receivingAddressDataList: res.data.data,
          isHidden: this.data.isHidden
        })
      }
    })
  },
  /**
   * 获取城市选择信息
   */
  getcity: function () {
    util.get("/api/Product/AreaInfo", {

    }).then((res) => {
      iosProvinceS = res.data.pList
      iosCityS = res.data.cList
    })
  },
  /**
   * 减少订单数
   */
  decreaseCount: function (e) {
    e = e.target.dataset;
    if (this.data.orderInfo[e.anchorindex].data[e.goodindex].num == 1) {
      util.showToast({
        title: '商品数量不能小于1'
      })
    } else {
      this.data.orderInfo[e.anchorindex].data[e.goodindex].num--;
    }
    this.calculation();
  },
  /**
   * 增加订单数
   */
  addCount: function (e) {
    e = e.target.dataset;
    if (this.data.orderInfo[e.anchorindex].data[e.goodindex].num > this.data.orderInfo[e.anchorindex].data[e.goodindex].stock) {
      util.showToast({
        title: '库存不足'
      })
    } else {
      this.data.orderInfo[e.anchorindex].data[e.goodindex].num++;
    }
    this.calculation();
  },
  /**
   * 提交订单
   */
  submitOrder: function () {
    if (this.data.receivingAddressData.addressid) {
      util.showLoad('正在生成支付订单...');
      this.createOrder();
    }
    else {
      util.showToast('请先选择收获地址');
      this.changeUserInfo();
    }
  },
  /**
   * 防伪签名
   */
  signature() {
    var code = util.getUserid() + "" + this.data.total,
      x = util.md5(util.base64(code)),
      iden = util.guid().slice(0, -4),
      sign = util.md5(x + iden);
    return {
      iden: iden,
      sign: sign
    };
  },
  /**
   * 生成订单
   */
  createOrder() {
    let code = this.signature();

    var skuinfo = []
    for (let i = 0; i < this.data.orderInfo.length; i++) {
      var obj = {
        anchorid: this.data.orderInfo[i].anchorid,
        couponNumber: this.data.orderInfo[i].couponnumber,
        data: []
      }
      for (let j = 0; j < this.data.orderInfo[i].data.length; j++) {
        var cobj = {
          productid: this.data.orderInfo[i].data[j].productid,
          skuid: this.data.orderInfo[i].data[j].skuid,
          num: this.data.orderInfo[i].data[j].num,
          cartid: this.data.orderInfo[i].data[j].cartid
        }
        obj.data.push(cobj)
      }
      skuinfo.push(obj)
    }

    let sources = 0;

    wx.getSystemInfo({
      success: function (res) {
        if (res.model.split('iPhone').length == 2) {
          sources = 1
        } else {
          sources = 2;
        }
      }
    })
    util.post('/api/Product/ProductOrder', {
      amount: this.data.total,
      addressid: this.data.receivingAddressData.addressid,
      iden: code.iden,
      sign: code.sign,
      sources: sources,
      enterid: this.data.enterid,
      entertype: this.data.entertype,
      ordertype: 1,
      skuinfo: JSON.stringify(skuinfo)
    }).then(res => {
      if (res.data.code == 1000) {
        util.hideLoad();
        this.payment(res.data.data[0].orderid);
      }
      else if (res.data.code == 7003) {
        util.showToast({
          title: "优惠卷已使用！"
        })
      }
      else if (res.data.code == 7000) {
        util.showToast({
          title: "库存不足！"
        })
      }
      else {
        console.log(res);
        util.showToast({
          title: "生成订单失败！"
        })
      }
    })
  },
  /**
   * 唤醒支付
   */
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
              util.pageJump('user')
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
   * 展开优惠券列表
   */
  selectCoupon: function (e) {
    this.showView(e.currentTarget.dataset.couponindex);
    this.showCoupon(e.currentTarget.dataset.couponindex);
  },
  /**
   * 显示优惠券
   */
  showCoupon(index) {
    this.data.selectCouponIndex = index;
    let tempList = this.data.couponListData[index];

    for (let i = 0; i < tempList.length; i++) {
      tempList[i].start = util.formatTimedate(tempList[i].validperiodstart).substring(5, 10).split('/').join('.')
      tempList[i].end = util.formatTimedate(tempList[i].validperiodend).substring(5, 10).split('/').join('.')

      if (this.data.orderInfo[index].select == i) {
        tempList[i].select = true;
      }
      else {
        tempList[i].select = false;
      }

      if (tempList[i].coupontype == 3) {
        let total = 0;
        for (let j = 0; j < this.data.orderInfo[index].data.length; j++) {
          total += parseInt(this.data.orderInfo[index].data[j].num) * parseFloat(this.data.orderInfo[index].data[j].price);
        }
        if (parseFloat(total) - 0.01 > parseFloat(tempList[i].minPrice)) {
          tempList[i].state = true;
        }
        else {
          tempList[i].state = false
        }
      }
      else {
        tempList[i].state = true;
      }
      for (let j = 0; j < this.data.orderInfo.length; j++) {
        if (this.data.orderInfo[j].couponnumber == tempList[i].couponnumber) {
          tempList[i].state = false;
          if (this.data.orderInfo[this.data.selectCouponIndex].couponnumber == tempList[i].couponnumber) {
            tempList[i].state = true;
          }
        }
      }

    }
    this.data.couponInfoList = tempList;
    this.setData({
      couponInfoList: this.data.couponInfoList
    })

  },
  /**
   * 选择优惠券
   */
  selectSingleCoupon(e) {
    if (e.currentTarget.dataset.state) {
      let isCancel = this.data.orderInfo[this.data.selectCouponIndex].couponnumber == this.data.couponInfoList[e.currentTarget.dataset.couponindex].couponnumber;
      this.data.orderInfo[this.data.selectCouponIndex].couponnumber = this.data.couponInfoList[e.currentTarget.dataset.couponindex].couponnumber;

      this.data.orderInfo[this.data.selectCouponIndex].select = e.currentTarget.dataset.couponindex;

      this.data.orderInfo[this.data.selectCouponIndex].subtotal = 0.00;

      for (let i = 0; i < this.data.orderInfo[this.data.selectCouponIndex].data.length; i++) {
        this.data.orderInfo[this.data.selectCouponIndex].subtotal += parseFloat(this.data.orderInfo[this.data.selectCouponIndex].data[i].price * this.data.orderInfo[this.data.selectCouponIndex].data[i].num);
      }

      if (isCancel) {
        this.data.orderInfo[this.data.selectCouponIndex].couponnumber = "";
        this.data.orderInfo[this.data.selectCouponIndex].select = -1;
      }
      else {

        if (this.data.couponInfoList[e.currentTarget.dataset.couponindex].coupontype == 1) {
          this.data.orderInfo[this.data.selectCouponIndex].subtotal *= parseFloat(this.data.couponInfoList[e.currentTarget.dataset.couponindex].price / 10).toFixed(2);
        }
        else if (this.data.couponInfoList[e.currentTarget.dataset.couponindex].coupontype == 2) {
          this.data.orderInfo[this.data.selectCouponIndex].subtotal -= parseFloat(this.data.couponInfoList[e.currentTarget.dataset.couponindex].price).toFixed(2);
        }
        else if (this.data.couponInfoList[e.currentTarget.dataset.couponindex].coupontype == 3) {
          this.data.orderInfo[this.data.selectCouponIndex].subtotal -= parseFloat(this.data.couponInfoList[e.currentTarget.dataset.couponindex].price).toFixed(2);
        }

        this.data.orderInfo[this.data.selectCouponIndex].subtotal = this.data.orderInfo[this.data.selectCouponIndex].subtotal < 0.01 ? 0.01 : this.data.orderInfo[this.data.selectCouponIndex].subtotal.toFixed(2);
      }

      let sum = 0;
      for (let i = 0; i < this.data.orderInfo.length; i++) {
        console.log(this.data.orderInfo[i].subtotal)
        sum = parseFloat(this.data.orderInfo[i].subtotal) * 100 + sum;
      }
      this.data.total = (sum / 100).toFixed(2);

      this.setData({
        orderInfo: this.data.orderInfo,
        total: this.data.total
      })
      this.hideModal();
    }
    else {
      util.showToast('无法使用该优惠券')
    }
  },
  showView(index) {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(680).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function () {
    this.hideView();
  },
  hideView() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(680).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {

      },
      fail: function (res) {
      }
    }
  },
  changeUserInfo() {
    //this.getAddressInfo();
    this.setData({
      showSelectAdd: true,
      isEdit: false
    })
  },
  //新建地址
  newAddress() {
    this.setData({
      showSelectAdd: false,
      isEdit: false,
      idAdd: 0,
      alterAddressData: {}
    })
  },
  //保持并使用var iosProvinceS = [];
  //var iosCityS = [];
  save() {
    let phoneTest = /^1(3|4|5|7|8)\d{9}$/;
    let selectproviceid = 0
    let selectcityid = 0

    for (let i = 0; i < iosProvinceS.length; i++) {

      if (iosProvinceS[i].value == this.data.region[0]) {
        selectproviceid = iosProvinceS[i].id
        break;
      }
    }
    for (let i = 0; i < iosCityS.length; i++) {
      if (iosCityS[i].value == this.data.region[1]) {
        selectcityid = iosCityS[i].id
        break;
      }
    }
    //新建
    if (this.data.idAdd == 0) {
      if (this.data.recipients == "" || selectproviceid == "" || this.data.phone == "" || this.data.DetailedSite == "" || selectcityid == "") {
        util.showToast({
          title: '请填写完整信息'
        })
      } else if (!phoneTest.test(this.data.phone)) {
        util.showToast({
          title: '手机格式不正确'
        })
      } else {
        util.get('/api/product/EditAddress', {
          addressid: selectproviceid,
          name: this.data.recipients,
          phone: this.data.phone,
          address: this.data.DetailedSite,
          areaid: selectcityid,
          state: this.data.state,
          type: this.data.idAdd
        }).then((res) => {
          if (res.data.code == 1000) {
            this.setData({
              isEdit: true
            })
          } else {
            console.log('修改地址失败：', res)
          }
        })
        this.getAddressInfo();
        this.setData({
          alterAddressData: {},
          recipients: '',
          DetailedSite: '',
          phone: '',
          state: 0
        })
      }
    }
    //编辑
    else if (this.data.idAdd == 1) {
      if (this.data.recipients == "" || selectproviceid == "" || this.data.phone == "" || this.data.DetailedSite == "" || selectcityid == "") {
        util.showToast({
          title: '请填写完整信息'
        })
      } else if (!phoneTest.test(this.data.phone)) {
        util.showToast({
          title: '手机格式不正确'
        })
      }
      else {
        util.get('/api/product/EditAddress', {
          addressid: this.data.alterAddressData.addressid || '',
          name: this.data.recipients || this.data.alterAddressData.name,
          phone: this.data.phone || this.data.alterAddressData.phone,
          address: this.data.DetailedSite || this.data.alterAddressData.detailaddress,
          areaid: selectcityid,
          state: this.data.state,
          type: this.data.idAdd
        }).then((res) => {
          if (res.data.code == 1000) {
            this.setData({
              isEdit: true
            })
          } else {
            console.log('修改地址失败：', res)
          }
        })
        this.getAddressInfo();
        this.setData({
          alterAddressData: {},
          recipients: '',
          DetailedSite: '',
          phone: "",
          state: 0
        })
      }
    }

  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  /**关闭*/
  isClose() {
    this.setData({
      isEdit: true,
      isSwitch:false
    })
  },
  /**返回 */
  isBack() {
    this.setData({
      showSelectAdd: true,
      isSwitch: false
    })
    this.setData({
      alterAddressData: {},
    })
  },
  /**
    * 编辑地址
    alterAddressData:{
            addressid:'',
            areaid:'',
            detailaddress:[],
            name:'',
            phone:''
          }
    */
  gotoEdite(e) {
    var area = []//满足于联动存放地区的数组
    var addressItem = {}
    addressItem = e.currentTarget.dataset.item;
    console.log(addressItem)
    var province = iosCityS.filter((item) => {
      return item.id == addressItem.areaid
    })

    var city = iosProvinceS.filter((item) => {
      return province[0].parentId == item.id
    })
    area.push(city[0].value)
    area.push(province[0].value)

    var alterAddressData = {}
    alterAddressData.name = addressItem.name
    alterAddressData.phone = addressItem.phone
    alterAddressData.detailaddress = addressItem.detailaddress
    alterAddressData.area = area
    alterAddressData.addressid = addressItem.addressid
    console.log(addressItem.state)
    this.setData({
      isEdit: false,
      showSelectAdd: false,
      alterAddressData: alterAddressData,
      idAdd: 1,
      region: area,

      state: addressItem.state == '1' ? true : false,
      isSwitch: addressItem.state == '1' ? true : false,
      recipients: addressItem.name,
      phone: addressItem.phone,
      DetailedSite: addressItem.detailaddress
    })
  }
})
