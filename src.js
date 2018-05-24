/**
 * 
 */
class ClickManager {

    constructor() {
        this.registeredIds = {};
        this.registeredClasses = {};
        this.registeredSubclasses = {};
        this.registeredTags = {};
        this.registeredElementTags = [];
    }

    init() {
        // inside init.
        globals.singletons.windowEventManager.registerForLoadEvent(this.onPageLoad.bind(this));
    }

    onPageLoad() {
        document.body.addEventListener('click', this.onBodyClick.bind(this), true);
    }

    onBodyClick(event) {
        // console.log('clicked: ', event);
        var element = event.target || event.srcElement;
        this._handleIdClick(element, event);
        if (!this._handleClassClick(element, event)){
            event.preventDefault();
        }
        this._handleTagClick(element, event);
    }

    _handleIdClick(element){
        if (this.registeredIds[element.id]) {
            this.registeredIds[element.id](element);
        }
    }

    _handleClassClick(element) {
        var didHandle = false;
        if (this.registeredClasses[element.className]) {
            this.registeredClasses[element.className](element);
            didHandle = true;
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredClasses[parentNode.className]) {
                    this.registeredClasses[parentNode.className](element);
                    didHandle = true;
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
        return didHandle;
    }

    _handleTagClick(element, event) {
        if (this.registeredTags[element.tagName]) {
            this.registeredTags[element.tagName](element, event);
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredTags[parentNode.tagName]) {
                    this.registeredTags[parentNode.tagName](parentNode, event);
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
    }

    // _handleElementClick(element) {
    //     var self = this;
    //     this.registeredElementTags.forEach(function(source){
    //         if (element === source.element){
    //             source.callback(element, )
    //         }
    //     });


    //     if (this.registeredTags[element.tagName]) {
    //         this.registeredTags[element.tagName](element);
    //     }
    //     else {
    //         var parentNode = element.parentNode;
    //         while (parentNode.nodeName != 'BODY') {
    //             if (this.registeredTags[parentNode.tagName]) {
    //                 this.registeredTags[parentNode.tagName](parentNode);
    //                 break;
    //             }
    //             parentNode = parentNode.parentNode;
    //         }
    //     }
    // }

    registerId(id, fn) {
        this.registeredIds[id] = fn;
    }

    registerClass(classname, fn) {
        this.registeredClasses[classname] = fn;
    }

    registerSubclasses(parentClassname, fn) {
        this.registeredSubclasses[classname] = fn;
    }

    /**
     * Overwrites previous registration.
     * @param {*} tag 
     * @param {*} fn 
     */
    registerTag(tag, fn) {
        // Tags are read back from an element as uppercase. 
        var upper = tag.toUpperCase();
        this.registeredTags[upper] = fn;
    }

    // registerTagsUnderElement(element, tags, fn) {
    //     if (!Array.isArray(tags)){
    //         tags = [tags];
    //     }

    //     this.registeredElementTags.push({
    //         element: element,
    //         tags: tags,
    //         calback: fn
    //     });
    // }

}
Direction = {};

Direction.UNDEFINED = -1;
Direction.UP = 0;
Direction.TOP = Direction.UP;
Direction.ABOVE = Direction.UP;
Direction.RIGHT = 1;
Direction.BOTTOM = 2;
Direction.DOWN = Direction.BOTTOM;
Direction.BELOW = Direction.BOTTOM;
Direction.LEFT = 3;
Direction.CENTRE = 4;
Direction.HORIZONTAL = 5;
Direction.VERTICAL = 6;


Direction.isDown = function (direction) {
  return direction === Direction.DOWN;
};
Direction.isUp = function (direction) {
  return direction === Direction.UP;
};
Direction.isTop = function (direction) {
  return Direction.isUp(direction);
};
Direction.isLeft = function (direction) {
  return direction === Direction.LEFT;
};
Direction.isHorizontal = function (direction) {
  return (direction === Direction.LEFT || direction === Direction.RIGHT || direction === Direction.HORIZONTAL);
};
Direction.isVertical = function (direction) {
  return (direction === Direction.DOWN || direction === Direction.UP || direction === Direction.VERTICAL);
};


Direction.sideOpposite = function(side) {
  var oppositeSide = this.UNDEFINED;
  switch (side) {
    case Direction.TOP:
      oppositeSide = this.BOTTOM;
      break;
    case Direction.RIGHT:
      oppositeSide = this.LEFT;
      break;
    case Direction.BOTTOM:
      oppositeSide = this.TOP;
      break;
    case Direction.LEFT:
      oppositeSide = this.RIGHT;
      break;
  }
  return oppositeSide;
};

Direction.elementPostitionForDirection = function (direction) {
  var property = '';
  switch (direction) {
    case Direction.TOP:
      property = 'top';
      break;
    case Direction.RIGHT:
      property = 'right';
      break;
    case Direction.BOTTOM:
      property = 'bottom';
      break;
    case Direction.LEFT:
      property = 'left';
      break;
    default:
      console.log("Direction.elementPostitionForDirection unhandled case: ", direction);
  }
  return property;
};

Direction.toString = function (direction) {
  var s = "";
  switch (direction) {
    case Direction.UP:
    s = 'UP';
      break;
    case Direction.RIGHT:
    s = 'RIGHT';
      break;
    case Direction.DOWN:
    s = 'DOWN';
      break;
    case Direction.LEFT:
    s = 'LEFT';
      break;
    default:
      console.log("Direction.toString unhandled case: ", direction);
  }
  return s;
};
/*jshint esversion: 6 */
/** 
 * For distance from a point in 4 directions of a 2d plane. 
 * */
class DirectionRect {

/** For distance from a point in 4 directions of a 2d plane. */
  constructor() {
    this.top = -1;
    this.right = -1;
    this.bottom = -1;
    this.left = -1;
  }
} /*jshint esversion: 6 */
 /**
  * 2 Points (start, end)
  */
 class Line {
  constructor(startPoint, endPoint) {
    return {start: startPoint, end: endPoint};
  }
 }
/*jshint esversion: 6 */
/**
 * 
 */
class MathUtils {

  constructor() {

  }

  static convertToDegress (radians){
      var degrees = radians * (180.0 / Math.PI);
      return degrees;
    }

  static roundValue (value, roundingFunction) {
      var roundedValue = 0;
      roundingFunction = roundingFunction || Math.round;
    
    if (typeof value === 'number') {
        roundedValue = roundingFunction(value);
    }
    // Assume object.
    else {
      
      var key;
      roundedValue = {};
      for (key in value) {
        roundedValue[key] = ElementUtils.roundValue(value[key], roundingFunction);
      }
    }
    return roundedValue;
  }

}﻿// <reference path="StringUtils.js" />
StringUtils = {};


/**
  @param {String} 'string' text to be measured
  @param {String} 'font' The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana")
  @return {Rectangle} frame of string (x,y are zero)

  http://www.html5canvastutorials.com/tutorials/html5-canvas-text-metrics/
*/
StringUtils.measureStringWidth = function (string, font) {

  if (!Boolean(this.canvas)) {
    var canvas = document.createElement('canvas');
    var docFragment = document.createDocumentFragment();
    docFragment.appendChild(canvas);
    this.canvas = canvas;
  }

  var context = this.canvas.getContext("2d");
  context.font = font;
  var width = context.measureText(string).width;
  return width;
};

/**
  @param {String} 'pixelString' Expected in the form "...###px"
  Expect 'px' to be preceeded by a numeric value.
*/
//StringUtils.parsePixelNumber = function (pixelString) {

//  var pixelIndex = pixelString.indexOf('px');
//  if (pixelIndex < 0) {
//    return null;
//  }

//  var charIndex;
//  var character;
//  var parsedString = "";
//  var number;

//  for (charIndex = pixelIndex - 1; charIndex >= 0; charIndex--) {

//    character = pixelString.charAt(charIndex);
//    if (Number.isInteger(character) || character === '.') {
//      parsedString = character + parsedString;
//    }
//    else {
//      break;
//    }
//  }
//  number = parseInt(parsedString);
//  return number;
//};

/**
   * Determines if the given 'string' has at
   * least one non-whitespace character.
   */
StringUtils.hasText = function (stringInput) {

  var _hasText = false;
  if (null !== stringInput && typeof stringInput === 'string' && stringInput.length > 0) {

    // Whitespace characters which are
    // not considering 'text'.
    var SPACE_CODE = 32;
    var NON_BREAKING_SPACE_CODE = 160;
    var TAB_CODE = 9;

    // Looping through each character is more effecient than
    // performing a regex validation.
    for (var charIndex = 0; charIndex < stringInput.length; charIndex++) {

      var charCode = stringInput.charCodeAt(charIndex);
      switch (charCode) {

        // Whitespace character codes.
        // These characters are ignored.
        case SPACE_CODE:
        case NON_BREAKING_SPACE_CODE:
        case TAB_CODE:
          break;

        default:
          _hasText = true;
      }

      if (_hasText) {
        break;
      }
    }
  }
  return _hasText;
};

/**
http://stackoverflow.com/questions/17888039/javascript-efficient-parsing-of-css-selector
*/
StringUtils.parseSelectors = function (selectorString) {

  var obj = {tags:[], classes:[], ids:[], attrs:[]};
  selectorString.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function (token) {

    switch (token[0]) {
      case '#':
        obj.ids.push(token.slice(1));
        break;
      case '.':
        obj.classes.push(token.slice(1));
        break;
      case '[':
        obj.attrs.push(token.slice(1,-1).split('='));
        break;
      default :
        obj.tags.push(token);
        break;
    }
  });
  return obj;
}/*jshint esversion: 6 */
/**
 * 
 */
class TableUtils {

    constructor(){}

    // document.getElementById("myTable").rows

    static Column(colIndex) {
        var data = [];
        var table = document.getElementsByTagName('table')[0];
        for (var i=0;i < table.rows.length; i++) {
            data.push(table.rows[i].cells[colIndex]);
        }
        return data;
    }
}
// https://developer.mozilla.org/en-US/docs/Web/Events/wheel
// creates a global "addWheelListener" method
// example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
(function(window,document) {

  var prefix = "", _addEventListener, support;

  // detect event model
  if ( window.addEventListener ) {
      _addEventListener = "addEventListener";
  } else {
      _addEventListener = "attachEvent";
      prefix = "on";
  }

  // detect available wheel event
  support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
            "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

  window.addWheelListener = function( elem, callback, useCapture ) {
      _addWheelListener( elem, support, callback, useCapture );

      // handle MozMousePixelScroll in older Firefox
      if( support == "DOMMouseScroll" ) {
          _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
      }
  };

  function _addWheelListener( elem, eventName, callback, useCapture ) {
      elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
          !originalEvent && ( originalEvent = window.event );

          // create a normalized event object
          var event = {
              // keep a ref to the original event object
              originalEvent: originalEvent,
              target: originalEvent.target || originalEvent.srcElement,
              type: "wheel",
              deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
              deltaX: 0,
              deltaY: 0,
              deltaZ: 0,
              preventDefault: function() {
                  originalEvent.preventDefault ?
                      originalEvent.preventDefault() :
                      originalEvent.returnValue = false;
              }
          };
          
          // calculate deltaY (and deltaX) according to the event
          if ( support == "mousewheel" ) {
              event.deltaY = - 1/40 * originalEvent.wheelDelta;
              // Webkit also support wheelDeltaX
              originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
          } else {
              event.deltaY = originalEvent.deltaY || originalEvent.detail;
          }

          // it's time to fire the callback
          return callback( event );

      }, useCapture || false );
  }

})(window,document);/*jshint esversion: 6 */
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
      WindowEventManager._startWatchingResize();
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

  static _startWatchingResize() {
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
      throttle("resize", "optimizedResize");
    })();
  }

}/*jshint esversion: 6 */
/**
 * 
 */
