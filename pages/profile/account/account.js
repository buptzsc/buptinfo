// pages/profile/account/account.js
const app = getApp();

Page({
  data: {

  },

  onLoad: function (options) {
    // this.setData({
    //   isLoggedIn : app.globalData.isLoggedIn
    // })
  },

  onShow: function () {
      this.setData({
        isLoggedIn : app.globalData.isLoggedIn,
        myuid : app.globalData.myprofile.uid,
        myname : app.globalData.myprofile.name,
        myclass : app.globalData.myprofile.class,
      })
      console.log(this.data.isLoggedIn)
  },

  tap:function(){
    wx.navigateTo({
      url: "../login/login?type=login"
    })
  },

  exittap: function(){
    app.globalData.isLoggedIn = false;
    app.globalData.uid = null;
    this.setData({
      isLoggedIn: false
    })
    wx.setStorage({
      data: false,
      key: 'isLoggedIn',
    })
    wx.setStorage({
      data: null,
      key: 'myprofile',
    })
  }
})