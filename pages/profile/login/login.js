const app = getApp();
var domain = app.globalData.domain;

Page({
  data: {
    canIUseGetUserProfile: false,
    userid: '',
    passwd: '',
    userid_focus: false,
    passwd_focus: false,
  },

  onLoad: function (option) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  navToReg:function(){
    wx.navigateTo({
      url: '../register/register?mode=register',
    })
  },

  bind: function() {
    if(!this.vaildForm()){
      return
    }
    var _this = this;
    
    if(!app.globalData.userInfo){
      wx.getUserProfile({
        lang: 'zh_CN',
        desc: '获取用户信息将其与学号绑定',
        success: function(res){
          console.log('userInfo：', res.userInfo)
          wx.setStorage({data: res.userInfo, key: 'userInfo'});
          app.globalData.userInfo = res.userInfo
        },
        fail: function(e){
          console.log(e)
          wx.showToast({
            title: '不给权限就不能登录喔~',
            icon: 'none'
          })
        }
      })
    }
    else{
      this.login(app.globalData.userInfo);
    }
  },

  vaildForm: function () {
    var uid = this.data.userid;
    var password = this.data.passwd;
    if(uid.length<1){
      wx.showToast({
        title: '请输入学号',
        icon: 'none'
      })
      return false;
    }
    if(password.length < 1){
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return false
    }
    return true;
  },

  login: function (userInfo) {
    var _this = this
    _this.setData({remind: '加载中'})
    var uid = this.data.userid
    var password = this.data.passwd
    wx.request({
      url: `${domain}/login.php`,
      data:{
        uid: uid,
        pwd: password,
        openid: app.globalData.openid,
        mode: 'login',
      },
      timeout: app.globalData.requestTimeout,
      success: function(res){
        var return_data = res.data
        console.log(return_data)
        wx.showToast({
          title: return_data.detail,
          icon: return_data.state == 'success' ? 'success' : 'none',
          duration: 2000,
          success:function(){
            setTimeout(() => {
                if(return_data.state == 'success'){
                  app.globalData.isLoggedIn = true,
                  app.globalData.myprofile = return_data,
                  wx.setStorage({
                    data: true,
                    key: 'isLoggedIn',
                  })
                  wx.setStorage({
                    data: return_data,
                    key: 'myprofile',
                  })
                  wx.navigateBack({
                    delta: 1,
                  })
                }
            }, 2000);
          }
        })
      }
    })
  },

  useridInput: function(e) {
    this.setData({
      userid: e.detail.value
    });
  },
  passwdInput: function(e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  inputFocus: function(e){
    if(e.target.id == 'userid'){
      this.setData({
        'userid_focus': true
      });
    }else if(e.target.id == 'passwd'){
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function(e){
    if(e.target.id == 'userid'){
      this.setData({
        'userid_focus': false
      });
    } else if(e.target.id == 'passwd'){
      this.setData({
        'passwd_focus': false
      });
    }
  },
})