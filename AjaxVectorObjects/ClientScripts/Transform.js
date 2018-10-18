// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform = function (scaleX, scaleY, translateX, translateY, angle) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class exposes properties which configure v-object transformation.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.initializeBase(this);
    this._angle = (angle) ? angle : 0;
    this._scaleX = (scaleX || scaleX === 0) ? scaleX : 1;
    this._scaleY = (scaleY || scaleX === 0) ? scaleY : 1;
    this._translateX = (translateX) ? translateX : 0;
    this._translateY = (translateY) ? translateY : 0;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.prototype = {
    add_transformChanged: function (handler) {
        /// <summary>Raised when the transform is modified.</summary>
        /// <remarks><para>This event corresponds to <see cref="E:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.TransformChanged">Transform.TransformChanged</see> server-side member.</para></remarks>
        this.get_events().addHandler("transformChanged", handler);
    },

    remove_transformChanged: function (handler) { this.get_events().removeHandler("transformChanged", handler); },

    _onTransformChanged: function () {
        var handler = this.get_events().getHandler("transformChanged");
        if (handler) {
            handler(this);
        }
    },

    _setProperty: function (propName, value, supressOnChanged) {
        var fieldName = "_" + propName;
        if (this[fieldName] !== value) {
            this[fieldName] = value;
            if (!supressOnChanged)
                this._onTransformChanged();
        }
    },

    get_angle: function () {
        /// <summary>Gets or sets a rotation angle (in degrees).</summary>
        /// <value type="Number">The rotation angle.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.Angle">Transform.Angle</see> server-side member.</para></remarks>
        return this._angle;
    },

    set_angle: function (v, supressOnChanged) { this._setProperty("angle", v, supressOnChanged); },

    get_scaleX: function () {
        /// <summary>Gets or sets a scale factor in the x-direction.</summary>
        /// <value type="Number">The scale factor in the x-direction.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.ScaleX">Transform.ScaleX</see> server-side member.</para></remarks>
        return this._scaleX;
    },

    set_scaleX: function (v, supressOnChanged) { this._setProperty("scaleX", v, supressOnChanged); },

    get_scaleY: function () {
        /// <summary>Gets or sets a scale factor in the y-direction.</summary>
        /// <value type="Number">The scale factor in the y-direction.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.ScaleY">Transform.ScaleY</see> server-side member.</para></remarks>
        return this._scaleY;
    },

    set_scaleY: function (v, supressOnChanged) { this._setProperty("scaleY", v, supressOnChanged); },

    get_translateX: function () {
        /// <summary>Gets or sets a distance to translate along the x-axis.</summary>
        /// <value type="Number">The distance to translate along the x-axis.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.TranslateX">Transform.TranslateX</see> server-side member.</para></remarks>
        return this._translateX;
    },

    set_translateX: function (v, supressOnChanged) { this._setProperty("translateX", v, supressOnChanged); },

    get_translateY: function () {
        /// <summary>Gets or sets a distance to translate along the y-axis.</summary>
        /// <value type="Number">The distance to translate along the y-axis.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.TranslateY">Transform.TranslateY</see> server-side member.</para></remarks>
        return this._translateY;
    },

    set_translateY: function (v, supressOnChanged) { this._setProperty("translateY", v, supressOnChanged); },

    move: function (x, y) {
        var t = this.clone();
        if (x != null)
            this.set_translateX(this.get_translateX() + x, true);

        if (y != null)
            this.set_translateY(this.get_translateY() + y, true);

        if (!t.isEqual(this))
            this._onTransformChanged();
    },

    rotate: function (angle) {
        if (angle == null || Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(angle, 0))
            return;

        this._angle += angle;
        this._onTransformChanged();
    },

    clone: function () { /// <summary>Creates a full copy of this transform.</summary>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> which contains a full copy of the current transform.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.Clone">Transform.Clone()</see> server-side member.</para></remarks>
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(this._scaleX, this._scaleY, this._translateX, this._translateY, this._angle);
    },

    isEqual: function (transform, tolerance) { /// <summary>Determines whether the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" />.</summary>
        /// <param name="transform" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> to compare with the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" />.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" />; otherwise, <strong>false</strong>.</returns>

        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        return transform != null && m.EqualsOfFloatNumbers(this._scaleX, transform._scaleX, tolerance) && m.EqualsOfFloatNumbers(this._scaleY, transform._scaleY, tolerance) &&
            m.EqualsOfFloatNumbers(this._translateX, transform._translateX, tolerance) && m.EqualsOfFloatNumbers(this._translateY, transform._translateY, tolerance) &&
            m.EqualsOfFloatNumbers(this._angle, transform._angle, tolerance);
    },

    toMatrix: function () {
        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var angle = this.get_angle();
        var sin = Math.sin(m.ConvertDegreeToRadian(angle));
        var cos = Math.cos(m.ConvertDegreeToRadian(angle));

        return new m.Matrix(cos * this.get_scaleX(), sin * this.get_scaleX(), -sin * this.get_scaleY(), cos * this.get_scaleY(), this.get_translateX(), this.get_translateY());
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform", Sys.Component);