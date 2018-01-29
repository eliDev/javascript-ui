/**
 *
 */
class ElementFactory {

    constructor() { }

    static createElements(HTMLstring, tag) {
        if (!tag) {
            tag = 'div';
        }
        var wrapper = ElementFactory.createElement(tag, null, HTMLstring);
        return Array.from(wrapper.children);
    }

    static createElement(tag, classes, innerHTML) {
        var element = document.createElement(tag);
        if (classes) {
            if (classes.constructor === Array) {
                var index;
                for (index = 0; index < classes.length; index++) {
                    element.classList.add(classes[index]);
                }
            }
            else {
                element.classList.add(classes);
            }
        }
        if (innerHTML) {
            element.innerHTML = innerHTML;
        }
        return element;
    }
}