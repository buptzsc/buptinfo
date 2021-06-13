const app = getApp()

Page({
  data: {
    CustomBar: app.globalData.CustomBar,
    keyword: "",
  },
  onShow: function () {
    var that = this
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      uid: app.globalData.isLoggedIn?app.globalData.myprofile.uid:null,
    })
  },

  searchInfo: function(e){
    this.setData({
      keyword: e.detail.value
    });
  },

  gosearch:function(){
    var that = this;
    if(!this.data.uid){
      wx.showToast({
        title: '请登录后查询',
        icon: 'none',
      })
    }
    else if(!this.data.keyword){
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none',
      })
    }
    else{
      wx.request({
        url: 'https://bupt.psmoe.com/search.php',
        data:{
          keyword: that.data.keyword,
          uid: that.data.uid
        },
        success:function(res){
          app.globalData.searchResult = res.data;
          console.log(app.globalData.searchResult);
          wx.navigateTo({
            url: 'result/result',
          })
          console.log(res.data)
        }
      })
    }
  }
})