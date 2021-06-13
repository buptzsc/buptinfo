// app.js
const util = require('/utils/util.js')

App({
  globalData: {
    userInfo: null,
    currentPostUrl: null,
    currentPostDetail: null,
    date: null,
    isLoggedIn: false,
    domain: "https://bupt.psmoe.com",
    requestTimeOut: 10000,
    myprofile: null,
    subscribeItem: [{"name":"获奖","ischecked":"1"}, {"name":"党政团建","ischecked":"1"}, {"name":"校园生活","ischecked":"1"}, {"name":"校园医疗","ischecked":"1"}, {"name":"教务","ischecked":"1"}, {"name":"竞赛","ischecked":"1"}, {"name":"英语","ischecked":"1"}, {"name":"体育","ischecked":"1"}, {"name":"讲座","ischecked":"1"}, {"name":"图书馆","ischecked":"1"}, {"name":"创新创业","ischecked":"1"}, {"name":"国际交流","ischecked":"1"}, {"name":"研究生","ischecked":"1"}],
    _amap_key: "74c05c5bbaa1631407c2c6f83bc37807",
    newsOptions: [],
    searchResult: null,
    bbstop10: true,
    bbskaoyan: true,
  },
  onLaunch(){
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.globalData.date = util.formatTime(new Date())

    var that = this
    // 获取用户信息
    this.globalData.userInfo = wx.getStorageSync('userInfo')

    //获取登陆状态
    this.globalData.isLoggedIn = wx.getStorageSync('isLoggedIn')

    // 获取用户账号信息
    this.globalData.myprofile = wx.getStorageSync('myprofile')

    // 获取bbs缓存
    this.globalData.bbstop10 = wx.getStorageSync('bbstop10')
    this.globalData.bbskaoyan = wx.getStorageSync('bbskaoyan')

    // console.log(this.globalData.myprofile)
    // 若用户已经登录，则从服务器获取用户的订阅信息，否则从本地导入订阅信息
    if(this.globalData.isLoggedIn){
      wx.request({
        url: 'https://bupt.psmoe.com/tag_update.php',
        data:{
          mode: 'down',
          uid: that.globalData.myprofile.uid,
          form:''
        },
        success: function (res) {
          that.globalData.subscribeItem = res.data,
          wx.setStorageSync('subscribeItem', that.globalData.subscribeItem)
        }
      })
    }else{
      this.globalData.subscribeItem = wx.getStorageSync('subscribeItem')
    }

    this.getSystemStatusBarInfo()
  },
  getSystemStatusBarInfo: function () {
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      });
    }
  },
})
