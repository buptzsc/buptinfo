// pages/profile/register/register.js
var app = getApp();
var domain = app.globalData.domain;
Page({
  data: {
    name : '',
    uid : '',
    classinfo : '',
    passwd : '',
    repeatPasswd : '',
    oldPasswd : '',
    newPasswd : '',
    repeatNewPasswd : '',
  },

  onLoad: function (option) {
    var mode = option.mode;
    this.setData({
      mode : mode
    })
    console.log(mode)
  },

  onShow: function () {

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
            title: '不给权限就不能注册喔~',
            icon: 'none'
          })
        }
      })
    }
    else{
      if(this.data.mode=='register'){
        this.register(app.globalData.userInfo);
      }else{
        this.changepasswd(app.globalData.userInfo);
      }
    }
  },

  vaildForm: function () {
    var name = this.data.name;
    var uid = this.data.uid;
    var classinfo = this.data.classinfo;
    var passwd = this.data.passwd;
    var repeatPasswd = this.data.repeatPasswd;
    var oldPasswd = this.data.oldPasswd;
    var newPasswd = this.data.newPasswd;
    var repeatNewPasswd = this.data.repeatNewPasswd;
    console.log(name,uid,classinfo,passwd,repeatPasswd,oldPasswd,newPasswd,repeatNewPasswd)
    if(this.data.mode == 'register'){
      if(uid.length < 1 || name.length < 1 || classinfo.length < 1 || passwd.length < 1 || repeatPasswd.length < 1){
        wx.showToast({
          title: '请补全表项信息以验证您的身份',
          icon: 'none'
        })
        return false;
      }
      if(!this.vaildPasswd()){
        return false;
      };
      return true;
    }

    else{
      if(uid.length < 1 || oldPasswd.length < 1 || newPasswd.length < 1 || repeatNewPasswd.length < 1){
        wx.showToast({
          title: '请补全表项信息',
          icon: 'none'
        })
        return false;
      }
      if(!this.vaildPasswd()){
        return false;
      };
      return true;
    }
  },

  vaildPasswd: function () {
    var passwd = this.data.passwd;
    var repeatPasswd = this.data.repeatPasswd;
    var oldPasswd = this.data.oldPasswd;
    var newPasswd = this.data.newPasswd;
    var repeatNewPasswd = this.data.repeatNewPasswd;
    if(this.data.mode == 'register'){
      if(passwd.length < 8){
        wx.showToast({
          title: '密码长度不得短于8位',
          icon: 'none'
        })
        return false;
      }
      let hasAlpha= (passwd.search(/[A-Za-z]/)!=-1) ? 1 : 0;
      let hasNumber= (passwd.search(/[0-9]/)!=-1) ? 1 : 0;
      if(hasAlpha == 0 || hasNumber == 0){
        wx.showToast({
          title: '密码必需同时包含数字和字母',
          icon: 'none'
        })
        return false;
      }
      if(passwd != repeatPasswd){
        wx.showToast({
          title: '密码与确认密码不一致哦',
          icon: 'none'
        })
        return false;
      }
      return true;
    }

    else{
      if(newPasswd.length < 8){
        wx.showToast({
          title: '密码长度不得短于8位',
          icon: 'none'
        })
        return false;
      }
      let hasAlpha= (newPasswd.search(/[A-Za-z]/)!=-1) ? 1 : 0;
      let hasNumber= (newPasswd.search(/[0-9]/)!=-1) ? 1 : 0;
      if(hasAlpha == 0 || hasNumber == 0){
        wx.showToast({
          title: '密码必需同时包含数字和字母',
          icon: 'none'
        })
        return false;
      }
      if(newPasswd != repeatNewPasswd){
        wx.showToast({
          title: '新密码与确认新密码不一致哦',
          icon: 'none'
        })
        return false;
      }
      if(newPasswd == oldPasswd){
        wx.showToast({
          title: '新密码必须与旧密码不同哦',
          icon: 'none'
        })
        return false;
      }
      return true;
    }
  },

  register: function (userInfo) {
    var _this = this
    _this.setData({remind: '加载中'})
    var name = this.data.name;
    var uid = this.data.uid;
    var classinfo = this.data.classinfo;
    var passwd = this.data.passwd;
    wx.request({
      url: `${domain}/register.php`,
      data:{
        uid: uid,
        passwd: passwd,
        openid: app.globalData.openid,
        name: name,
        classinfo: classinfo,
        mode: 'register',
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

  changepasswd: function (userInfo) {
    var _this = this
    _this.setData({remind: '加载中'})
    var uid = this.data.uid;
    var oldPasswd = this.data.oldPasswd;
    var newPasswd = this.data.newPasswd;
    wx.request({
      url: `${domain}/changepasswd.php`,
      data:{
        uid: uid,
        oldpasswd: oldPasswd,
        newpasswd: newPasswd,
        openid: app.globalData.openid,
        mode: 'changepasswd',
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
                  app.globalData.isLoggedIn = false,
                  wx.setStorage({
                    data: false,
                    key: 'isLoggedIn',
                  })
                  wx.setStorage({
                    data: null,
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

  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    });
  },
  uidInput: function(e) {
    this.setData({
      uid: e.detail.value
    });
  },
  classInput: function(e) {
    this.setData({
      classinfo: e.detail.value
    });
  },
  passwdInput: function(e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  repeatPasswdInput: function(e) {
    this.setData({
      repeatPasswd: e.detail.value
    });
  },
  oldPasswdInput: function(e) {
    this.setData({
      oldPasswd: e.detail.value
    });
  },
  newPasswdInput: function(e) {
    this.setData({
      newPasswd: e.detail.value
    });
  },
  repeatNewPasswdInput: function(e) {
    this.setData({
      repeatNewPasswd: e.detail.value
    });
  },
})