class Point {
  constructor(x,y) {
    if (x === undefined) {
      x = 0;
    }
    if (y === undefined) {
      y = 0;
    }
    this.x = x;
    this.y = y;
  }

  static fromPoint(point) {
    return new Point(point.x, point.y);
  }

  static zero() {
    return new Point(0,0);
  }

  static fromX(x) {
    return new Point(x, 0);
  }

  copy() {
    return Point.copy(this);
  }

  static copy(point) {
    return new Point(point.x, point.y);
  }

  /** ================
     Add
  =================== */

  addX(point) {
    this.x += point.x;
  }

  static add(point1, point2) {
    var point = Point.fromPoint(point1);
    point.add(point2);
    return point;
  }

  add(point) {
    this.x += point.x;
    this.y += point.y;
  }

  /** ================
     Subtract
  =================== */

  subtractX(point) {
    this.x -= point.x;
  }

  subtractY(point) {
    this.y -= point.y;
  }

  static subtract(point1, point2) {
    var point = Point.fromPoint(point1);
    point.subtract(point2);
    return point;
  }

  subtract(point){
    this.x -= point.x;
    this.y -= point.y;
  }

   /** ================
      Compare
  =================== */

  equals(otherPoint) {
    if (!otherPoint) {
      return false;
    }
    return this.x === otherPoint.x && this.y === otherPoint.y;
  }
 
  static min(p1, p2) {
    var p = new Point();
    p.x = Math.min(p1.x, p2.x);
    p.y = Math.min(p1.y, p2.y);
    return p;
  }
 
  static max(p1, p2) {
    var p = new Point();
    p.x = Math.max(p1.x, p2.x);
    p.y = Math.max(p1.y, p2.y);
    return p;
  }


    
 static distanceBetweenPoints(startPoint, endPoint) {
    var xDiff = endPoint.x - startPoint.x;
    var yDiff = endPoint.y - startPoint.y;
    return Point(xDiff, yDiff);
  }

  static directionalDistranceBetweenPoints(sourcePoint, other) {
    var directionRect = new DirectionRect();
    if (other.x >= sourcePoint.x) {
      directionRect.right = other.x - sourcePoint.x;
    }
    else if (other.x <= sourcePoint.x) {
      directionRect.left = sourcePoint.x - other.x;
    }
    if (other.y >= sourcePoint.y) {
      directionRect.bottom = other.y - sourcePoint.y;
    }
    else if (other.y < sourcePoint.y) {
      directionRect.top = sourcePoint.y - other.y;
    }
    return directionRect;
  }
  
  toString() {
    return "{".concat(this.x.toString())
    .concat(", ")
    .concat(this.y.toString())
    .concat("}"); 
  }

   /** ========
        Sides
    =========== */

    setPositionForSide(val, direction) {
      switch (direction) {
        case Direction.UP:
        case Direction.DOWN:
        this.y = val;
          break;
        case Direction.LEFT:
        case Direction.RIGHT:
        this.x = val;
          break;
        default:
          console.log("Point.setPositionForSide unhandled case: ", direction);
      }
    }

    setPositionForSidePlus(val, direction) {
      var addition = this.positionForSide(direction) + val;
      this.setPositionForSide(addition, direction);
    }

    positionForSide(direction) {
      var val;
      switch (direction) {
        case Direction.UP:
        case Direction.DOWN:
        val = this.y;
          break;
        case Direction.LEFT:
        case Direction.RIGHT:
        val = this.x;
          break;
        default:
          console.log("Point.positionForSide unhandled case: ", direction);
      }
      return val;
    }
}/*jshint esversion: 6 */
/**
 * 
 */
class Rectangle {
  constructor(x, y, width, height) {
    if (undefined === x) { x = 0;}
    if (undefined === y) {  y = 0; }
    if (undefined === width) { width = 0; }
    if (undefined === height) { height = 0; }
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }

  static zero() {
    return new Rectangle();
  }

  static fromOriginAndSize(origin, size) {
    var r = new Rectangle();
    r.setOrigin(origin);
    r.setSize(size.x, size.y);
    return r;
  }

  copyValues(rectangle) {
    this.x = rectangle.x;
    this.y = rectangle.y;
    this.width = rectangle.width;
    this.height = rectangle.height;
  }

  copy() {
    return Rectangle.copy(this);
  }

  static copy(rectangle) {
    var rect = new Rectangle();
    rect.x = rectangle.x;
    rect.y = rectangle.y;
    rect.width = rectangle.width;
    rect.height = rectangle.height;
    return rect;
  }

  static combineRects(rect1, rect2) {
    var r = new Rectangle();
    r.setOrigin(Point.min(rect1.getOrigin(), rect2.getOrigin()));
    r.setMaxPoint(Point.max(rect1.getMaxPoint(), rect2.getMaxPoint()));
    return r;
  }

  /** ==============
      EQUALITY
    ===============*/

    equals(otherRect) {
      return ((otherRect.x === this.x && otherRect.y === this.y) &&
              (otherRect.width === this.width && otherRect.height === this.height));
    }

