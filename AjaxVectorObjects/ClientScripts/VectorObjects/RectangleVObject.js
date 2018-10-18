// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />
/// <reference path="~/ClientScripts/Math/PointF.js" />
/// <reference path="~/ClientScripts/Math/RectangleF.js" />
/// <reference path="~/ClientScripts/Math/RotatedRectangleF.js" />
/// <reference path="~/ClientScripts/Math/Common.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject = function (left, top, width, height) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector rectangle.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

    if (left != null && top != null && width != null && height != null) {
        ns.RectangleVObject.initializeBase(this, [ns.Math.Path.rectangle(left, top, width, height)]);
        this._controlPoints = [new ns.Math.PointF(left, top), new ns.Math.PointF(left + width, top + height)];
    }
    else
        ns.RectangleVObject.initializeBase(this);

    this._allowNegativeResize = true;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.prototype = {
    get_rectangle: function () {
        /// <summary>Gets a rectangle and its rotation angle corresponded to this image vector object.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> value which specifies a rectangle and its rotation angle.</value>
        var r = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.callBaseMethod(this, 'get_rectangle');
        if (r.Width < 0) r.Width = -r.Width;
        if (r.Height < 0) r.Height = -r.Height;
        return r;
    }
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject);