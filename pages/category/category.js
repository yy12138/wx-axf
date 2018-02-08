// pages/category/category.js
var App = getApp()
var Api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    computedCategories: [],
    activeCategoryId: 0,
    products: [],
    sortControl: true,
    selectControl: true,
    activedSelectCid: 'all',
    activedSortCid: 'middle',
    activeProducts: [],
    activedProducts: []
  },

  toDetail (event) {
    App.toDetail(event.currentTarget.dataset.productid)
  },

  addToCart(event) {
    let user = this.data.user
    let productObj = event.target.dataset.productobj
    if (user.id) {
      let computedCategories = this.data.computedCategories
      for (let i = 0; i < computedCategories.length; i++) {
        let products = computedCategories[i].products
        for (let j = 0; j < products.length; j++) {
          if (productObj.id === products[j].id) {
            productObj.num++
            products[j].num++
          }
        }
      }
      this.setData({
        computedCategories: computedCategories
      })
      let activeCategoryId = this.data.activeCategoryId
      let products = Object.assign([], this.data.computedCategories[activeCategoryId].products)
      this.setData({
        products: products,
        activeProducts: products,
        activedProducts: products
      })
      App.addToCart(productObj)
    } else {
      wx.navigateTo({
        url: '../../packageA/pages/login/login'
      })
    }
  },

  subToCart (event) {
    let user = this.data.user
    let productObj = event.target.dataset.productobj
    if (user.id) {
      //先判断数量是否大于0 大于0 可减或删除购物车数据
      //数量为1时 可对他进行删除操作 大于1时可进行--操作
      if (productObj.num > 0) {
        if (productObj.num > 1) {
          let computedCategories = this.data.computedCategories
          for (let i = 0; i < computedCategories.length; i++) {
            let products = computedCategories[i].products
            for (let j = 0; j < products.length; j++) {
              if (productObj.id === products[j].id) {
                productObj.num--
                products[j].num--
              }
            }
          }
          this.setData({
            computedCategories: computedCategories
          })
          let activeCategoryId = this.data.activeCategoryId
          let products = Object.assign([], this.data.computedCategories[activeCategoryId].products)
          this.setData({
            products: products,
            activeProducts: products,
            activedProducts: products
          })
          App.subToCart(productObj)
        } else {
          let computedCategories = this.data.computedCategories
          for (let i = 0; i < computedCategories.length; i++) {
            let products = computedCategories[i].products
            for (let j = 0; j < products.length; j++) {
              if (productObj.id === products[j].id) {
                productObj.num--
                products[j].num--
              }
            }
          }
          this.setData({
            computedCategories: computedCategories
          })
          let activeCategoryId = this.data.activeCategoryId
          let products = Object.assign([], this.data.computedCategories[activeCategoryId].products)
          this.setData({
            products: products,
            activeProducts: products,
            activedProducts: products
          })
          //id  productId
          let carts = App.globalData.carts
          for (let i = 0; i < carts.length; i++) {
            if (productObj.id === carts[i].productId) {
              App.delCart({ id: carts[i].id, productId: productObj.id })
              carts.splice(i, 1)
              break
            }
          }
          App.globalData.carts = carts
        }
      }
    } else {
      wx.navigateTo({
        url: '../../packageA/pages/login/login'
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      carts: App.globalData.carts,
      user: App.globalData.user
    })
    let carts = this.data.carts
    let activeCategoryId = this.data.activeCategoryId
    let computedCategoriesAPP = App.globalData.computedCategories
    if (computedCategoriesAPP.length > 0) {
      this.setData({
        computedCategories: computedCategoriesAPP
      })
    } else {
      App.getComputedCategories(computedCategories => {
        this.setData({
          computedCategories: computedCategories
        })
      })
    }
    let products = Object.assign([], this.data.computedCategories[this.data.activeCategoryId].products)
    this.setData({
      products: products,
      activeProducts: products,
      activedProducts: products
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
  onShow () {
    this.setData({
      computedCategories: App.globalData.computedCategories,
      user: App.globalData.user,
    })
    let activeCategoryId = this.data.activeCategoryId
    let products = Object.assign([], this.data.computedCategories[activeCategoryId].products)
    this.setData({
      products: products,
      activeProducts: products,
      activedProducts: products
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
  
  },
  //change category
  changeActiveCategoryId (event) {
    let activeCategoryId = event.currentTarget.dataset.categoryindex
    this.setData({
      activeCategoryId: activeCategoryId,
      activedSelectCid: 'all',
      activedSortCid: 'middle'
    })
    let products = Object.assign([], this.data.computedCategories[activeCategoryId].products)
    this.setData({
      products: products,
      activeProducts: products,
      activedProducts: products
    })
  },
  // 修改全部分类actived的cid
  changeActivedSelectCid (event) {
    let activedSelectCid = event.target.dataset.cid
    this.setData({
      activedSelectCid: activedSelectCid
    })
    let products = this.data.products
    if (activedSelectCid === 'all') {
      let newProducts = Object.assign([],products)
      this.setData({
        activeProducts: newProducts,
        activedProducts: newProducts,
        selectControl: true
      })
    } else {
      let newProducts = products.filter(item => {
        return item.cidIndex === activedSelectCid
      })
      this.setData({
        activeProducts: newProducts,
        activedProducts: newProducts,
        selectControl: true
      })
    }
  },
  // 修改综合分类actived的cid
  changeActivedSortCid(event) {
    let activedSortCid = event.target.dataset.cid
    this.setData({
      activedSortCid: activedSortCid
    })
    let products = this.data.activeProducts
    if (activedSortCid === 'middle') {
      let newProducts = Object.assign([],products)
      this.setData({
        activedProducts: newProducts,
        sortControl: true
      })
    } else if (activedSortCid === 'up') {
      let newProducts = Object.assign([],products)
      newProducts.sort((a,b) => {
        return b.price - a.price
      })
      this.setData({
        activedProducts: newProducts,
        sortControl: true
      })
    } else {
      let newProducts = Object.assign([], products)
      newProducts.sort((a, b) => {
        return a.price - b.price
      })
      this.setData({
        activedProducts: newProducts,
        sortControl: true
      })
    }
  },
  //控制全部分类里的子分类的显示隐藏
  changeSelectControl () {
    let selectControl = this.data.selectControl
    this.setData({
      selectControl: !selectControl,
      sortControl: true
    })
  },
  //控制综合排序里的子分类的显示隐藏
  changeSortControl() {
    let sortControl = this.data.sortControl
    this.setData({
      sortControl: !sortControl,
      selectControl: true
    })
  }
})