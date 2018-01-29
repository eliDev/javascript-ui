
/**
 * Holds state about element properties/CSS values
 * that are current vs. dirty (has no stored value in this class).
 * 
 * Interfaces with {@link ElementUtils} so state
 * can be updated by these calls and values lazily updated 
 * upon request. 
 * 
 * Motivation:
 * This class minimises reflow by not calling on the element 
 * for its layout values on every request. 
 * 
 * @see https://gist.github.com/paulirish/5d52fb081b3570c81e3a
 */
class ElementCache {

  constructor() {
    
    /**
     * key: {String} Caller assigned ID.
     * value: {HTMLElement}
     */
    this.elementsById = {}; 
    
    /**
     * key: {String} element ID
     * value: {Object} Dictionary
     *        key: {String} property name
     *        value: {Number or Object}  property value
     */
    this.elementPropertiesById = {};

    /**
     * An optimisation to lookup the associated element ID 
     * from the HTMLElement in an {@link Event}. 
     * Otherwhise, requires looping over the values to reverse
     * lookup the id {@link #elementsById} from the HTMLELement 
     * {@link Event#target} etc.
     */
    this.elementIdsByEvent = {};

    // Enables access to 'this' in event listener.
    this.onEventBind = this._onEvent.bind(this);
  }


    /** =============
      	  Data
    ================= */
  
  refreshValueOnProperty (elementId, propertyName){
    
    var element = this.getElement(elementId);
    var value = ElementUtils.getValue(element, propertyName);
    this._saveValueForId(elementId, propertyName, value);
    return value;
  }

  /**
   * Ineffecient when supplying HTMLElement param.
   * 
   * @param {String or HTMLElement} 'elementId'. @see {@link #getElementId} for performance.
   *          Provide a String for effeciency in accessing a registered element. 
   *          If given an HTMLElement, it may not apply changes to the correct element
   *          if 2 of the same element are registered. If element is not registered nothing 
   *          is applied.
   */
  _saveValueForId(elementId, propertyName, value) {

    var _elementId = this.getElementId(elementId);
    var elementProperties = this.elementPropertiesById[_elementId];
    if (!this.elementPropertiesById[_elementId]) {
      throw "[ElementCache: _saveValueForId] elementId: " + "\'" + _elementId + "\'" + "does not exist";
    }

    elementProperties[propertyName] = value;
  }


   /** =================
       Delete / Reset
    ==================== */

/**
 * Remove all recorded values. 
 * This is recommended when invalidating the whole screen.
 */
  clearAll() { 

     var elementId;
     for (elementId in this.elementPropertiesById) {
       this.elementPropertiesById[elementId] = {};
     }
  }

/**
 * Remove an entry for the given property name.
 */
  clearValue(elementId, propertyName) {
      this._removeValueForId(elementId, propertyName);
  }

  /**
   * Removes the property key from the group for the given 
   * elementId. This forces the next time {@link #getValue} with 
   * the same property name to query the DOM. 
   * 
   * @param {String or HTMLElement} 'elementId'. String is best.
   * @param {String or Array} 'propertName'
   */
  _removeValueForId(elementId, propertyNames) {
    var _elementId = this.getElementId(elementId);
    var elementProperties = this.elementPropertiesById[_elementId];

    if (!Array.isArray(propertyNames)){
        propertyNames = [propertyNames];
    }

    propertyNames.forEach(function(propertyName) {
      if (elementProperties.hasOwnProperty(propertyName)){
        delete elementProperties[propertyName];
      } 
    }); 
  }

  /** ===============
      	Events
    =================*/

