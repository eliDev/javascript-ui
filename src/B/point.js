/*jshint esversion: 6 */
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

  addX(x) {
    this.x += x;
  }

  static addXCopy(point, x) {
    var p = Point.copy(point);
    p.addX(x);
    return p;
  }

  static addYCopy(point, y) {
    var p = Point.copy(point);
    p.y += y;
    return p;
  }

  addCopy(point) {
    var p = Point.add(this, point);
    return p;
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

  subtractXCopy(x){
    var p = this.copy();
    p.subtractX(x);
    return p;
  }

  subtractX(x) {
    this.x -= x;
  }

  subtractYCopy(y){
    var p = this.copy();
    p.subtractY(y);
    return p;
  }

  subtractY(y) {
    this.y -= y;
  }

  subtractCopy(point) {
    return Point.subtract(this, point);
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
}