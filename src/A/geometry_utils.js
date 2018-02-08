// class GeomtryUtils {
  
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
GeometryUtils.isHorizontal = function (direction) {
  return (direction === GeometryUtils.DIRECTION_LEFT || direction === GeometryUtils.DIRECTION_RIGHT);
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
};

GeometryUtils.elementPostitionForDirection = function (direction) {
  var property = '';
  switch (direction) {
    case GeometryUtils.DIRECTION_TOP:
      property = 'top';
      break;
    case GeometryUtils.DIRECTION_RIGHT:
      property = 'right';
      break;
    case GeometryUtils.DIRECTION_BOTTOM:
      property = 'bottom';
      break;
    case GeometryUtils.DIRECTION_LEFT:
      property = 'left';
      break;
    default:
      console.log("GeometryUtils.elementPostitionForDirection unhandled case: ", direction);
  }
  return property;
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

 GeometryUtils.subtractPoints = function (point1, point2) {
  var point;
  point.x = point1.x - point2.x;
  point.y = point1.y - point2.y;
  return point;
};

GeometryUtils.addPoints = function (point1, point2) {
  var point;
  point.x = point1.x + point2.x;
  point.y = point1.y + point2.y;
  return point;
};

 
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

RectangleUtils = {};

function Rectangle(x, y, width, height) {
  if (undefined === x) { x = 0;}
  if (undefined === y) {  y = 0; }
  if (undefined === width) { width = 0; }
  if (undefined === height) { height = 0; }
  this.x = x;
  this.y = y;
  this.height = height;
  this.width = width;
}

function RectZero(){
  return new Rectangle();
}

function RectFromDOMRect(DOMRect) {
  var r = RectangleUtils.initFromDOMRect(DOMRect);
  return r;
}

/** =================
      Initialisers
  ===================*/

/**
  @param {ClientRect} 'clientRect'
*/
RectangleUtils.initFromDOMRect = function(domRect) {
  var rectangle = new Rectangle();
  rectangle.x = domRect.left;
  rectangle.y = domRect.top;
  rectangle.width = domRect.right - domRect.left;
  rectangle.height = domRect.bottom - domRect.top;
  return rectangle;
};

RectangleUtils.boundsFromDOMRect = function(domRect) {
  var rectangle = RectangleUtils.initFromDOMRect(domRect);
  rectangle.setOriginPoint(PointZero());
  return rectangle;
};

RectangleUtils.initFromRect = function (rectangle) {
  var rect = new Rectangle();
  rect.x = rectangle.x;
  rect.y = rectangle.y;
  rect.width = rectangle.width;
  rect.height = rectangle.height;
  return rect;
};

RectangleUtils.copy = function (rectangle) {
  this.x = rectangle.x;
  this.y = rectangle.y;
  this.width = rectangle.width;
  this.height = rectangle.height;
};

Rectangle.prototype.DOMRect = function() {
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
};

/** ==============
    EQUALITY
  ===============*/

  Rectangle.prototype.equals = function (otherRect) {
    return ((otherRect.x === this.x && otherRect.y === this.y) &&
            (otherRect.width === this.width && otherRect.height === this.height));
  };

/** ==============
      PROPERTIES
  ===============*/

Rectangle.prototype.getOrigin = function () {
  return { x: this.x, y: this.y };
};

Rectangle.prototype.setOriginPoint = function (point) {
  this.x = point.x;
  this.y = point.y;
};

Rectangle.prototype.getMaxXPoint = function () {
  return new Point(this.getRight(), this.y);
};

Rectangle.prototype.getMaxYPoint = function () {
  return new Point(this.x, this.getBottom());
};

Rectangle.prototype.getMaxPoint = function () {
  return new Point(this.getRight(), this.getBottom());
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

Rectangle.prototype.setBottom = function (y) {
  this.height = (y - this.y);
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

Rectangle.prototype.boundsForRect = function (otherRect) {
    var bounds = new Rectangle();
    bounds.copy(otherRect);
    bounds.x -= this.x;
    bounds.y -= this.y;
    return bounds;
};

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

Rectangle.prototype.moveBy = function(point) {
  this.x = this.x + point.x;
  this.y = this.y + point.y;
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
    var contains = ((point.x >= this.x && point.x < this.getRight()) &&
        (point.y >= this.y && point.y < this.getBottom()));
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

Rectangle.prototype.overlaps = function (otherRect, outRect) {
    var overlappingRect = this.overlappingRect(otherRect);
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
};

Rectangle.prototype.overlappingRect = function (otherRect) {
  var overlapRect = new Rectangle();
  overlapRect.y = Math.max(otherRect.y, this.y);
  overlapRect.x = Math.max(otherRect.x, this.x);
  overlapRect.setBottom(Math.min(otherRect.getBottom(), this.getBottom()));
  overlapRect.setRight(Math.min(otherRect.getRight(), this.getRight()));
  if (overlapRect.width <= 0 || overlapRect.height <= 0){
    overlapRect = RectZero();
  }
  return overlapRect;
};


/**
    Zero if point is within the rectangle or outside vertically.
    Negative x: the point is outside to the left.

    @param {point} 'point' has x: y: properties.
    @return {Point} (x === 0): Given x is within the rectangle
                    (x < 0): Given x is left of the rectangle
                    (x > 0): Given x is right of the rectangle
                    (y === 0): Given y is within the rectangle
                    (y < 0): Given y is above the rectangle
                    (y > 0): Given y is below the rectangle
*/
Rectangle.prototype.distanceOutside = function (point) {
  if (this.containsPoint(point)) {
    return PointZero();
  }
  var x, y;
  if (point.x > this.getRight()) {
    x = point.x - this.getRight();
  }
  else if (point.x < this.x) {
    x = point.x - this.x;
  }
  if (point.y > this.getBottom()) {
    y = point.y - this.getBottom();
  }
  else if (point.y < this.y) {
    y = point.y - this.y;
  }
  return new Point(x, y);
};

Rectangle.prototype.isBeyondSide = function(point, thisRectSide) {
  var isBeyond = false;
  var outsidePoint = this.distanceOutside(point);
  switch (thisRectSide) {
    case GeometryUtils.DIRECTION_TOP:
      isBeyond = outsidePoint.y < 0;
      break;
    case GeometryUtils.DIRECTION_RIGHT:
      isBeyond = outsidePoint.x > 0;
      break;
    case GeometryUtils.DIRECTION_BOTTOM:
      isBeyond = outsidePoint.y > 0;
      break;
    case GeometryUtils.DIRECTION_LEFT:
      isBeyond = outsidePoint.x < 0;
      break;
      default:
      console.log("Rectangle.prototype.isBeyondSide unhandled case: ", thisRectSide);
  }
  return isBeyond;
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

GeometryUtils.centreOfSide = function(DOMRect, side) {
  var rect = GeometryUtils.initFromDOMRect(DOMRect);
  return rect.centreOfSide(side);
};

/**
    Returns the point representings the 
    centre along the top of the rectangle.
*/
Rectangle.prototype.centreOfSide = function(side) {
  var point;
  switch (side) {
    case GeometryUtils.DIRECTION_TOP:
      point = new Point(this.x + this.halfWidth(), this.y);
      break;
    case GeometryUtils.DIRECTION_RIGHT:
      point = new Point(this.x + this.width, this.y + this.halfHeight());
      break;
    case GeometryUtils.DIRECTION_BOTTOM:
      point = new Point(this.x + this.halfWidth(), this.y + this.height);
      break;
    case GeometryUtils.DIRECTION_LEFT:
      point = new Point(this.x, this.y + this.halfHeight());
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
  var centreReferenceSide = GeometryUtils.centreOfSide(referenceDomRect, referenceSide);
  var oppositeSide = GeometryUtils.sideOpposite(referenceSide);
  var origin = this.originToCentreSidePlus(domRect, oppositeSide, centreReferenceSide, -extraDistance);
  return origin;
};
 
  
