/**
 * 
 */
class ClickManager {

    constructor() {
        this.registeredIds = {};
        this.registeredClasses = {};
        this.registeredSubclasses = {};
        this.registeredTags = {};
        this.registeredElementTags = [];
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
        if (!this._handleClassClick(element)){
            event.preventDefault();
        }
        this._handleTagClick(element);
    }

    _handleIdClick(element){
        if (this.registeredIds[element.id]) {
            this.registeredIds[element.id](element);
        }
    }

    _handleClassClick(element) {
        var didHandle = false;
        if (this.registeredClasses[element.className]) {
            this.registeredClasses[element.className](element);
            didHandle = true;
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredClasses[parentNode.className]) {
                    this.registeredClasses[parentNode.className](element);
                    didHandle = true;
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
        return didHandle;
    }

    _handleTagClick(element) {
        if (this.registeredTags[element.tagName]) {
            this.registeredTags[element.tagName](element);
        }
        else {
            var parentNode = element.parentNode;
            while (parentNode.nodeName != 'BODY') {
                if (this.registeredTags[parentNode.tagName]) {
                    this.registeredTags[parentNode.tagName](parentNode);
                    break;
                }
                parentNode = parentNode.parentNode;
            }
        }
    }

    // _handleElementClick(element) {
    //     var self = this;
    //     this.registeredElementTags.forEach(function(source){
    //         if (element === source.element){
    //             source.callback(element, )
    //         }
    //     });


    //     if (this.registeredTags[element.tagName]) {
    //         this.registeredTags[element.tagName](element);
    //     }
    //     else {
    //         var parentNode = element.parentNode;
    //         while (parentNode.nodeName != 'BODY') {
    //             if (this.registeredTags[parentNode.tagName]) {
    //                 this.registeredTags[parentNode.tagName](parentNode);
    //                 break;
    //             }
    //             parentNode = parentNode.parentNode;
    //         }
    //     }
    // }

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

    // registerTagsUnderElement(element, tags, fn) {
    //     if (!Array.isArray(tags)){
    //         tags = [tags];
    //     }

    //     this.registeredElementTags.push({
    //         element: element,
    //         tags: tags,
    //         calback: fn
    //     });
    // }

}