  /** ==========
        Points
    ============ */

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }
  
  maxX() {
    return this.getRight();
  }

  maxY() {
    return this.getBottom();
  }

  posForDirection(direction) {
    var pos;
    switch (direction) {
      case Direction.UP:
      case Direction.DOWN:
      pos = this.y;
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
      pos = this.x;
        break;
      default:
        console.log("Rectangle.posForDirection unhandled case: ", direction);
    }
    return pos;
  }

  maxPosForDirection(direction) {
    var pos;
    switch (direction) {
      case Direction.UP:
      case Direction.DOWN:
      pos = this.maxY();
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
      pos = this.maxX();
        break;
      default:
        console.log("Rectangle.maxPosForDirection unhandled case: ", direction);
    }
    return pos;
  }

  getOrigin() {
    return new Point(this.x,this.y);
  }

  setOrigin(point) {
    this.setXY(point.x, point.y);
  }

  getMaxXPoint() {
    return new Point(this.getRight(), this.y);
  }

  getMaxYPoint() {
    return new Point(this.x, this.getBottom());
  }

  maxPoint() {
    return new Point(this.getRight(), this.getBottom());
  }

  setMaxPoint(point) {
    this.setRight(point.x);
    this.setBottom(point.y);
  }

  getBoundsCentre() {
    var centre = {};
    centre.x = this.halfWidth();
    centre.y = this.halfHeight();
    return centre;
  }

  getCentre() {
    var centre = {};
    centre.x = this.x + this.halfWidth();
    centre.y = this.y + this.halfHeight();
    return centre;
  }

  setCentreX(x) {
    this.x = (x - this.halfWidth());
  }

  setCentreY(y) {
    this.y = (y - this.halfHeight());
  }

  setCentreXY(x, y) {
    this.setCentreX(x);
    this.setCentreY(y);
  }

  setCentre(centre) {
    this.setCentreXY(centre.x, centre.y);
  }

  moveBy(point) {
    this.x = this.x + point.x;
    this.y = this.y + point.y;
  }

  moveInDirection(direction, distance) {
    if (distance === undefined) {
      return;
    }
    switch (direction) {
      case Direction.UP:
      case Direction.DOWN:
      this.y = this.y + distance;
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
      this.x = this.x + distance;
        break;
      default:
        console.log("Rectangle.moveInDirection unhandled case: ", direction);
    }
  }

  /** =============
        Size
    ===============*/

  hasSize() {
    return this.width > 0 && this.height > 0;
  }

  hasZeroSize() {
    return this.width === 0 && this.height === 0;
  }

  boundsForFrame(otherRect) {
      var bounds = Rectangle.copy(otherRect);
      bounds.x -= this.x;
      bounds.y -= this.y;
      return bounds;
  }

 /**
  * @param {Number} 'width'
  * @param {Boolean} 'stickyCentre'
  */
  setWidth(width, stickyCentre) {
    this.setSize(width, this.height, stickyCentre);
  }

  setWidthPlus(extraWidth, stickyCentre) {
    this.setSizePlus(extraWidth, 0, stickyCentre);
  }

  setWidthMinus(lessWidth, stickyCentre) {
    this.setSizeMinus(lessWidth, 0, stickyCentre);
  }

  halfWidth() {
    var halfWidth = (this.width / 2);
    return halfWidth;
  }

 /**
  * @param {Number} 'height'
  * @param {Boolean} 'stickyCentre'
  */
  setHeight(height, stickyCentre) {
    this.setSize(this.width, height, stickyCentre);
  }

  setHeightPlus(extraHeight, stickyCentre) {
    this.setSizePlus(0, extraHeight, stickyCentre);
  }

  setHeightMinus(lessHeight, stickyCentre) {
    this.setSizeMinus(0, lessHeight, stickyCentre);
  }

  halfHeight() {
    var halfHeight = (this.height / 2);
    return halfHeight;
  }

  size() {
    return new Point(this.width, this.height);
  }

  sizeToString() {
    return "width: " + this.width + ", height: " + this.height;
  }

  /**
    @param {Number} 'width'
    @param {Number} 'height'
    @param {Boolean} 'stickyCentre' If true, centre remains the same 
                      after applying size.
  */
  setSize(width, height, stickyCentre) {
    var centre = this.getCentre();
    this.height = height;
    this.width = width;

    if (stickyCentre) {
      this.setCentre(centre);
    }
  }

  setZeroSize() {
    this.setSize(0,0);
  }

  setSizePlus(extraWidth, extraHeight, stickyCentre) {
    this.setSize(this.width + extraWidth, this.height + extraHeight, stickyCentre);
  }

  setSizeMinus(lessWidth, lessHeight, stickyCentre) {
    this.setSize(this.width - lessWidth, this.height - lessHeight, stickyCentre);
  }

  setSizeForDirection(size, direction) {
    switch (direction) {
      case Direction.UP:
      case Direction.DOWN:
      this.setHeight(size);
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
      this.setWidth(size);
        break;
      default:
        console.log("Rectangle.setSizeForDirection unhandled case: ", direction);
    }
  }

  sizeForDirection(direction) {
    var size;
    switch (direction) {
      case Direction.UP:
      case Direction.DOWN:
      size = this.height;
        break;
      case Direction.LEFT:
      case Direction.RIGHT:
      size = this.width;
        break;
      default:
        console.log("Rectangle.sizeForDirection unhandled case: ", direction);
    }
    return size;
  }

  bounds() {
    return new Rectangle(0,0,this.width,this.height);
  }

  /** =============
        Resize
    ===============*/

 /**
  * Enlarges the frame on all sides, centre remains the same.
  * @param {Number} 'amount' size to increase by.
  */
  stretchBy(amount) {
    this.stretchHoriztonally(amount);
    this.stretchVertically(amount);
  }

 /**
  * Width increase by 2 * amount. Centre remains the same.
  */
  stretchHoriztonally(amount) {
    this.x -= amount;
    this.width += (2 * amount);
  }

  stretchVertically(amount) {
    this.y -= amount;
    this.height += (2 * amount);
  }

 /**
  * If the x position is close to the left edge, the rectangle's
  * x-position will be set, and right edge will remain the same.
  * 
  * If 'xPos' is closer to the right side, width will change and 
  * the rectangle's x-position will remain unchanged.
  * 
  * @param {Number} 'xPos' Coordinate on screen.
  * @param {Number} 'plusDistance' Any additional padding beyond the xPos.
  */
  stretchToXPos(xPos, plusDistance) {
    var rightPos;
    var sideNearXPos = this.horizontalSideClosestToXPos(xPos);
    if (!Boolean(plusDistance)) {
      plusDistance = 0;
    }

    if (sideNearXPos === Direction.LEFT) {
      rightPos = this.getRight();
      this.x = (xPos - plusDistance);
      this.setRight(rightPos);
    }
    else if (sideNearXPos === Direction.RIGHT) {
      // No change in x pos.
      this.setRight(xPos + plusDistance);
    }
  }

  /** =============
        Hit Test
    ===============*/

  containsPoint(point) {
      var contains = ((point.x >= this.x && point.x < this.getRight()) &&
          (point.y >= this.y && point.y < this.getBottom()));
      return contains;
  }

  containsXY(x, y) {
      var point = new Point(x,y);
      return this.containsPoint(point);
  }

  containsX(x) {
      var point = new Point(x, this.y);
      return this.containsPoint(point);
  }

    /** ================
        Relationships
    =================== */

  frameWithin(parentRect, parentScrollOffset) {
    var frame = this.copy();
    frame.x -= parentRect.x;
    frame.y -= parentRect.y;
    // Discount any scrolling in parent.
    if (parentScrollOffset) {
      frame.y += parentScrollOffset.y;
      frame.x += parentScrollOffset.x;
    }
    return frame;
  }

  overlaps(otherRect, outRect) {
      var overlappingRect = this.overlappingFrame(otherRect);
      if (overlappingRect.equals(RectZero())) {
        return false;
      }
      if (outRect){
        outRect.copy(overlappingRect);
      }
      return true;
      // var overlaps = false;
      // if (this.containsPoint(otherRect.getOrigin()) || otherRect.containsPoint(this.getOrigin())) {
      //   overlaps = true;
      // }
      // else if (this.containsPoint(otherRect.getMaxXPoint()) || otherRect.containsPoint(this.getMaxXPoint())) {
      //   overlaps = true;
      // }
      // else if (this.containsPoint(otherRect.getMaxYPoint()) || otherRect.containsPoint(this.getMaxYPoint())) {
      //   overlaps = true;
      // }
      // else if (this.containsPoint(otherRect.getMaxPoint()) || otherRect.containsPoint(this.getMaxPoint())) {
      //   overlaps = true;
      // }
      // if (outRect){
      //   outRect.copy(this.overlappingRect(otherRect));
      // }
      // return overlaps;
  }

  overlappingFrame(otherRect) {
    var overlapRect = new Rectangle();
    overlapRect.y = Math.max(otherRect.y, this.y);
    overlapRect.x = Math.max(otherRect.x, this.x);
    overlapRect.setBottom(Math.min(otherRect.getBottom(), this.getBottom()));
    overlapRect.setRight(Math.min(otherRect.getRight(), this.getRight()));
    if (overlapRect.width <= 0 || overlapRect.height <= 0){
      overlapRect = undefined;
    }
    return overlapRect;
  }

  relativeFramesTo(otherFrame) {
    var position = {
        frame: Rectangle.copy(this),
        isValid: false,
        topFrame: undefined,
        rightFrame: undefined,
        bottomFrame: undefined,
        leftFrame: undefined,
        insideFrame: undefined,
        boundInOriginal: function(originalFrame, positionFrame) {
            return originalFrame.boundsForFrame(positionFrame);
        }
    };

    if (!otherFrame.hasSize() || !this.hasSize()) {
      return position;
    }
    position.isValid = true;
    var overlapRect = this.overlappingFrame(otherFrame);
    if (!overlapRect) {
        var relativeRect = Rectangle.copy(this);
        var outsideEdgeRect = otherFrame.distanceOutside(this.getCentre());
        if (outsideEdgeRect.top >= 0) {
            relativeRect.setCentreY(outsideEdgeRect.top);
            position.topFrame = relativeRect;
        }
        if (outsideEdgeRect.right >= 0) {
            relativeRect.setCentreX(outsideEdgeRect.right);
            position.rightFrame = relativeRect;
        }
        if (outsideEdgeRect.bottom >= 0) {
            relativeRect.setCentreY(outsideEdgeRect.bottom);
            position.bottomFrame = relativeRect;
        }
        if (outsideEdgeRect.left >= 0) {
            relativeRect.setCentreX(outsideEdgeRect.left);
            position.leftFrame = relativeRect;
        }
    }
    else {
        position.insideFrame = overlapRect;
        var rightFrame = new Rectangle(overlapRect.maxX(), this.y, this.maxX() - overlapRect.maxX(), this.height);
        if (rightFrame.hasSize() && !rightFrame.hasZeroSize()) {
            position.rightFrame = rightFrame;
        }
        var leftFrame = new Rectangle(this.x, this.y, overlapRect.x - this.x, this.height);
        if (leftFrame.hasSize() && !leftFrame.hasZeroSize()) {
            position.leftFrame = leftFrame;
        }
        var topFrame = new Rectangle(this.x, this.y, this.width, overlapRect.y - this.y);
        if (topFrame.hasSize() && !topFrame.hasZeroSize()) {
            position.topFrame = topFrame;
        }
        var bottomFrame = new Rectangle(this.x, overlapRect.maxY(), this.width, this.maxY() - overlapRect.maxY());
        if (bottomFrame.hasSize() && !bottomFrame.hasZeroSize()) {
            position.bottomFrame = bottomFrame;
        }
    }
    return position;
}

  /**
      Zero if point is within the rectangle or outside vertically.
      Negative x: the point is outside to the left.

      @param {point} 'point' has x: y: properties.
      @return {DirectionRect} (top >= 0): Given point is above rect
                              (top < 0): Given point is not above rect.
                              (right >= 0): Given point is right of rect
                              (right < 0): Given point is not right of rect.
                              (bottom >= 0): Given point is below rect
                              (bottom < 0): Given point is not below rect.
                              (left >= 0): Given point is left of rect
                              (left < 0): Given point is not left of rect.
      All negatives means point is within rect.
  */
  distanceOutside(point) {
    if (this.containsPoint(point)) {
      return new DirectionRect();
    }
    var directionRect = new DirectionRect();
    if (point.x >= this.getRight()) {
      directionRect.right = point.x - this.getRight();
    }
    else if (point.x < this.x) {
      directionRect.left = this.x - point.x;
    }
    if (point.y >= this.getBottom()) {
      directionRect.bottom = point.y - this.getBottom();
    }
    else if (point.y < this.y) {
      directionRect.top = this.y - point.y;
    }
    return directionRect;
  }

  /** ==============
      SIDES
  ===============*/

  isOutsideEdge(point, thisRectSide) {
    var isBeyond = false;
    var directionRect = this.distanceOutside(point);
    switch (thisRectSide) {
      case Direction.TOP:
        isBeyond = directionRect.top >= 0;
        break;
      case Direction.RIGHT:
        isBeyond = directionRect.right >= 0;
        break;
      case Direction.BOTTOM:
        isBeyond = directionRect.bottom >= 0;
        break;
      case Direction.LEFT:
        isBeyond = directionRect.left >= 0;
        break;
        default:
        console.log("Rectangle isOutsideEdge() unhandled case: ", thisRectSide);
    }
    return isBeyond;
  }

  isInsideEdge(point, thisRectSide) {
    var isInside = false;
    var directionRect = Point.directionalDistranceBetweenPoints(this.centreOfSide(thisRectSide), point);
    switch (thisRectSide) {
      case Direction.TOP:
      isInside = directionRect.bottom >= 0;
        break;
      case Direction.RIGHT:
      isInside = directionRect.left >= 0;
        break;
      case Direction.BOTTOM:
      isInside = directionRect.top >= 0;
        break;
      case Direction.LEFT:
      isInside = directionRect.right >= 0;
        break;
        default:
        console.log("Rectangle isInsideEdge() unhandled case: ", thisRectSide);
    }
    return isInside;
  }

  /**
    The given is either closer to the left or right side 
    of the rectangle (unless centred, in which case CENTRE
    is returned).

    @see {@link RectangleSide.RIGHT}
    @see {@link RectangleSide.LEFT}

    @param {Number} 'xPos' horizontal coordinate.
    @return {Number} A RectangleSide 'direction'
  */
  horizontalSideClosestToXPos(xPos) {
    var side = Direction.CENTRE;
    if (xPos > this.getCentre().x) {
      side = Direction.RIGHT;
    }
    else if (xPos < this.getCentre().x) {
      side = Direction.LEFT;
    }
    return side;
  }

 /**
  * Returns the point representings the
  * centre along the top of the rectangle.
  */
  centreOfSide(side) {
    var point;
    switch (side) {
      case Direction.TOP:
        point = new Point(this.x + this.halfWidth(), this.y);
        break;
      case Direction.RIGHT:
        point = new Point(this.x + this.width, this.y + this.halfHeight());
        break;
      case Direction.BOTTOM:
        point = new Point(this.x + this.halfWidth(), this.y + this.height);
        break;
      case Direction.LEFT:
        point = new Point(this.x, this.y + this.halfHeight());
        break;
    } 
    return point;
  }

  static originToCentreSide(rect, side, centreOfSide) {
    var origin = rect.originToCentreSidePlus(side, centreOfSide, 0);
    return origin;
  }

  originToCentreSidePlus(side, centreOfSide, extraDistance) {
    var origin = {};
    switch (side) {
      case Direction.TOP:
        origin.x = centreOfSide.x - this.halfWidth();
        origin.y = centreOfSide.y - extraDistance;
        break;
      case Direction.RIGHT:
        origin.x = centreOfSide.x - this.width - extraDistance;
        origin.y = centreOfSide.y - this.halfHeight();
        break;
      case Direction.BOTTOM:
        origin.x = centreOfSide.x - this.halfWidth();
        origin.y = centreOfSide.y + this.height + extraDistance;
        break;
      case Direction.LEFT:
        origin.x = centreOfSide.x - extraDistance;
        origin.y = centreOfSide.y - this.halfHeight();
        break;
    }
    return origin;
  }

  originToCentreBesideRect(referenceRect, referenceSide) {
    var origin = this.originToCentreBesideRectPlus(referenceRect, referenceSide, 0);
    return origin;
  }
  
  originToCentreBesideRectPlus(referenceRect, referenceSide, extraDistance) {
    if (undefined === extraDistance) {
      extraDistance = 0;
    }
    var centreReferenceSide = referenceDomRect.centreOfSide(referenceSide);
    var oppositeSide = Direction.sideOpposite(referenceSide);
    var origin = this.originToCentreSidePlus(oppositeSide, centreReferenceSide, -extraDistance);
    return origin;
  }

  /** ==============
    DOMRect Utils
  ================== */

  getTop() {
    return this.y;
  }

  getLeft() {
    return this.x;
  }

  getRight() {
    return this.x + this.width;
  }

  setRight(right) {
    this.width = (right - this.x);
  }

  getBottom() {
    return this.y + this.height;
  }

  setBottom(y) {
    this.height = (y - this.y);
  }

  static combineDOMRects(DOMrect1, DOMrect2) {
    var r1 = Rectangle.fromDOMRect(DOMrect1);
    var r2 = Rectangle.fromDOMRect(DOMrect2);
    return Rectangle.combineRects(r1, r2);
  }

   /**
    * @param {ClientRect} 'clientRect'
    */
  static fromDOMRect(DOMRect) {
    var rectangle = new Rectangle();
    rectangle.x = DOMRect.left;
    rectangle.y = DOMRect.top;
    rectangle.width = DOMRect.right - DOMRect.left;
    rectangle.height = DOMRect.bottom - DOMRect.top;
    return rectangle;
  }

  static boundsFromDOMRect(DOMRect) {
    var rectangle = Rectangle.fromDOMRect(DOMRect);
    return rectangle.bounds();
  }

  toDOMRect() {
    return {
      bottom: this.getBottom(),
      height: this.height,
      left: this.getLeft(),
      right: this.getRight(),
      top: this.getTop(),
      width: this.width,
      x: this.x,
      y: this.y
    };
  }

}/*jshint esversion: 6 */
/**
 * 
 */
