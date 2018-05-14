// pages/cart/cart.js
import util from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据 
   */
  data: {
    selectIcon: util.image('fuxuan.png'),
    selectedIcon: util.image('fuxuan2.png'),
    cartArr: [],//购物车数据
    selectArr: [],
    in: 0,
    isLaunch: false,
    url: "", //图片
    stock: '',//库存
    price: '',//价钱
    goodsNum: 0,//购买数量
    classify: '分类',//选择分类
    closeUrl: util.image('close.png'),
    noCarturl: util.image('noCart.png'),
    priceInfo: [],//价格相关信息
    attrInfo: [],//属性分类
    allSelect: false,//全选
    allPrice: 0,//总价
    allNum: 0,//总件数
    start: false,//结算开关
    productid: null,//商品id
    skuid: null,//属性id
    onCart: false,
    cartLoading: false
  },

  /******跳转到商品详情********/
  toProfitDetails(e) {
    let index = e.currentTarget.dataset.id[0];
    let ind = e.currentTarget.dataset.id[1];

    if (!this.data.cartArr[index].isEdit) {
      util.pageJump('profitDetails', {
        anchorid: this.data.cartArr[index].anchorid,
        productid: this.data.cartArr[index].prolist[ind].productid,
        skuid: this.data.cartArr[index].prolist[ind].skuid,
        goodsNum: this.data.cartArr[index].prolist[ind].num
      })
    }
  },
  /*******全选功能********/
  checkAll() {
    let allArr = this.data.cartArr.filter((ele) => {
      return ele.isAllSelect == true
    })
    let arrLength = this.data.cartArr.length;
    if (allArr.length == arrLength) {
      this.data.allSelect = true;
    } else {
      this.data.allSelect = false;
    }
  },
  /**************选择主播单个商品**************/
  isCheck(e) {
    let index = e.currentTarget.dataset.id[0];
    let ind = e.currentTarget.dataset.id[1];
    this.data.cartArr[index].prolist[ind].isSelect = !this.data.cartArr[index].prolist[ind].isSelect;
    if (this.data.cartArr[index].prolist[ind].isSelect) {
      this.data.allPrice = this.strip(this.data.allPrice) + this.strip(this.data.cartArr[index].prolist[ind].allPrice);
      this.data.allNum += parseInt(this.data.cartArr[index].prolist[ind].num);
    } else {
      this.data.allPrice = this.strip(this.data.allPrice) - this.strip(this.data.cartArr[index].prolist[ind].allPrice);
      this.data.allNum -= parseInt(this.data.cartArr[index].prolist[ind].num);
    };

    //存放所有isSelect为true
    let isSelectArr = [];
    for (let i = 0; i < this.data.cartArr.length; i++) {
      for (let j = 0; j < this.data.cartArr[i].prolist.length; j++) {
        isSelectArr = this.data.cartArr[i].prolist.filter(e => {
          return e.isSelect == true;
        })
      }
    };
    if (this.data.allNum == 0) {
      this.data.start = false;
    } else {
      this.data.start = true;
    }
    //满足条件的长度
    let conformLength = this.data.cartArr[index].prolist.length;
    let testArr = this.data.cartArr[index].prolist.filter((ele) => {
      return ele.isSelect == true;
    })
    if (testArr.length == conformLength) {
      this.data.cartArr[index].isAllSelect = true;
    } else {
      this.data.cartArr[index].isAllSelect = false;
    }
    //全选功能
    this.checkAll();
    this.setData({
      cartArr: this.data.cartArr,
      allSelect: this.data.allSelect,
      allNum: this.data.allNum,
      allPrice: this.strip(this.data.allPrice),
      start: this.data.start
    });
  },
  /**********************全选主播个人商品********************/
  isAllSelect(e) {
    this.data.allNum = 0;
    this.data.allPrice = 0;
    let index = e.currentTarget.dataset.id;
    this.data.cartArr[index].isAllSelect = !this.data.cartArr[index].isAllSelect;
    this.data.cartArr[index].prolist.forEach((ele) => {
      return ele.isSelect = this.data.cartArr[index].isAllSelect;
    })

    for (let i = 0; i < this.data.cartArr.length; i++) {
      for (let j = 0; j < this.data.cartArr[i].prolist.length; j++) {
        if (this.data.cartArr[i].prolist[j].isSelect) {
          this.data.allNum += parseInt(this.data.cartArr[i].prolist[j].num);
          this.data.allPrice = this.strip(this.data.allPrice) + this.strip(this.data.cartArr[i].prolist[j].allPrice);
        }
      }
    }
    if (this.data.allNum == 0) {
      this.data.start = false;
    } else {
      this.data.start = true;
    }

    //全选功能
    this.checkAll();
    this.setData({
      allSelect: this.data.allSelect,
      allNum: this.data.allNum,
      allPrice: this.strip(this.data.allPrice),
      cartArr: this.data.cartArr,
      start: this.data.start
    })
  },

  /**************全选事件*****************/
  allSelect() {
    this.data.allSelect = !this.data.allSelect;
    this.setData({
      allSelect: this.data.allSelect
    })
    let that = this;
    for (let i = 0; i < this.data.cartArr.length; i++) {
      this.data.cartArr[i].isAllSelect = that.data.allSelect;
      for (let j = 0; j < this.data.cartArr[i].prolist.length; j++) {
        this.data.cartArr[i].prolist[j].isSelect = that.data.allSelect;
      }
    }
    if (this.data.allSelect) {
      this.data.allNum = 0;
      this.data.allPrice = 0;
      for (let i = 0; i < this.data.cartArr.length; i++) {
        for (let j = 0; j < this.data.cartArr[i].prolist.length; j++) {
          this.data.allNum += parseInt(this.data.cartArr[i].prolist[j].num);
          this.data.allPrice = this.strip(this.data.allPrice) + this.strip(this.data.cartArr[i].prolist[j].allPrice);
        }
      }
    } else {
      for (let i = 0; i < this.data.cartArr.length; i++) {
        for (let j = 0; j < this.data.cartArr[i].prolist.length; j++) {
          this.data.allNum -= parseInt(this.data.cartArr[i].prolist[j].num);
          this.data.allPrice = this.strip(this.data.allPrice) - this.strip(this.data.cartArr[i].prolist[j].allPrice)
        }
      }
    }

    this.setData({
      cartArr: this.data.cartArr,
      allNum: this.data.allNum,
      allPrice: this.strip(this.data.allPrice),
      start: this.data.allSelect
    })

  },
  /***************浮点数解决方案***************/
  strip(num, precision = 3) {
    return +parseFloat(num.toPrecision(precision));
  },
  /*******************通用选择属性****************/
  isSelected(e) {
    let index = e.currentTarget.dataset.num[0];
    let ind = e.currentTarget.dataset.num[1];
    //点击的已选中
    if (this.data.attrInfo[index].attrValueList[ind].isSelect) {
      return;
    } else {
      for (let j = 0; j < this.data.attrInfo[index].attrValueList.length; j++) {
        this.data.attrInfo[index].attrValueList[j].isSelect = false;
      }
      this.data.attrInfo[index].attrValueList[ind].isSelect = true;

      this.setData({
        attrInfo: this.data.attrInfo
      })
      let arr = [];
      for (let i = 0; i < this.data.attrInfo.length; i++) {
        arr = [...arr, ...this.data.attrInfo[i].attrValueList.filter(ele => {
          return ele.isSelect == true;
        })];
      }
      let newSkuid = [];
      for (let i = 0; i < arr.length; i++) {
        newSkuid.push(arr[i].attrid);
      }
      //获得排列组合
      let arrange = this.permute([], newSkuid);
      let newArr = [];
      for (let i = 0; i < arrange.length; i++) {
        newArr = this.data.priceInfo.filter(ele => {
          return ele.skuid == arrange[i].join(':')
        });
        if (newArr.length > 0) {
          this.setData({
            stock: newArr[0].stock,
            skuid: newArr[0].skuid,
            price: newArr[0].price,
            url: newArr[0].imgurl,
            classify: this.intercept(newArr[0].attrdesc),
          })
        }
      }
    }
  },
  //排列组合
  permute(temArr, testArr) {
    let permuteArr = [];
    let arr = testArr;
    function innerPermute(temArr) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (temArr.length == len - 1) {
          if (temArr.indexOf(arr[i]) < 0) {
            permuteArr.push(temArr.concat(arr[i]));
          }
          continue;
        }
        if (temArr.indexOf(arr[i]) < 0) {
          innerPermute(temArr.concat(arr[i]));
        }
      }
    }
    innerPermute(temArr);
    return permuteArr;
  },
  //增加
  add(e) {
    let index = e.currentTarget.dataset.id[0];
    let ind = e.currentTarget.dataset.id[1];
    let anchorid = parseInt(this.data.cartArr[index].anchorid);
    let productid = parseInt(this.data.cartArr[index].prolist[ind].productid);
    this.data.cartArr[index].prolist[ind].num++;
    this.data.cartArr[index].prolist[ind].allPrice = parseInt(this.data.cartArr[index].prolist[ind].num) * parseFloat(this.data.cartArr[index].prolist[ind].price)
    this.setData({
      cartArr: this.data.cartArr
    })
  },
  //减少
  minus(e) {
    let index = e.currentTarget.dataset.id[0];
    let ind = e.currentTarget.dataset.id[1];
    if (this.data.cartArr[index].prolist[ind].num == 1) {
      return;
    } else {
      this.data.cartArr[index].prolist[ind].num--;
      this.data.cartArr[index].prolist[ind].allPrice = parseInt(this.data.cartArr[index].prolist[ind].num) * parseFloat(this.data.cartArr[index].prolist[ind].price)
    }
    this.setData({
      goodsNum: this.data.cartArr[index].prolist[ind].num,
      cartArr: this.data.cartArr
    })

  },
  //删除
  remove(e) {
    let index = e.currentTarget.dataset.id[0];
    let ind = e.currentTarget.dataset.id[1];
    let obj = this.data.cartArr[index].prolist[ind];
    util.showModal({
      content: '您确定要删除商品',
      complete: (res) => {
        if (res.confirm) {
          util.get('/api/Product/UpdateShoppingCart', {
            type: 1,
            productid: parseInt(obj.productid),
            cartid: parseInt(obj.cartid),
            skuid: parseInt(obj.skuid),
            num: parseInt(obj.num)
          }).then((res) => {
            if (res.data.code == '1000') {
              util.get('/api/Product/ShoppingCartList', {
                userid: util.getUserid(),
                token: util.getToken()
              }).then((res) => {

                this.setData({
                  cartArr: res.data.data
                })
              })
            } else {
              console.log('更新购物车失败')
            }
          })
        }
      }
    })
  },

  //编辑
  edit(e) {
    let index = e.currentTarget.dataset.id;
    if (this.data.cartArr[index].isEdit) {
      this.data.cartArr[index].isEdit = false;
      this.data.allNum = 0;
      this.data.allPrice = 0;

      for (let i = 0; i < this.data.cartArr.length; i++) {
        for (let j = 0; j < this.data.cartArr[i].prolist.length; j++) {
          if (this.data.cartArr[i].prolist[j].isSelect) {
            this.data.allNum += parseInt(this.data.cartArr[i].prolist[j].num);
            this.data.allPrice = this.strip(this.data.allPrice) + this.strip(this.data.cartArr[i].prolist[j].allPrice);
          }
        }
      }

      this.setData({
        allNum: this.data.allNum,
        allPrice: this.data.allPrice,
        cartArr: this.data.cartArr
      })
    } else {
      this.data.cartArr[index].isEdit = true;
      this.setData({
        cartArr: this.data.cartArr
      })
    }
  },
  //悬浮窗确定按钮
  goBuys() {
    if (parseInt(this.data.goodsNum) >= parseInt(this.data.stock)) {
      util.showToast({
        title: '库存不足'
      });
      return;
    } else {
      let skuid;
      let that = this;
      if (this.data.attrInfo.length == 1) {
        skuid = this.data.skuid;
      } else {
        let attrname1 = this.data.classify.split(' ')[1];
        let key1 = this.data.attrInfo[1].attrname;
        let attrdesc1 = key1 + ":" + attrname1;
        let key0 = this.data.attrInfo[0].attrname;
        let attrname0 = this.data.classify.split(' ')[0];
        let attrdesc0 = key0 + ":" + attrname0;
        let attrdesc = attrdesc0 + ";" + attrdesc1;
        let newArr = this.data.priceInfo.filter((ele) => {
          return ele.attrdesc == attrdesc
        })
        skuid = newArr[0].skuid
      }
      util.get('/api/Product/UpdateShoppingCart', {
        type: 0,
        productid: this.data.productid,
        cartid: this.data.cartid,
        skuid: skuid,
        num: this.data.goodsNum,
      }).then((res) => {
        if (res.data.code == "1000") {
          that.getData();
          that.isClose();
        } else {
          console.log('获取信息错误')
        }
      })
    }
  },
  //截取classify函数
  intercept(str) {
    let arr = [...str.split(';').map(ele => {
      return ele.split(':')[1];
    })];
    return arr.join(' ');
  },
  //悬浮窗
  isLaunch(e) {
    let index = e.currentTarget.dataset.id[0];
    let ind = e.currentTarget.dataset.id[1];
    this.data.anchorid = parseInt(this.data.cartArr[index].anchorid);
    this.data.productid = parseInt(this.data.cartArr[index].prolist[ind].productid);
    this.data.cartid = parseInt(this.data.cartArr[index].prolist[ind].cartid);
    this.data.skuid = this.data.cartArr[index].prolist[ind].skuid;
    util.get('/api/Product/ProductPrice', {
      productid: this.data.productid,
      anchorId: this.data.anchorid,
      type: 1
    }).then((res) => {
      if (res.data.code == "1000") {
        //插入变量用于判断选中
        for (let i = 0; i < res.data.data.attrInfo.length; i++) {
          for (let j = 0; j < res.data.data.attrInfo[i].attrValueList.length; j++) {
            res.data.data.attrInfo[i].attrValueList[j].isSelect = false;
          }
        }

        //stock,imgurl,price
        let arr = res.data.data.priceInfo.filter((ele) => {
          return ele.skuid == this.data.skuid;
        })
        //选中相应属性
        for (let i = 0; i < this.data.skuid.split(':').length; i++) {
          for (let j = 0; j < res.data.data.attrInfo.length; j++) {
            let IsSelect = res.data.data.attrInfo[j].attrValueList.filter(ele => {
              return ele.attrid == this.data.skuid.split(':')[i]
            })
            if (IsSelect.length > 0) {
              IsSelect[0].isSelect = true;
            }
          }
        }

        this.setData({
          attrInfo: res.data.data.attrInfo,
          priceInfo: res.data.data.priceInfo,
          productid: this.data.productid,
          cartid: this.data.cartid,
          skuid: this.data.skuid,
          url: arr[0].imgurl,
          price: arr[0].price,
          stock: arr[0].stock,
          classify: this.intercept(arr[0].attrdesc),
          goodsNum: this.data.cartArr[index].prolist[ind].num
        })
      }
    })
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(375).step()
    this.setData({
      animationData: animation.export(),
      isLaunch: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 50)
  },
  //悬浮窗减1
  boxMinus() {
    if (this.data.goodsNum == 1) {
      return;
    } else {
      this.data.goodsNum--;
      this.setData({
        goodsNum: this.data.goodsNum
      })
    }
  },
  //悬浮窗加1
  boxAdd() {
    if (parseInt(this.data.goodsNum) >= parseInt(this.data.stock)) {
      util.showToast({
        title: '库存不足'
      });
      return;
    } else {
      this.data.goodsNum++;
    }
    this.setData({
      goodsNum: this.data.goodsNum
    })
  },
  //关闭悬浮窗
  isClose() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(375).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        isLaunch: false
      })
    }.bind(this), 50)

  },
  //关闭所有悬浮窗
  isTest() {
    this.isClose();
  },

  //立即购买
  goSettleAccount() {
    //满足条件的数组
    let arr = [];
    for (let i = 0; i < this.data.cartArr.length; i++) {
      arr = [...arr, ...this.data.cartArr[i].prolist.filter((ele) => {
        return ele.isSelect == true;
      })]
    }
    let cartList = [];
    for (let i = 0; i < arr.length; i++) {
      cartList = [...cartList, arr[i].cartid]
    }

    util.pageJump('orderConfirm', {
      cartList: JSON.stringify(cartList)
    })
  },
  onLoad:function(){
    wx.setNavigationBarTitle({
      title: '购物车',
    });
    this.setData({
      in: this.data.cartArr.length - 1
    });
    this.getData();
  },

  getData() {
    util.get('/api/Product/ShoppingCartList', {
    }).then((res) => {
      if (res.data.code == "1000") {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].isEdit = false;//编辑
          res.data.data[i].isAllSelect = false;//全选
          for (let j = 0; j < res.data.data[i].prolist.length; j++) {
            res.data.data[i].prolist[j].isSelect = false;//商品选择
            res.data.data[i].prolist[j].allPrice = parseInt(res.data.data[i].prolist[j].num) * parseFloat(res.data.data[i].prolist[j].price);//总价
          }
        }
        if (res.data.data.length == 0) {
          this.setData({
            onCart: true,
            cartLoading: true
          })
        } else {
          this.setData({
            cartArr: res.data.data,
            cartLoading: true
          });
        }

      } else {
        console.log('访问数据出错')
      }
    })
  },
})