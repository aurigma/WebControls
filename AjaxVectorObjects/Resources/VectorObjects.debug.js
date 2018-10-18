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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas", Sys.Component);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class exposes the property which configures callback for the <see cref="E:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.currentVObjectChanged" /> event.</para></remarks>
    /// <field name="CallbackOnVObjectChanged" type="Number" integer="true" static="true"><summary>The value which turns callback for the <see cref="E:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas.currentVObjectChanged" /> event on.</summary></field>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions.prototype = {
    CallbackOnVObjectChanged: false
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasClientSideOptions");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData = function (canvasObject, forService) {
    ///	<summary>This class represents a state of a canvas and allows applying this state to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    /// <field name="Layers" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" static="true"><summary>The collection of layers associated with this canvas.</summary></field>
    /// <field name="ScreenXDpi" type="Number" static="true"><summary>The screen horizontal resolution.</summary></field>
    /// <field name="ScreenYDpi" type="Number" static="true"><summary>The screen vertical resolution.</summary></field>
    /// <field name="Zoom" type="Number" static="true"><summary>The zoom value.</summary></field>
    /// <field name="ReturnValue" type="String" static="true"><summary>The value returned by a remote scripting method.</summary></field>
    /// <field name="PreviewColorManagementEnabled" type="Boolean" static="true"><summary>The value indicating whether to use color management when displaying images.</summary></field>
    /// <field name="PrintColorManagementEnabled" type="Boolean" static="true"><summary>The value which specifies whether to use color management when rendering the workspace.</summary></field>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.initializeBase(this);

    if (canvasObject) {
        this.RgbCPId = canvasObject._rgbColorProfileFileId;
        this.CmykCPId = canvasObject._cmykColorProfileFileId;
        this.GrayscaleCPId = canvasObject._grayscaleColorProfileFileId;
        this.PreviewCM = canvasObject.get_previewColorManagementEnabled();
        this.PrintCM = canvasObject.get_printColorManagementEnabled();
        this.PTCS = canvasObject.get_previewTargetColorSpace();
        this.Z = canvasObject.get_zoom();
        this.TDpi = canvasObject.get_targetDpi();
        this.XDpi = canvasObject.get_screenXDpi();
        this.YDpi = canvasObject.get_screenYDpi();

        if (forService === false || forService === undefined) {
            this.WW = canvasObject._workspaceWidth;
            this.WH = canvasObject._workspaceHeight;
            var layers = canvasObject.get_layers();
            this.L = [];
            this.HD = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData(canvasObject.get_history());
            for (var i = 0; i < layers.get_count() ; i++) {
                this.L.push(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(layers.get_item(i)));
            }

            this.CSO = canvasObject.get_canvasClientSideOptions();

            this.ReGC = canvasObject.get_resizeGripColor();
            this.RoGC = canvasObject.get_rotationGripColor();
            this.ReGS = canvasObject.get_resizeGripSize();
            this.RoGS = canvasObject.get_rotationGripSize();
            this.RV = canvasObject.get_returnValue();
            this.SB = canvasObject.get_isSquaredBackground();

            this.MW = canvasObject.get_marginWidth();
            this.MC = canvasObject.get_marginColor();
            this.LRM = canvasObject.get_leftRightMargin();
            this.TBM = canvasObject.get_topBottomMargin();
            this.CM = canvasObject.get_constrainedMarginEnabled();
            this.Tags = canvasObject.get_tags();
            this.LIU = canvasObject.get_loadingImageUrl();
            this.SC = canvasObject.get_selectionColor();
            this.SW = canvasObject.get_selectionWidth();
            this.ReGLC = canvasObject.get_resizeGripLineColor();
            this.RoGLC = canvasObject.get_rotationGripLineColor();
            this.RoGLL = canvasObject.get_rotationGripLineLength();

            this.BGCC = canvasObject.get_buttonGroupCssClass();
            this.SBCC = canvasObject.get_selectButtonCssClass();
            this.EBCC = canvasObject.get_editButtonCssClass();
            this.DBCC = canvasObject.get_doneButtonCssClass();

            this.SBT = canvasObject.get_selectButtonTitle();
            this.EBT = canvasObject.get_editButtonTitle();
            this.DBT = canvasObject.get_doneButtonTitle();

            this.MSE = canvasObject.get_multipleSelectionEnabled();
            this.MMT = canvasObject.get_mouseMoveTimeout();
            this.DS = canvasObject.get_disableSmoothing();
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.applyState = function (canvasData, canvasObject) {
    /// <summary>Applies the <paramref name="canvasData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" />.</summary>
    /// <param name="canvasData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData">The state to apply.</param>
    /// <param name="canvasObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">Canvas to apply the state to.</param>
    if ((canvasObject) && (canvasData)) {
        canvasObject._initialization = true;
        canvasObject.get_history().set_locked(true);

        canvasObject.set_workspaceSize(canvasData.WW, canvasData.WH);

        canvasObject.set_targetDpi(canvasData.TDpi);

        // Color profiles
        canvasObject._rgbColorProfileFileId = canvasData.RgbCPId;
        canvasObject._cmykColorProfileFileId = canvasData.CmykCPId;
        canvasObject._grayscaleColorProfileFileId = canvasData.GrayscaleCPId;

        //color management
        canvasObject.set_previewColorManagementEnabled(canvasData.PreviewCM);
        canvasObject.set_printColorManagementEnabled(canvasData.PrintCM);
        canvasObject.set_previewTargetColorSpace(canvasData.PTCS);

        var i, j, layer;
        //contain old VObjects and Layers
        var objectsHash = {};
        var putObject = function (o) {
            if (o.get_uniqueId)
                objectsHash[o.get_uniqueId()] = o;
        }

        var ls = canvasObject.get_layers();
        for (i = 0, lscnt = ls.get_count() ; i < lscnt; i++) {
            layer = ls.get_item(i);
            //save Layer
            putObject(layer);
            var objs = layer.get_vObjects();
            for (j = 0, objscnt = objs.get_count() ; j < objscnt; j++) {
                //save VObject
                putObject(objs.get_item(j));
            }
            objs.clear();
        }
        ls.clear();
        var layerData;
        for (var i = 0; i < canvasData.L.length; i++) {
            layerData = canvasData.L[i];
            layer = objectsHash[layerData.ID] || new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer();
            //exclude Layer object from hash
            objectsHash[layerData.ID] = null;
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState(canvasData.L[i], layer, objectsHash);
            canvasObject.get_layers().add(layer);
        }

        //dispose unused objects
        for (var k in objectsHash) {
            var o = objectsHash[k];
            if (o)
                o.dispose();
        }
        delete objectsHash;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData.applyState(canvasData.HD, canvasObject.get_history());
        canvasObject.get_history().set_locked(false);
        canvasObject._returnValue = canvasData.RV;
        canvasObject._canvasClientSideOptions = canvasData.CSO;
        canvasObject.initialization = true;
        canvasObject.set_resizeGripColor(canvasData.ReGC);
        canvasObject.set_rotationGripColor(canvasData.RoGC);
        canvasObject.set_resizeGripSize(canvasData.ReGS);
        canvasObject.set_rotationGripSize(canvasData.RoGS);
        canvasObject.set_isSquaredBackground(canvasData.SB);
        canvasObject.set_marginColor(canvasData.MC);
        canvasObject.set_marginWidth(canvasData.MW);
        canvasObject.set_leftRightMargin(canvasData.LRM);
        canvasObject.set_topBottomMargin(canvasData.TBM);
        canvasObject.set_constrainedMarginEnabled(canvasData.CM);
        canvasObject.set_tags(canvasData.Tags);
        canvasObject.set_loadingImageUrl(canvasData.LIU);
        canvasObject.set_selectionColor(canvasData.SC);
        canvasObject.set_selectionWidth(canvasData.SW);
        canvasObject.set_resizeGripLineColor(canvasData.ReGLC);
        canvasObject.set_rotationGripLineColor(canvasData.RoGLC);
        canvasObject.set_rotationGripLineLength(canvasData.RoGLL);

        canvasObject.set_buttonGroupCssClass(canvasData.BGCC);
        canvasObject.set_selectButtonCssClass(canvasData.SBCC);
        canvasObject.set_editButtonCssClass(canvasData.EBCC);
        canvasObject.set_doneButtonCssClass(canvasData.DBCC);

        canvasObject.set_selectButtonTitle(canvasData.SBT);
        canvasObject.set_editButtonTitle(canvasData.EBT);
        canvasObject.set_doneButtonTitle(canvasData.DBT);

        canvasObject.set_multipleSelectionEnabled(canvasData.MSE);
        canvasObject.set_mouseMoveTimeout(canvasData.MMT);
        canvasObject.set_disableSmoothing(canvasData.DS);

        canvasObject._initialization = false;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.prototype = {
    L: [],

    XDpi: 72.0,
    YDpi: 72.0,
    Z: 1,
    RV: null,
    PreviewCM: false,
    PrintCM: false
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CanvasData", null);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a collection of items that can be accessed by index.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1" />
    /// <constructor>
    /// 	<summary>Creates and initializes an instance of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection" /> class.</summary>
    /// </constructor>
    this._collection = [];
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection.prototype = {
    indexOf: function (item) {
        /// <summary>Searches for the specified item and returns the zero-based index of the first occurrence within the entire collection.</summary>
        /// <param name="item" type="Type">The item to locate in the collection.</param>
        /// <returns type="Number">The zero-based index of the first occurrence of <paramref name="item" /> within the entire collection, if found; otherwise, -1.</returns>
        return Array.indexOf(this._collection, item);
    },

    contains: function (item) {
        /// <summary>Determines whether the specified item is in the collection.</summary>
        /// <param name="item" type="Type">The item to locate in the collection.</param>
        /// <returns type="Boolean"><strong>true</strong> if <paramref name="item" /> is found in the collection; otherwise, <strong>false</strong>.</returns>
        return Array.contains(this._collection, item);
    },

    addRange: function (items) {
        /// <summary>Adds the specified items to the end of the collection.</summary>
        /// <param name="item" type="Array">The array of items to be added to the end of the collection.</param>
        for (var i = 0; i < items.length; i++)
            this.add(items[i]);
    },

    add: function (item) {
        /// <summary>Adds the specified item to the end of the collection.</summary>
        /// <param name="item" type="Type">The item to be added to the end of the collection.</param>
        this.insert(this._collection.length, item);
    },

    push: function (item) {
        /// <summary>Pushes the specified item to the collection.</summary>
        /// <param name="item" type="Type">The item to push.</param>
        this.add(item);
    },

    insert: function (index, item) {
        /// <summary>Inserts the specified item into the collection at the specified index.</summary>
        /// <param name="index" type="Number">The zero-based index at which item should be inserted.</param>
        /// <param name="item" type="Type">The item to insert.</param>
        this._checkIfItemExists(item);
        if (index < 0 || index > this._collection.length)
            throw Error.argumentOutOfRange("index", index);
        Array.insert(this._collection, index, item);
        this._onItemAdded(index, item);
    },

    remove: function (item) {
        if (!this.contains(item))
            throw Error.argument("item", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemNotFoundInCollection);

        return this.removeAt(this.indexOf(item));
    },

    removeAt: function (index) {
        /// <summary>Removes the item at the specified index of the collection.</summary>
        /// <param name="index" type="Number">The zero-based index of the item to remove.</param>
        if (index < 0 || index > this._collection.length - 1)
            throw Error.argumentOutOfRange("index", index);

        var item = this._collection[index];
        this._collection.splice(index, 1);
        this._onItemRemoved(index, item);
        return item;
    },

    move: function (oldIndex, newIndex, supressEvent) {
        /// <summary>Moves an item from one position to another.</summary>
        /// <param name="oldIndex" type="Number">The zero-based index of the item to move.</param>
        /// <param name="newIndex" type="Number">The zero-based index to move the item to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1.Move(System.Int32,System.Int32)">Collection.Move(Int32, Int32)</see> server-side member.</para></remarks>
        if (!(typeof supressEvent == "boolean"))
            supressEvent = false;

        var item = this._collection[oldIndex];
        if (item && oldIndex >= 0 && newIndex >= 0 && oldIndex != newIndex) {
            this._collection.splice(oldIndex, 1);
            Array.insert(this._collection, newIndex, item);

            if (!supressEvent)
                this._onItemMoved(oldIndex, newIndex);
        }
        return item;
    },

    clear: function () {
        /// <summary>Removes all items from the collection.</summary>
        for (var cnt = this.get_count() - 1, i = cnt; i >= 0; i--) {
            this.removeAt(i);
        }
    },

    get_count: function () {
        /// <summary>Gets the number of items actually contained in the collection.</summary>
        /// <value type="Number">The number of items actually contained in the collection.</value>
        return this._collection.length;
    },

    get_item: function (index) {
        /// <summary>Gets the item at the specified index.</summary>
        /// <param name="index" type="Number">The zero-based index of the item to get.</param>
        /// <value type="Type">The item at the specified index.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection`1.Item(System.Int32)">Item(Int32)</see> server-side member.</para></remarks>
        return this._collection[index];
    },

    toArray: function () {
        return this._collection.slice();
    },

    _checkIfItemExists: function (item) {
        if (Array.contains(this._collection, item)) {
            throw Error.argument("item",
				Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemBelongsCollection);
        }
    },

    _onItemAdded: function (index, item) {
        var h = this.get_events().getHandler("ItemAdded");
        if (h)
            h(this, { item: item, index: index });
    },

    add_itemAdded: function (h) {
        /// <summary>Fires when the an item is added to the collection.</summary>
        this.get_events().addHandler("ItemAdded", h);
    },

    remove_itemAdded: function (h) {
        this.get_events().removeHandler("ItemAdded", h);
    },

    _onItemRemoved: function (index, item) {
        var h = this.get_events().getHandler("ItemRemoved");
        if (h)
            h(this, { item: item, index: index });
    },

    add_itemRemoved: function (h) {
        /// <summary>Fires when the an item is removed from the collection.</summary>
        this.get_events().addHandler("ItemRemoved", h);
    },

    remove_itemRemoved: function (h) {
        this.get_events().removeHandler("ItemRemoved", h);
    },

    _onItemMoved: function (oldIndex, newIndex) {
        var h = this.get_events().getHandler("ItemMoved");
        if (h)
            h(this, { oldIndex: oldIndex, newIndex: newIndex });
    },

    add_itemMoved: function (h) {
        /// <summary>Fires when the an item is moved from one position to another.</summary>
        this.get_events().addHandler("ItemMoved", h);
    },

    remove_itemMoved: function (h) {
        this.get_events().removeHandler("ItemMoved", h);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection", Sys.Component);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

//#region Color
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color = function (value) {
    if (typeof value.Preview == "string" && value.Preview.length > 0)
        this.Preview = value.Preview;
    else
        this.Preview = null;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor = function (value) {
    if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.isInstanceOfType(value)) {
        return value;
    }
    if (typeof value == "object" && value != null) {
        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(value);
    }
    else if (typeof value == "string" && value.length > 0) {
        if (value.indexOf("device-cmyk") === 0)
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor(value);
        else
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor(value);
    }

    console.warn("Unable to create color from value " + value);
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data = function (data) {
    if (data.__type === "RgbColor") {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor(data);
    }
    else if (data.__type === "CmykColor") {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor(data);
    }
    else if (data.__type === "GrayscaleColor") {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor(data);
    }
    else
        throw "Unsupported color type " + data.__type;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.prototype = {
    Preview: null,

    clone: function () { },

    equals: function (color) {
        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.isInstanceOfType(color) &&
            this.Preview === color.Preview;
    },

    toString: function () {
    },

    _get_preview: function () { },

    _get_data: function () {
        var type = Object.getType(this).getName().split('.');
        type = type[type.length - 1];

        var data = this.clone();
        data.__type = type;

        return data;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color");
//#endregion

//#region RgbColor
Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor = function (value) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.initializeBase(this, [value]);

    if (typeof value == "string") {
        //try to parse named color to rgb(...)
        if (value.indexOf("#") !== 0 && value.indexOf("rgb") !== 0) {
            if (window.getComputedStyle) {
                var div = document.createElement("div");
                div.style.color = value;
                document.body.appendChild(div);
                value = window.getComputedStyle(div).color;
                document.body.removeChild(div);
            } else {
                console.warn("Unable to parse rgb color string " + value);
                return;
            }
        }

        var rgba = /^\s*rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,}(\.\d{1,})?)\s*\)\s*;{0,1}\s*$/g;
        var match = rgba.exec(value);
        if (match != null && match.length === 6) {
            var a = (+match[4] * 255).toFixed(0);
            a = Math.max(a, 0);
            a = Math.min(a, 255);

            this._init(+match[1], +match[2], +match[3], a);
            return;
        }

        var rgb = /^\s*rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)\s*;{0,1}\s*$/g;
        match = rgb.exec(value);
        if (match != null && match.length === 4) {
            this._init(+match[1], +match[2], +match[3], 255);
            return;
        }

        var shortHex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        value = value.replace(shortHex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var standardHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        match = standardHex.exec(value);
        if (match != null && match.length === 4) {
            this._init(parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16), 255);
        }
    }
    else if (typeof value.R == "number" && typeof value.G == "number" && typeof value.B == "number") {
        this._init(value.R, value.G, value.B, (typeof value.A == "number") ? value.A : 255);
    }
    else
        console.warn("Incorrect RgbColor format: " + value);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.prototype = {
    R: 0,
    G: 0,
    B: 0,
    A: 255,

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor(this);
    },

    equals: function (color) {
        var baseEquals = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.callBaseMethod(this, 'equals', [color]);
        return baseEquals && color instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor &&
            this.R === color.R && this.G === color.G && this.B === color.B && this.A === color.A;
    },

    toString: function () {
        return this._get_preview();
    },

    _get_preview: function () {
        if (this.A === 255) {
            return "rgb(" + this.R + "," + this.G + "," + this.B + ")";
        }
        else {
            var a = (this.A / 255).toFixed(7);
            return "rgba(" + this.R + "," + this.G + "," + this.B + "," + a + ")";
        }
    },

    _init: function (r, g, b, a) {
        this.R = r;
        this.G = g;
        this.B = b;
        this.A = a;

        if (this.Preview == null)
            this.Preview = this._get_preview();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color);
//#endregion

//#region CmykColor
Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor = function (value) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.initializeBase(this, [value]);

    if (typeof value == "string") {
        var cmyk = /^\s*device-cmyk\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\,\s*(\d{1,3})\s*(\,\s*(\d{1,}(\.\d{1,})?))?\s*(\,\s*(.*)\s*)?\)\s*;{0,1}\s*$/g;
        var match = cmyk.exec(value);
        if (match != null && match.length === 10) {
            var c = +match[1];
            var m = +match[2];
            var y = +match[3];
            var k = +match[4];

            var a = 255;
            if (match[6] != undefined) {
                a = (+match[6] * 255).toFixed(0);
                a = Math.max(a, 0);
                a = Math.min(a, 255);
            }

            var preview = undefined;
            if (match[9] != undefined) {
                preview = match[9];
            }

            this._init(c, m, y, k, a, preview);
        }
    }
    else if (typeof value.C == "number" && typeof value.M == "number" && typeof value.Y == "number" && typeof value.K == "number") {
        this._init(value.C, value.M, value.Y, value.K, (typeof value.A == "number") ? value.A : 255);
    }
    else
        console.warn("Incorrect CmykColor format: " + value);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.prototype = {
    C: 255,
    M: 255,
    Y: 255,
    K: 255,
    A: 255,

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor(this);
    },

    equals: function (color) {
        var baseEquals = Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.callBaseMethod(this, 'equals', [color]);
        return baseEquals && color instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor &&
            this.C === color.C && this.M === color.M && this.Y === color.Y && this.K === color.K && this.A === color.A;
    },

    toString: function () {
        var a = (this.A / 255).toFixed(7);
        return "device-cmyk(" + this.C + ", " + this.M + ", " + this.Y + ", " + this.K + ", " + a + ", " + this.Preview + ")";
    },

    _get_preview: function () {
        var r = 255 - Math.min(255, this.C * (255 - this.K) + this.K);
        var g = 255 - Math.min(255, this.M * (255 - this.K) + this.K);
        var b = 255 - Math.min(255, this.Y * (255 - this.K) + this.K);

        return (new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor({ R: r, G: g, B: b, A: this.A })).Preview;
    },

    _init: function (c, m, y, k, a, preview) {
        this.C = c;
        this.M = m;
        this.Y = y;
        this.K = k;
        this.A = a;

        if (this.Preview == null)
            this.Preview = preview != undefined ? preview : this._get_preview();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CmykColor", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color);
//#endregion

//#region Grayscale
Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor = function (value) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.initializeBase(this, [value]);

    if (typeof value.L == "number") {
        this._init(value.L, (typeof value.A == "number") ? value.A : 255);
    }
    else
        console.warn("Incorrect GrayscaleColor format: " + value);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.prototype = {
    L: 0,
    A: 255,

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor(this);
    },

    equals: function (color) {
        var baseEquals = Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.callBaseMethod(this, 'equals', [color]);
        return baseEquals && color instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor &&
            this.L === color.L && this.A === color.A;
    },

    toString: function () {
        return this._get_preview();
    },

    _get_preview: function () {
        if (this.A === 255) {
            return "rgb(" + this.L + "," + this.L + "," + this.L + ")";
        }
        else {
            var a = (this.A / 255).toFixed(7);
            return "rgba(" + this.L + "," + this.L + "," + this.L + "," + a + ")";
        }
    },

    _init: function (l, a) {
        this.L = l;
        this.A = a;

        if (this.Preview == null)
            this.Preview = this._get_preview();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.GrayscaleColor", Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color);

//#endregion﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions = {
    "itemBelongsCollection": "The item already belongs to this collection, or to another collection.",
    "itemNotFoundInCollection": "The item was not found in this collection.",
    "setPointOutOfRange": "setPoint: Index out of range.",
    "insertPointOutOfRange": "addPoint: Index out of range.",
    "removePointOutOfRange": "removePoint: Index out of range."
}﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawLine = function (ctx, x, y, x1, y1, lineWidth, lineColor, opacity) {
    if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(lineColor) && lineWidth > 0 && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawDashedLine = function (ctx, x0, y0, x1, y1, lineWidth,
	color, altColor, dashWidth, altDashWidth, opacity) {
    if (lineWidth > 0 && dashWidth > 0 && altDashWidth > 0 && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;
        ctx.lineWidth = lineWidth;

        if (x1 < x0) {
            var t = x0;
            x0 = x1;
            x1 = t;
            t = y0;
            y0 = y1;
            y1 = t;
        }

        var dx = x1 - x0;
        var dy = y1 - y0;

        var d = dashWidth + altDashWidth;
        var len = Math.sqrt(dx * dx + dy * dy);
        var dashCount = Math.floor(len / d);

        dx /= (len / d);
        dy /= (len / d);

        var dashX = dx * (dashWidth / d);
        var altDashX = dx * (altDashWidth / d);
        var dashY = dy * (dashWidth / d);
        var altDashY = dy * (altDashWidth / d);
        var x = x0;
        var y = y0;
        var i;
        if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(color)) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (i = 0; i < dashCount; i++) {
                x += dashX;
                y += dashY;
                ctx.lineTo(x, y);

                x += altDashX;
                y += altDashY;
                if (i + 1 < dashCount) {
                    ctx.moveTo(x, y);
                }
            }
            if (x + dashX <= x1 && y + dashY <= y1) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + dashX, y + dashY);
            } else {
                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);
            }
            ctx.closePath();
            ctx.stroke();
        }
        x = x0 + dashX;
        y = y0 + dashY;
        if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(altColor)) {
            ctx.strokeStyle = altColor;
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (i = 0; i < dashCount; i++) {
                x += altDashX;
                y += altDashY;
                ctx.lineTo(x, y);

                x += dashX;
                y += dashY;
                if (i + 1 < dashCount) {
                    ctx.moveTo(x, y);
                }
            }
            if (x < x1 && y < y1) {
                ctx.moveTo(x, y);
                ctx.lineTo(x1, y1);
            }
            ctx.closePath();
            ctx.stroke();
        }

        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPolyline = function (ctx, points, lineWidth, lineColor, opacity) {
    if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(lineColor) && lineWidth > 0 && (opacity == null || opacity > 0)) {
        if (points && points.length > 1) {
            ctx.save();
            if (opacity)
                ctx.globalAlpha = opacity;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = lineColor;
            ctx.beginPath();
            ctx.moveTo(points[0].X, points[0].Y);
            for (var i = 1, imax = points.length; i < imax; ++i) {
                var p = points[i];
                ctx.lineTo(p.X, p.Y);
            }
            ctx.stroke();
            ctx.restore();
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPath = function (ctx, path, center, transform, borderWidth, borderColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path(ctx, path, center, transform, null, borderWidth, borderColor, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillPath = function (ctx, path, center, transform, fillColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path(ctx, path, center, transform, fillColor, 0, null, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path = function (ctx, path, center, transform, fillColor, borderWidth, borderColor, opacity) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    var stroke = borderColor != null && !ns.Graphics.isFullTransparentColor(borderColor) && borderWidth > 0;
    var fill = fillColor != null && !ns.Graphics.isFullTransparentColor(fillColor);

    if ((stroke || fill) && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;

        var matrix = transform.toMatrix();

        ctx.translate(center.X, center.Y);
        ctx.transform(matrix.m00, matrix.m10, matrix.m01, matrix.m11, matrix.m02, matrix.m12);
        ctx.translate(-center.X, -center.Y);

        path.draw(ctx);

        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        if (stroke) {
            if (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(transform.get_scaleX(), transform.get_scaleY())) {
                ctx.restore();
                ctx.save();
                if (opacity)
                    ctx.globalAlpha = opacity;

                var transformedPath = path.clone();
                transformedPath.transform(transform, center);

                transformedPath.draw(ctx);
            } else
                borderWidth /= transform.get_scaleX();

            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.clipPath = function (ctx, path) {
    path.draw(ctx);
    ctx.clip();
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawImage = function (ctx, image, rotatedRectangle, scaleX, scaleY, disableSmoothing, maskColor, opacity) {
    if (opacity == null || opacity > 0) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;
        ctx.translate(rotatedRectangle.CenterX, rotatedRectangle.CenterY);
        ctx.rotate(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertDegreeToRadian(rotatedRectangle.Angle));

        var drawImageAsIs =
            scaleX != undefined && scaleX !== 0 &&
                scaleY != undefined && scaleY !== 0 &&
                Math.abs(image.naturalWidth - rotatedRectangle.Width * scaleX) < 1 &&
                Math.abs(image.naturalHeight - rotatedRectangle.Height * scaleY) < 1;

        if (!disableSmoothing) {
            // depend of angle if parameter not specified
            disableSmoothing = (ctx.mozImageSmoothingEnabled === true || ctx.imageSmoothingEnabled === true || ctx.msImageSmoothingEnabled === true) &&
                Math.abs(rotatedRectangle.Angle) % 90 < 0.01 && drawImageAsIs;
        }

        if (disableSmoothing) {
            ctx.mozImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        }
        try {
            if (drawImageAsIs) {
                ctx.scale(1 / scaleX, 1 / scaleY);
                ctx.drawImage(image, -rotatedRectangle.Width * scaleX / 2, -rotatedRectangle.Height * scaleY / 2, image.naturalWidth, image.naturalHeight);
                ctx.scale(scaleX, scaleY);
            } else
                ctx.drawImage(image, -rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);

            if (maskColor && !Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor(maskColor)) {
                ctx.fillStyle = maskColor;
                ctx.fillRect(-rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);
            }
        } catch (err) {
        }
        if (disableSmoothing) {
            ctx.mozImageSmoothingEnabled = true;
            ctx.imageSmoothingEnabled = true;
            ctx.msImageSmoothingEnabled = true;
        }

        ctx.restore();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawRectangle = function (ctx, rotatedRectangle, borderWidth, borderColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.rectangle(ctx, rotatedRectangle, borderWidth, borderColor, null, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillRectangle = function (ctx, rotatedRectangle, fillColor, opacity) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.rectangle(ctx, rotatedRectangle, 0, null, fillColor, opacity);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.rectangle = function (ctx, rotatedRectangle, borderWidth, borderColor, fillColor, opacity) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    var stroke = borderColor && !ns.Graphics.isFullTransparentColor(borderColor) && borderWidth > 0;
    var fill = fillColor && !ns.Graphics.isFullTransparentColor(fillColor);

    if ((stroke || fill) && (opacity == null || opacity > 0)) {
        ctx.save();
        if (opacity)
            ctx.globalAlpha = opacity;

        ctx.translate(rotatedRectangle.CenterX, rotatedRectangle.CenterY);
        ctx.rotate(ns.Math.ConvertDegreeToRadian(rotatedRectangle.Angle));

        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.fillRect(-rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);
        }

        if (stroke) {
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(-rotatedRectangle.Width / 2, -rotatedRectangle.Height / 2, rotatedRectangle.Width, rotatedRectangle.Height);
        }

        ctx.restore();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.circle = function (ctx, x, y, r, borderWidth, borderColor, fillColor) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    var stroke = borderColor != null && !ns.Graphics.isFullTransparentColor(borderColor) && borderWidth > 0;
    var fill = fillColor != null && !ns.Graphics.isFullTransparentColor(fillColor);

    if (stroke || fill) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, true);
        ctx.closePath();

        if (fill) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }

        if (stroke) {
            ctx.lineWidth = borderWidth;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }

        ctx.restore();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawGrips = function (ctx, rect, grips) {
    ctx.save();
    var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math,
		mul = (grips.mul) ? grips.mul : 1, // for drawing grips into actual (pixel) size
		points, pt, i;

    if (grips.resize) {
        points = [
			new m.PointF(-rect.Width / 2, -rect.Height / 2),
			new m.PointF(rect.Width / 2, -rect.Height / 2),
			new m.PointF(rect.Width / 2, rect.Height / 2),
			new m.PointF(-rect.Width / 2, rect.Height / 2)
        ];
        i = 0;
        while ((pt = points[i++]) != null) {
            pt.rotate(rect.Angle);
            pt.translate(rect.CenterX, rect.CenterY);
            this.rectangle(ctx, new m.RotatedRectangleF(pt.X, pt.Y, grips.resizeGripSize / mul, grips.resizeGripSize / mul, 0), 1 / mul, grips.resizeGripLineColor, grips.resizeGripColor);
        }
    }

    if (grips.arbitraryResize) {
        points = [
			new m.PointF(-rect.Width / 2, 0),
			new m.PointF(0, -rect.Height / 2),
			new m.PointF(rect.Width / 2, 0),
			new m.PointF(0, rect.Height / 2)
        ];
        i = 0;
        while ((pt = points[i++]) != null) {
            pt.rotate(rect.Angle);
            pt.translate(rect.CenterX, rect.CenterY);
            this.rectangle(ctx, new m.RotatedRectangleF(pt.X, pt.Y, grips.resizeGripSize / mul, grips.resizeGripSize / mul, 0), 1 / mul, grips.resizeGripLineColor, grips.resizeGripColor);
        }
    }

    if (grips.rotate) {
        // allways draw the rotation grip on the top edge of the v-object
        if (rect.Height < 0)
            rect.Height = -rect.Height;

        points = [
			new m.PointF(0, -rect.Height / 2),
			new m.PointF(0, -rect.Height / 2 - grips.rotationGripLineLength / mul),
			new m.PointF(0, -rect.Height / 2 - grips.rotationGripLineLength / mul - grips.rotationGripSize / mul)
        ];
        i = 0;
        while ((pt = points[i++]) != null) {
            pt.rotate(rect.Angle);
            pt.translate(rect.CenterX, rect.CenterY);
        }
        this.drawLine(ctx, points[0].X, points[0].Y, points[1].X, points[1].Y, 0.5 / mul, grips.rotationGripLineColor);
        pt = points[2];
        this.circle(ctx, pt.X, pt.Y, grips.rotationGripSize / mul, 0.5 / mul, grips.rotationGripLineColor, grips.rotationGripColor);
    }

    ctx.restore();
}

//allow to override this function for custom selection
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawSelection =
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawSelection ||
	function (ctx, rectangle, properties) {
	    //draw selection rectangle into actual size
	    var mul = (properties.mul) ? properties.mul : 1;
	    this.drawRectangle(ctx, rectangle, properties.width / mul, properties.color);
	};

//test if color is transparent
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.isFullTransparentColor = function (color) {
    if (!color)
        return false;
    //test if color as object with A, R, G, B properties
    var a = color.A || color.a;
    if (a === 0)
        return true;
    if (typeof color === "string") {
        //parse string
        var rgba = /^\s*rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\,\s*(\d{1,}(\.\d{1,})?)\s*\)\s*;{0,1}\s*$/i;
        a = rgba.exec(color);
        if (a) {
            a = parseFloat(a[1]);
            if (a === 0)
                return true;
            else
                return false;
        }
    } else {
        return false;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.clearCanvas = function (context, preserveTransform) {
    if (preserveTransform) {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    if (preserveTransform) {
        context.restore();
    }
};﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a layer.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.initializeBase(this);

    this._visible = true;
    this._locked = false;
    this._vObjects = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection(this);
    this._name = "";
    this._region = null;

    this._canvas = null;

    //use current time to generate unique id
    //use this id for matching between server and client objects
    this._uniqueId = ("l" + new Date().getTime()) + Math.round(Math.random() * 1000);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.prototype = {
    get_uniqueId: function () {
        /// <summary>Gets or sets a unique identifier of this layer.</summary>
        /// <value type="String">The string which represents a unique identifier of this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.UniqueId">Layer.UniqueId</see> server-side member.</para></remarks>
        return this._uniqueId;
    },

    //use only for deserialization
    set_uniqueId: function (v) {
        this._uniqueId = v;
    },

    get_canvas: function () {
        /// <summary>Gets a reference to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> object this layer belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> this layer belongs to.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Canvas">Layer.Canvas</see> server-side member.</para></remarks>
        return this._canvas;
    },

    get_index: function () {
        /// <summary>Get the index of this layer in the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" />. Returns <c>-1</c> if the layer was not added to the collection.</summary>
        /// <value type="Number">The index of this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Index">Layer.Index</see> server-side member.</para></remarks>
        var cv = this.get_canvas();
        if (cv) {
            return cv.get_layers().indexOf(this);
        } else {
            return -1;
        }
    },

    get_data: function () {
        /// <summary>Gets or sets serialized data of this layer.</summary>
        /// <value type="String">The string which represents serialized data of this layer.</value>
        var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(this);
        return JSON.stringify(data);
    },

    set_data: function (v) {
        if (v && v != "") {
            var data = JSON.parse(v);
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState(data, this);
        }
    },

    get_region: function () {
        /// <summary>Gets or sets the rectangle region on the layer surface in which v-objects can be placed.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.Math.RectangleF" /> in which v-objects can be placed.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Region">Layer.Region</see> server-side member.</para></remarks>
        return this._region;
    },

    set_region: function (region) {
        this._region = region;
    },

    get_vObjects: function () {
        /// <summary>Gets a collection of vector objects associated with this layer.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" /> which represents a collection of vector objects associated with this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.VObjects">Layer.VObjects</see> server-side member.</para></remarks>
        return this._vObjects;
    },

    get_name: function () {
        /// <summary>Gets or sets the name of this layer.</summary>
        /// <value type="String">The name of this layer.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Name">Layer.Name</see> server-side member.</para></remarks>
        return this._name;
    },

    set_name: function (v) {
        this._name = v;
    },

    get_visible: function () {
        /// <summary>Gets or sets the value indicating if the layer is visible.</summary>
        /// <value type="Boolean"><strong>true</strong> if the layer is visible; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Visible">Layer.Visible</see> server-side member.</para></remarks>
        return this._visible;
    },

    set_visible: function (v) {
        if (this._visible !== v) {
            this._visible = v;

            if (this.get_visible()) {
                for (var i = 0; i < this.get_vObjects().get_count() ; i++) {
                    var vObject = this.get_vObjects().get_item(i);
                    if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.isInstanceOfType(vObject) ||
	                    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.isInstanceOfType(vObject))
                        vObject.update();
                }
            }

            if (this._canvas != null) {
                this._canvas._needCompleteRedraw = true;
                this._canvas.updatePlaceholderButtonGroups();
            }
        }
    },

    get_locked: function () {
        /// <summary>Gets or sets the value indicating if the layer is locked.</summary>
        /// <value type="Boolean"><strong>true</strong> if the layer is locked; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.Locked">Layer.Locked</see> server-side member.</para></remarks>
        return this._locked;
    },

    set_locked: function (v) {
        if (this._locked !== v) {
            this._locked = v;

            if (this._canvas != null) {
                this._canvas._needCompleteRedraw = true;
                this._canvas.updatePlaceholderButtonGroups();
            }
        }
    },

    _onRemovedFromCanvas: function (canvas) {
        var collection = this.get_vObjects();
        var count = collection.get_count();
        for (var i = 0; i < count; i++) {
            collection.get_item(i)._onRemovedFromCanvas(canvas);
        }
    },

    _onAddedOnCanvas: function (canvas) {
        var collection = this.get_vObjects();
        var count = collection.get_count();
        for (var i = 0; i < count; i++) {
            collection.get_item(i)._onAddedOnCanvas(canvas);
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer", Sys.Component);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection = function (canvas) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a collection of layers.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    if (!canvas)
        throw Error.argumentNull("canvas");
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.initializeBase(this);
    this._canvas = canvas;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.prototype = {
    getLayerById: function (id) {
        for (var i = 0, imax = this.get_count() ; i < imax; i++) {
            var layer = this.get_item(i);
            if (layer.get_uniqueId() == id) {
                return layer;
            }
        }
        return null;
    },

    getLayersByName: function (name) {
        /// <summary>Search layers with the specified name.</summary>
        /// <param name="name" type="String">The name to search layers.</param>
        /// <returns type="Array">An array of layers contained in this collection and match the specified name.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.GetLayersByName(System.String)">LayerCollection.GetLayersByName(String)</see> server-side member.</para></remarks>
        var ll = [];
        for (var i = 0; i < this.get_count() ; i++) {
            if (this.get_item(i).get_name() == name) {
                ll.push(this.get_item(i));
            }
        }
        return ll;
    },

    getVObjectsByName: function (name) {
        /// <summary>Search v-objects with the specified name.</summary>
        /// <param name="name" type="String">The name to search v-objects.</param>
        /// <returns type="Array">An array of v-objects which match the specified name.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.GetVObjectsByName(System.String)">LayerCollection.GetVObjectsByName(String)</see> server-side member.</para></remarks>
        var ol = [];
        for (var i = 0; i < this.get_count() ; i++) {
            var l = this.get_item(i);
            for (var j = 0; j < l.get_vObjects().get_count() ; j++) {
                if (l.get_vObjects().get_item(j).get_name() == name) {
                    ol.push(l.get_vObjects().get_item(j));
                }
            }
        }
        return ol;
    },

    _onLayerRemoved: function (layer, index) {
        var cv = this._canvas;
        if (cv) {
            //add to history
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addLayerRemoved(layer, index);
            }

            for (var i = 0; i < cv.get_selectedVObjects().get_count() ; i++) {
                var vObject = cv.get_selectedVObjects().get_item(i);
                if (vObject != null && vObject.get_layer() != null && vObject.get_layer().get_uniqueId() == layer.get_uniqueId())
                    cv.removeSelectedVObject(vObject);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;

            //remove canvas property in layer
            layer._canvas = null;

            layer._onRemovedFromCanvas(cv)
        }
    },

    _onLayerAdded: function (layer, index) {
        var cv = this._canvas;
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addLayerAdded(layer, index);
            }

            //set canvas property in layer
            layer._canvas = cv;

            //set flag that redraw needed
            cv._needCompleteRedraw = true;

            layer._onAddedOnCanvas(cv);
        }
    },

    _onLayerMoved: function (layer, oldIndex, newIndex) {
        var cv = this._canvas;
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addLayerMoved(layer, oldIndex, newIndex);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }
    },

    removeAt: function (index) {
        /// <summary>Removes the layer at the specified index of the collection.</summary>
        /// <param name="index" type="Number">The zero-based index of the layer to remove.</param>
        var item = this.get_item(index);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, 'removeAt', [index]);
        this._onLayerRemoved(item, index);
    },

    insert: function (index, item) {
        /// <summary>Inserts a layer into the collection at the specified index.</summary>
        /// <param name="index" type="Number">A zero-based index at which a layer should be added.</param>
        /// <param name="item" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">A layer to insert.</param>
        if (item._canvas) {
            throw Error.argument("item",
				Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemBelongsCollection);
        }

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, 'insert', [index, item]);
        this._onLayerAdded(item, index);
    },

    move: function (oldIndex, newIndex) {
        /// <summary>Moves a layer from one position to another.</summary>
        /// <param name="oldIndex" type="Number">The zero-based index of the layer to move.</param>
        /// <param name="newIndex" type="Number">The zero-based index to move the layer to.</param>
        var item = Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, 'move', [oldIndex, newIndex]);
        if (item) {
            this._onLayerMoved(item, oldIndex, newIndex);
        }
        return item;
    },

    clear: function () {
        /// <summary>Removes all layers from the collection.</summary>
        var cnt = this.get_count();
        for (var i = 0; i < cnt; i++) {
            this.get_item(i)._canvas = null;
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.callBaseMethod(this, "clear");
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerCollection",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData = function (layerObject) {
    ///	<summary>This class represents a state of a layer and allows applying this state to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    /// <field name="Name" type="String" static="true"><summary>The name of the layer.</summary></field>
    /// <field name="Visible" type="Boolean" static="true"><summary>The value indicating if the layer is visible.</summary></field>
    /// <field name="Locked" type="Boolean" static="true"><summary>The value indicating if the layer is locked.</summary></field>
    /// <field name="UniqueId" type="String" static="true"><summary>The unique identifier of the layer.</summary></field>
    /// <field name="VObjects" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectrCollection" static="true"><summary>The collection of v-objects associated with this layer.</summary></field>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.initializeBase(this);

    if (layerObject) {
        this.N = layerObject.get_name();
        this.V = layerObject.get_visible();
        this.L = layerObject.get_locked();
        this.R = layerObject.get_region();
        this.ID = layerObject.get_uniqueId();
        this.VO = [];
        var objs = layerObject.get_vObjects();
        for (var i = 0; i < objs.get_count() ; i++) {
            var vo = objs.get_item(i);
            var dt = new Aurigma.GraphicsMill.AjaxControls.VectorObjects[vo._get_dataType()](vo);
            dt.__type = vo._get_dataType();
            this.VO.push({ T: vo._get_type(), D: dt });
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState = function (layerData, layerObject, objectsHash) {
    /// <summary>Applies the <paramref name="layerData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" />.</summary>
    /// <param name="layerData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData">The state to apply.</param>
    /// <param name="layerObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">Layer to apply the state to.</param>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    if (!objectsHash)
        objectsHash = {};
    if (layerObject) {
        layerObject.set_name(layerData.N);
        layerObject.set_visible(layerData.V);
        layerObject.set_locked(layerData.L);
        layerObject.set_uniqueId(layerData.ID);
        if (layerData.R)
            layerObject.set_region(ns.Math.RectangleF.FromObject(layerData.R));
        var lvo = layerObject.get_vObjects();
        for (var i = 0; i < layerData.VO.length; i++) {
            var voData = layerData.VO[i].D;
            var a = objectsHash[voData.ID];
            if (!a) {
                a = ns.ObjectFactory.createObjectByType(layerData.VO[i].T, ns);
                a.set_data(voData);
                a.initialize();
            } else {
                //exclude VObject from hash
                objectsHash[voData.ID] = null;
                a.set_data(voData);
            }
            lvo.add(a);
        }
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.prototype = {
    N: "",
    V: true,
    L: false,
    ID: ("l" + new Date().getTime()) + Math.round(Math.random() * 1000),
    VO: []
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData", null);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory = function () {
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType = function (type, ns) {
    if (!ns) {
        ns = window;
    }
    type = type.split('.');
    for (var i = 0, o = ns, imax = type.length; i < imax; i++) {
        o = o[type[i]];
    }
    return new o();
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings = function (object) {
    if (object != null) {
        this.FirstLineIndent = (typeof object.FirstLineIndent == "number") ? object.FirstLineIndent : 0;
        this.SpaceAfter = (typeof object.SpaceAfter == "number") ? object.SpaceAfter : 0;
        this.SpaceBefore = (typeof object.SpaceBefore == "number") ? object.SpaceBefore : 0;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings.prototype = {
    FirstLineIndent: 0,
    SpaceAfter: 0,
    SpaceBefore: 0,

    equals: function (settings) {
        return settings instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings &&
            this.FirstLineIndent === settings.FirstLineIndent &&
            this.SpaceAfter === settings.SpaceAfter &&
            this.SpaceBefore === settings.SpaceBefore;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference path="permissiondata.js" />
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission = function (options, defaultValue) {
    if (options == null)
        options = {};

    if (defaultValue == null)
        defaultValue = true;

    this._noPrint = options.NoPrint == null ? defaultValue : !!options.NoPrint;
    this._noShow = options.NoShow == null ? defaultValue : !!options.NoShow;
    this._allowDelete = options.AllowDelete == null ? defaultValue : !!options.AllowDelete;

    this._allowMoveHorizontal = options.AllowMoveHorizontal == null ? defaultValue : !!options.AllowMoveHorizontal;
    this._allowMoveVertical = options.AllowMoveVertical == null ? defaultValue : !!options.AllowMoveVertical;
    this._allowRotate = options.AllowRotate == null ? defaultValue : !!options.AllowRotate;
    this._allowProportionalResize = options.AllowProportionalResize == null ? defaultValue : !!options.AllowProportionalResize;
    this._allowArbitraryResize = options.AllowArbitraryResize == null ? defaultValue : !!options.AllowArbitraryResize;

    this._allowEditContent = options.AllowEditContent == null ? defaultValue : !!options.AllowEditContent;
    this._showEditButton = options.ShowEditButton == null ? defaultValue : !!options.ShowEditButton;
    this._showSelectButton = options.ShowSelectButton == null ? defaultValue : !!options.ShowSelectButton;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission.prototype =
{
    toActions: function () {
        var action = Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction;
        var result = action.none;

        if (this._allowArbitraryResize)
            result |= action.arbitraryResize;

        if (this._allowProportionalResize)
            result |= action.proportionalResize;

        if (this._allowMoveHorizontal)
            result |= action.dragX;

        if (this._allowMoveVertical)
            result |= action.dragY;

        if (this._allowRotate)
            result |= action.rotate;

        return result;
    },
    fromActions: function (value) {
        var action = Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction;

        this._allowArbitraryResize = (value & action.arbitraryResize) === action.none;
        this._allowArbitraryResize = (value & action.proportionalResize) === action.none;
        this._allowMoveHorizontal = (value & action.dragX) === action.none;
        this._allowMoveVertical = (value & action.dragY) === action.none;
        this._allowRotate = (value & action.rotate) === action.none;
    },

    clone: function () {
        var obj = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission();

        for (var property in this) {
            if (this.hasOwnProperty(property)) {
                obj[property] = this[property];
            }
        }

        return obj;
    },

    get_allowDelete: function () {
        return this._allowDelete;
    },
    set_allowDelete: function (value) {
        this._allowDelete = value;
    },

    get_noPrint: function () {
        return this._noPrint;
    },
    set_noPrint: function (value) {
        this._noPrint = value;
    },

    get_noShow: function () {
        return this._noShow;
    },
    set_noShow: function (value) {
        this._noShow = value;
    },

    get_allowMoveHorizontal: function () {
        return this._allowMoveHorizontal;
    },
    set_allowMoveHorizontal: function (value) {
        this._allowMoveHorizontal = value;
    },

    get_allowMoveVertical: function () {
        return this._allowMoveVertical;
    },
    set_allowMoveVertical: function (value) {
        this._allowMoveVertical = value;
    },

    get_allowRotate: function () {
        return this._allowRotate;
    },
    set_allowRotate: function (value) {
        this._allowRotate = value;
    },

    get_allowProportionalResize: function () {
        return this._allowProportionalResize;
    },
    set_allowProportionalResize: function (value) {
        this._allowProportionalResize = value;
    },

    get_allowArbitraryResize: function () {
        return this._allowArbitraryResize;
    },
    set_allowArbitraryResize: function (value) {
        this._allowArbitraryResize = value;
    },

    get_allowResize: function () {
        return this._allowProportionalResize || this._allowArbitraryResize;
    },

    get_allowFreeMove: function () {
        return this._allowMoveHorizontal && this._allowMoveVertical;
    },

    get_allowMove: function () {
        return this._allowMoveHorizontal || this._allowMoveVertical;
    },

    get_allowEditContent: function () {
        return this._allowEditContent;
    },
    set_allowEditContent: function (value) {
        this._allowEditContent = value;
    },

    get_showEditButton: function () {
        return this._showEditButton;
    },
    set_showEditButton: function (value) {
        this._showEditButton = value;
    },

    get_showSelectButton: function () {
        return this._showSelectButton;
    },
    set_showSelectButton: function (value) {
        this._showSelectButton = value;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData = function (permission) {
	if (permission) {
		this.AllowDelete = permission.get_allowDelete();
		this.NoPrint = permission.get_noPrint();
		this.NoShow = permission.get_noShow();

		this.AllowMoveHorizontal = permission.get_allowMoveHorizontal();
		this.AllowMoveVertical = permission.get_allowMoveVertical();
		this.AllowRotate = permission.get_allowRotate();
		this.AllowProportionalResize = permission.get_allowProportionalResize();
		this.AllowArbitraryResize = permission.get_allowArbitraryResize();

		this.AllowEditContent = permission.get_allowEditContent();
		this.ShowEditButton = permission.get_showEditButton();
	    this.ShowSelectButton = permission.get_showSelectButton();
	}
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData.applyState = function (data, permission) {
	if (permission && data) {
		data.AllowDelete != null && (permission._allowDelete = !!data.AllowDelete);
		data.NoPrint != null && (permission._noPrint = !!data.NoPrint);
		data.NoShow != null && (permission._noShow = !!data.NoShow);

		data.AllowMoveHorizontal != null && (permission._allowMoveHorizontal = !!data.AllowMoveHorizontal);
		data.AllowMoveVertical != null && (permission._allowMoveVertical = !!data.AllowMoveVertical);
		data.AllowRotate != null && (permission._allowRotate = !!data.AllowRotate);
		data.AllowProportionalResize != null && (permission._allowProportionalResize = !!data.AllowProportionalResize);
		data.AllowArbitraryResize != null && (permission._allowArbitraryResize = !!data.AllowArbitraryResize);

		data.AllowEditContent != null && (permission._allowEditContent = !!data.AllowEditContent);
		data.ShowEditButton != null && (permission._showEditButton = !!data.ShowEditButton);
		data.ShowSelectButton != null && (permission._showSelectButton = !!data.ShowSelectButton);
	}
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler = function (canvas) {
    this._canvas = canvas;

    this._multipleSelectionEnabled = false;

    this._currentVObject = null;
    this._vObjects = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection();

    this._rectangle = null;
    this._rubberband = null;
    this._region = null;

    this._needRedraw = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler.prototype = {
    get_multipleSelectionEnabled: function () {
        return this._multipleSelectionEnabled;
    },

    set_multipleSelectionEnabled: function (value) {
        this._multipleSelectionEnabled = value;
    },

    get_currentVObject: function () {
        return this._currentVObject;
    },

    set_currentVObject: function (vObject) {
        if (vObject !== this.get_currentVObject()) {
            this._currentVObject = vObject;
            this._canvas._onCurrentVObjectChanged(vObject);
        }
    },

    get_selectedVObjects: function () {
        return this._vObjects;
    },

    set_selectedVObjects: function (vObjects) {
        this.clearSelectedVObjects();

        if (Object.prototype.toString.call(vObjects) === "[object Array]") {
            if (!this.get_multipleSelectionEnabled())
                vObjects.splice(1, vObjects.length - 1);

            for (var i = 0; i < vObjects.length; i++) {
                this.addSelectedVObject(vObjects[i]);
            }
        }
    },

    isVObjectSelected: function (vObject) {
        return this._vObjects.contains(vObject);
    },

    addSelectedVObject: function (vObject) {
        if (!this.get_multipleSelectionEnabled() && this._vObjects.get_count() > 0)
            this._vObjects.clear();

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            var vo = this._vObjects.get_item(i);
            if (this._canvas._isPlaceholder(vo)) {
                vo.set_editing(false);
            }
        }

        if (vObject != null)
            this._vObjects.push(vObject);

        this.set_currentVObject(vObject);
        this._canvas._needCompleteRedraw = true;
    },

    removeSelectedVObject: function (vObject) {
        this._vObjects.remove(vObject);

        if (this._canvas._isPlaceholder(vObject))
            vObject.set_editing(false);

        if (this._vObjects.get_count() > 0)
            this.set_currentVObject(this._vObjects.get_item(this._vObjects.get_count() - 1));
        else
            this.set_currentVObject(null);

        this._canvas._needCompleteRedraw = true;
    },

    clearSelectedVObjects: function () {
        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            var vo = this._vObjects.get_item(i);
            if (this._canvas._isPlaceholder(vo)) {
                vo.set_editing(false);
            }
        }

        this._vObjects.clear();
        this.set_currentVObject(null);
        this._canvas._needCompleteRedraw = true;
    },

    get_rectangle: function () {
        if (this._rectangle == null)
            return null;

        var r = this._rectangle.clone();
        r.Width = Math.abs(r.Width);
        r.Height = Math.abs(r.Height);

        return r;
    },

    hitTest: function (point) {
        var rectangle = this.get_rectangle();
        if (rectangle == null) {
            var selection = this._canvas.getVObjectByHitTest(point) == null;
            return { selection: selection };
        }

        var result = this._canvas.hitTestSelection(rectangle, point);

        var permissions = this._get_permissions();
        result.rotate = result.rotate && permissions.get_allowRotate();

        if (result.resize) {
            var index = result.resizeIndex;

            var arbitraryResize = permissions.get_allowArbitraryResize();
            arbitraryResize = arbitraryResize && (index === 5 || index === 6 || index === 7 || index === 8);

            var proportionalResize = permissions.get_allowProportionalResize();
            proportionalResize = proportionalResize && (index === 1 || index === 2 || index === 3 || index === 4);

            result.arbitraryResize = arbitraryResize;
            result.proportionalResize = proportionalResize;
            result.resize = arbitraryResize || proportionalResize;
        }

        result.dragX = result.body && permissions.get_allowMoveHorizontal();
        result.dragY = result.body && permissions.get_allowMoveVertical();
        result.drag = result.dragX || result.dragY;

        return result;
    },

    get_cursor: function (point) {
        var ht = this.hitTest(point);
        var gc = Aurigma.GraphicsMill.Cursor;
        var permissions = this._get_permissions();
        if (ht.resize) {
            var angle = this._rectangle.Angle;
            var needToFlipCursor = angle >= 45 && angle < 135 || angle >= 225 && angle < 315;

            if (ht.resizeIndex === 1)
                return !needToFlipCursor ? gc.sizeNW : gc.sizeNE;
            else if (ht.resizeIndex === 2)
                return !needToFlipCursor ? gc.sizeNE : gc.sizeSE;
            else if (ht.resizeIndex === 3)
                return !needToFlipCursor ? gc.sizeSE : gc.sizeSW;
            else if (ht.resizeIndex === 4)
                return !needToFlipCursor ? gc.sizeSW : gc.sizeNW;
            else if (ht.resizeIndex === 5)
                return !needToFlipCursor ? gc.sizeW : gc.sizeN;
            else if (ht.resizeIndex === 6)
                return !needToFlipCursor ? gc.sizeN : gc.sizeE;
            else if (ht.resizeIndex === 7)
                return !needToFlipCursor ? gc.sizeE : gc.sizeS;
            else if (ht.resizeIndex === 8)
                return !needToFlipCursor ? gc.sizeS : gc.sizeW;
        }
        else if (ht.rotate)
            return gc.cross;
        else if (ht.body && (permissions.get_allowMoveHorizontal() || permissions.get_allowMoveVertical()))
            return gc.move;

        return gc.defaultCursor;
    },

    update: function () {
        if (this._vObjects.get_count() > 0) {
            if (this._vObjects.get_count() === 1) {
                this._rectangle = this._vObjects.get_item(0).get_selectionRectangle();
            }
            else if (this._vObjects.get_count() > 1) {
                var bounds = this._vObjects.get_item(0).get_bounds();
                var left = bounds.Left, top = bounds.Top, right = bounds.Right, bottom = bounds.Bottom;
                for (var i = 1; i < this._vObjects.get_count() ; i++) {
                    var b = this._vObjects.get_item(i).get_bounds();

                    left = Math.min(left, b.Left);
                    top = Math.min(top, b.Top);
                    right = Math.max(right, b.Right);
                    bottom = Math.max(bottom, b.Bottom);
                }

                this._rectangle = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.FromLTRB(left, top, right, bottom);
            }

            this._region = this._get_region();
        }
        else {
            this._rectangle = null;
            this._region = null;
        }
    },

    draw: function (ctx) {
        if (this._rubberband != null)
            this._canvas.drawRubberband(ctx, this._rubberband);
        else
            this._needRedraw = false;

        var rectangle = this.get_rectangle();
        if (rectangle == null || this._vObjects.get_count() === 0)
            return;

        if (this._vObjects.get_count() === 1) {
            var vObject = this._vObjects.get_item(0);
            if (this._canvas._isPlaceholder(vObject) && vObject.get_editing())
                this._canvas.drawSelection(ctx, vObject.get_rectangle(), {});
        } else {
            for (var i = 0; i < this._vObjects.get_count() ; i++) {
                this._canvas.drawSelection(ctx, this._vObjects.get_item(i).get_selectionRectangle(), {});
            }
        }

        var permissions = this._get_permissions();
        var opts = {
            rotate: permissions.get_allowRotate(),
            resize: (permissions.get_allowProportionalResize() || permissions.get_allowArbitraryResize()),
            arbitraryResize: permissions.get_allowArbitraryResize()
        };

        this._canvas.drawSelection(ctx, rectangle, opts);
    },

    processKeyEvent: function (e) {
        if (this._rectangle == null)
            return;

        var permissions = this._get_permissions();
        var allowMove = ((e.keyCode === Sys.UI.Key.left || e.keyCode === Sys.UI.Key.right) && permissions.get_allowMoveHorizontal() ||
        (e.keyCode === Sys.UI.Key.up || e.keyCode === Sys.UI.Key.down) && permissions.get_allowMoveVertical());

        if (!allowMove)
            return;

        if (e.type === "keydown") {
            if (!this._keyPushed && !e.altKey && !e.ctrlKey && !e.metaKey) {
                this._keyPushed = true;
                this._keyCode = e.keyCode;

                this._startTransform();

                this._move(e.keyCode);
            } else if (this._keyCode === e.keyCode) {
                this._move(e.keyCode);
            }
        } else if (e.type === "keyup") {
            if (this._keyPushed && this._keyCode === e.keyCode) {
                this._keyPushed = false;
                this._endTransform();
            }
        }
    },

    processMouseEvent: function (e) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var pt = new ns.Math.PointF(e.x, e.y);

        if (e.type === "mousedown") {
            this._operation = this.hitTest(pt);
            this._startPoint = pt;
            this._startTransform();
            this._startRubberbandSelection();
        } else if (e.type === "mouseup") {
            this._endTransform(this._operation && this._operation.resize);
            this._endRubberbandSelection();
            delete this._startPoint;
            delete this._operation;
        } else if (e.type === "mousemove") {
            if (this._operation != null && this._startPoint != null) {
                if (this._operation.selection)
                    this._updateRubberband(pt);
                else if (this._operation.resize)
                    this._resize(pt);
                else if (this._operation.rotate)
                    this._rotate(pt, !(e.ctrlKey || e.metaKey));
                else if (this._operation.drag) {
                    var permissions = this._get_permissions();
                    var moveVertical = permissions.get_allowMoveVertical();
                    var moveHorizontal = permissions.get_allowMoveHorizontal();
                    var x = moveHorizontal ? e.x : this._startPoint.X;
                    var y = moveVertical ? e.y : this._startPoint.Y;
                    this._drag(new ns.Math.PointF(x, y));
                }
            }
        }
    },

    isResizing: function () {
        return this._operation && this._operation.resize;
    },

    _startTransform: function () {
        if (this._rectangle == null)
            return;

        this._startRectangle = this._rectangle.clone();

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            this._vObjects.get_item(i)._startTransform();
        }
    },

    _endTransform: function (resized) {
        if (this._rectangle == null)
            return;

        var changed = !this._rectangle.isEqual(this._startRectangle);
        var useGroupCommand = this._canvas.get_history().get_trackingEnabled() && changed && this._vObjects.get_count() > 1;

        if (useGroupCommand)
            this._canvas.get_history().startVObjectGroupCommand();

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            this._vObjects.get_item(i)._endTransform(changed);
            if (changed && resized)
                this._vObjects.get_item(i)._onResized();
        }

        if (useGroupCommand)
            this._canvas.get_history().endVObjectGroupCommand();

        if (changed)
            this._canvas.updateTexts();

        delete this._startRectangle;

        if (this._vObjects.get_count() === 1 && resized)
            this.update();

        if (changed)
            this._canvas.get_history()._raiseChanged();
    },

    _startRubberbandSelection: function () {
        if (this._canvas._viewer != null)
            this._canvas._viewer.ignoreDocumentClickOnce();
    },

    _endRubberbandSelection: function () {
        if (this._rubberband == null)
            return;

        var math = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var rectangle = math.RectangleF.FromLTRB(this._rubberband.left, this._rubberband.top, this._rubberband.right, this._rubberband.bottom);

        if (!math.EqualsOfFloatNumbers(rectangle.Width, 0) && !math.EqualsOfFloatNumbers(rectangle.Height, 0)) {
            var selectedVObjects = [];
            var vObjects = this._canvas.get_allVObjects(true);
            for (var i = 0; i < vObjects.length; i++) {
                var vObject = vObjects[i];
                if (!vObject.isLocked() && rectangle.contains(vObject.get_rectangle().get_center()))
                    selectedVObjects.push(vObject);
            }

            this.set_selectedVObjects(selectedVObjects);
        }

        this._rubberband = null;
    },

    _updateRubberband: function (point) {
        if (!this.get_multipleSelectionEnabled() || this._startPoint == null)
            return;

        this._rubberband = {
            left: Math.min(this._startPoint.X, point.X),
            top: Math.min(this._startPoint.Y, point.Y),
            right: Math.max(this._startPoint.X, point.X),
            bottom: Math.max(this._startPoint.Y, point.Y)
        };

        this._needRedraw = true;
    },

    _resize: function (pt) {
        var t, r = this._rectangle.clone();
        // new width or height, depends on resize action
        var newDem = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(pt.X - this._startRectangle.CenterX, pt.Y - this._startRectangle.CenterY);
        newDem.rotate(-r.Angle);
        // old width or height, depends on resize action
        var oldDem = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this._startPoint.X - this._startRectangle.CenterX, this._startPoint.Y - this._startRectangle.CenterY);
        oldDem.rotate(-r.Angle);
        // added width or height, depends on resize action
        var addedDem = newDem.translate(-oldDem.X, -oldDem.Y);
        //gripses values for multipli (choosing resize strategy)
        var cw = [0, -1, 1, 1, -1, -1, 0, 1, 0];
        var ch = [0, -1, -1, 1, 1, 0, -1, 0, 1];
        //word interpretation of gripses (movable anchors)
        var gripsDict = { left: 6, top: 5 };
        // 1 or -1 (for choosing plus or minus action)
        var signMultiplier = 1;

        if (!this._operation.arbitraryResize) {
            var dx = addedDem.X * cw[this._operation.resizeIndex] / this._startRectangle.Width;
            var dy = addedDem.Y * ch[this._operation.resizeIndex] / this._startRectangle.Height;

            var d = dx < dy ? dx : dy;

            addedDem.X = this._startRectangle.Width * d;
            addedDem.Y = this._startRectangle.Height * d;

            r.Width = this._startRectangle.Width + addedDem.X;
            r.Height = this._startRectangle.Height + addedDem.Y;
        } else {
            r.Width = this._startRectangle.Width + addedDem.X * cw[this._operation.resizeIndex];
            r.Height = this._startRectangle.Height + addedDem.Y * ch[this._operation.resizeIndex];

            if (this._operation.resizeIndex === gripsDict["left"] || this._operation.resizeIndex === gripsDict["top"]) {
                signMultiplier = -1;
            }
        }

        if (this._get_allowNegativeResize() || r.Width > 0 && r.Height > 0) {
            t = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(
                addedDem.X / 2 * cw[this._operation.resizeIndex], addedDem.Y / 2 * ch[this._operation.resizeIndex]);
            t.rotate(r.Angle);

            r.CenterX = this._startRectangle.CenterX + (t.X * signMultiplier);
            r.CenterY = this._startRectangle.CenterY + (t.Y * signMultiplier);
        } else {
            r.Width = Math.max(r.Width, 1);
            r.Height = Math.max(r.Height, 1);
        }

        this._updateRectangle(r);
    },

    _drag: function (point) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var diff = new ns.Math.PointF(point.X - this._startPoint.X, point.Y - this._startPoint.Y);
        diff = this._constrainDiffToRegion(this._startRectangle.get_bounds(), diff);

        var r = this._rectangle.clone();
        r.CenterX = this._startRectangle.CenterX + diff.X;
        r.CenterY = this._startRectangle.CenterY + diff.Y;
        this._updateRectangle(r);
    },

    _rotate: function (pt, angleSnap) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects,
            p1 = pt.clone(),
            p2 = this._startPoint,
            r = this._rectangle.clone(),
            p3 = new ns.Math.PointF(r.CenterX, r.CenterY),
            angle = ns.Math.getTriangleAngle(p1, p2, p3),
            edge = angleSnap ? 90 : -1;

        angle = ns.Math.normalizeAngle(this._startRectangle.Angle + angle);
        var mod = angle % edge;
        if (mod < 5) {
            angle = edge * Math.floor(angle / edge);
        } else if (mod > edge - 5) {
            angle = edge * Math.floor(angle / edge + 1);
        }
        angle = ns.Math.normalizeAngle(angle);

        r.Angle = angle;
        this._updateRectangle(r);
    },

    _move: function (key) {
        var delta = 1 / this._canvas._get_mul();
        var diff = null;
        switch (key) {
            case Sys.UI.Key.up:
                diff = { X: 0, Y: -delta };
                break;
            case Sys.UI.Key.down:
                diff = { X: 0, Y: delta };
                break;
            case Sys.UI.Key.left:
                diff = { X: -delta, Y: 0 };
                break;
            case Sys.UI.Key.right:
                diff = { X: delta, Y: 0 };
                break;
        }

        if (diff != null) {
            diff = this._constrainDiffToRegion(this._rectangle.get_bounds(), diff);

            var r = this._rectangle.clone();
            r.CenterX += diff.X;
            r.CenterY += diff.Y;
            this._updateRectangle(r);
        }
    },

    _get_permissions: function () {
        if (this._rectangle == null || this._vObjects.get_count() === 0)
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission({}, false);

        var permissions = this._vObjects.get_item(0).get_permissions().clone();
        if (this._vObjects.get_count() > 1 && (this._rectangle.Angle - this._vObjects.get_item(0).get_angle()) % 90 !== 0)
            permissions.set_allowArbitraryResize(false);

        for (var i = 1; i < this._vObjects.get_count() ; i++) {
            var vo = this._vObjects.get_item(i);
            var voPermissions = vo.get_permissions();
            if (!voPermissions.get_allowMoveHorizontal())
                permissions.set_allowMoveHorizontal(false);

            if (!voPermissions.get_allowMoveVertical())
                permissions.set_allowMoveVertical(false);

            if (!voPermissions.get_allowRotate())
                permissions.set_allowRotate(false);

            if (!voPermissions.get_allowProportionalResize())
                permissions.set_allowProportionalResize(false);

            if (!voPermissions.get_allowArbitraryResize() || (this._rectangle.Angle - vo.get_angle()) % 90 !== 0)
                permissions.set_allowArbitraryResize(false);
        }

        return permissions;
    },

    _get_allowNegativeResize: function () {
        if (this._rectangle == null || this._vObjects.get_count() === 0)
            return false;

        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            if (!this._vObjects.get_item(i)._allowNegativeResize)
                return false;
        }

        return true;
    },

    _get_region: function () {
        var rectangle = null;

        if (this._canvas.get_constrainedMarginEnabled() && this._canvas.get_margin() > 0) {
            var margin = this._canvas.get_margin();
            rectangle = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(
                margin, margin, this._canvas.get_workspaceWidth() - margin, this._canvas.get_workspaceHeight() - margin);
        }

        var selectedLayers = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection();
        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            var layer = this._vObjects.get_item(i).get_layer();
            if (layer != null && layer.get_region() != null && !selectedLayers.contains(layer))
                selectedLayers.add(layer);
        }

        for (var j = 0; j < selectedLayers.get_count() ; j++) {
            var region = selectedLayers.get_item(j).get_region();

            rectangle = rectangle != null ? Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.intersect(rectangle, region) : region;
        }

        return rectangle;
    },

    _updateRectangle: function (rectangle) {
        if (this._region != null && !this._region.containsRectangle(rectangle.get_bounds()))
            return;

        this._rectangle = rectangle;
        for (var i = 0; i < this._vObjects.get_count() ; i++) {
            this._vObjects.get_item(i)._transformRectangle(this._startRectangle, this._rectangle);
        }
    },

    _constrainDiffToRegion: function (bounds, diff) {
        if (this._region != null) {
            if (bounds.Left + diff.X < this._region.Left)
                diff.X = this._region.Left - bounds.Left;

            if (bounds.Top + diff.Y < this._region.Top)
                diff.Y = this._region.Top - bounds.Top;

            if (bounds.Right + diff.X > this._region.Left + this._region.Width)
                diff.X = this._region.Left + this._region.Width - bounds.Right;

            if (bounds.Bottom + diff.Y > this._region.Top + this._region.Height)
                diff.Y = this._region.Top + this._region.Height - bounds.Bottom;
        }

        return diff;
    },

    _set_angle: function (angle) {
        this._startTransform();
        var r = this._rectangle.clone();
        r.Angle = angle;
        this._updateRectangle(r);
        this._endTransform();
        this._canvas.redraw();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.SelectionHandler");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform", Sys.Component);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus = function () {
    /// <summary>Specifies a current bitmap status.</summary>
    /// <field name="ready" type="Number" integer="true" static="true"><summary>The remote scripting method has been completed (or was not run yet), and you can freely get return value or exception details.</summary></field>
    /// <field name="refresh" type="Number" integer="true" static="true"><summary>The control updates a portion of image it displays (e.g. when user zoomed or scrolled it). The bitmap state is not changed while status is "refresh". </summary></field>
    /// <field name="busy" type="Number" integer="true" static="true"><summary>The remote scripting method is running (the bitmap state is changing). </summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.prototype = {
    ready: 0,
    refresh: 1,
    busy: 2
};
Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This is a base class for all client-side commands.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command" />
    /// <constructor>
    ///		<exclude />
    /// </constructor>
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command.prototype = {
    get_events: function () {
        /// <summary>Returns a list of client events of this history.</summary>
        /// <value type="Sys.EventHandlerList">The <see cref="T:J:Sys.EventHandlerList" /> of this history.</value>
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },

    /** @param {function(Command, {rollBack: boolean})} h*/
    add_executed: function (h) {
        this.get_events().addHandler("executed", h);
    },

    remove_executed: function (h) {
        this.get_events().removeHandler("executed", h);
    },

    execute: function (canvas, inGroup) {
        /// <summary>Executes a command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: false });
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls the command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: true });
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command", null);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History = function (canvas) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a history of modifications applied to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> content.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this._canvas = canvas;
    this._maxUndoStepCount = 10;
    this._current = -1;
    this._enable = false;
    this._locked = false;
    this._trackingEnabled = true;
    this._commands = [];
    this._events = null;
    this._overflowMaxUndoStepCount = false;

    this._vObjectGroupCommand = null;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.prototype = {
    get_events: function () {
        /// <summary>Returns a list of client events of this history.</summary>
        /// <value type="Sys.EventHandlerList">The <see cref="T:J:Sys.EventHandlerList" /> of this history.</value>
        if (!this._events) {
            this._events = new Sys.EventHandlerList();
        }
        return this._events;
    },

    get_enable: function () {
        /// <summary>Gets or sets the value indicating if the undo/redo functionality is enabled.</summary>
        /// <value type="Boolean"><strong>true</strong> if the undo/redo functionality is enabled; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Enable">History.Enable</see> server-side member.</para></remarks>
        return this._enable;
    },

    set_enable: function (value) {
        if (!value) {
            this.clear();
        }
        this._enable = value;
    },

    get_locked: function () {
        /// <private />
        /// <exclude />
        return this._locked;
    },

    set_locked: function (value) {
        /// <private />
        this._locked = value;
    },

    get_trackingEnabled: function () {
        /// <summary>Gets or sets the value indicating if the tracking commands functionality is enabled.</summary>
        /// <value type="Boolean"><strong>true</strong> if the tracking commands functionality is enabled; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.TrackingEnabled">History.TrackingEnabled</see> server-side member.</para></remarks>
        return this._trackingEnabled;
    },

    set_trackingEnabled: function (value) {
        this._trackingEnabled = value;
    },

    pauseTracking: function () {
        this._prevTrackingState = this.get_trackingEnabled();

        if (this._prevTrackingState)
            this.set_trackingEnabled(false);
    },

    resumeTracking: function () {
        if (this._prevTrackingState === true)
            this.set_trackingEnabled(true);
    },

    get_maxUndoStepCount: function () {
        /// <summary>Gets or sets a maximum number of available undo steps.</summary>
        /// <value type="Number">The value which specifies a a maximum number of available undo steps.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.MaxUndoStepCount">History.MaxUndoStepCount</see> server-side member.</para></remarks>
        return this._maxUndoStepCount;
    },

    set_maxUndoStepCount: function (value) {
        this._maxUndoStepCount = value;
    },

    set_current: function (value) {
        /// <private />
        this._current = value;
    },

    get_current: function () {
        /// <private />
        /// <exclude />
        return this._current;
    },

    get_commands: function () {
        /// <private />
        /// <exclude />
        return this._commands;
    },

    set_commands: function (value) {
        /// <private />
        this._commands = value;
    },

    get_canvas: function () {
        /// <private />
        /// <exclude />
        return this._canvas;
    },

    get_canRedo: function () {
        /// <summary>Gets the value indicating if the last action can be redone.</summary>
        /// <value type="Boolean"><strong>true</strong> if the last action can be redone; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.CanRedo">History.CanRedo</see> server-side member.</para></remarks>
        return (this._current < this._commands.length - 1);
    },

    get_canUndo: function () {
        /// <summary>Gets the value indicating if the last action can be undone.</summary>
        /// <value type="Boolean"><strong>true</strong> if the last action can be undone; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.CanUndo">History.CanUndo</see> server-side member.</para></remarks>
        return (this._current >= 0);
    },

    _clearRedo: function () {
        this._commands.splice(this._current + 1, this._commands.length - (this._current + 1));
    },

    clearRedo: function () {
        /// <summary>Discards the redo history.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.ClearRedo">History.ClearRedo()</see> server-side member.</para></remarks>
        if (this.get_canRedo()) {
            this._clearRedo();
            this._raiseChanged();
        }
    },

    _clearUndo: function () {
        this._commands.splice(0, this._current + 1);
        this._current = -1;
        this._overflowMaxUndoStepCount = false;
    },

    clearUndo: function () {
        /// <summary>Discards the undo history.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.ClearUndo">History.ClearUndo()</see> server-side member.</para></remarks>
        if (this.get_canUndo()) {
            this._clearUndo();
            this._raiseChanged();
        }
    },

    clear: function (suppressOnChanged) {
        /// <summary>Discards the redo and undo history.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Clear">History.Clear()</see> server-side member.</para></remarks>
        var cr = this.get_canRedo();
        if (cr)
            this._clearRedo();

        var cu = this.get_canUndo();
        if (cu)
            this._clearUndo();

        var overflow = this.get_overflowMaxUndoStepCount();
        if (overflow)
            this._overflowMaxUndoStepCount = false;

        if (!suppressOnChanged && (cr || cu || overflow)) {
            this._raiseChanged();
        }
    },

    get_overflowMaxUndoStepCount: function () {
        return this._overflowMaxUndoStepCount;
    },

    startVObjectGroupCommand: function () {
        this._vObjectGroupCommand = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand();
    },

    endVObjectGroupCommand: function () {
        if (this._vObjectGroupCommand != null && !this._vObjectGroupCommand.isEmpty()) {
            var command = this._vObjectGroupCommand;
            this._vObjectGroupCommand = null;
            this.addCommand(command);
        }
        else
            this._vObjectGroupCommand = null;
    },

    addCommand: function (command) {
        if (command && command.execute && command.unExecute) {
            this._addCommand(command);
        } else {
            throw new Error('Not a command');
        }
    },

    _addCommand: function (command) {
        if (!command)
            throw "Command can not be null";
        if (this.get_enable() && !this.get_locked() && command) {
            if (this._vObjectGroupCommand != null) {
                this._vObjectGroupCommand.addCommand(command);
            }
            else {
                if (this.get_canRedo())
                    this._clearRedo();
                this._commands.push(command);
                this._current++;
                if (this._current + 1 > this._maxUndoStepCount) {
                    this._commands.splice(0, 1);
                    this._current--;
                    this._overflowMaxUndoStepCount = true;
                }
                this._raiseChanged();
            }
        }
    },

    redo: function () {
        /// <summary>Redoes the last made change.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Redo">History.Redo()</see> server-side member.</para></remarks>
        if (this.get_enable() && this.get_canRedo()) {
            this._locked = true;
            this._current += 1;
            var command = this._commands[this._current];
            command.execute(this._canvas);
            this._locked = false;
            this._raiseChanged();
            if (command.ClassName != "Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject")
                this.get_canvas().redraw(true);
        }
    },

    undo: function () {
        /// <summary>Undoes the last made change.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.Undo">History.Undo()</see> server-side member.</para></remarks>
        if (this.get_enable() && this.get_canUndo()) {
            this._locked = true;
            var command = this._commands[this._current];
            command.unExecute(this._canvas);
            this._current -= 1;
            this._locked = false;
            this._raiseChanged();
            if (command.ClassName != "Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject")
                this.get_canvas().redraw(true);
        }
    },

    _defaultVObjectChangedFactMethod: function (vObject, vObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand(vObject, vObjectIndex, layerIndex);
    },

    _get_VObjectChangedFactMethod: function () {
        return typeof this.vObjectChangedFactMethod == "function" ? this.vObjectChangedFactMethod : this._defaultVObjectChangedFactMethod;
    },

    vObjectChangedFactMethod: null,

    addVObjectChanged: function (vObject, vObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was changed.</param>
        /// <param name="vObjectIndex" type="Number">An index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddVObjectChanged(Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject,System.Int32,System.Int32)">History.AddVObjectChanged(VObject, Int32, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!vObjectIndex) && vObjectIndex != 0) {
                vObjectIndex = vObject.get_index();
            }
            if ((!layerIndex) && layerIndex != 0) {
                layerIndex = vObject.get_layer().get_index();
            }
            var command = this._get_VObjectChangedFactMethod()(vObject, vObjectIndex, layerIndex);
            if ((command.LayerIndex > -1) && (command.VObjectIndex > -1)) {
                this._addCommand(command);
            }
        }
    },

    _defaultVObjectRemovedFactMethod: function (vObject, vObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand(vObject, vObjectIndex, layerIndex);
    },

    _get_VObjectRemovedFactMethod: function () {
        return typeof this.vObjectRemovedFactMethod == "function" ? this.vObjectRemovedFactMethod : this._defaultVObjectRemovedFactMethod;
    },

    vObjectRemovedFactMethod: null,

    addVObjectRemoved: function (vObject, vObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was removed.</param>
        /// <param name="vObjectIndex" type="Number">An index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddVObjectRemoved(Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject,System.Int32,System.Int32)">History.AddVObjectRemoved(VObject, Int32, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!vObjectIndex) && vObjectIndex != 0) {
                vObjectIndex = vObject.get_index();
            }
            if ((!layerIndex) && layerIndex != 0 && vObject.get_layer()) {
                layerIndex = vObject.get_layer().get_index();
            }
            var command = this._get_VObjectRemovedFactMethod()(vObject, vObjectIndex, layerIndex);
            if ((command.LayerIndex > -1) && (command.VObjectIndex > -1)) {
                this._addCommand(command);
            }
        }
    },

    _defaultVObjectAddedFactMethod: function (vObject, vObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand(vObject, vObjectIndex, layerIndex);
    },

    _get_VObjectAddedFactMethod: function () {
        return typeof this.vObjectAddedFactMethod == "function" ? this.vObjectAddedFactMethod : this._defaultVObjectAddedFactMethod;
    },

    vObjectAddedFactMethod: null,

    addVObjectAdded: function (vObject, vObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was added.</param>
        /// <param name="vObjectIndex" type="Number">An index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddVObjectAdded(Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject,System.Int32,System.Int32)">History.AddVObjectAdded(VObject, Int32, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!vObjectIndex) && vObjectIndex != 0) {
                vObjectIndex = vObject.get_index();
            }
            if ((!layerIndex) && layerIndex != 0) {
                layerIndex = vObject.get_layer().get_index();
            }
            var command = this._get_VObjectAddedFactMethod()(vObject, vObjectIndex, layerIndex);
            if ((command.LayerIndex > -1) && (command.VObjectIndex > -1)) {
                this._addCommand(command);
            }
        }
    },

    _defaultVObjectMovedFactMethod: function (vObject, oldVObjectIndex, newVObjectIndex, layerIndex) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand(vObject, oldVObjectIndex, newVObjectIndex, layerIndex);
    },

    _get_VObjectMovedFactMethod: function () {
        return typeof this.vObjectMovedFactMethod == "function" ? this.vObjectMovedFactMethod : this._defaultVObjectMovedFactMethod;
    },

    vObjectMovedFactMethod: null,

    addVObjectMoved: function (vObject, oldVObjectIndex, newVObjectIndex, layerIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand" /> command to the history.</summary>
        /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The v-object that was moved.</param>
        /// <param name="oldVObjectIndex" type="Number">An old index of this v-object.</param>
        /// <param name="newVObjectIndex" type="Number">A new index of this v-object.</param>
        /// <param name="layerIndex" type="Number">An index of the layer this v-object belongs to.</param>
        if (this.get_enable() && !this.get_locked()) {
            var command = this._get_VObjectMovedFactMethod()(vObject, oldVObjectIndex, newVObjectIndex, layerIndex);
            if (command.LayerIndex > -1 && command.NewVObjectIndex > -1 && command.OldVObjectIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    addLayerRemoved: function (layer, index) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand" /> command to the history.</summary>
        /// <param name="layer" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The layer which was removed.</param>
        /// <param name="index" type="Number">An index of this layer.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddLayerRemoved(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer,System.Int32)">History.AddLayerRemoved(Layer, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!index) && index != 0)
                index = layer.get_index();
            var command = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand(layer, index);
            if (command.LayerIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    addLayerAdded: function (layer, index) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand" /> command to the history.</summary>
        /// <param name="layer" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The layer which was added.</param>
        /// <param name="index" type="Number">An index of this layer.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.AddLayerAdded(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer,System.Int32)">History.AddLayerAdded(Layer, Int32)</see> server-side member.</para></remarks>
        if (this.get_enable() && !this.get_locked()) {
            if ((!index) && index != 0)
                index = layer.get_index();
            var command = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand(layer, index);
            if (command.LayerIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    addLayerMoved: function (layer, oldIndex, newIndex) {
        /// <summary>Adds the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand" /> command to the history.</summary>
        /// <param name="layer" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The layer which was added.</param>
        /// <param name="oldIndex" type="Number">An old index of this layer.</param>
        /// <param name="newIndex" type="Number">A new index of this layer.</param>
        if (this.get_enable() && !this.get_locked()) {
            var command = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand(layer, oldIndex, newIndex);
            if (command.NewLayerIndex > -1 && command.OldLayerIndex > -1) {
                this._addCommand(command);
            }
        }
    },

    _raiseChanged: function (args) {
        var h = this.get_events().getHandler("changed");
        if (h) {
            if (args == undefined) {
                args = Sys.EventArgs.Empty;
            }
            h(this, args);
        }
    },

    add_changed: function (h) {
        /// <summary>Fires when the history is changed.</summary>
        this.get_events().addHandler("changed", h);
    },

    remove_changed: function (h) {
        this.get_events().removeHandler("changed", h);
    },

    lockHistory: function (value) {
        var prevValue = this._locked;
        this._locked = value;
        return prevValue;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History", null);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData = function (history) {
    ///	<summary>This class represents a state of a history and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this.Cur = -1;
    this.E = false;
    this.L = false;
    this.US = 10;
    this.T = true;
    this.C = [];
    if (history) {
        this.Cur = history.get_current();
        this.E = history.get_enable();
        this.L = history.get_locked();
        this.US = history.get_maxUndoStepCount();
        this.T = history.get_trackingEnabled();
        this.C = [];
        var commands = history.get_commands();
        for (var i = 0; i < commands.length; i++) {
            var command = commands[i];
            var type = Object.getType(command).getName();
            var data = "";
            if (type == "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand" && !command.isEmpty()) {
                var groupCommand = {};
                groupCommand._commands = [];
                for (var j = 0; j < command.get_commands().length; j++) {
                    var c = command.get_commands()[j];
                    var t = Object.getType(c).getName();
                    var d = JSON.stringify(c);
                    groupCommand._commands.push({ D: d, T: t });
                }
                data = JSON.stringify(groupCommand);
            }
            else {
                data = JSON.stringify(commands[i]);
            }

            this.C.push({ D: data, T: type });
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData.applyState = function (historyData, history) {
    /// <summary>Applies the <paramref name="historyData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.History" />.</summary>
    /// <param name="historyData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData">The state to apply.</param>
    /// <param name="history" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData">History to apply the state to.</param>
    if (!historyData) {
        return;
    }
    history.set_current(historyData.Cur);
    history.set_enable(historyData.E);
    history.set_locked(historyData.L);
    history.set_maxUndoStepCount(historyData.US);
    history.set_trackingEnabled(historyData.T);
    history.set_commands([]);
    for (var i = 0; i < historyData.C.length; i++) {
        if (historyData.C[i].D) {
            var type = historyData.C[i].T;
            var data = JSON.parse(historyData.C[i].D);
            var command = Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType(type);

            if (type == "Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand" && data._commands.length > 0) {
                for (var j = 0; j < data._commands.length; j++) {
                    var t = data._commands[j].T;
                    var d = JSON.parse(data._commands[j].D);
                    var c = Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType(t);
                    for (memberName in d) {
                        c[memberName] = d[memberName];
                    }
                    command.addCommand(c);
                }
            }
            else {
                for (memberName in data) {
                    command[memberName] = data[memberName];
                }
            }

            history.get_commands().push(command);
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.HistoryData", null);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand = function (layer, index) {
    /// <summary>This class represents the layer added command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this.LayerIndex = -1;
    this.LayerData = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData();
    if (layer) {
        this.LayerData = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(layer);
    }
    if (index) {
        this.LayerIndex = index;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.prototype = {
    execute: function (canvas) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var l = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer(canvas);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData.applyState(this.LayerData, l);
        canvas.get_layers().insert(this.LayerIndex, l);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        this.LayerData = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.LayerData(canvas.get_layers().get_item(this.LayerIndex));
        canvas.get_layers().removeAt(this.LayerIndex);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand = function (layer, oldLayerIndex, newLayerIndex) {
    /// <summary>This class represents the layer moved command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    this.OldLayerIndex = new Number(oldLayerIndex);
    if (isNaN(this.OldLayerIndex))
        this.OldLayerIndex = -1;
    this.NewLayerIndex = new Number(newLayerIndex);
    if (isNaN(this.NewLayerIndex))
        this.NewLayerIndex = -1;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.prototype = {
    execute: function (canvas) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        canvas.get_layers().move(this.OldLayerIndex, this.NewLayerIndex);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        canvas.get_layers().move(this.NewLayerIndex, this.OldLayerIndex);

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerMovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand = function (layer, index) {
    /// <summary>This class represents the layer removed command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.initializeBase(this, [layer, index]);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.prototype = {
    execute: function (canvas) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.callBaseMethod(this, 'unExecute', [canvas]);
    },

    unExecute: function (canvas) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.callBaseMethod(this, 'execute', [canvas]);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerRemovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.LayerAddedCommand);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand = function (vObject, vObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object added command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.initializeBase(this);

    this.VObjectIndex = -1;
    this.LayerIndex = -1;
    this.Data = "";
    this.ClassName = "";
    this.VObjectBoundData = null;
    this.VObjectId = "";
    if (vObject) {
        this.Data = vObject.get_data();
        this.ClassName = Object.getType(vObject).getName();
        this.VObjectId = vObject.get_uniqueId();
    }
    if (vObjectIndex || vObjectIndex == 0) {
        this.VObjectIndex = vObjectIndex;
    }
    if (layerIndex || layerIndex == 0) {
        this.LayerIndex = layerIndex;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.prototype = {
    /** @param {function(VObjectAddedCommand, VObject)} h*/
    add_vObjectRestored: function (h) {
        this.get_events().addHandler("vObjectRestored", h);
    },

    remove_vObjectRestored: function (h) {
        this.get_events().removeHandler("vObjectRestored", h);
    },

    /** @param {function(VObjectAddedCommand, VObject)} h*/
    add_vObjectDelete: function (h) {
        this.get_events().addHandler("vObjectDeleted", h);
    },

    remove_vObjectDelete: function (h) {
        this.get_events().removeHandler("vObjectDeleted", h);
    },

    execute: function (canvas, inGroup) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var restoredVObject = Aurigma.GraphicsMill.AjaxControls.VectorObjects.ObjectFactory.createObjectByType(this.ClassName);
        restoredVObject.set_data(this.Data);
        restoredVObject.initialize();
        canvas.get_layers().get_item(this.LayerIndex).get_vObjects().insert(this.VObjectIndex, restoredVObject);

        var restoredEventHandler = this.get_events().getHandler("vObjectRestored");
        if (typeof restoredEventHandler == "function")
            restoredEventHandler(this, restoredVObject);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        var objs = canvas.get_layers().get_item(this.LayerIndex).get_vObjects();
        var removingObject = objs.getVObjectById(this.VObjectId);

        var deletedEventHandler = this.get_events().getHandler("vObjectDeleted");
        if (typeof deletedEventHandler == "function")
            deletedEventHandler(this, removingObject);

        this.Data = removingObject.get_data();
        objs.remove(removingObject);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand = function (vObject, vObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object changed command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand.initializeBase(this, [vObject, vObjectIndex, layerIndex]);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand.prototype = {
    execute: function (canvas, inGroup) {
        // So, we assume that we can't call Execure or UnExecute twice.
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        var obj = canvas.get_layers().get_item(this.LayerIndex).get_vObjects().getVObjectById(this.VObjectId);
        var d = obj.get_data();
        obj.set_data(this.Data);
        this.Data = d;

        if (!inGroup)
            canvas.updateTexts(obj);

        obj.update();

        if (canvas.isVObjectSelected(obj))
            canvas.updateSelection();

        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: false });
    },

    unExecute: function (canvas, inGroup) {
        // Vice versa
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        this.execute(canvas, inGroup);

        var executedHandler = this.get_events().getHandler("executed");
        if (typeof executedHandler == "function")
            executedHandler(this, { rollBack: true });
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectChangedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand = function () {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.initializeBase(this);

    this._commands = [];
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.prototype = {
    execute: function (canvas) {
        var ru = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo;
        for (var i = 0; i < this._commands.length; i++) {
            var command = this._commands[i];
            if (command && command.execute && command.unExecute) {
                command.execute(canvas, true);
            }
        }

        canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas) {
        var ru = Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo;
        for (var i = this._commands.length - 1; i >= 0 ; i--) {
            var command = this._commands[i];
            if (command && command.execute && command.unExecute) {
                command.unExecute(canvas, true);
            }
        }

        canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.callBaseMethod(this, 'unExecute');
    },

    addCommand: function (command) {
        this._commands.push(command);
    },

    isEmpty: function () {
        return this._commands.length == 0;
    },

    get_commands: function () {
        return this._commands;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectGroupCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand = function (vObject, oldVObjectIndex, newVObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object moved command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.initializeBase(this);

    this.OldVObjectIndex = new Number(oldVObjectIndex);
    if (isNaN(this.OldVObjectIndex))
        this.OldVObjectIndex = -1;
    this.NewVObjectIndex = new Number(newVObjectIndex);
    if (isNaN(this.NewVObjectIndex))
        this.NewVObjectIndex = -1;
    this.LayerIndex = new Number(layerIndex);
    if (isNaN(this.LayerIndex))
        this.LayerIndex = -1;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.prototype = {
    execute: function (canvas, inGroup) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        canvas.get_layers().get_item(this.LayerIndex).get_vObjects().move(this.OldVObjectIndex, this.NewVObjectIndex);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.callBaseMethod(this, 'execute');
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        canvas.get_layers().get_item(this.LayerIndex).get_vObjects().move(this.NewVObjectIndex, this.OldVObjectIndex);

        if (!inGroup)
            canvas.updateTexts();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.callBaseMethod(this, 'unExecute');
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectMovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.Command);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand = function (vObject, vObjectIndex, layerIndex) {
    /// <summary>This class represents the v-object removed command.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.initializeBase(this, [vObject, vObjectIndex, layerIndex]);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.prototype = {
    execute: function (canvas, inGroup) {
        /// <summary>Executes this command.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to execute the command on.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.callBaseMethod(this, 'unExecute', [canvas, inGroup]);
    },

    unExecute: function (canvas, inGroup) {
        /// <summary>Rolls this command back.</summary>
        /// <param name="canvas" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The canvas to roll the command back.</param>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.callBaseMethod(this, 'execute', [canvas, inGroup]);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectRemovedCommand",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo.VObjectAddedCommand);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

// Oriented Square.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getOrientedSquare = function (p1, p2, p3) {
    return (p1.X * p2.Y + p1.Y * p3.X + p2.X * p3.Y) - (p3.X * p2.Y + p2.X * p1.Y + p3.Y * p1.X);
};

// Get bounding rectangle of array of points
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getBounds = function (points) {
    if (points.length == 0) {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(0, 0, 0, 0);
    }
    var p = points[0],
		minX = p.X,
		maxX = p.X,
		minY = p.Y,
		maxY = p.Y;
    for (var i = 1, imax = points.length; i < imax; ++i) {
        p = points[i];
        minX = Math.min(minX, p.X);
        maxX = Math.max(maxX, p.X);
        minY = Math.min(minY, p.Y);
        maxY = Math.max(maxY, p.Y);
    }
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(minX, minY, maxX - minX, maxY - minY);
};

// returns angle in radians near p3 point.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getTriangleAngle = function (p1, p2, p3) {
    var c2 = Math.pow(p1.X - p2.X, 2) + Math.pow(p1.Y - p2.Y, 2);
    var b2 = Math.pow(p1.X - p3.X, 2) + Math.pow(p1.Y - p3.Y, 2);
    var a2 = Math.pow(p2.X - p3.X, 2) + Math.pow(p2.Y - p3.Y, 2);

    var cosAlpha = 0;
    if (a2 * b2 != 0) {
        cosAlpha = (-c2 + a2 + b2) / (2 * Math.sqrt(a2) * Math.sqrt(b2));
    }

    // oriented s.
    var orientedSquare = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getOrientedSquare(p1, p2, p3);
    var angle = Math.acos(cosAlpha);
    if (orientedSquare > 0) angle = -angle;
    return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertRadianToDegree(angle);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.normalizeAngle = function (angle) {
    angle = angle % 360;
    if (angle < 0) {
        angle += 360;
    }
    return angle;
};

//return scalar product of 2 vectors
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getScalarProduct = function (v1, v2) {
    return (v1.X * v2.X + v1.Y * v2.Y);
};

//return square the distance from piont to segment,
//p - point, p1 - start of segment, p2 - end of segment
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToSegment = function (p, p1, p2) {
    with (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math) {
        var v = new PointF(p2.X - p1.X, p2.Y - p1.Y);
        var w = new PointF(p.X - p1.X, p.Y - p1.Y);
        var c1 = getScalarProduct(w, v);
        if (c1 <= 0)
            return getSquareDistanceToPoint(p, p1);
        var c2 = getScalarProduct(v, v);
        if (c2 < c1)
            return getSquareDistanceToPoint(p, p2);
        var b = c1 / c2;
        var ph = new PointF(p1.X + v.X * b, p1.Y + v.Y * b);
        return getSquareDistanceToPoint(p, ph);
    }
};

//return square the distance between 2 points
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToPoint = function (p1, p2) {
    return (p2.X - p1.X) * (p2.X - p1.X) + (p2.Y - p1.Y) * (p2.Y - p1.Y);
};

// returns width of the line depending on scale factors.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getLineWidth = function (p1, p2, width, scaleX, scaleY) {
    function solve(x, y, x1, y1) {
        var a = Math.pow(y - y1, 2);
        var b = Math.pow(x - x1, 2);
        return Math.sqrt(a * b / (b + a));
    }

    if (p1.X == p2.X)
        return width * scaleX;
    if (p1.Y == p2.Y)
        return width * scaleY;

    var a = solve(p1.X, p1.Y, p2.X, p2.Y);
    var b = solve(p1.X * scaleX, p1.Y * scaleY, p2.X * scaleX, p2.Y * scaleY);
    return width * b / a;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertDegreeToRadian = function (angle) {
    return Math.PI * angle / 180;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.ConvertRadianToDegree = function (angle) {
    return 180 * angle / Math.PI;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Clamp = function (min, val, max) {
    return Math.max(min, Math.min(max, val));
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers = function (f1, f2, tolerance) {
    if (typeof f1 != "number" || typeof f2 != "number")
        return false;

    if (typeof tolerance != "number")
        tolerance = 0.0001;

    return tolerance != 0 ? Math.abs(f1 - f2) <= tolerance : f1 == f2;
};﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
(function () {
    Type.registerNamespace('Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math');

    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;

    /*
	*	Creates a 2D transform matrix.
	*	[ x']   [  m00  m01  m02  ] [ x ]   [ m00x + m01y + m02 ]
	*	[ y'] = [  m10  m11  m12  ] [ y ] = [ m10x + m11y + m12 ]
	*	[ 1 ]   [   0    0    1   ] [ 1 ]   [         1         ]
	*/
    ns.Matrix = function (a, b, c, d, e, f) {
        if (arguments.length == 6) {
            this.set_transform(a, b, c, d, e, f);
        } else if (arguments.length == 0) {
            this.set_transform(1, 0, 0, 1, 0, 0);
        } else {
            throw new Error('Arguments error');
        }
    };

    ns.Matrix.prototype = {
        set_transform: function (a, b, c, d, e, f) {
            this.m00 = a;
            this.m10 = b;
            this.m01 = c;
            this.m11 = d;
            this.m02 = e;
            this.m12 = f;
        },

        transformPoint: function (p, clone) {
            var pp = clone ? new ns.PointF() : p;
            var x = p.X,
				y = p.Y;
            pp.X = x * this.m00 + y * this.m01 + this.m02;
            pp.Y = x * this.m10 + y * this.m11 + this.m12;
            return pp;
        },

        transformPoints: function (pts, clone) {
            var result = clone ? [] : pts;
            for (var i = 0, imax = pts.length; i < imax; ++i) {
                var p = pts[i],
					pp = clone ? new ns.PointF() : p,
					x = p.X,
					y = p.Y;
                pp.X = x * this.m00 + y * this.m01 + this.m02;
                pp.Y = x * this.m10 + y * this.m11 + this.m12;
                result[i] = pp;
            }
            return result;
        },

        concatenate: function (m) {
            var m0 = this.m00;
            var m1 = this.m01;
            this.m00 = m.m00 * m0 + m.m10 * m1;
            this.m01 = m.m01 * m0 + m.m11 * m1;
            this.m02 += m.m02 * m0 + m.m12 * m1;

            m0 = this.m10;
            m1 = this.m11;
            this.m10 = m.m00 * m0 + m.m10 * m1;
            this.m11 = m.m01 * m0 + m.m11 * m1;
            this.m12 += m.m02 * m0 + m.m12 * m1;
            return this;
        },

        rotate: function (angle) {
            return this.rotateAt(angle, 0, 0);
        },

        rotateAt: function (angle, x, y) {
            angle = ns.ConvertDegreeToRadian(angle);
            var cos = Math.cos(angle),
				sin = Math.sin(angle),
				m = new ns.Matrix(cos, sin, -sin, cos, x - x * cos + y * sin, y - x * sin - y * cos);
            return this.concatenate(m);
        },

        scale: function (sx, sy) {
            this.m00 *= sx;
            this.m10 *= sx;
            this.m01 *= sy;
            this.m11 *= sy;
            return this;
        },

        translate: function (dx, dy) {
            this.m02 += dx * this.m00 + dy * this.m01;
            this.m12 += dx * this.m10 + dy * this.m11;
            return this;
        },

        preTranslate: function (dx, dy) {
            this.m02 += dx;
            this.m12 += dy;
            return this;
        },

        toString: function () {
            return 'matrix(' + [this.m00, this.m10, this.m01, this.m11, this.m02, this.m12].join(', ') + ')';
        }
    };

    ns.Matrix.registerClass('Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Matrix');
})();﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment = function (name, points) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment.initializeBase(this);

    this._name = (name) ? name.toUpperCase() : "";
    this._points = (points) ? points : [];
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment.prototype = {
    get_name: function () {
        return this._name;
    },

    get_point: function (index) {
        return this._points[index];
    },

    get_length: function () {
        return this._points.length;
    },

    _transform: function (transform, center) {
        for (var i = 0; i < this.get_length() ; i++) {
            this.get_point(i).transform(transform, center);
        }
    },

    _draw: function (ctx) {
        switch (this.get_name()) {
            case "Z":
                ctx.closePath();
                break;
            case "M":
                ctx.moveTo(this.get_point(0).X, this.get_point(0).Y);
                break;
            case "L":
                ctx.lineTo(this.get_point(0).X, this.get_point(0).Y);
                break;
            case "Q":
                ctx.quadraticCurveTo(this.get_point(0).X, this.get_point(0).Y, this.get_point(1).X, this.get_point(1).Y);
                break;
            case "C":
                ctx.bezierCurveTo(this.get_point(0).X, this.get_point(0).Y, this.get_point(1).X, this.get_point(1).Y, this.get_point(2).X, this.get_point(2).Y);
                break;
        }
    },

    _toString: function () {
        var s = this.get_name();
        for (var i = 0; i < this.get_length() ; i++) {
            s += " " + this.get_point(i).X + " " + this.get_point(i).Y;
        }

        return s;
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PathSegment");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path = function (path) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.initializeBase(this);

    this._segments = [];

    if (path)
        this._fromString(path);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.prototype = {
    get_length: function () {
        return this._segments.length;
    },

    add_pathChanged: function (handler) {
        this.get_events().addHandler("pathChanged", handler);
    },

    remove_pathChanged: function (handler) {
        this.get_events().removeHandler("pathChanged", handler);
    },

    _onChanged: function () {
        var handler = this.get_events().getHandler("pathChanged");
        if (handler) {
            handler(this);
        }
    },

    moveTo: function (x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("M", [new ns.PointF(x, y)]));

        this._onChanged();
    },

    lineTo: function (x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("L", [new ns.PointF(x, y)]));

        this._onChanged();
    },

    quadraticTo: function (cx, cy, x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("Q", [new ns.PointF(cx, cy), new ns.PointF(x, y)]));

        this._onChanged();
    },

    cubicTo: function (cx1, cy1, cx2, cy2, x, y) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("C", [new ns.PointF(cx1, cy1), new ns.PointF(cx2, cy2), new ns.PointF(x, y)]));

        this._onChanged();
    },

    close: function () {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        this._segments.push(new ns.PathSegment("Z"));

        this._onChanged();
    },

    transform: function (transform, center) {
        for (var i = 0; i < this.get_length() ; i++)
            this._segments[i]._transform(transform, center);
    },

    draw: function (ctx) {
        if (!ctx)
            return;

        ctx.beginPath();

        for (var i = 0; i < this.get_length() ; i++)
            this._segments[i]._draw(ctx);
    },

    toString: function () {
        var s = "";
        for (var i = 0; i < this.get_length() ; i++) {
            s += this._segments[i]._toString();
            if (i < this._segments.length - 1)
                s += " ";
        }

        return s;
    },

    clone: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(this.toString());
    },

    isEqual: function (path) {
        return (this.toString() === path.toString());
    },

    _fromString: function (s) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var parts = s.split(' ');

        var startIndex = 0;
        while (startIndex < parts.length) {
            var name = parts[startIndex];

            var endIndex = startIndex + 1;
            var values = [];
            while (endIndex < parts.length) {
                var value = parseFloat(parts[endIndex]);
                if (!isNaN(value) && isFinite(value)) {
                    values.push(value);
                    endIndex++;
                }
                else
                    break;
            }

            var i = 0;
            var points = [];
            while (i < values.length) {
                points.push(new ns.PointF(values[i], values[i + 1]));
                i += 2;
            }

            var segment = new ns.PathSegment(name, points);
            this._segments.push(segment);

            startIndex = endIndex;
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.rectangle = function (left, top, width, height) {
    var path = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path();
    path.moveTo(left, top);
    path.lineTo(left + width, top);
    path.lineTo(left + width, top + height);
    path.lineTo(left, top + height);
    path.lineTo(left, top);
    path.close();

    return path;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.ellipse = function (left, top, width, height) {
    var eNumber = 0.5517;
    var hWidth = width / 2;
    var hHeight = height / 2;

    var path = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path();
    path.moveTo(left, top + hHeight);
    path.cubicTo(left, top + hHeight - hHeight * eNumber, left + hWidth - hWidth * eNumber, top, left + hWidth, top);
    path.cubicTo(left + hWidth + hWidth * eNumber, top, left + width, top + hHeight * eNumber, left + width, top + hHeight);
    path.cubicTo(left + width, top + hHeight + hHeight * eNumber, left + hWidth + hWidth * eNumber, top + height, left + hWidth, top + height);
    path.cubicTo(left + hWidth - hWidth * eNumber, top + height, left, top + hHeight + hHeight * eNumber, left, top + hHeight);
    path.close();

    return path;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path", Sys.Component);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF = function (centerX, centerY, width, height, angle) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> server-side class.</summary>
    /// <remarks><para>This class represents a set of floating-point numbers that define the location, size, rotation angle and center of a rectangle and exposes a number of methods to operate with it.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />
    /// <param name="centerX" type="Number" />
    /// <param name="centerY" type="Number" />
    /// <param name="width" type="Number" />
    /// <param name="height" type="Number" />
    /// <param name="angle" type="Number" />
    /// <field name="CenterX" type="Number" integer="true" static="true"><summary>The x-coordinate of the rotation center of this rectangle.</summary></field>
    /// <field name="CenterY" type="Number" integer="true" static="true"><summary>The y-coordinate of the rotation center of this rectangle.</summary></field>
    /// <field name="Width" type="Number" integer="true" static="true"><summary>The width of this rectangle.</summary></field>
    /// <field name="Height" type="Number" integer="true" static="true"><summary>The height of this rectangle.</summary></field>
    /// <field name="Angle" type="Number" integer="true" static="true"><summary>The rotation angle of this rectangle.</summary></field>
    /// <constructor>
    /// 	<summary>Creates and initializes an instance of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF" /> class.</summary>
    /// 	<param name="centerX">The x-coordinate of the rotation center of the rectangle to create.</param>
    /// 	<param name="centerY">The y-coordinate of the rotation center of the rectangle to create.</param>
    /// 	<param name="width">The width of the rectangle to create.</param>
    /// 	<param name="height">The height of the rectangle to create.</param>
    /// 	<param name="angle">The rotation angle of the rectangle to create.</param>
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.initializeBase(this);

    this.CenterX = (centerX) ? centerX : 0;
    this.CenterY = (centerY) ? centerY : 0;
    this.Width = (width || width === 0) ? width : 2;
    this.Height = (height || height === 0) ? height : 2;
    this.Angle = (angle) ? angle : 0;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.prototype = {
    clone: function () {
        /// <summary>Creates a new object that is a copy of the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> instance.</summary>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF">A new <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> that is a copy of this instance.</returns>
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(this.CenterX, this.CenterY, this.Width, this.Height, this.Angle);
    },

    get_bounds: function () {
        /// <summary>Gets the bounds of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> taking into account its rotation.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The rectangle circumscribed about this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.Bounds">RotatedRectangleF.Bounds</see> server-side member.</para></remarks>
        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var center = new m.PointF(this.CenterX, this.CenterY);
        var w = this.Width;
        var h = this.Height;
        var points = [
			new m.PointF(-w / 2, -h / 2),
			new m.PointF(-w / 2, h / 2),
			new m.PointF(w / 2, -h / 2),
			new m.PointF(w / 2, h / 2)
        ];
        var minx = 0, miny = 0, maxx = 0, maxy = 0;
        for (var i = 0; i < 4; i++) {
            points[i].rotate(this.Angle);
            if (points[i].X < minx || i === 0)
                minx = points[i].X;
            if (points[i].Y < miny || i === 0)
                miny = points[i].Y;
            if (points[i].X > maxx || i === 0)
                maxx = points[i].X;
            if (points[i].Y > maxy || i === 0)
                maxy = points[i].Y;
        }
        return new m.RectangleF(minx + center.X, miny + center.Y, maxx - minx, maxy - miny);
    },

    isEqual: function (rect, tolerance) {
        /// <summary>Determines whether the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</summary>
        /// <param name="rect" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF">The rotated rectangle to compare with the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</param>
        /// <returns type="Boolean"><strong>true</strong> if <paramref name="rect" /> is equal to the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />; otherwise, <strong>false</strong>.</returns>

        var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        return rect != null && m.EqualsOfFloatNumbers(this.CenterX, rect.CenterX, tolerance) && m.EqualsOfFloatNumbers(this.CenterY, rect.CenterY, tolerance) &&
            m.EqualsOfFloatNumbers(this.Width, rect.Width, tolerance) && m.EqualsOfFloatNumbers(this.Height, rect.Height, tolerance) &&
            m.EqualsOfFloatNumbers(this.Angle, rect.Angle, tolerance);
    },

    _getUpperLeftCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(-this.Width / 2, -this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _getUpperRightCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.Width / 2, -this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _getBottomRightCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.Width / 2, this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _getBottomLeftCorner: function () {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(-this.Width / 2, this.Height / 2);
        p = p.rotate(this.Angle);
        p = p.translate(this.CenterX, this.CenterY);
        return p;
    },

    _checkProjectionIntersection: function (points0, points1) {
        var p0 = this._getProjections(points0);
        var p1 = this._getProjections(points1);

        return p0.left <= p1.right && p0.right >= p1.left && p0.top <= p1.bottom && p0.bottom >= p1.top;
    },

    _getProjections: function (points) {
        var x0 = x1 = points[0].X;
        var y0 = y1 = points[0].Y;

        for (var i = 1; i < points.length; i++) {
            x0 = Math.min(x0, points[i].X);
            x1 = Math.max(x1, points[i].X);
            y0 = Math.min(y0, points[i].Y);
            y1 = Math.max(y1, points[i].Y);
        }

        return { left: x0, right: x1, top: y0, bottom: y1 };
    },

    intersectsWith: function (rect) {
        var thisRect = this.clone();
        var otherRect = rect.clone();

        if (this.Angle != 0) {
            var angle = thisRect.Angle;
            thisRect.Angle = 0;

            var center = otherRect.get_center();
            center.rotateAt(-angle, thisRect.get_center());
            otherRect.set_center(center);
            otherRect.Angle -= angle;
        }

        var thisEdges = [thisRect._getUpperLeftCorner(), thisRect._getUpperRightCorner(), thisRect._getBottomRightCorner(), thisRect._getBottomLeftCorner()];
        var otherEdges = [otherRect._getUpperLeftCorner(), otherRect._getUpperRightCorner(), otherRect._getBottomRightCorner(), otherRect._getBottomLeftCorner()];

        var firstProjectionIntersection = this._checkProjectionIntersection(thisEdges, otherEdges);

        var secondProjectionIntersection = true;
        if (firstProjectionIntersection && this.Angle != rect.Angle) {
            thisRect = this.clone();
            otherRect = rect.clone();

            var angle = otherRect.Angle;
            otherRect.Angle = 0;

            var center = thisRect.get_center();
            center.rotateAt(-angle, otherRect.get_center());
            thisRect.set_center(center);
            thisRect.Angle -= angle;

            thisEdges = [thisRect._getUpperLeftCorner(), thisRect._getUpperRightCorner(), thisRect._getBottomRightCorner(), thisRect._getBottomLeftCorner()];
            otherEdges = [otherRect._getUpperLeftCorner(), otherRect._getUpperRightCorner(), otherRect._getBottomRightCorner(), otherRect._getBottomLeftCorner()];

            secondProjectionIntersection = this._checkProjectionIntersection(thisEdges, otherEdges);
        }

        return firstProjectionIntersection && secondProjectionIntersection;
    },

    get_location: function () {
        /// <summary>Gets or sets the coordinates of the upper-left corner of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The value which represents the upper-left corner of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.Location">RotatedRectangleF.Location</see> server-side member.</para></remarks>
        return this._getUpperLeftCorner();
    },

    set_location: function (location) {
        var p = this._getUpperLeftCorner();
        this.CenterX = this.CenterX + (location.X - p.X);
        this.CenterY = this.CenterY + (location.Y - p.Y);
    },

    get_center: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(this.CenterX, this.CenterY);
    },

    set_center: function (center) {
        this.CenterX = center.X;
        this.CenterY = center.Y;
    },

    rotateAt: function (angle, center) {
        var rectCenter = this.get_center();
        rectCenter.rotateAt(angle, center);
        this.set_center(rectCenter);
        this.Angle += angle;
    },

    set_transform: function (transform) {
        if (transform == null || transform.isEqual(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform()))
            return;

        this.Width *= transform.get_scaleX();
        this.Height *= transform.get_scaleY();
        this.Angle += transform.get_angle();
        this.CenterX += transform.get_translateX();
        this.CenterY += transform.get_translateY();
    },

    get_transform: function (rectangle) {
        if (rectangle == null || this.isEqual(rectangle))
            return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform();

        var scaleX = rectangle.Width === 0 ? 0 : this.Width / rectangle.Width;
        var scaleY = rectangle.Height === 0 ? 0 : this.Height / rectangle.Height;
        var angle = this.Angle - rectangle.Angle;
        var center = rectangle.get_center();
        var translateX = this.CenterX - center.X;
        var translateY = this.CenterY - center.Y;

        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(scaleX, scaleY, translateX, translateY, angle);
    },

    toString: function () {
        var r = [this.CenterX, this.CenterY, this.Width, this.Height, this.Angle];
        return r.join(',');
    },

    toRectangleF: function () {
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(this.CenterX - this.Width / 2, this.CenterY - this.Height / 2, this.Width, this.Height);
    },

    CenterX: 0,
    CenterY: 0,
    Width: 2,
    Height: 2,
    Angle: 0
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.fromRectangleF = function (rectangle) {
    return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(
        rectangle.Left + rectangle.Width / 2, rectangle.Top + rectangle.Height / 2, rectangle.Width, rectangle.Height, 0);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.FromLTRB = function (left, top, right, bottom) {
    return Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.fromRectangleF(
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF.FromLTRB(left, top, right, bottom));
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextAlignment = function () {
    /// <summary>Contains text alignment types.</summary>
    /// <field name="Left" type="Number" integer="true" static="true"><summary>Align text along the left edge.</summary></field>
    /// <field name="Center" type="Number" integer="true" static="true"><summary>Align text along the center.</summary></field>
    /// <field name="Right" type="Number" integer="true" static="true"><summary>Align text along the right edge.</summary></field>
    throw Error.notImplemented();
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextAlignment.prototype = {
    Left: 0,
    Center: 1,
    Right: 2
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextAlignment.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextAlignment", false);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextVerticalAlignment = function () {
    throw Error.notImplemented();
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextVerticalAlignment.prototype = {
    Top: 0,
    Center: 1,
    Bottom: 2
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextVerticalAlignment.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextVerticalAlignment", false);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode = function () {
    throw Error.notImplemented();
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.prototype = {
    None: 0,
    Square: 1,
    Tight: 2
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode", false);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction = function () {
    /// <summary>Contains v-object actions.</summary>
    /// <field name="all" type="Number" integer="true" static="true"><summary>Enables all the actions.</summary></field>
    /// <field name="arbitraryResize" type="Number" integer="true" static="true"><summary>The arbitrary resize action. If this action in supported by the object, the user will be able to resize it without preserving the aspect ratio.</summary></field>
    /// <field name="drag" type="Number" integer="true" static="true"><summary>The drag action. If this action in supported by the object, the user will be able to move it.</summary></field>
    /// <field name="none" type="Number" integer="true" static="true"><summary>Disables all the actions.</summary></field>
    /// <field name="proportionalResize" type="Number" integer="true" static="true"><summary>The proportional resize action. If this action in supported by the object, the user will be able to resize it preserving the aspect ratio.</summary></field>
    /// <field name="resize" type="Number" integer="true" static="true"><summary>The resize action. If this action in supported by the object, the user will be able to resize it.</summary></field>
    /// <field name="rotate" type="Number" integer="true" static="true"><summary>The rotate action. If this action in supported by the object, the user will be able to rotate it.</summary></field>
    throw Error.notImplemented();
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction.prototype = {
    none: 0,
    dragX: 1,
    arbitraryResize: 2,
    proportionalResize: 4,
    rotate: 8,
    dragY: 16,
    all: 1 | 2 | 4 | 8 | 16,
    resize: 2 | 4,
    drag: 1 | 16
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction.registerEnum("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction", true);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection = function (layer) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a collection of v-objects.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    if (!layer)
        throw Error.argumentNull("layer");
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.initializeBase(this);
    this._layer = layer;
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.prototype = {
    getVObjectById: function (id) {
        for (var i = 0; i < this.get_count() ; i++) {
            var vObject = this.get_item(i);
            if (vObject.get_uniqueId() == id) {
                return vObject;
            }
        }
        return null;
    },

    getVObjectsByName: function (name) {
        /// <summary>Search v-objects with the specified name.</summary>
        /// <param name="name" type="String">The name to search v-objects.</param>
        /// <returns type="Array">An array of v-objects which match the specified name.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.GetVObjectsByName(System.String)">VObjectCollection.GetVObjectsByName(String)</see> server-side member.</para></remarks>
        var lvo = [];
        for (var i = 0; i < this.get_count() ; i++) {
            if (this.get_item(i).get_name() == name) {
                lvo.push(this.get_item(i));
            }
        }
        return lvo;
    },

    _onVObjectRemoved: function (vObject, vObjectIndex, layerIndex) {
        //add to history
        var cv = this._layer.get_canvas();
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addVObjectRemoved(vObject, vObjectIndex, layerIndex);
            }

            if (cv.isVObjectSelected(vObject)) {
                cv.removeSelectedVObject(vObject);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }

        vObject._layer = null;

        //tell to vObject is has been removed from canvas
        if (cv)
            vObject._onRemovedFromCanvas(cv);
    },

    _onVObjectAdded: function (vObject, vObjectIndex, layerIndex) {
        vObject._layer = this._layer;
        var cv = this._layer.get_canvas();
        if (cv) {
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addVObjectAdded(vObject, vObjectIndex, layerIndex);
            }

            //tell to vObject it is has been added on canvas
            if (this._layer._canvas)
                vObject._onAddedOnCanvas(this._layer._canvas);

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }
    },

    _onVObjectMoved: function (vObject, oldIndex, newIndex) {
        var cv = this._layer.get_canvas();
        if (cv) {
            var layerIndex = this._layer.get_index();
            var history = cv.get_history();
            if (history.get_trackingEnabled()) {
                history.addVObjectMoved(vObject, oldIndex, newIndex, layerIndex);
            }

            //set flag that redraw needed
            cv._needCompleteRedraw = true;
        }
    },

    insert: function (index, item) {
        /// <summary>Inserts a v-object into the collection at the specified index.</summary>
        /// <param name="index" type="Number">A zero-based index at which a v-object should be added.</param>
        /// <param name="item" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">A v-object to insert.</param>
        if (item._layer) {
            throw Error.argument("item",
				Aurigma.GraphicsMill.AjaxControls.VectorObjects.Exceptions.itemBelongsCollection);
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, 'insert', [index, item]);
        this._onVObjectAdded(item, index, this._layer.get_index());
    },

    removeAt: function (index) {
        /// <summary>Removes the v-object at the specified index of the collection.</summary>
        /// <param name="index" type="Number">A zero-based index of the v-object to remove.</param>
        var layerIndex = this._layer.get_index();
        var item = this.get_item(index);
        if (item) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, 'removeAt', [index]);
            this._onVObjectRemoved(item, index, layerIndex);
        }
    },

    move: function (oldIndex, newIndex) {
        /// <summary>Moves a v-object from one position to another.</summary>
        /// <param name="oldIndex" type="Number">A zero-based index of the v-object to move.</param>
        /// <param name="newIndex" type="Number">A zero-based index to move the v-obejct to.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> that was moved.</returns>
        var item = Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, 'move', [oldIndex, newIndex]);
        if (item) {
            this._onVObjectMoved(item, oldIndex, newIndex);
        }
        return item;
    },

    clear: function () {
        /// <summary>Removes all v-objects from the collection.</summary>
        var cnt = this.get_count();
        for (var i = 0; i < cnt; i++) {
            this.get_item(i)._layer = null;
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.callBaseMethod(this, "clear");
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.Collection);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
/// <reference name="MicrosoftAjax.js" />
/// <reference path="~/ClientScripts/Math/PointF.js" />
/// <reference path="~/ClientScripts/Math/RectangleF.js" />
/// <reference path="~/ClientScripts/Math/RotatedRectangleF.js" />
/// <reference path="~/ClientScripts/Math/Common.js" />
/// <reference path="~/ClientScripts/VectorObjects/VObjectAction.js" />

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject = function () {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This is a base class for all the AJAX vector objects.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.initializeBase(this);

    this.ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    this._visible = true;
    this._locked = false;
    this._name = "";
    this._controlPoints = [];
    this._transformChangedDelegate = null;
    this._layer = null;
    this._tag = null;
    this._permissions = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission({
        NoPrint: false,
        NoShow: false
    }, true);
    //use current time to generate unique id
    //use this id for matching between server and cliebt objects
    this._uniqueId = this._createUniqueID();

    //set default transform
    this._initTransform();

    this._callbacks = [];
    this._activeCanvasIndex = -1;

    this._isCallingService = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.prototype = {
    _createUniqueID: function () {
        return ("vo" + new Date().getTime()) + Math.round(Math.random() * 1000);
    },

    clone: function () {
        var clonedObject = new this.constructor();

        var clonedObjId = clonedObject.get_uniqueId();

        clonedObject.set_data(this.get_data());

        clonedObject.set_uniqueId(clonedObjId);

        return clonedObject;
    },

    get_ready: function () {
        /// <summary>Check if VObject is ready.
        /// The property considered to be internal.</summary>
        /// <value type="Boolean"></value>        
        return true;
    },

    isLoadingImage: function () {
        /// <summary>Detemine is process of loading image for object from server, is in progress</summary>
        /// <value type="Boolean"></value>

        return false;
    },

    get_uniqueId: function () {
        /// <summary>Gets or sets a unique identifier of this vector object.</summary>
        /// <value type="String">The string which represents a unique identifier of this vector object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.UniqueId">VObject.UniqueId</see> server-side member.</para></remarks>
        return this._uniqueId;
    },

    //use only for deserialization
    set_uniqueId: function (v) {
        this._uniqueId = v;
    },

    get_controlPoints: function () {
        /// <summary>Gets or sets an array of control points associated with the v-object.</summary>
        /// <value type="Array">An array of control points.</value>
        return this._controlPoints;
    },

    set_controlPoints: function (v) {
        this._controlPoints = v;
        this.raiseChanged();
    },

    get_permissions: function () {
        return this._permissions;
    },

    set_permissions: function (v) {
        this._permissions = v;
        this.raiseChanged();
    },

    get_transform: function () {
        /// <summary>Gets or sets value which configures v-object transformation.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform" /> class instance which provides an access to properties which configure v-object transformation.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Transform">VObject.Transform</see> server-side member.</para></remarks>
        return this._transform;
    },

    set_transform: function (v, supressOnChanged) {
        if (!this._transform.isEqual(v)) {
            //clear event handlers
            this._transform.remove_transformChanged(this._transformChangedDelegate);

            this._transform = v;
            this._transform.add_transformChanged(this._transformChangedDelegate);

            if (!supressOnChanged)
                this._transformChanged();
        }
    },

    _transformChanged: function () {
        this.raiseChanged();
    },

    get_tag: function () {
        /// <summary>Gets or sets custom data.</summary>
        /// <value type="Object">The value which represents a piece of custom data.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Tag">VObject.Tag</see> server-side member.</para></remarks>
        return this._tag;
    },

    set_tag: function (v) {
        this._tag = v;
        this.raiseChanged();
    },

    get_supportedActions: function () {
        /// <summary>Gets or sets the enumeration of actions which can be applied to this vector object.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectAction" /> enumeration which lists available actions.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.SupportedActions">VObject.SupportedActions</see> server-side member.</para></remarks>
        return this._permissions.toActions();
    },

    set_supportedActions: function (value) {
        this._permissions.fromActions(value);
        this.raiseChanged();
    },

    get_canvas: function () {
        /// <summary>Gets a reference to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> object this vector object belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> this vector object belongs to.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Canvas">VObject.Canvas</see> server-side member.</para></remarks>
        return (this._layer) ? this._layer.get_canvas() : null;
    },

    get_layer: function () {
        /// <summary>Gets a reference to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> object this vector object belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Layer" /> this vector object belongs to.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Layer">VObject.Layer</see> server-side member.</para></remarks>
        return this._layer;
    },

    get_index: function () {
        /// <summary>Get the index of this v-object in the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectCollection" />. Returns <c>-1</c> if the v-object was not added to the collection.</summary>
        /// <value type="Number">The index of this vector object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Index">VObject.Index</see> server-side member.</para></remarks>
        return (this._layer) ? this._layer.get_vObjects().indexOf(this) : -1;
    },

    get_bounds: function () {
        /// <summary>Gets the size and location (in points) of this v-object relatively to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> it belongs to.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The rectangle relative to the canvas that represents the size and location of the v-object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Bounds">VObject.Bounds</see> server-side member.</para></remarks>
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(0, 0, 0, 0);
    },

    get_name: function () {
        /// <summary>Gets or sets the name of this vector object.</summary>
        /// <value type="String">The name of this v-object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Name">VObject.Name</see> server-side member.</para></remarks>
        return this._name;
    },

    set_name: function (v) {
        this._name = v;
        this.raiseChanged();
    },

    _get_type: function () {
        var type = Object.getType(this).getName().split('.');
        type = type[type.length - 1];
        return type;
    },

    //get class name that contains data for serialization
    //don't forget override in derived classes
    _get_dataType: function () {
        return "VObjectData";
    },

    get_data: function () {
        /// <summary>Gets or sets serialized data of this v-object.</summary>
        /// <value type="String">The string which represents serialized data of this v-object.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Data">VObject.Data</see> server-side member.</para></remarks>
        var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects[this._get_dataType()](this);
        return JSON.stringify(data);
    },

    set_data: function (v) {
        //raise changed event in applyState method
        if (v && v != "") {
            var data;
            if (typeof v == "string")
                data = JSON.parse(v);
            else
                data = v;
            Aurigma.GraphicsMill.AjaxControls.VectorObjects[this._get_dataType()].applyState(data, this);
        }
    },

    _setNeedRedrawCanvasFlag: function (redrawAll) {
        var cv = this.get_canvas();
        if (cv) {
            if (redrawAll)
                cv._needCompleteRedraw = true;
            else
                cv._needRedraw = true;
        }
    },

    get_visible: function () {
        /// <summary>Gets or sets the value indicating if the v-object is visible.</summary>
        /// <value type="Boolean"><strong>true</strong> if the v-object is visible; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Visible">VObject.Visible</see> server-side member.</para></remarks>
        return this._visible;
    },

    set_visible: function (v) {
        if (this._visible !== v) {
            this._visible = v;
            this.raiseChanged();
        }
    },

    isVisible: function () {
        return this.get_visible() && !this.get_permissions().get_noShow() && this.get_layer() != null && this.get_layer().get_visible();
    },

    get_locked: function () {
        /// <summary>Gets or sets the value indicating if the v-object is locked.</summary>
        /// <value type="Boolean"><strong>true</strong> if the v-object is locked; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.Locked">VObject.Locked</see> server-side member.</para></remarks>
        return this._locked;
    },

    set_locked: function (v) {
        if (this._locked !== v) {
            this._locked = v;
            this.raiseChanged();
        }
    },

    isLocked: function () {
        return this.get_locked() || this.get_layer() != null && this.get_layer().get_locked();
    },

    _onAddedOnCanvas: function (canvas) {
    },

    _onRemovedFromCanvas: function (canvas) {
    },

    processEvent: function (e) {
        /// <summary>Executes the specified event.</summary>
        /// <param name="e" type="Object">The event to execute.</param>
    },

    hitTest: function (point) {
        /// <summary>Determines whether the specified point is located inside this vector object.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point is located inside this vector object; otherwise <strong>false</strong>.</returns>
    },

    draw: function (ctx) {
        /// <summary>Draws this vector object.</summary>
    },

    _updateColors: function () {
    },

    _updateColor: function (color, callback) {
        var success = Function.createDelegate(this, function (data) {
            if (typeof callback == "function") {
                var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(JSON.parse(data));
                callback(result);
            }
        });

        var failure = function (error) {
            if (window.console) {
                console.log("Fail updateColorByService");
                console.log(error);
            }
        };

        var data = JSON.stringify(color._get_data());
        this._callService("UpdateByColorData", data, success, failure);
    },

    quickUpdate: function () {
        //do nothing by default
    },

    update: function (beforeUpdate, afterUpdate) {
        /// <summary>this function calls server update function for this object (for example for update text).</summary>
        /// <param name="beforeUpdate" type="function">Before update callback</param>
        /// <param name="afterUpdate" type="function">After update callback</param>

        //do nothing by default
    },

    _validateBeforeCallService: function () {
        return true;
    },

    _update: function (additionalArgs, beforeUpdate, afterUpdate) {
        var success = Function.createDelegate(this, function (data) {
            this.set_data(data);
            this.quickUpdate();

            if (typeof afterUpdate == "function") {
                afterUpdate();
                this.raiseChanged();
            }
        });

        var failure = function (error) {
            if (window.console) {
                console.log("Fail updateByService");
                console.log(error);
            }
        };

        if (this.get_isUpdating()) {
            this._callbacks.push(beforeUpdate);
            return;
        }

        if (typeof beforeUpdate == "function")
            beforeUpdate();

        var vObjectData = new this.ns[this._get_dataType()](this);
        vObjectData.__type = this._get_dataType();
        var data = [JSON.stringify(vObjectData)];
        if (additionalArgs != null)
            data = data.concat(additionalArgs);

        if (this._validateBeforeCallService())
            this._callService("UpdateBy" + this._get_dataType(), data, success, failure);
        else
            this.raiseChanged();
    },

    _callService: function (methodName, data, success, failure) {
        var onSuccess = Function.createDelegate(this, function (data) {
            this._isCallingService = false;

            if (typeof success == "function")
                success(data);
        });

        var onFailure = function (error, userContext, methodName) {
            this._isCallingService = false;

            var xmlhttp = new XMLHttpRequest();
            if (error._statusCode == 500 && error._errorObject == undefined) {
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {// 4 = "loaded"
                        if (xmlhttp.status == 200)
                            call();
                        else if (window.console)
                            console.log("Fail retrieve XML data");
                    }
                };
                xmlhttp.open("GET", document.location.href, false);
                xmlhttp.setRequestHeader('If-Modified-Since', '0');
                xmlhttp.send();
            }
            else if (typeof failure == "function") {
                failure(error);
            }
        };

        var call = Function.createDelegate(this, function () {
            var canvas = this.get_canvas();
            if (canvas != null && canvas.get_isInitialized()) {
                var args = [canvas.get_data(true)];
                if (data != null)
                    args = args.concat(data);
                args = args.concat(onSuccess, onFailure);

                this._isCallingService = true;
                var service = this.ns.Service;
                service[methodName].apply(service, args);
            }
        });

        call();
    },

    endUpdate: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.callBaseMethod(this, "endUpdate");

        var modified = false;
        while (this._callbacks.length > 0) {
            var callback = this._callbacks.shift();
            if (typeof callback == "function") {
                callback();
                modified = true;
            }
        }

        if (modified)
            this.update();
    },

    updated: function () {
        /// <exclude />
        this.raiseChanged();
    },

    raiseChanging: function (params) {
        /// <summary>Fires the <see cref="E:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.changing" /> event.</summary>
        var handler = this.get_events().getHandler("changing");
        if (handler) {
            handler(this, params);
        }
    },

    raiseChanged: function (params) {
        /// <summary>Fires the <see cref="E:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.changed" /> event.</summary>
        if (!this.get_isUpdating()) {
            var handler = this.get_events().getHandler("changed");
            if (handler) {
                handler(this, params);
            }
            var cv = this.get_canvas();
            if (cv)
                cv._invokeServer(this, 'changed');
        }
    },

    add_ready: function (handler) {
        /// <summary>Fires when v-object's ready property sets to true.</summary>
        this.get_events().addHandler('ready', handler);
    },

    remove_ready: function (handler) {
        this.get_events().removeHandler('ready', handler);
    },

    // protected
    _dispatchReadyEvent: function () {
        var h = this.get_events().getHandler('ready');
        if (h) {
            h(this, Sys.EventArgs.Empty);
        }
    },

    add_changing: function (handler) {
        /// <summary>Fires before v-object is being modified (before the start of an operation).</summary>
        this.get_events().addHandler("changing", handler);
    },

    remove_changing: function (handler) {
        this.get_events().removeHandler("changing", handler);
    },

    add_changed: function (handler) {
        /// <summary>Fires when v-object was modified (after the end of an operation).</summary>
        this.get_events().addHandler("changed", handler);
    },

    remove_changed: function (handler) {
        this.get_events().removeHandler("changed", handler);
    },

    add_beforeCreate: function (handler) {
        /// <summary>Fires when v-object is about to be created.</summary>
        this.get_events().addHandler("beforeCreate", handler);
    },

    remove_beforeCreate: function (handler) {
        this.get_events().removeHandler("beforeCreate", handler);
    },

    initialize: function () {
        /// <summary>Initializes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    },

    _initTransform: function () {
        this._transform = $create(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform);

        if (!this._transformChangedDelegate) {
            this._transformChangedDelegate = Function.createDelegate(this, this._transformChanged);
        }
        this._transform.add_transformChanged(this._transformChangedDelegate);
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" /> from the application.</summary>
        if (this._transformChangedDelegate) {
            this._transform.remove_transformChanged(this._transformChangedDelegate);
            delete this._transformChangedDelegate;
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject", Sys.Component);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData = function (vObject) {
    ///	<summary>This is a base class for all the classes which represent a state of a vector object.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    /// <field name="Name" type="String" static="true"><summary>The name of the v-object.</summary></field>
    /// <field name="Visible" type="Boolean" static="true"><summary>The value indicating if the v-object is visible.</summary></field>
    /// <field name="Locked" type="Boolean" static="true"><summary>The value indicating if the v-object is locked.</summary></field>
    /// <field name="Tag" type="Array" static="true"><summary>The array of control points associated with the v-object.</summary></field>
    /// <field name="P" type="Object" static="true"><summary>The custom data.</summary></field>
    /// <field name="ID" type="String" static="true"><summary>The unique identifier of the v-object.</summary></field>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.initializeBase(this);

    if (vObject) {
        this.N = vObject.get_name();
        this.V = vObject.get_visible();
        this.L = vObject.get_locked();
        this.P = vObject.get_controlPoints();
        this.Tg = vObject.get_tag();
        this.ID = vObject.get_uniqueId();
        var transform = vObject.get_transform();
        this.T = {
            ScaleX: transform.get_scaleX(), ScaleY: transform.get_scaleY(),
            TranslateX: transform.get_translateX(), TranslateY: transform.get_translateY(),
            Angle: transform.get_angle()
        };
        this.Prm = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.PermissionData(vObject.get_permissions());
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.applyState = function (vObjectData, vObject) {
    /// <summary>Applies the <paramref name="vObjectData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="vObjectData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate();
        vObject.set_name(vObjectData.N);
        vObject.set_visible(vObjectData.V);
        vObject.set_locked(vObjectData.L);
        vObject.set_controlPoints(vObjectData.P);
        var transform = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(
			vObjectData.T.ScaleX, vObjectData.T.ScaleY,
			vObjectData.T.TranslateX, vObjectData.T.TranslateY,
			vObjectData.T.Angle);
        vObject.set_transform(transform, true);
        vObject.set_tag(vObjectData.Tg);
        vObject.set_uniqueId(vObjectData.ID);
        vObject.set_permissions(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Permission(vObjectData.Prm));
        vObject.endUpdate();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.prototype = {
    N: "",
    V: true,
    L: true,
    P: [],
    Tg: null,
    ID: ("vo" + new Date().getTime()) + Math.round(Math.random() * 1000),
    Prm: {}
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData", null);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData = function (vObject) {
    ///	<summary>This is a base class for all the classes which represent a state of a rectangle vector object.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.TWM = vObject.get_textWrappingMode();
        this.O = vObject.get_opacity();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState = function (rectangleData, vObject) {
    /// <summary>Applies the <paramref name="rectangleData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="rectangleData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_textWrappingMode(rectangleData.TWM);
        vObject.set_opacity(rectangleData.O);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData.applyState(rectangleData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.registerClass(
	"Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject = function (path) {
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
    ns.ShapeVObject.initializeBase(this);

    this._path = path != null ? path : new ns.Math.Path("");
    this._transformedPath = null;
    this._pathChangedDelegate = Function.createDelegate(this, this._pathChanged);

    this._borderColor = new ns.RgbColor("rgba(0,0,0,1)");
    this._borderWidth = 1;
    this._fillColor = new ns.RgbColor("rgba(112,112,112,1)");
    this._fixedBorderWidth = false;

    this._allowNegativeResize = false;

    this._isHuge = false;
    this._hugePathMinLength = 10000;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.prototype = {
    update: function (beforeUpdate, afterUpdate) {
        if (typeof beforeUpdate != "function")
            return;

        if (this.isVisible())
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "_update", [null, beforeUpdate, afterUpdate]);
        else
            beforeUpdate();
    },

    set_visible: function (value) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "set_visible", [value]);
        if (this.isVisible())
            this.update();
        else
            this._setNeedRedrawCanvasFlag();
    },

    get_path: function () {
        if (this._transformedPath)
            this._transformedPath.remove_pathChanged(this._pathChangedDelegate);
        this._transformedPath = this._get_transformedPath();
        this._transformedPath.add_pathChanged(this._pathChangedDelegate);

        return this._transformedPath;
    },

    set_path: function (v) {
        if (!this._get_transformedPath().isEqual(v)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._path = v;
                this._isHuge = this._path.get_length() > this._hugePathMinLength;
                this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform());
            });

            this.update(beforeUpdate);
        }
    },

    get_borderWidth: function () {
        return this._borderWidth;
    },

    set_borderWidth: function (v) {
        if (this._borderWidth !== v) {
            this._borderWidth = v;

            var canvas = this.get_canvas();
            if (canvas != null)
                canvas.updateSelection();

            this._setNeedRedrawCanvasFlag();
        }
    },

    get_borderColor: function () {
        return this._borderColor;
    },

    set_borderColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._borderColor.equals(color)) {
            this._borderColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_fillColor: function () {
        return this._fillColor;
    },

    set_fillColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._fillColor.equals(color)) {
            this._fillColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_fixedBorderWidth: function () {
        return this._fixedBorderWidth;
    },

    set_fixedBorderWidth: function (v) {
        if (this._fixedBorderWidth !== v) {
            this._fixedBorderWidth = v;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_originalPath: function () {
        return this._path;
    },

    set_originalPath: function (path) {
        this._path = path;
        this._isHuge = this._path.get_length() > this._hugePathMinLength;
    },

    _get_boundsMargin: function () {
        return this._borderWidth;
    },

    _get_transformedPath: function () {
        var center = this._get_controlCenter();
        var path = this._path.clone();

        path.transform(this.get_transform(), center);

        return path;
    },

    _pathChanged: function () {
        this.set_path(this._transformedPath.clone());
    },

    _get_dataType: function () {
        return "ShapeVObjectData";
    },

    draw: function (ctx) {
        if (!ctx)
            return;

        var borderWidth = this.get_borderWidth();
        if (this.get_fixedBorderWidth())
            borderWidth /= this.get_canvas().get_zoom();

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.path(
            ctx, this._path, this._get_controlCenter(), this.get_transform(), this.get_fillColor().Preview, borderWidth, this.get_borderColor().Preview, this.get_opacity());
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "_updateColors");

        var self = this;
        var fillColorCallback = Function.createDelegate(this, function (color) {
            self.set_fillColor(color);
        });

        var borderColorCallback = Function.createDelegate(this, function (color) {
            self.set_borderColor(color);
        });

        this._updateColor(this.get_fillColor(), fillColorCallback);
        this._updateColor(this.get_borderColor(), borderColorCallback);
    },

    _onAddedOnCanvas: function (canvas, supressUpdate) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.callBaseMethod(this, "_onAddedOnCanvas", [canvas]);

        if (supressUpdate !== true)
            this.update();
    }
}
Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.Pth = vObject.get_originalPath().toString();
        this.BW = vObject.get_borderWidth();
        this.BC = vObject.get_borderColor()._get_data();
        this.FC = vObject.get_fillColor()._get_data();
        this.FBW = vObject.get_fixedBorderWidth();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState = function (shapeData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_originalPath(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(shapeData.Pth));
        vObject.set_borderWidth(shapeData.BW);
        vObject.set_borderColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(shapeData.BC));
        vObject.set_fillColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(shapeData.FC));
        vObject.set_fixedBorderWidth(shapeData.FBW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(shapeData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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
Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.EllipseVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject = function (x1, y1, x2, y2) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector line.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.initializeBase(this, []);

    this._width = 4;
    this._color = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");
    this._fixedWidth = false;
    var m = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;

    this._controlPoints = [
		new m.PointF(((x1) ? x1 : 0), ((y1) ? y1 : 0)),
		new m.PointF(((x2) ? x2 : 0), ((y2) ? y2 : 0))];

    this.set_textWrappingMode(Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.prototype = {
    get_width: function () { /// <summary>Get or sets width of this vector line (in points).</summary>
        /// <value type="Number">The width of this vector line (in points).</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Width">LineVObject.Width</see> server-side member.</para></remarks>
        return this._width;
    },

    set_width: function (v) {
        this._width = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_color: function () { /// <summary>Gets or sets a color of this vector line.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of this vector line.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Color">LineVObject.Color</see> server-side member.</para></remarks>
        return this._color;
    },

    set_color: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._color.equals(color)) {
            this._color = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_fixedWidth: function () { return this._fixedWidth; },

    set_fixedWidth: function (v) {
        this._fixedWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_point0: function () { /// <summary>Gets or sets the start point of this vector line.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents the start point.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Point0">LineVObject.Point0</see> server-side member.</para></remarks>
        return this._getActualPoint(this._controlPoints[0]);
    },

    set_point0: function (point) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var bounds = this._get_controlBounds();
        if (bounds.Width === 0 || bounds.Height === 0) {
            var p1 = this._getActualPoint(this._controlPoints[1]);
            this._controlPoints = [point.clone(), p1];
            this.set_transform(new ns.Transform());
        } else {
            this._setTransformByPoints(this._controlPoints[0], point, this._controlPoints[1]);
        }
    },

    get_point1: function () { /// <summary>Gets or sets the end point of this vector line.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> value which represents the end point.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.Point1">LineVObject.Point1</see> server-side member.</para></remarks>
        return this._getActualPoint(this._controlPoints[1]);
    },

    set_point1: function (point) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var bounds = this._get_controlBounds();
        if (bounds.Width === 0 || bounds.Height === 0) {
            var p0 = this._getActualPoint(this._controlPoints[0]);
            this._controlPoints = [p0, point.clone()];
            this.set_transform(new ns.Transform());
        } else {
            this._setTransformByPoints(this._controlPoints[1], point, this._controlPoints[0]);
        }
    },

    _getActualPoint: function (controlPoint) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
        var p = new ns.PointF(controlPoint.X, controlPoint.Y);
        var center = this._get_controlCenter();
        p.translate(-center.X, -center.Y);
        var transform = this.get_transform();
        p.scale(transform.get_scaleX(), transform.get_scaleY());
        p.rotate(transform.get_angle());
        p.translate(transform.get_translateX(), transform.get_translateY());
        p.translate(center.X, center.Y);
        return p;
    },

    get_bounds: function () {
        /// <summary>Gets the size and location of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> taking into account its rotation and margins.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF">The <see cref="T:System.Drawing.RectangleF" /> which represents the size and location of this <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject" /> taking into account its rotation and margins.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject.Bounds">BaseRectangleVObject.Bounds</see> server-side member.</para></remarks>
        var p1 = this.get_point0();
        var p2 = this.get_point1();
        var x = Math.min(p1.X, p2.X);
        var w = Math.max(p1.X, p2.X) - x;
        var y = Math.min(p1.Y, p2.Y);
        var h = Math.max(p1.Y, p2.Y) - y;

        var len = Math.sqrt(w * w + h * h);
        var dw = this.get_width() * h / len;
        var dh = this.get_width() * w / len;

        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(x - dw / 2, y - dh / 2, w + dw, h + dh);
    },

    _get_boundsMargin: function () { return this._width; },

    _setTransformByPoints: function (controlPoint1, actualPoint1, controlPoint2) {
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var controlCenter = this._get_controlCenter();

        var actualPoint2 = this._getActualPoint(controlPoint2);

        var newCenter = new ns.Math.PointF((actualPoint2.X + actualPoint1.X) / 2,
			(actualPoint2.Y + actualPoint1.Y) / 2);

        var translateX = newCenter.X - controlCenter.X;
        var translateY = newCenter.Y - controlCenter.Y;

        var p1 = new ns.Math.PointF(controlPoint1.X, controlPoint1.Y).translate(-controlCenter.X, -controlCenter.Y);
        var p2 = new ns.Math.PointF(actualPoint1.X, actualPoint1.Y).translate(-translateX, -translateY).translate(-controlCenter.X, -controlCenter.Y);

        var cosAngle = (p1.X * p2.X + p1.Y * p2.Y) / Math.sqrt((p1.X * p1.X + p1.Y * p1.Y) * (p2.X * p2.X + p2.Y * p2.Y));
        cosAngle = ns.Math.Clamp(-1, cosAngle, 1);
        var angle = ns.Math.ConvertRadianToDegree(Math.acos(cosAngle));
        p2 = p2.rotate(-angle);
        this.set_transform(new ns.Transform(p2.X / p1.X, p2.Y / p1.Y, translateX, translateY, angle));
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "LineVObjectData";
    },

    draw: function (ctx) {
        /// <summary>Draws this vector line.</summary>
        if (!ctx)
            return;

        var sp = this.get_point0();
        var ep = this.get_point1();
        if (this.get_width() > 0) {
            var width = this.get_width();
            if (this.get_fixedWidth())
                width /= this.get_canvas().get_zoom();

            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawLine(
                ctx, sp.X, sp.Y, ep.X, ep.Y, width, this.get_color().Preview, this.get_opacity());
        }
    },

    // p1-p2 - piece of line.
    // p3 - test point.
    _belongToPiece: function (p1, p2, p3, width, tolerance) {
        var squareDist = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToSegment(p3, p1, p2);
        var eps = width / 2 + tolerance;
        if (squareDist <= eps * eps)
            return true;
        else
            return false;
    },

    hitTest: function (point, isSelected) {
        /// <summary>Determines whether the specified point belongs to this vector line.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point belongs to this vector line; otherwise <strong>false</strong>.</returns>
        var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.callBaseMethod(this, 'hitTest', [point.clone()]);
        var p = point.clone();
        var c = this.get_canvas();

        // for tolerance in selection.
        var mul = c.get_zoom() * c.get_screenXDpi() / 72;
        var rectFrame = this.get_rectangle();
        var isBelongRect = isSelected ? rectFrame.toRectangleF().contains(point) : false;
        var isBelongPiece = this._belongToPiece(this.get_point0(), this.get_point1(), p, this.get_width(), 2 / mul);

        result.body = isBelongRect || isBelongPiece ? true : false;

        return result;
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var colorCallback = Function.createDelegate(this, function (color) {
            self.set_color(color);
        });

        this._updateColor(this.get_color(), colorCallback);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a line vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.W = vObject.get_width();
        this.C = vObject.get_color()._get_data();
        this.FW = vObject.get_fixedWidth();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.applyState = function (lineData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_width(lineData.W);
        vObject.set_color(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(lineData.C));
        vObject.set_fixedWidth(lineData.FW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(lineData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject = function (points) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector polyline.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.initializeBase(this, []);

    this._width = 20;
    this._color = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(255,255,61,1)");

    this._controlPoints = [];
    if (points && points.length && points.length > 0) {
        for (var i = 0; i < points.length; i++) {
            if (Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF.isInstanceOfType(points[i]))
                this._controlPoints.push(points[i]);
        }
    }

    this.set_textWrappingMode(Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None);
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.prototype = {
    _get_boundsMargin: function () {
        return this._width;
    },

    get_width: function () {
        /// <summary>Get or sets width of this vector polyline (in points).</summary>
        /// <value type="Number">The width of this vector polyline (in points).</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.Width">PolylineVObject.Width</see> server-side member.</para></remarks>

        return this._width;
    },

    set_width: function (v) {
        this._width = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_color: function () {
        /// <summary>Gets or sets a color of this vector polyline.</summary>
        /// <value type="String">The color value specified as a hex representation of the RGB triad in HTML-style syntax (#rrggbb) which specifies a color of this vector polyline.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.Color">PolylineVObject.Color</see> server-side member.</para></remarks>
        return this._color;
    },

    set_color: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._color.equals(color)) {
            this._color = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PolylineVObjectData";
    },

    // add point, and try to smooth
    //add pointd while interactive drawing
    _addPoint: function (pt) {
        var c = this.get_canvas();
        var mul = -1;
        if (c) {
            mul = (c.get_screenXDpi() / 72) * c.get_zoom();
        }
        var d = 30;
        var pts = this.get_controlPoints();
        if (pts.length > 0) {
            var dist = pts[pts.length - 1].distance(pt);
            if (mul === -1 || dist * mul > d) {
                pts.push(pt);
            }
        }
        else {
            pts.push(pt);
        }
    },

    addPoint: function (point) {
        /// <summary>Adds the specified point to the end of the points array.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to add.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.AddPoint(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF)">PolylineVObject.AddPoint(PointF)</see> server-side member.</para></remarks>
        this.insertPoint(point, this._controlPoints.length);
    },

    insertPoint: function (point, index) {
        /// <summary>Inserts the point into the specified position.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to insert.</param>
        /// <param name="index" type="Number">The position to insert.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.InsertPoint(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF,System.Int32)">PolylineVObject.InsertPoint(PointF, Int32)</see> server-side member.</para></remarks>
        if (index < 0 || index > this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.insertPointOutOfRange);

        var actualPoints = this.getPoints();
        Array.insert(actualPoints, index, point);
        //change original points to actual points and reset transform
        this._controlPoints = actualPoints;
        this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform());
    },

    setPoint: function (point, index) {
        /// <summary>Sets a point to the specified position.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to set.</param>
        /// <param name="index" type="Number">The position to set point to.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.SetPoint(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF,System.Int32)">PolylineVObject.SetPoint(PointF, Int32)</see> server-side member.</para></remarks>
        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        if (index < 0 || index >= this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.setPointOutOfRange);

        var actualPoints = this.getPoints();
        actualPoints[index] = point;
        this._controlPoints = actualPoints;
        this.set_transform(new ns.Transform());
        this.raiseChanged();
    },

    getPoints: function () {
        /// <summary>Returns an array of points this polyline is constructed from.</summary>
        /// <returns type="Array">The array of points which are nodes of this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" />.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.GetPoints">PolylineVObject.GetPoints</see> server-side member.</para></remarks>
        var arr = [];
        var center = this._get_controlCenter();
        for (var i = 0; i < this._controlPoints.length; i++)
            arr.push(this._getActualPointFromControlPoint(this._controlPoints[i], center));
        return arr;
    },

    getPointsCount: function () {
        /// <summary>Gets the number of points this polyline is constructed from.</summary>
        /// <returns type="Number">The number of points this polyline is constructed from.</returns>
        /// <remarks><para>This method corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.PointsCount">PolylineVObject.PointsCount</see> server-side member.</para></remarks>
        return this._controlPoints.length;
    },

    getPoint: function (index) {
        /// <summary>Returns a point with the specified index.</summary>
        /// <param name="index" type="Number">The index of the point.</param>
        /// <returns type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF" /> that matches the specified index.</returns>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.GetPoint(System.Int32)">PolylineVObject.GetPoint(Int32)</see> server-side member.</para></remarks>
        if (index < 0 || index >= this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.setPointOutOfRange);

        var p = this._getActualPointFromControlPoint(this._controlPoints[index], this._get_controlCenter());
        return p;
    },

    removePoint: function (index) {
        /// <summary>Removes point with the specified index.</summary>
        /// <param name="index" type="Number">The index of the point to remove.</param>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.RemovePoint(System.Int32)">PolylineVObject.RemovePoint(Int32)</see> server-side member.</para></remarks>
        if (index < 0 || index >= this._controlPoints.length)
            throw Error.argumentOutOfRange("index", index, ns.Exceptions.removePointOutOfRange);

        Array.removeAt(this._controlPoints, index);
    },

    _getActualPointFromControlPoint: function (point, center) {
        var p = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(point.X, point.Y);
        p.translate(-center.X, -center.Y);
        var transform = this.get_transform();
        p.scale(transform.get_scaleX(), transform.get_scaleY());
        p.rotate(transform.get_angle());
        p.translate(transform.get_translateX(), transform.get_translateY());
        p.translate(center.X, center.Y);
        return p;
    },

    get_actualPoints: function () {
        /// <summary>Gets an array points this polyline is constructed from.</summary>
        /// <value type="Array">An array of points.</value>
        var pts = [];
        var cnt = this._controlPoints.length;
        //calc center point once and use it in loop
        var center = this._get_controlCenter();
        for (var i = 0; i < cnt; i++) {
            pts.push(this._getActualPointFromControlPoint(this._controlPoints[i], center));
        }
        delete this._center;
        return pts;
    },

    _get_controlBounds: function () {
        var minx = 0;
        var miny = 0;
        var maxx = 0;
        var maxy = 0;
        var pts = this.get_controlPoints();
        var len = pts.length;
        if (len > 0) {
            minx = pts[0].X;
            maxx = pts[0].X;
            miny = pts[0].Y;
            maxy = pts[0].Y;
        }
        for (var i = 1; i < len; i++) {
            minx = Math.min(pts[i].X, minx);
            maxx = Math.max(pts[i].X, maxx);
            miny = Math.min(pts[i].Y, miny);
            maxy = Math.max(pts[i].Y, maxy);
        }
        var width = maxx - minx;
        var height = maxy - miny;
        return new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RectangleF(minx, miny, width, height);
    },

    draw: function (ctx) {
        /// <summary>Draws this vector polyline.</summary>
        if (!ctx)
            return;

        if (this.get_width() > 0) {
            var pts = this.get_actualPoints();
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawPolyline(ctx, pts, this.get_width(), this.get_color().Preview, this.get_opacity());
        }
    },

    // p - test point.
    _belongToLine: function (p, tolerance) {
        var pts = this.get_actualPoints();
        var res = false;
        var eps = this._width / 2 + tolerance;
        var squareEps = eps * eps;
        //check if point belongs to any of segments
        for (var i = 1; i < pts.length; i++) {
            var squareDist = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.getSquareDistanceToSegment(p, pts[i - 1], pts[i]);
            if (squareDist <= squareEps) {
                res = true;
                // is true, so doesn't need to continue
                break;
            }
        }
        return res;
    },

    hitTest: function (point, isSelected) {
        /// <summary>Determines whether the specified point belongs to this vector polyline.</summary>
        /// <param name="p" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF">The point to test.</param>
        /// <returns type="Boolean"><strong>true</strong> if the specified point belongs to this vector polyline; otherwise <strong>false</strong>.</returns>
        var result = Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.callBaseMethod(this, 'hitTest', [point.clone()]);

        var c = this.get_canvas();
        // for tolerance in selection.
        var mul = c.get_zoom() * c.get_screenXDpi() / 72;
        var rectFrame = this.get_rectangle();
        var isBelongRect = isSelected ? rectFrame.toRectangleF().contains(point) : false;
        var isBelongPoliLine = this._belongToLine(point, 2 / mul);
        result.body = isBelongRect || isBelongPoliLine;

        return result;
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var colorCallback = Function.createDelegate(this, function (color) {
            self.set_color(color);
        });

        this._updateColor(this.get_color(), colorCallback);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a polyline vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.W = vObject.get_width();
        this.C = vObject.get_color()._get_data();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObjectData.applyState = function (lineData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_width(lineData.W);
        vObject.set_color(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(lineData.C));
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(lineData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PolylineVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a placeholder vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    // turn off editing to serialize actual permissions
    var editing = vObject._editing;
    if (editing)
        vObject._editing = false;
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData.initializeBase(this, [vObject]);
    vObject._editing = editing;

    if (vObject) {
        if (!vObject.isEmptyContent()) {
            var data = new Aurigma.GraphicsMill.AjaxControls.VectorObjects[vObject.get_content()._get_dataType()](vObject.get_content());
            data.__type = vObject.get_content()._get_dataType();
            this.CD = JSON.stringify(data);
            this.CT = vObject.get_content()._get_type();
        } else {
            this.CD = null;
            this.CT = null;
        }

        this.SMC = vObject.get_showMaskedContent();
        this.ISC = vObject.get_isStubContent();
    }
}

// This method applies saved state (deserialized from string) to an object.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData.applyState = function (placeholderData, vObject) {
    /// <summary>Applies the <paramref name="placeholderData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="placeholderData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        if (placeholderData.CT != null && placeholderData.CD != null) {
            var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
            var content = ns.ObjectFactory.createObjectByType(placeholderData.CT, ns);
            content.set_data(placeholderData.CD);
            vObject.set_content(content);
        } else {
            vObject.set_content(null);
        }

        vObject.set_showMaskedContent(placeholderData.SMC);
        vObject.set_isStubContent(placeholderData.ISC);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState(placeholderData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlaceholderVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject = function (rectangle) {
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    if (rectangle)
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.initializeBase(this, [rectangle.Left, rectangle.Top, rectangle.Width, rectangle.Height]);
    else
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.initializeBase(this);

    this.set_borderWidth(0);
    this.set_fillColor("rgba(0,0,0,0)");
    this._maskColor = "rgba(0,0,0,0.8)";

    this._isWebkit = 'WebkitTransform' in document.documentElement.style;

    this._onImageLoadedDelegate = Function.createDelegate(this, function (e) {
        if (!e.target) {
            throw new Error('"e.target" is null.');
        }
        this._onImageLoaded(e, e.target);
    });

    //is any image loaded
    this._isImageLoaded = false;

    //is loading of image for last set url is in progress
    this._isLoadingImage = false;

    this._isUpdatingAfterResize = false;

    this._width = 0;
    this._height = 0;

    this._pixelWidth = 0;
    this._pixelHeight = 0;

    this._image = this._createImageObject(this._onImageLoadedDelegate);
    this._tmpImage = this._createImageObject(this._onImageLoadedDelegate);

    this._lastSetImgUrl = null;

    this._onCanvasChangedDelegate = null;

    this._parentPlaceholder = null;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.prototype = {
    set_visible: function (value) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.callBaseMethod(this, "set_visible", [value]);
        if (this.isVisible())
            this.update();
        else
            this._setNeedRedrawCanvasFlag();
    },

    isVisible: function () {
        if (this._parentPlaceholder != null)
            return this._parentPlaceholder.isVisible();

        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.callBaseMethod(this, "isVisible");
    },

    get_maskColor: function () {
        return this._maskColor;
    },

    set_maskColor: function (v) {
        this._maskColor = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_ready: function () {
        return this._isImageLoaded;
    },

    isLoadingImage: function () {
        return this._isLoadingImage;
    },

    _get_src: function () {
        return (typeof this._lastSetImgUrl == "string") ?
			this._lastSetImgUrl : this._createImageUrl();
    },

    _set_src: function (v) {
        if (this._image.src === v)
            return;

        this._isImageLoaded = false;
        this._image.src = v;
        this._lastSetImgUrl = v;
    },

    _createImageObject: function (loadedEventDelegate) {
        var img = new Image();
        this._fix0015740(img);

        if (typeof (loadedEventDelegate) === "function")
            Sys.UI.DomEvent.addHandler(img, 'load', loadedEventDelegate);

        return img;
    },

    _onImageLoaded: function (e, target) {
        if (target === this._tmpImage) {
            this._tmpImage = this._image;
            this._image = target;
        }

        var cv = this.get_canvas();
        if (cv != null) {
            if (!cv._pendingRedrawTimeout) {
                cv._pendingRedrawTimeout = setTimeout(function () {
                    cv.redraw(true);
                    cv._pendingRedrawTimeout = null;
                }, 100);
            }
        }

        this._isImageLoaded = true;
        this._isLoadingImage = false;
        this._isUpdatingAfterResize = false;

        this._dispatchReadyEvent();

        this._height = this.get_rectangle().Height;
    },

    _createImageUrl: function () {
        return null;
    },

    _updateImageUrl: function () {
        if (!this.isVisible())
            return;

        var cv = this.get_canvas();
        if (cv == null || !cv.get_isInitialized())
            return;

        var url = this._createImageUrl();
        if (url === null) {
            this._isImageLoaded = false;
            this._image.src = "";
            cv.redraw(true);
            return;
        }

        if (this._lastSetImgUrl !== url) {
            this._lastSetImgUrl = url;
            this._isLoadingImage = true;

            this._width = this._pixelWidth;
            this._height = this._pixelHeight;

            //https://code.google.com/p/chromium/issues/detail?id=7731
            if (this._isWebkit)
                this._tmpImage = this._createImageObject(this._onImageLoadedDelegate);

            this._tmpImage.src = url;
        }
    },

    _onCanvasChanged: function () {
        if (!this._isChanging) {
            this._updateImageUrl();
        }
    },

    quickUpdate: function () {
        /// <summary>Update this vector image only.</summary>
        this._updateImageUrl();
    },

    draw: function (ctx, isFocused) {
        /// <summary>Draws this vector image.</summary>
        if (!ctx)
            return;

        var gr = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;

        var placeholder = this._parentPlaceholder != null ? this._parentPlaceholder.get_rectangle() : this.get_rectangle();
        var content = this.get_rectangle();

        gr.fillRectangle(ctx, content, this.get_fillColor().Preview, this.get_opacity());

        if (this._isImageLoaded)
            this._drawImage(ctx, this.get_canvas().get_disableSmoothing());
        else if (this._isLoadingImage || this._isUpdatingByService)
            this.get_canvas()._drawWaitClock(ctx, { X: placeholder.CenterX, Y: placeholder.CenterY });

        if (this.get_borderWidth() > 0) {
            content.Width += this.get_borderWidth();
            content.Height += this.get_borderWidth();
            gr.drawRectangle(ctx, content, this.get_borderWidth(), this.get_borderColor().Preview, this.get_opacity());
        }
    },

    _drawMaskedContent: function (ctx) {
        this._drawImage(ctx, this.get_canvas().get_disableSmoothing(), this.get_maskColor());

        if (this._parentPlaceholder == null)
            return;

        ctx.globalCompositeOperation = "destination-out";
        var placeholder = this._parentPlaceholder;
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillPath(ctx, placeholder.get_originalPath(), placeholder._get_controlCenter(), placeholder.get_transform(), "#fff");
        ctx.globalCompositeOperation = "source-over";
    },

    _drawImage: function (ctx, disableSmoothing, maskColor) {
        var gr = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        var content = this.get_rectangle();

        // workaround for Firefox 3 when draw incomplete loaded image
        // when draw image in Firefox 3 and this._image.complete == false then get error like:
        // nsIDOMCanvasRenderingContext2D.drawImage NS_ERROR_NOT_AVAILABLE 0x80040111
        if (Sys.Browser.agent !== Sys.Browser.Firefox || this._image.complete) {
            var canvas = this.get_canvas();
            var isBoundedText = Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.isInstanceOfType(this);
            var isResizing = canvas.isVObjectSelected(this) && canvas.isResizing();
            var isUpdating = this._isLoadingImage || this._isUpdatingAfterResize;

            var scaleX = canvas.get_screenXDpi() * canvas.get_zoom() / 72,
                scaleY = canvas.get_screenYDpi() * canvas.get_zoom() / 72;

            if (isBoundedText) {
                if (!isUpdating) {
                    var rect = isResizing && this._startRectangle ? this._startRectangle : content;
                    gr.drawImage(ctx, this._image, rect, scaleX, scaleY, disableSmoothing, maskColor, this.get_opacity());
                }
            }
            else {
                gr.drawImage(ctx, this._image, content, scaleX, scaleY, disableSmoothing, maskColor, this.get_opacity());
            }
        }
    },

    _get_boundsMargin: function () {
        return this.get_borderWidth() * 2;
    },

    _onResized: function () {
        this._isUpdatingAfterResize = true;
        this.update();
    },

    _onAddedOnCanvas: function (canvas, supressUpdate) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.callBaseMethod(this, '_onAddedOnCanvas', [canvas, supressUpdate]);
        this._updateImageUrl();

        if (!this._onCanvasChangedDelegate) {
            var cv = this.get_canvas();
            if (cv) {
                this._onCanvasChangedDelegate = Function.createDelegate(this, this._onCanvasChanged);
                cv.add_zoomChanged(this._onCanvasChangedDelegate);

                if (this._needToDownloadImage)
                    this.update();
            }
        }
    },

    _onRemovedFromCanvas: function (canvas) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.callBaseMethod(this, '_onRemovedFromCanvas', [canvas]);

        if (canvas) {
            canvas.remove_zoomChanged(this._onCanvasChangedDelegate);
            delete this._onCanvasChangedDelegate;
        }
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject" /> from the application.</summary>
        // Clear image handlers
        Sys.UI.DomEvent.clearHandlers(this._tmpImage);
        Sys.UI.DomEvent.clearHandlers(this._image);
        delete this._onImageLoadedDelegate;

        if (this._onCanvasChangedDelegate) {
            var cv = this.get_canvas();
            if (cv)
                cv.remove_zoomChanged(this._onCanvasChangedDelegate);
            delete this._onCanvasChangedDelegate;
        }
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.callBaseMethod(this, 'dispose');
    },

    _fix0015740: function (img) {
        
        this._doc = img.document;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.MC = vObject.get_maskColor();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.applyState = function (contentData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        vObject.set_maskColor(contentData.MC);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState(contentData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.registerClass(
	"Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject = function (sourceUrl, rectangle, options) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a bitmap v-object.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.initializeBase(this, [rectangle]);
    this._sourceImageWidth = null;
    this._sourceImageHeight = null;

    if (!options)
        options = new Object();
    this._takeIntoAccountImageDpi = (options.takeIntoAccountImageDpi === false) ? false : true;
    this._needToDownloadImage = (options.downloadToCache === true) ? true : false;
    this._saveAspectRatio = (options.preserveAspectRatio === false) ? false : true;
    this._actualSize = (options.actualSize === true) ? true : false;

    if (sourceUrl && (!this._needToDownloadImage))
        this._image.src = sourceUrl;
    else
        this._sourceUrl = sourceUrl;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.getImageUrl = function (canvas, sourceId, pixelWidth, pixelHeight, squared) {
    var url = canvas.get_handlerUrl() + "/img" +
			"?f=" + encodeURIComponent(sourceId) +
			"&w=" + encodeURIComponent(pixelWidth) +
			"&h=" + encodeURIComponent(pixelHeight);

    if (canvas.get_previewColorManagementEnabled()) {
        url += "&cmyk=" + encodeURIComponent(canvas._cmykColorProfileFileId) +
               "&rgb=" + encodeURIComponent(canvas._rgbColorProfileFileId) +
               "&grayscale=" + encodeURIComponent(canvas._grayscaleColorProfileFileId);

        if (canvas.get_previewTargetColorSpace() !== null)
            url += "&target=" + encodeURIComponent(canvas.get_previewTargetColorSpace());
    }

    if (squared)
        url += "&sq=true";

    return url;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.prototype = {
    maxImageSize: 2000 * 2000,

    loadImage: function (sourceUrl, options) {
        /// <summary>Loads a bitmap from the external source using the specified parameters.</summary>
        /// <param name="sourceUrl" type="String">The URL to load image from.</param>
        /// <param name="options" type="Object">The structure of image load paramters. See the <strong>Remarks</strong> section for details.</param>
        /// <remarks>
        ///		<para>The structure to pass to this method should contain the following boolean values:</para>
        /// 	<list type="bullet">
        ///			<item><term>actualSize</term><description>specifies whether a size of the image v-object should be same as a size of loaded image.</description></item>
        ///			<item><term>saveAspectRatio</term><description>specifies whether to decrease width or height of the ImageVObject to save aspect ratio of loaded image.</description></item>
        ///			<item><term>downloadToServerCache</term><description>specifies whether the bitmap should be loaded to the private cache.</description></item>
        ///		</list>
        /// </remarks>

        if (typeof sourceUrl != "string")
            console.error("Invalid sourceUrl: " + sourceUrl);

        options = options || new Object();
        if (options.downloadToServerCache === true) {
            this._needToDownloadImage = true;
            this._actualSize = (options.actualSize === true) ? true : false;
            this._saveAspectRatio = (options.saveAspectRatio === false) ? false : true;

            this._sourceUrl = sourceUrl;
            this.update();
        }
        else {
            this._needToDownloadImage = false;
            this.set_src(sourceUrl);
        }
    },

    get_saveAspectRatio: function () {
        /// <summary>Specifies whether a size of the image v-object should be same as a size of loaded image.</summary>
        /// <value type="Boolean"></value>
        return this._saveAspectRatio;
    },

    set_saveAscpectRatio: function (ratio) {
        this._saveAspectRatio = ratio;
    },

    get_scaleToActualSize: function () {
        /// <summary>Get the value that specifies whether to take into account image resolution (DPI) when calculating the aspect ratio.</summary>
        /// <value type="Boolean">The value which specifies whether to take into account image resolution (DPI) when calculating the aspect ratio.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.ScaleToActualSize">ImageVObject.ScaleToActualSize</see> server-side member.</para></remarks>
        return this._takeIntoAccountImageDpi;
    },

    get_src: function () {
        /// <summary>Gets or sets the image source.</summary>
        /// <value>The path to the bitmap displayed by this image v-object.</value>
        return this._get_src();
    },

    set_src: function (v) {
        this._set_src(v);
    },

    get_sourceFileId: function () {
        return this._sourceFileId;
    },

    set_sourceFileId: function (id) {
        if (this._sourceFileId === id)
            return;

        this._sourceFileId = id;

        this._isImageLoaded = false;

        this._sourceImageWidth = null;
        this._sourceImageHeight = null;
    },

    get_sourceImageWidth: function () {
        return this._sourceImageWidth;
    },

    set_sourceImageWidth: function (value) {
        this._sourceImageWidth = value;
    },

    get_sourceImageHeight: function () {
        return this._sourceImageHeight;
    },

    set_sourceImageHeight: function (value) {
        this._sourceImageHeight = value;
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.callBaseMethod(this, '_updateColors');
        this.update();
    },

    update: function (beforeUpdate, afterUpdate) {
        /// <summary>Updates this image v-object.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.Update(System.Object[])">ImageVObject.Update(Object[])</see> server-side member.</para></remarks>
        if (this._sourceUrl != undefined && this._sourceUrl != null)
            this._update([this._actualSize, this._saveAspectRatio, this._sourceUrl], beforeUpdate, afterUpdate);
        else
            this.quickUpdate();
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "ImageVObjectData";
    },

    _updateImageUrl: function () {
        if (this.isVisible()) {
            this._lastSetImgUrl = null;

            var callBase = Function.createDelegate(this, function () {
                Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.callBaseMethod(this, '_updateImageUrl');
            });

            if (this.get_sourceFileId() == null || (this._sourceImageWidth != null && this._sourceImageHeight != null)) {
                callBase();
                return;
            }

            var onImageSizeUpdated = Function.createDelegate(this, function (data) {
                this._sourceImageWidth = data.Width;
                this._sourceImageHeight = data.Height;

                if (this._saveAspectRatio) {
                    var imageRatioWtoH = this._sourceImageWidth / this._sourceImageHeight;

                    if (this.get_width() < this.get_height())
                        this.set_height(this.get_width() / imageRatioWtoH);
                    else
                        this.set_width(this.get_height() * imageRatioWtoH);
                }

                callBase();
            });

            var onFailureImageSizeUpdate = Function.createDelegate(this, function (errData) {
                if (window.console) {
                    console.error("Unable GetimageSize of image with id " + this.get_sourceFileId());
                    console.error(errData);
                }
            });

            this.ns.Service.GetImageSize(this.get_sourceFileId(), onImageSizeUpdated, onFailureImageSizeUpdate);
        }
    },

    _createImageUrl: function () {
        var sourceId = this.get_sourceFileId();
        if (sourceId == null)
            return null;

        var cv = this.get_canvas();
        if (cv == null)
            return null;

        var pixelWidth, pixelHeight;

        if (this._isImageLoaded && this._width >= this._sourceImageWidth && this._height >= this._sourceImageHeight) {
            // Don't upscale original image
            pixelWidth = this._sourceImageWidth;
            pixelHeight = this._sourceImageHeight;
        } else {
            var zoom = cv.get_zoom();
            var XDpi = cv.get_screenXDpi();
            var YDpi = cv.get_screenYDpi();

            var pttopx_x = zoom * XDpi / 72;
            var pttopx_y = zoom * YDpi / 72;

            var rect = this.get_rectangle();
            pixelWidth = rect.Width * pttopx_x;
            pixelHeight = rect.Height * pttopx_y;
        }

        pixelWidth = Math.min(pixelWidth, this._sourceImageWidth);
        pixelHeight = Math.min(pixelHeight, this._sourceImageHeight);

        var f = this.maxImageSize / pixelWidth / pixelHeight;
        if (f < 1) {
            f = Math.sqrt(f);
            pixelWidth = pixelWidth * f;
            pixelHeight = pixelHeight * f;
        }

        pixelWidth = Math.round(pixelWidth);
        pixelHeight = Math.round(pixelHeight);

        this._pixelWidth = pixelWidth;
        this._pixelHeight = pixelHeight;

        return Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.getImageUrl(cv, sourceId, pixelWidth, pixelHeight);
    },

    add_imageResized: function (handler) {
        /// <summary>Fires when the image is resized.</summary>
        this.get_events().addHandler("ImageResized", handler);
    },

    remove_imageResized: function (handler) {
        this.get_events().removeHandler("ImageResized", handler);
    },

    _onResized: function () {
        var handler = this.get_events().getHandler("ImageResized");
        if (handler) {
            var r = this.get_rectangle();
            handler(this, { Width: r.Width, Height: r.Height });
        }

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.callBaseMethod(this, "_onResized");
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData = function (vObject) {
    ///	<summary>This class represents a state of an image vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.SrcId = vObject._sourceFileId;
        this.SrcW = vObject._sourceImageWidth;
        this.SrcH = vObject._sourceImageHeight;
        this.DI = vObject._needToDownloadImage;
        this.SAS = vObject._takeIntoAccountImageDpi;
        this.HR = vObject._privateCacheImageHorizontalResolution;
        this.VR = vObject._privateCacheImageVerticalResolution;
    }
}

// This method applies saved state (deserialized from string) to an object.
Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData.applyState = function (imageData, vObject) {
    /// <summary>Applies the <paramref name="imageData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="imageData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject._sourceFileId = imageData.SrcId;
        vObject._sourceImageWidth = imageData.SrcW;
        vObject._sourceImageHeight = imageData.SrcH;
        vObject._privateCacheImageHorizontalResolution = imageData.HR;
        vObject._privateCacheImageVerticalResolution = imageData.VR;
        vObject._needToDownloadImage = imageData.DI;
        vObject._takeIntoAccountImageDpi = imageData.SAS;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.applyState(imageData, vObject);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.ProtectedFontSettings.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.ProtectedFontSettings");﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.Txt = vObject.get_text().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        this.F_FB = vObject.get_font().get_fauxBold();
        this.F_FI = vObject.get_font().get_fauxItalic();
        this.F_N = vObject.get_font().get_postScriptName();
        this.F_S = vObject.get_font().get_size();

        this.TC = vObject.get_textColor()._get_data();
        this.U = vObject.get_underline();
        this.A = vObject.get_alignment();
        this.Tr = vObject.get_tracking();
        this.Ld = vObject.get_leading();
        this.IRT = vObject.get_isRichText();
        this.VS = vObject.get_verticalScale();
        this.HS = vObject.get_horizontalScale();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject._text = textData.Txt.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

        vObject._font._postScriptName = textData.F_N;
        vObject._font._size = textData.F_S;
        vObject._font._fauxBold = textData.F_FB;
        vObject._font._fauxItalic = textData.F_FI;

        vObject._textColor = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(textData.TC);
        vObject._underline = textData.U;
        vObject._alignment = textData.A;
        vObject._tracking = textData.Tr;
        vObject._leading = textData.Ld;
        vObject._isRichText = textData.IRT;
        vObject._verticalScale = textData.VS;
        vObject._horizontalScale = textData.HS;

        vObject._currentFileId = textData.CFI;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject = function (x1, y1, x2, y2) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector line.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.initializeBase(this, [x1, y1, x2, y2]);

    this._dashWidth = 3;
    this._altDashWidth = 3;
    this._altColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,0)");
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.prototype = {
    get_dashWidth: function () { return this._dashWidth; },

    set_dashWidth: function (v) {
        this._dashWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_altDashWidth: function () { return this._altDashWidth; },

    set_altDashWidth: function (v) {
        this._altDashWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_altColor: function () { return this._altColor; },

    set_altColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._altColor.equals(color)) {
            this._altColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    //get class name that contains data for serialization
    _get_dataType: function () { return "DashedLineVObjectData"; },

    draw: function (ctx) {
        /// <summary>Draws this vector line.</summary>
        if (!ctx)
            return;

        var sp = this.get_point0();
        var ep = this.get_point1();
        if (this.get_width() > 0) {
            var width = this.get_width();
            var dashWidth = this.get_dashWidth();
            var altDashWidth = this.get_altDashWidth();
            if (this.get_fixedWidth()) {
                var zoom = this.get_canvas().get_zoom();
                width /= zoom;
                dashWidth /= zoom;
                altDashWidth /= zoom;
            }

            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.drawDashedLine(ctx, sp.X, sp.Y, ep.X, ep.Y,
				width, this.get_color().Preview, this.get_altColor().Preview, dashWidth, altDashWidth, this.get_opacity());
        }
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var altColorCallback = Function.createDelegate(this, function (color) {
            self.set_altColor(color);
        });

        this._updateColor(this.get_altColor(), altColorCallback);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject",
	Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a dashed line vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.AC = vObject.get_altColor()._get_data();
        this.DW = vObject.get_dashWidth();
        this.ADW = vObject.get_altDashWidth();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData.applyState = function (lineData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_altColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(lineData.AC));
        vObject.set_dashWidth(lineData.DW);
        vObject.set_altDashWidth(lineData.ADW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData.applyState(lineData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObjectData",
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject = function (x, y, cols, rows, stepX, stepY) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a grid.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.initializeBase(this, [x, y, cols * stepX, rows * stepY]);

    this.set_cols(cols);
    this.set_rows(rows);
    this.set_stepX(stepX);
    this.set_stepY(stepY);

    this._horizontalLineColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");
    this._verticalLineColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,1)");

    this.set_lineWidth(1);
    this.set_fixedLineWidth(true);

    this.set_textWrappingMode(Aurigma.GraphicsMill.AjaxControls.VectorObjects.WrappingMode.None);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.prototype = {
    get_locked: function () { return true; },

    get_cols: function () { return this._cols; },

    set_cols: function (v) {
        this._cols = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_rows: function () { return this._rows; },

    set_rows: function (v) {
        this._rows = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_stepX: function () { return this._stepX; },

    set_stepX: function (v) {
        this._stepX = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_stepY: function () { return this._stepY; },

    set_stepY: function (v) {
        this._stepY = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_horizontalLineColor: function () { return this._horizontalLineColor; },

    set_horizontalLineColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._horizontalLineColor.equals(color)) {
            this._horizontalLineColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_verticalLineColor: function () { return this._verticalLineColor; },

    set_verticalLineColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._verticalLineColor.equals(color)) {
            this._verticalLineColor = color;
            this._setNeedRedrawCanvasFlag();
        }
    },

    get_lineWidth: function () { return this._lineWidth; },

    set_lineWidth: function (v) {
        this._lineWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    get_fixedLineWidth: function () { return this._fixedLineWidth; },

    set_fixedLineWidth: function (v) {
        this._fixedLineWidth = v;
        this._setNeedRedrawCanvasFlag();
    },

    //get class name that contains data for serialization
    _get_dataType: function () { return "GridVObjectData"; },

    draw: function (ctx) {
        /// <summary>Draws this vector line.</summary>
        if (!ctx)
            return;

        ctx.save();
        var rect = this.get_rectangle().get_bounds();
        ctx.translate(rect.Left, rect.Top);

        var gr = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        var c = this.get_canvas();

        var verticalLineColor = this.get_verticalLineColor().Preview;
        var horizontalLineColor = this.get_horizontalLineColor().Preview;

        var lineWidth = this.get_lineWidth();
        if (this.get_fixedLineWidth())
            lineWidth /= c.get_zoom();

        var halfLineWidth = lineWidth / 2;
        var horizontalLineLength = this.get_stepX() * this.get_cols() + halfLineWidth;
        var verticalLineLength = this.get_stepY() * this.get_rows() + halfLineWidth;
        var i, imax;

        for (i = 0, imax = this.get_cols() ; i <= imax; i++) {
            var x = i * this.get_stepX() + halfLineWidth;
            gr.drawLine(ctx, x, 0, x, verticalLineLength, lineWidth, verticalLineColor, this.get_opacity());
        }

        for (i = 0, imax = this.get_rows() ; i <= imax; i++) {
            var y = i * this.get_stepY() + halfLineWidth;
            gr.drawLine(ctx, 0, y, horizontalLineLength, y, lineWidth, horizontalLineColor, this.get_opacity());
        }
        ctx.restore();
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var verticalLineColorCallback = Function.createDelegate(this, function (color) {
            self.set_verticalLineColor(color);
        });

        var horizontalLineColorCallback = Function.createDelegate(this, function (color) {
            self.set_horizontalLineColor(color);
        });

        this._updateColor(this.get_verticalLineColor(), verticalLineColorCallback);
        this._updateColor(this.get_horizontalLineColor(), horizontalLineColorCallback);
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObject",
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a dashed line vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.LineVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.C = vObject.get_cols();
        this.R = vObject.get_rows();
        this.SX = vObject.get_stepX();
        this.SY = vObject.get_stepY();
        this.HLC = vObject.get_horizontalLineColor()._get_data();
        this.VLC = vObject.get_verticalLineColor()._get_data();
        this.LW = vObject.get_lineWidth();
        this.FLW = vObject.get_fixedLineWidth();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData.applyState = function (gridData, vObject) {
    /// <summary>Applies the <paramref name="lineData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="lineData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.DashedLineVObject">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_cols(gridData.C);
        vObject.set_rows(gridData.R);
        vObject.set_stepX(gridData.SX);
        vObject.set_stepY(gridData.SY);
        vObject.set_horizontalLineColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(gridData.HLC));
        vObject.set_verticalLineColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(gridData.VLC));
        vObject.set_lineWidth(gridData.LW);
        vObject.set_fixedLineWidth(gridData.FLW);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData.applyState(gridData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.GridVObjectData",
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseRectangleVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject = function (rectangle) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector image.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    if (rectangle)
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.initializeBase(this, [rectangle.Left, rectangle.Top, rectangle.Width, rectangle.Height]);
    else
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.initializeBase(this);

    if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version == 9 || Sys.Browser.documentMode == 9)) {
        this._domImage = document.createElement("image");
        this._domImage.id = "img_" + this._uniqueId;
        this._domImage.style.display = "none";
        document.body.appendChild(this._domImage);
    }

    this._onImageLoadedDelegate = Function.createDelegate(this, function (e) {
        if (!e.target)
            throw new Error('"e.target" is null.');
        this._onImageLoaded(e, e.target);
    });
    this._image = this._createImageObject(this._onImageLoadedDelegate);
    this._isImageLoaded = false;

    this._svgWrapper = null;
    this._svg = "";

    this.set_borderWidth(0);
    this.set_fillColor("rgba(0,0,0,0)");

    this._strokeColor = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.RgbColor("rgba(0,0,0,0)");
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.prototype = {
    get_ready: function () {
        return this._isImageLoaded;
    },

    _createImageObject: function (loadedEventDelegate) {
        var img;
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version == 9 || Sys.Browser.documentMode == 9) && this._domImage)
            img = this._domImage;
        else
            img = new Image();

        this._fix0015740(img);

        if (typeof (loadedEventDelegate) === "function")
            Sys.UI.DomEvent.addHandler(img, 'load', loadedEventDelegate);

        return img;
    },

    _onImageLoaded: function (e, target) {
        var cv = this.get_canvas();
        if (cv) {
            if (!cv._pendingRedrawTimeout) {
                cv._pendingRedrawTimeout = setTimeout(function () {
                    cv._pendingRedrawTimeout = null;
                    cv.redraw(true);
                }, 300);
            }
        }

        this._isImageLoaded = true;
        this._dispatchReadyEvent();
    },

    draw: function (ctx) {
        /// <summary>Draws this vector image.</summary>
        var rect = this.get_rectangle();

        if (!SVG.supported) {
            var fontSize = (rect.Height / 4).toFixed(0);
            ctx.font = '' + fontSize + 'px Arial';
            ctx.textAlign = "center";
            ctx.fillText('NO SVG', rect.CenterX, rect.CenterY + fontSize / 2, rect.Width);
            return;
        }

        var gr = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics;
        gr.fillRectangle(ctx, rect, this.get_fillColor().Preview);

        // workaround for Firefox 3 when draw incomplete loaded image
        // when draw image in Firefox 3 and this._image.complete == false then get error like:
        // nsIDOMCanvasRenderingContext2D.drawImage NS_ERROR_NOT_AVAILABLE 0x80040111
        if (Sys.Browser.agent == Sys.Browser.Firefox) {
            if (this._image.complete != true) {
                this._isImageLoaded = false;
            } else {
                this._isImageLoaded = true;
            }
        }

        if (this._isImageLoaded) {
            gr.drawImage(ctx, this._image, rect, 0, 0, null, null, this.get_opacity());

            if (this._image.src.indexOf('blob') == 0) {
                var DOMURL = self.URL || self.webkitURL || self;
                DOMURL.revokeObjectURL(this._image.src);
            }
        } else {
            this.get_canvas()._drawWaitClock(ctx, { X: rect.CenterX, Y: rect.CenterY });
        }

        if (this.get_borderWidth() > 0) {
            rect.Width += this.get_borderWidth();
            rect.Height += this.get_borderWidth();
            gr.drawRectangle(ctx, rect, this.get_borderWidth(), this.get_borderColor().Preview);
        }
    },

    _onAddedOnCanvas: function (canvas) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.callBaseMethod(this, '_onAddedOnCanvas', [canvas, true /* supressUpdate */]);

        this.initialize();
    },

    initialize: function () {
        /// <summary>Initializes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject" />.</summary>
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.callBaseMethod(this, 'initialize');

        if (!SVG.supported) {
            this.get_permissions().set_allowProportionalResize(false);
            this.get_permissions().set_allowArbitraryResize(false);
            this.get_permissions().set_allowRotate(false);
            this.get_permissions().set_allowMoveHorizontal(false);
            this.get_permissions().set_allowMoveVertical(false);
            return;
        }

        this._updateSize();
        this._updateImage();
    },

    _get_boundsMargin: function () {
        return this.get_borderWidth() * 2;
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "SvgVObjectData";
    },

    get_svg: function () {
        return this._svg.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    },

    set_svg: function (v) {
        v = v.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&quot;/g, '"');
        if (SVG.supported && v != "") {
            if (v != this._svg) {
                var svgDoc = SVG(document.createElement("div"));
                svgDoc.clear();
                svgDoc.svg(v);
                this._svgWrapper = svgDoc.children()[0];

                if (Sys.Browser.agent === Sys.Browser.Firefox) {
                    this._ffSvgWidth = this._svgWrapper.attr('width');
                    this._ffSvgHeight = this._svgWrapper.attr('height');
                    this._ffSvgScaleX = this._svgWrapper.transform().scaleX;
                    this._ffSvgScaleY = this._svgWrapper.transform().scaleY;
                }

                this._updateImage();
            }
        }
        else
            this._svg = v;
    },

    get_strokeColor: function () {
        return this._strokeColor;
    },

    set_strokeColor: function (v) {
        var color = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color.createColor(v);

        if (!this._strokeColor.equals(color)) {
            this._strokeColor = color;
            this._updateStroke();
        }
    },

    _updateStroke: function () {
        if (SVG.supported && this._svgWrapper) {
            var th = this;
            this._svgWrapper.each(function (i, children) {
                this.stroke({ color: th._strokeColor.Preview })
            }, true);
            this._updateImage();
        }
    },

    _updateImage: function () {
        if (this._svgWrapper) {
            this._svg = this._svgWrapper.svg();

            //Use base64 url in Safari and IE9
            if ((Sys.Browser.agent === Sys.Browser.Safari && navigator.userAgent.toLowerCase().indexOf('chrome') == -1) || (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version == 9 || Sys.Browser.documentMode == 9))) {
                if (typeof btoa === "undefined") {
                    _keyStr = Base64._keyStr;
                    btoa = Base64.encode;
                    atob = Base64.decode;
                }
                this._image.src = "data:image/svg+xml;base64," + btoa(this._svg);
            }
            else {
                var svg = new Blob([this._svg], { type: "image/svg+xml;charset=utf-8" });
                var DOMURL = self.URL || self.webkitURL || self;
                this._image.src = DOMURL.createObjectURL(svg);
            }
        }
    },

    _updateSize: function () {
        if (this._svgWrapper) {
            var sx = (this.get_rectangle().Width / this._ffSvgWidth).toFixed(2) * this._ffSvgScaleX;
            var sy = (this.get_rectangle().Height / this._ffSvgHeight).toFixed(2) * this._ffSvgScaleY;

            if (isNaN(sx) || isNaN(sy) || !isFinite(sx) || !isFinite(sy)) {
                sx = 1;
                sy = 1;
            }
            this._svgWrapper.transform({
                scaleX: sx,
                scaleY: sy
            });
            this._svgWrapper.size(this.get_rectangle().Width, this.get_rectangle().Height)
        }
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject" /> from the application.</summary>
        if (this._onImageLoadedDelegate) {
            Sys.UI.DomEvent.clearHandlers(this._image);
            delete this._onImageLoadedDelegate;
        }

        if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version == 9 || Sys.Browser.documentMode == 9) && this._domImage) {
            document.body.removeChild(this._domImage);
        }

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.callBaseMethod(this, 'dispose');
    },

    _fix0015740: function (img) {
        
        this._doc = img.document;
    },

    _updateColors: function () {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.callBaseMethod(this, '_updateColors');

        var self = this;
        var colorCallback = Function.createDelegate(this, function (color) {
            self.set_strokeColor(color);
        });

        this._updateColor(this.get_strokeColor(), colorCallback);
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a svg vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData.initializeBase(this, [vObject]);
    if (vObject) {
        this.S = vObject.get_svg();
        this.SC = vObject.get_strokeColor()._get_data();
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData.applyState = function (svgData, vObject) {
    /// <summary>Applies the <paramref name="svgData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="svgData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_svg(svgData.S);
        vObject.set_strokeColor(Aurigma.GraphicsMill.AjaxControls.VectorObjects.Color._from_data(svgData.SC));
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData.applyState(svgData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ShapeVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject = function (text, rectangle, fontName, fontSize) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector text block.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.initializeBase(this, [text, rectangle, fontName, fontSize]);

    this._wrappingRectangles = [];
    this._wrappingMargin = 7;
    this._paragraphSettings = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings();
    this._verticalAlignment = Aurigma.GraphicsMill.AjaxControls.VectorObjects.TextVerticalAlignment.Top;
    this._isVertical = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.prototype = {
    get_wrappingRectangles: function () {
        return this._wrappingRectangles;
    },

    set_wrappingRectangles: function (value) {
        if (!this._areRectanglesEqual(this._wrappingRectangles, value)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._wrappingRectangles = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_wrappingMargin: function () {
        return this._wrappingMargin;
    },

    set_wrappingMargin: function (value) {
        if (this._wrappingMargin !== value) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._wrappingMargin = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_paragraphSettings: function () {
        return this._paragraphSettings;
    },

    set_paragraphSettings: function (value) {
        if (!(value instanceof Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings))
            value = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings(value);

        if (!this._paragraphSettings.equals(value)) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._paragraphSettings = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_verticalAlignment: function () {
        return this._verticalAlignment;
    },

    set_verticalAlignment: function (value) {
        if (this._verticalAlignment !== value) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._verticalAlignment = value;
            });

            this.update(beforeUpdate);
        }
    },

    get_isVertical: function () {
        return this._isVertical;
    },

    set_isVertical: function (v) {
        if (this._isVertical !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._isVertical = v;
            });

            this.update(beforeUpdate);
        }
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "BoundedTextVObjectData";
    },

    _onAddedOnCanvas: function (canvas) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject.callBaseMethod(this, '_onAddedOnCanvas', [canvas, true /* supressUpdate */]);

        this._updateWrappingRectangles(true);
    },

    _updateWrappingRectangles: function (forceUpdate) {
        var canvas = this.get_canvas();
        if (canvas == null)
            return;

        var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;
        var thisLayerIndex = this.get_layer().get_index();
        var thisVObjectIndex = this.get_index();
        var thisRectangle = this.get_rectangle();
        var wrappingRectangles = [];

        //get actual wrapping reactangles
        var layers = canvas.get_layers();
        for (var i = thisLayerIndex, imax = layers.get_count() ; i < imax; i++) {
            var layer = layers.get_item(i);
            if (!layer.get_visible())
                continue;

            var vObjects = layer.get_vObjects();
            for (var j = 0, jmax = vObjects.get_count() ; j < jmax; j++) {
                var vo = vObjects.get_item(j);

                if (vo.get_visible() && !vo.get_permissions().get_noShow() && vo.get_textWrappingMode() != ns.WrappingMode.None &&
                    (vo.get_index() > thisVObjectIndex || layer.get_index() > thisLayerIndex)) {
                    var rect = vo.get_textWrappingMode() == ns.WrappingMode.Square ? ns.Math.RotatedRectangleF.fromRectangleF(vo.get_bounds()) :
                        vo.get_rectangle();

                    if (thisRectangle.intersectsWith(rect))
                        wrappingRectangles.push(rect);
                }
            }
        }

        //check whether the size was changed
        var rectangleSizeChanged = !this._lastRectangle || (!Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(thisRectangle.Width, this._lastRectangle.Width, 0.01) ||
            !Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.EqualsOfFloatNumbers(thisRectangle.Height, this._lastRectangle.Height, 0.01));
        var rectangleChanged = !this._lastRectangle || (!thisRectangle.isEqual(this._lastRectangle));
        this._lastRectangle = thisRectangle;

        //check whether the wrapping rectangles were changed
        var wrappingRectanglesChanged = !this._areRectanglesEqual(wrappingRectangles, this._wrappingRectangles);
        this._wrappingRectangles = wrappingRectangles;

        //do not update vObject if there are no wrapping rectangles and text was only moved or rotated (actual image should not be changed)
        if (forceUpdate || wrappingRectanglesChanged || rectangleSizeChanged || (rectangleChanged && wrappingRectangles.length > 0))
            this.update();
    },

    _areRectanglesEqual: function (rects0, rects1) {
        if (rects0.length != rects1.length)
            return false;

        for (var i = 0; i < rects0.length; i++) {
            var rect = rects0[i];

            var contains = false;
            for (var j = 0; j < rects1.length; j++) {
                if (rect.isEqual(rects1[j])) {
                    contains = true;
                    break;
                }
            }

            if (!contains)
                return false;
        }

        return true;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.WR = vObject.get_wrappingRectangles();
        this.WM = vObject.get_wrappingMargin();
        this.PS = vObject.get_paragraphSettings();
        this.VA = vObject.get_verticalAlignment();
        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        var rectangles = [];
        for (var i = 0; i < textData.WR.length; i++) {
            var r = textData.WR[i];
            rectangles.push(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(
                r.CenterX, r.CenterY, r.Width, r.Height, r.Angle));
        }

        vObject._wrappingRectangles = rectangles;
        vObject._wrappingMargin = textData.WM;
        vObject._paragraphSettings = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.ParagraphSettings(textData.PS);
        vObject._verticalAlignment = textData.VA;
        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject = function (text, location, alignment, fontName, fontSize) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a vector text block.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

    ns.PlainTextVObject.initializeBase(this, [text, null, fontName, fontSize]);

    this._baselineLocation = location instanceof ns.Math.PointF ? location : new ns.Math.PointF(0, 0);
    this._actualAngle = 0;
    this._isVertical = false;

    this._needUpdate = (typeof text == "string" || typeof fontName == "string" || typeof fontSize == "number");

    if (alignment != null) {
        this._alignment = alignment;
        this._needUpdate = true;
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.prototype = {
    //PlainTextVObject doesn't support arbitrary resize
    get_permissions: function () {
        var p = Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "get_permissions");
        p.set_allowArbitraryResize(false);
        return p;
    },

    set_permissions: function (v) {
        v.set_allowArbitraryResize(false);
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "set_permissions", [v]);
    },

    set_alignment: function (v) {
        if (this._alignment === v)
            return;

        if (this.get_isUpdating()) {
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "set_alignment", [v]);
            return;
        }

        var updateAlignment = function () {
            var ns = Aurigma.GraphicsMill.AjaxControls.VectorObjects;

            this._location = this.get_location();

            var rect = this.get_rectangle();
            var angle = rect.Angle;
            rect.Angle = 0;

            var center = new ns.Math.PointF(rect.CenterX, rect.CenterY);

            var point = this.get_baselineLocation();
            point.rotateAt(-angle, center);

            if (v === ns.TextAlignment.Left) {
                point.X = rect.get_location().X;
            } else if (v === ns.TextAlignment.Center) {
                point.X = rect.CenterX;
            } else if (v === ns.TextAlignment.Right) {
                point.X = rect.get_location().X + rect.Width;
            }

            point.rotateAt(angle, center);
            this.set_baselineLocation(point);
            this._alignment = v;

            var afterUpdate = function () {
                if (this._location) {
                    this.set_location(this._location);
                    this.raiseUpdatedForAlignment();
                }
            }.bind(this);

            this.update(null, afterUpdate);
        }.bind(this);

        if (this._needUpdate)
            this.update(null, updateAlignment);
        else
            updateAlignment();
    },

    get_baselineLocation: function () {
        var center = this._get_controlCenter();
        var point = this._baselineLocation.clone();
        var transform = this.get_transform().clone();
        transform.rotate(-this.get_actualAngle());

        point.transform(transform, center);

        return point;
    },

    set_baselineLocation: function (v) {
        var point = this.get_baselineLocation();
        if (!point.isEqual(v)) {
            this.get_transform().move(v.X - point.X, v.Y - point.Y);
            this.quickUpdate();
        }
    },

    get_originalBaselineLocation: function () {
        return this._baselineLocation;
    },

    set_originalBaselineLocation: function (v) {
        this._baselineLocation = v;
    },

    get_isVertical: function () {
        return this._isVertical;
    },

    set_isVertical: function (v) {
        if (this._isVertical !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._isVertical = v;
            });

            this.update(beforeUpdate);
        }
    },

    get_actualAngle: function () {
        return this._actualAngle;
    },

    set_actualAngle: function (v) {
        this._actualAngle = v;
    },

    add_updatedForAlignment: function (handler) {
        this.get_events().addHandler("updatedForAlignment", handler);
    },

    remove_updatedForAlignment: function (handler) {
        this.get_events().removeHandler("updatedForAlignment", handler);
    },

    raiseUpdatedForAlignment: function () {
        var handler = this.get_events().getHandler("updatedForAlignment");
        if (handler) {
            handler(this, Sys.EventArgs.Empty);
        }
    },

    update: function (beforeUpdate, afterUpdate) {
        if (this.isVisible())
            this._needUpdate = false;

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "update", [beforeUpdate, afterUpdate]);
    },

    _afterUpdate: function (afterUpdate) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "_afterUpdate", [afterUpdate]);

        var canvas = this.get_canvas();
        if (canvas != null)
            canvas.updateSelection();
    },

    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PlainTextVObjectData";
    },

    draw: function (ctx, isFocused) {
        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, 'draw', [ctx, isFocused]);

        if (window.__$abl$ === true) {
            var p = this.get_baselineLocation();
            var rect = new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.RotatedRectangleF(p.X, p.Y, 4, 4, 0);
            Aurigma.GraphicsMill.AjaxControls.VectorObjects.Graphics.fillRectangle(ctx, rect, 'red');
        }
    },

    _onResized: function () {
        var ratio = this.get_rectangle().Height / this._height;
        this._font._size = parseFloat((this._font._size * ratio).toFixed(1));
        this._leading = parseFloat((this.get_leading() * ratio).toFixed(1));

        Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.callBaseMethod(this, "_onResized");
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.BL = vObject.get_baselineLocation();
        this.AA = vObject.get_angle();
        this.T = { ScaleX: 1, ScaleY: 1, TranslateX: 0, TranslateY: 0, Angle: vObject.get_angle() };
        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_originalBaselineLocation(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF(textData.BL.X, textData.BL.Y));
        vObject.set_actualAngle(textData.AA);
        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PlainTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject = function (text, rectangle, fontName) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject.initializeBase(this, [text, rectangle, fontName]);

    this._isVertical = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject.prototype = {
    _get_dataType: function () {
        return "AutoScaledTextVObjectData";
    },

    get_verticalScale: function () {
        return this._verticalScale;
    },

    set_verticalScale: function (v) {
    },

    get_horizontalScale: function () {
        return this._horizontalScale;
    },

    set_horizontalScale: function (v) {
    },

    get_isVertical: function () {
        return this._isVertical;
    },

    set_isVertical: function (v) {
        if (this._isVertical !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._isVertical = v;
            });

            this.update(beforeUpdate);
        }
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData.applyState = function (textData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.AutoScaledTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData = function (vObject) {
    ///	<summary>This class represents a state of a text vector object and allows applying this state to the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObject" /> class instance.</summary>
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        this.TPth = vObject.get_textPath().toString();
        this.AA = vObject.get_angle();
        this.T = { ScaleX: 1, ScaleY: 1, TranslateX: 0, TranslateY: 0, Angle: vObject.get_angle() };

        this.FTP = vObject.get_fitToPath();
        this.Str = vObject.get_stretch();
        this.OFS = vObject.get_originalFontSize();
        this.FTPS = vObject.get_fitToPathStep();
        this.PS = vObject.get_pathStart();
        this.PE = vObject.get_pathEnd();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData.applyState = function (textData, vObject) {
    /// <summary>Applies the <paramref name="textData" /> state to the specified <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject" />.</summary>
    /// <param name="textData" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData">The state to apply.</param>
    /// <param name="vObject" type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.VObject">Vector object to apply the state to.</param>
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class
        vObject.set_originalTextPath(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(textData.TPth));
        vObject.set_actualAngle(textData.AA);

        vObject.set_fitToPath(textData.FTP);
        vObject.set_stretch(textData.Str);
        vObject.set_originalFontSize(textData.OFS);
        vObject.set_fitToPathStep(textData.FTPS);
        vObject.set_pathStart(textData.PS);
        vObject.set_pathEnd(textData.PE);
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.CurvedTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BaseTextVObjectData);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject = function (text, fontName, fontSize) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject.initializeBase(this, [text, null, fontName, fontSize]);

    this._boundingPaths = [];
    this._isVertical = false;
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject.prototype = {
    //get class name that contains data for serialization
    _get_dataType: function () {
        return "PathBoundedTextVObjectData";
    },

    get_boundingPaths: function () {
        return this._boundingPaths;
    },

    set_boundingPaths: function (value) {
        if (this._boundingPaths !== value) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._boundingPaths = value;
                this.set_transform(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Transform(), true);
            });

            this.update(beforeUpdate);
        }
    },

    set_originalBoundingPaths: function (value) {
        this._boundingPaths = value;
    },

    get_isVertical: function () {
        return this._isVertical;
    },

    set_isVertical: function (v) {
        if (this._isVertical !== v) {
            var beforeUpdate = Function.createDelegate(this, function () {
                this._isVertical = v;
            });

            this.update(beforeUpdate);
        }
    }
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObject);﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls.VectorObjects");

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData = function (vObject) {
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData.initializeBase(this, [vObject]);

    if (vObject) {
        var boundingPaths = vObject.get_boundingPaths();
        if (boundingPaths != null) {
            var paths = [];
            for (var i = 0; i < boundingPaths.length; i++) {
                paths.push(boundingPaths[i].toString());
            }
            this.BP = paths;
        } else
            this.BP = null;

        this.IV = vObject.get_isVertical();
    }
}

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData.applyState = function (textData, vObject) {
    if (vObject) {
        vObject.beginUpdate(); //call endUpdate in base class

        if (textData.BP != null) {
            var paths = [];
            for (var i = 0; i < textData.BP.length; i++) {
                paths.push(new Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path(textData.BP[i]));
            }
            vObject._boundingPaths = paths;
        } else
            vObject._boundingPaths = null;

        vObject._isVertical = textData.IV;
    }
    Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData.applyState(textData, vObject);
};

Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.PathBoundedTextVObjectData", Aurigma.GraphicsMill.AjaxControls.VectorObjects.BoundedTextVObjectData);