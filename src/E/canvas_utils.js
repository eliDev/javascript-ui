/*exported CanvasUtils */
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

  static drawRect(rect) {
    var context = CanvasUtils.getContext();
    context.beginPath();
    context.rect(rect.x, rect.y, rect.width, rect.height);
    context.stroke();
  }

  static fillRect(canvas, rect, colourString) {
    
    var context = CanvasUtils.getContext(canvas);
    context.fillStyle = colourString;
    context.fillRect(rect.x, rect.y, rect.width, rect.height);
  }

  static drawLine(startPoint, endPoint) {
    var context = CanvasUtils.getContext();
    context.beginPath();
    context.moveTo(startPoint.x, startPoint.y);
    context.lineTo(endPoint.x, endPoint.y);
    context.stroke();
  }

  static clearCanvas(canvas) {
    clearCanvasRect(canvas, RectBoundsFromElement(canvas));
  }

  static clearCanvasRect(canvas, rect) {
    var context = CanvasUtils.getContext(canvas);
    context.clearRect(rect.x, rect.y, rect.width, rect.height);
  }
  
}