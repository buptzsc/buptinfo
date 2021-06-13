const app = getApp();
Page({
  data: {
    ColorList: app.globalData.ColorList,
    color:'red',
    reserveInfo: "",
  },
  onLoad() {
    let that = this;
    setTimeout(function() {
      that.setData({
        loading: true
      })
    }, 500)

    wx.request({
      url: 'https://bupt.psmoe.com/requestgym.php',
      success:function(res){
        that.setData({
          reserveInfo: res.data,
        })
        console.log(res.data)
      }
    })
  },
  copyurl:function(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.url,
      success: function() {
        wx.showToast({
          title: '链接已复制',
          duration: 1000,
        })
      },
      fail:function(){
        console.log('failed')
      }
    })
  },
})