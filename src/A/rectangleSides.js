
RectangleSide = {};

RectangleSide.UNDEFINED = -1;
RectangleSide.UP = 0;
RectangleSide.TOP = RectangleSide.UP;
RectangleSide.ABOVE = RectangleSide.UP;
RectangleSide.RIGHT = 1;
RectangleSide.BOTTOM = 2;
RectangleSide.DOWN = RectangleSide.BOTTOM;
RectangleSide.BELOW = RectangleSide.BOTTOM;
RectangleSide.LEFT = 3;
RectangleSide.CENTRE = 4;


RectangleSide.isDown = function (direction) {
  return direction === RectangleSide.DOWN;
};
RectangleSide.isUp = function (direction) {
  return direction === RectangleSide.UP;
};
RectangleSide.isLeft = function (direction) {
  return direction === RectangleSide.LEFT;
};
RectangleSide.isHorizontal = function (direction) {
  return (direction === RectangleSide.LEFT || direction === RectangleSide.RIGHT);
};



RectangleSide.sideOpposite = function(side) {
  var oppositeSide = this.UNDEFINED;
  switch (side) {
    case RectangleSide.TOP:
      oppositeSide = this.BOTTOM;
      break;
    case RectangleSide.RIGHT:
      oppositeSide = this.LEFT;
      break;
    case RectangleSide.BOTTOM:
      oppositeSide = this.TOP;
      break;
    case RectangleSide.LEFT:
      oppositeSide = this.RIGHT;
      break;
  }
  return oppositeSide;
};

RectangleSide.elementPostitionForDirection = function (direction) {
  var property = '';
  switch (direction) {
    case RectangleSide.TOP:
      property = 'top';
      break;
    case RectangleSide.RIGHT:
      property = 'right';
      break;
    case RectangleSide.BOTTOM:
      property = 'bottom';
      break;
    case RectangleSide.LEFT:
      property = 'left';
      break;
    default:
      console.log("RectangleSides.elementPostitionForDirection unhandled case: ", direction);
  }
  return property;
};
