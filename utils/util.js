
import Base64 from './base64/base64.modified.js';
import { hexMD5 } from './md5/MD5.js';

const util = {
  imgPath: "http://106.14.221.147:10022/image/",
  apiPath: "https://xiaochengxu.boogoo.tv:999",
  image(imgName) {
    return this.imgPath + imgName
  },
  getUserid() {
    return 10470
    return wx.getStorageSync('userid') == '' ? 0 : wx.getStorageSync('userid');
  },
  getToken() {
    return "8B3D0BBEC8CDE97F3BFCF100A2EACDDC"
    return wx.getStorageSync('token') == '' ? 0 : wx.getStorageSync('token');
  },
  base64(code) {
    return Base64.encode(code);
  },
  md5(code) {
    return hexMD5(code);
  },
  guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  formatTimedate() {
    let date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  getEffectiveData(afferentObject) {
    let tempObject = {};
    for (let i in afferentObject) {
      tempObject[i] = afferentObject[i]
    }
    return tempObject;
  },

  showModal(modelObject) {
    if (modelObject.title == null) {
      modelObject.title = '系统提示'
    }
    modelObject = this.getEffectiveData(modelObject);
    return wx.showModal(modelObject)
  },

  showToast(toastObject) {
    if (toastObject.image != null) {
      toastObject.image = '../../utils/image/' + toastObject.image + '.png'
    }
    if (toastObject.icon == null) {
      toastObject.icon = 'none'
    }
    toastObject = this.getEffectiveData(toastObject);
    return wx.showToast(toastObject);
  },

  showLoad(title) {
    if (title == null) {
      title = '请稍等...'
    }
    return wx.showLoading({
      title
    })
  },

  hideLoad() {
    return wx.hideLoading();
  },
  getStorageSync(key) {
    return wx.getStorageSync(key)
  },
  setStorageSync(key, value) {
    try {
      wx.setStorageSync(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },
  //页面跳转
  pageJump(url, objectData) {
    let urlText = "";
    urlText += '../' + url + '/' + url;
    urlText += '?userid=' + this.getUserid();

    for (let item in objectData) {
      urlText += '&' + item + '=' + objectData[item];
    }

    let urlPage = ['index', 'user', 'anchor'];

    if (urlPage.indexOf(url) > -1) {
      wx.reLaunch({
        url: urlText
      })
    }
    else {
      wx.navigateTo({
        url: urlText
      })
    }
  },
  get(url, getData) {
    getData.userid = this.getUserid();
    getData.token = this.getToken();
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.apiPath + url,
        data: getData,
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT 
        // header: {}, // 设置请求的 header 默认是application/json 
        complete: function (res) {
          resolve(res);
        }
      })
    });
  },

  post(url, postData) {
    postData.userid = this.getUserid();
    postData.token = this.getToken();
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.apiPath + url,
        data: postData,
        method: 'POST',
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        complete: function (res) {
          resolve(res);
        }
      })
    });
  }
}

export default util;