class CSSUtils {

    constructor() { }
    /**
     false when class is undefined or not in the
     element's class list.

     @param {HTML Element} 'element'
     @param {String} 'className'
     */
    static elementHasClass(element, className) {
        if (undefined === element || undefined === className || null === className) {
            return false;
        }
        var hasClass = element.classList.contains(className);
        return hasClass;
    }

    static overwriteClass(element, className) {
        if (undefined === element || undefined === className || null === className) {
            return false;
        }
        CSSUtils.removeClasses(element);
        element.classList.add(className);
    }

    static removeClasses(element, classesToRemove) {
        if (undefined === element) {
            return;
        }
        if (undefined === classesToRemove || null === classesToRemove) {
            classesToRemove = element.classList;
        }
        element.classList.remove(...classesToRemove);
    }

    static setStyle(element, styleName, value) {
        element.style[styleName] = value;
        switch(styleName) {
            case 'position': {
                if (value === 'sticky') {
                    element.style[styleName] = '-webkit-sticky';
                } else if (value === '-webkit-sticky') {
                    element.style[styleName] = 'sticky';
                }
            }
        }
    }

    /** ==============
        Display
        ===============*/

    static setGone(element, shouldGo, displayName) {

        if (!element) {
            return;
        }

        if (Array.isArray(element)){
            for (var i=0; i<element.length;i++){
                this.setGone(element[i], shouldGo);
            }
            return;
        }

        var wasGone = this.isGone(element);

        if (shouldGo) {
            if (!wasGone) {
                var display = CSSUtils.getDisplay(element);
                element.removedDisplay = display;
                element.style.display = 'none';
            }
        }
        else if (wasGone) {
            if (displayName) {
                element.style.display = displayName;
            }
            else if (element.removedDisplay && element.removedDisplay !== 'none') {
                element.style.display = element.removedDisplay;
            }
            else {
                element.style.display = 'block';
            }
        }
    }

    static isGone(element) {
        var display = CSSUtils.getDisplay(element);
        var isGone = (display === 'none');
        return isGone;
    }

    static getDisplay(element) {
        var display = "";
        if (element.style && element.style.display) {
            display = element.style.display;
        }
        else {
            display = getComputedStyle(element, null).display;
        }
        return display;
    }

     /** ==============
            Clipping
        ===============*/

    /*
        Rect to be clipped should be given as bounds to the 
        element's clientRect
       https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
    */

    /**
     * The given rect will be empty and the content will
     * be visible outside.
     * 
     * This requires a somewhat complex clipping rule
     * since clipping preserves the inside.
     */
    static clipPoints(elementBounds, clipRectBounds) {
        // Carve out the region to keep visible.
        // Points are within the bounds of the element frame.
        var points = [

            // Top left.
            { x: 0, y: 0 },
            // Right movement. Will loop back if top if clipped out.
            { x: elementBounds.width, y: 0 },

            { x: elementBounds.width, y: clipRectBounds.y },

            { x: clipRectBounds.x, y: clipRectBounds.y },

            { x: clipRectBounds.x, y: clipRectBounds.getBottom() },

            { x: clipRectBounds.getRight(), y: clipRectBounds.getBottom() },

            { x: clipRectBounds.getRight(), y: clipRectBounds.y },

            { x: elementBounds.width, y: clipRectBounds.y},

            { x: elementBounds.width, y: elementBounds.height },

            { x: 0, y: elementBounds.height }
        ];
        return points;
    }

    static clipLeftInset(element, leftInset) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = Rectangle.boundsFromDOMRect(elementRect);
        var clipBounds = Rectangle.copy(elementBounds);
        clipBounds.setWidth(leftInset);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipBetweenHorizontal(element, minX, maxX) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = Rectangle.boundsFromDOMRect(elementRect);
        var clipBounds = new Rectangle(minX, 0, maxX - minX, elementBounds.height);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipInsideBounds(element, clipBounds) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = Rectangle.boundsFromDOMRect(elementRect);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipInsideRect(element, clipFrame) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = Rectangle.boundsFromDOMRect(elementRect);
        var clipBounds = Rectangle.fromDOMRect(elementRect).boundsForFrame(clipFrame);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipOutRectangle(element, elementBounds, clipBounds) {
        var points = CSSUtils.clipPoints(elementBounds, clipBounds);
        var index;
        var cssValue = 'polygon(';
        var pointsLength = points.length;

        for (index = 0; index < pointsLength; index++) {
            cssValue += points[index].x + 'px ' + points[index].y + 'px';
            if (index < pointsLength - 1) {
                cssValue += ', ';
            }
        }
        cssValue += ')';
        // console.log("clip path: ", cssValue);
        element.style['-webkit-clip-path'] = cssValue;
    }

    static removeClipPath(element) {
        element.style['-webkit-clip-path'] = '';
    }

}/*jshint esversion: 6 */
/**
 * 
 */
class TransformUtils {

  constructor() {
  }

  static getVendorPrefix () {
    return 'transform';
  }

     /**
     * Parses the transform to find the given property 
     * (e.g. 'scale', 'translateY', ...);
     * 
     * @see https://css-tricks.com/get-value-of-css-rotation-through-javascript/
     * @see https://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#matrix-decomposition
     * @see https://www.w3.org/TR/SVG/coords.html#RotationDefined
     * 
     * @param {HTMLElement} 'element'
     * @param {CSSStyleDeclaration} 'styles' Optional. HTMLElement.style
     * @param {String} 'propertyName' The name of the type of transform.
     * @return {Number} A default appropriate to the property will be 
     *                  returned if no transform is present.
     */
    static getValue (styles, propertyName) {
      
      var transform = styles.getPropertyValue(this.getVendorPrefix());


      // var transform = styles.getPropertyValue("-webkit-transform") ||
      //                 styles.getPropertyValue("-moz-transform") ||
      //                 styles.getPropertyValue("-ms-transform") ||
      //                 styles.getPropertyValue("-o-transform") ||
      //                 styles.getPropertyValue("transform") ||
      //                 "";
      
      var value = 0;
      if (transform === 'none') {
        switch(propertyName){
          case 'scale':
            value = 1;
          break;
        }
        return value;
      }
      
      var matrix = this._parseMatrix(transform);
      
      switch(propertyName) {
          case 'scale':
            value = Math.sqrt((matrix.m11 * matrix.m11) + (matrix.m12 * matrix.m12));
          break;
          case 'translateY':
            value = matrix.m42;
          break;
          
          case 'rotateX':
          case 'rotateY':
          case 'rotateZ':
          {
            var rotateY = Math.asin(-matrix.m13);
            if (propertyName === 'rotateY') {
              value = rotateY;  
            }
            else if (propertyName === 'rotateX') {
              
              if (Math.cos(rotateY) !== 0) {
                value = Math.atan2(matrix.m23, matrix.m33);
              } 
              else {
                value = Math.atan2(-matrix.m31, matrix.m22);
              }
            }
            // rotateZ
            else {
              value = 0;
              if (Math.cos(rotateY) !== 0) {
                value = Math.atan2(matrix.m12, matrix.m11);
              } 
            }
            value = MathUtils.convertToDegress(value);
          }
          break;
      }
      return value;
    }

    /**
     * @see http://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/
     */
    static _parseMatrix (matrixString) {
        var c = matrixString.split(/\s*[(),]\s*/).slice(1,-1),
            matrix;
    
        if (c.length === 6) {
            // 'matrix()' (3x2)
            matrix = {
                m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
                m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
                m13: 0,     m23: 0,     m33: 1, m43: 0,
                m14: 0,     m24: 0,     m34: 0, m44: 1
            };
        } else if (c.length === 16) {
            // matrix3d() (4x4)
            matrix = {
                m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
                m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
                m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
                m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
            };
    
        } else {
            // handle 'none' or invalid values.
            matrix = {
                m11: 1, m21: 0, m31: 0, m41: 0,
                m12: 0, m22: 1, m32: 0, m42: 0,
                m13: 0, m23: 0, m33: 1, m43: 0,
                m14: 0, m24: 0, m34: 0, m44: 1
            };
        }
        return matrix;
    }

    static isTransform(propertyName) {
      var isTransform = false;
      switch (propertyName){
        case 'scale':
        case 'translateY':
        case 'translateX':
        case 'rotateX':
        case 'rotateY':
          isTransform = true;
          break;
      }
      return isTransform;
    }

    static translationForDirection(direction) {
      var val;
      switch (direction) {
        case Direction.UP:
        case Direction.DOWN:
        val = 'translateY';
          break;
        case Direction.LEFT:
        case Direction.RIGHT:
        val = 'translateX';
          break;
        default:
          console.log("TransformUtils.translationForDirection unhandled case: ", direction);
      }
      return val;
    }

    static scaleForDirection(direction) {
      var val;
      switch (direction) {
        case Direction.UP:
        case Direction.DOWN:
        val = 'scaleY';
          break;
        case Direction.LEFT:
        case Direction.RIGHT:
        val = 'scaleX';
          break;
        default:
          console.log("TransformUtils.scaleForDirection unhandled case: ", direction);
      }
      return val;
    }

}/*exported CanvasUtils */
class CanvasUtils {
  
  static getContext(canvas) {
    return canvas.getContext("2d");
  }
  
    /* ============
        Circle
    ============== */ 
    
