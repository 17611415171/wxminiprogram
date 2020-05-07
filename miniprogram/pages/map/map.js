// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markerList: [], //地图的markerList
    includePoints: [], //地图的所有marker显示在当前页面

    hasSearchImg: true
  },



  /**
   * 加载页面
   * @param {markList}} res 
   */
  onLoad: function (res) {
    //接收markers
    if (res.markerList != null) {
      this.setData({
        hasSearchImg: false, //隐藏搜索图标
        markerList: JSON.parse(res.markerList) //反序列化数组
      })

      //载入所有point供显示所有marker
      var includePointsTmp = []
      for (var i = 0; i < this.data.markerList.length; i++) {
        includePointsTmp.push({
          latitude: this.data.markerList[i].latitude,
          longitude: this.data.markerList[i].longitude,
        })
      }
      this.setData({
        includePoints: includePointsTmp
      })
    } else {
      //移动到当前位置
      this.positionToLoc();
    }
  },



  /**
   * 返回到当前位置
   */
  positionToLoc: function () {
    //获取地图context
    const mapCtx = wx.createMapContext('map', this);
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      altitude: 'true',
      complete: (res) => {},
      fail: (res) => {},
      //highAccuracyExpireTime: 3001, //高精度延迟
      //isHighAccuracy: true, //开启高精度
      success: (res) => {
        mapCtx.moveToLocation({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
    })
  },



  /**
   * 点击POI
   */
  mapBindPOI: function (res) {
    console.log(res.detail.name)
    console.log(res.detail.longitude)
    console.log(res.detail.latitude)
    //mark POI
    var tmpMarker = []
    tmpMarker.push({
      id: 0,
      title: res.detail.name,
      callout: {
        content: res.detail.name,
        padding: 12,
        display: 'ALWAYS',
        fontSize: 14,
        textAlign: 'left',
        borderRadius: 4,
        borderWidth: 2,
        bgColor: '#ffffff'
      },
      latitude: res.detail.latitude,
      longitude: res.detail.longitude
    })
    this.setData({
      markerList: tmpMarker
    })
  },



  /**
   * 点击气泡事件返回markerId
   * @param {markerId} res 
   */
  mapBindCallout: function (res) {
    console.log("点击了气泡" + res.detail.markerId)
    var id = res.detail.markerId;
    var name = this.data.markerList[id].title;
    var latitude = this.data.markerList[id].latitude;
    var longitude = this.data.markerList[id].longitude;
    console.log(name)
    console.log(latitude)
    console.log(longitude)
    this.navigateToMap(name, latitude, longitude)
  },



  /**
   * 跳转到导航
   * @param {名称} name 
   * @param {纬度} latitude 
   * @param {经度} longitude 
   */
  navigateToMap: function (name, latitude, longitude) {
    let plugin = requirePlugin('routePlan');
    let key = '26ABZ-KBCA3-UM73A-YHQWH-VSW4H-LYFNO'; //使用在腾讯位置服务申请的key
    let referer = 'wxd992a543613d0e0f'; //调用插件的app的名称
    let endPoint = JSON.stringify({ //终点
      'name': name,
      'latitude': latitude,
      'longitude': longitude
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
  },



  /**
   * 跳转到搜索页面
   */
  navigateToSearch: function () {
    wx.navigateTo({
      url: '/pages/mapsearch/mapsearch',
    })
  }

})