// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject = function (x1, y1, x2, y2) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector line.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.initializeBase(this, []);

    this._width = 4;
    this._color = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");
    this._fixedWidth = false;
    var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;

    this._controlPoints = [
		new m.PointF(((x1) ? x1 : 0), ((y1) ? y1 : 0)),
		new m.PointF(((x2) ? x2 : 0), ((y2) ? y2 : 0))];

    this.set_textWrappingMode(Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.prototype = {
    get_width: function () { /// <summary>Get or sets width of this vector line (in points).</summary>
        /// <value type="Number">The width of this vector line (in points).</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Width">LineVObject.Width</see> server-side member.</para></remarks>
        return this._width;
    },

    set_width: function (v) {
        this._width = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_color: function () { /// <summary>Gets or sets a color of this vector line.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of this vector line.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Color">LineVObject.Color</see> server-side member.</para></remarks>
        return this._color;
    },

    set_color: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._color.equals(color)) {
            this._color = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_fixedWidth: function () { return this._fixedWidth; },

    set_fixedWidth: function (v) {
        this._fixedWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_point0: function () { /// <summary>Gets or sets the start point of this vector line.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents the start point.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Point0">LineVObject.Point0</see> server-side member.</para></remarks>
        return this._getActualPoint(this._controlPoints[0]);
    },

    set_point0: function (point) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var bounds = this._get_controlBounds();
        if (bounds.Width === 0 || bounds.Height === 0) {
            var p1 = this._getActualPoint(this._controlPoints[1]);
            this._controlPoints = [point.clone(), p1];
            this.set_transform(new ns.Transform());
        } else {
            this._setTransformByPoints(this._controlPoints[0], point, this._controlPoints[1]);
        }
    },

    get_point1: function () { /// <summary>Gets or sets the end point of this vector line.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents the end point.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Point1">LineVObject.Point1</see> server-side member.</para></remarks>
        return this._getActualPoint(this._controlPoints[1]);
    },

    set_point1: function (point) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var bounds = this._get_controlBounds();
        if (bounds.Width === 0 || bounds.Height === 0) {
            var p0 = this._getActualPoint(this._controlPoints[0]);
            this._controlPoints = [p0, point.clone()];
            this.set_transform(new ns.Transform());
        } else {
            this._setTransformByPoints(this._controlPoints[1], point, this._controlPoints[0]);
        }
    },

    _getActualPoint: function (controlPoint) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var p = new ns.PointF(controlPoint.X, controlPoint.Y);
        var center = this._get_controlCenter();
        p.translate(-center.X, -center.Y);
        var transform = this.get_transform();
        p.scale(transform.get_scaleX(), transform.get_scaleY());
        p.rotate(transform.get_angle());
        p.translate(transform.get_translateX(), transform.get_translateY());
        p.translate(center.X, center.Y);
        return p;
    },

    get_bounds: function () {
        /// <summary>Gets the size and location of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> taking into account its rotation and margins.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The <see cref="T:System.Drawing.RectangleF" /> which represents the size and location of this <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> taking into account its rotation and margins.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.Bounds">BaseRectangleVObject.Bounds</see> server-side member.</para></remarks>
        var p1 = this.get_point0();
        var p2 = this.get_point1();
        var x = Math.min(p1.X, p2.X);
        var w = Math.max(p1.X, p2.X) - x;
        var y = Math.min(p1.Y, p2.Y);
        var h = Math.max(p1.Y, p2.Y) - y;

        var len = Math.sqrt(w * w + h * h);
        var dw = this.get_width() * h / len;
        var dh = this.get_width() * w / len;

        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(x - dw / 2, y - dh / 2, w + dw, h + dh);
    },

    _get_boundsMargin: function () { return this._width; },

    _setTransformByPoints: function (controlPoint1, actualPoint1, controlPoint2) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var controlCenter = this._get_controlCenter();

        var actualPoint2 = this._getActualPoint(controlPoint2);

        var newCenter = new ns.Math.PointF((actualPoint2.X + actualPoint1.X) / 2,
			(actualPoint2.Y + actualPoint1.Y) / 2);

        var translateX = newCenter.X - controlCenter.X;
        var translateY = newCenter.Y - controlCenter.Y;

        var p1 = new ns.Math.PointF(controlPoint1.X, controlPoint1.Y).translate(-controlCenter.X, -controlCenter.Y);
        var p2 = new ns.Math.PointF(actualPoint1.X, actualPoint1.Y).translate(-translateX, -translateY).translate(-controlCenter.X, -controlCenter.Y);

        var cosAngle = (p1.X * p2.X + p1.Y * p2.Y) / Math.sqrt((p1.X * p1.X + p1.Y * p1.Y) * (p2.X * p2.X + p2.Y * p2.Y));
        cosAngle = ns.Math.Clamp(-1, cosAngle, 1);
        var angle = ns.Math.ConvertRadianToDegree(Math.acos(cosAngle));
        p2 = p2.rotate(-angle);
        this.set_transform(new ns.Transform(p2.X / p1.X, p2.Y / p1.Y, translateX, translateY, angle));
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "LineVObjectData";
    },

    draw: function (ctx) {
        /// <summary>Draws this vector line.</summary>
        if (!ctx)
            return;

        var sp = this.get_point0();
        var ep = this.get_point1();
        if (this.get_width() > 0) {
            var width = this.get_width();
            if (this.get_fixedWidth())
                width /= this.get_canvas().get_zoom();

            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawLine(
                ctx, sp.X, sp.Y, ep.X, ep.Y, width, this.get_color().Preview, this.get_opacity());
        }
    },

    // p1-p2 - piece of line.
    // p3 - test point.
    _belongToPiece: function (p1, p2, p3, width, tolerance) {
        var squareDist = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToSegment(p3, p1, p2);
        var eps = width / 2 + tolerance;
        if (squareDist <= eps * eps)
            return true;
        else
            return false;
    },

    hitTest: function (point, isSelected) {
        /// <summary>Determines whether the specified point belongs to this vector line.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point belongs to this vector line; otherwise <strong>false</strong>.</returns>
        var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.callBaseMethod(this, 'hitTest', [point.clone()]);
        var p = point.clone();
        var c = this.get_canvas();

        // for tolerance in selection.
        var mul = c.get_zoom() * c.get_screenXDpi() / 72;
        var rectFrame = this.get_rectangle();
        var isBelongRect = isSelected ? rectFrame.toRectangleF().contains(point) : false;
        var isBelongPiece = this._belongToPiece(this.get_point0(), this.get_point1(), p, this.get_width(), 2 / mul);

        result.body = isBelongRect || isBelongPiece ? true : false;

        return result;
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var colorCallback = Function.createDelegate(this, function (color) {
            self.set_color(color);
        });

        this._updateColor(this.get_color(), colorCallback);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);