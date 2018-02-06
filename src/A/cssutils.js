/**
 * 
 */
class CSSUtils
{

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


    /**
     The given rect will be empty and the content will
     be visible outside.

     This requires a somewhat complex clipping rule
     since clipping preserves the inside.
     https://developer.mozilla.org/en-US/docs/Web/API/DOMRect
     */
    static clipInsideDOMRect(element, domRect) {
        var r = Rectangle();
        r.initFromClientRect(domRect);
        CSSUtils.clipInsideRectangle(element, r);
    }

    static clipInsideRectangle(element, rectangle) {

        // Requires 11 points (10 without closing):
        // Procedure:
        // start top left, loop over top,
        // loop down left, top of bottom, loop right, return to left bottom.
        var elementRect = element.getBoundingClientRect();
        var extra = elementRect.top;
        var extraWidth = 0; //20;

        var points = [

            { x: 0, y: 0 },

            { x: elementRect.width + extraWidth, y: 0 },

            { x: elementRect.width + extraWidth, y: (rectangle.y - extra) },

            { x: rectangle.x + extraWidth, y: (rectangle.y - extra) },

            { x: rectangle.x + extraWidth, y: (rectangle.getBottom() - extra) },

            { x: rectangle.getRight(), y: (rectangle.getBottom() - extra) },

            { x: rectangle.getRight(), y: (rectangle.y - extra) },

            { x: elementRect.width + extraWidth, y: (rectangle.y - extra) },

            { x: elementRect.width + extraWidth, y: elementRect.height },

            { x: 0, y: elementRect.height }

        ];

        var index;
        var cssValue = 'polygon(';

        for (index = 0; index < points.length; index++) {
            cssValue += points[index].x + 'px ' + points[index].y + 'px';
            if (index < points.length - 1) {
                cssValue += ', ';
            }
        }

        cssValue += ')';
        console.log("clip path: ", cssValue);
        element.style['-webkit-clip-path'] = cssValue;
    }

    static removeClipPath(element) {
        element.style['-webkit-clip-path'] = '';
    }


}