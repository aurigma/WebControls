// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject = function (text, rectangle, fontName, fontSize) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector text block.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.initializeBase(this, [text, rectangle, fontName, fontSize]);

    this._wrappingRectangles = [];
    this._wrappingMargin = 7;
    this._paragraphSettings = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings();
    this._verticalAlignment = Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextVerticalAlignment.Top;
    this._isVertical = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.prototype = {
    get_wrappingRectangles: function () {
        return this._wrappingRectangles;
    },

    set_wrappingRectangles: function (value) {
        if (!this._areRectanglesEqual(this._wrappingRectangles, value)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._wrappingRectangles = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_wrappingMargin: function () {
        return this._wrappingMargin;
    },

    set_wrappingMargin: function (value) {
        if (this._wrappingMargin !== value) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._wrappingMargin = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_paragraphSettings: function () {
        return this._paragraphSettings;
    },

    set_paragraphSettings: function (value) {
        if (!(value instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings))
            value = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings(value);

        if (!this._paragraphSettings.equals(value)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._paragraphSettings = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_verticalAlignment: function () {
        return this._verticalAlignment;
    },

    set_verticalAlignment: function (value) {
        if (this._verticalAlignment !== value) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._verticalAlignment = value;
            });

            this.update(beforeUpdate);
        }
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
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "BoundedTextVObjectData";
    },

    _onAddedOnCanvas: function (canvas) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, '_onAddedOnCanvas', [canvas, true /* supressUpdate */]);

        this._updateWrappingRectangles(true);
    },

    _updateWrappingRectangles: function (forceUpdate) {
        var canvas = this.get_canvas();
        if (canvas == null)
            return;

        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var thisLayerIndex = this.get_layer().get_index();
        var thisVObjectIndex = this.get_index();
        var thisRectangle = this.get_rectangle();
        var wrappingRectangles = [];

        //get actual wrapping reactangles
        var layers = canvas.get_layers();
        for (var i = thisLayerIndex, imax = layers.get_count() ; i < imax; i++) {
            var layer = layers.get_item(i);
            if (!layer.get_visible())
                continue;

            var vObjects = layer.get_vObjects();
            for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                var vo = vObjects.get_item(j);

                if (vo.get_visible() && !vo.get_permissions().get_noShow() && vo.get_textWrappingMode() != ns.WrappingMode.None &&
                    (vo.get_index() > thisVObjectIndex || layer.get_index() > thisLayerIndex)) {
                    var rect = vo.get_textWrappingMode() == ns.WrappingMode.Square ? ns.Math.RotatedRectangleF.fromRectangleF(vo.get_bounds()) :
                        vo.get_rectangle();

                    if (thisRectangle.intersectsWith(rect))
                        wrappingRectangles.push(rect);
                }
            }
        }

        //check whether the size was changed
        var rectangleSizeChanged = !this._lastRectangle || (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(thisRectangle.Width, this._lastRectangle.Width, 0.01) ||
            !Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(thisRectangle.Height, this._lastRectangle.Height, 0.01));
        var rectangleChanged = !this._lastRectangle || (!thisRectangle.isEqual(this._lastRectangle));
        this._lastRectangle = thisRectangle;

        //check whether the wrapping rectangles were changed
        var wrappingRectanglesChanged = !this._areRectanglesEqual(wrappingRectangles, this._wrappingRectangles);
        this._wrappingRectangles = wrappingRectangles;

        //do not update vObject if there are no wrapping rectangles and text was only moved or rotated (actual image should not be changed)
        if (forceUpdate || wrappingRectanglesChanged || rectangleSizeChanged || (rectangleChanged && wrappingRectangles.length > 0))
            this.update();
    },

    _areRectanglesEqual: function (rects0, rects1) {
        if (rects0.length != rects1.length)
            return false;

        for (var i = 0; i < rects0.length; i++) {
            var rect = rects0[i];

            var contains = false;
            for (var j = 0; j < rects1.length; j++) {
                if (rect.isEqual(rects1[j])) {
                    contains = true;
                    break;
                }
            }

            if (!contains)
                return false;
        }

        return true;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);