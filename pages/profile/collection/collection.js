// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    isLoading: true,
    isBottom: false,
    pageIndex: 1,
    pageCount: 0,
    posts: [],
    thatsall: false,
  },
  // 事件处理函数

  onLoad() {
    var that = this
    this.setData({
      date: app.globalData.date,
      isLoggedIn: app.globalData.isLoggedIn,
      uid: app.globalData.isLoggedIn?app.globalData.myprofile.uid:null,
      newsOptions: app.globalData.newsOptions
    })

    if(this.data.isLoggedIn){
      this.requestInfo();
    }
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
      url: "../../detail/detail"
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
      url: 'https://bupt.psmoe.com/requestcollection.php',
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
//           posts: res.data.posts,
          pageIndex: tempPageIndex,
          pageCount: res.data.pageCount,
          posts: tempPost,
          total: res.data.total.count
        })
        console.log(res.data)
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
