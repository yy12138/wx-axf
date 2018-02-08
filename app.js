//app.js
var api = require("/utils/api.js")
App({
  onLaunch () {
    let computedCategories = this.globalData.computedCategories
    if (computedCategories.length > 0){
      this.globalData.computedCategories = computedCategories
    } else {
      this.getComputedCategories(computedCategories => {
        this.globalData.computedCategories = computedCategories
      })
    }
  },
  getComputedCategories (cb) {
    let categories = []
    let products = []
    wx.request({
      url: api.host + "/categories",
      success: (res) => {
        categories = res.data
        wx.request({
          url: api.host + "/products",
          success: (res) => {
            products = res.data
            for (let i = 0; i < categories.length; i++) {
              for (let j = 0; j < products.length; j++) {
                if (products[j].categoryId === categories[i].id) {
                  categories[i].products.push(products[j])
                }
              }
            }
            this.globalData.computedCategories = categories
            cb(categories)
          }
        })
      }
    })
  },
  toDetail(id) {
    wx.navigateTo({
      url: '/packageA/pages/product-item/product-item?id=' + id
    })
  },
  addToCart(productObj) {
    let userId = this.globalData.user.id
    wx.request({
      url: api.host + "/carts?productId=" + productObj.id,
      success: (res) => {
        if (res.data.length) {
          // 数量更改
          let num = productObj.num
          let cartObj = {
            id: res.data[0].id,
            userId: res.data[0].userId,
            selected: res.data[0].selected,
            num: num,
            img: res.data[0].img,
            name: res.data[0].name,
            price: res.data[0].price,
            productId: res.data[0].productId
          }
          wx.request({
            url: api.host + "/carts/" + res.data[0].id,
            method: "PUT",
            data: cartObj,
            success: (res) => {
              let carts = this.globalData.carts
              for (let i = 0; i < carts.length; i++) {
                if (res.data.id === carts[i].id) {
                  carts[i].num = res.data.num
                  break
                }
              }
              //控制category目录的产品数量变化
              let computedCategories = this.globalData.computedCategories
              for (let i = 0; i < computedCategories.length; i++) {
                let products = computedCategories[i].products
                for (let j = 0; j < products.length; j++) {
                  for (let z = 0; z < carts.length; z++) {
                    if (carts[z].productId === products[j].id) {
                      products[j].num = carts[z].num
                    }
                  }
                }
              }
              this.globalData.computedCategories = computedCategories
              this.globalData.carts = carts
              this.total_cartsLength()
            }
          })
        } else {
          //添加到购物车
          let cartObj = {
            selected: false,
            num: 1,
            img: productObj.imgs.min,
            name: productObj.name,
            price: productObj.price,
            productId: productObj.id,
            userId: userId
          }
          wx.request({
            url: api.host + "/carts",
            method: "POST",
            data: cartObj,
            success: (res) => {
              let carts = this.globalData.carts
              carts.push(res.data)
              this.globalData.carts = carts
              let computedCategories = this.globalData.computedCategories
              for (let i = 0; i < computedCategories.length; i++) {
                let products = computedCategories[i].products
                for (let j = 0; j < products.length; j++) {
                  for (let z = 0; z < carts.length; z++) {
                    if (carts[z].productId === products[j].id) {
                      products[j].num = carts[z].num
                    }
                  }
                }
              }
              this.globalData.computedCategories = computedCategories
              this.total_cartsLength()
            }
          })
        }
      }
    })
    
  },
  subToCart (productObj) {
    wx.request({
      url: api.host + "/carts?productId=" + productObj.id,
      success: res => {
        let cartObj = {
          id: res.data[0].id,
          userId: res.data[0].userId,
          selected: res.data[0].selected,
          num: productObj.num,
          img: res.data[0].img,
          name: res.data[0].name,
          price: res.data[0].price,
          productId: res.data[0].productId
        }
        wx.request({
          url: api.host + "/carts/" + res.data[0].id,
          method: "PUT",
          data: cartObj,
          success: (res) => {
            let carts = this.globalData.carts
            for (let i = 0; i < carts.length; i++) {
              if (res.data.id === carts[i].id) {
                carts[i].num = res.data.num
                break
              }
            }
            let computedCategories = this.globalData.computedCategories
            for (let i = 0; i < computedCategories.length; i++) {
              let products = computedCategories[i].products
              for (let j = 0; j < products.length; j++) {
                for (let z = 0; z < carts.length; z++) {
                  if (carts[z].productId === products[j].id) {
                    products[j].num = carts[z].num
                  }
                }
              }
            }
            this.globalData.computedCategories = computedCategories
            this.globalData.carts = carts
            this.total_cartsLength()
          }
        })
      }
    })
  },
  delCart (cartObj) {
    let user = this.globalData.user
    wx.request({
      url: api.host + "/carts/" + cartObj.id,
      method: "DELETE",
      success: res => {
        let computedCategories = this.globalData.computedCategories
        for (let i = 0; i < computedCategories.length; i++) {
          let products = computedCategories[i].products
          for (let j = 0; j < products.length; j++) {
            if (cartObj.productId === products[j].id) {
              products[j].num = 0
            }
          }
        }
        this.globalData.computedCategories = computedCategories
      }
    })
  },
  total_cartsLength () {
    let allBol = false
    let carts = this.globalData.carts
    let total = 0
    let cartLength = 0
    if (carts.length === 0) {
      this.globalData.allSelected = false
    } else {
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].selected) {
          total += (carts[i].price * carts[i].num)
        } else {
          allBol = true
        }
        cartLength += carts[i].num
      }
    }
    
    if (allBol) {
      this.globalData.allSelected = false
    } else {
      this.globalData.allSelected = true
    }
    this.globalData.cartLength = cartLength
    this.globalData.total = total.toFixed(2)
  },
  globalData: {
    computedCategories: [],
    user: {},
    carts: [],
    cartLength: 0,
    allSelected: false,
    total: 0
  }
})