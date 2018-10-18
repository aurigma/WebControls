// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject = function (rectangle) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a placeholder v-object.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    if (rectangle instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.initializeBase(this,
            [ns.Math.Path.rectangle(rectangle.Left, rectangle.Top, rectangle.Width, rectangle.Height)]);
        this._controlPoints = [new ns.Math.PointF(rectangle.Left, rectangle.Top), new ns.Math.PointF(rectangle.Right, rectangle.Bottom)];
    }
    else
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.initializeBase(this);

    this.set_borderWidth(0);
    this.set_fillColor("rgba(0,0,0,0)");

    this._content = null;
    this._editing = false;
    this._showMaskedContent = true;
    this._isStubContent = false;

    this._buttonGroup = null;
    this._editButtonGroup = null;
    this._doneButtonGroup = null;
    this._selectButton = null;
    this._editButton = null;
    this._doneButton = null;

    this._selectButtonClickHandler = Function.createDelegate(this, this._onSelectButtonClick);
    this._editButtonClickHandler = Function.createDelegate(this, this._onEditButtonClick);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.prototype = {
    set_visible: function (value) {
        if (this._visible !== value) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, "set_visible", [value]);
            if (this._content != null)
                this._content.set_visible(value);

            var canvas = this.get_canvas();
            if (canvas != null)
                canvas._updatePlaceholderButtonGroup(this);
        }
    },

    set_locked: function (value) {
        if (this._locked !== value) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, "set_locked", [value]);

            var canvas = this.get_canvas();
            if (canvas != null)
                canvas._updatePlaceholderButtonGroup(this);
        }
    },

    get_content: function () {
        return this._content;
    },

    set_content: function (value) {
        this._content = value;

        if (this._content != null) {
            this._content._layer = this.get_layer();
            this._content._parentPlaceholder = this;
        }

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas._updatePlaceholderButtonGroup(this);
    },

    isEmptyContent: function () {
        return this.get_content() == null;
    },

    get_isStubContent: function () {
        return this._isStubContent;
    },

    set_isStubContent: function (value) {
        if (!(typeof (value) == "boolean"))
            value = false;

        if (this._isStubContent !== value)
            this._isStubContent = value;
    },

    isStubOrEmpty: function () {
        return this.get_isStubContent() || this.isEmptyContent();
    },

    get_editing: function () {
        return !this.isStubOrEmpty() && this._editing && this._permissions.get_allowEditContent();
    },

    set_editing: function (value) {
        if (this._editing !== value) {
            if (value && !this._permissions.get_allowEditContent() && this.isStubOrEmpty())
                return;

            this._editing = value;
            this._setNeedRedrawCanvasFlag();

            this.raiseChanged();

            var canvas = this.get_canvas();
            if (canvas != null) {
                canvas.updateSelection();
                canvas._updatePlaceholderButtonGroup(this);
                canvas.redraw();
            }
        }
    },

    get_permissions: function () {
        if (!this.get_editing())
            return this._permissions;
        else if (!this.isEmptyContent())
            return this.get_content().get_permissions();
        else
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission({}, false);
    },

    set_permissions: function (value) {
        if (!this.get_editing()) {
            this._permissions = value;
            this.raiseChanged();
        }
    },

    get_showMaskedContent: function () {
        return this._showMaskedContent;
    },

    set_showMaskedContent: function (value) {
        this._showMaskedContent = value;
        this._setNeedRedrawCanvasFlag();
    },

    clone: function () {
        var obj = Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, "clone", []);

        if (!this.isEmptyContent())
            obj.set_content(this.get_content().clone());

        return obj;
    },

    set_rectangle: function (rectangle, supressOnChanged) {
        if (!this.get_editing())
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, "set_rectangle", [rectangle, supressOnChanged]);
        else
            this.get_content().set_rectangle(rectangle, supressOnChanged);
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PlaceholderVObjectData";
    },

    draw: function (ctx, isFocused) {
        if (!ctx)
            return;

        if (this.isEmptyContent()) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, "draw", [ctx, isFocused]);
            return;
        }

        if (this.get_editing() && this.get_showMaskedContent() && isFocused)
            this.get_content()._drawMaskedContent(ctx);

        var gr = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        var path = this.get_originalPath();
        var center = this._get_controlCenter();
        var transform = this.get_transform();

        ctx.save();

        gr.clipPath(ctx, this._get_transformedPath());
        gr.fillPath(ctx, path, center, transform, this.get_fillColor().Preview, this.get_opacity());
        this.get_content().draw(ctx, isFocused);

        ctx.restore();

        gr.drawPath(ctx, path, center, transform, this.get_borderWidth(), this.get_borderColor().Preview, this.get_opacity());
    },

    get_selectionRectangle: function () {
        if (this.get_editing())
            return this.get_content().get_selectionRectangle();
        else
            return Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, "get_selectionRectangle");
    },

    update: function () {
        if (!this.isEmptyContent())
            this.get_content().update();

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas._updatePlaceholderButtonGroup(this);
    },

    add_selectButtonClick: function (handler) {
        this.get_events().addHandler("selectButtonClick", handler);
    },

    remove_selectButtonClick: function (handler) {
        this.get_events().removeHandler("selectButtonClick", handler);
    },

    _onAddedOnCanvas: function (canvas) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_onAddedOnCanvas', [canvas]);

        if (!this.isEmptyContent()) {
            this.get_content()._layer = this.get_layer();
            this.get_content()._parentPlaceholder = this;
            this.get_content()._onAddedOnCanvas(canvas);
        }

        if (canvas != null)
            canvas._addPlaceholderButtonGroup(this);
    },

    _onRemovedFromCanvas: function (canvas) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_onRemovedFromCanvas', [canvas]);

        if (canvas != null)
            canvas._removePlaceholderButtonGroup(this);
    },

    _transformRectangle: function (startRectangle, endRectangle) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_transformRectangle', [startRectangle, endRectangle]);

        if (!this.isEmptyContent() && this.get_content()._startRectangle != null) {
            this.get_content()._transformRectangle(startRectangle, endRectangle);
        }

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas._updatePlaceholderButtonGroupPosition(this);
    },

    _startTransform: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_startTransform');

        if (!this.isEmptyContent())
            this.get_content()._startRectangle = this.get_content().get_rectangle();
    },

    _endTransform: function (changed) {
        if (changed && this.get_canvas().get_history().get_trackingEnabled() && this._startRectangle != null) {
            var rectangle = this.get_rectangle();

            if (!this.get_editing())
                this.set_rectangle(this._startRectangle, true);

            var content = !this.isEmptyContent() ? this.get_content().get_rectangle() : null;
            if (content != null && this.get_content()._startRectangle != null)
                this.get_content().set_rectangle(this.get_content()._startRectangle, true);

            this.get_canvas().get_history().addVObjectChanged(this, this.get_index(), this.get_layer().get_index());

            if (content != null)
                this.get_content().set_rectangle(content);

            if (!this.get_editing())
                this.set_rectangle(rectangle);
        }

        delete this._startRectangle;

        if (!this.isEmptyContent())
            delete this.get_content()._startRectangle;
    },

    _transformChanged: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_transformChanged');

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas._updatePlaceholderButtonGroupPosition(this);
    },

    _onResized: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_onResized');

        if (!this.isEmptyContent())
            this.get_content()._onResized();
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.callBaseMethod(this, '_updateColors');

        if (!this.isEmptyContent())
            this.get_content()._updateColors();
    },

    _onSelectButtonClick: function () {
        var handler = this.get_events().getHandler("selectButtonClick");
        if (handler != null)
            handler(this);
    },

    _onEditButtonClick: function () {
        var isEditing = this.get_editing();

        if (!isEditing) {
            var canvas = this.get_canvas();
            if (canvas != null) {
                if (!canvas.isVObjectSelected(this));
                canvas.set_selectedVObjects([this]);
            }
        }

        this.set_editing(!isEditing);
    },

    _showEditButton: function () {
        return this._permissions.get_showEditButton() && this._permissions.get_allowEditContent();
    },

    _showSelectButton: function () {
        return this._permissions.get_showSelectButton();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject);