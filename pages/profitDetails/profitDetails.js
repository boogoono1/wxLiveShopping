// pages/profitDetails/profitDetails.js
import util from "../../utils/util.js";
let app=getApp();
Page({
  data: {
    url: "",
    stock: '',//库存
    price: '',//价钱
    closeUrl: util.image('close.png'),
    indicatorColor: '#cbcbcb',
    indicatorActiveColor: '#e3656f',
    id: 1,//头部选择
    goodsNum: 1,//购买数量
    classify: '分类',//选择分类
    variable: 0,
    height: 0,
    idName: 'old',
    scrollTop: 0,
    toView: 'ok',
    isLaunch: false,//颜色悬浮窗开关
    parameterIsLaunch: false,//产品悬浮窗开关
    goodsObj: {//商品信息
      name: '',
      price: '',
      originprice: '',
      salesnum: ''
    },
    turnimg: [],//轮播图地址
    infoimg: [],//商品详情图地址
    otherparameters: [],//商品参数
    priceInfo: [],//价格相关信息
    attrInfo: [],//属性分类
    isFill:false
  },
  //头部选择
  isClick(event) {
    var id = event.currentTarget.dataset.id;
    if (this.data.id == id) {
      return;
    } else {
      if (id == '2') {
        this.setData({
          id: 2,
          idName: "detail"
        })
      } else if (id == "1") {
        this.setData({
          id: 1,
          scrollTop: 0
        })
      }
    }
  },
  //截取classify函数
  intercept(str) {
    let arr = [...str.split(';').map(ele => {
      return ele.split(':')[1];
    })];
    return arr.join(' ');
  },
  //颜色选择悬浮窗
  isLaunch() {
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
  //关闭颜色选择悬浮窗
  colorIsClose() {
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
  //产品参数悬浮窗
  isOpen() {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(375).step()
    this.setData({
      animationData: animation.export(),
      parameterIsLaunch: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 50)
  },
  //关闭产品参数悬浮窗
  isOk() {
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
        parameterIsLaunch: false
      })
    }.bind(this), 50)
  },
  //关闭所有悬浮窗
  isTest() {
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
        parameterIsLaunch: false,
        isLaunch: false
      })
    }.bind(this), 50)
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
          this.skuid = newArr[0].skuid;
          this.setData({
            attrInfo: this.data.attrInfo,
            stock: newArr[0].stock,
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

  //悬浮窗确定
  ok() {
    let arr = [];
    for (let i = 0; i < this.data.attrInfo.length; i++) {
      arr = [...arr, ...this.data.attrInfo[i].attrValueList.filter(ele => {
        return ele.isSelect == true;
      })];
    }
    if (this.data.attrInfo.length == arr.length) {
      console.log(this.data.goodsNum);
      if (this.data.goodsNum <= this.data.stock) {
        util.pageJump('orderConfirm', {
          productid: this.productid,
          skuid: this.skuid,
          producttype: 1,
          buynumber: this.data.goodsNum,
          anchorid: this.anchorid,
          entertype: 3,
        })
        this.colorIsClose();
      } else {
        util.showToast({ title: '库存不足' })
      }
    }
    else {
      util.showToast({ title: '请选择属性' })
    }
  },
  /********立即购买**********/
  goBuys() {
    this.isLaunch();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.productid = options.productid;
    this.attrdesc = options.attrdesc;
    this.anchorid = options.anchorid;
    this.skuid = options.skuid;
    this.goodsNum = options.goodsNum;
    if (app.globalData.isIphoneX) {
      this.setData({
        isFill: true
      })
    } 

    wx.getSystemInfo({
      success: (res)=>{
        this.setData({
          height: res.windowHeight
        })
      },
    })
  },

  onShow() {
    util.get('/api/Product/ProductInfo', {
      productid: this.productid
    }).then((res) => {
      if (res.data.code == "1000") {
        this.setData({
          goodsObj: {
            name: res.data.data.name,
            price: res.data.data.price,
            originprice: res.data.data.originprice,
            salesnum: res.data.data.salesnum
          },
          turnimg: res.data.data.turnimg,
          infoimg: res.data.data.infoimg,
          otherparameters: res.data.data.otherparameters,
        });
      }
    })
    util.get('/api/Product/ProductPrice', {
      productid: this.productid,
      anchorid: this.anchorid,
      type: 1,
    }).then((res) => {
      if (res.data.code == '1000') {
        console.log(res.data.data)
        //添加选择属性
        for (let i = 0; i < res.data.data.attrInfo.length; i++) {
          for (let j = 0; j < res.data.data.attrInfo[i].attrValueList.length; j++) {
            if (res.data.data.attrInfo[i].attrValueList.length==1){
              res.data.data.attrInfo[i].attrValueList[0].isSelect=true;
              this.data.classify = res.data.data.attrInfo[i].attrValueList[0].attrname
           }else{
             res.data.data.attrInfo[i].attrValueList[j].isSelect = false;
           }
          }
        }
        
      
        //stock,imgurl,price
        if (this.skuid) {
          let arr = res.data.data.priceInfo.filter((ele) => {
            return ele.skuid == this.skuid;
          })

          //选中相应属性
          for (let i = 0; i < this.skuid.split(':').length; i++) {
            for (let j = 0; j < res.data.data.attrInfo.length; j++) {
              let IsSelect = res.data.data.attrInfo[j].attrValueList.filter(ele => {
                return ele.attrid == this.skuid.split(':')[i]
              })
              if (IsSelect.length > 0) {
                IsSelect[0].isSelect = true;
              }
            }
          }


          this.setData({
            url: arr[0].imgurl,
            price: arr[0].price,
            stock: arr[0].stock,
            classify: this.intercept(arr[0].attrdesc),
            goodsNum: this.goodsNum || 1
          })
        } else if (this.attrdesc) {
          let arr = res.data.data.priceInfo.filter((ele) => {
            return ele.attrdesc == this.attrdesc;
          })
          this.skuid = arr[0].skuid;
          //选中相应属性
          for (let i = 0; i < this.skuid.split(':').length; i++) {
            for (let j = 0; j < res.data.data.attrInfo.length; j++) {
              let IsSelect = res.data.data.attrInfo[j].attrValueList.filter(ele => {
                return ele.attrid == this.skuid.split(':')[i]
              })
              if (IsSelect.length > 0) {
                IsSelect[0].isSelect = true;
              }
            }
          }

          this.setData({
            url: arr[0].imgurl,
            price: arr[0].price,
            stock: arr[0].stock,
            classify: this.intercept(arr[0].attrdesc),
            goodsNum: this.goodsNum || 1
          })
        } else {
          this.setData({
            url: res.data.data.priceInfo[0].imgurl,
            price: res.data.data.priceInfo[0].price,
            stock: res.data.data.priceInfo[0].stock,
            classify: this.data.classify || '分类'
          })
        }
        this.setData({
          attrInfo: res.data.data.attrInfo,
          priceInfo: res.data.data.priceInfo,
        })
      }
    })
  },
  pageScroll(e) {
    let scrollTop = 600;
    if (this.data.height == 504) {
      scrollTop = 534;
    } else if (this.data.height == 603) {
      scrollTop = 634;
    } else if (this.data.height == 663) {
      scrollTop = 687;
    }
    if (e.detail.scrollTop >= scrollTop) {
      this.setData({
        id: 2
      })
    } else {
      this.setData({
        id: 1
      })
    }
  },

})