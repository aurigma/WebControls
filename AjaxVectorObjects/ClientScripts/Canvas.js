// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents the main host object which contains a stack of layers.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.initializeBase(this);

    this._selection = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler(this);

    // Data

    this._layers = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection(this);
    this._canvasClientSideOptions = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions();
    this._history = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History(this);

    // Appearance

    this._id = null;
    this._workspaceWidth = 72.0;
    this._workspaceHeight = 72.0;
    this._zoom = 1.0;
    this._screenXDpi = 96;
    this._screenYDpi = 96;
    this._targetDpi = null;
    this._hiddenFieldID = "";
    this._parent = null;
    this._document = document;
    this._mouseMoveTimeout = 100;
    this._disableSmoothing = false;
    this._viewer = null;

    this._inactiveCanvases = [];
    this._activeCanvases = [];

    this._rotationGripSize = 8; // in pixels
    this._resizeGripSize = 8;    // in pixels
    this._resizeGripColor = "rgba(255,255,255,1)";
    this._rotationGripColor = "rgba(0,0,255,0.2)";
    this._resizeGripLineColor = "rgba(255,0,0,1)";
    this._rotationGripLineColor = "rgba(112,112,112,1)";
    this._rotationGripLineLength = 12;

    this._buttonGroupCssClass = null;
    this._selectButtonCssClass = null;
    this._editButtonCssClass = null;
    this._doneButtonCssClass = null;
    this._selectButtonTitle = "Select image";
    this._editButtonTitle = "Edit";
    this._doneButtonTitle = "Done";

    this._backgroundImage = null;
    this._loadingImageUrl = null;
    this._previewColorManagementEnabled = false;
    this._printColorManagementEnabled = false;
    this._marginColor = "rgba(100,255,100,1)";
    this._marginWidth = 0;
    this._leftRightMargin = 0.25 * 72;
    this._topBottomMargin = 0.25 * 72;

    this._constrainedMarginEnabled = false;
    this._keyEventEnabled = true;
    this._needRedraw = true;
    this._needCompleteRedraw = true;
    this._selectionColor = "rgba(0,0,255,0.7)";
    this._selectionWidth = 2;
    this._handlerUrl = null;

    // Events

    this._initialization = false;

    this._onSelectedVObjectsDeletingDelegate;
    this._onSelectedVObjectsChangedDelegate;

    this._redrawDelegate = null;
    this._redrawAllCanvasesDelegate = null;
    this._callbackArgs = "";
    this._exceptionDescription = "";
    this._callback = null;

    this._status = Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.ready;
    this._callbackContext = 0;
    this._callbackCount = 0;
    this._callbackCollection = [];
    this._callbackDelay = 100;
    this._callbackTimeout = null;
    this._callbackFunctionDelegate = null;

    this._rgbColorProfileFileId = null;
    this._cmykColorProfileFileId = null;
    this._grayscaleColorProfileFileId = null;
    this._previewTargetColorSpace = null;

    this._returnValue = null;
    //save counts of figures: rectangles, texts, ellipses, images, lines
    this._tags = {};

    this._ready = false;

    this._mouseMoveRedrawTimeout = null;
    this._placeholderButtonStyle = null;

    this._canDeleteVObjectsCallback = null;
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.prototype =
{
    alignVObject: function (vObject, align) {
        /// <summary>Aligns the specified v-object.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to align.</param>
        /// <param name="align" type="String">Alignment. See the <strong>Remarks</strong> section for a list of alignment options.</param>
        /// <remarks>
        ///		<list type="bullet">
        /// 		<item><term>left</term><description>aligns the v-object along the left edge of the canvas.</description></item>
        /// 		<item><term>horizontalCenter</term><description>centers the v-object horizontally within the canvas.</description></item>
        /// 		<item><term>right</term><description>aligns the v-object along the right edge of the canvas.</description></item>
        /// 		<item><term>top</term><description>aligns the v-object along the top edge of the canvas.</description></item>
        /// 		<item><term>verticalCenter</term><description>centers the v-object vertically within the canvas.</description></item>
        /// 		<item><term>bottom</term><description>aligns the v-object along the bottom edge of the canvas.</description></item>
        /// 	</list>
        /// </remarks>
        if (!vObject)
            return;
        var bounds = vObject.get_bounds();
        var hm = this.get_leftRightMargin();
        var vm = this.get_topBottomMargin();
        var r = vObject.get_rectangle();
        var region = vObject.get_layer().get_region();

        if (region) {
            //align in region
            if (align === "left") {
                r.CenterX = !vObject.get_locked() && vObject.get_permissions().get_allowMoveHorizontal() ? region.Left + bounds.Width / 2 : r.CenterX;
            } else if (align === "horizontalCenter") {
                r.CenterX = !vObject.get_locked() && vObject.get_permissions().get_allowMoveHorizontal() ? region.Left + region.Width / 2 : r.CenterX;
            } else if (align === "right") {
                r.CenterX = !vObject.get_locked() && vObject.get_permissions().get_allowMoveHorizontal() ? region.Left + region.Width - bounds.Width / 2 : r.CenterX;
            } else if (align === "top") {
                r.CenterY = !vObject.get_locked() && vObject.get_permissions().get_allowMoveVertical() ? region.Top + bounds.Height / 2 : r.CenterY;
            } else if (align === "verticalCenter") {
                r.CenterY = !vObject.get_locked() && vObject.get_permissions().get_allowMoveVertical() ? region.Top + region.Height / 2 : r.CenterY;
            } else if (align === "bottom") {
                r.CenterY = !vObject.get_locked() && vObject.get_permissions().get_allowMoveVertical() ? region.Top + region.Height - bounds.Height / 2 : r.CenterY;
            }
        } else {
            //align on worspace
            if (align === "left") {
                r.CenterX = !vObject.get_locked() && vObject.get_permissions().get_allowMoveHorizontal() ? hm + bounds.Width / 2 : r.CenterX;
            } else if (align === "horizontalCenter") {
                r.CenterX = !vObject.get_locked() && vObject.get_permissions().get_allowMoveHorizontal() ? this.get_workspaceWidth() / 2 : r.CenterX;
            } else if (align === "right") {
                r.CenterX = !vObject.get_locked() && vObject.get_permissions().get_allowMoveHorizontal() ? this.get_workspaceWidth() - hm - bounds.Width / 2 : r.CenterX;
            } else if (align === "top") {
                r.CenterY = !vObject.get_locked() && vObject.get_permissions().get_allowMoveVertical() ? vm + bounds.Height / 2 : r.CenterY;
            } else if (align === "verticalCenter") {
                r.CenterY = !vObject.get_locked() && vObject.get_permissions().get_allowMoveVertical() ? this.get_workspaceHeight() / 2 : r.CenterY;
            } else if (align === "bottom") {
                r.CenterY = !vObject.get_locked() && vObject.get_permissions().get_allowMoveVertical() ? this.get_workspaceHeight() - vm - bounds.Height / 2 : r.CenterY;
            }
        }

        if (this.get_history().get_trackingEnabled()) {
            this.get_history().addVObjectChanged(vObject);
        }

        vObject.set_rectangle(r);

        if (this._isPlaceholder(vObject) && !vObject.isEmptyContent()) {
            var rect = vObject.get_content().get_rectangle();
            rect.CenterX = r.CenterX;
            rect.CenterY = r.CenterY;
            vObject.get_content().set_rectangle(rect);
        }

        this._selection.update();
        this.redraw(true);
    },

    alignVObjects: function (align) {
        if (this.get_selectedVObjects().get_count() > 1) {
            var baseRect = this.get_selectedVObjects().get_item(0).get_rectangle();

            var useGroupCommand = this.get_history().get_trackingEnabled() && this.get_selectedVObjects().get_count() > 2;

            if (useGroupCommand)
                this.get_history().startVObjectGroupCommand();

            for (var i = 1; i < this.get_selectedVObjects().get_count() ; i++) {
                var vo = this.get_selectedVObjects().get_item(i);

                var rect = vo.get_rectangle();

                if (align === "left") {
                    rect.CenterX = !vo.get_locked() && vo.get_permissions().get_allowMoveHorizontal() ? baseRect.get_location().X + rect.Width / 2 : rect.CenterX;
                } else if (align === "horizontalCenter") {
                    rect.CenterX = !vo.get_locked() && vo.get_permissions().get_allowMoveHorizontal() ? baseRect.CenterX : rect.CenterX;
                } else if (align === "right") {
                    rect.CenterX = !vo.get_locked() && vo.get_permissions().get_allowMoveHorizontal() ? baseRect._getBottomRightCorner().X - rect.Width / 2 : rect.CenterX;
                } else if (align === "top") {
                    rect.CenterY = !vo.get_locked() && vo.get_permissions().get_allowMoveVertical() ? baseRect.get_location().Y + rect.Height / 2 : rect.CenterY;
                } else if (align === "verticalCenter") {
                    rect.CenterY = !vo.get_locked() && vo.get_permissions().get_allowMoveVertical() ? baseRect.CenterY : rect.CenterY;
                } else if (align === "bottom") {
                    rect.CenterY = !vo.get_locked() && vo.get_permissions().get_allowMoveVertical() ? baseRect._getBottomRightCorner().Y - rect.Height / 2 : rect.CenterY;
                }

                if (this.get_history().get_trackingEnabled()) {
                    this.get_history().addVObjectChanged(vo);
                }

                vo.set_rectangle(rect);

                if (this._isPlaceholder(vo) && !vo.isEmptyContent()) {
                    var r = vo.get_content().get_rectangle();
                    r.CenterX = rect.CenterX;
                    r.CenterY = rect.CenterY;
                    vo.get_content().set_rectangle(r);
                }

                this._selection.update();
                this._needRedraw = true;
                this.redraw();
            }

            if (useGroupCommand)
                this.get_history().endVObjectGroupCommand();

            this.updateTexts();
        }
    },

    get_handlerUrl: function () {
        return this._handlerUrl;
    },

    _deleteSelectedVObjectsWithoutConfirm: function () {
        var vObjectsDeleted = false;

        var useGroupCommand = this.get_history().get_trackingEnabled() && this.get_selectedVObjects().get_count() > 1;

        if (useGroupCommand)
            this.get_history().startVObjectGroupCommand();

        var vObjects = this.get_selectedVObjects().toArray();
        for (var i = 0; i < vObjects.length; i++) {
            var vObject = vObjects[i];
            if (this._canDeleteVObject(vObject)) {
                vObject.get_layer().get_vObjects().remove(vObject);
                vObjectsDeleted = true;
            }
        }

        if (useGroupCommand)
            this.get_history().endVObjectGroupCommand();

        if (vObjectsDeleted) {
            this.updateTexts();
            this.redraw(true);
        }
    },

    _canDeleteVObject: function (vObject) {
        return (vObject != null && vObject.get_layer() != null &&
            !vObject.get_locked() && !vObject.get_layer().get_locked() &&
            vObject.get_visible() && vObject.get_layer().get_visible() &&
            vObject.get_permissions() && vObject.get_permissions().get_allowDelete());
    },

    set_сanDeleteVObjectsCallback: function (callback) {
        this._canDeleteVObjectsCallback = callback;
    },

    deleteSelectedVObjects: function (needConfirm) {
        /// <summary>Delete  the currently selected v-objects and shows a confirmation dialog if needed.</summary>
        /// <param name="needConfirm" type="Boolean"><strong>true</strong> if the delete confirmation dialog should be shown; otherwise <strong>false</strong>.</param>
        var canDeleteVObjects = typeof this._canDeleteVObjectsCallback != "function" || this._canDeleteVObjectsCallback();
        if (!canDeleteVObjects)
            return;

        var canDelete = false;
        for (var i = 0; i < this.get_selectedVObjects().get_count() ; i++) {
            var vObject = this.get_selectedVObjects().get_item(i);
            if (this._canDeleteVObject(vObject)) {
                canDelete = true;
                break;
            }
        }

        if (!canDelete)
            return;

        //Show confirm deletion dialog if needConfirm=true
        if (needConfirm) {
            //raise event for confirmation
            var h = this.get_events().getHandler("selectedVObjectsDeleting");
            if (h) {
                //call the confirmation function
                //if return true then delete object
                h(this, this._onSelectedVObjectsDeletingDelegate);
            } else {
                var answer = confirm("Selected objects will be deleted. Continue?");
                if (answer) {
                    this._deleteSelectedVObjectsWithoutConfirm();
                }
            }
        } else {
            this._deleteSelectedVObjectsWithoutConfirm();
        }
    },

    get_ready: function () {
        return this._ready;
    },

    //get the object that contain numbers of lines, rectangles, ellipses, texts, images
    get_tags: function () {
        /// <summary>Gets or sets custom data.</summary>
        /// <value type="Object">The custom data.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.Tags">Canvas.Tags</see> server-side member.</para></remarks>
        return this._tags;
    },

    //set the object that contain numbers of lines, rectangles, ellipses, texts, images
    set_tags: function (tags) {
        this._tags = tags;
    },

    get_width: function () {
        /// <summary>Gets the width of the canvas taking into account screen horizontal resolution and zoom value.</summary>
        /// <value type="Number">The width of the canvas.</value>
        return this._workspaceWidth * this._zoom * this.get_screenXDpi() / 72;
    },

    get_height: function () {
        /// <summary>Gets the height of the canvas taking into account screen vertical resolution and zoom value.</summary>
        /// <value type="Number">The height of the canvas.</value>
        return this._workspaceHeight * this._zoom * this.get_screenYDpi() / 72;
    },

    get_keyEventEnabled: function () {
        /// <summary>Gets or sets the value indicating whether the both key-up and key-down events are enabled.</summary>
        /// <value type="Boolean"><strong>true</strong> if the key-up and key-down events are enabled; otherwise <strong>false</strong>.</value>
        return this._keyEventEnabled;
    },

    set_keyEventEnabled: function (v) {
        this._keyEventEnabled = v;
    },

    get_marginColor: function () {
        /// <summary>Gets or sets a color of the outer margin of the canvas.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of the outer margin of the canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.MarginColor">Canvas.MarginColor</see> server-side member.</para></remarks>
        return this._marginColor;
    },

    set_marginColor: function (v) {
        this._marginColor = v;
        this._needCompleteRedraw = true;
    },

    get_marginWidth: function () {
        /// <summary>Gets or sets a width of the outer margin of the canvas.</summary>
        /// <value type="Number">The width of the margin of the canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.MarginWidth">Canvas.MarginWidth</see> server-side member.</para></remarks>
        return this._marginWidth;
    },

    set_marginWidth: function (v) {
        this._marginWidth = v;
        this._needCompleteRedraw = true;
    },

    get_selectionColor: function () {
        return this._selectionColor;
    },

    set_selectionColor: function (value) {
        this._selectionColor = value;
    },

    get_selectionWidth: function () {
        return this._selectionWidth;
    },

    set_selectionWidth: function (value) {
        this._selectionWidth = value;
    },

    get_margin: function () {
        /// <summary>Gets or sets the outer margin of the canvas.</summary>
        /// <value type="Number">The margin of the canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.Margin">Canvas.Margin</see> server-side member.</para></remarks>
        return Math.min(this._leftRightMargin, this._topBottomMargin);
    },

    set_margin: function (v) {
        this._leftRightMargin = v;
        this._topBottomMargin = v;
        this._needCompleteRedraw = true;
    },

    get_leftRightMargin: function () {
        return this._leftRightMargin;
    },

    set_leftRightMargin: function (v) {
        this._leftRightMargin = v;
        this._needCompleteRedraw = true;
    },

    get_topBottomMargin: function () {
        return this._topBottomMargin;
    },

    set_topBottomMargin: function (v) {
        this._topBottomMargin = v;
        this._needCompleteRedraw = true;
    },

    set_constrainedMarginEnabled: function (v) {
        this._constrainedMarginEnabled = v;
    },

    get_constrainedMarginEnabled: function () {
        /// <summary>Gets or sets the value indicating whether it is possible to move v-objects beyond the bounds of the canvas.</summary>
        /// <value type="Boolean"><strong>true</strong> if it is possible to move v-objects beyond the bounds of the canvas; otherwise, <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ConstrainedMarginEnabled">Canvas.ConstrainedMarginEnabled</see> server-side member.</para></remarks>

        return this._constrainedMarginEnabled;
    },

    get_targetDpi: function () {
        return this._targetDpi;
    },

    set_targetDpi: function (v) {
        this._targetDpi = v;
    },

    get_previewColorManagementEnabled: function () {
        /// <summary>Gets or sets the value indicating whether to use color management when displaying images.</summary>
        /// <value type="Boolean"><strong>true</strong> if the color management is used when displaying images; otherwise, <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.PreviewColorManagementEnabled">Canvas.PreviewColorManagementEnabled</see> server-side member.</para></remarks>
        return this._previewColorManagementEnabled;
    },

    set_previewColorManagementEnabled: function (v) {
        if (this._previewColorManagementEnabled !== v) {
            this._previewColorManagementEnabled = v;

            if (!this.get_isUpdating() && !this._initialization)
                this._updateColors();
        }
    },

    get_printColorManagementEnabled: function () {
        /// <summary>Gets or sets the value indicating whether to use color management when rendering the workspace.</summary>
        /// <value type="Boolean"><strong>true</strong> if the color management is used when rendering the workspace; otherwise, <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.PrintColorManagementEnabled">Canvas.PrintColorManagementEnabled</see> server-side member.</para></remarks>
        return this._printColorManagementEnabled;
    },

    set_printColorManagementEnabled: function (v) {
        this._printColorManagementEnabled = v;
    },

    get_previewTargetColorSpace: function () {
        return this._previewTargetColorSpace;
    },

    set_previewTargetColorSpace: function (v) {
        if (this._previewTargetColorSpace !== v) {
            this._previewTargetColorSpace = v;

            if (!this.get_isUpdating() && !this._initialization)
                this._updateColors();
        }
    },

    _updateColors: function () {
        for (var i = 0; i < this.get_layers().get_count() ; i++) {
            var layer = this.get_layers().get_item(i);
            for (var j = 0; j < layer.get_vObjects().get_count() ; j++) {
                var vObject = layer.get_vObjects().get_item(j);
                vObject._updateColors();
            }
        }
        this.redraw(true);
    },

    get_history: function () {
        /// <summary>Gets a <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" /> object associated with this canvas.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" /> which traces modifications of this canvas content.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.History">Canvas.History</see> server-side member.</para></remarks>
        return this._history;
    },

    get_status: function () {
        /// <summary>Gets a current bitmap status.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus" /> enumeration member that specifies a current bitmap status.</value>
        return this._status;
    },

    get_context: function () {
        /// <exclude />
        var el = this.get_bottomCanvas();
        if (el && el.getContext) {
            return el.getContext("2d");
        }
        return null;
    },

    get_bottomCanvasId: function () {
        /// <exclude />
        return this._id;
    },

    get_designCanvasId: function () {
        /// <exclude />
        return (this._id != null) ? this._id + "_design" : null;
    },

    get_bottomCanvas: function () {
        /// <exclude />
        var id = this.get_bottomCanvasId();
        return (this._document != null && id != null) ? this._document.getElementById(id) : null;
    },

    get_designCanvas: function () {
        /// <exclude />
        var id = this.get_designCanvasId();
        return (this._document != null && id != null) ? this._document.getElementById(id) : null;
    },

    get_canvasClientSideOptions: function () {
        /// <summary>Gets values which configure automatic postback for individual events.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions"/> class instance which provides an access to properties which configure automatic postback for individual events.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.CanvasClientSideOptions">Canvas.CanvasClientSideOptions</see> server-side member.</para></remarks>
        return this._canvasClientSideOptions != null ?
            this._canvasClientSideOptions
            : (this._canvasClientSideOptions = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions());
    },

    get_multipleSelectionEnabled: function () {
        return this._selection.get_multipleSelectionEnabled();
    },

    set_multipleSelectionEnabled: function (value) {
        this._selection.set_multipleSelectionEnabled(value);
    },

    get_mouseMoveTimeout: function () {
        return this._mouseMoveTimeout;
    },

    set_mouseMoveTimeout: function (value) {
        this._mouseMoveTimeout = value;
    },

    get_disableSmoothing: function () {
        return this._disableSmoothing;
    },

    set_disableSmoothing: function (value) {
        this._disableSmoothing = value;
    },

    get_allVObjects: function (onlyVisible, type) {
        var result = [];
        var layers = this.get_layers();
        for (var i = 0, imax = layers.get_count() ; i < imax; i++) {
            var layer = layers.get_item(i);
            if (layer.get_visible() || !onlyVisible) {
                var vObjects = layer.get_vObjects();
                for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                    var vObject = vObjects.get_item(j);
                    var visibilityCheck = !onlyVisible || (vObject.get_visible() && !vObject.get_permissions().get_noShow());
                    var typeCheck = type == null || type.isInstanceOfType(vObject);
                    if (visibilityCheck && typeCheck) {
                        result.push(vObject);
                    }
                }
            }
        }

        return result;
    },

    updateTexts: function (textToSkip) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

        var idToSkip = ns.BoundedTextVObject.isInstanceOfType(textToSkip) ? textToSkip.get_uniqueId() : null;

        var layers = this.get_layers();
        for (var i = 0, imax = layers.get_count() ; i < imax; i++) {
            var layer = layers.get_item(i);
            if (layer.get_visible()) {
                var vObjects = layer.get_vObjects();
                for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                    var vObject = vObjects.get_item(j);
                    if (vObject.get_uniqueId() !== idToSkip && ns.BoundedTextVObject.isInstanceOfType(vObject) &&
                        vObject.get_visible() && !vObject.get_permissions().get_noShow()) {
                        vObject._updateWrappingRectangles();
                    }
                }
            }
        }
    },

    //#region	Output properties.

    get_isSquaredBackground: function () {
        /// <summary>Gets or sets the value indicating if the background of the canvas is squared.</summary>
        /// <value type="Boolean"><strong>true</strong> if the background of the canvas is squared; otherwise, <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.IsSquaredBackground">Canvas.IsSquaredBackground</see> server-side member.</para></remarks>
        return this._isSquaredBackground;
    },

    set_isSquaredBackground: function (value) {
        this._isSquaredBackground = value;
        if (this.get_isInitialized()) {
            var style = "url(" + this._backgroundImage + ") repeat";
            if (!this._isSquaredBackground)
                style = "transparent";
            this.get_bottomCanvas().style.background = style;
        }
    },

    get_loadingImageUrl: function () {
        return this._loadingImageUrl;
    },

    set_loadingImageUrl: function (value) {
        if (typeof value === "string" && this._loadingImageUrl !== value) {
            this._loadingImageUrl = value;
            if (this._waitClockImage) {
                this._waitClockImage = new Image();
                this._waitClockImage.src = value;
            }
        }
    },

    get_workspaceWidth: function () {
        /// <summary>Gets or sets the width of the canvas.</summary>
        /// <value type="Number">The width of the canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.WorkspaceWidth">Canvas.WorkspaceWidth</see> server-side member.</para></remarks>
        return this._workspaceWidth;
    },

    set_workspaceWidth: function (value) {
        this._workspaceWidth = value;

        //update zoom
        this.set_zoom(this.get_zoom());

        this._updateCanvasElementSize();
        this._raiseEvent("workspaceSizeChanged");
    },

    get_workspaceHeight: function () {
        /// <summary>Gets or sets the height of the canvas.</summary>
        /// <value type="Number">The height of the canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.WorkspaceHeight">Canvas.WorkspaceHeight</see> server-side member.</para></remarks>
        return this._workspaceHeight;
    },

    set_workspaceHeight: function (value) {
        this._workspaceHeight = value;

        //update zoom
        this.set_zoom(this.get_zoom());

        this._updateCanvasElementSize();
        this._raiseEvent("workspaceSizeChanged");
    },

    set_workspaceSize: function (width, height) {
        this._workspaceWidth = width;
        this._workspaceHeight = height;

        this.set_zoom(this.get_zoom());

        this._raiseEvent("workspaceSizeChanged");
        this._updateCanvasElementSize();
    },

    begin_initialization: function () {
        this._initialization = true;
        this.get_history().pauseTracking();
    },

    end_initialization: function () {
        this.get_history().resumeTracking();

        this._initialization = false;

        this._raiseEvent("workspaceSizeChanged");
    },

    //#endregion

    //#region Grip settings

    get_rotationGripColor: function () {
        /// <summary>Gets or set the rotation grip color.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of the rotation grip.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.RotationGripColor">Canvas.RotationGripColor</see> server-side member.</para></remarks>
        return this._rotationGripColor;
    },

    set_rotationGripColor: function (v) {
        this._rotationGripColor = v;
        this._needRedraw = true;
    },

    get_resizeGripColor: function () {
        /// <summary>Gets or set the resize grip color.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of the resize grip.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ResizeGripColor">Canvas.ResizeGripColor</see> server-side member.</para></remarks>
        return this._resizeGripColor;
    },

    set_resizeGripColor: function (v) {
        this._resizeGripColor = v;
        this._needRedraw = true;
    },

    get_rotationGripSize: function () {
        /// <summary>Gets or set the rotation grip width.</summary>
        /// <value type="Number">The width of the rotation grip.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.RotationGripSize">Canvas.RotationGripSize</see> server-side member.</para></remarks>
        return this._rotationGripSize;
    },

    set_rotationGripSize: function (v) {
        this._rotationGripSize = v;
        this._needRedraw = true;
    },

    get_resizeGripSize: function () {
        /// <summary>Gets or set the resize grip width.</summary>
        /// <value type="Number">The width of the resize grip.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ResizeGripSize">Canvas.ResizeGripSize</see> server-side member.</para></remarks>
        return this._resizeGripSize;
    },

    set_resizeGripSize: function (v) {
        this._resizeGripSize = v;
        this._needRedraw = true;
    },

    get_resizeGripLineColor: function () {
        return this._resizeGripLineColor;
    },

    set_resizeGripLineColor: function (value) {
        this._resizeGripLineColor = value;
        this._needRedraw = true;
    },

    get_rotationGripLineColor: function () {
        return this._rotationGripLineColor;
    },

    set_rotationGripLineColor: function (value) {
        this._rotationGripLineColor = value;
        this._needRedraw = true;
    },

    get_rotationGripLineLength: function () {
        return this._rotationGripLineLength;
    },

    set_rotationGripLineLength: function (value) {
        this._rotationGripLineLength = value;
        this._needRedraw = true;
    },

    get_buttonGroupCssClass: function () {
        return this._buttonGroupCssClass;
    },

    set_buttonGroupCssClass: function (value) {
        this._buttonGroupCssClass = value;
    },

    get_selectButtonCssClass: function () {
        return this._selectButtonCssClass;
    },

    set_selectButtonCssClass: function (value) {
        this._selectButtonCssClass = value;
    },

    get_editButtonCssClass: function () {
        return this._editButtonCssClass;
    },

    set_editButtonCssClass: function (value) {
        this._editButtonCssClass = value;
    },

    get_doneButtonCssClass: function () {
        return this._doneButtonCssClass;
    },

    set_doneButtonCssClass: function (value) {
        this._doneButtonCssClass = value;
    },

    get_selectButtonTitle: function () {
        return this._selectButtonTitle;
    },

    set_selectButtonTitle: function (value) {
        value = value != null ? value : "";
        if (this.get_selectButtonTitle() !== value) {
            this._selectButtonTitle = value;
            this.updatePlaceholderButtonGroups();
        }
    },

    get_editButtonTitle: function () {
        return this._editButtonTitle;
    },

    set_editButtonTitle: function (value) {
        value = value != null ? value : "";
        if (this.get_editButtonTitle() !== value) {
            this._editButtonTitle = value;
            this.updatePlaceholderButtonGroups();
        }
    },

    get_doneButtonTitle: function () {
        return this._doneButtonTitle;
    },

    set_doneButtonTitle: function (value) {
        value = value != null ? value : "";
        if (this.get_doneButtonTitle() !== value) {
            this._doneButtonTitle = value;
            this.updatePlaceholderButtonGroups();
        }
    },

    //#endregion

    //#region	Scale & Zoom.
    get_devicePixelRatio: function () {
        return (window.devicePixelRatio || 1);
    },

    get_screenXDpi: function () {
        /// <summary>Gets a horizontal resolution in DPI used to show the canvas in a browser.</summary>
        /// <value type="Number">The screen horizontal resolution.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ScreenXDpi">Canvas.ScreenXDpi</see> server-side member.</para></remarks>

        // as said in css spec, 1 inch = 96 css px. So we can use hardcoded constant
        this._screenXDpi = 96 * this.get_devicePixelRatio();

        return this._screenXDpi;
    },

    get_screenYDpi: function () {
        /// <summary>Gets a vertical resolution in DPI used to show the canvas in a browser.</summary>
        /// <value type="Number">The screen vertical resolution.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ScreenYDpi">Canvas.ScreenYDpi</see> server-side member.</para></remarks>

        // as said in css spec, 1 inch = 96 css px. So we can use hardcoded constant
        this._screenYDpi = 96 * this.get_devicePixelRatio();

        return this._screenYDpi;
    },

    get_zoom: function () {
        /// <summary>Gets or sets the current zoom value.</summary>
        /// <value type="Number">The current zoom value.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.Zoom">Canvas.Zoom</see> server-side member.</para></remarks>
        return this._zoom;
    },

    set_zoom: function (value, preventEvent) {
        value = this._calculateZoom(value);

        if (value !== this._zoom || this._zoom > this.get_maxZoom()) {
            this._zoom = value;

            if (!this._initialization) {
                this._updateCanvasElementSize();

                if (!preventEvent)
                    this._raiseEvent("ZoomChanged");
            }
        }
    },

    _calculateZoom: function (value) {
        if (value < 0)
            value = 0;

        var maxZoom = this.get_maxZoom();
        value = value > maxZoom ? maxZoom : value;

        return value;
    },

    get_maxZoom: function () {
        var countOfCanvases = 4;

        var _this = this;

        var getZoomForArea = function (area) {
            return Math.sqrt(area / (_this._workspaceWidth * _this._workspaceHeight * Math.pow(_this.get_screenXDpi() / 72, 2)));
        };

        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice()) {
            //3000000 - is max canvas size for iOS devices with 256mb RAM

            return getZoomForArea(3000000);
        } else {
            if (Sys.Browser.agent === Sys.Browser.InternetExplorer)
                if (Sys.Browser.version >= 9 && Sys.Browser.documentMode >= 9)
                    return Math.min(8192 / (this._workspaceWidth * this.get_screenXDpi() / 72), 8192 / (this._workspaceHeight * this.get_screenYDpi() / 72));

            if (Sys.Browser.agent === Sys.Browser.Safari) {
                var zoomByDimension = Math.min(32767 / (this._workspaceWidth * this.get_screenXDpi() / 72), 32767 / (this._workspaceHeight * this.get_screenYDpi() / 72));

                return Math.min(zoomByDimension, getZoomForArea((548 * 1024 * 1024) / countOfCanvases));
            }

            if (Sys.Browser.agent === Sys.Browser.Firefox) {
                var zoomByDimension = Math.min(32767 / (this._workspaceWidth * this.get_screenXDpi() / 72), 32767 / (this._workspaceHeight * this.get_screenYDpi() / 72));

                return Math.min(zoomByDimension, getZoomForArea((950 * 1024 * 1024) / countOfCanvases));
            }
        }

        return 2147483647; //default max int32
    },

    _updateCanvasElementSize: function () {
        //update <canvas> elements size according to zoom
        var newWidth = this.get_width();
        var newHeight = this.get_height();
        if (!this._canvasElementSize)
            this._canvasElementSize = {};
        var size = this._canvasElementSize;

        if (newWidth !== size.width || newHeight !== size.height) {
            size.width = newWidth;
            size.height = newHeight;
            var cv;
            var cvs = [this.get_bottomCanvas(), this.get_designCanvas()];
            for (var i = 0; i < cvs.length; i++) {
                cv = cvs[i];
                if (cv) {
                    cv.width = Math.round(newWidth);
                    cv.style.width = Math.round(newWidth / this.get_devicePixelRatio()) + "px";
                    cv.height = newHeight;
                    cv.style.height = Math.round(newHeight / this.get_devicePixelRatio()) + "px";
                }
            }

            this.updatePlaceholderButtonGroups();
            this._needCompleteRedraw = true;
        }
    },

    //#endregion

    //#region Selection
    updateSelection: function () {
        this._selection.update();
    },

    get_selectedVObjects: function () {
        return this._selection.get_selectedVObjects();
    },

    set_selectedVObjects: function (vObjects) {
        this._selection.set_selectedVObjects(vObjects);
    },

    isVObjectSelected: function (vObject) {
        return this._selection.isVObjectSelected(vObject);
    },

    addSelectedVObject: function (vObject) {
        this._selection.addSelectedVObject(vObject);
    },

    removeSelectedVObject: function (vObject) {
        this._selection.removeSelectedVObject(vObject);
    },

    clearSelectedVObjects: function () {
        this._selection.clearSelectedVObjects();
    },

    get_currentVObject: function () {
        /// <summary>Gets the currently selected v-object.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> which is currently selected in this canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.CurrentVObject">Canvas.CurrentVObject</see> server-side member.</para></remarks>
        return this._selection.get_currentVObject();
    },

    _onCurrentVObjectChanged: function (vObject) {
        if (vObject == null)
            this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.defaultCursor);

        this._raiseEvent("currentVObjectChanged");
    },

    //#endregion

    //#region	Data properties.

    get_layers: function () {
        /// <summary>Gets a collection of layers associated with this canvas.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" /> which represents a collection of layers associated with this canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.Layers">Canvas.Layers</see> server-side member.</para></remarks>
        return this._layers;
    },

    set_layers: function (v) {
        this._layers = v;
    },

    get_data: function (forService) {
        /// <summary>Gets or sets serialized data of this canvas.</summary>
        /// <value type="String">The string which represents a serialized data of this canvas.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.Data">Canvas.Data</see> server-side member.</para></remarks>
        var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData(this, forService);
        return JSON.stringify(data);
    },

    set_data: function (v) {
        if (v && v != "") {
            var data = JSON.parse(v);
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.applyState(data, this);
        }
    },

    //#endregion

    //#region Events

    get_returnValue: function () {
        /// <summary>Gets the value returned by a remote scripting method.</summary>
        /// <value type="String">The string returned by a remote scripting method.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ReturnValue">Canvas.ReturnValue</see> server-side member.</para></remarks>
        return this._returnValue;
    },

    invokeRemoteMethod: function (functionName, args) {
        ///	<summary>Runs the specified remote method on the server.</summary>
        /// <param name="functionName" type="String">The name of the remote method which should be run on the server.</param>
        ///	<param name="args" type="Array">The array of arguments. The first element of the array is passed into the first argument, the second element - into the second one, etc. Number of array items should be the same as a number of arguments.</param>
        ///	<returns type="Boolean"><strong>true</strong> if the method was run successfully; otherwise, <strong>false</strong>.</returns>
        this._invokeServer(null, null, functionName, args);
    },

    _invokeServer: function (obj, eventName, functionName, args) {
        var vo = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var jss = Sys.Serialization.JavaScriptSerializer;
        var isLayer = vo.Layer.isInstanceOfType(obj);
        var isCanvas = vo.Canvas.isInstanceOfType(obj);
        var isVObject = vo.VObject.isInstanceOfType(obj);
        var objIndex = -1;
        var layerIndex = -1;
        var callbackArgument = "";
        var immediately = false;
        var i;
        var l;
        if (isCanvas) {
            callbackArgument = jss.serialize(
            [eventName, functionName, "canvas", 0, 0, null]);
        } else if (isLayer) {
            layerIndex = obj.get_index();
            callbackArgument = jss.serialize(
            [eventName, functionName, "layer", layerIndex, 0, null]);
        } else if (isVObject) {
            if ((eventName == "changed") && (!this.get_canvasClientSideOptions().CallbackOnVObjectChanged)) {
                if (!functionName) {
                    return false;
                }
                eventName = null;
            }
            l = obj.get_layer();
            if (!l) return false;
            layerIndex = l.get_index();
            objIndex = obj.get_index();
            callbackArgument = jss.serialize(
            [eventName, functionName, "object", layerIndex, objIndex, args]);
        } else {
            // just a remote function call
            if (functionName) {
                callbackArgument = jss.serialize(
                [null, functionName, null, 0, 0, args]);
                immediately = true;
            }
        }

        // collect
        this._callbackCollection.push(callbackArgument);
        this._callbackArgs = jss.serialize(this._callbackCollection);

        if (this._status == vo.UpdateStatus.busy) {
            if (this._callbackTimeout) return;
            this._callbackTimeout = setTimeout(this._callbackFunctionDelegate, this._callbackDelay);
        } else {
            if (!this._callbackTimeout) {
                this._callbackTimeout = setTimeout(this._callbackFunctionDelegate, this._callbackDelay);
            }
        }

        return true;
    },

    _callbackFunction: function () {
        if (this._status == Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.busy) {
            clearTimeout(this._callbackTimeout);
            this._callbackTimeout = setTimeout(this._callbackFunctionDelegate, this._callbackDelay);
        } else {
            clearTimeout(this._callbackTimeout);
            this._callbackTimeout = null;
            this._callbackCollection = [];
            this._status = Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.busy;
            if (this._callbackCount == 0) {
                this._raiseEvent("StatusChanged");
            }
            this._callbackContext++;
            this._callbackCount++;
            // A little HACK :)
            // We call not documented function from ASP.NET.
            this._raiseEvent("invokingCallbackRequest");
            this._saveState();
            __theFormPostData = "";
            __theFormPostCollection = new Array();
            WebForm_InitCallback();
            this._callback();
            this._onSendingRequest();
        }
    },

    _callbackSuccess: function (message, context) {
        /// <param name="name" type="String" />
        /// <param name="context" type="String" />
        this._onRequestComplete();
        if (context == this._callbackContext) {
            eval(message);
            this._callbackComplete();
        }
    },

    _callbackError: function (message, context) {
        /// <param name="name" type="String" />
        /// <param name="context" type="String" />
        this._onRequestComplete();
        this._exceptionDescription = message;
        this._callbackComplete();
        this._raiseCallbackException(message);
    },

    _callbackComplete: function () {
        this._callbackCount--;
        if (this._callbackCount == 0) {
            this._status = Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.ready;
            this.redraw();

            this._raiseEvent("StatusChanged");
        }
    },

    _onSendingRequest: function () {
        var h = this.get_events().getHandler("SendingRequest");
        if (h) {
            h(this);
        }
    },

    _onRequestComplete: function () {
        var h = this.get_events().getHandler("RequestComplete");
        if (h) {
            h(this);
        }
    },

    _raiseCallbackException: function (message) {
        var h = this.get_events().getHandler("CallbackException");
        if (h) {
            h(this, message);
        } else {
            //if no exception handler throw exception
            throw message;
        }
    },

    _raiseEvent: function (name, args) {
        /// <param name="name" type="String" />
        /// <param name="args" />
        var h = this.get_events().getHandler(name);
        if (h) {
            if (args == undefined) {
                args = Sys.EventArgs.Empty;
            }
            h(this, args);
        }
    },

    add_sendingRequest: function (h) {
        /// <summary>Fires when the request is about to be sent.</summary>
        this.get_events().addHandler("SendingRequest", h);
    },

    remove_sendingRequest: function (h) {
        this.get_events().removeHandler("SendingRequest", h);
    },

    add_requestComplete: function (h) {
        /// <summary>Fires when the request is completed.</summary>
        this.get_events().addHandler("RequestComplete", h);
    },

    remove_requestComplete: function (h) {
        this.get_events().removeHandler("RequestComplete", h);
    },

    add_zoomChanged: function (h) {
        /// <summary>Fires when zoom of the canvas is changed.</summary>
        /// <remarks><para>This event corresponds to <see cref="E:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.ZoomChanged" >Canvas.ZoomChanged</see> server-side member.</para></remarks>
        this.get_events().addHandler("ZoomChanged", h);
    },

    remove_zoomChanged: function (h) {
        this.get_events().removeHandler("ZoomChanged", h);
    },

    add_statusChanged: function (h) {
        /// <summary>Fires when the bitmap status is changed.</summary>
        this.get_events().addHandler("StatusChanged", h);
    },

    remove_statusChanged: function (h) {
        this.get_events().removeHandler("StatusChanged", h);
    },

    add_callbackException: function (h) {
        /// <summary>Fires when the callback threw an exception.</summary>
        this.get_events().addHandler("CallbackException", h);
    },

    remove_callbackException: function (h) {
        this.get_events().removeHandler("CallbackException", h);
    },

    add_initialized: function (h) {
        /// <summary>Fires when the the canvas is initialized.</summary>
        this.get_events().addHandler("Initialized", h);
    },

    remove_initialized: function (h) {
        this.get_events().removeHandler("Initialized", h);
    },

    add_invokingCallbackRequest: function (h) {
        /// <summary>Fires before the callback is initiated by the canvas.</summary>
        this.get_events().addHandler("invokingCallbackRequest", h);
    },

    remove_invokingCallbackRequest: function (h) {
        this.get_events().removeHandler("invokingCallbackRequest", h);
    },

    raiseMouseMove: function (params) {
        /// <summary>Raises the mouse move event.</summary>
        /// <param name="params">The event arguments.</param>
        this._onMouseMove(params);
    },

    raiseMouseUp: function (params) {
        /// <summary>Raises the mouse up event.</summary>
        /// <param name="params">The event arguments.</param>
        this._onMouseUp(params);
    },

    raiseMouseDown: function (params) {
        /// <summary>Raises the mouse down event.</summary>
        /// <param name="params">The event arguments.</param>
        this._onMouseDown(params);
    },

    raiseDoubleClick: function (params) {
        /// <summary>Raises the double click.</summary>
        /// <param name="params">The event arguments.</param>
        this._onDoubleClick(params);
    },

    raiseKeyDown: function (params) {
        /// <summary>Raises the key down event.</summary>
        /// <param name="params">The event arguments.</param>
        //don't raise key events if they are disabled
        if (this._keyEventEnabled)
            this._onKeyDown(params);
    },

    raiseKeyUp: function (params) {
        /// <summary>Raises the key up event.</summary>
        /// <param name="params">The event arguments.</param>
        //don't raise key events if they are disabled
        if (this._keyEventEnabled)
            this._onKeyUp(params);
    },

    add_vObjectCreated: function (handler) {
        /// <summary>Fires when a v-object is created.</summary>
        this.get_events().addHandler("vObjectCreated", handler);
    },

    remove_vObjectCreated: function (handler) {
        this.get_events().removeHandler("vObjectCreated", handler);
    },

    add_currentVObjectChanged: function (handler) {
        /// <summary>Fires when the currently selected v-object is changed.</summary>
        /// <remarks><para>This event corresponds to <see cref="E:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.CurrentVObjectChanged">Canvas.CurrentVObjectChanged</see> server-side member.</para></remarks>
        this.get_events().addHandler("currentVObjectChanged", handler);
    },

    remove_currentVObjectChanged: function (handler) {
        this.get_events().removeHandler("currentVObjectChanged", handler);
    },

    add_selectedVObjectsChanged: function (handler) {
        this.get_events().addHandler("selectedVObjectsChanged", handler);
    },

    remove_selectedVObjectsChanged: function (handler) {
        this.get_events().removeHandler("selectedVObjectsChanged", handler);
    },

    add_selectedVObjectsDeleting: function (handler) {
        /// <summary>Fires when the currently selected v-object is about to be deleted.</summary>
        this.get_events().addHandler("selectedVObjectsDeleting", handler);
    },

    remove_selectedVObjectsDeleting: function (handler) {
        this.get_events().removeHandler("selectedVObjectsDeleting", handler);
    },

    add_ready: function (handler) {
        /// <summary>Fires when all objects are ready.</summary>
        this.get_events().addHandler("ready", handler);
    },

    remove_ready: function (handler) {
        this.get_events().removeHandler("ready", handler);
    },

    add_workspaceSizeChanged: function (handler) {
        /// <summary>Fires when workspace size changed.</summary>
        this.get_events().addHandler("workspaceSizeChanged", handler);
    },

    remove_workspaceSizeChanged: function (handler) {
        this.get_events().removeHandler("workspaceSizeChanged", handler);
    },

    //#endregion

    //#region Canvas elements

    _addInactiveCanvas: function () {
        if (this._id != null) {
            var id = this._id + "_inactive_" + this._inactiveCanvases.length;
            var cv = this._insertCanvas(id);
            if (cv != null) {
                this._inactiveCanvases.push(cv);
                return cv;
            }
        }

        return null;
    },

    _clearInactiveCanvases: function () {
        while (this._inactiveCanvases.length > 0) {
            var cv = this._inactiveCanvases.pop();
            if (cv.parentNode != null) {
                cv.parentNode.removeChild(cv);
            }
        }
    },

    _addActiveCanvas: function () {
        if (this._id != null) {
            var id = this._id + "_active_" + this._activeCanvases.length;
            var cv = this._insertCanvas(id);
            if (cv != null) {
                this._activeCanvases.push(cv);
                return cv;
            }
        }

        return null;
    },

    _clearActiveCanvases: function () {
        while (this._activeCanvases.length > 0) {
            var cv = this._activeCanvases.pop();
            if (cv.parentNode != null) {
                cv.parentNode.removeChild(cv);
            }
        }
    },

    _insertCanvas: function (id) {
        var cv = this._createCanvasElement(id);
        if (cv != null) {
            var width = Math.floor(this.get_width());
            var height = Math.floor(this.get_height());

            cv.width = width;
            cv.style.width = Math.floor(width / this.get_devicePixelRatio()) + "px";
            cv.height = height;
            cv.style.height = Math.floor(height / this.get_devicePixelRatio()) + "px";

            this._parent.insertBefore(cv, this.get_designCanvas());

            return cv;
        }

        return null;
    },

    _createCanvasElement: function (canvasId) {
        if (canvasId != null && this._parent != null) {
            var el = this._document.createElement("canvas");
            el.id = canvasId;
            el.width = Math.round(this.get_width());
            el.style.width = Math.round(this.get_width() / this.get_devicePixelRatio()) + "px";
            el.height = Math.round(this.get_height());
            el.style.height = Math.round(this.get_height() / this.get_devicePixelRatio()) + "px";
            el.style.position = "absolute";
            el.style.top = "0";
            el.style.left = "0";
            el.style.pointerEvents = "none";

            return el;
        }

        return null;
    },

    _addElement: function (parentElement) {
        if (this._viewer == null)
            return;

        // remove old element.
        this._removeElement();
        // add new element
        this._parent = parentElement;
        this._document = parentElement.ownerDocument;
        if (!this._document)
            return;

        this._addPlaceholderButtonGroups();

        //create canvas for bottom layers (main canvas)
        var bottomCanvas = this._createCanvasElement(this.get_bottomCanvasId());
        if (bottomCanvas != null) {
            this._parent.appendChild(bottomCanvas);
            bottomCanvas.control = this;
        }

        // design canvas
        var designCanvas = this._createCanvasElement(this.get_designCanvasId());
        if (designCanvas != null)
            this._parent.appendChild(designCanvas);

        this.set_isSquaredBackground(this.get_isSquaredBackground());

        var vObjects = this.get_allVObjects();
        for (var i = 0; i < vObjects.length; i++) {
            vObjects[i].update();
        }

        this._needCompleteRedraw = true;
    },

    _removeElement: function () {
        var canvases = [this.get_bottomCanvas(), this.get_designCanvas()];
        var parent = canvases[0] != null ? canvases[0].parentNode : null;
        if (parent != null) {
            for (var i = canvases.length - 1; i >= 0; --i) {
                var cv = canvases[i];
                if (cv != null) {
                    parent.removeChild(cv);
                }
            }
        }

        this._removePlaceholderButtonGroups();

        this._document = null;
    },

    //#endregion

    //#region Placeholder buttons

    _addPlaceholderButtonStyles: function () {
        if (this._viewer == null)
            return;

        if (this._placeholderButtonStyle != null)
            this._placeholderButtonStyle.remove();

        var jq = this._viewer._jquery;
        this._placeholderButtonStyle = jq("<style>")
            .prop("type", "text/css")
            .html(".placeholderButtonsHidden {display: none;}" +
                ".placeholderButtonsShown {display: -webkit-inline-flex;display: -ms-inline-flexbox;display: inline-flex;}")
            .appendTo("head");
    },

    _isPlaceholder: function (vObject) {
        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.isInstanceOfType(vObject);
    },

    _addPlaceholderButtonGroups: function () {
        if (this._viewer == null)
            return;

        var vObjects = this.get_allVObjects(false, Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject);
        for (var i = 0; i < vObjects.length; i++) {
            this._addPlaceholderButtonGroup(vObjects[i]);
        }
    },

    _removePlaceholderButtonGroups: function () {
        if (this._viewer == null)
            return;

        var jq = this._viewer._jquery;
        var parent = jq(this._parent);

        parent.find("div").remove();
    },

    _addPlaceholderButtonGroup: function (placeholder) {
        if (this._viewer == null || this._parent == null || placeholder == null)
            return;

        if (!placeholder._showEditButton() && !placeholder._showSelectButton())
            return;

        var jq = this._viewer._jquery;
        var parent = jq(this._parent);

        var buttonDiv = jq("<div>");
        buttonDiv.css("position", "absolute");

        var divClass = this.get_buttonGroupCssClass();

        var editDiv = jq("<div>");
        if (divClass != null && divClass !== "")
            editDiv.addClass(divClass);

        if (placeholder._showSelectButton()) {
            var selectButton = jq("<button type=\"button\">");
            selectButton.mousedown(function (e) { e.stopPropagation(); }).dblclick(function (e) { e.stopPropagation(); });
            selectButton.click(placeholder._selectButtonClickHandler);

            var selectButtonCss = this.get_selectButtonCssClass();
            if (selectButtonCss != null && selectButtonCss !== "")
                selectButton.addClass(selectButtonCss);
            else
                selectButton.text("Select");

            placeholder._selectButton = selectButton;
            editDiv.append(selectButton);
        }

        if (placeholder._showEditButton() && !placeholder.isStubOrEmpty()) {
            placeholder._editButton = this._addEditButton(editDiv);
            placeholder._editButton.click(placeholder._editButtonClickHandler);
        }
        buttonDiv.append(editDiv);

        var doneDiv = jq("<div>");
        if (divClass != null && divClass !== "")
            doneDiv.addClass(divClass);

        if (placeholder._showEditButton()) {
            var doneButton = jq("<button type=\"button\">");
            doneButton.mousedown(function (e) { e.stopPropagation(); }).dblclick(function (e) { e.stopPropagation(); });
            doneButton.click(placeholder._editButtonClickHandler);

            var doneButtonCss = this.get_doneButtonCssClass();
            if (doneButtonCss != null && doneButtonCss !== "")
                doneButton.addClass(doneButtonCss);
            else
                doneButton.text("Done");

            placeholder._doneButton = doneButton;
            doneDiv.append(doneButton);
        }
        buttonDiv.append(doneDiv);

        parent.append(buttonDiv);

        placeholder._buttonGroup = buttonDiv;
        placeholder._editButtonGroup = editDiv;
        placeholder._doneButtonGroup = doneDiv;

        this._updatePlaceholderButtonGroup(placeholder);
    },

    _addEditButton: function (div) {
        if (this._viewer == null || this._parent == null)
            return null;

        var jq = this._viewer._jquery;

        var editButton = jq("<button type=\"button\">");
        editButton.mousedown(function (e) { e.stopPropagation(); }).dblclick(function (e) { e.stopPropagation(); });

        var editButtonCss = this.get_editButtonCssClass();
        if (editButtonCss != null && editButtonCss !== "")
            editButton.addClass(editButtonCss);
        else
            editButton.text("Edit");

        div.append(editButton);
        return editButton;
    },

    _removePlaceholderButtonGroup: function (placeholder) {
        if (placeholder == null || placeholder._buttonGroup == null)
            return;

        var buttons = [placeholder._selectButton, placeholder._editButton, placeholder._doneButton];
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            if (button == null)
                continue;

            button.unbind("click");
            button.unbind("mousedown");
            button.unbind("dblclick");
        }
        placeholder._buttonGroup.remove();

        placeholder._buttonGroup = null;
        placeholder._editButtonGroup = null;
        placeholder._doneButtonGroup = null;
        placeholder._selectButton = null;
        placeholder._editButton = null;
        placeholder._doneButton = null;
    },

    updatePlaceholderButtonGroups: function () {
        var vObjects = this.get_allVObjects(false, Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject);
        for (var i = 0; i < vObjects.length; i++) {
            this._updatePlaceholderButtonGroup(vObjects[i]);
        }
    },

    _updatePlaceholderButtonGroup: function (placeholder) {
        if (placeholder == null || placeholder._buttonGroup == null)
            return;

        if (!placeholder.isVisible() || placeholder.isLocked()) {
            placeholder._buttonGroup.css("visibility", "hidden");
            return;
        }

        placeholder._buttonGroup.css("visibility", "visible");

        var value = this.isVObjectSelected(placeholder) ? "auto" : "none";
        placeholder._buttonGroup.css({ "pointer-events": value });

        if (placeholder._showEditButton()) {
            if (!placeholder.isStubOrEmpty() && placeholder._editButton == null) {
                placeholder._editButton = this._addEditButton(placeholder._editButtonGroup);
                placeholder._editButton.click(placeholder._editButtonClickHandler);
            } else if (placeholder.isStubOrEmpty() && placeholder._editButton != null) {
                placeholder._editButton.remove();
                placeholder._editButton = null;
            }
        }

        if (!placeholder.get_editing() && (placeholder.isStubOrEmpty() || this.isVObjectSelected(placeholder)) && (placeholder._showSelectButton() || this.isVObjectSelected(placeholder)))
            placeholder._editButtonGroup.removeClass("placeholderButtonsHidden").addClass("placeholderButtonsShown");
        else
            placeholder._editButtonGroup.removeClass("placeholderButtonsShown").addClass("placeholderButtonsHidden");

        if (placeholder.get_editing())
            placeholder._doneButtonGroup.removeClass("placeholderButtonsHidden").addClass("placeholderButtonsShown");
        else
            placeholder._doneButtonGroup.removeClass("placeholderButtonsShown").addClass("placeholderButtonsHidden");

        if (placeholder._selectButton != null)
            placeholder._selectButton.attr("title", this.get_selectButtonTitle());

        if (placeholder._editButton != null) {
            placeholder._editButton.prop("disabled", placeholder.isStubOrEmpty() || this.isVObjectSelected(placeholder) && this.get_selectedVObjects().get_count() > 1);
            placeholder._editButton.attr("title", this.get_editButtonTitle());
        }

        if (placeholder._doneButton != null)
            placeholder._doneButton.attr("title", this.get_doneButtonTitle());

        this._updatePlaceholderButtonGroupPosition(placeholder);
    },

    _updatePlaceholderButtonGroupPosition: function (placeholder) {
        if (this._viewer == null || this._parent == null || placeholder == null || placeholder._buttonGroup == null)
            return;

        var jq = this._viewer._jquery;
        var offset = jq(this._parent.parentElement).position();

        var rect = placeholder.get_rectangle();
        var center = this._viewer.workspaceToControlPoint(new Aurigma.GraphicsMill.PointF(rect.CenterX, rect.CenterY));
        var x = (center.x - placeholder._buttonGroup.outerWidth() / 2 - offset.left);
        var y = (center.y - placeholder._buttonGroup.outerHeight() / 2 - offset.top);

        placeholder._buttonGroup.css({ left: x, top: y, position: "absolute" });
    },

    _placeholderButtonGroupHitTest: function (placeholder, pt) {
        if (this._viewer == null || this._parent == null || placeholder == null || placeholder._buttonGroup == null)
            return false;

        var divContentRect = this._getPlaceholderButtonGroupRect(placeholder._buttonGroup);

        return divContentRect.contains(pt);
    },

    _getPlaceholderButtonGroupRect: function (div) {
        var jq = this._viewer._jquery;
        var offset = jq(this._parent.parentElement).position();

        var divPosition = div.position();
        var divLeft = divPosition.left + offset.left;
        var divTop = divPosition.top + offset.top;
        var divWidth = div.outerWidth();
        var divHeight = div.outerHeight();
        var divRect = new Aurigma.GraphicsMill.Rectangle(divLeft, divTop, divWidth, divHeight);

        var rect = this._viewer.controlToWorkspaceRectangle(divRect);
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(rect.x, rect.y, rect.width, rect.height);
    },

    _insertPlaceholderButtonGroupAfter: function (placeholder, canvas) {
        if (this._viewer == null || placeholder == null || placeholder._buttonGroup == null)
            return false;

        var jq = this._viewer._jquery;
        placeholder._buttonGroup.insertAfter(jq(canvas));
        return true;
    },

    //#endregion

    //#region Draw routines.

    redraw: function (redrawAll) {
        /// <summary>Redraws the canvas.</summary>
        if (this.get_isInitialized() && !this.get_isUpdating() && !this._initialization) {
            try {
                if (this._needCompleteRedraw || redrawAll) {
                    if (this._pendingRedrawTimeout)
                        this._pendingRedrawTimeout = null;

                    this._redrawAllCanvases();
                }
                else if (this._needRedraw) {
                    this._redrawActiveCanvas();
                }
            } catch (ex) {
                if (ex.name === "NS_ERROR_FAILURE") {
                    if (window.console && typeof window.console.warn == "function")
                        console.warn("canvas failure in canvas.redraw %s", ex);
                } else
                    throw ex;
            }
        }
    },

    // Redraw ACTIVE and DESIGN canvases only
    _redrawActiveCanvas: function () {
        if (this._activeCanvases.length === 0 && !this._selection._needRedraw)
            return;

        var designCanvas = this.get_designCanvas();
        if (designCanvas == null)
            return;

        var designCtx = this._getScaledContext(designCanvas);
        if (designCtx == null)
            return;

        var activeContexts = [];
        for (var i = 0; i < this._activeCanvases.length; i++) {
            var ctx = this._getScaledContext(this._activeCanvases[i]);
            activeContexts.push(ctx);
        }

        var layers = this.get_layers();
        for (var i = 0, imax = layers.get_count() ; i < imax; i++) {
            var layer = layers.get_item(i);
            if (layer.get_visible()) {
                var vObjects = layer.get_vObjects();
                for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                    var vo = vObjects.get_item(j);
                    if (vo.get_visible() && !vo.get_permissions().get_noShow()) {
                        var voCanvasIndex = vo._activeCanvasIndex;
                        if (this.isVObjectSelected(vo) && voCanvasIndex !== -1) {
                            vo.draw(activeContexts[voCanvasIndex], true);
                        }
                    }
                }
            }
        }

        this._selection.draw(designCtx);

        for (var i = 0; i < activeContexts.length; i++) {
            activeContexts[i].restore();
        }

        designCtx.restore();
    },

    _redrawAllCanvases: function () {
        this._needCompleteRedraw = false;

        var bottomCanvas = this.get_bottomCanvas(),
	        designCanvas = this.get_designCanvas();

        if (bottomCanvas == null || designCanvas == null)
            return;

        var bottomCtx = this._getScaledContext(bottomCanvas),
	        designCtx = this._getScaledContext(designCanvas);

        if (bottomCtx == null || designCtx == null)
            return;

        this._clearActiveCanvases();
        this._clearInactiveCanvases();

        this._drawMargins(bottomCtx);

        if (this._status !== Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.busy) {
            var currentCanvas = bottomCanvas;
            var currentCtx = bottomCtx, isCtxActive = false, activeCanvasIndex = -1;

            var containsPlaceholder = false;

            var layers = this.get_layers();
            for (var i = 0, imax = layers.get_count() ; i < imax; i++) {
                var layer = layers.get_item(i);
                if (layer.get_visible()) {
                    var vObjects = layer.get_vObjects();
                    for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                        var vo = vObjects.get_item(j);
                        if (vo.get_visible() && !vo.get_permissions().get_noShow()) {
                            if (this.isVObjectSelected(vo)) {
                                if (!isCtxActive) {
                                    currentCtx.restore();
                                    currentCanvas = this._addActiveCanvas();
                                    currentCtx = this._getScaledContext(currentCanvas);
                                    isCtxActive = true;
                                    activeCanvasIndex = this._activeCanvases.length - 1;
                                }

                                vo.draw(currentCtx, true);

                                if (this._isPlaceholder(vo))
                                    this._insertPlaceholderButtonGroupAfter(vo, designCanvas);
                            } else {
                                if (isCtxActive || containsPlaceholder) {
                                    currentCtx.restore();
                                    currentCanvas = this._addInactiveCanvas();
                                    currentCtx = this._getScaledContext(currentCanvas);
                                    isCtxActive = false;
                                    activeCanvasIndex = -1;
                                    containsPlaceholder = false;
                                }

                                vo.draw(currentCtx, false);

                                if (this._isPlaceholder(vo))
                                    containsPlaceholder = this._insertPlaceholderButtonGroupAfter(vo, currentCanvas);
                            }

                            vo._activeCanvasIndex = activeCanvasIndex;
                        }
                    }
                }
            }

            this._selection.draw(designCtx);

            currentCtx.restore();
        }

        bottomCtx.restore();
        designCtx.restore();
    },

    _getScaledContext: function (cv) {
        if (cv == null)
            return null;

        var ctx = cv.getContext("2d");

        if (ctx == null)
            return null;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.clearCanvas(ctx);
        ctx.save();

        var scaleX = this.get_screenXDpi() * this._zoom / 72,
            scaleY = this.get_screenYDpi() * this._zoom / 72;

        ctx.scale(scaleX, scaleY);

        return ctx;
    },

    _drawMargins: function (ctx) {
        // Draw margins.
        var hm = this.get_leftRightMargin();
        var vm = this.get_topBottomMargin();
        var ww = this.get_workspaceWidth();
        var wh = this.get_workspaceHeight();
        var g = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        // for drawing into pixel units.
        var mul = this._get_mul();
        var mw = this.get_marginWidth() / mul;
        var mc = this.get_marginColor();

        if (hm !== 0 && vm !== 0 && ww >= hm * 2 && wh >= vm * 2 && mw > 0) {
            g.drawLine(ctx, hm, vm, hm, wh - vm, mw, mc);
            g.drawLine(ctx, hm, vm, ww - hm, vm, mw, mc);
            g.drawLine(ctx, ww - hm, wh - vm, hm, wh - vm, mw, mc);
            g.drawLine(ctx, ww - hm, wh - vm, ww - hm, vm, mw, mc);
        }
    },

    _drawWaitClock: function (ctx, center) {
        var mul = this._get_mul();
        var rect = { Angle: 0 };
        rect.CenterX = center.X || 0;
        rect.CenterY = center.Y || 0;
        rect.Width = this._waitClockImage.width / mul;
        rect.Height = this._waitClockImage.height / mul;
        if (this._waitClockImage.complete) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawImage(ctx, this._waitClockImage, rect, mul, mul);
        }
    },

    workspaceToControl: function (pt) {
        /// <summary>Translates coordinates from the workspace-related coordinate system to the control-related one.</summary>
        /// <param name="pt" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">Coordinates in the workspace coordinate system.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> in the control coordinate system.</returns>
        var pt1 = pt.clone();
        var scale = this.get_screenXDpi() / 72 * this.get_zoom();
        pt1.scale(scale, scale);
        return pt1.round();
    },

    controlToWorkspace: function (pt) {
        /// <summary>Translates coordinates from the control-related coordinate system to the workspace-related one.</summary>
        /// <param name="pt" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">Coordinates in the control coordinate system.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" />  in the workspace coordinate system.</returns>
        var pt1 = pt.clone();
        var scale = 72 / (this.get_screenXDpi() * this.get_zoom());
        pt1.scale(scale, scale);
        return pt1;
    },

    _onClick: function (e) {
        e.type = "click";
        if (e.x && e.y) {
            this._processMouseEvent(e);
        }
    },

    _onKeyDown: function (e) {
        e.type = "keydown";
        this._processKeyEvent(e);
    },

    _onKeyUp: function (e) {
        e.type = "keyup";
        this._processKeyEvent(e);
    },

    /**
     *
     * @param {JQueryEvent} e
     * @returns {boolean}
     */
    _isPrimaryPointer: function (e) {
        var originalEvent = e.originalEvent;

        if (originalEvent instanceof MouseEvent && (originalEvent.button != null || originalEvent.which != null)) {
            return originalEvent.button != null ? originalEvent.button === 0 : originalEvent.which === 1;
        } else if (originalEvent instanceof TouchEvent) {
            return originalEvent.touches.length === 1 || originalEvent.touches.length === 0;
        } else if (originalEvent instanceof PointerEvent) {
            return originalEvent.isPrimary;
        } else {
            return e.which > 0 && e.which === 1;
        }
    },

    _onMouseMove: function (e) {
        e.type = "mousemove";
        if (e.x && e.y) {
            this._processMouseEvent(e);
        }
    },

    _onMouseUp: function (e) {
        e.type = "mouseup";
        if (e.x && e.y && this._isPrimaryPointer(e)) {
            this._processMouseEvent(e);
        }
    },

    _onMouseDown: function (e) {
        e.type = "mousedown";
        if (e.x && e.y && this._isPrimaryPointer(e)) {
            this._processMouseEvent(e);
        }
    },

    _onDoubleClick: function (e) {
        e.type = "dblclick";
        if (e.x && e.y) {
            this._processMouseEvent(e);
        }
    },

    //#endregion

    //#region	Main events processing function

    getVObjectByHitTest: function (pt) {
        for (var i = this.get_layers().get_count() - 1; i >= 0; i--) {
            var layer = this.get_layers().get_item(i);
            if (layer.get_visible() && !layer.get_locked()) {
                for (var j = layer.get_vObjects().get_count() - 1; j >= 0; j--) {
                    var vo = layer.get_vObjects().get_item(j);
                    if (vo.get_visible() && !vo.get_locked() && !vo.get_permissions().get_noShow()) {
                        var selected = this.isVObjectSelected(vo);
                        var ht = vo.hitTest(pt, selected);
                        if (ht.body)
                            return vo;
                    }
                }
            }
        }

        return null;
    },

    _processKeyEvent: function (e) {
        if (e.type !== "keydown" && e.type !== "keyup")
            return;

        if (e.type === "keydown" && e.keyCode === Sys.UI.Key.del) {
            this.deleteSelectedVObjects(true);
        } else {
            this._selection.processKeyEvent(e);
            this.redraw();
        }
    },

    _processMouseEvent: function (e) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var pt = new ns.Math.PointF(e.x, e.y);

        var vObject = this.getVObjectByHitTest(pt);
        var placeholderButtonHitTest = vObject != null && this._isPlaceholder(vObject) && this._placeholderButtonGroupHitTest(vObject, pt);
        var ht = this._selection.hitTest(pt);

        if (e.type === "mousedown" || e.type === "dblclick") {
            var isMultiselection = (e.ctrlKey || e.metaKey) && this.get_multipleSelectionEnabled();

            if (vObject != null) {
                if (this.isVObjectSelected(vObject)) {
                    if (isMultiselection)
                        this.removeSelectedVObject(vObject);
                    else
                        this._selection.set_currentVObject(vObject);
                } else if (!ht.resize && !ht.rotate) {
                    if (isMultiselection)
                        this.addSelectedVObject(vObject);
                    else {
                        if (placeholderButtonHitTest && Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 11 || Sys.Browser.documentMode < 11)) {
                            vObject._onSelectButtonClick();
                            return;
                        }

                        this.set_selectedVObjects([vObject]);
                    }
                }
            } else if (!ht.body && !ht.resize && !ht.rotate) {
                this.clearSelectedVObjects();
            }

            this._mouseDownTimeStamp = new Date().getTime();

            if (e.type === "dblclick" && this.get_currentVObject() != null)
                this.get_currentVObject()._dispatchDoubleClickEvent(e);
        } else if (e.type === "mouseup") {
            delete this._mouseDownTimeStamp;
            delete this._cursor;
        } else if (e.type === "mousemove") {
            var vObjects = this.get_allVObjects(true, ns.PlaceholderVObject);
            for (var i = 0; i < vObjects.length; i++) {
                var vo = vObjects[i];
                if (!this.isVObjectSelected(vo) && vo._buttonGroup != null)
                    vo._buttonGroup.css({ "pointer-events": "none" });
            }

            if (placeholderButtonHitTest)
                vObject._buttonGroup.css({ "pointer-events": "auto" });

            if (this._mouseDownTimeStamp != null && new Date().getTime() - this._mouseDownTimeStamp < this.get_mouseMoveTimeout())
                return;
        }

        var cursor = this._cursor;
        var onBody = cursor != null; //set cursor on body while mouse button is pressed
        if (cursor == null) {
            if (!ht.resize && !ht.rotate && vObject != null && !this.isVObjectSelected(vObject) && !placeholderButtonHitTest)
                cursor = Aurigma.GraphicsMill.Cursor.pointer;
            else if (placeholderButtonHitTest)
                cursor = Aurigma.GraphicsMill.Cursor.defaultCursor;
            else
                cursor = this._selection.get_cursor(pt);
        }
        this._viewer.set_cursor(cursor, onBody);

        if (e.type !== "mousemove")
            this._cursor = e.type === "mousedown" ? cursor : null;

        this._selection.processMouseEvent(e);

        if (e.type === "mousemove" && this._needMouseMoveRedrawTimeout()) {
            var cv = this;
            if (cv._mouseMoveRedrawTimeout == null) {
                cv._mouseMoveRedrawTimeout = setTimeout(function () {
                    cv.redraw();
                    cv._mouseMoveRedrawTimeout = null;
                }, 15);
            }
        } else
            this.redraw();
    },

    _needMouseMoveRedrawTimeout: function () {
        if (Aurigma.GraphicsMill.Utils.Platform.IsGoogleChrome() || Aurigma.GraphicsMill.Utils.Platform.IsSafari())
            return false;

        var selectedVObjects = this.get_selectedVObjects();
        for (var i = 0; i < selectedVObjects.get_count() ; i++) {
            var vObject = selectedVObjects.get_item(i);
            if (vObject instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject && vObject._isHuge)
                return true;
        }

        return false;
    },

    isResizing: function () {
        return this._selection.isResizing();
    },

    initialize: function () {
        /// <summary>Initializes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> object.</summary>

        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice())
            this.set_rotationGripSize(20);

        this._onSelectedVObjectsChangedDelegate = Function.createDelegate(this, function () {
            this.updatePlaceholderButtonGroups();
            this._selection.update();
            this._raiseEvent("selectedVObjectsChanged");
        });

        this.get_selectedVObjects().add_itemAdded(this._onSelectedVObjectsChangedDelegate);
        this.get_selectedVObjects().add_itemRemoved(this._onSelectedVObjectsChangedDelegate);

        this._onSelectedVObjectsDeletingDelegate = Function.createDelegate(this, this._deleteSelectedVObjectsWithoutConfirm);

        this._waitClockImage = new Image();
        this._waitClockImage.src = this._loadingImageUrl;
        this._callbackFunctionDelegate = Function.createDelegate(this, this._callbackFunction);
        this._document = document;
        if (!this._redrawDelegate)
            this._redrawDelegate = Function.createDelegate(this, this._redrawActiveCanvas);
        if (!this._redrawAllCanvasesDelegate)
            this._redrawAllCanvasesDelegate = Function.createDelegate(this, this._redrawAllCanvases);
        // recreate element;
        var p = this.get_bottomCanvas().parentNode;
        this._addElement(p);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.callBaseMethod(this, "initialize");
        this.redraw(true);
        this._saveState();
        this._raiseEvent("Initialized", null);

        this._checkReady();
    },

    checkReady: function () {
        this._ready = false;
        this._checkReady();
    },

    _checkReady: function () {
        if (this._ready) {
            return;
        }
        var layers = this.get_layers();
        var notReadyVObjects = [];
        for (var i = 0, imax = layers.get_count() ; i < imax; i++) {
            var vObjects = layers.get_item(i).get_vObjects();
            for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                var vObject = vObjects.get_item(j);
                if (!vObject.get_ready()) {
                    notReadyVObjects.push(vObject);
                }
            }
        }

        if (notReadyVObjects.length === 0) {
            this._ready = true;
            this._raiseEvent("ready");
        }
        else {
            var handler = Function.createDelegate(this, function (sender, e) {
                for (var i = 0, imax = notReadyVObjects.length; i < imax; i++) {
                    if (notReadyVObjects[i] == sender) {
                        notReadyVObjects[i].remove_ready(handler);
                        notReadyVObjects.splice(i, 1);
                        break;
                    }
                }
                if (notReadyVObjects.length === 0) {
                    this._ready = true;
                    this._raiseEvent("ready");
                }
            });
            for ((i = 0, imax = notReadyVObjects.length) ; i < imax; i++) {
                notReadyVObjects[i].add_ready(handler);
            }
        }
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> from the application.</summary>
        this._callbackFunctionDelegate = null;
        this.get_selectedVObjects().remove_itemAdded(this._onSelectedVObjectsChangedDelegate);
        this.get_selectedVObjects().remove_itemRemoved(this._onSelectedVObjectsChangedDelegate);
        delete this._onSelectedVObjectsChangedDelegate;
        delete this._onSelectedVObjectsDeletingDelegate;
        if (this._redrawDelegate)
            this._redrawDelegate = null;
        if (this._redrawAllCanvasesDelegate)
            delete this._redrawAllCanvasesDelegate;
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.callBaseMethod(this, "dispose");
    },

    _saveState: function () {
        $get(this._hiddenFieldID).value = this.get_data();
    },

    hitTestSelection: function (rect, point) {
        var math = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var result = {};
        var m = new math.Matrix();
        if (rect.Angle !== 0) {
            m.rotate(-rect.Angle);
        }
        m.translate(-rect.CenterX, -rect.CenterY);
        point = m.transformPoint(point, true);

        var w = rect.Width,
            h = rect.Height;

        var mul = this._get_mul();

        // check body
        result.body = new math.RectangleF(-w / 2, -h / 2, w, h).contains(point);

        // check resize
        result.resize = false;
        result.resizeIndex = 0;
        var resizeGripSize = Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice() ? 33 : this.get_resizeGripSize();
        var r = resizeGripSize / mul,
            r2 = r / 2;
        var resizeGrips = [
            null, // Grips index starts from 1
            new math.RectangleF(-w / 2 - r2, -h / 2 - r2, r, r),
            new math.RectangleF(w / 2 - r2, -h / 2 - r2, r, r),
            new math.RectangleF(w / 2 - r2, h / 2 - r2, r, r),
            new math.RectangleF(-w / 2 - r2, h / 2 - r2, r, r),
            new math.RectangleF(-w / 2 - r2, 0 - r2, r, r),
            new math.RectangleF(0 - r2, -h / 2 - r2, r, r),
            new math.RectangleF(w / 2 - r2, 0 - r2, r, r),
            new math.RectangleF(0 - r2, h / 2 - r2, r, r)
        ];
        for (var i = 1, imax = resizeGrips.length; i < imax; i++) {
            if (resizeGrips[i].contains(point)) {
                result.resize = true;
                result.resizeIndex = i;
                break;
            }
        }

        // check rotate

        // always draw the rotation grip on the top edge of the v-object
        if (h < 0)
            h = -h;

        result.rotate = false;
        result.rotateIndex = 0;
        r = this.get_rotationGripSize() / mul;
        var cx = 0;
        var cy = -h / 2 - this.get_rotationGripLineLength() / mul - r;
        var tx = point.X - cx;
        var ty = point.Y - cy;
        if (tx * tx + ty * ty < r * r) {
            result.rotate = true;
            result.rotateIndex = 6;
        }

        return result;
    },

    _get_mul: function () {
        return this.get_zoom() * Math.max(this.get_screenXDpi() / 72, this.get_screenYDpi() / 72) / this.get_devicePixelRatio();
    },

    drawSelection: function (ctx, rect, options) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var mul = this._get_mul();
        var gr = ns.Graphics;

        gr.rectangle(ctx, rect, this.get_selectionWidth() / mul, this.get_selectionColor());

        options = options || {
            rotate: true,
            resize: true,
            arbitraryResize: true
        };

        if (options.rotate || options.resize || options.arbitraryResize) {
            gr.drawGrips(ctx, rect,
	        {
	            rotate: options.rotate,
	            resize: options.resize,
	            arbitraryResize: options.arbitraryResize,

	            rotationGripColor: this.get_rotationGripColor(),
	            rotationGripSize: this.get_rotationGripSize(),
	            rotationGripLineColor: this.get_rotationGripLineColor(),
	            rotationGripLineLength: this.get_rotationGripLineLength(),
	            resizeGripColor: this.get_resizeGripColor(),
	            resizeGripSize: this.get_resizeGripSize(),
	            resizeGripLineColor: this.get_resizeGripLineColor(),

	            mul: mul
	        });
        }
    },

    drawRubberband: function (ctx, rubberband) {
        var mul = this._get_mul();
        var lineWidth = 1 / mul;
        var color = "rgba(0,0,0,1)";
        var altColor = "rgba(0,0,0,0)";
        var dashWidth = 2 / mul;

        var graphics = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        graphics.drawDashedLine(ctx, rubberband.left, rubberband.top, rubberband.right, rubberband.top, lineWidth, color, altColor, dashWidth, dashWidth);
        graphics.drawDashedLine(ctx, rubberband.right, rubberband.top, rubberband.right, rubberband.bottom, lineWidth, color, altColor, dashWidth, dashWidth);
        graphics.drawDashedLine(ctx, rubberband.right, rubberband.bottom, rubberband.left, rubberband.bottom, lineWidth, color, altColor, dashWidth, dashWidth);
        graphics.drawDashedLine(ctx, rubberband.left, rubberband.bottom, rubberband.left, rubberband.top, lineWidth, color, altColor, dashWidth, dashWidth);
    }

    //#endregion
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas", Sys.Component);