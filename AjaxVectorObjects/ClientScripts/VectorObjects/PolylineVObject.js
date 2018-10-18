// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject = function (points) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector polyline.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.initializeBase(this, []);

    this._width = 20;
    this._color = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(255,255,61,1)");

    this._controlPoints = [];
    if (points && points.length && points.length > 0) {
        for (var i = 0; i < points.length; i++) {
            if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.isInstanceOfType(points[i]))
                this._controlPoints.push(points[i]);
        }
    }

    this.set_textWrappingMode(Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.prototype = {
    _get_boundsMargin: function () {
        return this._width;
    },

    get_width: function () {
        /// <summary>Get or sets width of this vector polyline (in points).</summary>
        /// <value type="Number">The width of this vector polyline (in points).</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.Width">PolylineVObject.Width</see> server-side member.</para></remarks>

        return this._width;
    },

    set_width: function (v) {
        this._width = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_color: function () {
        /// <summary>Gets or sets a color of this vector polyline.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of this vector polyline.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.Color">PolylineVObject.Color</see> server-side member.</para></remarks>
        return this._color;
    },

    set_color: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._color.equals(color)) {
            this._color = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PolylineVObjectData";
    },

    // add point, and try to smooth
    //add pointd while interactive drawing
    _addPoint: function (pt) {
        var c = this.get_canvas();
        var mul = -1;
        if (c) {
            mul = (c.get_screenXDpi() / 72) * c.get_zoom();
        }
        var d = 30;
        var pts = this.get_controlPoints();
        if (pts.length > 0) {
            var dist = pts[pts.length - 1].distance(pt);
            if (mul === -1 || dist * mul > d) {
                pts.push(pt);
            }
        }
        else {
            pts.push(pt);
        }
    },

    addPoint: function (point) {
        /// <summary>Adds the specified point to the end of the points array.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to add.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.AddPoint(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF)">PolylineVObject.AddPoint(PointF)</see> server-side member.</para></remarks>
        this.insertPoint(point, this._controlPoints.length);
    },

    insertPoint: function (point, index) {
        /// <summary>Inserts the point into the specified position.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to insert.</param>
        /// <param name="index" type="Number">The position to insert.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.InsertPoint(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF,System.Int32)">PolylineVObject.InsertPoint(PointF, Int32)</see> server-side member.</para></remarks>
        if (index < 0 || index > this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.insertPointOutOfRange);

        var actualPoints = this.getPoints();
        Array.insert(actualPoints, index, point);
        //change original points to actual points and reset transform
        this._controlPoints = actualPoints;
        this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform());
    },

    setPoint: function (point, index) {
        /// <summary>Sets a point to the specified position.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to set.</param>
        /// <param name="index" type="Number">The position to set point to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.SetPoint(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF,System.Int32)">PolylineVObject.SetPoint(PointF, Int32)</see> server-side member.</para></remarks>
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        if (index < 0 || index >= this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.setPointOutOfRange);

        var actualPoints = this.getPoints();
        actualPoints[index] = point;
        this._controlPoints = actualPoints;
        this.set_transform(new ns.Transform());
        this.raiseChanged();
    },

    getPoints: function () {
        /// <summary>Returns an array of points this polyline is constructed from.</summary>
        /// <returns type="Array">The array of points which are nodes of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" />.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.GetPoints">PolylineVObject.GetPoints</see> server-side member.</para></remarks>
        var arr = [];
        var center = this._get_controlCenter();
        for (var i = 0; i < this._controlPoints.length; i++)
            arr.push(this._getActualPointFromControlPoint(this._controlPoints[i], center));
        return arr;
    },

    getPointsCount: function () {
        /// <summary>Gets the number of points this polyline is constructed from.</summary>
        /// <returns type="Number">The number of points this polyline is constructed from.</returns>
        /// <remarks><para>This method corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.PointsCount">PolylineVObject.PointsCount</see> server-side member.</para></remarks>
        return this._controlPoints.length;
    },

    getPoint: function (index) {
        /// <summary>Returns a point with the specified index.</summary>
        /// <param name="index" type="Number">The index of the point.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> that matches the specified index.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.GetPoint(System.Int32)">PolylineVObject.GetPoint(Int32)</see> server-side member.</para></remarks>
        if (index < 0 || index >= this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.setPointOutOfRange);

        var p = this._getActualPointFromControlPoint(this._controlPoints[index], this._get_controlCenter());
        return p;
    },

    removePoint: function (index) {
        /// <summary>Removes point with the specified index.</summary>
        /// <param name="index" type="Number">The index of the point to remove.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.RemovePoint(System.Int32)">PolylineVObject.RemovePoint(Int32)</see> server-side member.</para></remarks>
        if (index < 0 || index >= this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.removePointOutOfRange);

        Array.removeAt(this._controlPoints, index);
    },

    _getActualPointFromControlPoint: function (point, center) {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(point.X, point.Y);
        p.translate(-center.X, -center.Y);
        var transform = this.get_transform();
        p.scale(transform.get_scaleX(), transform.get_scaleY());
        p.rotate(transform.get_angle());
        p.translate(transform.get_translateX(), transform.get_translateY());
        p.translate(center.X, center.Y);
        return p;
    },

    get_actualPoints: function () {
        /// <summary>Gets an array points this polyline is constructed from.</summary>
        /// <value type="Array">An array of points.</value>
        var pts = [];
        var cnt = this._controlPoints.length;
        //calc center point once and use it in loop
        var center = this._get_controlCenter();
        for (var i = 0; i < cnt; i++) {
            pts.push(this._getActualPointFromControlPoint(this._controlPoints[i], center));
        }
        delete this._center;
        return pts;
    },

    _get_controlBounds: function () {
        var minx = 0;
        var miny = 0;
        var maxx = 0;
        var maxy = 0;
        var pts = this.get_controlPoints();
        var len = pts.length;
        if (len > 0) {
            minx = pts[0].X;
            maxx = pts[0].X;
            miny = pts[0].Y;
            maxy = pts[0].Y;
        }
        for (var i = 1; i < len; i++) {
            minx = Math.min(pts[i].X, minx);
            maxx = Math.max(pts[i].X, maxx);
            miny = Math.min(pts[i].Y, miny);
            maxy = Math.max(pts[i].Y, maxy);
        }
        var width = maxx - minx;
        var height = maxy - miny;
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(minx, miny, width, height);
    },

    draw: function (ctx) {
        /// <summary>Draws this vector polyline.</summary>
        if (!ctx)
            return;

        if (this.get_width() > 0) {
            var pts = this.get_actualPoints();
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPolyline(ctx, pts, this.get_width(), this.get_color().Preview, this.get_opacity());
        }
    },

    // p - test point.
    _belongToLine: function (p, tolerance) {
        var pts = this.get_actualPoints();
        var res = false;
        var eps = this._width / 2 + tolerance;
        var squareEps = eps * eps;
        //check if point belongs to any of segments
        for (var i = 1; i < pts.length; i++) {
            var squareDist = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToSegment(p, pts[i - 1], pts[i]);
            if (squareDist <= squareEps) {
                res = true;
                // is true, so doesn't need to continue
                break;
            }
        }
        return res;
    },

    hitTest: function (point, isSelected) {
        /// <summary>Determines whether the specified point belongs to this vector polyline.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point belongs to this vector polyline; otherwise <strong>false</strong>.</returns>
        var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.callBaseMethod(this, 'hitTest', [point.clone()]);

        var c = this.get_canvas();
        // for tolerance in selection.
        var mul = c.get_zoom() * c.get_screenXDpi() / 72;
        var rectFrame = this.get_rectangle();
        var isBelongRect = isSelected ? rectFrame.toRectangleF().contains(point) : false;
        var isBelongPoliLine = this._belongToLine(point, 2 / mul);
        result.body = isBelongRect || isBelongPoliLine;

        return result;
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var colorCallback = Function.createDelegate(this, function (color) {
            self.set_color(color);
        });

        this._updateColor(this.get_color(), colorCallback);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);