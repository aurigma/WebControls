// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject = function (left, top, width, height) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector ellipse.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

    if (left != null && top != null && width != null && height != null) {
        ns.EllipseVObject.initializeBase(this, [ns.Math.Path.ellipse(left, top, width, height)]);
        this._controlPoints = [new ns.Math.PointF(left, top), new ns.Math.PointF(left + width, top + height)];
    }
    else
        ns.EllipseVObject.initializeBase(this);

    this._allowNegativeResize = true;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject.prototype = {
    hitTest: function (point, isSelected) {
        /// <summary>Determines whether the specified point is located inside this vector ellipse.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point is located inside this vector object; otherwise <strong>false</strong>.</returns>
        var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject.callBaseMethod(this, 'hitTest', [point.clone()]);
        var r = this.get_rectangle();

        var p = point.clone();
        p.translate(-r.CenterX, -r.CenterY);
        p.rotate(-r.Angle);
        p.scale(2 / r.Width, 2 / r.Height);
        var isBelongToEllipse = (p.X * p.X + p.Y * p.Y < 1);
        var isBelongRect = isSelected ? r.toRectangleF().contains(point) : false;
        result.body = isBelongToEllipse || isBelongRect;

        return result;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject);