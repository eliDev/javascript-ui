/**
 * 
 */
class WindowEventManager {

  constructor() {
    this.onLoadCallbacks = [];
    this.didLoad = false;
  }

  init() {
    if (window) {
      window.addEventListener('load', this.onPageLoad.bind(this));
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

}