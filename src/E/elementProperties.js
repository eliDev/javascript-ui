/*jshint esversion: 6 */
/**
 * Conveniences for accessing and setting properties values
 * on HTMLElements. 
 * 
 * Accessors convert properties to objects or numbers their value
 * is not already. e.g. 'height' of '12px' is converted to 12.
 * 
 * Supports the additional properties:
 * 'scrollBottom': The visible bottom of the scrolling area.
 *                   scrollTop + clientHeight.
 * 
 */
class ElementProperties {

  constructor() { }

    /**
     * Accessing the element's properties directly
     * (does not access CSSStyleDeclaration). 
     * 
     * @param {Element} 'element'
     * @param {String} 'propertyName'
     * @return {Number} Will be undefined for unsupported element properties.
     */
    static getElementProperty (element, propertyName) {
      var value;
      
      // Custom properties not implemented by
      // any browser.
      switch(propertyName) {
        case 'scrollBottom':
          value = parseFloat(ElementProperties.getElementProperty(element, 'scrollTop') + 
                  parseFloat(ElementProperties.getElementProperty(element, 'clientHeight')));
        break;
    
        // Browser supported properties.
        default:
          if (element instanceof Element) {
            value = element[propertyName];
          }
          // assume Angular object
          else {
            value = parseFloat(element.prop(propertyName));
          }
      }
      
      return value;
    }

    /**
     * Determines whether the given property is a property 
     * within an element's style or on the element itself.
     * 
     * @param {String} 'propertyName' 
     * @return {Boolean} 
     */
    static isCSSStyle (propertyName) {
      
      var isCSSStyle = true;
      switch(propertyName) {
        case 'scrollTop':
        case 'scrollHeight':
        case 'clientHeight':
        case 'clientWidth':
        case 'scrollBottom':
        case 'offsetLeft':
          isCSSStyle = false;
        break;
      }

      return isCSSStyle;
    }

    static applyCSS (htmlElement, className) {
      
      var classList = htmlElement.classList;
      if (classList.contains(className)){
        classList.remove(className);
        Animation.triggerReflow(htmlElement);
      }
      classList.add(className);
    }

    /**
     * The returned property key can be used to access
     * an element's property or the property of a style.
     * 
     * In most cases the given property is returned.
     * Notable exceptions are transform types.
     * 
     * @example 'translateY' -> 'transform'
     * 
     * @param {String} 'propertyName' 
     * @return {String} 
     */
    static getPropertyKey (propertyName) {
      var name = propertyName;
      switch(propertyName) {
        case 'scale':
        case 'scaleX':
        case 'translateY':
        case 'translateX':
        case 'rotateX':
        case 'rotateY':
          name = 'transform';
        break;
      }
      return name;
    }
      
    /**
     * Prepares the given value for the format accepted by 
     * the property name. 
     * 
     * @example "height" and 14 returns "14px"
     *          "translateY" of -10 returns "translateY(-10px)"
     *          "opacity" of 0.3 returns 0.3 (no change).
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @param {Number or Object} 'propertyValue'
     * 
     * @returns {String or Number} Returns the type applicable to the 
     *                            format accepted by the property.
     */
    static composeProperty (propertyName, propertyValue) {
      var prefix = ElementProperties.getPropertyPrefix(propertyName);
      var suffix = ElementProperties.getPropertySuffix(propertyName);
      var value;
      
      switch (propertyName) {
        case 'clip':
          if (propertyValue === 0) {
            value = 'auto';
          }
          else {
            value = prefix + ElementProperties.composeValues(propertyName, propertyValue) + suffix;
          }
        break;
        case 'color':
        case 'background-color':
          value = prefix + ElementProperties.composeValues(propertyName, propertyValue) + suffix;
        break;
        case 'color+component':
        case 'background-color+component':
          value = prefix + MathUtils.roundValue(propertyValue) + suffix;
        break;
        default:
        {
          if (prefix.length > 0 || suffix.length > 0){
            value = prefix + propertyValue + suffix;
          }
          else {
            value = propertyValue;
          }
        }
      }
      return value;
    }
    
