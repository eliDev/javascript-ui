/**
 * 
 */
class DOMHierarchy {

    constructor() { }

    static childrenWithClassName(parent, clazz) {
        var HTMLElements = parent.getElementsByClassName(clazz);
        HTMLElements = Array.from(HTMLElements);
        return HTMLElements;
    }

    static children(element) {
        var HTMLElements = element.children;
        return Array.from(HTMLElements);
    }

    /**
     Differs from .children by returning an array instead
     of an HTMLCollection.

     @param {HTMLElement} 'element'
     @return {Array} List of child HTMLElements
     */
    static getChildren(element) {
        var children = [];
        var child = element.firstElementChild;
        while (null !== child) {
            children.push(child);
            child = child.nextElementSibling;
        }
        return children;
    }

    static removeChildren(element) {
        var children = [];
        while (element.firstChild) {
            children.push(element.firstChild);
            element.removeChild(element.firstChild);
        }
        return children;
    }

    static removeChild(parentElement, childElement) {
        var parent = childElement.parentElement;
        if (!parent || parent !== parentElement) {
            return;
        }
        parentElement.removeChild(childElement);
    }

    static insertChildAtIndex(parentElement, child, index) {
        // No children or child is last.
        if (index === parentElement.children.length) {
            parentElement.appendChild(child);
        }
        else {
            var nextchild = this.getChildAtIndex(parentElement, index);
            parentElement.insertBefore(child, nextchild);
        }
    }

    static insertChildrenAtIndex(parentElement, children, index) {
        if (Array.isArray(children)) {
            var loopIndex;
            var child;
            for (loopIndex = 0; loopIndex < children.length; loopIndex++) {
                child = children[loopIndex];
                this.insertChildAtIndex(parentElement,child,index+loopIndex);
            }
        }
        else {
            this.insertChildAtIndex(parentElement,children,index);
        }
    }

    static insertAfter(parent, referenceChild, children) {
        var index = this.indexOfChild(parent, referenceChild);
        this.insertChildrenAtIndex(parent, children, index + 1);
    }

    static indexOfChild(parent, child) {
        var index = 0;
        var subView = parent.firstElementChild;
        while (null !== subView && child !== subView) {
            subView = subView.nextElementSibling;
            index++;
        }
        if (child !== subView) {
            index = -1;
        }
        return index;
    }

    /**
     Iterates over children from first to last until matching
     the given child.
     When 'childClass' is provided, only the children observed who
     contain the given class will contribute to the overall index.

     @param {HTML Element} 'element' parent element within the DOM
     @param {HTML Element} 'child' nested element under 'element'
     @param {String} 'includeClass' element class name to filter in children.
     @param {String} 'excludeClass' element class name to filter out children.

     @return {Number} overall index of the 'child' amongst the 'element's
     children (or children who match 'includeClass' when given).
     */
    static getIndexOfChild(element, child, includeClass, excludeClass) {
        var subView = element.firstElementChild;
        if (!subView) {
            return -1;
        }
        var index = 0;
        while (child !== subView && null !== subView) {
            if (CSSUtils.elementHasClass(subView, includeClass)) {
                index++;
            }
            else if (undefined === includeClass && undefined === excludeClass) {
                index++;
            }
            else if (!CSSUtils.elementHasClass(subView, excludeClass)) {
                index++;
            }
            subView = subView.nextElementSibling;
        }
        return index;
    }

    static getChildAtIndex(element, index) {
        var child = element.firstElementChild;
        var childIndex = 0;
        while (child && null !== child && childIndex < index) {
            child = child.nextElementSibling;
            childIndex++;
        }
        return child;
    }

    static removeChildAtIndex(parent, childIndex) {
        var child = this.getChildAtIndex(childIndex);
        element.removeChild(child);
        return child;
    }

    /** ==============
        Children
     ===============*/

    /**
     * Traverse up the hierarchy to find the first parent
     * having one the of 'includeClasses' class (optional).  Otherwise
     * the first parent is returned.
     *
     * @param {HTML Element} 'childElement'
     * @param {Array} 'includeClasses' Parent must have one of these classes.
     * @returns {HTML Element} {null}
     */
    static parentElement(childElement, tag, includeClasses) {
        if (!childElement || !childElement.parentNode) {
            return null;
        }
        var parent = childElement.parentNode;
        if (!includeClasses && !tag) {
            return parent;
        }
        var hasClass = function(element, classes) {
            if (!classes || classes.length === 0){
                return true;
            }
            for (var index = 0; index < classes.length; index++) {
                if (CSSUtils.elementHasClass(parent, classes[index])) {
                    return true;
                }
            }
            return false;
        };
        var hasTag = function(element, tag) {
            if (tag) {
                return (parent.tagName === tag);
            } else {
                return true;
            }
        };

        if (includeClasses && !Array.isArray(includeClasses)) {
            includeClasses = [includeClasses];
        }

        while (parent) {
            if (parent === document.body) {
                return null;
            }
            if (hasTag(parent, tag) && hasClass(parent, includeClasses)) {
                return parent;
            }
            parent = parent.parentNode;
        }
        return null;
    }

}