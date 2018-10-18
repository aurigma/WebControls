// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject = function (text, rectangle, postScriptFontName, fontSize) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector text block.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

    ns.BaseTextVObject.initializeBase(this, [rectangle]);

    this._text = (typeof text == "string") ? text : "";

    this._font = new ns.BaseTextVObject.ProtectedFontSettings(
        this,
        postScriptFontName != null ? postScriptFontName : "ArialMT",
        fontSize != null ? fontSize : 20,
        false,
        false
        );

    this._textColor = new ns.RgbColor("rgb(0,0,0)");
    this._underline = false;
    this._alignment = 0;
    this._tracking = 0;
    this._leading = 0;
    this._isRichText = false;
    this._verticalScale = 1;
    this._horizontalScale = 1;

    this._currentFileId = null;

    //TextVObject isn't resizable by default
    this.get_permissions().set_allowArbitraryResize(false);
    this.get_permissions().set_allowProportionalResize(false);

    this._allowNegativeResize = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.prototype = {
    update: function (beforeUpdate, afterUpdate) {
        if (this.isVisible()) {
            var afterTextUpdate = Function.createDelegate(this, function () {
                this._afterUpdate(afterUpdate);
            });

            Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, "_update", [null, beforeUpdate, afterTextUpdate]);
        }
        else if (typeof beforeUpdate == "function")
            beforeUpdate();
    },

    _afterUpdate: function (afterUpdate) {
        if (typeof afterUpdate == "function")
            afterUpdate();
    },

    _validateBeforeCallService: function () {
        return this.get_text().trim() !== "";
    },

    get_alignment: function () {
        /// <summary>Gets or sets the value that specifies text alignment.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextAlignment">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextAlignment" /> enumeration member that specifies text alignment.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.Alignment">BaseTextVObject.Alignment</see> server-side member.</para></remarks>
        return this._alignment;
    },

    set_alignment: function (v) {
        if (v !== this._alignment) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._alignment = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_font: function () {
        return this._font;
    },

    get_textColor: function () {
        /// <summary>Gets or sets color of the font used to display a text in this vector text block.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of this vector text block.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.TextColor">BaseTextVObject.TextColor</see> server-side member.</para></remarks>
        return this._textColor;
    },

    set_textColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._textColor.equals(color)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._textColor = color;
            });

            this.update(beforeUpdate);
        }
    },

    get_underline: function () {
        /// <summary>Get or sets the value indicating whether the text of this vector text block is underlined.</summary>
        /// <value type="Boolean"><strong>true</strong> if the text of this vector text block is underlined; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.Underline">BaseTextVObject.Underline</see> server-side member.</para></remarks>
        return this._underline;
    },

    set_underline: function (v) {
        if (v !== this._underline) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._underline = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_text: function () {
        /// <summary>Gets or sets a text string to display within this vector text block.</summary>
        /// <value type="String">The string to display.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.Text">BaseTextVObject.Text</see> server-side member.</para></remarks>
        return this._text;
    },

    set_text: function (v) {
        if (v !== this._text) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._text = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_tracking: function () {
        return this._tracking;
    },

    set_tracking: function (v) {
        if (this._tracking !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._tracking = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_verticalScale: function () {
        return this._verticalScale;
    },

    set_verticalScale: function (v) {
        v = !Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(v, 0) ? v : 1;

        if (this._verticalScale !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._verticalScale = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_horizontalScale: function () {
        return this._horizontalScale;
    },

    set_horizontalScale: function (v) {
        v = !Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(v, 0) ? v : 1;

        if (this._horizontalScale !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._horizontalScale = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_isRichText: function () {
        return this._isRichText;
    },

    set_isRichText: function (value) {
        if (this._isRichText !== value)
            this._isRichText = value;
    },

    get_leading: function () {
        return this._leading;
    },

    set_leading: function (v) {
        if (this._leading !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._leading = v;
            });

            this.update(beforeUpdate);
        }
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, '_updateColors');
        this.update();
    },

    _transformChanged: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, '_transformChanged');
        if (this.get_isUpdating() && this._callbacks) {
            var t = this.get_transform().clone();
            var beforeUpdate = Function.createDelegate(this, function () {
                this.set_transform(t, true);
            });
            this._callbacks.push(beforeUpdate);
        }
    },

    _createImageUrl: function () {
        var cv = this.get_canvas();
        if (cv == null || this._currentFileId == null || this._currentFileId.length === 0)
            return null;
        else
            return cv.get_handlerUrl() + "/txt?" + "f=" + encodeURIComponent(this._currentFileId);
    },

    _updateImageUrl: function () {
        if (this.get_text().trim() === "")
            return;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, "_updateImageUrl");
    },

    _drawImage: function (ctx, disableSmoothing, maskColor) {
        if (this.get_text().trim() === "")
            return;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, "_drawImage", [ctx, disableSmoothing, maskColor]);
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "BaseTextVObjectData";
    },

    _onCanvasChanged: function () {
        if (!this._isChanging)
            this.update();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject);

//ProtectedFontSettings
Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.ProtectedFontSettings = function (baseTextVObject, postScriptName, size, fauxBold, fauxItalic) {
    this._baseTextVObject = baseTextVObject;

    this._postScriptName = postScriptName;
    this._size = size;
    this._fauxBold = fauxBold;
    this._fauxItalic = fauxItalic;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.ProtectedFontSettings.prototype = {
    get_postScriptName: function () {
        return this._postScriptName;
    },

    set_postScriptName: function (value) {
        if (this._postScriptName === value)
            return;

        this._baseTextVObject.update(function () { this._postScriptName = value; }.bind(this));
    },

    get_size: function () {
        return this._size;
    },

    set_size: function (value) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;

        if (ns.EqualsOfFloatNumbers(this._size, value))
            return;

        this._baseTextVObject.update(function () { this._size = value; }.bind(this));
    },

    get_fauxBold: function () {
        return this._fauxBold;
    },

    set_fauxBold: function (value) {
        if (this._fauxBold === value)
            return;

        this._baseTextVObject.update(function () { this._fauxBold = value; }.bind(this));
    },

    get_fauxItalic: function () {
        return this._fauxItalic;
    },

    set_fauxItalic: function (value) {
        if (this._fauxItalic === value)
            return;

        this._baseTextVObject.update(function () { this._fauxItalic = value; }.bind(this));
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.ProtectedFontSettings.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.ProtectedFontSettings");