    /**
     * Supports {@link PropertyUtils#composeProperty} when the value is an object
     * of sub-values. Creates an ordered string of each relevant key-value pair in 'propertyValue'.
     * Example property names: (e.g. color, clip, etc.).
     * 
     * @example:
     * 'clip', {top: 0, right: 10, bottom: 2, left: 3} -> "0px,10px,2px,3px"
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @param {Object} 'propertyValue' Holds numeric values for a styles sub-properties.
     *             
     * @return {String} A value organised appropriately for the given property name.
     *                  Does not return fully formatted value. 
     */
      static composeValues (propertyName, propertyValue) {
      // Order matters in composing the style's value.      
      var orderedKeys = [];
      var defaultValue;

      switch (propertyName) {
        case 'clip':
          orderedKeys = ['top', 'right', 'bottom', 'left'];
          defaultValue = "0";
        break;
        case 'color':
        case 'background-color':
          orderedKeys = ['r', 'g', 'b', 'a'];
          defaultValue = "1";
        break;
      }

      var index;
      var value = "";
      var key;

      for (index = 0; index < orderedKeys.length; index++) {
        key = orderedKeys[index];
        if (propertyValue[key]) {
            value += ElementProperties.composeProperty(propertyName + "+component", propertyValue[key]);
        }
        else {
          value = defaultValue;
        }

        // More values are coming, also converts the value to a string if not already.
        if (index < orderedKeys.length - 1) {
          value += ",";
        } 
      }
      return value;
    }

    // static composeValues (propertyName, propertyValue) {
      
    //   var value = "";
    //   var index;
    //   var keys = Object.keys(propertyValue);

    //   for (index = 0; index < keys.length; index++) {
    //     value += PropertyUtils.composeProperty(propertyName + "+component", propertyValue[keys[index]]);
    //     if (index < keys.length - 1) {
    //       // Converts the value to a string if not already.
    //       value += ",";
    //     } 
    //   }
      
    //   switch(propertyName){
        
    //     case 'color':
    //     case 'background-color':
    //       // Append an alpha value if only given rgb values.
    //       if (keys.length === 3){
    //         value += ",1";
    //       }
    //     break;
    //   }
    //   return value;
    // }
    
    /**
     * Returns any prefix that will need to be 
     * prepended to a property value before it is 
     * applied to a style or element.
     * 
     * @see {@link #composeProperty}
     * @see {@link #getPropertySuffix}
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @return {String} An Empty string when no prefix is needed.
     */
    static getPropertyPrefix (propertyName) {
      var prefix = "";
      switch(propertyName) {
        case 'translateY':
          prefix = "translateY(";
          break;
        case 'translateX':
            prefix = "translateX(";
            break;
        case 'scale':
          prefix = "scale(";
        break;
        case 'clip':
          prefix = "rect(";
          break;
        case 'color':
        case 'background-color':
          prefix = 'rgba(';
          break;
        case 'rotateX':
          prefix = 'rotateX(';
          break;
        case 'rotateY':
          prefix = 'rotateY(';
          break;
      }
      return prefix;
    }
    
    /**
     * Returns any suffix needed when formating a value to
     * apply to an element's style or property. 
     * 
     * @see {@link #composeProperty}
     * @see {@link #getPropertyPrefix}
     * 
     * @param {String} 'propertyName' CSS or Element property name.
     * @return {String} An Empty string when no suffix is needed.
     */
    static getPropertySuffix (propertyName) {
      var suffix = "px";
      switch(propertyName) {
        case 'scrollTop':
        case 'scrollHeight':
        case 'opacity':
        case 'color+component':
        case 'background-color+component':
        case 'visibility':
        case 'position':
        case 'z-index':
          suffix = "";
          break;
        case 'translateY':
        case 'translateX':
          suffix = "px)";
          break;
        case 'scale':
        case 'clip':
        case 'color':
        case 'background-color':
          suffix = ")";
          break;
        case 'rotateX':
        case 'rotateY':
          suffix = 'deg)';
          break;
      }
      return suffix;
    }
    
