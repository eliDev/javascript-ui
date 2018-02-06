/**
 * 
 */
class ClickManager {

    constructor() {
        this.registeredIds = {};
        this.registeredClasses = {};
        this.registeredSubclasses = {};
        globals.singletons.windowEventManager.registerForLoadEvent(onPageLoad);
        // window.addEventListener('load', this.onPageLoad.bind(this));
    }

    onPageLoad() {
        document.body.addEventListener('click', this.onBodyClick.bind(this), true);
    }

    onBodyClick(event) {
        console.log('clicked: ', event);
        var element = event.srcElement;
        if (this.registeredIds[element.id]) {
            this.registeredIds[element.id](element);
        }
        else if (this.registeredClasses[element.className]) {
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

    registerId(id, fn) {
        this.registeredIds[id] = fn;
    }

    registerClass(classname, fn) {
        this.registeredClasses[classname] = fn;
    }

    registerSubclasses(parentClassname, fn) {
        this.registeredSubclasses[classname] = fn;
    }

}