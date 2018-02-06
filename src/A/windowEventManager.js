/**
 * 
 */
class WindowEventManager {

  constructor() {
    this.onLoadCallbacks = [];
    window.addEventListener('load', this.onPageLoad.bind(this));
  }

  init() {
  }

  registerForLoadEvent(callback) {
    this.onLoadCallbacks.push(callback);
  }

  onPageLoad() {
    this.onLoadCallbacks.forEach(function(callback) {
      callback();
    });
  }

}