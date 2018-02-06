/**
 * 
 */
class ClickManager {

    constructor() {
        this.registeredIds = {};
        this.registeredClasses = {};
        this.registeredSubclasses = {};
        this.registeredTags = {};
        // window.addEventListener('load', this.onPageLoad.bind(this));
    }

    init() {
        // inside init.
        globals.singletons.windowEventManager.registerForLoadEvent(this.onPageLoad.bind(this));
    }

    onPageLoad() {
        document.body.addEventListener('click', this.onBodyClick.bind(this), true);
    }

    onBodyClick(event) {
        console.log('clicked: ', event);
        var element = event.srcElement;
        this._handleIdClick(element);
        this._handleClassClick(element);
        this._handleTagClick(element);

        // if (this.registeredIds[element.id]) {
        //     this.registeredIds[element.id](element);
        // }
        // else if (this.registeredClasses[element.className]) {
        //     this.registeredClasses[element.className](element);
        // }
        // else {
        //     var parentNode = element.parentNode;
        //     while (parentNode.nodeName != 'BODY') {
        //         if (this.registeredClasses[parentNode.className]) {
        //             this.registeredClasses[parentNode.className](element);
        //             break;
        //         }
        //         parentNode = parentNode.parentNode;
        //     }
        // }
    }

    _handleIdClick(element){
        if (this.registeredIds[element.id]) {
            this.registeredIds[element.id](element);
        }
    }

    _handleClassClick(element) {
        if (this.registeredClasses[element.className]) {
            this.registeredClasses[element.className](element);
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredClasses[parentNode.className]) {
                    this.registeredClasses[parentNode.className](element);
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
    }

    _handleTagClick(element) {
        if (this.registeredTags[element.tagName]) {
            this.registeredTags[element.tagName](element);
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredTags[parentNode.tagName]) {
                    this.registeredTags[parentNode.tagName](element);
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
    }

    registerId(id, fn) {
        this.registeredIds[id] = fn;
    }

    registerClass(classname, fn) {
        this.registeredClasses[classname] = fn;
    }

    registerSubclasses(parentClassname, fn) {
        this.registeredSubclasses[classname] = fn;
    }

    /**
     * Overwrites previous registration.
     * @param {*} tag 
     * @param {*} fn 
     */
    registerTag(tag, fn) {
        // Tags are read back from an element as uppercase. 
        var upper = tag.toUpperCase();
        this.registeredTags[upper] = fn;
    }

}