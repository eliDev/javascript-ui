

var globals = {
    singletons: {
        windowEventManager: new WindowEventManager(),
        clickmanager: new ClickManager()
    }
};

globals.singletons.windowEventManager.init();
globals.singletons.clickmanager.init();


VBL = {
    globals: globals,
    DirectionRect: DirectionRect,
    MathUtils: DirectionRect,
    Line: Line,
    MathUtils: MathUtils,
    Point: Point,
    RectangleSide: Direction,
    StringUtils: StringUtils,
    TableUtils: TableUtils,
    Rectangle: Rectangle,
    CSSUtils: CSSUtils,
    TransformUtils: TransformUtils,
    ElementPosition: ElementPosition,
    ElementFactory: ElementFactory
};



// Call into application code.
// Provided by application. Contains at least the function run()
if (typeof Main === 'undefined') {
    console.log("no Main class provided externally.  Cannot call run() after library initialized.");
} else {
    new Main().run();
}

if (typeof window !== 'undefined') {
    (function(window,document) {

        var prefix = "", _addEventListener, support;

        // detect event model
        if ( window.addEventListener ) {
            _addEventListener = "addEventListener";
        } else {
            _addEventListener = "attachEvent";
            prefix = "on";
        }

        // detect available wheel event
        support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
            document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
                "DOMMouseScroll"; // let's assume that remaining browsers are older Firefox

        window.addWheelListener = function( elem, callback, useCapture ) {
            _addWheelListener( elem, support, callback, useCapture );

            // handle MozMousePixelScroll in older Firefox
            if( support == "DOMMouseScroll" ) {
                _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
            }
        };

        function _addWheelListener( elem, eventName, callback, useCapture ) {
            elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
                !originalEvent && ( originalEvent = window.event );

                // create a normalized event object
                var event = {
                    // keep a ref to the original event object
                    originalEvent: originalEvent,
                    target: originalEvent.target || originalEvent.srcElement,
                    type: "wheel",
                    deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                    deltaX: 0,
                    deltaY: 0,
                    deltaZ: 0,
                    preventDefault: function() {
                        originalEvent.preventDefault ?
                            originalEvent.preventDefault() :
                            originalEvent.returnValue = false;
                    }
                };

                // calculate deltaY (and deltaX) according to the event
                if ( support == "mousewheel" ) {
                    event.deltaY = - 1/40 * originalEvent.wheelDelta;
                    // Webkit also support wheelDeltaX
                    originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
                } else {
                    event.deltaY = originalEvent.deltaY || originalEvent.detail;
                }

                // it's time to fire the callback
                return callback( event );

            }, useCapture || false );
        }

    })(window, document);
}






// window.addEventListener('load', function() {
//     ExpandingList.buildTree();
//     document.body.addEventListener('click', onBodyClick, true)
// });
//
// function onBodyClick(event) {
//     console.log('clicked: ', event)
//     var element = event.srcElement;
//     if (_registeredclicks[element.id]) {
//         _registeredclicks[element.id](element)
//     }
// }
//
// function _registerClick(id, fn) {
//     _registeredclicks[id] = fn
// }
//
// var _registeredclicks = {};
//
// _registerClick("2", function(element){
//     console.log('element clicked: ', element)
// });
//
//
//
// class T {
//     constructor(){
//         _registerClick("3", this.onclick) //.bind(this))
//     }
//     onclick(element, x) {
//         console.log('element clicked: ', element)
//         console.log('x: ', x)
//         console.log('this: ', this)
//     }
// }
// var t = new T();



