/**
 * Implement common shape, position, and layout properties.
 * This extracts the language/engine specific syntax and passes
 * calculation on the a common library. 
 */
class ElementGeometry {

  static frame(element){
    if (!element) {
      return undefined;
    }
    var parentElement = element.parentElement;
    var parentPosition = ElementPosition.position(parentElement);
    var elementRect = Rectangle.fromDOMRect(element.getBoundingClientRect());
    var frame = elementRect.frameWithin(parentPosition.viewportFrame, parentPosition.scrollOffset);
    return frame;
  }

  static bounds(element) {
    var frame = ElementGeometry.frame(element);
    if (!frame) {
      return undefined;
    }
    frame.setOrigin(Point.zero());
    return frame;
  }
}
