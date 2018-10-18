// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF = function (left, top, width, height) {
    ///	<summary>This client-side class corresponds to the <see cref="T:System.Drawing.RectangleF" /> server-side class and represents a set of four numbers that defines the location and size of a rectangle.</summary>
    /// <seealso cref="T:System.Drawing.RectangleF" />
    /// <param name="left" type="Number" />
    /// <param name="top" type="Number" />
    /// <param name="width" type="Number" />
    /// <param name="height" type="Number" />
    /// <field name="Left" type="Number" integer="true" static="true"><summary>The x-coordinate of the left edge of this rectangle.</summary></field>
    /// <field name="Top" type="Number" integer="true" static="true"><summary>The y-coordinate of the top edge of this rectangle.</summary></field>
    /// <field name="Width" type="Number" integer="true" static="true"><summary>The width of this rectangle.</summary></field>
    /// <field name="Height" type="Number" integer="true" static="true"><summary>The height of this rectangle.</summary></field>
    /// <constructor>
    /// 	<summary>Creates and initializes an instance of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF" /> class.</summary>
    /// 	<param name="left">The x-coordinate of the left edge of the rectangle to create.</param>
    /// 	<param name="top">The y-coordinate of the left edge of the rectangle to create.</param>
    /// 	<param name="width">The width of the rectangle to create.</param>
    /// 	<param name="height">The height of the rectangle to create.</param>
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.initializeBase(this);
    this.Left = typeof left == "number" ? left : 0;
    this.Top = typeof top == "number" ? top : 0;
    this.Width = (typeof width == "number") ? width : 2;
    this.Height = (typeof height == "number") ? height : 2;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.FromLTRB = function (left, top, right, bottom) {
    var width = right - left;
    var height = bottom - top;

    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(left, top, width, height);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.FromObject = function (object /* { Left: number, Top: number, Width: number, Height: number } */) {
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(object.Left, object.Top, object.Width, object.Height);
};

/**
 * Creates a rectangle that represents the intersetion between a and b.
 * If there is no intersection, empty rectangle is returned.
 */
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.intersect = function (a, b) {
    var RectangleF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF;

    var maxLeft = Math.max(a.Left, b.Left);
    var minRight = Math.min(a.Right, b.Right);
    var maxTop = Math.max(a.Top, b.Top);
    var minBottom = Math.min(a.Bottom, b.Bottom);

    if (minRight >= maxLeft && minBottom >= maxTop)
        return new RectangleF(maxLeft, maxTop, minRight - maxLeft, minBottom - maxTop);

    return RectangleF.empty;
};

Object.defineProperty(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF, "empty", {
    get: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(0, 0, -1, -1);
    },
    enumerable: true,
    configurable: true
});

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.prototype = {
    contains: function (point, includeBorder, tolerance) {
        if (includeBorder) {
            if (typeof tolerance != "number")
                tolerance = 0.0001;

            var math = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
            var left = this.Left, top = this.Top, right = this.Left + this.Width, bottom = this.Top + this.Height;

            return (point.X > left || math.EqualsOfFloatNumbers(point.X, left, tolerance)) &&
				(point.Y > top || math.EqualsOfFloatNumbers(point.Y, top, tolerance)) &&
				(point.X < right || math.EqualsOfFloatNumbers(point.X, right, tolerance)) &&
				(point.Y < bottom || math.EqualsOfFloatNumbers(point.Y, bottom, tolerance));
        } else {
            return point.X > this.Left &&
				point.Y > this.Top &&
				point.X < this.Left + this.Width &&
				point.Y < this.Top + this.Height;
        }
    },

    containsRectangle: function (rectangle) {
        var leftTop = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(rectangle.Left, rectangle.Top);
        var rightBottom = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(rectangle.Right, rectangle.Bottom);

        return this.contains(leftTop, true) && this.contains(rightBottom, true);
    },

    isEmpty: function () {
        return (this.Width <= 0) || (this.Height <= 0);
    },

    /**
     * Determines if this rectangle intersects with rect
     * @param {RectangleF} rect The RectangleF instance to test
     * @returns {boolean} true if there is any intersection, otherwise false
     */
    intersectsWith: function (rect) {
        return (rect.Left < this.Right) &&
            (this.Left < rect.Right) &&
            (rect.Top < this.Bottom) &&
            (this.Top < rect.Bottom);
    },

    Left: 0,
    Top: 0,
    Width: 2,
    Height: 2
}

Object.defineProperties(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.prototype, {
    Right: {
        get: function () {
            return this.Left + this.Width;
        },
        enumerable: true,
        configurable: true
    },
    Bottom: {
        get: function () {
            return this.Top + this.Height;
        },
        enumerable: true,
        configurable: true
    }
});

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF");