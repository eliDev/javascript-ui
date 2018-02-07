﻿// <reference path="StringUtils.js" />
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
}/**
 * 
 */
class ClickManager {

    constructor() {
        this.registeredIds = {};
        this.registeredClasses = {};
        this.registeredSubclasses = {};
        this.registeredTags = {};
        // window.addEventListener('load', this.onPageLoad.bind(this));
    }

    init() {
        // inside init.
        globals.singletons.windowEventManager.registerForLoadEvent(this.onPageLoad.bind(this));
    }

    onPageLoad() {
        document.body.addEventListener('click', this.onBodyClick.bind(this), true);
    }

    onBodyClick(event) {
        console.log('clicked: ', event);
        var element = event.srcElement;
        this._handleIdClick(element);
        this._handleClassClick(element);
        this._handleTagClick(element);

        // if (this.registeredIds[element.id]) {
        //     this.registeredIds[element.id](element);
        // }
        // else if (this.registeredClasses[element.className]) {
        //     this.registeredClasses[element.className](element);
        // }
        // else {
        //     var parentNode = element.parentNode;
        //     while (parentNode.nodeName != 'BODY') {
        //         if (this.registeredClasses[parentNode.className]) {
        //             this.registeredClasses[parentNode.className](element);
        //             break;
        //         }
        //         parentNode = parentNode.parentNode;
        //     }
        // }
    }

    _handleIdClick(element){
        if (this.registeredIds[element.id]) {
            this.registeredIds[element.id](element);
        }
    }

    _handleClassClick(element) {
        if (this.registeredClasses[element.className]) {
            this.registeredClasses[element.className](element);
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredClasses[parentNode.className]) {
                    this.registeredClasses[parentNode.className](element);
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
    }

    _handleTagClick(element) {
        if (this.registeredTags[element.tagName]) {
            this.registeredTags[element.tagName](element);
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredTags[parentNode.tagName]) {
                    this.registeredTags[parentNode.tagName](parentNode);
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
    }

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

}/**
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


    /**
     The given rect will be empty and the content will
     be visible outside.

     This requires a somewhat complex clipping rule
     since clipping preserves the inside.
     https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
     */
    static clipInsideDOMRect(element, domRect) {
        var r = Rectangle();
        r.initFromClientRect(domRect);
        CSSUtils.clipInsideRectangle(element, r);
    }

    static clipInsideRectangle(element, rectangle) {

        // Requires 11 points (10 without closing):
        // Procedure:
        // start top left, loop over top,
        // loop down left, top of bottom, loop right, return to left bottom.
        var elementRect = element.getBoundingClientRect();
        var extra = elementRect.top;
        var extraWidth = 0; //20;

        var points = [

            { x: 0, y: 0 },

            { x: elementRect.width + extraWidth, y: 0 },

            { x: elementRect.width + extraWidth, y: (rectangle.y - extra) },

            { x: rectangle.x + extraWidth, y: (rectangle.y - extra) },

            { x: rectangle.x + extraWidth, y: (rectangle.getBottom() - extra) },

            { x: rectangle.getRight(), y: (rectangle.getBottom() - extra) },

            { x: rectangle.getRight(), y: (rectangle.y - extra) },

            { x: elementRect.width + extraWidth, y: (rectangle.y - extra) },

            { x: elementRect.width + extraWidth, y: elementRect.height },

            { x: 0, y: elementRect.height }

        ];

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
        console.log("clip path: ", cssValue);
        element.style['-webkit-clip-path'] = cssValue;
    }

    static removeClipPath(element) {
        element.style['-webkit-clip-path'] = '';
    }


}// class GeomtryUtils {
  
GeometryUtils = {};

GeometryUtils.DIRECTION_UNDEFINED = -1;
GeometryUtils.DIRECTION_UP = 0;
GeometryUtils.DIRECTION_TOP = GeometryUtils.DIRECTION_UP;
GeometryUtils.DIRECTION_ABOVE = GeometryUtils.DIRECTION_UP;
GeometryUtils.DIRECTION_RIGHT = 1;
GeometryUtils.DIRECTION_BOTTOM = 2;
GeometryUtils.DIRECTION_DOWN = GeometryUtils.DIRECTION_BOTTOM;
GeometryUtils.DIRECTION_BELOW = GeometryUtils.DIRECTION_BOTTOM;
GeometryUtils.DIRECTION_LEFT = 3;
GeometryUtils.DIRECTION_CENTRE = 4;


GeometryUtils.isDirectionDown = function (direction) {
  return direction === GeometryUtils.DIRECTION_DOWN;
};
GeometryUtils.isDirectionUp = function (direction) {
  return direction === GeometryUtils.DIRECTION_UP;
};

  
/** ============
    Points
 ============== */
 
