// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject = function (text, path, fontName, fontSize) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector text block.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

    ns.CurvedTextVObject.initializeBase(this, [text, null, fontName, fontSize]);

    this._textPath = path != null ? path : new ns.Math.Path("");
    this._actualAngle = 0;

    this._fitToPath = false;
    this._stretch = false;
    this._originalFontSize = 0;
    this._fitToPathStep = 1;
    this._pathStart = 0;
    this._pathEnd = 1;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject.prototype = {
    get_textPath: function () {
        var center = this._get_controlCenter();
        var path = this._textPath.clone();
        var transform = this.get_transform().clone();
        transform.rotate(-this.get_actualAngle());

        path.transform(transform, center);

        return path;
    },

    set_textPath: function (v) {
        if (this.get_textPath().isEqual(v))
            return;

        var beforeUpdate = function () {
            this.set_originalTextPath(v);
            this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform());
        }.bind(this);

        this.update(beforeUpdate);
    },
    get_pathStart: function () {
        return this._pathStart;
    },
    set_pathStart: function (v) {
        if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(this._pathStart, v))
            return;

        var beforeUpdate = function () {
            this._pathStart = v;
        }.bind(this);

        this.update(beforeUpdate);
    },
    get_pathEnd: function () {
        return this._pathEnd;
    },
    set_pathEnd: function (v) {
        if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(this._pathEnd, v))
            return;

        var beforeUpdate = function () {
            this._pathEnd = v;
        }.bind(this);

        this.update(beforeUpdate);
    },

    get_originalTextPath: function () {
        return this._textPath;
    },

    set_originalTextPath: function (path) {
        this._textPath = path;
    },

    get_actualAngle: function () {
        return this._actualAngle;
    },

    set_actualAngle: function (v) {
        this._actualAngle = v;
    },

    get_fitToPath: function () {
        return this._fitToPath;
    },

    set_fitToPath: function (v) {
        if (v === this._fitToPath)
            return;

        var beforeUpdate = function () {
            this._fitToPath = v;
        }.bind(this);

        this.update(beforeUpdate);
    },

    get_stretch: function () {
        return this._stretch;
    },

    set_stretch: function (v) {
        if (v === this._stretch)
            return;

        var beforeUpdate = function () {
            this._stretch = v;
        }.bind(this);

        this.update(beforeUpdate);
    },

    get_originalFontSize: function () {
        return this._originalFontSize;
    },

    set_originalFontSize: function (v) {
        if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(this._originalFontSize, v))
            return;

        var beforeUpdate = Function.createDelegate(this,
	        function () {
	            this._originalFontSize = v;
	        });

        this.update(beforeUpdate);
    },

    get_fitToPathStep: function () {
        return this._fitToPathStep;
    },

    set_fitToPathStep: function (v) {
        if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(this._fitToPathStep, v))
            return;

        var beforeUpdate = Function.createDelegate(this,
	        function () {
	            this._fitToPathStep = v;
	        });

        this.update(beforeUpdate);
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "CurvedTextVObjectData";
    },

    _afterUpdate: function (afterUpdate) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject.callBaseMethod(this, "_afterUpdate", [afterUpdate]);

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas.updateSelection();
    },

    _onResized: function () {
        var ratio = this.get_rectangle().Height / this._height;
        this._font._size = parseFloat((this._font._size * ratio).toFixed(1));

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject.callBaseMethod(this, "_onResized");
    },

    draw: function (ctx, isFocused) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject.callBaseMethod(this, "draw", [ctx, isFocused]);

        if (window.__$abl$ === true)
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPath(ctx, this._textPath, this._get_controlCenter(), this.get_transform(), 1, "red");
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);