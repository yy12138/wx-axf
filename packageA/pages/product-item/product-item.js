var Api = require("../../../utils/api.js")
var App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    product: {},
    cartNum: 0,
    cartsLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: Api.host + "/products/" + options.id,
      success: (res) => {
        this.setData({
          product: res.data
        })
        if (this.data.user.id) {
          wx.request({
            url: Api.host + "/carts?productId=" + options.id,
            success: res => {
              if (res.data.length) {
                this.setData({
                  cartNum: res.data[0].num
                })
              } else {
                this.setData({
                  cartNum: 0
                })
              }
            }
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      user: App.globalData.user,
      cartsLength: App.globalData.cartLength
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})