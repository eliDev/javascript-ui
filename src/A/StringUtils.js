// <reference path="StringUtils.js" />
StringUtils = {};


/**
  @param {String} 'string' text to be measured
  @param {String} 'font' The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana")
  @return {Rectangle} frame of string (x,y are zero)

  http://www.html5canvastutorials.com/tutorials/html5-canvas-text-metrics/
*/
StringUtils.measureStringWidth = function (string, font) {

  if (!Boolean(this.canvas)) {
    var canvas = document.createElement('canvas');
    var docFragment = document.createDocumentFragment();
    docFragment.appendChild(canvas);
    this.canvas = canvas;
  }

  var context = this.canvas.getContext("2d");
  context.font = font;
  var width = context.measureText(string).width;
  return width;
};

/**
  @param {String} 'pixelString' Expected in the form "...###px"
  Expect 'px' to be preceeded by a numeric value.
*/
//StringUtils.parsePixelNumber = function (pixelString) {

//  var pixelIndex = pixelString.indexOf('px');
//  if (pixelIndex < 0) {
//    return null;
//  }

//  var charIndex;
//  var character;
//  var parsedString = "";
//  var number;

//  for (charIndex = pixelIndex - 1; charIndex >= 0; charIndex--) {

//    character = pixelString.charAt(charIndex);
//    if (Number.isInteger(character) || character === '.') {
//      parsedString = character + parsedString;
//    }
//    else {
//      break;
//    }
//  }
//  number = parseInt(parsedString);
//  return number;
//};

/**
   * Determines if the given 'string' has at
   * least one non-whitespace character.
   */
StringUtils.hasText = function (stringInput) {

  var _hasText = false;
  if (null !== stringInput && typeof stringInput === 'string' && stringInput.length > 0) {

    // Whitespace characters which are
    // not considering 'text'.
    var SPACE_CODE = 32;
    var NON_BREAKING_SPACE_CODE = 160;
    var TAB_CODE = 9;

    // Looping through each character is more effecient than
    // performing a regex validation.
    for (var charIndex = 0; charIndex < stringInput.length; charIndex++) {

      var charCode = stringInput.charCodeAt(charIndex);
      switch (charCode) {

        // Whitespace character codes.
        // These characters are ignored.
        case SPACE_CODE:
        case NON_BREAKING_SPACE_CODE:
        case TAB_CODE:
          break;

        default:
          _hasText = true;
      }

      if (_hasText) {
        break;
      }
    }
  }
  return _hasText;
};

/**
http://stackoverflow.com/questions/17888039/javascript-efficient-parsing-of-css-selector
*/
StringUtils.parseSelectors = function (selectorString) {

  var obj = {tags:[], classes:[], ids:[], attrs:[]};
  selectorString.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function (token) {

    switch (token[0]) {
      case '#':
        obj.ids.push(token.slice(1));
        break;
      case '.':
        obj.classes.push(token.slice(1));
        break;
      case '[':
        obj.attrs.push(token.slice(1,-1).split('='));
        break;
      default :
        obj.tags.push(token);
        break;
    }
  });
  return obj;
}