  static drawCircleInRect(canvas, rectangle) {
  
    // var START_ANGLE = 0;
    // var END_ANGLE = 2 * Math.PI;
    // var context = CanvasUtils.getContext(canvas);
    // var center = rectangle.getCentre();
    // var radius = Math.min(rectangle.halfWidth(), rectangle.halfHeight());
    context.beginPath();
    applyCircle(canvas, rectangle);
    // context.arc(center.x, center.y, radius, START_ANGLE, END_ANGLE);
    context.stroke();
  }
  
  static drawCircle(canvas, centrePoint, radius) {
    var START_ANGLE = 0; 
    var END_ANGLE = 2 * Math.PI;
    var context = CanvasUtils.getContext(canvas);
    context.beginPath();
    context.arc(centrePoint.x, centrePoint.y, radius, START_ANGLE, END_ANGLE);
    context.stroke();
  }
  
  static applyCircle(canvas, rectangle){
    var START_ANGLE = 0;
    var END_ANGLE = 2 * Math.PI;
    var radius = Math.min(rectangle.halfWidth(), rectangle.halfHeight());
    var center = rectangle.getCentre();
    var context = CanvasUtils.getContext(canvas);
    context.arc(center.x, center.y, radius, START_ANGLE, END_ANGLE);
  }
  
  static fillCircle(canvas, rect, colourString) {
    var context = CanvasUtils.getContext(canvas);
    context.fillStyle = colourString;
    CanvasUtils.applyCircle(canvas, rect);
    context.fill();
  }
  
  
  static clearCircle(canvas, rect) {
    var context = CanvasUtils.getContext(canvas);
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
  }
  
  
  /* ================
        Rectangle
  =================== */ 

  // function drawRectWithCentre(context, centrePoint, width, height) {

  //   var x = centrePoint.x - (width / 2);
  //   var y = centrePoint.y - (height / 2);
  //   context.beginPath();
  //   context.rect(x, y, width, height);
  //   context.stroke();
  // }

  static drawRect(canvas, rect) {
    var context = CanvasUtils.getContext(canvas);
    context.beginPath();
    context.rect(rect.x, rect.y, rect.width, rect.height);
    context.stroke();
  }

  static fillRect(canvas, rect, colourString) {
    
    var context = CanvasUtils.getContext(canvas);
    context.fillStyle = colourString;
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  static drawLine(canvas, startPoint, endPoint) {
    var context = CanvasUtils.getContext(canvas);
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
  }

  static clearCanvas(canvas) {
    CanvasUtils.clearCanvasRect(canvas, RectBoundsFromElement(canvas));
  }

  static clearCanvasRect(canvas, rect) {
    var context = CanvasUtils.getContext(canvas);
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
  }
  
}﻿/*jshint esversion: 6 */
/**
 * 
 */
class ElementPosition {

  constructor() { }

  /** ===========
     scrolling
  =============== */

  static scrollOffset(element) {
    return new Point(element.scrollLeft, element.scrollTop);
  }

  /** =========
     Frame
  ============= */

  static position(element) {
    return {
      viewportFrame: Rectangle.fromDOMRect(element.getBoundingClientRect()),
      scrollOffset: ElementPosition.scrollOffset(element)
    };
  }

  static viewportFrames(elements) {
    var rects = [];
    for (var i = 0; i < elements.length; i ++) {
      var r = Rectangle.fromDOMRect(elements[i].getBoundingClientRect());
      rects.push(r);
    }
    return rects;
}

 /**
  * Returns the element's coordinates in its parent element.
  * Note: if the given element has no parent, then
  * frame will equal the boundingClientRect.
  * @param {HTML Element} 'element' element in DOM
  * @return {link Rectangle} 
  */
 static getFrame(element) {
   return ElementPosition.getFrameInParent(element);
  }

  static getFrameInParent(element, parentElement) {
    if (!element) {
      return undefined;
    }
    if (!parentElement) {
      parentElement = element.parentElement;
    }

    var parentPosition = ElementPosition.position(parentElement);
    var elementRect = Rectangle.fromDOMRect(element.getBoundingClientRect());
    var frame = elementRect.frameWithin(parentPosition.viewportFrame, parentPosition.scrollOffset);


    // var frame = new Rectangle();
    // frame.x = elementRect.left - parentRect.left;
    // frame.y = elementRect.top - parentRect.top;
    // frame.width = elementRect.width;
    // frame.height = elementRect.height;
    // // Discount any scrolling in parent.
    // frame.y += parentElement.scrollTop;
    // frame.x += parentElement.scrollLeft;
    return frame;
  }

  static getFramesInParent(elements, parentElement) {
    var parentRect;
    var parentOffset;
    if (parentElement) {
      parentRect = Rectangle.fromDOMRect(parentElement.getBoundingClientRect());
      parentOffset = ElementPosition.scrollOffset(parentElement);
    }
    var rects = [];
    for (var i = 0; i < elements.length; i ++) {
      if (!parentElement) {
        parentElement = elements[i].parentElement;
        parentRect = Rectangle.fromDOMRect(parentElement.getBoundingClientRect());
        parentOffset = ElementPosition.scrollOffset(parentElement);
      }
      var elementRect = Rectangle.fromDOMRect(elements[i].getBoundingClientRect());
      var frame = elementRect.frameWithin(parentRect, scrollOffset);
      rects.push(frame);
    }
    return rects;
  }

  static getFrameOfContent(element) {
    var elementFrame = ElementPosition.getFrame(element);
    var x = 0;
    var y = 0;
    var font = CSSUtils.getStyle(element, "font");
    var width = StringUtils.measureStringWidth(element.innerHTML, font);
    var height = parseInt(CSSUtils.getStyle(element, "font-size"));
    var textAlignment = CSSUtils.getStyle(element, "text-align");
    var frame = new Rectangle(x, y, width, height);
    if (textAlignment === "center") {
      frame.setCentre(elementFrame.getBoundsCentre());
    }
    return frame;
  }

  static containsPoint(element, localPoint) {
    var frame = ElementPosition.getFrame(element);
    var contains = frame.containsPoint(localPoint);
    return contains;
  }

  /**
    Iterates through the list of children from the start
    and returns the first found child that overlaps with the 
    given point in the parent's coordinates.

    @param {HTML Element} 'parent' element in the DOM
    @param {Object} 'localPoint' has 'x' and 'y' properties.
    @param {String} 'includeClass' children with this class will be candidates.
    @param {String} 'excludeClass' children with this class will be excluded.

    Note: All children are considered when optional class names are omitted.
*/
  static childAtPoint(parent, localPoint, includeClass, excludeClass) {
    var children = ElementPosition.getChildren(parent);
    var childIndex;
    var child;
    var foundChild;

    for (childIndex = 0; childIndex < children.length; childIndex++) {
      child = children[childIndex];
      if (CSSUtils.elementHasClass(child, excludeClass)) {
        continue;
      }
      else if (undefined !== includeClass && !CSSUtils.elementHasClass(child, includeClass)) {
        continue;
      }
      if (ElementPosition.containsPoint(child, localPoint)) {
        foundChild = child;
        break;
      }
    }
    return foundChild;
  }

  /** ==============
       Position
    ===============*/

  static originToCentreBesideElement(element, referenceElement, referenceSide) {
    var origin = ElementPosition.originToCentreBesideElementPlus(element, referenceElement, referenceSide, 0);
    return origin;
  }

  static originToCentreBesideElementPlus(element, referenceElement, referenceSide, extraDistance) {
    var referenceRect = referenceElement.getBoundingClientRect();
    var rect = element.getBoundingClientRect();
    var origin = rect.originToCentreBesideRectPlus(referenceRect, referenceSide, extraDistance);
    return origin;
  }

  static centreElementBeside(element, referenceElement, direction) {
    ElementPosition.centreElementBesidePlus(element, referenceElement, direction, 0);
  }

  static centreElementBesidePlus (element, referenceElement, direction, extraDistance) {
    // Includes scrolling, otherwise gets viewport coordinates.
    var origin = ElementPosition.originToCentreBesideElementPlus(element, referenceElement, direction, extraDistance);
    ElementPosition.setOrigin(element, origin);
  }

  static setOrigin (element, origin) {
    element.style.left = origin.x + "px";
    element.style.top = origin.y + "px";
  }

  /**
    Positions (top, right, bottom, left) are set in conjunction
    with the parent elements measurements. 
    Since right and bottom positions are set by their distance from
    the same edges in the parent (as opposed to being relative from the 
    left and top edges).
    "[positiongs] specify offsets from the edge of the element's containing block"
    
    @param {HTML Element} 'element' Element in the DOM
    @param {Rectangle} 'frame' element's rectangle within the parent's bounds.
  */
  static setPositionsToFrame(element, frame) {
    var parent = element.parentElement;
    element.style.top = frame.y + "px";
    element.style.right = parent.clientWidth - frame.getRight() + "px";
    element.style.bottom = parent.clientHeight - frame.getBottom() + "px";
    element.style.left = frame.x + "px";
  }

  static setBottom(element, bottom) {
    element.style.bottom = bottom + "px";
  }

  static setRight(element, right) {
    element.style.right = right + "px";
  }

  static setCentre (element, centre) {
    var frame = ElementPosition.getFrame(element);
    frame.setCentre(centre);
    ElementPosition.setPositionsToFrame(element, frame);
  }

  static logPositions(element) {
    console.log(
      "top: ", element.style.top,
      ", right: ", element.style.right,
      ", bottom: ", element.style.bottom,
      ", left: ", element.style.left);
  }

}/*jshint esversion: 6 */
/**
 * Conveniences for accessing and setting properties values
 * on HTMLElements. 
 * 
 * Accessors convert properties to objects or numbers their value
 * is not already. e.g. 'height' of '12px' is converted to 12.
 * 
 * Supports the additional properties:
 * 'scrollBottom': The visible bottom of the scrolling area.
 *                   scrollTop + clientHeight.
 * 
 */
class ElementProperties {

  constructor() { }

    /**
     * Accessing the element's properties directly
     * (does not access CSSStyleDeclaration). 
     * 
     * @param {Element} 'element'
     * @param {String} 'propertyName'
     * @return {Number} Will be undefined for unsupported element properties.
     */
    static getElementProperty (element, propertyName) {
      var value;
      
      // Custom properties not implemented by
      // any browser.
      switch(propertyName) {
        case 'scrollBottom':
          value = parseFloat(ElementProperties.getElementProperty(element, 'scrollTop') + 
                  parseFloat(ElementProperties.getElementProperty(element, 'clientHeight')));
        break;
    
        // Browser supported properties.
        default:
          if (element instanceof Element) {
            value = element[propertyName];
          }
          // assume Angular object
          else {
            value = parseFloat(element.prop(propertyName));
          }
      }
      
      return value;
    }

    /**
     * Determines whether the given property is a property 
     * within an element's style or on the element itself.
     * 
     * @param {String} 'propertyName' 
     * @return {Boolean} 
     */
    static isCSSStyle (propertyName) {
      
      var isCSSStyle = true;
      switch(propertyName) {
        case 'scrollTop':
        case 'scrollHeight':
        case 'clientHeight':
        case 'clientWidth':
        case 'scrollBottom':
        case 'offsetLeft':
          isCSSStyle = false;
        break;
      }

      return isCSSStyle;
    }

