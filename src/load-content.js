/**
* context       passed by Sketch
* [jsonObj]     optional js object param for debug data
*/
let artboardMargin = 100

export default function () {
    // export default function (context) {}

    // export function onRun (context, jsonObj) {
    // var onRun = function(context, jsonObj) {

    // define helpers
    var utils = {
        getValByPath: function (path, json) {
            var pieces = path.split('.'), currPath = json

            for (var i = 0; i < pieces.length; i++) {
                var val = pieces[i]
                if (currPath[val] == undefined) {
                    return undefined
                } else {
                    currPath = currPath[val]
                }
            }

            return currPath
        },

        artboardForObject: function (object) {
            if (object.isKindOfClass(MSArtboardGroup)) {
                return object // Object is already an artboard
            } else if (object.parentGroup() != null) {
                return artboardForObject(object.parentGroup()) // Keep digging higher to find artboard
            } else {
                return null // Object has no parent artboard
            }
        },

        duplicateArtboard: function (artboard) {
            var newArtboard = artboard.duplicate()
            newArtboard.frame().y =
                artboard.frame().y() + newArtboard.frame().height() + artboardMargin
            return newArtboard
        },

        selectLayersOfTypInContainer: function (layerType, containerLayer) {

            // Filter layers using NSPredicate
            var scope = (typeof containerLayer !== 'undefined') ? containerLayer.children() : doc.currentPage().children(),
                predicate = NSPredicate.predicateWithFormat("(className == %@)", layerType),
                layers = scope.filteredArrayUsingPredicate(predicate);

            // Deselect current selection
            doc.currentPage().changeSelectionBySelectingLayers(nil);

            // Loop through filtered layers and select them
            var loop = layers.objectEnumerator(), layer;
            while (layer = loop.nextObject()) {
                layer.select_byExpandingSelection(true, true)
            }
            return layers;
        },

        selectTextLayers: function (artboard) {
            var self = this
            let textLayers = self.selectLayersOfTypInContainer("MSTextLayer", artboard)
            // log(textLayers.count() + " text layers selected")
            return textLayers;
        },

        parseLayer: function (layer, json) {
            var self = this

            var parseIndividualLayer = function (MSLayer) {
                var tagMatch = MSLayer.name().match(/\{([^]+)\}/), tagVal, val
                if (tagMatch != null && tagMatch[1]) {
                    tagVal = tagMatch[1].trim()
                } else {
                    console.log("no tagMatch for match: ")
                    return
                }

                val = self.getValByPath(tagVal, json)
                if (typeof val === 'undefined') {
                    val = 'MISSING '+ tagVal.toUpperCase() 
                    console.log('val is UNDEFINED')
                }

                switch (MSLayer.class()) {
                    case MSTextLayer:
                        MSLayer.setStringValue(String(val))
                        MSLayer.adjustFrameToFit()
                        break

                    case MSBitmapLayer:
                        var isUrl = new RegExp('http(s)?\:\/\/.+').test(val),
                            fileManager = NSFileManager.defaultManager(),
                            img

                        if (isUrl) {
                            img = NSImage.alloc().initWithContentsOfURL(
                                NSURL.URLWithString(val)
                            )
                        } else {
                            // check if image exists
                            if (fileManager.fileExistsAtPath(val)) {
                                img = NSImage.alloc().initWithContentsOfFile(val)
                            }
                        }

                        if (img) {
                            MSLayer.setConstrainProportions(false)
                            MSLayer.setRawImage_convertColourspace_collection(
                                img,
                                false,
                                doc.documentData().images()
                            )
                            MSLayer.frame().setWidth(img.size().width)
                            MSLayer.frame().setHeight(img.size().height)
                            MSLayer.setConstrainProportions(true)
                        } else {
                            log('Image file ' + val + ' not found')
                        }

                        break
                }
            }

            if (layer.class() == 'MSLayerGroup') {
                // if is group
                var layers = layer.children(), layersCount = layers.count()

                for (var i = 0; i < layersCount; i++) {
                    parseIndividualLayer(layers[i])
                }
            } else {
                // if is layer
                parseIndividualLayer(layer)
            }
        }
    }

    // get global vars
    var doc = context.document, app = NSApplication.sharedApplication()

    // get selected layers
    var selectedArtboards = context.selection,
        selectedCount = selectedArtboards.count()

    let selectedArtboard = selectedArtboards[0]

    // check if layers are selected
    if (
        !selectedArtboard.isKindOfClass(MSArtboardGroup) ||
        selectedCount == 0 ||
        selectedCount > 1
    ) {
        app.displayDialog(
            'Please select one artboard you want to use as a template.'
        )
        return
    }

    // get JSON by user input
    // var jsonStr = jsonObj ? JSON.stringify(jsonObj) : doc.askForUserInput("Enter the JSON you'd like to use").initialValue(""),
    var UI = require('sketch/ui')
    var jsonStr = UI.getStringFromUser("Enter the JSON you'd like to use", '')

    // if input is an array, make valid json
    if (jsonStr.indexOf('[') == 0) {
        jsonStr = '{ "__sketchJsonArray": ' + jsonStr + ' }'
    }

    // attempt to parse json
    try {
        var json = JSON.parse(jsonStr)
    } catch (e) {
        app.displayDialog('Parsing error: ' + e)
        return
    }

    // check if json is an array
    if (json.__sketchJsonArray) {
        // is an array
        var dataArr = json.__sketchJsonArray

        // create a new artboard for each item in the array and select all text layers in the artboard
        for (var n = 0; n < dataArr.length; n++) {
            let newArtboard = utils.duplicateArtboard(selectedArtboard)
            var selectedTextLayers = utils.selectTextLayers(newArtboard)

            var currObj = dataArr[n];

            // loop selected  textlayers
            for (var i = 0; i < selectedTextLayers.count(); i++) {
                var currLayer = selectedTextLayers[i]
                if (currObj) {
                    utils.parseLayer(currLayer, currObj)
                }
            }

            newArtboard.select_byExpandingSelection(true, false)
            selectedArtboard = newArtboard
        }

    } else {
        // single object
        // loop selected layers
        for (var i = 0; i < selectedCount; i++) {
            utils.parseLayer(selectedTextLayers[i], json)
        }
    }
}
