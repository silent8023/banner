function Banner(v) {
  this.time = v.time || 3000;
  if(typeof v.el !== 'string') return;
  this.el = v.el;
  // 初始化
  this.init();
  // 克隆节点
  this.cloneALi();
  // 拖动
  this.onSemove();
  // 自动播放
  if(v.automatic) this.initInterval()
}

Banner.prototype = {
  init: function() {
    this.container = document.querySelector(this.el);
    this.aLi = document.querySelectorAll(this.el + " li");
    this.aLiWidth = this.container.offsetWidth;
    this.x = 0;
    this.px = 0;
    this.sx = 0;
    this.point = 0;
    this.start = 0;
    this.index = 0;
    this.press = false;
    this.container.style.transform = 'translateX(' + this.start + 'px)';
    this.container.style.transitionDuration = '0ms';
  },
  initInterval() {
    var that = this;
    if(that.Interval) { clearInterval(that.Interval) }
    that.Interval = setInterval(function() {
      if(!that.press) {
        for(var i =0; i < that.aLi.length; i++) {
          if(that.hasClass(that.aLi[that.index], 'active_')) {
            that.aLi[that.index].classList.remove('active_');
            if(!that.aLi[that.index + 1]) { that.index = -1 };
            that.aLi[that.index + 1].classList.add('active_');
            break;
          }
          that.index++;
        }
        that.start -= that.liWidth;
        that.container.style.transitionDuration = '400ms';
        that.container.style.transform = 'translateX(' + that.start + 'px)';
        if(that.index - 1 === that.aLi.length / 2) {
          that.aLi[2].classList.add('active_');
          setTimeout(function () {
            that.init(); // 一个循环重新执行
            that.removeActiveClass(); // 清除class
          }, 400)
        }
      }
    }, that.time)
  },
  hasClass: function(obj, cls) {
    if (obj.className) {
      return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
    return false;
  },
  cloneALi: function() {
    for(var i = 0; i < this.aLi.length; i++) {
      var node = this.aLi[i].cloneNode(true);
      this.container.appendChild(node);
    }
    this.aLi = document.querySelectorAll(".banner_container li");
    this.removeActiveClass();
    this.liWidth = this.aLi[0].offsetWidth;

  },
  removeActiveClass() {
    for(var i =0; i < this.aLi.length; i++) {
      this.aLi[i].classList.remove('active_');
    }
    this.aLi[2].classList.add('active_');
  },
  onSemove: function() {
    var that = this;
    //手指按下
    document.onmousedown = function(e) {
      that.press = true;
      that.x = e.clientX;
    }
    document.onmouseup=function(e){
      that.press = false;
      that.sx = that.x - e.clientX;
      that.start = that.start + that.point;
      var _a = that.start % that.liWidth;
      if(_a < 0) {
        if(_a < -that.liWidth / 2) {
          that.start = that.start - _a + -that.liWidth;
        } else {
          that.start = that.start - _a
        }
      } else {
        if(_a > that.liWidth / 2) {
          that.start = that.start - _a + that.liWidth;
        } else {
          that.start = that.start - _a
        }
      }
      that.container.style.transform = 'translateX(' + that.start + 'px)';
      that.container.style.transitionDuration = '400ms';
    };
    document.onmousemove = function(e) {
      if(that.press) {
        that.px = e.clientX;
        that.point = that.px - that.x;
        var x = that.start + that.point;
        that.container.style.transitionDuration = '0ms';
        that.container.style.transform = 'translateX(' + x + 'px)' 
      }
    }
  }
}