    static applyCSS (htmlElement, className) {
      
      var classList = htmlElement.classList;
      if (classList.contains(className)){
        classList.remove(className);
        Animation.triggerReflow(htmlElement);
      }
      classList.add(className);
    }

    /**
     * The returned property key can be used to access
     * an element's property or the property of a style.
     * 
     * In most cases the given property is returned.
     * Notable exceptions are transform types.
     * 
     * @example 'translateY' -> 'transform'
     * 
     * @param {String} 'propertyName' 
     * @return {String} 
     */
    static getPropertyKey (propertyName) {
      var name = propertyName;
      switch(propertyName) {
        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'translateY':
        case 'translateX':
        case 'rotateX':
        case 'rotateY':
          name = 'transform';
        break;
      }
      return name;
    }
      
    /**
     * Prepares the given value for the format accepted by 
     * the property name. 
     * 
     * @example "height" and 14 returns "14px"
     *          "translateY" of -10 returns "translateY(-10px)"
     *          "opacity" of 0.3 returns 0.3 (no change).
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @param {Number or Object} 'propertyValue'
     * 
     * @returns {String or Number} Returns the type applicable to the 
     *                            format accepted by the property.
     */
    static composeProperty (propertyName, propertyValue) {
      var prefix = ElementProperties.getPropertyPrefix(propertyName);
      var suffix = ElementProperties.getPropertySuffix(propertyName);
      var value;
      
      switch (propertyName) {
        case 'clip':
          if (propertyValue === 0) {
            value = 'auto';
          }
          else {
            value = prefix + ElementProperties.composeValues(propertyName, propertyValue) + suffix;
          }
        break;
        case 'color':
        case 'background-color':
          value = prefix + ElementProperties.composeValues(propertyName, propertyValue) + suffix;
        break;
        case 'color+component':
        case 'background-color+component':
          value = prefix + MathUtils.roundValue(propertyValue) + suffix;
        break;
        default:
        {
          if (prefix.length > 0 || suffix.length > 0){
            value = prefix + propertyValue + suffix;
          }
          else {
            value = propertyValue;
          }
        }
      }
      return value;
    }
    
    /**
     * Supports {@link PropertyUtils#composeProperty} when the value is an object
     * of sub-values. Creates an ordered string of each relevant key-value pair in 'propertyValue'.
     * Example property names: (e.g. color, clip, etc.).
     * 
     * @example:
     * 'clip', {top: 0, right: 10, bottom: 2, left: 3} -> "0px,10px,2px,3px"
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @param {Object} 'propertyValue' Holds numeric values for a styles sub-properties.
     *             
     * @return {String} A value organised appropriately for the given property name.
     *                  Does not return fully formatted value. 
     */
      static composeValues (propertyName, propertyValue) {
      // Order matters in composing the style's value.      
      var orderedKeys = [];
      var defaultValue;

      switch (propertyName) {
        case 'clip':
          orderedKeys = ['top', 'right', 'bottom', 'left'];
          defaultValue = "0";
        break;
        case 'color':
        case 'background-color':
          orderedKeys = ['r', 'g', 'b', 'a'];
          defaultValue = "1";
        break;
      }

      var index;
      var value = "";
      var key;

      for (index = 0; index < orderedKeys.length; index++) {
        key = orderedKeys[index];
        if (propertyValue[key]) {
            value += ElementProperties.composeProperty(propertyName + "+component", propertyValue[key]);
        }
        else {
          value = defaultValue;
        }

        // More values are coming, also converts the value to a string if not already.
        if (index < orderedKeys.length - 1) {
          value += ",";
        } 
      }
      return value;
    }

    // static composeValues (propertyName, propertyValue) {
      
    //   var value = "";
    //   var index;
    //   var keys = Object.keys(propertyValue);

    //   for (index = 0; index < keys.length; index++) {
    //     value += PropertyUtils.composeProperty(propertyName + "+component", propertyValue[keys[index]]);
    //     if (index < keys.length - 1) {
    //       // Converts the value to a string if not already.
    //       value += ",";
    //     } 
    //   }
      
    //   switch(propertyName){
        
    //     case 'color':
    //     case 'background-color':
    //       // Append an alpha value if only given rgb values.
    //       if (keys.length === 3){
    //         value += ",1";
    //       }
    //     break;
    //   }
    //   return value;
    // }
    
    /**
     * Returns any prefix that will need to be 
     * prepended to a property value before it is 
     * applied to a style or element.
     * 
     * @see {@link #composeProperty}
     * @see {@link #getPropertySuffix}
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @return {String} An Empty string when no prefix is needed.
     */
    static getPropertyPrefix (propertyName) {
      var prefix = "";
      switch(propertyName) {
        case 'translateY':
          prefix = "translateY(";
          break;
        case 'translateX':
            prefix = "translateX(";
            break;
        case 'scale':
          prefix = "scale(";
        break;
        case 'clip':
          prefix = "rect(";
          break;
        case 'color':
        case 'background-color':
          prefix = 'rgba(';
          break;
        case 'rotateX':
          prefix = 'rotateX(';
          break;
        case 'rotateY':
          prefix = 'rotateY(';
          break;
      }
      return prefix;
    }
    
    /**
     * Returns any suffix needed when formating a value to
     * apply to an element's style or property. 
     * 
     * @see {@link #composeProperty}
     * @see {@link #getPropertyPrefix}
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @return {String} An Empty string when no suffix is needed.
     */
    static getPropertySuffix (propertyName) {
      var suffix = "px";
      switch(propertyName) {
        case 'scrollTop':
        case 'scrollHeight':
        case 'opacity':
        case 'color+component':
        case 'background-color+component':
        case 'visibility':
        case 'position':
        case 'z-index':
          suffix = "";
          break;
        case 'translateY':
        case 'translateX':
          suffix = "px)";
          break;
        case 'scale':
        case 'clip':
        case 'color':
        case 'background-color':
          suffix = ")";
          break;
        case 'rotateX':
        case 'rotateY':
          suffix = 'deg)';
          break;
      }
      return suffix;
    }
    
    /**
     * Converts a string style to a number or and 
     * object of numeric values.
     * 
     * @param {String} 'propertyName' HTMLElement property. e.g. 'background-color'
     * @param {String} 'propertyValue' As read from an element's CSSStyleDeclaration.
     * @return {Object or Number} Returns a value appropriate to the property
     *                            e.g. properties with sub-values (e.g. 'clip') return an object 
     *                            with numeric values for each box side. 
     *                            Otherwise returns the numeric version of the given string.
     * @example:
     * "rgb(0, 102, 33)" -> {r:0, g:102, b:33, a:0}
     */
    static parseProperty (propertyName, propertyValue) {
      var value;
      // parsing vriables.
      var components;
      switch (propertyName) {
        case 'clip':
          if (propertyValue === 'auto'){
            value = {
              top: 0, right: 0, bottom: 0, left: 0
            };
          }
          else {
            components = ElementProperties.parseComponents(propertyValue);
            value = {
              top: components[0],
              right: components[1],
              bottom: components[2],
              left: components[3]
            };
          }
          break;
        case 'color':
        case 'background-color':
          components = ElementProperties.parseComponents(propertyValue);
          value = {
            r: components[0],
            g: components[1],
            b: components[2],
          };
          
          var alphaComponent = 'a';
          value[alphaComponent] = 1;
          if (components.length > 3){
            value[alphaComponent] = components[3];
          }
          break;
        
        default: 
          value = parseFloat(propertyValue);
      }
      return value;
    }
    
    /**
     * Parses multi-valued element property into an array with each value.
     * 
     * @param {String} 'propertyValue' A bracketed element property value.
     * @return {Array} List of string parsed from left to right from the input.
     * 
     * @example:
     * "rgb(0, 102, 33)" -> ["0", "102", "33"]
     */
    static parseComponents (propertyValue){
      
      var firstBracketIndex = propertyValue.indexOf('(') + 1;
      var substring = propertyValue.slice(firstBracketIndex, propertyValue.length - 1);
      var parts = substring.split(" ");
      var values = [];
      var index = 0;
      for (index; index < parts.length; index++){
        values.push(parseFloat(parts[index]));
      }
      return values;
    }

    /**
     * Sets multiple transforms as one change.
     * @param {HTMLElement} 'element'
     * @param {Object} 'transformSet'
     *                  {
     *                    transformName: numeric value,
     *                    translateY: 12,
     *                    scale: 3
     *                  }
     */
    static composeTransform (transformSet) {
      var value = "";
      var transformName;
      var transformValue;
      var count = Object.keys(transformSet).length;
      var index = 0;

      for (transformName in transformSet) {

        if (transformSet.hasOwnProperty(transformName)) {
          transformValue = ElementProperties.composeProperty(transformName, transformSet[transformName]);
          
          if (index > 0 && index < count) {
            value += " ";
          }
          value += transformValue;
        }
        index++;
      }
      return value;
    }

        /**
     * Returns the CSS or element value for the given property.
     * If no styles are given, one is computed. 
     * 
     * @param {HTMLElement} 'element' Optional when CSS styles and property are given.
     * @param {String or Array} 'propertynames' name of a style or element property.
     *                           Optionally Provide several names (return value is dictionary).
     * @param {CSSStyleDeclaration} 'elementStyles' Optional. The element's computed styles.
     * 
     * @return {Number} when a single property is given,
     *         {Object} when several properties are given    
     *                  key {String} = property name, value: {Number}
     *          Values default to a number appropriate for the property.
     *          (e.g. 'scale' is '1' when not present vs. '0' for margin-left')
     */
    static getValue (element, propertyNames, elementStyles) {
      if (typeof window === 'undefined') {
        return;
      }
    
      // Create an array with the property if not 
      // provided with multiple properties to look up.
      var values = {};
      var properties = [propertyNames];
      if (Array.isArray(propertyNames)) {
        properties = propertyNames;
      }
      
      properties.forEach(function(propertyName) {
        var value = 0;
        if (ElementProperties.isCSSStyle(propertyName)) {
          if (!elementStyles){
            elementStyles = window.getComputedStyle(element, null);
          }
          var propertyKey = ElementProperties.getPropertyKey(propertyName);
          if (propertyKey === 'transform') {
            value = TransformUtils.getValue(elementStyles, propertyName);
          }
          else {
            value = ElementProperties.parseProperty(propertyKey, elementStyles.getPropertyValue(propertyKey));
          }
        } 
        
        // Is element property.
        else {
          value = ElementProperties.getElementProperty(element, propertyName);
        }
        if (undefined === value || (!value && isNaN(value))) {
          value = 0;
        }
        values[propertyName] = value;
      });
      
      var value = values;
      if (Object.keys(values).length === 1) {
        value = values[propertyNames]; // This is a String key.
      }
      return value;
    }
    
