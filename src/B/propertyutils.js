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
class PropertyUtils {

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
          value = parseFloat(PropertyUtils.getElementProperty(element, 'scrollTop') + 
                  parseFloat(PropertyUtils.getElementProperty(element, 'clientHeight')));
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
        case 'translateY':
        case 'translateX':
        case 'rotateX':
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
      
      var prefix = PropertyUtils.getPropertyPrefix(propertyName);
      var suffix = PropertyUtils.getPropertySuffix(propertyName);
      var value;
      
      switch (propertyName) {
        case 'clip':
          if (propertyValue === 0) {
            value = 'auto';
          }
          else {
            value = prefix + PropertyUtils.composeValues(propertyName, propertyValue) + suffix;
          }
        break;
        
        case 'color':
        case 'background-color':
          value = prefix + PropertyUtils.composeValues(propertyName, propertyValue) + suffix;
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
            value += PropertyUtils.composeProperty(propertyName + "+component", propertyValue[key]);
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
            components = PropertyUtils.parseComponents(propertyValue);
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
          components = PropertyUtils.parseComponents(propertyValue);
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
          transformValue = PropertyUtils.composeProperty(transformName, transformSet[transformName]);
          
          if (index > 0 && index < count) {
            value += " ";
          }
          value += transformValue;
        }
        index++;
      }
      return value;
    }

}