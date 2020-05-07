// pages/mapsearch/mapsearch.js

Page({

  mixins: [require('../../themeChanged/themeChanged')],

  data: {
    inputShowed: false,
    inputVal: "",
    suggestion: [],
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },



  //触发关键词输入提示事件
  getsuggest: function (e) {

    // 引入SDK核心类
    var QQMapWX = require('../../tencent/qqmap-wx-jssdk');

    // 实例化API核心类
    var qqmapsdk = new QQMapWX({
      key: '26ABZ-KBCA3-UM73A-YHQWH-VSW4H-LYFNO' // 必填
    });

    var _this = this;
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) { //搜索成功后的回调
        
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug
        });
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },

  /**
   * 返回上一个页面
   */
  navigateBack1: function () {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 点击搜索结果的某一条
   * @param {} res https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/methodGetsuggestion
   */
  markerSuggest: function (res) {
    var markers = [];
    console.log(res.currentTarget.dataset.index)
    markers.push({
        id: 0,
        latitude: this.data.suggestion[res.currentTarget.dataset.index].latitude,
        longitude: this.data.suggestion[res.currentTarget.dataset.index].longitude,
        title: this.data.suggestion[res.currentTarget.dataset.index].title,
        callout: {
          content: this.data.suggestion[res.currentTarget.dataset.index].title,
          padding: 12,
          display: 'ALWAYS',
          fontSize: 14,
          textAlign: 'left',
          borderRadius: 4,
          borderWidth: 2,
          bgColor: '#ffffff'
        },
      }),
      wx.navigateTo({
        url: '/pages/map/map?markerList=' + JSON.stringify(markers),
      })
  }
})