    /**
     * Converts the given value to an appropriate 
     * format for the given property before applying.
     * 
     * @param {HTMLElement} 'element'
     * @param {String} 'propertyName' Accepts CSS or element properties.
     * @param {Number} 'value'
     */
    static setValue (element, propertyName, value, customSuffix) {
      var propertyKey = ElementProperties.getPropertyKey(propertyName);
      var preparedValue;  
      if (customSuffix) {
        preparedValue = (value + customSuffix);
      }
      else {
        preparedValue = ElementProperties.composeProperty(propertyName, value);
      }
      if (ElementProperties.isCSSStyle(propertyName)) {
        CSSUtils.setStyle(element, propertyKey, preparedValue);
        // element.style[propertyKey] = preparedValue;
      }
      else {
        element[propertyKey] = preparedValue;
      }
      return preparedValue;
    }
    
    /**
     * Applies the addition value to the elements current value for the 
     * given property. This causes a read before the write.
     * 
     * @param {HTMLElement} 'element'
     * @param {String} 'propertyName' Accepts CSS or element properties.
     * @param {Number} 'extraValue'
     */
    static setValuePlus (element, propertyName, extraValue) {
      if (extraValue === 0) {
        return;
      }
      var value = this.getValue(element, propertyName);
      value += extraValue;
      this.setValue(element, propertyName, value);
    }

    /** ==========================
        Designed Data Structures
      ============================ */

    /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "bottom": -12, "top": 2 }
     */
    static setValues (element, values) {
      var transforms = {};
      var propertyName;
      var value;
      var hasTransforms = false;

      for (propertyName in values) {
        if (values.hasOwnProperty(propertyName)) {
          value = values[propertyName];
          if (TransformUtils.isTransform(propertyName)) {
              transforms[propertyName] = value;
              hasTransforms = true;
          }
          else {
            this.setValue(element, propertyName, value);
          }
        }
      }

      if (hasTransforms) {
          value = ElementProperties.composeTransform(transforms);
          this.setValue(element, TransformUtils.getVendorPrefix(), value);
      }
    }

        /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "scale": 12 }
     */
    static setTransforms (element, transforms) {
      var value = ElementProperties.composeTransform(transforms);
      element.style[TransformUtils.getVendorPrefix()] = value;
    }


}/**
 * 
 */
class DOMHierarchy {

    constructor() { }

    static childrenWithClassName(parent, clazz) {
        var HTMLElements = parent.getElementsByClassName(clazz);
        HTMLElements = Array.from(HTMLElements);
        return HTMLElements;
    }

    static children(element) {
        var HTMLElements = element.children;
        return Array.from(HTMLElements);
    }

    /**
     Differs from .children by returning an array instead
     of an HTMLCollection.

     @param {HTMLElement} 'element'
     @return {Array} List of child HTMLElements
     */
    static getChildren(element) {
        var children = [];
        var child = element.firstElementChild;
        while (null !== child) {
            children.push(child);
            child = child.nextElementSibling;
        }
        return children;
    }

    static removeChildren(element) {
        var children = [];
        while (element.firstChild) {
            children.push(element.firstChild);
            element.removeChild(element.firstChild);
        }
        return children;
    }

    static removeChild(parentElement, childElement) {
        var parent = childElement.parentElement;
        if (!parent || parent !== parentElement) {
            return;
        }
        parentElement.removeChild(childElement);
    }

    static insertChildAtIndex(parentElement, child, index) {
        // No children or child is last.
        if (index === parentElement.children.length) {
            parentElement.appendChild(child);
        }
        else {
            var nextchild = this.getChildAtIndex(parentElement, index);
            parentElement.insertBefore(child, nextchild);
        }
    }

    static insertChildrenAtIndex(parentElement, children, index) {
        if (Array.isArray(children)) {
            var loopIndex;
            var child;
            for (loopIndex = 0; loopIndex < children.length; loopIndex++) {
                child = children[loopIndex];
                this.insertChildAtIndex(parentElement,child,index+loopIndex);
            }
        }
        else {
            this.insertChildAtIndex(parentElement,children,index);
        }
    }

    static insertAfter(parent, referenceChild, children) {
        var index = this.indexOfChild(parent, referenceChild);
        this.insertChildrenAtIndex(parent, children, index + 1);
    }

    static indexOfChild(parent, child) {
        var index = 0;
        var subView = parent.firstElementChild;
        while (null !== subView && child !== subView) {
            subView = subView.nextElementSibling;
            index++;
        }
        if (child !== subView) {
            index = -1;
        }
        return index;
    }

    /**
     Iterates over children from first to last until matching
     the given child.
     When 'childClass' is provided, only the children observed who
     contain the given class will contribute to the overall index.

     @param {HTML Element} 'element' parent element within the DOM
     @param {HTML Element} 'child' nested element under 'element'
     @param {String} 'includeClass' element class name to filter in children.
     @param {String} 'excludeClass' element class name to filter out children.

     @return {Number} overall index of the 'child' amongst the 'element's
     children (or children who match 'includeClass' when given).
     */
    static getIndexOfChild(element, child, includeClass, excludeClass) {
        var subView = element.firstElementChild;
        if (!subView) {
            return -1;
        }
        var index = 0;
        while (child !== subView && null !== subView) {
            if (CSSUtils.elementHasClass(subView, includeClass)) {
                index++;
            }
            else if (undefined === includeClass && undefined === excludeClass) {
                index++;
            }
            else if (!CSSUtils.elementHasClass(subView, excludeClass)) {
                index++;
            }
            subView = subView.nextElementSibling;
        }
        return index;
    }

    static getChildAtIndex(element, index) {
        var child = element.firstElementChild;
        var childIndex = 0;
        while (child && null !== child && childIndex < index) {
            child = child.nextElementSibling;
            childIndex++;
        }
        return child;
    }

    static removeChildAtIndex(parent, childIndex) {
        var child = this.getChildAtIndex(childIndex);
        element.removeChild(child);
        return child;
    }

    /** ==============
        Children
     ===============*/

    /**
     * Traverse up the hierarchy to find the first parent
     * having one the of 'includeClasses' class (optional).  Otherwise
     * the first parent is returned.
     *
     * @param {HTML Element} 'childElement'
     * @param {Array} 'includeClasses' Parent must have one of these classes.
     * @returns {HTML Element} {null}
     */
    static parentElement(childElement, tag, includeClasses) {
        if (!childElement || !childElement.parentNode) {
            return null;
        }
        var parent = childElement.parentNode;
        if (!includeClasses && !tag) {
            return parent;
        }
        var hasClass = function(element, classes) {
            if (!classes || classes.length === 0){
                return true;
            }
            for (var index = 0; index < classes.length; index++) {
                if (CSSUtils.elementHasClass(parent, classes[index])) {
                    return true;
                }
            }
            return false;
        };
        var hasTag = function(element, tag) {
            if (tag) {
                return (parent.tagName === tag);
            } else {
                return true;
            }
        };

        if (includeClasses && !Array.isArray(includeClasses)) {
            includeClasses = [includeClasses];
        }

        while (parent) {
            if (parent === document.body) {
                return null;
            }
            if (hasTag(parent, tag) && hasClass(parent, includeClasses)) {
                return parent;
            }
            parent = parent.parentNode;
        }
        return null;
    }

}
/*jshint esversion: 6 */
/**
 * Holds state about element properties/CSS values
 * that are current vs. dirty (has no stored value in this class).
 * 
 * Interfaces with {@link ElementProperties} so state
 * can be updated by these calls and values lazily updated 
 * upon request. 
 * 
 * Motivation:
 * This class minimises reflow by not calling on the element 
 * for its layout values on every request. 
 * 
 * @see https://gist.github.com/paulirish/5d52fb081b3570c81e3a
 */
class ElementCache {

  constructor() {
    
    /**
     * key: {String} Caller assigned ID.
     * value: {HTMLElement}
     */
    this.elementsById = {}; 
    
    /**
     * key: {String} element ID
     * value: {Object} Dictionary
     *        key: {String} property name
     *        value: {Number or Object}  property value
     */
    this.elementPropertiesById = {};

    /**
     * An optimisation to lookup the associated element ID 
     * from the HTMLElement in an {@link Event}. 
     * Otherwhise, requires looping over the values to reverse
     * lookup the id {@link #elementsById} from the HTMLELement 
     * {@link Event#target} etc.
     */
    this.elementIdsByEvent = {};

    // Enables access to 'this' in event listener.
    this.onEventBind = this._onEvent.bind(this);
  }


    /** =============
      	  Data
    ================= */
  
  refreshValueOnProperty (elementId, propertyName){
    
    var element = this.getElement(elementId);
    var value = ElementProperties.getValue(element, propertyName);
    this._saveValueForId(elementId, propertyName, value);
    return value;
  }

  /**
   * Ineffecient when supplying HTMLElement param.
   * 
   * @param {String or HTMLElement} 'elementId'. @see {@link #getElementId} for performance.
   *          Provide a String for effeciency in accessing a registered element. 
   *          If given an HTMLElement, it may not apply changes to the correct element
   *          if 2 of the same element are registered. If element is not registered nothing 
   *          is applied.
   */
  _saveValueForId(elementId, propertyName, value) {
    var _elementId = this.getElementId(elementId);
    var elementProperties = this.elementPropertiesById[_elementId];
    if (!this.elementPropertiesById[_elementId]) {
      throw "[ElementCache: _saveValueForId] elementId: " + "\'" + _elementId + "\'" + "does not exist";
    }
    elementProperties[propertyName] = value;
  }


   /** =================
       Delete / Reset
    ==================== */

/**
 * Remove all recorded values. 
 * This is recommended when invalidating the whole screen.
 */
  clearAll() {
     var elementId;
     for (elementId in this.elementPropertiesById) {
       this.elementPropertiesById[elementId] = {};
     }
  }

/**
 * Remove an entry for the given property name.
 */
  clearValue(elementId, propertyName) {
      this._removeValueForId(elementId, propertyName);
  }

  /**
   * Removes the property key from the group for the given 
   * elementId. This forces the next time {@link #getValue} with 
   * the same property name to query the DOM. 
   * 
   * @param {String or HTMLElement} 'elementId'. String is best.
   * @param {String or Array} 'propertName'
   */
  _removeValueForId(elementId, propertyNames) {
    var _elementId = this.getElementId(elementId);
    var elementProperties = this.elementPropertiesById[_elementId];

    if (!Array.isArray(propertyNames)){
        propertyNames = [propertyNames];
    }

    propertyNames.forEach(function(propertyName) {
      if (elementProperties.hasOwnProperty(propertyName)){
        delete elementProperties[propertyName];
      } 
    }); 
  }

  /** ===============
      	Events
    =================*/

    /**
     * This to clear the cache for the corresponding
     * property relating whenever the the event fires. 
     * @example Any cache for 'scrollTop' is removed for the 'scroll' event.
     * 
     * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement O(n)
     * @param {String} 'eventName'. Is added to the element's {@link EventTarget#addEventListener}
     */
    monitorEvent (elementId, eventName) {
      this.getElement(elementId).addEventListener(eventName, this.onEventBind);
      var elementIds;
      if (this.elementIdsByEvent.hasOwnProperty(eventName)){
        elementIds = this.elementIdsByEvent[eventName];
      }
      else {
        elementIds = [];
        this.elementIdsByEvent[eventName] = elementIds;
      }
      elementIds.push(this.getElementId(elementId));
    }

