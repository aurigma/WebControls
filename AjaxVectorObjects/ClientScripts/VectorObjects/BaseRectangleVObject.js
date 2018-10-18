// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />
/// <reference path="~/ClientScripts/Math/PointF.js" />
/// <reference path="~/ClientScripts/Math/RectangleF.js" />
/// <reference path="~/ClientScripts/Math/RotatedRectangleF.js" />
/// <reference path="~/ClientScripts/Math/Common.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject = function (left, top, width, height) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This is a base class for all the AJAX vector objects which have bounds.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>

    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.initializeBase(this);

    var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
    var l = (left) ? left : 0;
    var t = (top) ? top : 0;
    var w = (width) ? width : 0;
    var h = (height) ? height : 0;
    this._controlPoints = [new m.PointF(l, t), new m.PointF(l + w, t + h)];

    this._textWrappingMode = Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None;
    this._opacity = 1;

    this._allowNegativeResize = true;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.prototype = {
    _get_boundsMargin: function () {
        return 0;
    },

    _get_controlBounds: function () {
        var maxX = Math.max(this._controlPoints[0].X, this._controlPoints[1].X);
        var maxY = Math.max(this._controlPoints[0].Y, this._controlPoints[1].Y);
        var minX = Math.min(this._controlPoints[0].X, this._controlPoints[1].X);
        var minY = Math.min(this._controlPoints[0].Y, this._controlPoints[1].Y);
        var width = maxX - minX;
        var height = maxY - minY;
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(minX, minY, width, height);
    },

    _get_controlCenter: function () {
        var r = this._get_controlBounds();
        var centerX = r.Left + (r.Width / 2);
        var centerY = r.Top + (r.Height / 2);
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(centerX, centerY);
    },

    get_rectangle: function () {
        /// <summary>Gets or sets a rectangle and its rotation angle.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> value which specifies a rectangle and its rotation angle.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.Rectangle">BaseRectangleVObject.Rectangle</see> server-side member.</para></remarks>
        var rectangle = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.fromRectangleF(this._get_controlBounds());
        rectangle.set_transform(this.get_transform());
        return rectangle;
    },

    set_rectangle: function (rectangle, supressOnChanged) {
        var controlBounds = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.fromRectangleF(this._get_controlBounds());
        var transform = rectangle.get_transform(controlBounds);
        this.set_transform(transform, supressOnChanged);
    },

    get_bounds: function () {
        /// <summary>Gets the size and location of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> taking into account its rotation and margins.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The <see cref="T:System.Drawing.RectangleF" /> which represents the size and location of this <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> taking into account its rotation and margins.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.Bounds">BaseRectangleVObject.Bounds</see> server-side member.</para></remarks>
        var r = this.get_rectangle();
        var margin = this._get_boundsMargin();
        r.Width += r.Width > 0 ? margin : -margin;
        r.Height += r.Height > 0 ? margin : -margin;
        return r.get_bounds();
    },

    get_angle: function () {
        /// <summary>Gets or sets an angle (in degrees) to rotate the rectangle on.</summary>
        /// <value type="Number">The rotation angle.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.Angle">BaseRectangleVObject.Angle</see> server-side member.</para></remarks>
        return this._transform.get_angle();
    },

    set_angle: function (angle) {
        this._transform.set_angle(angle);
        this._setNeedRedrawCanvasFlag();
    },

    get_height: function () {
        /// <summary>Gets or sets the height of this vector rectangle.</summary>
        /// <value type="Number">The height of this vector rectangle.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.Height">RectangleVObject.Height</see> server-side member.</para></remarks>
        return this.get_rectangle().Height;
    },

    set_height: function (height) {
        var r = this.get_rectangle();
        r.Height = height;
        this.set_rectangle(r);
    },

    get_width: function () {
        /// <summary>Gets or sets the width of this vector rectangle.</summary>
        /// <value type="Number">The width of this vector rectangle.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.Width">RectangleVObject.Width</see> server-side member.</para></remarks>
        return this.get_rectangle().Width;
    },

    set_width: function (width) {
        var r = this.get_rectangle();
        r.Width = width;
        this.set_rectangle(r);
    },

    get_location: function () {
        /// <summary>Gets or sets the coordinates of the upper-left corner of this vector rectangle.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> which represents coordinates of the upper-left corner of this vector rectangle.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.Location">RectangleVObject.Location</see> server-side member.</para></remarks>
        return this.get_rectangle().get_location();
    },

    set_location: function (location) {
        var r = this.get_rectangle();
        r.set_location(location);
        this.set_rectangle(r);
    },

    get_opacity: function () {
        return this._opacity;
    },

    set_opacity: function (opacity) {
        opacity = Math.max(0, Math.min(1, opacity));

        if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(opacity, this._opacity)) {
            this._opacity = opacity;
            this._setNeedRedrawCanvasFlag(false);
        }
    },

    get_textWrappingMode: function () {
        return this._textWrappingMode;
    },

    set_textWrappingMode: function (value) {
        if (this._textWrappingMode !== value)
            this._textWrappingMode = value;
    },

    hitTest: function (point) {
        /// <summary>Determines whether the specified point is located inside this vector object.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        return this.get_canvas().hitTestSelection(this.get_selectionRectangle(), point);
    },

    _onResized: function () {
    },

    _transformRectangle: function (startRectangle, endRectangle) {
        //Transform rectangle relatively global start and end rectangles
        if (startRectangle == null || endRectangle == null || this._startRectangle == null)
            return;

        if (this._startRectangle.isEqual(startRectangle)) {
            this.set_rectangle(endRectangle, true);
            return;
        }

        var math = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var rectangle = this._startRectangle.clone();
        var transform = endRectangle.get_transform(startRectangle);
        var angle = transform.get_angle();
        var scaleX = transform.get_scaleX();
        var scaleY = transform.get_scaleY();

        if (!math.EqualsOfFloatNumbers(endRectangle.Angle, 0))
            rectangle.rotateAt(-endRectangle.Angle, startRectangle.get_center());

        if (!math.EqualsOfFloatNumbers(scaleX, 1) || !math.EqualsOfFloatNumbers(scaleY, 1)) {
            //Swap scales if the angle is 90 or 270
            var swapScales = math.EqualsOfFloatNumbers(Math.sin(math.ConvertDegreeToRadian(rectangle.Angle), 1));
            rectangle.Width = rectangle.Width * (swapScales ? scaleY : scaleX);
            rectangle.Height = rectangle.Height * (swapScales ? scaleX : scaleY);
            rectangle.CenterX = endRectangle.CenterX + (rectangle.CenterX - startRectangle.CenterX) * scaleX;
            rectangle.CenterY = endRectangle.CenterY + (rectangle.CenterY - startRectangle.CenterY) * scaleY;
        } else {
            rectangle.CenterX += transform.get_translateX();
            rectangle.CenterY += transform.get_translateY();
        }

        if (!math.EqualsOfFloatNumbers(endRectangle.Angle, 0))
            rectangle.rotateAt(endRectangle.Angle, endRectangle.get_center());

        if (!math.EqualsOfFloatNumbers(angle, 0)) {
            var center = rectangle.get_center();
            center.rotateAt(angle, startRectangle.get_center());

            rectangle.Angle = rectangle.Angle + angle;
            rectangle.set_center(center);
        }

        this.set_rectangle(rectangle, true);
    },

    _startTransform: function () {
        this._startRectangle = this.get_rectangle();
    },

    _endTransform: function (changed) {
        if (changed && this.get_canvas().get_history().get_trackingEnabled() && this._startRectangle != null) {
            var rectangle = this.get_rectangle();
            this.set_rectangle(this._startRectangle, true);
            this.get_canvas().get_history().addVObjectChanged(this, this.get_index(), this.get_layer().get_index());
            this.set_rectangle(rectangle);
        }

        delete this._startRectangle;
    },

    // protected
    _dispatchDoubleClickEvent: function (e) {
        var h = this.get_events().getHandler('dblclick');
        if (h) {
            h(this, e);
        }
    },

    add_doubleClick: function (handler) {
        /// <summary>Fires when v-object double click.</summary>
        this.get_events().addHandler("dblclick", handler);
    },

    remove_doubleClick: function (handler) {
        /// <summary>Removes v-object double click.</summary>
        this.get_events().removeHandler("dblclick", handler);
    },

    get_selectionRectangle: function () {
        var rect = this.get_rectangle();
        var margin = parseInt(this._get_boundsMargin());
        rect.Width += rect.Width > 0 ? margin : -margin;
        rect.Height += rect.Height > 0 ? margin : -margin;
        return rect;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject);