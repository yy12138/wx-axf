var App = getApp()
var Api = require("../../utils/api.js")

// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total: 0,
    user: {},
    carts: [],
    timeRange: [],
    timeIndex: [0,0],
    allSelected: false
    // [["今天","明天","后天"],["30分钟送达","10:00"]]
    //第一列根据当前时间 确定times列表 
  },

  //全选或全不选
  changeAllSelected () {
    let carts = this.data.carts
    let allSelected = this.data.allSelected
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = !allSelected
      wx.request({
        url: Api.host + "/carts/" + carts[i].id,
        method: "PUT",
        data: {
          id: carts[i].id,
          userId: carts[i].userId,
          selected: carts[i].selected,
          num: carts[i].num,
          img: carts[i].img,
          name: carts[i].name,
          price: carts[i].price,
          productId: carts[i].productId
        }
      })
    }
    this.setData({
      carts: carts,
      allSelected: !allSelected
    })
    App.globalData.allSelected = this.data.allSelected
    App.globalData.carts = carts
    App.total_cartsLength()
    this.setData({
      total: App.globalData.total,
      allSelected: App.globalData.allSelected
    })
  },

  toDetail(event) {
    App.toDetail(event.currentTarget.dataset.productid)
  },

  addToCart(event) {
    let cartObj = event.target.dataset.productobj
    let carts = this.data.carts
    console.log(carts)
    //bug  carts的数量直接被更改 造成前后数量没变化
    for (let i = 0; i < carts.length; i++) {
      if (cartObj.id === carts[i].id) {
        cartObj.num++
        carts[i].num++
        break
      }
    }
    this.setData({
      carts: carts
    })
    let productObj = {
      id: cartObj.productId,
      num: cartObj.num
    }
    App.addToCart(productObj)

    this.setData({
      total: App.globalData.total
    })
  },

  //购物车商品数量减少或商品删除
  subToCart(event) {
    let cartObj = event.target.dataset.productobj
    let carts = this.data.carts
    if (cartObj.num > 1) {
      for (let i = 0; i < carts.length; i++) {
        if (cartObj.id === carts[i].id) {
          cartObj.num--
          carts[i].num--
          break
        }
      }
      this.setData({
        carts: carts
      })
      let productObj = {
        id: cartObj.productId,
        num: cartObj.num
      }
      App.subToCart(productObj)
      
      this.setData({
        total: App.globalData.total
      })
    } else {
      //删除
      for (let i = 0; i < carts.length; i++) {
        if (cartObj.id === carts[i].id) {
          carts.splice(i,1)
          break
        }
      }
      this.setData({
        carts: carts
      })

      App.globalData.carts = carts
      App.total_cartsLength()
      App.delCart(cartObj)

      this.setData({
        total: App.globalData.total
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  bindMultiPickerColumnChange (event) {
    // console.log(event.detail)
    var dates = ["今天","明天","后天"]
    var times = []
    let column = event.detail.column
    let value = event.detail.value
    switch (column) {
      case 0:
        var timeIndex = this.data.timeIndex
        switch (value) {
          case 0:
            let date = new Date()
            let minute = date.getMinutes()
            let hour = date.getHours()
            times.push("30分钟送达")
            if (hour === 23 && minute > 30) {
              dates.splice(0, 1)
              times.splice(0, 1)
              for (let i = 9; i < 24; i++) {
                times.push(i + ":00")
              }
            } else {
              for (let i = hour + 1; i < 24; i++) {
                times.push(i + ":00")
              }
            }
            timeIndex = [0, 0]
            break
          case 1:
            for (let i = 9; i < 24; i++) {
              times.push(i + ":00")
            }
            timeIndex = [1, 0]
            break
          case 2: 
            for (let i = 9; i < 24; i++) {
              times.push(i + ":00")
            }
            timeIndex = [2, 0]
            break
        }
        this.setData({
          timeIndex: timeIndex
        })
        break;
      case 1: 
        var timeIndex = this.data.timeIndex
        times = this.data.timeRange[1]
        switch (value) {
          case 0: 
            timeIndex = [timeIndex[0],0]
            break
          case 1:
            timeIndex = [timeIndex[0], 1]
            break
          case 2:
            timeIndex = [timeIndex[0], 2]
            break
          case 3:
            timeIndex = [timeIndex[0], 3]
            break
          case 4:
            timeIndex = [timeIndex[0], 4]
            break
          case 5:
            timeIndex = [timeIndex[0], 5]
            break
          case 6:
            timeIndex = [timeIndex[0], 6]
            break
          case 7:
            timeIndex = [timeIndex[0], 7]
            break
          case 8: 
            timeIndex = [timeIndex[0],8]
            break
          case 9:
            timeIndex = [timeIndex[0], 9]
            break
          case 10:
            timeIndex = [timeIndex[0], 10]
            break
          case 11:
            timeIndex = [timeIndex[0], 11]
            break
          case 12:
            timeIndex = [timeIndex[0], 12]
            break
          case 13:
            timeIndex = [timeIndex[0], 13]
            break
          case 14:
            timeIndex = [timeIndex[0], 14]
            break
          case 15:
            timeIndex = [timeIndex[0], 15]
            break
        }
        this.setData({
          timeIndex: timeIndex
        })
        break;
    }

    let timeRange = []
    timeRange.push(dates)
    timeRange.push(times)
    this.setData({
      timeRange: timeRange
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
      carts: App.globalData.carts
    })

    App.total_cartsLength()
    this.setData({
      total: App.globalData.total,
      allSelected: App.globalData.allSelected
    })

    let date = new Date()
    let hour = date.getHours()
    let minute = date.getMinutes()
    var dates = ["今天", "明天", "后天"]
    var times = ["30分钟送达"]
    if (hour === 23 && minute > 30) {
      dates.splice(0,1)
      times.splice(0,1)
      for (let i = 9; i < 24; i++){
        times.push(i + ":00")
      }
    } else {
      for (let i = hour + 1; i < 24; i++) {
        times.push(i + ":00")
      }
    }
    let timeRange = []
    timeRange.push(dates)
    timeRange.push(times)
    this.setData({
      timeRange: timeRange
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