// pages/profile/profile.js
var app = getApp()

Page({
  data: {
    myuid: null,
  },

  onShow: function () {
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
    })
    if(this.data.isLoggedIn){
      this.setData({
        myuid: app.globalData.myprofile.uid,
        myname: app.globalData.myprofile.name,
      })
    }
  },
})