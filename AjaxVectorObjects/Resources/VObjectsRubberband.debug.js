// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls");

Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband = function (element) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" /> server-side control and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents a rubberband which adds v-objects support functionality to the <see cref="T:J:GraphicsMill.BitmapViewer" /> control.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.initializeBase(this, [element]);

    // Register
    this._canvasId;
    this._rectangleChangingDelegate;
    this._mouseDownDelegate;
    this._mouseMoveDelegate;
    this._mouseUpDelegate;
    this._zoomDelegate;
    this._canvasSaveStateDelegate;
    this._bitmapViewerSaveStateDelegate;
    this._hostDoc;
}

Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.prototype = {
    get_canvasID: function () {
        /// <summary>Gets or sets a unique identifier of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" />.</summary>
        /// <value type="String">The identifier assigned to the canvas associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" />.</value>
        return this._canvasID;
    },

    set_canvasID: function (v) {
        this._canvasID = v;
    },

    connect: function (id) {
        /// <summary>Connects this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" /> to the <see cref="T:J:GraphicsMill.BaseViewer" /> control.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.Connect(Aurigma.GraphicsMill.AjaxControls.BaseViewer)" /> server-side member.</para></remarks>
        Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.callBaseMethod(this, 'connect', [id]);
        this._hostDoc = this._viewer.get_frameDoc();
        var a = this._getRenderCtx();
        var cv = $find(this.get_canvasID());
        if (!this._canvasSaveStateDelegate) {
            this._canvasSaveStateDelegate = Function.createDelegate(cv, cv._saveState);
        }
        this._viewer.add_invokingCallbackRequest(this._canvasSaveStateDelegate);
        if (!this._bitmapViewerSaveStateDelegate) {
            this._bitmapViewerSaveStateDelegate = Function.createDelegate(this._viewer, this._viewer._saveState);
        }
        cv.add_invokingCallbackRequest(this._bitmapViewerSaveStateDelegate);
        var delegate;
        var f = function () {
            if ((cv.get_status() == Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.ready) && (cv.get_isInitialized())) {
                cv.remove_statusChanged(delegate);
                cv.remove_initialized(delegate);
                delegate = null;
                var v = this._viewer;
                // BUG11723 canvas should be the same dpi as the bitmapviewer
                // but canvas doesn't support changing dpi, so we change the internal variable
                // of canvas that contains dpi.
                cv._screenXDpi = v.get_screenXDpi();
                cv._screenYDpi = v.get_screenYDpi();
                cv.set_workspaceWidth(v.get_workspaceWidth());
                cv.set_workspaceHeight(v.get_workspaceHeight());
                cv.set_zoom(v.get_zoom());
                cv._addElement(a);
                cv.redraw(true);
            }
        }

        if ((cv.get_status() == Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.ready) && (cv.get_isInitialized())) {
            var v = this._viewer;
            cv._screenXDpi = v.get_screenXDpi();
            cv._screenYDpi = v.get_screenYDpi();
            cv.set_workspaceWidth(v.get_workspaceWidth());
            cv.set_workspaceHeight(v.get_workspaceHeight());
            cv.set_zoom(v.get_zoom());
            cv._addElement(a);
            cv.redraw(true);
        }
        else {
            delegate = Function.createDelegate(this, f);
            cv.add_statusChanged(delegate);
            cv.add_initialized(delegate);
        }

        var viewer = this._viewer;
        this._mouseDownDelegate = Function.createDelegate(this, function (e, t) {
            if (this._viewer.get_navigator() == '') {
                cv.raiseMouseDown(t);
            }
        });
        this._viewer.add_workspaceMouseDown(this._mouseDownDelegate);
        this._mouseMoveDelegate = Function.createDelegate(this, function (e, t) {
            if (this._viewer.get_navigator() == '') {
                cv.raiseMouseMove(t);
            }
        });
        this._viewer.add_workspaceMouseMove(this._mouseMoveDelegate);
        this._mouseUpDelegate = Function.createDelegate(this, function (e, t) {
            if (this._viewer.get_navigator() == '') {
                cv.raiseMouseUp(t);
            }
        });
        this._viewer.add_workspaceMouseUp(this._mouseUpDelegate);
        this._zoomDelegate = Function.createDelegate(this, this._onZoom);
        this._viewer.add_zoomed(this._zoomDelegate);
    },

    disconnect: function () {
        /// <summary>Disconnects this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" /> from the <see cref="T:J:GraphicsMill.BaseViewer" /> control.</summary>
        Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.callBaseMethod(this, 'disconnect');
        var cv = $find(this.get_canvasID());
        if (this._viewer) {
            if (this._canvasSaveStateDelegate) {
                this._viewer.remove_invokingCallbackRequest(this._canvasSaveStateDelegate);
                this._canvasSaveStateDelegate = null;
            }
            if (this._bitmapViewerSaveStateDelegate) {
                var cv = $get(this.get_canvasID());
                if (cv)
                    cv.remove_invokingCallbackRequest(this._bitmapViewerSaveStateDelegate);
                this._bitmapViewerSaveStatedelegate = null;
            }
            this._hostDoc = null;
            this._viewer.clearRenderCtx(this._getRenderCtx());
            if (this._mouseUpDelegate) {
                this._viewer.remove_workspaceMouseUp(this._mouseUpDelegate);
                this._mouseUpDelegate = null;
            }
            if (this._mouseDownDelegate) {
                this._viewer.remove_workspaceMouseDown(this._mouseDownDelegate);
                this._mouseDownDelegate = null;
            }
            if (this._mouseMoveDelegate) {
                this._viewer.remove_workspaceMouseMove(this._mouseMoveDelegate);
                this._mouseMoveDelegate = null;
            }
            if (this._zoomDelegate) {
                this._viewer.remove_zoomed(this._zoomDelegate);
                this._zoomDelegate = null;
            }
        }
    },

    update: function () {
        /// <summary>Updates the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" /> object.</summary>
        this._onZoom();
    },

    _onZoom: function () {
        var cv = $find(this.get_canvasID()),
        v = this._viewer;
        cv.set_zoom(v.get_zoom());
        cv._screenXDpi = v.get_screenXDpi();
        cv._screenYDpi = v.get_screenYDpi();
        cv.redraw();
    },

    _getRenderCtx: function () {
        return this._viewer.get_rubberbandCtx();
    },

    initialize: function () {
        /// <summary>Initializes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" /> object.</summary>
        Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.callBaseMethod(this, 'initialize');
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband" /> from the application.</summary>
        if (this._canvasSaveStateDelegate) {
            this._viewer.remove_invokingCallbackRequest(this._canvasSaveStateDelegate);
            this._canvasSaveStateDelegate = null;
        }
        if (this._bitmapViewerSaveStateDelegate) {
            var cv = $find(this.get_canvasID());
            if (cv) {
                cv.remove_invokingCallbackRequest(this._bitmapViewerSaveStateDelegate);
            }
            this._bitmapViewerSaveStatedelegate = null;
        }
        Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.callBaseMethod(this, 'dispose');
    }
}

Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband.registerClass("Aurigma.GraphicsMill.AjaxControls.VObjectsRubberband", Aurigma.GraphicsMill.UserInputController);