  function Point(x, y) {
   return {x: x, y: y};
 }
 
 function PointZero() {
   return Point(0,0);
 }

 
 function PointFromPoint(otherPoint) {
   return Point(otherPoint.x, otherPoint.y);
 }
 
 function PointFromPointPlusX(otherPoint, x) {
   var point = PointFromPoint(otherPoint);
   point.x += x;
   return point;
 }
 
  function PointFromPointPlusY(otherPoint, y) {
   var point = PointFromPoint(otherPoint);
   point.y += y;
   return point;
 }
 
  function pointPlusX(point, xPlus) {
   point.x += xPlus;
 }
 
 function distanceFromPointToPoint(startPoint, endPoint) {
   
   var xDiff = endPoint.x - startPoint.x;
   var yDiff = endPoint.y - startPoint.y;
   return Point(xDiff, yDiff);
 }
 
 function pointToString(point){
   return "{".concat(point.x.toString())
   .concat(", ")
   .concat(point.y.toString())
   .concat("}"); 
 }
 
 /** ============
      Lines
 ============== */
 
 /**
  * 2 Points (start, end)
  */
 function Line(startPoint, endPoint) {
   return {start: startPoint, end: endPoint};
 }



/** =================
     Rectangle
  ==================*/

function Rectangle(x, y, width, height) {

  if (undefined === x) {
    x = 0;
  }
  if (undefined === y) {
    y = 0;
  }
  if (undefined === width) {
    width = 0;
  }
  if (undefined === height) {
    height = 0;
  }

  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
}

/** =================
      Initialisers
  ===================*/

/**
  @param {ClientRect} 'clientRect'
*/
Rectangle.prototype.initFromClientRect = function(clientRect){
  this.x = clientRect.left;
  this.y = clientRect.top;
  this.width = clientRect.right - clientRect.left;
  this.height = clientRect.bottom - clientRect.top;
};

Rectangle.prototype.initFromRect = function (rectangle) {
  this.x = rectangle.x;
  this.y = rectangle.y;
  this.width = rectangle.width;
  this.height = rectangle.height;
};

Rectangle.prototype.getOrigin = function () {
  return { x: this.x, y: this.y };
};

Rectangle.prototype.setOriginPoint = function (point) {
  this.x = point.x;
  this.y = point.y;
};

Rectangle.prototype.getTop = function () {
  return this.y;
};

Rectangle.prototype.getLeft = function () {
  return this.x;
};

Rectangle.prototype.getRight = function () {
  return this.x + this.width;
};

Rectangle.prototype.setRight = function (right) {
  this.width = (right - this.x);
};

Rectangle.prototype.getBottom = function () {
  return this.y + this.height;
};

Rectangle.prototype.getBoundsCentre = function () {
  var centre = {};
  centre.x = this.halfWidth();
  centre.y = this.halfHeight();
  return centre;
};

Rectangle.prototype.getCentre = function () {
  var centre = {};
  centre.x = this.x + this.halfWidth();
  centre.y = this.y + this.halfHeight();
  return centre;
};

Rectangle.prototype.setCentre = function (centre) {
  this.x = (centre.x - this.halfWidth());
  this.y = (centre.y - this.halfHeight());
};

/** =============
      Size
  ===============*/

Rectangle.prototype.halfWidth = function () {
  var halfWidth = (this.width / 2);
  return halfWidth;
};

Rectangle.prototype.halfHeight = function () {
  var halfHeight = (this.height / 2);
  return halfHeight;
};

/**
  @param {Number} 'height'
  @param {Boolean} 'stickyCentre'
*/
Rectangle.prototype.setHeight = function(height, stickyCentre) {
  this.setSize(this.width, height, stickyCentre);
};

Rectangle.prototype.setHeightPlus = function (extraHeight, stickyCentre) {
  this.setSizePlus(0, extraHeight, stickyCentre);
};

/**
  @param {Number} 'width'
  @param {Boolean} 'stickyCentre'
*/
Rectangle.prototype.setWidth = function (width, stickyCentre) {
  this.setSize(width, this.height, stickyCentre);
};

Rectangle.prototype.setWidthPlus = function (extraWidth, stickyCentre) {
  this.setSizePlus(extraWidth, 0, stickyCentre);
};

/**
  @param {Number} 'width'
  @param {Number} 'height'
  @param {Boolean} 'stickyCentre' If true, centre remains the same 
                    after applying size.
*/
Rectangle.prototype.setSize = function (width, height, stickyCentre) {
  var centre = this.getCentre();
  this.height = height;
  this.width = width;

  if (stickyCentre) {
    this.setCentre(centre);
  }
};

Rectangle.prototype.setSizePlus = function (extraWidth, extraHeight, stickyCentre) {
  this.setSize(this.width + extraWidth, this.height + extraHeight, stickyCentre);
};

/** =============
      Resize
  ===============*/

/**
    Enlarges the frame on all sides, centre remains the same.
    @param {Number} 'amount' size to increase by.
*/
Rectangle.prototype.stretchBy = function (amount) {

  this.stretchHoriztonally(amount);
  this.stretchVertically(amount);
};

/** 
    Width increase by 2 * amount.
    Centre remains the same.
*/
Rectangle.prototype.stretchHoriztonally = function (amount) {

  this.x -= amount;
  this.width += (2 * amount);
};

Rectangle.prototype.stretchVertically = function (amount) {

  this.y -= amount;
  this.height += (2 * amount);
};

/**
    If the x position is close to the left edge, the rectangle's
    x-position will be set, and right edge will remain the same.

    If 'xPos' is closer to the right side, width will change and 
    the rectangle's x-position will remain unchanged.

    @param {Number} 'xPos' Coordinate on screen.
    @param {Number} 'plusDistance' Any additional padding beyond the xPos.
*/
Rectangle.prototype.stretchToXPos = function (xPos, plusDistance) {

  var rightPos;
  var sideNearXPos = this.horizontalSideClosestToXPos(xPos);
  if (!Boolean(plusDistance)) {
    plusDistance = 0;
  }

  if (sideNearXPos === GeometryUtils.DIRECTION_LEFT) {
    rightPos = this.getRight();
    this.x = (xPos - plusDistance);
    this.setRight(rightPos);
  }
  else if (sideNearXPos === GeometryUtils.DIRECTION_RIGHT) {
    // No change in x pos.
    this.setRight(xPos + plusDistance);
  }
};

/** =============
      Hit Test
  ===============*/

Rectangle.prototype.containsPoint = function (point) {

    var contains = ((point.x >= this.x && point.x <= this.getRight()) &&
        (point.y >= this.y && point.y <= this.getBottom()));
    return contains;
};

Rectangle.prototype.containsXY = function (x, y) {
    var point = new Point(x,y);
    return this.containsPoint(point);
};

Rectangle.prototype.containsX = function (x) {
    var point = new Point(x, this.y);
    return this.containsPoint(point);
};

/**
    Zero if point is within the rectangle or outside vertically.
    Else provides an x value.
    Negative value means the point is outside to the left.

    @param {point} 'point' has x: y: properties.
*/
Rectangle.prototype.xDistanceOutside = function (point) {

  var distance = 0;
  if (this.containsPoint(point)) {
    return distance;
  }

  if (point.x > this.getRight()) {
    distance = point.x - this.getRight();
  }
  else if (point.x < this.x) {
    distance = this.x - point.x;
  }
  return distance;
};


/**
  The given is either closer to the left or right side 
  of the rectangle (unless centred, in which case DIRECTION_CENTRE
  is returned).

  @see {@link GeometryUtils.DIRECTION_RIGHT}
  @see {@link GeometryUtils.DIRECTION_LEFT}

  @param {Number} 'xPos' horizontal coordinate.
  @return {Number} A GeometryUtils 'direction'
*/
Rectangle.prototype.horizontalSideClosestToXPos = function (xPos) {

  var side = GeometryUtils.DIRECTION_CENTRE;

  if (xPos > this.getCentre().x) {
    side = GeometryUtils.DIRECTION_RIGHT;
  }
  else if (xPos < this.getCentre().x) {
    side = GeometryUtils.DIRECTION_LEFT;
  }
  return side;
};


/** ==============
      GEOMETRY
  ===============*/


GeometryUtils.subtractPoints = function (point1, point2) {
  var point;
  point.x = point1.x - point2.x;
  point.y = point1.y - point2.y;
  return point;
};

GeometryUtils.sideOpposite = function(side) {

  var oppositeSide = this.DIRECTION_UNDEFINED;

  switch (side) {

    case GeometryUtils.DIRECTION_TOP:
      oppositeSide = this.DIRECTION_BOTTOM;
      break;

    case GeometryUtils.DIRECTION_RIGHT:
      oppositeSide = this.DIRECTION_LEFT;
      break;

    case GeometryUtils.DIRECTION_BOTTOM:
      oppositeSide = this.DIRECTION_TOP;
      break;

    case GeometryUtils.DIRECTION_LEFT:
      oppositeSide = this.DIRECTION_RIGHT;
      break;
  }

  return oppositeSide;
}

/**
    Returns the point representings the 
    centre along the top of the rectangle.
*/
GeometryUtils.centreOfSide = function(domRect, side) {
  var point = {};
  switch (side) {

    case GeometryUtils.DIRECTION_TOP:
      point.x = domRect.left + this.halfWidth(domRect);
      point.y = domRect.top;
      break;

    case GeometryUtils.DIRECTION_RIGHT:
      point.x = domRect.left + domRect.width;
      point.y = domRect.top + this.halfHeight(domRect);
      break;

    case GeometryUtils.DIRECTION_BOTTOM:
      point.x = domRect.left + this.halfWidth(domRect);
      point.y = domRect.top + domRect.height;
      break;

    case GeometryUtils.DIRECTION_LEFT:
      point.x = domRect.left;
      point.y = domRect.top + this.halfHeight(domRect);
      break;
  } 
  return point;
};

/** ==========================
      Edges Manipulations
  ========================*/

GeometryUtils.originToCentreSide = function (domRect, side, centreOfSide) {
  var origin = this.originToCentreSidePlus(domRect, side, centreOfSide, 0);
  return origin;
};

/**
  Returns what the origin should be inorder
  to have the 'domRect' 'side' centred at the given
  'centreOfSize'.

  e.g. [] RIGHT by x
        looks like []x

*/
GeometryUtils.originToCentreSidePlus = function (domRect, side, centreOfSide, extraDistance) {

  var origin = {};
  switch (side) {

    case GeometryUtils.DIRECTION_TOP:
      origin.x = centreOfSide.x - this.halfWidth(domRect);
      origin.y = centreOfSide.y - extraDistance;
      break;

    case GeometryUtils.DIRECTION_RIGHT:
      origin.x = centreOfSide.x - domRect.width - extraDistance;
      origin.y = centreOfSide.y - this.halfHeight(domRect);
      break;

    case GeometryUtils.DIRECTION_BOTTOM:
      origin.x = centreOfSide.x - this.halfWidth(domRect);
      origin.y = centreOfSide.y + domRect.height + extraDistance;
      break;

    case GeometryUtils.DIRECTION_LEFT:
      origin.x = centreOfSide.x - extraDistance;
      origin.y = centreOfSide.y - this.halfHeight(domRect);
      break;
  }
  return origin;
};



/**
    Gives the origin in order to place 'domRect' beside the 
    given reference rectangle so that their centres align.
*/
GeometryUtils.originToCentreBesideRect = function (domRect, referenceDomRect, referenceSide) {

  var origin = this.originToCentreBesideRectPlus(domRect, referenceDomRect, referenceSide, 0);
  return origin;
};

GeometryUtils.originToCentreBesideRectPlus = function (domRect, referenceDomRect, referenceSide, extraDistance) {


  if (undefined === extraDistance) {
    extraDistance = 0;
  }

  var centreReferenceSide = this.centreOfSide(referenceDomRect, referenceSide);
  var oppositeSide = this.sideOpposite(referenceSide);
  var origin = this.originToCentreSidePlus(domRect, oppositeSide, centreReferenceSide, -extraDistance);
  return origin;
};
 
  
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

}/**
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
/**
 * 
 */
