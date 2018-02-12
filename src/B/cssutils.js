/**
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

     /** ==============
            Clipping
        ===============*/

    /*
        Rect to be clipped should be given as bounds to the 
        element's clientRect
       https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
    */

    /**
     * The given rect will be empty and the content will
     * be visible outside.
     * 
     * This requires a somewhat complex clipping rule
     * since clipping preserves the inside.
     */
    static clipPoints(elementBounds, clipRectBounds) {
        // Carve out the region to keep visible.
        // Points are within the bounds of the element frame.
        var points = [

            // Top left.
            { x: 0, y: 0 },
            // Right movement. Will loop back if top if clipped out.
            { x: elementBounds.width, y: 0 },

            { x: elementBounds.width, y: clipRectBounds.y },

            { x: clipRectBounds.x, y: clipRectBounds.y },

            { x: clipRectBounds.x, y: clipRectBounds.getBottom() },

            { x: clipRectBounds.getRight(), y: clipRectBounds.getBottom() },

            { x: clipRectBounds.getRight(), y: clipRectBounds.y },

            { x: elementBounds.width, y: clipRectBounds.y},

            { x: elementBounds.width, y: elementBounds.height },

            { x: 0, y: elementBounds.height }
        ];
        return points;
    }

    static clipLeftInset(element, leftInset) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = RectangleUtils.boundsFromDOMRect(elementRect);
        var clipBounds = RectangleUtils.initFromRect(elementBounds);
        clipBounds.setWidth(leftInset);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipBetweenHorizontal(element, minX, maxX) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = RectangleUtils.boundsFromDOMRect(elementRect);
        var clipBounds = new Rectangle(minX, 0, maxX - minX, elementBounds.height);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipInsideBounds(element, clipBounds) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = RectangleUtils.boundsFromDOMRect(elementRect);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipInsideRect(element, clipFrame) {
        var elementRect = element.getBoundingClientRect();
        var elementBounds = RectangleUtils.boundsFromDOMRect(elementRect);
        var clipBounds = RectFromDOMRect(elementRect).boundsForFrame(clipFrame);
        CSSUtils.clipOutRectangle(element, elementBounds, clipBounds);
    }

    static clipOutRectangle(element, elementBounds, clipBounds) {
        var points = CSSUtils.clipPoints(elementBounds, clipBounds);
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
        // console.log("clip path: ", cssValue);
        element.style['-webkit-clip-path'] = cssValue;
    }

    static removeClipPath(element) {
        element.style['-webkit-clip-path'] = '';
    }

}