    /**
     * This to clear the cache for the corresponding
     * property relating whenever the the event fires. 
     * @example Any cache for 'scrollTop' is removed for the 'scroll' event.
     * 
     * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement O(n)
     * @param {String} 'eventName'. Is added to the element's {@link EventTarget#addEventListener}
     */
    monitorEvent (elementId, eventName) {

      this.getElement(elementId).addEventListener(eventName, this.onEventBind);

      var elementIds;
      if (this.elementIdsByEvent.hasOwnProperty(eventName)){
        elementIds = this.elementIdsByEvent[eventName];
      }
      else {

        elementIds = [];
        this.elementIdsByEvent[eventName] = elementIds;
      }

      elementIds.push(this.getElementId(elementId));
    }

    /**
     * Ends the monitor of a previous added event.
     * @see {@link #monitorEvent}
     * 
     * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement O(n)
     * @param {String} 'eventName'. Is removed to the element's {@link EventTarget#removeEventListener}
     */
    unMonitorEvent (elementId, eventName) {

      this.getElement(elementId).removeEventListener(eventName, this.onEventBind);
      var index = this.elementIdsByEvent[eventName].indexOf(this.getElementId(elementId));
      this.elementIdsByEvent[eventName].splice(index, 1);
    }

    /**
     * Handles event firing. 
     * Removes the stored associated HTMLELement property for the event.
     * @see {@link #_getPropertiesForEventType}
     */
    _onEvent (event) {

      var propertiesToUpdate = this._getPropertiesForEventType(event.type);

      var elementIds = this.elementIdsByEvent[event.type];
      var self = this;
      elementIds.forEach(function(elementId){
          self._removeValueForId(elementId, propertiesToUpdate);
      });
    }

    /**
     * 
     * @return {Array} Properties which the DOM changes when 
     *                  the given {@link Event#type} fires.
     */
    _getPropertiesForEventType (eventType) {

      var propertyNames = [];

      switch (eventType) {

        case 'scroll':
          propertyNames.push('scrollTop');
          propertyNames.push('scrollBottom');
          break;
      }
      return propertyNames;
    }

  /** ===============
         Elements
      =============== */
  
  /**
   * After registration, caller can use the set/get methods 
   * by the same given 'elementId'.
   * 
   * @param {HTMLElement} 'element' Is retained.
   * @param {String} 'elementId' Must be unique from any other
   *                  received element-id string.
   * 
   * @see {@link #getElement}
   * @see {@link #getValue}
   * @see {@link #setValue}
   * @see {@link #setValuePlus}
   */
  registerElement (element, elementId){
    
    if (this.elementsById[elementId]) {
      throw "[ElementCache: registerElement] Received id: " + "\'" + elementId + "\'" + "is not unique";
    }
    
    this.elementsById[elementId] = element;
    this.elementPropertiesById[elementId] = {};
  }

  /**
   * O(1).
   * @param {String or HTMLElement} 'elementId' @throws Exception if not present
   * @return {HTMLElement} The registered element (or parameter when given an element)
   */
  getElement (elementId) {

    if (typeof elementId !== 'string'){
      return elementId;
    }
    
    var element = this.elementsById[elementId];
    if (!element) {
      throw "[ElementCache: getElement] elementId: " + "\'" + elementId + "\'" + "does not exist";
    }
    return element;
  }

  /**
   * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement: O(n)
   * @return {String} The registered elementId (or the given parameter).
   */
  getElementId (elementId){
    
    if (typeof elementId === 'string') {
        return elementId;
    }

    // Find the ID for the element by looking 
    // for the first match in the list of stored elements.
    var _elementId;
    var entryKey;
    for (entryKey in this.elementsById) {

      if (this.elementsById.hasOwnProperty(entryKey) && this.elementsById[entryKey] === element) {
        _elementId = entryKey;
        break;
      }
    }
    return _elementId;
  }
  
