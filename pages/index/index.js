// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    TabCur: 0,
    TabName: [{'name':'信息门户'},{'name':'北邮人论坛'}],
    isLoading: true,
    isBottom: false,
    pageIndex: 1,
    pageCount: 0,
    posts: [],
    thatsall: false,
    newsOptions: [],
    uid:null
  },
  // 事件处理函数

  onLoad() {
    var that = this
    this.setData({
      date: app.globalData.date,
      isLoggedIn: app.globalData.isLoggedIn,
      newsOptions: app.globalData.newsOptions
    })

      wx.request({
            url: 'https://bupt.psmoe.com/requestbbs.php',
            success: function (res) {
              that.setData({
                top10posts: res.data.top10,
                kaoyanposts: res.data.kaoyan,
                isLoading: false
              })
              console.log(res.data)
            },
          setTimeout:10000,
          })

      if(this.data.isLoggedIn){
        this.setData({
          uid: app.globalData.myprofile.uid,
        })
        this.requestInfo();
      }else{
        this.setData({
          uid: null,
          posts: []
        })
      }


  },

  onShow:function(){
    this.setData({
      isLoggedIn: app.globalData.isLoggedIn,
      uid: app.globalData.isLoggedIn?app.globalData.myprofile.uid:null,
      posts: app.globalData.isLoggedIn?this.data.posts:[],
      top10: app.globalData.bbstop10,
      kaoyan: app.globalData.bbskaoyan,
    })
    console.log(this.data.uid)
  },
  onPostTap: function (event) {
    var that = this;
    app.globalData.currentPostUrl = event.currentTarget.dataset.url;
    app.globalData.currentPostDetail = event.currentTarget.dataset.news_html;
    // console.log("url is " + url);
    var id = event.currentTarget.dataset.id;
    console.log(id);
    var posts = this.data.posts;
    posts.forEach(function(item,index){
      if(item.news_id==id){
        // var issubscribed = posts[index].news_subscription;
        posts[index].news_view = parseInt(posts[index].news_view) + 1;
        console.log(posts)
      }
    })
    this.setData({
      posts: posts
    })
    wx.request({
      url: 'https://bupt.psmoe.com/viewnsubsupd.php',
      data:{
        uid: that.data.uid,
        mode: "view",
        news_id: id,
      }
    })
    wx.navigateTo({
      url: "../detail/detail"
    })
  },

  onPullDownRefresh:function(){
    this.setData({
      isLoading: true,
      isBottom : false,
      thatsall : false,
      pageIndex: 1,
    })
    this.requestInfo();
  },

  onReachBottom:function(){
    this.setData({
      isLoading : true,
      isBottom : true
    })
    if(this.data.pageIndex < this.data.pageCount){
      this.data.pageIndex++;
      this.requestInfo();
    }
    else{
      this.setData({
        thatsall : true
      })
    }
  },

  requestInfo:function(){
    var that = this;
    wx.request({
      url: 'https://bupt.psmoe.com/requestinfo.php',
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        uid: that.data.uid,
        pageIndex: that.data.pageIndex,
      },
      success: function (res) {
        var tempPost = that.data.posts;
        var tempPageIndex = that.data.pageIndex;
        if(that.data.pageIndex==1){
          tempPost = res.data.posts;
          tempPageIndex = 1;
          that.setData({
            isLoading: false,
          })
          wx.stopPullDownRefresh();
        }
        else{
          tempPost = tempPost.concat(res.data.posts);
          // tempPageIndex = tempPageIndex + 1;
        }
        that.setData({
          posts: res.data.posts,
          pageIndex: tempPageIndex,
          pageCount: res.data.pageCount,
          posts: tempPost
        })
        console.log(res.data)
      }
    })
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
    })
  },

  todetail:function(e){
    var that = this;
    app.globalData.currentPostUrl = e.currentTarget.dataset.url;
    app.globalData.currentPostDetail = e.currentTarget.dataset.rss;
    wx.navigateTo({
      url: "../detail/detail"
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

  onCollectTap:function(e){
    var id = e.currentTarget.dataset.id;
    var that = this;
    console.log(id);
    var posts = this.data.posts;
    posts.forEach(function(item,index){
      if(item.news_id==id){
        // var issubscribed = posts[index].news_subscription;
        posts[index].news_subscription = !posts[index].news_subscription;
        console.log(posts)
      }
    })
    this.setData({
      posts: posts
    })
    console.log(this.data.posts);
    wx.request({
      url: 'https://bupt.psmoe.com/viewnsubsupd.php',
      data:{
        uid: that.data.uid,
        mode: "subs",
        news_id: id,
      }
    })
  },
})