class WindowEventManager {

  constructor() {
    this.onLoadCallbacks = [];
    this.didLoad = false;
  }

  init() {
    window.addEventListener('load', this.onPageLoad.bind(this));
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

}﻿/**
 * 
 */
class Position {

  constructor() { }

  /** ==============
     Frame
  ===============*/

  /**
   * Returns the element's coordinates in its 
   * parent element.
  
      Note: if the given element has no parent, then
      frame will equal the boundingClientRect.
   *
   * @param {HTML Element} 'element' element in DOM
   * @return {link Rectangle} 
  */
 static getFrame (element) {

    if (!Boolean(element)) {
      return undefined;
    }

    var parent = element.parentElement;
    var parentRect = parent.getBoundingClientRect();

    var elementRect = element.getBoundingClientRect();
    var frame = new Rectangle();

    frame.x = elementRect.left - parentRect.left;
    frame.y = elementRect.top - parentRect.top;
    frame.width = elementRect.width;
    frame.height = elementRect.height;

    // Discount any scrolling in parent.
    frame.y += parent.scrollTop;
    frame.x += parent.scrollLeft;

    return frame;
  }

  static getFrameOfContent(element) {

    var elementFrame = this.getFrame(element);
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

    var frame = this.getFrame(element);
    var contains = frame.containsPoint(localPoint);
    return contains;
  };

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

