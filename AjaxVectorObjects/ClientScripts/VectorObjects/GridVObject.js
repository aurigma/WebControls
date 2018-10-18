// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject = function (x, y, cols, rows, stepX, stepY) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a grid.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.initializeBase(this, [x, y, cols * stepX, rows * stepY]);

    this.set_cols(cols);
    this.set_rows(rows);
    this.set_stepX(stepX);
    this.set_stepY(stepY);

    this._horizontalLineColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");
    this._verticalLineColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");

    this.set_lineWidth(1);
    this.set_fixedLineWidth(true);

    this.set_textWrappingMode(Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.prototype = {
    get_locked: function () { return true; },

    get_cols: function () { return this._cols; },

    set_cols: function (v) {
        this._cols = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_rows: function () { return this._rows; },

    set_rows: function (v) {
        this._rows = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_stepX: function () { return this._stepX; },

    set_stepX: function (v) {
        this._stepX = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_stepY: function () { return this._stepY; },

    set_stepY: function (v) {
        this._stepY = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_horizontalLineColor: function () { return this._horizontalLineColor; },

    set_horizontalLineColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._horizontalLineColor.equals(color)) {
            this._horizontalLineColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_verticalLineColor: function () { return this._verticalLineColor; },

    set_verticalLineColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._verticalLineColor.equals(color)) {
            this._verticalLineColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_lineWidth: function () { return this._lineWidth; },

    set_lineWidth: function (v) {
        this._lineWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_fixedLineWidth: function () { return this._fixedLineWidth; },

    set_fixedLineWidth: function (v) {
        this._fixedLineWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    //get class name that contains data for serialization
    _get_dataType: function () { return "GridVObjectData"; },

    draw: function (ctx) {
        /// <summary>Draws this vector line.</summary>
        if (!ctx)
            return;

        ctx.save();
        var rect = this.get_rectangle().get_bounds();
        ctx.translate(rect.Left, rect.Top);

        var gr = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        var c = this.get_canvas();

        var verticalLineColor = this.get_verticalLineColor().Preview;
        var horizontalLineColor = this.get_horizontalLineColor().Preview;

        var lineWidth = this.get_lineWidth();
        if (this.get_fixedLineWidth())
            lineWidth /= c.get_zoom();

        var halfLineWidth = lineWidth / 2;
        var horizontalLineLength = this.get_stepX() * this.get_cols() + halfLineWidth;
        var verticalLineLength = this.get_stepY() * this.get_rows() + halfLineWidth;
        var i, imax;

        for (i = 0, imax = this.get_cols() ; i <= imax; i++) {
            var x = i * this.get_stepX() + halfLineWidth;
            gr.drawLine(ctx, x, 0, x, verticalLineLength, lineWidth, verticalLineColor, this.get_opacity());
        }

        for (i = 0, imax = this.get_rows() ; i <= imax; i++) {
            var y = i * this.get_stepY() + halfLineWidth;
            gr.drawLine(ctx, 0, y, horizontalLineLength, y, lineWidth, horizontalLineColor, this.get_opacity());
        }
        ctx.restore();
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var verticalLineColorCallback = Function.createDelegate(this, function (color) {
            self.set_verticalLineColor(color);
        });

        var horizontalLineColorCallback = Function.createDelegate(this, function (color) {
            self.set_horizontalLineColor(color);
        });

        this._updateColor(this.get_verticalLineColor(), verticalLineColorCallback);
        this._updateColor(this.get_horizontalLineColor(), horizontalLineColorCallback);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject",
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);