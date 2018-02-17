
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
Direction.isLeft = function (direction) {
  return direction === Direction.LEFT;
};
Direction.isHorizontal = function (direction) {
  return (direction === Direction.LEFT || direction === Direction.RIGHT || Direction.HORIZONTAL);
};
Direction.isVertical = function (direction) {
  return (direction === Direction.DOWN || direction === Direction.UP || Direction.VERTICAL);
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
