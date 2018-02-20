/*jshint esversion: 6 */
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

  /** =========
        Points
    ============*/

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
        topFrame: undefined,
        rightFrame: undefined,
        bottomFrame: undefined,
        leftFrame: undefined,
        insideFrame: undefined,
        boundInOriginal: function(originalFrame, positionFrame) {
            return originalFrame.boundsForFrame(positionFrame);
        }
    };
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

}