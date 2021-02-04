var that = this;
function __skpm_run (key, context) {
  that.context = context;

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/load-content.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/load-content.js":
/*!*****************************!*\
  !*** ./src/load-content.js ***!
  \*****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
* context       passed by Sketch
* [jsonObj]     optional js object param for debug data
*/
var artboardMargin = 100;
/* harmony default export */ __webpack_exports__["default"] = (function () {
  // export default function (context) {}
  // export function onRun (context, jsonObj) {
  // var onRun = function(context, jsonObj) {
  // define helpers
  var utils = {
    getValByPath: function getValByPath(path, json) {
      var pieces = path.split('.'),
          currPath = json;

      for (var i = 0; i < pieces.length; i++) {
        var val = pieces[i];

        if (currPath[val] == undefined) {
          return undefined;
        } else {
          currPath = currPath[val];
        }
      }

      return currPath;
    },
    artboardForObject: function (_artboardForObject) {
      function artboardForObject(_x) {
        return _artboardForObject.apply(this, arguments);
      }

      artboardForObject.toString = function () {
        return _artboardForObject.toString();
      };

      return artboardForObject;
    }(function (object) {
      if (object.isKindOfClass(MSArtboardGroup)) {
        return object; // Object is already an artboard
      } else if (object.parentGroup() != null) {
        return artboardForObject(object.parentGroup()); // Keep digging higher to find artboard
      } else {
          return null; // Object has no parent artboard
        }
    }),
    duplicateArtboard: function duplicateArtboard(artboard) {
      var newArtboard = artboard.duplicate();
      newArtboard.frame().y = artboard.frame().y() + newArtboard.frame().height() + artboardMargin;
      return newArtboard;
    },
    selectLayersOfTypInContainer: function selectLayersOfTypInContainer(layerType, containerLayer) {
      // Filter layers using NSPredicate
      var scope = typeof containerLayer !== 'undefined' ? containerLayer.children() : doc.currentPage().children(),
          predicate = NSPredicate.predicateWithFormat("(className == %@)", layerType),
          layers = scope.filteredArrayUsingPredicate(predicate); // Deselect current selection

      doc.currentPage().changeSelectionBySelectingLayers(nil); // Loop through filtered layers and select them

      var loop = layers.objectEnumerator(),
          layer;

      while (layer = loop.nextObject()) {
        layer.select_byExpandingSelection(true, true);
      }

      return layers;
    },
    selectTextLayers: function selectTextLayers(artboard) {
      var self = this;
      var textLayers = self.selectLayersOfTypInContainer("MSTextLayer", artboard); // log(textLayers.count() + " text layers selected")

      return textLayers;
    },
    parseLayer: function parseLayer(layer, json) {
      var self = this;

      var parseIndividualLayer = function parseIndividualLayer(MSLayer) {
        var tagMatch = MSLayer.name().match(/\{([^]+)\}/),
            tagVal,
            val;

        if (tagMatch != null && tagMatch[1]) {
          tagVal = tagMatch[1].trim();
        } else {
          console.log("no tagMatch for match: ");
          return;
        }

        val = self.getValByPath(tagVal, json);

        if (typeof val === 'undefined') {
          val = 'MISSING ' + tagVal.toUpperCase();
          console.log('val is UNDEFINED');
        }

        switch (MSLayer.class()) {
          case MSTextLayer:
            MSLayer.setStringValue(String(val));
            MSLayer.adjustFrameToFit();
            break;

          case MSBitmapLayer:
            var isUrl = new RegExp('http(s)?\:\/\/.+').test(val),
                fileManager = NSFileManager.defaultManager(),
                img;

            if (isUrl) {
              img = NSImage.alloc().initWithContentsOfURL(NSURL.URLWithString(val));
            } else {
              // check if image exists
              if (fileManager.fileExistsAtPath(val)) {
                img = NSImage.alloc().initWithContentsOfFile(val);
              }
            }

            if (img) {
              MSLayer.setConstrainProportions(false);
              MSLayer.setRawImage_convertColourspace_collection(img, false, doc.documentData().images());
              MSLayer.frame().setWidth(img.size().width);
              MSLayer.frame().setHeight(img.size().height);
              MSLayer.setConstrainProportions(true);
            } else {
              log('Image file ' + val + ' not found');
            }

            break;
        }
      };

      if (layer.class() == 'MSLayerGroup') {
        // if is group
        var layers = layer.children(),
            layersCount = layers.count();

        for (var i = 0; i < layersCount; i++) {
          parseIndividualLayer(layers[i]);
        }
      } else {
        // if is layer
        parseIndividualLayer(layer);
      }
    } // get global vars

  };
  var doc = context.document,
      app = NSApplication.sharedApplication(); // get selected layers

  var selectedArtboards = context.selection,
      selectedCount = selectedArtboards.count();
  var selectedArtboard = selectedArtboards[0]; // check if layers are selected

  if (!selectedArtboard.isKindOfClass(MSArtboardGroup) || selectedCount == 0 || selectedCount > 1) {
    app.displayDialog('Please select one artboard you want to use as a template.');
    return;
  } // get JSON by user input
  // var jsonStr = jsonObj ? JSON.stringify(jsonObj) : doc.askForUserInput("Enter the JSON you'd like to use").initialValue(""),


  var UI = __webpack_require__(/*! sketch/ui */ "sketch/ui");

  var jsonStr = UI.getStringFromUser("Enter the JSON you'd like to use", ''); // if input is an array, make valid json

  if (jsonStr.indexOf('[') == 0) {
    jsonStr = '{ "__sketchJsonArray": ' + jsonStr + ' }';
  } // attempt to parse json


  try {
    var json = JSON.parse(jsonStr);
  } catch (e) {
    app.displayDialog('Parsing error: ' + e);
    return;
  } // check if json is an array


  if (json.__sketchJsonArray) {
    // is an array
    var dataArr = json.__sketchJsonArray; // create a new artboard for each item in the array and select all text layers in the artboard

    for (var n = 0; n < dataArr.length; n++) {
      var newArtboard = utils.duplicateArtboard(selectedArtboard);
      var selectedTextLayers = utils.selectTextLayers(newArtboard);
      var currObj = dataArr[n]; // loop selected  textlayers

      for (var i = 0; i < selectedTextLayers.count(); i++) {
        var currLayer = selectedTextLayers[i];

        if (currObj) {
          utils.parseLayer(currLayer, currObj);
        }
      }

      newArtboard.select_byExpandingSelection(true, false);
      selectedArtboard = newArtboard;
    }
  } else {
    // single object
    // loop selected layers
    for (var i = 0; i < selectedCount; i++) {
      utils.parseLayer(selectedTextLayers[i], json);
    }
  }
});

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = __skpm_run.bind(this, 'default')

//# sourceMappingURL=load-content.js.map