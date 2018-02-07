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

    static clipPoints(elementRect, clipRect){
        // Requires 11 points (10 without closing):
        // Procedure:
        // start top left, loop over top,
        // loop down left, top of bottom, loop right, return to left bottom.
        var extra = elementRect.top;
        var extraWidth = 0; //20;

        var points = [

            { x: 0, y: 0 },

            { x: elementRect.width + extraWidth, y: 0 },

            { x: elementRect.width + extraWidth, y: (clipRect.y - extra) },

            { x: clipRect.x + extraWidth, y: (clipRect.y - extra) },

            { x: clipRect.x + extraWidth, y: (clipRect.getBottom() - extra) },

            { x: clipRect.getRight(), y: (clipRect.getBottom() - extra) },

            { x: clipRect.getRight(), y: (clipRect.y - extra) },

            { x: elementRect.width + extraWidth, y: (clipRect.y - extra) },

            { x: elementRect.width + extraWidth, y: elementRect.height },

            { x: 0, y: elementRect.height }

        ];
        return points;
    }

    static clipLeftInset(element, leftInset) {

    }

    static clipBetweenHorizontal(element, minX, maxX) {

    }

    static clipInsideRectangle(element, clipRect) {
        var elementRect = element.getBoundingClientRect();
        var points = CSSUtils.clipPoints(elementRect, clipRect);

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
        console.log("clip path: ", cssValue);
        element.style['-webkit-clip-path'] = cssValue;
    }

    static removeClipPath(element) {
        element.style['-webkit-clip-path'] = '';
    }


}