// pages/home/home.js
var api = require("../../utils/api.js")
const App = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannar: [],
    computedCategories: [],
    user: {}
  },

  toDetail(event) {
    App.toDetail(event.currentTarget.dataset.productid)
  },

  addToCart (event) {
    let productObj = event.target.dataset.productobj
    let carts = App.globalData.carts
    for (let i = 0; i < carts.length; i++) {
      if (productObj.id === carts[i].productId) {
        productObj.num = carts[i].num
        productObj.num++
      }
    }
    App.addToCart(productObj)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: api.host + "/bannar",
      success: (res) => {
        this.setData({
          bannar: res.data
        })
      }
    })
    let computedCategories = App.globalData.computedCategories
    if (computedCategories.length > 0) {
      this.setData({
        computedCategories: computedCategories
      })
    } else {
      App.getComputedCategories(computedCategories => {
        this.setData({
          computedCategories: computedCategories
        })
      })
    }
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
      user: App.globalData.user
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