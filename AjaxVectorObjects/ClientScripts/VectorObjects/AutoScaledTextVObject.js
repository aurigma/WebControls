// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject = function (text, rectangle, fontName) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject.initializeBase(this, [text, rectangle, fontName]);

    this._isVertical = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject.prototype = {
    _get_dataType: function () {
        return "AutoScaledTextVObjectData";
    },

    get_verticalScale: function () {
        return this._verticalScale;
    },

    set_verticalScale: function (v) {
    },

    get_horizontalScale: function () {
        return this._horizontalScale;
    },

    set_horizontalScale: function (v) {
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
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);