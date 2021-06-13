const app =getApp()
const domain = app.globalData.domain

Page({
  data: {
    subscribeItem: '',
    formchanged: false,
  },

  onLoad: function (options) {
    if(app.globalData.isLoggedIn){
      wx.request({
        url: 'https://bupt.psmoe.com/tag_update.php',
        data:{
          mode: 'down',
          uid: app.globalData.myprofile.uid,
          form:''
        },
        success: function (res) {
          app.globalData.subscribeItem = res.data,
          wx.setStorageSync('subscribeItem', app.globalData.subscribeItem)
        }
      })
    }
    this.setData({
      subscribeItem: app.globalData.subscribeItem,
      isLoggedIn: app.globalData.isLoggedIn,
      uid: app.globalData.isLoggedIn?app.globalData.myprofile.uid:null,
      kaoyan: app.globalData.bbskaoyan,
      top10: app.globalData.bbstop10
    })
    console.log(this.data.subscribeItem)
  },

  onUnload: function (){
    var that = this
    if(this.data.formchanged){
      wx.setStorage({
        data: that.data.subscribeItem,
        key: 'subscribeItem',
      })
      app.globalData.subscribeItem = that.data.subscribeItem
      console.log(app.globalData.subscribeItem)
      
      if(this.data.isLoggedIn){
        wx.request({
          url: `${domain}/tag_update.php`,
          data:{
            uid: that.data.uid,
            form: that.data.subscribeItem,
            mode: 'up',
          },
          timeout: app.globalData.requestTimeout,
          // success:function(){
          //   console.log(1)
          // }
        })
      }
    }
    wx.setStorage({
      data: app.globalData.bbstop10,
      key: 'bbstop10',
    }),
    wx.setStorage({
      data: app.globalData.bbskaoyan,
      key: 'bbskaoyan',
    })
  },

  switchchange: function(e){
    var sw = e.detail.value
    var idx = e.currentTarget.dataset.idx
    this.setData({
      [`subscribeItem[${idx}].ischecked`] : sw?"1":"",
      formchanged: true
    })
    console.log(this.data.subscribeItem)
  },

  bbschange: function(e){
    var sw = e.detail.value
    var name = e.currentTarget.dataset.name
    if(name == "top10"){
      app.globalData.bbstop10 = sw;
    }else{
      app.globalData.bbskaoyan = sw;
    }
  }

})