/**
 * Provides static helper functions for common Element manipulations.
 * Support is not exhaustive. Certain methods need updating to handle properties
 * not yet encountered.
 * 
 * @see {@link PropertyUtils}
 */
class ElementUtils {
    
    /**
     * Returns the CSS or element value for the given property.
     * If no styles are given, one is computed. 
     * 
     * @param {HTMLElement} 'element' Optional when CSS styles and property are given.
     * @param {String or Array} 'propertynames' name of a style or element property.
     *                           Optionally Provide several names (return value is dictionary).
     * @param {CSSStyleDeclaration} 'elementStyles' Optional. The element's computed styles.
     * 
     * @return {Number} when a single property is given,
     *         {Object} when several properties are given    
     *                  key {String} = property name, value: {Number}
     *          Values default to a number appropriate for the property.
     *          (e.g. 'scale' is '1' when not present vs. '0' for margin-left')
     */
    static getValue (element, propertyNames, elementStyles) {
    
      // Create an array with the property if not 
      // provided with multiple properties to look up.
      var values = {};
      var properties = [propertyNames];
      if (Array.isArray(propertyNames)) {
        properties = propertyNames;
      }
      
      properties.forEach(function(propertyName) {
        var value = 0;
        if (PropertyUtils.isCSSStyle(propertyName)) {
          if (!elementStyles){
            elementStyles = window.getComputedStyle(element, null);
          }
          var propertyKey = PropertyUtils.getPropertyKey(propertyName);
          if (propertyKey === 'transform') {
            value = TransformUtils.getValue(elementStyles, propertyName);
          }
          else {
            value = PropertyUtils.parseProperty(propertyKey, elementStyles.getPropertyValue(propertyKey));
          }
        } 
        
        // Is element property.
        else {
          value = PropertyUtils.getElementProperty(element, propertyName);
        }
        
        if (undefined === value || (!value && isNaN(value))) {
          value = 0;
        }
        values[propertyName] = value;
      });
      
      var value = values;
      if (Object.keys(values).length === 1) {
        value = values[propertyNames]; // This is a String key.
      }
      return value;
    }
    
    /**
     * Converts the given value to an appropriate 
     * format for the given property before applying.
     * 
     * @param {HTMLElement} 'element'
     * @param {String} 'propertyName' Accepts CSS or element properties.
     * @param {Number} 'value'
     */
    static setValue (element, propertyName, value, customSuffix) {
      var propertyKey = PropertyUtils.getPropertyKey(propertyName);
      var preparedValue;  
      if (customSuffix) {
        preparedValue = (value + customSuffix);
      }
      else {
        preparedValue = PropertyUtils.composeProperty(propertyName, value);
      }
      if (PropertyUtils.isCSSStyle(propertyName)) {
        CSSUtils.setStyle(element, propertyKey, preparedValue);
        // element.style[propertyKey] = preparedValue;
      }
      else {
        element[propertyKey] = preparedValue;
      }
      return preparedValue;
    }
    
    /**
     * Applies the addition value to the elements current value for the 
     * given property. This causes a read before the write.
     * 
     * @param {HTMLElement} 'element'
     * @param {String} 'propertyName' Accepts CSS or element properties.
     * @param {Number} 'extraValue'
     */
    static setValuePlus (element, propertyName, extraValue) {
      if (extraValue === 0) {
        return;
      }
      var value = this.getValue(element, propertyName);
      value += extraValue;
      this.setValue(element, propertyName, value);
    }

    /** ==========================
        Designed Data Structures
      ============================ */

    /**
     * Applies all the property changes to the given element.
     * 
     * @param {HTMLElement} 'element'
     * @param {Object} 'values' properties to numeric values. 
     * 
     * @example: { "bottom": -12, "top": 2 }
     */
    static setValues (element, values) {
      var transforms = {};
      var propertyName;
      var value;
      var hasTransforms = false;

      for (propertyName in values) {

        if (values.hasOwnProperty(propertyName)) {
          value = values[propertyName];
          
          if (TransformUtils.isTransform(propertyName)) {
              transforms[propertyName] = value;
              hasTransforms = true;
          }
          else {
            this.setValue(element, propertyName, value);
          }
        }
      }

      if (hasTransforms) {
          value = PropertyUtils.composeTransform(transforms);
          this.setValue(element, TransformUtils.getVendorPrefix(), value);
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
    static setTransforms (element, transforms) {
      var value = PropertyUtils.composeTransform(transforms);
      element.style[TransformUtils.getVendorPrefix()] = value;
    }

    static frames(elements){
        var rects = [];
        for (var i = 0; i < elements.length; i ++) {
          var r = RectRectangleUtils.initFromDOMRect(elements[i].getBoundingClientRect());
          rects.push(r);
        }
        return rects;
    }


      
         
}