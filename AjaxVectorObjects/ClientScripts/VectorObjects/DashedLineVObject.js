// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject = function (x1, y1, x2, y2) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector line.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.initializeBase(this, [x1, y1, x2, y2]);

    this._dashWidth = 3;
    this._altDashWidth = 3;
    this._altColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,0)");
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.prototype = {
    get_dashWidth: function () { return this._dashWidth; },

    set_dashWidth: function (v) {
        this._dashWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_altDashWidth: function () { return this._altDashWidth; },

    set_altDashWidth: function (v) {
        this._altDashWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_altColor: function () { return this._altColor; },

    set_altColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._altColor.equals(color)) {
            this._altColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    //get class name that contains data for serialization
    _get_dataType: function () { return "DashedLineVObjectData"; },

    draw: function (ctx) {
        /// <summary>Draws this vector line.</summary>
        if (!ctx)
            return;

        var sp = this.get_point0();
        var ep = this.get_point1();
        if (this.get_width() > 0) {
            var width = this.get_width();
            var dashWidth = this.get_dashWidth();
            var altDashWidth = this.get_altDashWidth();
            if (this.get_fixedWidth()) {
                var zoom = this.get_canvas().get_zoom();
                width /= zoom;
                dashWidth /= zoom;
                altDashWidth /= zoom;
            }

            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawDashedLine(ctx, sp.X, sp.Y, ep.X, ep.Y,
				width, this.get_color().Preview, this.get_altColor().Preview, dashWidth, altDashWidth, this.get_opacity());
        }
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var altColorCallback = Function.createDelegate(this, function (color) {
            self.set_altColor(color);
        });

        this._updateColor(this.get_altColor(), altColorCallback);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject);