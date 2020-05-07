// pages/tools/tools.js
Page({

  mixins: [require('../../themeChanged/themeChanged')],

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 地图
   */
  navigateToMap: function () {
   wx.navigateTo({
     url: '../../pages/map/map',
   })
  }

})