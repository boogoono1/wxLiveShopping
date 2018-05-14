// pages/ordersConfirm/orderConfirm.js
import util from "../../utils/util"
import Base64 from '../../utils/base64/base64.modified';
var iosProvinceS = [];
var iosCityS = [];

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
    state: 1,//地址默认状态
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
    isHidden:false
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
  bindKeyInput(e) {
    let  phoneTest = /^1(3|4|5|7|8)\d{9}$/;
    let  phone = e.detail.value
    if (phone.trim().length == 11) {
      if (phoneTest.test(phone)) {
        this.phone = phone;
      }
    }

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
    if (options.cartList) {
      let cartList = JSON.parse(options.cartList)
      this.initData(2);
    }
    else {
      let _data = this.data;

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
      this.getAddressInfo();
    }

  },

  /**
   * 初始化数据
   * 1 常规进入
   * 2 购物车进入
   */

  initData: function (index) {

    let _this = this.data;


    if (index == 1) {
      this.data.orderInfo = [{
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
        this.data.orderInfo[i].subtotal += this.data.orderInfo[i].data[j].price * this.data.orderInfo[i].data[j].num
      }
      this.data.total += this.data.orderInfo[i].subtotal;
    }
    this.setData({
      total: this.data.total,
      orderInfo: this.data.orderInfo
    })
  },
  /**
   * 获取主播信息 
   */
  getAnchorInfo(index) {
    util.get('/api/Anchor/AnchorMessage', {
      userid: util.getUserid(),
      anchorid: this.data.anchorid
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
  getProductInfo(index) {
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

        this.couponListData = res.data.data

        for (let i = 0; i < this.data.orderInfo.length; i++) {
          this.data.orderInfo[i].select = -1;
          if (this.couponListData[i].length > 0) {
            this.data.orderInfo[i].hasCoupon = true;
          }
          else {
            this.data.orderInfo[i].hasCoupon = false;
          }
        }
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
        if (res.data.data.length!=0){
          this.data.isHidden=true;
        }else{
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
    util.showLoad('正在生成订单');
    this.createOrder();
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
      skuinfo: JSON.stringify(skuinfo)
    }).then(res => {
      if (res.data.code == 1000) {
        util.hideLoad();
        this.payment(res.data.data[0].orderid);
      } else {
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
   * 点击弹出选择优惠券
   * 获取点击的主播订单index值
   */
  selectCoupon: function (e) {
    this.setData({
      selectCouponIndex: e.target.dataset.couponindex
    })
    this.showView();
  },
  /**
   * 选择优惠券后的带回参数事件couponInfo
   * 'decreasePrice':
   * 'type':
   */
  showView() {
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
    console.log('onk')
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
    var selectproviceid = 0
    var selectcityid = 0
    var DetailedSite = this.data.DetailedSite;
    var recipients = this.data.recipients
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
    if(this.data.idAdd==0){
      if (this.data.recipients == "" || this.data.alterAddressData.addressid == "" || this.phone == "" || this.data.DetailedSite == "" || selectcityid == "") {
        util.showToast({
          title: '请填写完整信息'
        })
      } else if (!phoneTest.test(this.phone)) {
        util.showToast({
          title: '手机格式不正确'
        })
      }else {
        util.get('/api/product/EditAddress', {
          addressid: this.data.alterAddressData.addressid,
          name: recipients,
          phone: this.phone,
          address: DetailedSite,
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
          recipients:'',
          DetailedSite:'',
        })
        this.phone="";
      }
    }
    //编辑
    else if(this.data.idAdd==1){
      if (this.data.alterAddressData.name == "" || this.data.alterAddressData.detailaddress=="" || this.data.alterAddressData.phone == "" || this.data.alterAddressData.area.length==0 || this.data.alterAddressData.addressid==""){
        util.showToast({
          title: '请填写完整信息'
        })
      }else if(this.phone!=undefined){
          if (!phoneTest.test(this.phone)) {
        util.showToast({
          title: '手机格式不正确'
        })
      }
      }
      else{
        util.get('/api/product/EditAddress', {
          addressid: this.data.alterAddressData.addressid,
          name: recipients || this.data.alterAddressData.name ,
          phone: this.phone || this.data.alterAddressData.phone,
          address: DetailedSite || this.data.alterAddressData.detailaddress,
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
      isEdit: true
    })
  },
  /**返回 */
  isBack() {
    this.setData({
      showSelectAdd: true
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
    addressItem = e.currentTarget.dataset.item
    var province = iosCityS.filter((item) => {
      return item.id == addressItem.areaid
    })

    var city = iosProvinceS.filter((item) => {
      return province[0].parentId == item.id
    })
    area.push(province[0].value)
    area.push(city[0].value)
    var alterAddressData = {}
    alterAddressData.name = addressItem.name
    alterAddressData.phone = addressItem.phone
    alterAddressData.detailaddress = addressItem.detailaddress
    alterAddressData.area = area
    alterAddressData.addressid = addressItem.addressid

    this.setData({
      isEdit: false,
      showSelectAdd: false,
      alterAddressData: alterAddressData,
      idAdd: 1,
      region: area
    })
  }
})
