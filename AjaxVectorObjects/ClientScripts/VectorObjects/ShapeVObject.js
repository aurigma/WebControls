// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject = function (path) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    ns.ShapeVObject.initializeBase(this);

    this._path = path != null ? path : new ns.Math.Path("");
    this._transformedPath = null;
    this._pathChangedDelegate = Function.createDelegate(this, this._pathChanged);

    this._borderColor = new ns.RgbColor("rgba(0,0,0,1)");
    this._borderWidth = 1;
    this._fillColor = new ns.RgbColor("rgba(112,112,112,1)");
    this._fixedBorderWidth = false;

    this._allowNegativeResize = false;

    this._isHuge = false;
    this._hugePathMinLength = 10000;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.prototype = {
    update: function (beforeUpdate, afterUpdate) {
        if (typeof beforeUpdate != "function")
            return;

        if (this.isVisible())
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "_update", [null, beforeUpdate, afterUpdate]);
        else
            beforeUpdate();
    },

    set_visible: function (value) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "set_visible", [value]);
        if (this.isVisible())
            this.update();
        else
            this._setNeedRedrawCanvasFlag();
    },

    get_path: function () {
        if (this._transformedPath)
            this._transformedPath.remove_pathChanged(this._pathChangedDelegate);
        this._transformedPath = this._get_transformedPath();
        this._transformedPath.add_pathChanged(this._pathChangedDelegate);

        return this._transformedPath;
    },

    set_path: function (v) {
        if (!this._get_transformedPath().isEqual(v)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._path = v;
                this._isHuge = this._path.get_length() > this._hugePathMinLength;
                this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform());
            });

            this.update(beforeUpdate);
        }
    },

    get_borderWidth: function () {
        return this._borderWidth;
    },

    set_borderWidth: function (v) {
        if (this._borderWidth !== v) {
            this._borderWidth = v;

            var canvas = this.get_canvas();
            if (canvas != null)
                canvas.updateSelection();

            this._setNeedRedrawCanvasFlag();
        }
    },

    get_borderColor: function () {
        return this._borderColor;
    },

    set_borderColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._borderColor.equals(color)) {
            this._borderColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_fillColor: function () {
        return this._fillColor;
    },

    set_fillColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._fillColor.equals(color)) {
            this._fillColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_fixedBorderWidth: function () {
        return this._fixedBorderWidth;
    },

    set_fixedBorderWidth: function (v) {
        if (this._fixedBorderWidth !== v) {
            this._fixedBorderWidth = v;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_originalPath: function () {
        return this._path;
    },

    set_originalPath: function (path) {
        this._path = path;
        this._isHuge = this._path.get_length() > this._hugePathMinLength;
    },

    _get_boundsMargin: function () {
        return this._borderWidth;
    },

    _get_transformedPath: function () {
        var center = this._get_controlCenter();
        var path = this._path.clone();

        path.transform(this.get_transform(), center);

        return path;
    },

    _pathChanged: function () {
        this.set_path(this._transformedPath.clone());
    },

    _get_dataType: function () {
        return "ShapeVObjectData";
    },

    draw: function (ctx) {
        if (!ctx)
            return;

        var borderWidth = this.get_borderWidth();
        if (this.get_fixedBorderWidth())
            borderWidth /= this.get_canvas().get_zoom();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path(
            ctx, this._path, this._get_controlCenter(), this.get_transform(), this.get_fillColor().Preview, borderWidth, this.get_borderColor().Preview, this.get_opacity());
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "_updateColors");

        var self = this;
        var fillColorCallback = Function.createDelegate(this, function (color) {
            self.set_fillColor(color);
        });

        var borderColorCallback = Function.createDelegate(this, function (color) {
            self.set_borderColor(color);
        });

        this._updateColor(this.get_fillColor(), fillColorCallback);
        this._updateColor(this.get_borderColor(), borderColorCallback);
    },

    _onAddedOnCanvas: function (canvas, supressUpdate) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "_onAddedOnCanvas", [canvas]);

        if (supressUpdate !== true)
            this.update();
    }
}
Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);