    /**
     * Converts a string style to a number or and 
     * object of numeric values.
     * 
     * @param {String} 'propertyName' HTMLElement property. e.g. 'background-color'
     * @param {String} 'propertyValue' As read from an element's CSSStyleDeclaration.
     * @return {Object or Number} Returns a value appropriate to the property
     *                            e.g. properties with sub-values (e.g. 'clip') return an object 
     *                            with numeric values for each box side. 
     *                            Otherwise returns the numeric version of the given string.
     * @example:
     * "rgb(0, 102, 33)" -> {r:0, g:102, b:33, a:0}
     */
    static parseProperty (propertyName, propertyValue) {
      var value;
      // parsing vriables.
      var components;
      switch (propertyName) {
        case 'clip':
          if (propertyValue === 'auto'){
            value = {
              top: 0, right: 0, bottom: 0, left: 0
            };
          }
          else {
            components = ElementProperties.parseComponents(propertyValue);
            value = {
              top: components[0],
              right: components[1],
              bottom: components[2],
              left: components[3]
            };
          }
          break;
        case 'color':
        case 'background-color':
          components = ElementProperties.parseComponents(propertyValue);
          value = {
            r: components[0],
            g: components[1],
            b: components[2],
          };
          
          var alphaComponent = 'a';
          value[alphaComponent] = 1;
          if (components.length > 3){
            value[alphaComponent] = components[3];
          }
          break;
        
        default: 
          value = parseFloat(propertyValue);
      }
      return value;
    }
    
    /**
     * Parses multi-valued element property into an array with each value.
     * 
     * @param {String} 'propertyValue' A bracketed element property value.
     * @return {Array} List of string parsed from left to right from the input.
     * 
     * @example:
     * "rgb(0, 102, 33)" -> ["0", "102", "33"]
     */
    static parseComponents (propertyValue){
      
      var firstBracketIndex = propertyValue.indexOf('(') + 1;
      var substring = propertyValue.slice(firstBracketIndex, propertyValue.length - 1);
      var parts = substring.split(" ");
      var values = [];
      var index = 0;
      for (index; index < parts.length; index++){
        values.push(parseFloat(parts[index]));
      }
      return values;
    }

    /**
     * Sets multiple transforms as one change.
     * @param {HTMLElement} 'element'
     * @param {Object} 'transformSet'
     *                  {
     *                    transformName: numeric value,
     *                    translateY: 12,
     *                    scale: 3
     *                  }
     */
    static composeTransform (transformSet) {
      var value = "";
      var transformName;
      var transformValue;
      var count = Object.keys(transformSet).length;
      var index = 0;

      for (transformName in transformSet) {

        if (transformSet.hasOwnProperty(transformName)) {
          transformValue = ElementProperties.composeProperty(transformName, transformSet[transformName]);
          
          if (index > 0 && index < count) {
            value += " ";
          }
          value += transformValue;
        }
        index++;
      }
      return value;
    }

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
      if (typeof window === 'undefined') {
        return;
      }
    
      // Create an array with the property if not 
      // provided with multiple properties to look up.
      var values = {};
      var properties = [propertyNames];
      if (Array.isArray(propertyNames)) {
        properties = propertyNames;
      }
      
      properties.forEach(function(propertyName) {
        var value = 0;
        if (ElementProperties.isCSSStyle(propertyName)) {
          if (!elementStyles){
            elementStyles = window.getComputedStyle(element, null);
          }
          var propertyKey = ElementProperties.getPropertyKey(propertyName);
          if (propertyKey === 'transform') {
            value = TransformUtils.getValue(elementStyles, propertyName);
          }
          else {
            value = ElementProperties.parseProperty(propertyKey, elementStyles.getPropertyValue(propertyKey));
          }
        } 
        
        // Is element property.
        else {
          value = ElementProperties.getElementProperty(element, propertyName);
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
      var propertyKey = ElementProperties.getPropertyKey(propertyName);
      var preparedValue;  
      if (customSuffix) {
        preparedValue = (value + customSuffix);
      }
      else {
        preparedValue = ElementProperties.composeProperty(propertyName, value);
      }
      if (ElementProperties.isCSSStyle(propertyName)) {
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
          value = ElementProperties.composeTransform(transforms);
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
      var value = ElementProperties.composeTransform(transforms);
      element.style[TransformUtils.getVendorPrefix()] = value;
    }


}