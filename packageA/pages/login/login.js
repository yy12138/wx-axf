var App = getApp()
var Api = require('../../../utils/api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    hiddenBol: false,
    computedCategories: []
  },

  hindHidden () {
    this.setData({
      hiddenBol: true
    })
  },

  hindDisplay () {
    this.setData({
      hiddenBol: false
    })
  },

  getTel (event) {
    let userObj = {
      phone: event.detail.value
    }
    this.setData({
      user: userObj
    })
  },

  vertifyUser () {
    var userObj = this.data.user
    let phone = this.data.user.phone
    let reg = /^1[35678]\d{9}$/g
    if (reg.test(phone)) {
      wx.request({
        url: Api.host + "/users?phone=" + phone,
        success: (res) => {
          if (res.data.length) {
            App.globalData.user = res.data[0]
            wx.request({
              url: Api.host + "/users/" + res.data[0].id + "/carts",
              success: (res) => {
                let carts = res.data
                let computedCategories = this.data.computedCategories
                App.globalData.carts = carts
                for (let i = 0; i < computedCategories.length; i++) {
                  let products = computedCategories[i].products
                  for (let j = 0; j < products.length; j++) {
                    for ( let z = 0; z < carts.length; z++ ) {
                      if (carts[z].productId === products[j].id) {
                        products[j].num = carts[z].num
                      }
                    }
                  }
                }
                App.globalData.computedCategories = computedCategories
              }
            })
            wx.switchTab({
              url: '../../../pages/home/home'
            })
          } else {
            wx.request({
              url: Api.host + "/users",
              method: "POST",
              data: userObj,
              success: (res) => {
                App.globalData.user = res.data
                wx.switchTab({
                  url: '../../../pages/home/home'
                })
              }
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      computedCategories: App.globalData.computedCategories
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