const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    keyword: '',
    backLists: {},
    telLists: {
      'A': [
        { name: 'AI院学生工作办', tel: '62282622'}
      ],
      'B':[
        { name: '保卫处', tel: '62281100'}
      ],
      'C': [
        { name: '财务处', tel: '62283795'},
        { name: '财务处(科研经费管理)', tel: '62283289'},
        { name: '财务处(学费)', tel: '62282522'}
      ],
      'D': [
        { name: '党委办公室(主任)', tel: '62281555'},
        { name: '党委办公室(副主任)', tel: '62282102'},
        { name: '档案馆', tel: '62280896'},
        { name: '电子工程学院', tel: '62281958'}
      ],
      'E': [],
      'F': [],
      'G': [
        { name: '国际学院教务科', tel: '58828013'},
        { name: '国际学院学生科', tel: '58828333'},
        { name: '国际学院分团委', tel: '58828215'},
        { name: '国际处', tel: '62282037'},
        { name: '国际学生管理', tel: '62282839'},
        { name: '国际会议审批', tel: '62282797'},
        { name: '国际处学生海外交流', tel: '62282215'},
        { name: '港澳台事务', tel: '62282797'}
      ],
      'H': [],
      'I': [],
      'J': [
        { name: '计算机学院教务科', tel: '62282656'},
        { name: '计算机学院学术工作办公室', tel: '66605115'},
        { name: '就业与创业指导中心', tel: '62283677'},
        { name: '教务处处长', tel: '62282060'},
        { name: '教务处管理科', tel: '62282067'},
        { name: '教务处实践教学科', tel: '62282711'},
        { name: '教务处教学质量科', tel: '62283165'}
      ],
      'K': [],
      'L': [],
      'M': [],
      'N': [],
      'O': [],
      'P': [],
      'Q': [],
      'R': [
        { name: '软件学院实验中心', tel: '61198279'}
      ],
      'S': [],
      'T': [],
      'U': [],
      'V': [],
      'W': [
        { name: '网安院沙河辅导员', tel: '66605115'},
      ],
      'X': [
        { name: '学生处学生管理科', tel: '62282608'},
        { name: '学生处资助中心', tel: '62282757'},
        { name: '心理素质教育中心', tel: '62281882'},
        { name: '校园网/校园卡西土城路校区', tel: '62283039'},
        { name: '校园网/校园卡沙河校区', tel: '62283039'},
        { name: '校园网/校园卡宏福校区', tel: '62283039'},
        { name: '校医院急诊室', tel: '62282649'},
        { name: '校医院口腔科', tel: '62283212'},
        { name: '校医院药房沙河校区', tel: '66605153'},
        { name: '校医院沙河急诊电话', tel: '66605120'},
        { name: '校医院沙河挂号/收费', tel: '66605152'},
        { name: '校医院沙河化验室', tel: '66605156'},
        { name: '信息与通信工程学院', tel: '62283295'},
        { name: '信通院研究生招生', tel: '62282163'}
      ],
      'Y': [],
      'Z': []
    }
  },
  onLoad() {
    let list = [];
    for (let i = 0; i < 26; i++) {
      list[i] = String.fromCharCode(65 + i)
    }

    var _this = this;
    this.setData({
      list: list,
      listCur: 'B',
      backLists: _this.data.telLists
    })
    this.inital();
  },
  inital: function () {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onReady() {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function(res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function(res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  //获取文字信息
  getCur(e) {
    var _this = this;
    this.setData({
      hidden: false,
      listCur: _this.data.list[e.target.id],
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.list[num]
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },
  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.list;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i],
          movableY: i * 20
        })
        return false
      }
    }
  },
  searchInput: function (e) {
    var keyword = e.detail.value;
    var telLists = this.data.backLists;
    var resultLists = {};
    var hasResult = false;
    var _this = this;
  
    if(keyword.length<1){
      this.setData({ telLists: _this.data.backLists });
      return;
    }
    for (let index in telLists){
      let element = telLists[index];
      resultLists[index] = [];
      element.forEach((ele, ind) => {
        if(ele.name.indexOf(keyword) != -1 || ele.tel.indexOf(keyword) != -1){
          resultLists[index].push(ele);
          hasResult = true;
        }
      });
    }
    this.setData({
      keyword: keyword,
      telLists: resultLists
    })
  },
  clearSearch: function () {
    var _this = this;
    this.setData({ telLists: _this.data.backLists, keyword: ''});
  },
  callPhone: function (e) {
    var tel = '022' + e.currentTarget.dataset.tel;
    wx.makePhoneCall({ phoneNumber: tel });
  },
  copyTel: function(e) {
    var tel = '022' + e.currentTarget.dataset.tel;
    wx.setClipboardData({
      data: tel
    })
    wx.showToast({
      title: '已复制到粘贴版',
      icon: 'none',
      duration: 1000
    });
  },
});
