// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject = function (text, fontName, fontSize) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject.initializeBase(this, [text, null, fontName, fontSize]);

    this._boundingPaths = [];
    this._isVertical = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject.prototype = {
    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PathBoundedTextVObjectData";
    },

    get_boundingPaths: function () {
        return this._boundingPaths;
    },

    set_boundingPaths: function (value) {
        if (this._boundingPaths !== value) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._boundingPaths = value;
                this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(), true);
            });

            this.update(beforeUpdate);
        }
    },

    set_originalBoundingPaths: function (value) {
        this._boundingPaths = value;
    },

    get_isVertical: function () {
        return this._isVertical;
    },

    set_isVertical: function (v) {
        if (this._isVertical !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._isVertical = v;
            });

            this.update(beforeUpdate);
        }
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject);