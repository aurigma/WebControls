// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF = function (centerX, centerY, width, height, angle) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> server-side class.</summary>
    /// <remarks><para>This class represents a set of floating-point numbers that define the location, size, rotation angle and center of a rectangle and exposes a number of methods to operate with it.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />
    /// <param name="centerX" type="Number" />
    /// <param name="centerY" type="Number" />
    /// <param name="width" type="Number" />
    /// <param name="height" type="Number" />
    /// <param name="angle" type="Number" />
    /// <field name="CenterX" type="Number" integer="true" static="true"><summary>The x-coordinate of the rotation center of this rectangle.</summary></field>
    /// <field name="CenterY" type="Number" integer="true" static="true"><summary>The y-coordinate of the rotation center of this rectangle.</summary></field>
    /// <field name="Width" type="Number" integer="true" static="true"><summary>The width of this rectangle.</summary></field>
    /// <field name="Height" type="Number" integer="true" static="true"><summary>The height of this rectangle.</summary></field>
    /// <field name="Angle" type="Number" integer="true" static="true"><summary>The rotation angle of this rectangle.</summary></field>
    /// <constructor>
    /// 	<summary>Creates and initializes an instance of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF" /> class.</summary>
    /// 	<param name="centerX">The x-coordinate of the rotation center of the rectangle to create.</param>
    /// 	<param name="centerY">The y-coordinate of the rotation center of the rectangle to create.</param>
    /// 	<param name="width">The width of the rectangle to create.</param>
    /// 	<param name="height">The height of the rectangle to create.</param>
    /// 	<param name="angle">The rotation angle of the rectangle to create.</param>
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.initializeBase(this);

    this.CenterX = (centerX) ? centerX : 0;
    this.CenterY = (centerY) ? centerY : 0;
    this.Width = (width || width === 0) ? width : 2;
    this.Height = (height || height === 0) ? height : 2;
    this.Angle = (angle) ? angle : 0;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.prototype = {
    clone: function () {
        /// <summary>Creates a new object that is a copy of the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> instance.</summary>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF">A new <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> that is a copy of this instance.</returns>
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(this.CenterX, this.CenterY, this.Width, this.Height, this.Angle);
    },

    get_bounds: function () {
        /// <summary>Gets the bounds of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> taking into account its rotation.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The rectangle circumscribed about this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.Bounds">RotatedRectangleF.Bounds</see> server-side member.</para></remarks>
        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var center = new m.PointF(this.CenterX, this.CenterY);
        var w = this.Width;
        var h = this.Height;
        var points = [
			new m.PointF(-w / 2, -h / 2),
			new m.PointF(-w / 2, h / 2),
			new m.PointF(w / 2, -h / 2),
			new m.PointF(w / 2, h / 2)
        ];
        var minx = 0, miny = 0, maxx = 0, maxy = 0;
        for (var i = 0; i < 4; i++) {
            points[i].rotate(this.Angle);
            if (points[i].X < minx || i === 0)
                minx = points[i].X;
            if (points[i].Y < miny || i === 0)
                miny = points[i].Y;
            if (points[i].X > maxx || i === 0)
                maxx = points[i].X;
            if (points[i].Y > maxy || i === 0)
                maxy = points[i].Y;
        }
        return new m.RectangleF(minx + center.X, miny + center.Y, maxx - minx, maxy - miny);
    },

    isEqual: function (rect, tolerance) {
        /// <summary>Determines whether the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</summary>
        /// <param name="rect" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF">The rotated rectangle to compare with the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</param>
        /// <returns type="Boolean"><strong>true</strong> if <paramref name="rect" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />; otherwise, <strong>false</strong>.</returns>

        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        return rect != null && m.EqualsOfFloatNumbers(this.CenterX, rect.CenterX, tolerance) && m.EqualsOfFloatNumbers(this.CenterY, rect.CenterY, tolerance) &&
            m.EqualsOfFloatNumbers(this.Width, rect.Width, tolerance) && m.EqualsOfFloatNumbers(this.Height, rect.Height, tolerance) &&
            m.EqualsOfFloatNumbers(this.Angle, rect.Angle, tolerance);
    },

    _getUpperLeftCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(-this.Width / 2, -this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _getUpperRightCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.Width / 2, -this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _getBottomRightCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.Width / 2, this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _getBottomLeftCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(-this.Width / 2, this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _checkProjectionIntersection: function (points0, points1) {
        var p0 = this._getProjections(points0);
        var p1 = this._getProjections(points1);

        return p0.left <= p1.right && p0.right >= p1.left && p0.top <= p1.bottom && p0.bottom >= p1.top;
    },

    _getProjections: function (points) {
        var x0 = x1 = points[0].X;
        var y0 = y1 = points[0].Y;

        for (var i = 1; i < points.length; i++) {
            x0 = Math.min(x0, points[i].X);
            x1 = Math.max(x1, points[i].X);
            y0 = Math.min(y0, points[i].Y);
            y1 = Math.max(y1, points[i].Y);
        }

        return { left: x0, right: x1, top: y0, bottom: y1 };
    },

    intersectsWith: function (rect) {
        var thisRect = this.clone();
        var otherRect = rect.clone();

        if (this.Angle != 0) {
            var angle = thisRect.Angle;
            thisRect.Angle = 0;

            var center = otherRect.get_center();
            center.rotateAt(-angle, thisRect.get_center());
            otherRect.set_center(center);
            otherRect.Angle -= angle;
        }

        var thisEdges = [thisRect._getUpperLeftCorner(), thisRect._getUpperRightCorner(), thisRect._getBottomRightCorner(), thisRect._getBottomLeftCorner()];
        var otherEdges = [otherRect._getUpperLeftCorner(), otherRect._getUpperRightCorner(), otherRect._getBottomRightCorner(), otherRect._getBottomLeftCorner()];

        var firstProjectionIntersection = this._checkProjectionIntersection(thisEdges, otherEdges);

        var secondProjectionIntersection = true;
        if (firstProjectionIntersection && this.Angle != rect.Angle) {
            thisRect = this.clone();
            otherRect = rect.clone();

            var angle = otherRect.Angle;
            otherRect.Angle = 0;

            var center = thisRect.get_center();
            center.rotateAt(-angle, otherRect.get_center());
            thisRect.set_center(center);
            thisRect.Angle -= angle;

            thisEdges = [thisRect._getUpperLeftCorner(), thisRect._getUpperRightCorner(), thisRect._getBottomRightCorner(), thisRect._getBottomLeftCorner()];
            otherEdges = [otherRect._getUpperLeftCorner(), otherRect._getUpperRightCorner(), otherRect._getBottomRightCorner(), otherRect._getBottomLeftCorner()];

            secondProjectionIntersection = this._checkProjectionIntersection(thisEdges, otherEdges);
        }

        return firstProjectionIntersection && secondProjectionIntersection;
    },

    get_location: function () {
        /// <summary>Gets or sets the coordinates of the upper-left corner of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The value which represents the upper-left corner of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.Location">RotatedRectangleF.Location</see> server-side member.</para></remarks>
        return this._getUpperLeftCorner();
    },

    set_location: function (location) {
        var p = this._getUpperLeftCorner();
        this.CenterX = this.CenterX + (location.X - p.X);
        this.CenterY = this.CenterY + (location.Y - p.Y);
    },

    get_center: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.CenterX, this.CenterY);
    },

    set_center: function (center) {
        this.CenterX = center.X;
        this.CenterY = center.Y;
    },

    rotateAt: function (angle, center) {
        var rectCenter = this.get_center();
        rectCenter.rotateAt(angle, center);
        this.set_center(rectCenter);
        this.Angle += angle;
    },

    set_transform: function (transform) {
        if (transform == null || transform.isEqual(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform()))
            return;

        this.Width *= transform.get_scaleX();
        this.Height *= transform.get_scaleY();
        this.Angle += transform.get_angle();
        this.CenterX += transform.get_translateX();
        this.CenterY += transform.get_translateY();
    },

    get_transform: function (rectangle) {
        if (rectangle == null || this.isEqual(rectangle))
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform();

        var scaleX = rectangle.Width === 0 ? 0 : this.Width / rectangle.Width;
        var scaleY = rectangle.Height === 0 ? 0 : this.Height / rectangle.Height;
        var angle = this.Angle - rectangle.Angle;
        var center = rectangle.get_center();
        var translateX = this.CenterX - center.X;
        var translateY = this.CenterY - center.Y;

        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(scaleX, scaleY, translateX, translateY, angle);
    },

    toString: function () {
        var r = [this.CenterX, this.CenterY, this.Width, this.Height, this.Angle];
        return r.join(',');
    },

    toRectangleF: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(this.CenterX - this.Width / 2, this.CenterY - this.Height / 2, this.Width, this.Height);
    },

    CenterX: 0,
    CenterY: 0,
    Width: 2,
    Height: 2,
    Angle: 0
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.fromRectangleF = function (rectangle) {
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(
        rectangle.Left + rectangle.Width / 2, rectangle.Top + rectangle.Height / 2, rectangle.Width, rectangle.Height, 0);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.FromLTRB = function (left, top, right, bottom) {
    return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.fromRectangleF(
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.FromLTRB(left, top, right, bottom));
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF");