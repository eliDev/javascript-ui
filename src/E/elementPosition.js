/*jshint esversion: 6 */
/**
 * 
 */
class ElementPosition {

  constructor() { }

  /** ==============
     Frame
  ===============*/

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

  static getFramesInParent(elements, parentElement) {
    var rects = [];
    for (var i = 0; i < elements.length; i ++) {
      if (!parentElement) {
        parentElement = elements[i].parentElement;
      }
      var r = ElementPosition.getFrameInParent(elements[i], parentElement);
      rects.push(r);
    }
    return rects;
  }

  static getFrameInParent(element, parentElement) {
    if (!element) {
      return undefined;
    }
    if (!parentElement) {
      parentElement = element.parentElement;
    }
    var parentRect = parentElement.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var frame = new Rectangle();
    frame.x = elementRect.left - parentRect.left;
    frame.y = elementRect.top - parentRect.top;
    frame.width = elementRect.width;
    frame.height = elementRect.height;
    // Discount any scrolling in parent.
    frame.y += parentElement.scrollTop;
    frame.x += parentElement.scrollLeft;
    return frame;
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

}