/*jshint esversion: 6 */
/**
 * 
 */
class MathUtils {

  constructor() {

  }

  static convertToDegress (radians){
      var degrees = radians * (180.0 / Math.PI);
      return degrees;
    }

  static roundValue (value, roundingFunction) {
      var roundedValue = 0;
      roundingFunction = roundingFunction || Math.round;
    
    if (typeof value === 'number') {
        roundedValue = roundingFunction(value);
    }
    // Assume object.
    else {
      
      var key;
      roundedValue = {};
      for (key in value) {
        roundedValue[key] = ElementUtils.roundValue(value[key], roundingFunction);
      }
    }
    return roundedValue;
  }

}