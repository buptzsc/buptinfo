// pages/traffic/navi.js
var amapFile = require('../../../libs/amap-wx.js');
var app = getApp();
var sliderWidth = 96;
var markersData = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mapHeight: "800",
    placeName: "",
    hideOrNot: 0,
    activePlaceID: -1,
    schoolAddressText: '北京市昌平区南丰路与高教园南三街交口向北400米路东',
    staticMapImage: 'https://bupt.psmoe.com/schoolmap.jpg',
    markers: [{
      id: 0,
      latitude: 40.158964,
      longitude: 116.289387,
      iconPath: "../../../images/navi/food.png",
      width: 30,
      height: 32,
      callout: {
        content: '学生食堂',
        display: 'ALWAYS'
      }
    }, {
      id: 1,
      latitude: 40.159399,
      longitude: 116.289296,
      iconPath: "../../../images/navi/food.png",
      width: 30,
      height: 32,
      callout: {
        content: '教工食堂',
        display: 'ALWAYS'
      }
    }, {
      id: 2,
      latitude: 40.159071,
      longitude: 116.290154,
      iconPath: "../../../images/navi/party.png",
      width: 30,
      height: 32,
      callout: {
        content: '学生活动中心',
        display: 'ALWAYS'
      }
    }, {
      id: 4,
      latitude: 40.159546,
      longitude: 116.291551,
      iconPath: "../../../images/navi/book.png",
      width: 30,
      height: 32,
      callout: {
        content: '图书馆',
        display: 'ALWAYS'
      }
    },{
      id: 5,
      latitude: 40.158353,
      longitude: 116.292336,
      iconPath: "../../../images/navi/building.png",
      width: 30,
      height: 32,
      callout: {
        content: '教学实验综合楼',
        display: 'ALWAYS'
      }
    },{
      id: 6,
      latitude: 40.158367,
      longitude: 116.285731,
      iconPath: "../../../images/navi/sports.png",
      width: 30,
      height: 32,
      callout: {
        content: '运动场',
        display: 'ALWAYS'
      }
    },{
      id: 7,
      latitude: 40.157543,
      longitude: 116.288805,
      iconPath: "../../../images/navi/dorm.png",
      width: 30,
      height: 32,
      callout: {
        content: '雁南园',
        display: 'ALWAYS'
      }
    },{
      id: 8,
      latitude: 40.158613,
      longitude: 116.288483,
      iconPath: "../../../images/navi/dorm.png",
      width: 30,
      height: 32,
      callout: {
        content: '雁北园',
        display: 'ALWAYS'
      }
    }],

    distance: '',
    cost: '',
    polyline: [],
    userLongitude: 116.289809,
    userLatitude: 40.158406,
    inSchool: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(e) {
    console.log(e)
    var _this = this
    _this.inital();
    if (e.markerId !== '' && Object.keys(e).length !== 0) { 
      const para = { detail: e };
      _this.makertap(para);
    }
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function(res) {
        _this.setData({
          userLongitude: res.longitude,
          userLatitude: res.latitude
        })
      }
    })

  },
  inital: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onReady: function() {
    var that = this;
    setTimeout(function() { that.setData({ isLoading: false }); }, 800);
  },
  makertap: function(e) {
    // console.log(e)
    var id = e.detail.markerId;
    var that = this;
    var markers = that.data.markers;
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function(res) {
        that.setData({
          userLongitude: res.longitude,
          userLatitude: res.latitude
        });
        that.setData({
          activePlaceID: id,
          placeName: markers[id].callout.content
        })
        var userLocation = that.data.userLongitude + ',' + that.data.userLatitude;
        var destination = that.data.markers[id].longitude + ',' + that.data.markers[id].latitude;
        that.planPolyline(userLocation, destination);
      }
    })

  },
  planPolyline: function(origin, destination) {
    var that = this;
    var id = that.data.activePlaceID;
    //规划步行路线
    var myAmapFun = new amapFile.AMapWX({ key: app.globalData._amap_key });
    myAmapFun.getWalkingRoute({
      origin: origin,
      destination: destination,
      success: function(data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          json: data.paths[0],
          polyline: [{
            points: points,
            color: "#3383F7",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }
        var markers = that.data.markers;
        var points = that.data.polyline[0].points;
        //暂时一共70个坐标点
        markers[71] = {
          id: 71,
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          iconPath: '../../images/nav/mapicon_navi_s.png',
          width: 23,
          height: 33
        };
        markers[72] = {
          id: 72,
          latitude: points[points.length - 1].latitude,
          longitude: points[points.length - 1].longitude,
          iconPath: '../../images/nav/mapicon_navi_e.png',
          width: 24,
          height: 34
        }

        that.setData({ markers: markers });
      },
    })
  },
  myLocation: function() {
    var _this = this
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function(res) {
        _this.setData({
          userLongitude: res.longitude,
          userLatitude: res.latitude
        })
      }
    })
  },
  moveToSchool: function() {
    //视图返回学校
    var _this = this;
    _this.setData({ userLongitude: 116.289809, userLatitude: 40.158406 });
  },
  showStaticMapImage: function() {
    var _this = this;
    wx.previewImage({
      current: _this.data.staticMapImage,
      urls: [ _this.data.staticMapImage ]
    })
  },
  copyText: function (e) {
    const text = e.currentTarget.dataset.text;
    wx.setClipboardData({ data: text });
    wx.showToast({ title: '已复制到粘贴到', icon: 'none' });
  },
})