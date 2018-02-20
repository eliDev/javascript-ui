/*jshint esversion: 6 */
/**
 * 
 */
class TransformUtils {

  constructor() {
  }

  static getVendorPrefix () {
    return 'transform';
  }

     /**
     * Parses the transform to find the given property 
     * (e.g. 'scale', 'translateY', ...);
     * 
     * @see https://css-tricks.com/get-value-of-css-rotation-through-javascript/
     * @see https://www.w3.org/TR/2011/WD-css3-2d-transforms-20111215/#matrix-decomposition
     * @see https://www.w3.org/TR/SVG/coords.html#RotationDefined
     * 
     * @param {HTMLElement} 'element'
     * @param {CSSStyleDeclaration} 'styles' Optional. HTMLElement.style
     * @param {String} 'propertyName' The name of the type of transform.
     * @return {Number} A default appropriate to the property will be 
     *                  returned if no transform is present.
     */
    static getValue (styles, propertyName) {
      
      var transform = styles.getPropertyValue(this.getVendorPrefix());


      // var transform = styles.getPropertyValue("-webkit-transform") ||
      //                 styles.getPropertyValue("-moz-transform") ||
      //                 styles.getPropertyValue("-ms-transform") ||
      //                 styles.getPropertyValue("-o-transform") ||
      //                 styles.getPropertyValue("transform") ||
      //                 "";
      
      var value = 0;
      if (transform === 'none') {
        switch(propertyName){
          case 'scale':
            value = 1;
          break;
        }
        return value;
      }
      
      var matrix = this._parseMatrix(transform);
      
      switch(propertyName) {
          case 'scale':
            value = Math.sqrt((matrix.m11 * matrix.m11) + (matrix.m12 * matrix.m12));
          break;
          case 'translateY':
            value = matrix.m42;
          break;
          
          case 'rotateX':
          case 'rotateY':
          case 'rotateZ':
          {
            var rotateY = Math.asin(-matrix.m13);
            if (propertyName === 'rotateY') {
              value = rotateY;  
            }
            else if (propertyName === 'rotateX') {
              
              if (Math.cos(rotateY) !== 0) {
                value = Math.atan2(matrix.m23, matrix.m33);
              } 
              else {
                value = Math.atan2(-matrix.m31, matrix.m22);
              }
            }
            // rotateZ
            else {
              value = 0;
              if (Math.cos(rotateY) !== 0) {
                value = Math.atan2(matrix.m12, matrix.m11);
              } 
            }
            value = MathUtils.convertToDegress(value);
          }
          break;
      }
      return value;
    }

    /**
     * @see http://keithclark.co.uk/articles/calculating-element-vertex-data-from-css-transforms/
     */
    static _parseMatrix (matrixString) {
        var c = matrixString.split(/\s*[(),]\s*/).slice(1,-1),
            matrix;
    
        if (c.length === 6) {
            // 'matrix()' (3x2)
            matrix = {
                m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
                m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
                m13: 0,     m23: 0,     m33: 1, m43: 0,
                m14: 0,     m24: 0,     m34: 0, m44: 1
            };
        } else if (c.length === 16) {
            // matrix3d() (4x4)
            matrix = {
                m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
                m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
                m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
                m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
            };
    
        } else {
            // handle 'none' or invalid values.
            matrix = {
                m11: 1, m21: 0, m31: 0, m41: 0,
                m12: 0, m22: 1, m32: 0, m42: 0,
                m13: 0, m23: 0, m33: 1, m43: 0,
                m14: 0, m24: 0, m34: 0, m44: 1
            };
        }
        return matrix;
    }

    static isTransform(propertyName) {
      var isTransform = false;
      switch (propertyName){
        case 'scale':
        case 'translateY':
        case 'translateX':
        case 'rotateX':
        case 'rotateY':
          isTransform = true;
          break;
      }
      return isTransform;
    }

}