  /**
   * First checks the cache for the stored value, else retrieves the 
   * value on the associated HTMLElement and stores it.
   * 
   * @param {String or HTMLElement} 'elementId'. String: O(1), HTMLElement: O(n).
   * @param {String} 'propertyName' 
   * @return {Number or Object} Most cases returns a Number, unless the property 
   *                            has multiple values (e.g. 'backgroundColor').
   */
  getValue (elementId, propertyName) {
    
    var _elementId = this.getElementId(elementId);
    if (!this.elementPropertiesById[_elementId]) {
      throw "[ElementCache: getValue] elementId: " + "\'" + _elementId + "\'" + "does not exist";
    }
    
    var value;
    var propertyLookup = this.elementPropertiesById[_elementId];

    if (propertyLookup.hasOwnProperty(propertyName)) {
      value = propertyLookup[propertyName];  
      console.log("HIT (",_elementId, ":", propertyName, ")");
    }
    // Access the browser value.
    else {
      console.log("MISS (", _elementId, ":", propertyName, ")");
      value = this.refreshValueOnProperty(_elementId, propertyName);
    } 
    return value;
  }
  
  /**
   * @warning Ineffecient when supplying HTMLElement param.
   * 
   * @param {String or HTMLElement} 'elementId'.
   *          Provide a String for effeciency in accessing a registered element. 
   *          If given an HTMLElement, it may not apply changes to the correct element
   *          if 2 of the same element are registered. If element is not registered nothing 
   *          is applied.
   * @param {String} 'propertyName' Accepts CSS or element properties.
   * @param {Number} 'value'
   */
  setValue (elementId, propertyName, value) {
    
    // Assume value is valid.
    // (Otherwise we will store and return an invalid value).

    this._saveValueForId(elementId, propertyName, value);
    var element = this.getElement(elementId);
    ElementUtils.setValue(element, propertyName, value);
  }

    /**
     * Applies the addition value to the elements current value for the 
     * given property. This causes a read before the write.
     * 
     * @param {String or HTMLElement} 'elementId'. Best with String.
     * @param {String} 'propertyName' Accepts CSS or element properties.
     * @param {Number} 'extraValue'
     * 
     * @see {@link #setValue}
     */
    setValuePlus (elementId, propertyName, extraValue) {

      if (extraValue === 0) {
        return;
      }

      var value = this.getValue(elementId, propertyName);
      value += extraValue;
      this.setValue(elementId, propertyName, value);
    }

    /** ===============
      	  Bulk apply
        =============== */

    /**
     * @param {Object or Array} Can be one item or a list of item.
     * Items are expected to have the format:
     *     
     * [{
     *   element: // DOMElement or stringID,
     *   propertyName1: // numeric final value,
     *   propertyName2: // numeric final value,
     * }]
     * 
     * @example:
     * {
     *   element: document.getElementsByClassName('class-name')[0],
     *   "height": 126,
     *   "bottom": -12
     * }
     */
    setValues (values) {

      if (!Array.isArray(values)){
        values = [values];
      }

      var index;
      var elementChanges;
      var elementId;

      for (index = 0; index < values.length; index++) {
          elementChanges = values[index];
          elementId = elementChanges.element;
          delete elementChanges.element;
          this.setElementValues(elementId, elementChanges);
      }
    }

    /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "bottom": -12 }
     */
    setElementValues (elementId, values) {

      var element = this.getElement(elementId);
      var transforms = {};
      var propertyName;
      var hasTransforms = false;

      for (propertyName in values) {

        if (values.hasOwnProperty(propertyName)) {

          if (TransformUtils.isTransform(propertyName)){
            transforms[propertyName] = values[propertyName];
            hasTransforms = true;
          }
          else {
            this.setValue(elementId, propertyName, values[propertyName]);
          }
        }
      }

      if (hasTransforms) {
        this.setTransforms(elementId, transforms);
      }
    }

    /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "scale": 12 }
     */
    setTransforms (elementId, transforms) {

      var transformName;

      // Save all the transform values individually.
      for (transformName in transforms) {

        if (transforms.hasOwnProperty(transformName)) {
          this._saveValueForId(elementId, transformName, transforms[transformName]);
        }
      }
      
      var element = this.getElement(elementId);
      ElementUtils.setTransforms(element, transforms);
    }
}