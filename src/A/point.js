/*jshint esversion: 6 */
/**
 * 
 */
class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }

  static zero(){
    return new Point(0,0);
  }

  static copy(point) {
    return new Point(point.x, point.y);
  }

  equals(otherPoint) {
    return this.x === otherPoint.x && this.y === otherPoint.y;
  }

  static copyPlusX(point, x) {
    var p = Point.copy(point);
    p.plusX(x);
    return p;
  }

  static copyPlusY(point, y) {
    var p = Point.copy(point);
    p.y += y;
    return p;
  }

  plusX(xPlus) {
    this.x += xPlus;
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

 static subtract(point1, point2) {
  var point;
  point.x = point1.x - point2.x;
  point.y = point1.y - point2.y;
  return point;
}

static add(point1, point2) {
  var point;
  point.x = point1.x + point2.x;
  point.y = point1.y + point2.y;
  return point;
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
}