    /**
     * Ends the monitor of a previous added event.
     * @see {@link #monitorEvent}
     * 
     * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement O(n)
     * @param {String} 'eventName'. Is removed to the element's {@link EventTarget#removeEventListener}
     */
    unMonitorEvent (elementId, eventName) {
      this.getElement(elementId).removeEventListener(eventName, this.onEventBind);
      var index = this.elementIdsByEvent[eventName].indexOf(this.getElementId(elementId));
      this.elementIdsByEvent[eventName].splice(index, 1);
    }

    /**
     * Handles event firing. 
     * Removes the stored associated HTMLELement property for the event.
     * @see {@link #_getPropertiesForEventType}
     */
    _onEvent (event) {
      var propertiesToUpdate = this._getPropertiesForEventType(event.type);
      var elementIds = this.elementIdsByEvent[event.type];
      var self = this;
      elementIds.forEach(function(elementId){
          self._removeValueForId(elementId, propertiesToUpdate);
      });
    }

    /**
     * 
     * @return {Array} Properties which the DOM changes when 
     *                  the given {@link Event#type} fires.
     */
    _getPropertiesForEventType (eventType) {
      var propertyNames = [];
      switch (eventType) {
        case 'scroll':
          propertyNames.push('scrollTop');
          propertyNames.push('scrollBottom');
          break;
      }
      return propertyNames;
    }

  /** ===============
         Elements
      =============== */
  
  /**
   * After registration, caller can use the set/get methods 
   * by the same given 'elementId'.
   * 
   * @param {HTMLElement} 'element' Is retained.
   * @param {String} 'elementId' Must be unique from any other
   *                  received element-id string.
   * 
   * @see {@link #getElement}
   * @see {@link #getValue}
   * @see {@link #setValue}
   * @see {@link #setValuePlus}
   */
  registerElement (element, elementId){
    if (this.elementsById[elementId]) {
      throw "[ElementCache: registerElement] Received id: " + "\'" + elementId + "\'" + "is not unique";
    }
    this.elementsById[elementId] = element;
    this.elementPropertiesById[elementId] = {};
  }

  /**
   * O(1).
   * @param {String or HTMLElement} 'elementId' @throws Exception if not present
   * @return {HTMLElement} The registered element (or parameter when given an element)
   */
  getElement (elementId) {
    if (typeof elementId !== 'string') {
      return elementId;
    }
    var element = this.elementsById[elementId];
    if (!element) {
      throw "[ElementCache: getElement] elementId: " + "\'" + elementId + "\'" + "does not exist";
    }
    return element;
  }

  /**
   * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement: O(n)
   * @return {String} The registered elementId (or the given parameter).
   */
  getElementId (elementId){
    if (typeof elementId === 'string') {
        return elementId;
    }
    // Find the ID for the element by looking 
    // for the first match in the list of stored elements.
    var _elementId;
    var entryKey;
    for (entryKey in this.elementsById) {
      if (this.elementsById.hasOwnProperty(entryKey) && this.elementsById[entryKey] === element) {
        _elementId = entryKey;
        break;
      }
    }
    return _elementId;
  }
  
  /**
   * First checks the cache for the stored value, else retrieves the 
   * value on the associated HTMLElement and stores it.
   * 
   * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement: O(n).
   * @param {String} 'propertyName' 
   * @return {Number or Object} Most cases returns a Number, unless the property 
   *                            has multiple values (e.g. 'backgroundColor').
   */
  getValue (elementId, propertyName) {
    var _elementId = this.getElementId(elementId);
    if (!this.elementPropertiesById[_elementId]) {
      throw "[ElementCache: getValue] elementId: " + "\'" + _elementId + "\'" + "does not exist";
    }
    
    var value;
    var propertyLookup = this.elementPropertiesById[_elementId];
    if (propertyLookup.hasOwnProperty(propertyName)) {
      value = propertyLookup[propertyName];  
      console.log("HIT (",_elementId, ":", propertyName, ")");
    }
    // Access the browser value.
    else {
      console.log("MISS (", _elementId, ":", propertyName, ")");
      value = this.refreshValueOnProperty(_elementId, propertyName);
    } 
    return value;
  }
  
  /**
   * @warning Ineffecient when supplying HTMLElement param.
   * 
   * @param {String or HTMLElement} 'elementId'.
   *          Provide a String for effeciency in accessing a registered element. 
   *          If given an HTMLElement, it may not apply changes to the correct element
   *          if 2 of the same element are registered. If element is not registered nothing 
   *          is applied.
   * @param {String} 'propertyName' Accepts CSS or element properties.
   * @param {Number} 'value'
   */
  setValue (elementId, propertyName, value) {
    // Assume value is valid.
    // (Otherwise we will store and return an invalid value).
    this._saveValueForId(elementId, propertyName, value);
    var element = this.getElement(elementId);
    ElementUtils.setValue(element, propertyName, value);
  }

    /**
     * Applies the addition value to the elements current value for the 
     * given property. This causes a read before the write.
     * 
     * @param {String or HTMLElement} 'elementId'. Best with String.
     * @param {String} 'propertyName' Accepts CSS or element properties.
     * @param {Number} 'extraValue'
     * 
     * @see {@link #setValue}
     */
    setValuePlus (elementId, propertyName, extraValue) {
      if (extraValue === 0) {
        return;
      }
      var value = this.getValue(elementId, propertyName);
      value += extraValue;
      this.setValue(elementId, propertyName, value);
    }

    /** ===============
      	  Bulk apply
        =============== */

    /**
     * @param {Object or Array} Can be one item or a list of item.
     * Items are expected to have the format:
     *     
     * [{
     *   element: // DOMElement or stringID,
     *   propertyName1: // numeric final value,
     *   propertyName2: // numeric final value,
     * }]
     * 
     * @example:
     * {
     *   element: document.getElementsByClassName('class-name')[0],
     *   "height": 126,
     *   "bottom": -12
     * }
     */
    setValues (values) {
      if (!Array.isArray(values)){
        values = [values];
      }
      var index;
      var elementChanges;
      var elementId;
      for (index = 0; index < values.length; index++) {
          elementChanges = values[index];
          elementId = elementChanges.element;
          delete elementChanges.element;
          this.setElementValues(elementId, elementChanges);
      }
    }

    /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "bottom": -12 }
     */
    setElementValues (elementId, values) {
      var element = this.getElement(elementId);
      var transforms = {};
      var propertyName;
      var hasTransforms = false;

      for (propertyName in values) {
        if (values.hasOwnProperty(propertyName)) {
          if (TransformUtils.isTransform(propertyName)){
            transforms[propertyName] = values[propertyName];
            hasTransforms = true;
          }
          else {
            this.setValue(elementId, propertyName, values[propertyName]);
          }
        }
      }
      if (hasTransforms) {
        this.setTransforms(elementId, transforms);
      }
    }

    /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "scale": 12 }
     */
    setTransforms (elementId, transforms) {
      var transformName;
      // Save all the transform values individually.
      for (transformName in transforms) {
        if (transforms.hasOwnProperty(transformName)) {
          this._saveValueForId(elementId, transformName, transforms[transformName]);
        }
      }
      
      var element = this.getElement(elementId);
      ElementProperties.setTransforms(element, transforms);
    }
}/**
 *
 */
class ElementFactory {

    constructor() { }

    static createElements(HTMLstring, tag) {
        if (!tag) {
            tag = 'div';
        }
        var wrapper = ElementFactory.createElement(tag, null, HTMLstring);
        return Array.from(wrapper.children);
    }

    static createElement(tag, classes, innerHTML) {
        var element = document.createElement(tag);
        if (classes) {
            if (classes.constructor === Array) {
                var index;
                for (index = 0; index < classes.length; index++) {
                    element.classList.add(classes[index]);
                }
            }
            else {
                element.classList.add(classes);
            }
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    }
}

var globals = {
    singletons: {
        windowEventManager: new WindowEventManager(),
        clickmanager: new ClickManager()
    }
};

globals.singletons.windowEventManager.init();
globals.singletons.clickmanager.init();


VBL = {
    globals: globals,
    DirectionRect: DirectionRect,
    MathUtils: DirectionRect,
    Line: Line,
    MathUtils: MathUtils,
    Point: Point,
    RectangleSide: Direction,
    StringUtils: StringUtils,
    TableUtils: TableUtils,
    Rectangle: Rectangle,
    CSSUtils: CSSUtils,
    TransformUtils: TransformUtils,
    ElementPosition: ElementPosition,
    ElementFactory: ElementFactory,
    ElementProperties: ElementProperties,
    CanvasUtils: CanvasUtils,
    DomHierarchy: DOMHierarchy
};



// Call into application code.
// Provided by application. Contains at least the function run()
if (typeof Main === 'undefined') {
    console.log("no Main class provided externally.  Cannot call run() after library initialized.");
} else {
    new Main().run();
}

if (typeof window !== 'undefined') {
    (function(window,document) {

        var prefix = "", _addEventListener, support;

        // detect event model
        if ( window.addEventListener ) {
            _addEventListener = "addEventListener";
        } else {
            _addEventListener = "attachEvent";
            prefix = "on";
        }

        // detect available wheel event
        support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

        window.addWheelListener = function( elem, callback, useCapture ) {
            _addWheelListener( elem, support, callback, useCapture );

            // handle MozMousePixelScroll in older Firefox
            if( support == "DOMMouseScroll" ) {
                _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
            }
        };

        function _addWheelListener( elem, eventName, callback, useCapture ) {
            elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
                !originalEvent && ( originalEvent = window.event );

                // create a normalized event object
                var event = {
                    // keep a ref to the original event object
                    originalEvent: originalEvent,
                    target: originalEvent.target || originalEvent.srcElement,
                    type: "wheel",
                    deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                    deltaX: 0,
                    deltaY: 0,
                    deltaZ: 0,
                    preventDefault: function() {
                        originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                    }
                };

                // calculate deltaY (and deltaX) according to the event
                if ( support == "mousewheel" ) {
                    event.deltaY = - 1/40 * originalEvent.wheelDelta;
                    // Webkit also support wheelDeltaX
                    originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
                } else {
                    event.deltaY = originalEvent.deltaY || originalEvent.detail;
                }

                // it's time to fire the callback
                return callback( event );

            }, useCapture || false );
        }

    })(window, document);
}






// window.addEventListener('load', function() {
//     ExpandingList.buildTree();
//     document.body.addEventListener('click', onBodyClick, true)
// });
//
// function onBodyClick(event) {
//     console.log('clicked: ', event)
//     var element = event.srcElement;
//     if (_registeredclicks[element.id]) {
//         _registeredclicks[element.id](element)
//     }
// }
//
// function _registerClick(id, fn) {
//     _registeredclicks[id] = fn
// }
//
// var _registeredclicks = {};
//
// _registerClick("2", function(element){
//     console.log('element clicked: ', element)
// });
//
//
//
// class T {
//     constructor(){
//         _registerClick("3", this.onclick) //.bind(this))
//     }
//     onclick(element, x) {
//         console.log('element clicked: ', element)
//         console.log('x: ', x)
//         console.log('this: ', this)
//     }
// }
// var t = new T();



