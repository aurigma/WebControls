// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF = function (x, y) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> server-side class.</summary>
    /// <remarks><para>This class represents an ordered pair of floating-point x- and y-coordinates that defines a point in a two-dimensional plane and exposes a number of methods to operate with it.</para></remarks>
    /// <param name="x" type="Number" />
    /// <param name="y" type="Number" />
    /// <field name="X" type="Number" integer="true" static="true"><summary>The x-coordinate of this point.</summary></field>
    /// <field name="Y" type="Number" integer="true" static="true"><summary>The y-coordinate of this point.</summary></field>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" />
    /// <constructor>
    /// 	<summary>Creates and initializes an instance of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> class.</summary>
    /// 	<param name="x">The x-coordinate of the point to create.</param>
    /// 	<param name="y">The y-coordinate of the point to create.</param>
    /// </constructor>
    this.X = (x) ? x : 0;
    this.Y = (y) ? y : 0;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.prototype = {
    rotate: function (angle) {
        /// <summary>Rotates a point to the specified angle.</summary>
        /// <param name="angle" type="Number">The angle to rotate point to.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents a rotated point.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.Rotate(System.Single)">PointF.Rotate(Single)</see> server-side member.</para></remarks>
        //        var radianAngle = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertDegreeToRadian(angle);
        //        var newX = this.X * Math.cos(radianAngle) - this.Y * Math.sin(radianAngle);
        //        var newY = this.X * Math.sin(radianAngle) + this.Y * Math.cos(radianAngle);
        //        this.X = newX;
        //        this.Y = newY;
        return this.rotateAt(angle, { X: 0, Y: 0 });
    },

    rotateAt: function (angle, center) {
        if (!center)
            center = { X: 0, Y: 0 };
        var radianAngle = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertDegreeToRadian(angle);
        var newX = Math.cos(radianAngle) * (this.X - center.X) - Math.sin(radianAngle) * (this.Y - center.Y) + center.X;
        var newY = Math.sin(radianAngle) * (this.X - center.X) + Math.cos(radianAngle) * (this.Y - center.Y) + center.Y;
        this.X = newX;
        this.Y = newY;
        return this;
    },

    translate: function (x, y) {
        /// <summary>Translates a point to the specified offset.</summary>
        /// <param name="x" type="Number">The offset in the x-direction.</param>
        /// <param name="y" type="Number">The offset in the y-direction.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents a translated point.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.Translate(System.Single,System.Single)">PointF.Translate(Single, Single)</see> server-side member.</para></remarks>
        this.X = this.X + x;
        this.Y = this.Y + y;
        return this;
    },

    scale: function (scaleX, scaleY) {
        /// <summary>Scales a point to the specified values.</summary>
        /// <param name="scaleX" type="Number">The scale factor in the x-direction.</param>
        /// <param name="scaleY" type="Number">The scale factor in the y-direction.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents a scaled point.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.Scale(System.Single,System.Single)">PointF.Scale(Single, Single)</see> server-side member.</para></remarks>
        this.X = this.X * scaleX;
        this.Y = this.Y * scaleY;
        return this;
    },

    clone: function () {
        /// <summary>Creates a new object that is a copy of the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> instance.</summary>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">A new <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> that is a copy of this instance.</returns>
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.X, this.Y);
    },

    isEqual: function (pt, tolerance) {
        /// <summary>Determines whether the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" />.</summary>
        /// <param name="pt" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to compare with the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" />.</param>
        /// <returns type="Boolean"><strong>true</strong> if <paramref name="pt" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" />; otherwise, <strong>false</strong>.</returns>

        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        return pt != null && m.EqualsOfFloatNumbers(this.X, pt.X, tolerance) && m.EqualsOfFloatNumbers(this.Y, pt.Y, tolerance);
    },

    distance: function (pt) {
        /// <summary>Returns a distance from this point to the specified one.</summary>
        /// <param name="pt" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The destination point.</param>
        /// <returns type="Number">The number which represents a distance between this point and <paramref name="point" />.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.Distance(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF)">PointF.Distance(PointF)</see> server-side member.</para></remarks>
        return Math.sqrt((this.X - pt.X) * (this.X - pt.X) + (this.Y - pt.Y) * (this.Y - pt.Y));
    },

    transform: function (transform, center) {
        if (center == null)
            center = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF();

        this.translate(-center.X, -center.Y);
        this.scale(transform.get_scaleX(), transform.get_scaleY());
        this.rotate(transform.get_angle());
        this.translate(transform.get_translateX(), transform.get_translateY());
        this.translate(center.X, center.Y);

        return this;
    },

    toString: function () {
        var p = [this.X, this.Y];
        return p.join(',');
    },

    round: function () {
        this.X = Math.round(this.X);
        this.Y = Math.round(this.Y);
        return this;
    },

    X: 0,
    Y: 0
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF");