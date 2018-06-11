/*jshint esversion: 6 */
/**
 * 
 */
class WindowEventManager {

  constructor() {
    this.onLoadCallbacks = [];
    this.didLoad = false;
    this.isWatchingResize = false;
    this.onResizeCallbacks = [];
  }

  init() {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', this.onPageLoad.bind(this));
      window.addEventListener("optimizedResize", this.onResize.bind(this));
    }
  }

  registerForLoadEvent(callback) {
    this.onLoadCallbacks.push(callback);
    if (this.didLoad) {
      callback();
    }
  }

  onPageLoad() {
    this.didLoad = true;
    this.onLoadCallbacks.forEach(function(callback) {
      callback();
    });
  }

  registerForResizeEvent(callback) {
    if (!this.isWatchingResize) {
      // WindowEventManager._startWatchingResize();
      WindowEventManager.throttleEventListening("resize", "optimizedResize");
      this.isWatchingResize = true;
    }
    this.onResizeCallbacks.push(callback);
  }

  onResize() {
    var size = { width: window.innerWidth, height: window.innerHeight };
    for (var i = 0; i < this.onResizeCallbacks.length; i++) {
      this.onResizeCallbacks[i](size.width, size.height);
    }
  }

  // static _startWatchingResize() {
  //   (function () {
  //     var throttle = function (type, name, obj) {
  //       obj = obj || window;
  //       var running = false;
  //       var func = function () {
  //         if (running) { return; }
  //         running = true;
  //         requestAnimationFrame(function () {
  //           obj.dispatchEvent(new CustomEvent(name));
  //           running = false;
  //         });
  //       };
  //       obj.addEventListener(type, func);
  //     };
    
  //     /* init - you can init any event */
  //     throttle("resize", "optimizedResize");
  //   })();
  // }

  static throttleEventListening(browserEventKey, customWindowEventKey) {
    (function () {
      var throttle = function (type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function () {
          if (running) { return; }
          running = true;
          requestAnimationFrame(function () {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        };
        obj.addEventListener(type, func);
      };

      /* init - you can init any event */
      throttle(browserEventKey, customWindowEventKey);
    })();

  }

  onZoom() { 
    
  }
}