var app = getApp();
Page({

  data: {
    posts: null,
    total: 0,
  },

  onLoad: function (options) {
    this.setData({
      posts: app.globalData.searchResult.posts,
      total: app.globalData.searchResult.total,
      uid: app.globalData.myprofile.uid,
    })
    console.log(this.data.posts)
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
    // console.log(id);
    wx.request({
      url: 'https://bupt.psmoe.com/viewnsubsupd.php',
      data:{
        uid: that.data.uid,
        mode: "subs",
        news_id: id,
      },
      success:function(){
        console.log('yesmora')
      }
    })
  },
})