    var children = this.getChildren(parent);
    var childIndex;
    var child;
    var foundChild;

    for (childIndex = 0; childIndex < children.length; childIndex++) {

      child = children[childIndex];

      if (CSSUtils.elementHasClass(child, excludeClass)) {
        continue;
      }
      else if (undefined != includeClass && !CSSUtils.elementHasClass(child, includeClass)) {
        continue;
      }

      if (this.containsPoint(child, localPoint)) {
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

    var origin = this.originToCentreBesideElementPlus(element, referenceElement, referenceSide, 0);
    return origin;
  }

  static originToCentreBesideElementPlus(element, referenceElement, referenceSide, extraDistance) {

    var referenceRect = referenceElement.getBoundingClientRect();
    var rect = element.getBoundingClientRect();
    var origin = GeometryUtils.originToCentreBesideRectPlus(rect, referenceRect, referenceSide, extraDistance);
    return origin;
  }

  static centreElementBeside(element, referenceElement, direction) {
    this.centreElementBesidePlus(element, referenceElement, direction, 0);
  }

  static centreElementBesidePlus (element, referenceElement, direction, extraDistance) {

    // Includes scrolling, otherwise gets viewport coordinates.
    var origin = this.originToCentreBesideElementPlus(element, referenceElement, direction, extraDistance);
    this.setOrigin(element, origin);
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

    var parent = this.getParentElement(element);

    element.style.top = frame.y + "px";
    element.style.right = parent.clientWidth - frame.getRight() + "px";
    element.style.bottom = parent.clientHeight - frame.getBottom() + "px";
    element.style.left = frame.x + "px";
  };

  static setBottom(element, bottom) {
    element.style.bottom = bottom + "px";
  };

  static setRight(element, right) {
    element.style.right = right + "px";
  };

  static setCentre (element, centre) {

    var frame = this.getFrame(element);
    frame.setCentre(centre);
    this.setPositionsToFrame(element, frame);
  };

  static logPositions(element) {

    console.log(
      "top: ", element.style.top,
      ", right: ", element.style.right,
      ", bottom: ", element.style.bottom,
      ", left: ", element.style.left);
  };

}/**
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
class PropertyUtils {

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
          value = parseFloat(PropertyUtils.getElementProperty(element, 'scrollTop') + 
                  parseFloat(PropertyUtils.getElementProperty(element, 'clientHeight')));
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
        case 'translateY':
        case 'translateX':
        case 'rotateX':
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
      
      var prefix = PropertyUtils.getPropertyPrefix(propertyName);
      var suffix = PropertyUtils.getPropertySuffix(propertyName);
      var value;
      
      switch (propertyName) {
        case 'clip':
          if (propertyValue === 0) {
            value = 'auto';
          }
          else {
            value = prefix + PropertyUtils.composeValues(propertyName, propertyValue) + suffix;
          }
        break;
        
        case 'color':
        case 'background-color':
          value = prefix + PropertyUtils.composeValues(propertyName, propertyValue) + suffix;
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
            value += PropertyUtils.composeProperty(propertyName + "+component", propertyValue[key]);
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
            components = PropertyUtils.parseComponents(propertyValue);
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
          components = PropertyUtils.parseComponents(propertyValue);
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
          transformValue = PropertyUtils.composeProperty(transformName, transformSet[transformName]);
          
          if (index > 0 && index < count) {
            value += " ";
          }
          value += transformValue;
        }
        index++;
      }
      return value;
    }

}/**
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
          isTransform = true;
          break;

      }
      return isTransform;
    }


}/**
 * Provides static helper functions for common Element manipulations.
 * Support is not exhaustive. Certain methods need updating to handle properties
 * not yet encountered.
 * 
 * @see {@link PropertyUtils}
 */
class ElementUtils {
    
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
    
