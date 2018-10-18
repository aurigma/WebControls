// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject = function (text, location, alignment, fontName, fontSize) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector text block.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

    ns.PlainTextVObject.initializeBase(this, [text, null, fontName, fontSize]);

    this._baselineLocation = location instanceof ns.Math.PointF ? location : new ns.Math.PointF(0, 0);
    this._actualAngle = 0;
    this._isVertical = false;

    this._needUpdate = (typeof text == "string" || typeof fontName == "string" || typeof fontSize == "number");

    if (alignment != null) {
        this._alignment = alignment;
        this._needUpdate = true;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.prototype = {
    //PlainTextVObject doesn't support arbitrary resize
    get_permissions: function () {
        var p = Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "get_permissions");
        p.set_allowArbitraryResize(false);
        return p;
    },

    set_permissions: function (v) {
        v.set_allowArbitraryResize(false);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "set_permissions", [v]);
    },

    set_alignment: function (v) {
        if (this._alignment === v)
            return;

        if (this.get_isUpdating()) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "set_alignment", [v]);
            return;
        }

        var updateAlignment = function () {
            var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

            this._location = this.get_location();

            var rect = this.get_rectangle();
            var angle = rect.Angle;
            rect.Angle = 0;

            var center = new ns.Math.PointF(rect.CenterX, rect.CenterY);

            var point = this.get_baselineLocation();
            point.rotateAt(-angle, center);

            if (v === ns.TextAlignment.Left) {
                point.X = rect.get_location().X;
            } else if (v === ns.TextAlignment.Center) {
                point.X = rect.CenterX;
            } else if (v === ns.TextAlignment.Right) {
                point.X = rect.get_location().X + rect.Width;
            }

            point.rotateAt(angle, center);
            this.set_baselineLocation(point);
            this._alignment = v;

            var afterUpdate = function () {
                if (this._location) {
                    this.set_location(this._location);
                    this.raiseUpdatedForAlignment();
                }
            }.bind(this);

            this.update(null, afterUpdate);
        }.bind(this);

        if (this._needUpdate)
            this.update(null, updateAlignment);
        else
            updateAlignment();
    },

    get_baselineLocation: function () {
        var center = this._get_controlCenter();
        var point = this._baselineLocation.clone();
        var transform = this.get_transform().clone();
        transform.rotate(-this.get_actualAngle());

        point.transform(transform, center);

        return point;
    },

    set_baselineLocation: function (v) {
        var point = this.get_baselineLocation();
        if (!point.isEqual(v)) {
            this.get_transform().move(v.X - point.X, v.Y - point.Y);
            this.quickUpdate();
        }
    },

    get_originalBaselineLocation: function () {
        return this._baselineLocation;
    },

    set_originalBaselineLocation: function (v) {
        this._baselineLocation = v;
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

    get_actualAngle: function () {
        return this._actualAngle;
    },

    set_actualAngle: function (v) {
        this._actualAngle = v;
    },

    add_updatedForAlignment: function (handler) {
        this.get_events().addHandler("updatedForAlignment", handler);
    },

    remove_updatedForAlignment: function (handler) {
        this.get_events().removeHandler("updatedForAlignment", handler);
    },

    raiseUpdatedForAlignment: function () {
        var handler = this.get_events().getHandler("updatedForAlignment");
        if (handler) {
            handler(this, Sys.EventArgs.Empty);
        }
    },

    update: function (beforeUpdate, afterUpdate) {
        if (this.isVisible())
            this._needUpdate = false;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "update", [beforeUpdate, afterUpdate]);
    },

    _afterUpdate: function (afterUpdate) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "_afterUpdate", [afterUpdate]);

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas.updateSelection();
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PlainTextVObjectData";
    },

    draw: function (ctx, isFocused) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, 'draw', [ctx, isFocused]);

        if (window.__$abl$ === true) {
            var p = this.get_baselineLocation();
            var rect = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(p.X, p.Y, 4, 4, 0);
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillRectangle(ctx, rect, 'red');
        }
    },

    _onResized: function () {
        var ratio = this.get_rectangle().Height / this._height;
        this._font._size = parseFloat((this._font._size * ratio).toFixed(1));
        this._leading = parseFloat((this.get_leading() * ratio).toFixed(1));

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "_onResized");
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);