// pages/footprint/footprint.js
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[],
    img: util.image('nofoot.png'),
    isHidden:false,
    isBlank:true
  },
  initData:function(){
    var that = this;
    util.get('/api/LiveVideo/VideoWatchFootprints', {

    }).then((res)=>{
      console.log(res)
      if (res.data.code != 1000) {
        console.log('数据访问出错！')
      } else {
        var listData = res.data.data;
        if (res.data.data.length == 0) {
          this.setData({
            isHidden: true,
            isBlank: false
          })
        } else {
          this.setData({
            isHidden: true,
            isBlank: true
          })
        }
        var finaldata = [];
        var n = 0;
        var arr = listData.map((ele) => {
          return ele.date
        })
        let newArr = [...new Set(arr)]
        for (let i = 0; i < newArr.length; i++) {
          var s = listData.filter((ele) => {
            return ele.date == newArr[i];
          });
          finaldata.push(s)
        }

        that.setData({
          listData: finaldata
        })
  
      }
    })
  },
  /**
   * 查看足迹
   */
  checkprint:function(e){
    var checkListData = e.currentTarget.dataset.printindex;//带回整个点击事件的数据，包括日期和主播信息
    var anchorindex = e.currentTarget.dataset.anchorindex;//带回点击日期内所选中的主播的index值
    console.log(JSON.stringify(e));
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
  }
})