      // Create an array with the property if not 
      // provided with multiple properties to look up.
      var values = {};
      var properties = [propertyNames];
      if (Array.isArray(propertyNames)) {
        properties = propertyNames;
      }
      
      properties.forEach(function(propertyName) {
  
        var value = 0;
        if (PropertyUtils.isCSSStyle(propertyName)) {
        
          if (!elementStyles){
            elementStyles = window.getComputedStyle(element, null);
          }

          var propertyKey = PropertyUtils.getPropertyKey(propertyName);
          if (propertyKey === 'transform') {
            value = TransformUtils.getValue(elementStyles, propertyName);
          }
          else {
            value = PropertyUtils.parseProperty(propertyKey, elementStyles.getPropertyValue(propertyKey));
          }
        } 
        
        // Is element property.
        else {
          value = PropertyUtils.getElementProperty(element, propertyName);
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
      var propertyKey = PropertyUtils.getPropertyKey(propertyName);
      var preparedValue;  
      if (customSuffix) {
        preparedValue = (value + customSuffix);
      }
      else {
        preparedValue = PropertyUtils.composeProperty(propertyName, value);
      }

      if (PropertyUtils.isCSSStyle(propertyName)) {
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
          value = PropertyUtils.composeTransform(transforms);
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

      var value = PropertyUtils.composeTransform(transforms);
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

        var parent = ElementUtils.parentElement(childElement);

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
                this.insertChildAtIndex(parentElement,child,index+loopIndex)
            }
        }
        else {
            this.insertChildAtIndex(parentElement,children,index)
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
        }

        var hasTag = function(element, tag) {
            if (tag) {
                return (parent.tagName === tag);
            } else {
                return true;
            }
        }

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
/**
 * Holds state about element properties/CSS values
 * that are current vs. dirty (has no stored value in this class).
 * 
 * Interfaces with {@link ElementUtils} so state
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
    var value = ElementUtils.getValue(element, propertyName);
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

    if (typeof elementId !== 'string'){
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
      ElementUtils.setTransforms(element, transforms);
    }
}var globals = {
    singletons: {
        main: new Main(), // Provided by application. Contains at least the function run()
        windowEventManager: new WindowEventManager(),
        clickmanager: new ClickManager()
    }
};

globals.singletons.windowEventManager.init();
globals.singletons.clickmanager.init();
// Call into application code.
globals.singletons.main.run();

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

})(window,document);



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



