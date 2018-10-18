// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill.AjaxControls");

Aurigma.GraphicsMill.AjaxControls.CanvasViewer = function (element) {
    ///	<summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> server-side control and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class is intended to display multi-layered vector images. It allows zooming and scrolling the displayed image and supports undo and redo of actions.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />
    /// <constructor>
    /// 	<exclude />
    /// </constructor>
    Aurigma.GraphicsMill.AjaxControls.CanvasViewer.initializeBase(this, [element]);

    this._canvasId = null;
    this._canvasSaveStateDelegate = null;
    this._bitmapViewerSaveStateDelegate = null;
    this._mouseMoveDelegate = null;
    this._mouseUpDelegate = null;
    this._mouseDownDelegate = null;
    this._doubleClickDelegate = null;
    this._zoomDelegate = null;
    this._resizeDelegate = null;

    this._keyDownDelegate = null;
    this._keyUpDelegate = null;
    this._modalBgClass = null;

    this._clearSelectionOnDocumentClick = true;
    this._devicePixelRatio = 1;

    this._resizeCheckIntervalId = null;
};

Aurigma.GraphicsMill.AjaxControls.CanvasViewer.preventKeyHandleClass = "preventCanvasKeyHandle";
Aurigma.GraphicsMill.AjaxControls.CanvasViewer.preventClickHandleClass = "preventCanvasClickHandle";

Aurigma.GraphicsMill.AjaxControls.CanvasViewer.prototype = {
    get_canvasId: function () {
        /// <summary>Gets or sets a unique identifier of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</summary>
        /// <value type="String">The identifier assigned to the canvas associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</value>
        return this._canvasId;
    },

    set_canvasId: function (value) {
        this._canvasId = value;
    },

    get_canvas: function () {
        /// <summary>Gets the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</summary>
        /// <value type="Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas">The <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.Canvas">CanvasViewer.Canvas</see> server-side member.</para></remarks>
        if (this.get_canvasId()) {
            var cv = $find(this.get_canvasId());
            if (cv) {
                this.get_canvas = function () { return cv; };
                return this.get_canvas();
            } else
                return null;
        } else
            return null;
    },

    get_contentWidth: function () {
        /// <summary>Gets a value that represents the width (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> content taking into account the screen horizontal resolution and zoom value.</summary>
        /// <value type="Number">The value which represents the width (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> content.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.ContentWidth">CanvasViewer.ContentWidth</see> server-side member.</para></remarks>
        return Math.round(this.get_workspaceWidth() * this.get_zoom() * this.get_actualSizeHorizontalScale());
    },

    get_contentHeight: function () {
        /// <summary>Gets a value that represents the height (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> content taking into account the screen vertical resolution and zoom value.</summary>
        /// <value type="Number">The value which represents the height (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> content.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.ContentHeight">CanvasViewer.ContentHeight</see> server-side member.</para></remarks>
        return Math.round(this.get_workspaceHeight() * this.get_zoom() * this.get_actualSizeVerticalScale());
    },

    get_workspaceWidth: function () {
        /// <summary>Gets a value that represents the width (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</summary>
        /// <value type="Number">The value which represents the width (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.WorkspaceWidth">CanvasViewer.WorkspaceWidth</see> server-side member.</para></remarks>
        return this.get_canvas().get_workspaceWidth();
    },

    get_workspaceHeight: function () {
        /// <summary>Gets a value that represents the height (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</summary>
        /// <value type="Number">The value which represents the height (in pixels) of the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.VectorObjects.Canvas" /> associated with this <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.WorkspaceHeight">CanvasViewer.WorkspaceHeight</see> server-side member.</para></remarks>
        return this.get_canvas().get_workspaceHeight();
    },

    get_actualSizeHorizontalScale: function () {
        /// <summary>Gets value which represents the ratio of screen horizontal resolution to the canvas resolution.</summary>
        /// <value type="Number">The ratio of screen horizontal resolution to the canvas resolution.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.ActualSizeHorizontalScale">CanvasViewer.ActualSizeHorizontalScale</see> server-side member.</para></remarks>
        return this.get_canvas().get_screenXDpi() / this.get_canvas().get_devicePixelRatio() / 72;
    },

    get_actualSizeVerticalScale: function () {
        /// <summary>Gets value which represents the ratio of screen vertical resolution to the canvas resolution.</summary>
        /// <value type="Number">The ratio of screen vertical resolution to the canvas resolution.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.ActualSizeVerticalScale">CanvasViewer.ActualSizeVerticalScale</see> server-side member.</para></remarks>
        return this.get_canvas().get_screenYDpi() / this.get_canvas().get_devicePixelRatio() / 72;
    },

    get_modalBgClass: function () {
        /// <summary>Gets modal background class name.</summary>
        /// <value type="String">Class name</value>
        return this._modalBgClass;
    },

    set_modalBgClass: function (value) {
        this._modalBgClass = value;
    },

    get_clearSelectionOnDocumentClick: function () {
        return this._clearSelectionOnDocumentClick;
    },

    set_clearSelectionOnDocumentClick: function (value) {
        this._clearSelectionOnDocumentClick = value;
    },

    _renderContent: function (sb) {
        /// <protected />

        var wsize = "width:" + this.get_contentWidth() + "px;height:" + this.get_contentHeight() + "px;";
        var pos = "position:absolute;left:0px;top:0px;z-index:1";

        sb.append("\u003cdiv id=\"cvImage\" style=\"");
        sb.append(wsize);
        sb.append(pos + "\"/\u003e");
    },

    set_zoomMode: function (value) {
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, 'set_zoomMode', [value]);

        var cv = this.get_canvas();
        cv.set_zoom(this.get_zoom());
        cv.redraw();
    },

    set_zoom: function (value, params) {
        if (typeof value != "number" || value < this.get_minZoom())
            value = this.get_minZoom();

        var cv = this.get_canvas();
        value = cv._calculateZoom(value);

        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, 'set_zoom', [value, params]);

        cv.set_zoom(value);
        cv.redraw();
    },

    _onDocumentClick: function (e) {
        if (this._ignoreDocumentClickOnce === true) {
            this._ignoreDocumentClickOnce = false;

            return;
        }

        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onDocumentClick', [e]);

        if (this.get_clearSelectionOnDocumentClick() && !this._ignoreSelectionClick(e)) {
            var cv = this.get_canvas();
            if (cv) {
                cv.clearSelectedVObjects();
                cv.redraw();
            }
        }
    },

    _ignoreSelectionClick: function (e) {
        
        var Utils = Aurigma.GraphicsMill.Utils;
        var CanvasViewer = Aurigma.GraphicsMill.AjaxControls.CanvasViewer;
        
        var clickInsideViewer = this._jquery.contains(this.get_element(), e.target);
        if (clickInsideViewer)
            return true;

        return Utils.isEventPathContainsClass(e, CanvasViewer.preventClickHandleClass);
    },

    _onMouseDown: function (e) {
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onMouseDown', [e]);
        if (e.target == this.get_element()) {
            var cv = this.get_canvas();
            if (cv) {
                // remove insertion
                cv.clearSelectedVObjects();
                cv.redraw();
            }
        }
    },

    _onMouseMove: function (e) {
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onMouseMove', [e]);

        e.preventDefault();
    },

    _onTouch: function (e) {
        //tochstart
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onTouch', [e]);

        this._touchFlags.isScroll = true;
        this._touchFlags.isScrollChecked = false;
        this._touchFlags.gestureCenter = null;
        this._touchFlags.lastPinchEvent = null;
        this._touchFlags.initialCurrentLeft = this._jHolderElement.scrollLeft();
        this._touchFlags.initialCurrentTop = this._jHolderElement.scrollTop();
    },

    _onPinch: function (e) {
        if (this._touchFlags.mouseDown.onTimeout !== null) {
            clearTimeout(this._touchFlags.mouseDown.timeout);

            this._touchFlags.mouseDown.onTimeout = null;
        }

        var tf = this._touchFlags;

        if (tf.gestureCenter == null)
            tf.gestureCenter = e.gesture.center;

        tf.lastPinchEvent = e;

        if (tf.isScroll) {
            var xDiff = tf.initialCurrentLeft + (tf.gestureCenter.pageX - e.gesture.center.pageX);
            var yDiff = tf.initialCurrentTop + (tf.gestureCenter.pageY - e.gesture.center.pageY);

            this.set_scrollingPosition({ x: xDiff, y: yDiff });
        }
        else
            if (!Aurigma.GraphicsMill.Utils.Platform.IsIos() || Aurigma.GraphicsMill.Utils.Platform.IosMajorVersion() > 5)
                Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onPinch', [e]);

        if (!tf.isScrollChecked && this.get_pinchZoomEnabled())
            if (e.gesture.deltaTime > 350) {
                tf.isScrollChecked = true;

                var angle = this._calcAngle(e.gesture.touches[0], e.gesture.touches[1], tf.gestureCenter);

                if (this._isPinchByAngle(angle, e.gesture.scale) && this._isPinchByModule(e.gesture.touches[0], e.gesture.touches[1], tf.gestureCenter)) {
                    tf.isScroll = false;

                    Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onPinch', [e]);
                }
                //else scroll
            }
    },

    _onRelease: function (e) {
        var tf = this._touchFlags;

        if (this.get_pinchZoomEnabled() && !tf.isScrollChecked && tf.lastPinchEvent != null) {
            var angle = this._calcAngle(tf.lastPinchEvent.gesture.touches[0], tf.lastPinchEvent.gesture.touches[1], tf.gestureCenter);

            if (this._isPinchByAngle(angle, tf.lastPinchEvent.gesture.scale)) {
                Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onPinch', [tf.lastPinchEvent]);
            }
            //else scroll
        }

        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onRelease', [e]);
    },

    _isPinchByAngle: function (angle, scale) {
        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchIE())
            return angle >= 160 || scale <= 0.85 || scale >= 1.3;
        else
            return angle >= 160 && (scale <= 0.85 || scale >= 1.3);
    },

    _isPinchByModule: function (touch1, touch2, center) {
        var vT1 = [touch1.pageX - center.pageX, touch1.pageY - center.pageY],
            vT2 = [touch2.pageX - center.pageX, touch2.pageY - center.pageY];

        
        var mV1 = Math.sqrt(Math.pow(vT1[0], 2) + Math.pow(vT1[1], 2)),
            mV2 = Math.sqrt(Math.pow(vT2[0], 2) + Math.pow(vT2[1], 2));
                
        var vSum = [vT1[0] + vT2[0], vT1[1] + vT2[1]];
        var mVSum = Math.sqrt(Math.pow(vSum[0], 2) + Math.pow(vSum[1], 2));

        return mVSum < mV1 && mVSum < mV2;
    },

    
    _calcAngle: function (touch1, touch2, center) {
        var vT1 = [touch1.pageX - center.pageX, touch1.pageY - center.pageY],
            vT2 = [touch2.pageX - center.pageX, touch2.pageY - center.pageY];

        var cos = parseFloat(vT1[0] * vT2[0] + vT1[1] * vT2[1]) / (Math.sqrt(Math.pow(vT1[0], 2) + Math.pow(vT1[1], 2)) * Math.sqrt(Math.pow(vT2[0], 2) + Math.pow(vT2[1], 2)));

        var angleInDegrees = 180 * Math.acos(cos) / Math.PI;

        return angleInDegrees;
    },

    initialize: function () {
        /// <summary>Initializes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> object.</summary>
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, 'initialize');

        this._jHolderElement.css("-ms-touch-action", "none");
        this._jHolderElement.css("touch-action", "none");

        var el = this._contentElements;
        el.push(this._imageCtx = this._jquery(this.get_element()).find("#cvImage")[0]);

        var cv = this.get_canvas();
        cv._viewer = this;
        cv._addPlaceholderButtonStyles();

        var canvasParent = this._contentCtx.firstChild;

        if (!this._canvasSaveStateDelegate) {
            this._canvasSaveStateDelegate = Function.createDelegate(cv, cv._saveState);
        }
        this.add_invokingCallbackRequest(this._canvasSaveStateDelegate);

        if (!this._bitmapViewerSaveStateDelegate) {
            this._bitmapViewerSaveStateDelegate = Function.createDelegate(this, this._saveState);
        }
        cv.add_invokingCallbackRequest(this._bitmapViewerSaveStateDelegate);

        if (!this._onCanvasStatusChangedDelegate) {
            this._onCanvasStatusChangedDelegate = Function.createDelegate(this, this._onCanvasStatusChanged);
            cv.add_statusChanged(this._onCanvasStatusChangedDelegate);
        }

        var onReadyDelegate;
        var onReady = function () {
            if ((cv.get_status() == Aurigma.GraphicsMill.UpdateStatus.ready) && (cv.get_isInitialized())) {
                cv.remove_statusChanged(onReadyDelegate);
                cv.remove_initialized(onReadyDelegate);
                onReadyDelegate = null;
                cv.set_zoom(this.get_zoom(), true);
                cv._addElement(canvasParent);
                cv.redraw(true);
            }
        };

        if ((cv.get_status() == Aurigma.GraphicsMill.UpdateStatus.ready) && (cv.get_isInitialized())) {
            cv.set_zoom(this.get_zoom(), true);
            cv._addElement(canvasParent);
            cv.redraw(true);
        }
        else {
            onReadyDelegate = Function.createDelegate(this, onReady);
            cv.add_statusChanged(onReadyDelegate);
            cv.add_initialized(onReadyDelegate);
        }

        var skipKey = function (e) {            
            var Utils = Aurigma.GraphicsMill.Utils;
            var CanvasViewer = Aurigma.GraphicsMill.AjaxControls.CanvasViewer;
            
            if (Utils.isEventPathContainsClass(e, CanvasViewer.preventKeyHandleClass))
                return true;

            return (e.keyCode < 37 || e.keyCode > 40) && e.keyCode !== Sys.UI.Key.del;
        };

        this._keyUpDelegate = Function.createDelegate(this, function (e) {
            if (skipKey(e))
                return;

            cv.raiseKeyUp(e);
            e.preventDefault();
        });

        this._keyDownDelegate = Function.createDelegate(this, function (e) {
            if (skipKey(e))
                return;

            cv.raiseKeyDown(e);
            e.preventDefault();
        });

        $addHandler(document, "keyup", this._keyUpDelegate);
        $addHandler(document, "keydown", this._keyDownDelegate);

        this._touchFlags.mouseDown = { onTimeout: null };

        this._mouseDownDelegate = Function.createDelegate(this, function (source, event) {
            if ((this.get_navigator() == '') && (this.get_rubberband() == '')) {
                this.get_element().focus();

                //prevent vobject select by pinch
                if (event.type == "touchstart" || event.type == "MSPointerDown" || event.type == "pointerDown") {
                    var onTimeout = function () { cv.raiseMouseDown(event); };

                    this._touchFlags.mouseDown.onTimeout = onTimeout;
                    this._touchFlags.mouseDown.timeout = setTimeout(onTimeout, 250);
                }
                else
                    cv.raiseMouseDown(event);
            }
            return true;
        });

        this.add_workspaceMouseDown(this._mouseDownDelegate);

        this._doubleClickDelegate = Function.createDelegate(this, function (source, event) {
            if ((this.get_navigator() == '') && (this.get_rubberband() == '')) {
                this.get_element().focus();
                cv.raiseDoubleClick(event);
            }
            return true;
        });

        this.add_workspaceDoubleClick(this._doubleClickDelegate);

        this._mouseMoveDelegate = Function.createDelegate(this, function (source, event) {
            if (this._touchFlags.mouseDown.onTimeout !== null) {
                clearTimeout(this._touchFlags.mouseDown.timeout);

                this._touchFlags.mouseDown.onTimeout();

                this._touchFlags.mouseDown.onTimeout = null;
            }

            if ((this.get_navigator() == '') && (this.get_rubberband() == ''))
                cv.raiseMouseMove(event);

            return true;
        });
        this.add_workspaceMouseMove(this._mouseMoveDelegate);

        this._mouseUpDelegate = Function.createDelegate(this, function (source, event) {
            if (this._touchFlags.mouseDown.onTimeout !== null) {
                clearTimeout(this._touchFlags.mouseDown.timeout);

                this._touchFlags.mouseDown.onTimeout();

                this._touchFlags.mouseDown.onTimeout = null;
            }

            if ((this.get_navigator() == '') && (this.get_rubberband() == ''))
                cv.raiseMouseUp(event);

            return true;
        });
        this.add_workspaceMouseUp(this._mouseUpDelegate);

        this._resizeDelegate = Function.createDelegate(this, this._onResize);
        cv.add_workspaceSizeChanged(this._resizeDelegate);

        this._resizeCheckIntervalId = setInterval(function () {
            if (this._devicePixelRatio !== cv.get_devicePixelRatio()) {
                this._devicePixelRatio = cv.get_devicePixelRatio();
                this._onResize();
            }
        }.bind(this), 500);
    },

    _onResize: function () {
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, '_onResize');

        var canvas = this.get_canvas();
        canvas.set_zoom(this.get_zoom());
        canvas._updateCanvasElementSize();
        canvas.redraw(true);
    },

    _onCanvasStatusChanged: function (sender) {
        if (this.get_canvas().get_status() == Aurigma.GraphicsMill.AjaxControls.VectorObjects.UpdateStatus.busy)
            this.lockViewer();
        else
            this.unlockViewer();
    },

    //show <div> over control which block control while canvas state is busy
    lockViewer: function () {
        /// <summary>Shows a semi-transparent rectangle over the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</summary>
        /// <remarks><para>To hide this rectangle use the <see cref="M:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.unlockViewer" /> method.</para></remarks>
        this._isViewerLocked = true;

        var el = this.get_element();

        var mb = $get(this.get_id() + "_modalBg");
        if (!mb) {
            mb = document.createElement("div");

            var style = mb.style;
            style.position = "absolute";
            style.top = "0";
            style.left = "0";

            if (this._modalBgClass)
                mb.className = this._modalBgClass;
            else {
                style.backgroundPosition = "50% 50%";
                style.backgroundColor = "#000000";
                style.opacity = "0.4";
                style.filter = "alpha(opacity=40)";
                style.zIndex = "1000";
            }
            mb.id = this.get_id() + "_modalBg";
            if (el.offsetParent)
                el.offsetParent.appendChild(mb);

            style.width = "100%";
            style.height = "100%";
            style.bottom = "0";
            style.right = "0";
        }

        mb.style.display = "block";
    },

    //hide <div> when canvas state changed to ready
    unlockViewer: function () {
        /// <summary>Hides the semi-transparent rectangle when it is shown over the <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" />.</summary>
        /// <remarks><para>To show this rectangle use the <see cref="M:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer.lockViewer" /> method.</para></remarks>
        this._isViewerLocked = false;

        var mb = $get(this.get_id() + "_modalBg");

        if (mb)
            mb.style.display = "none";
    },

    dispose: function () {
        /// <summary>Removes the current <see cref="T:J:Aurigma.GraphicsMill.AjaxControls.CanvasViewer" /> from the application.</summary>

        if (this._resizeCheckIntervalId != null)
            clearInterval(this._resizeCheckIntervalId);

        var cv = this.get_canvas();
        if (cv) {
            if (this._mouseUpDelegate) {
                this.remove_workspaceMouseUp(this._mouseUpDelegate);
                this._mouseUpDelegate = null;
            }
            if (this._mouseDownDelegate) {
                this.remove_workspaceMouseDown(this._mouseDownDelegate);
                this._mouseDownDelegate = null;
            }
            if (this._mouseMoveDelegate) {
                this.remove_workspaceMouseMove(this._mouseMoveDelegate);
                this._mouseMoveDelegate = null;
            }
            if (this._doubleClickDelegate) {
                this.remove_workspaceDoubleClick(this._doubleClickDelegate);
                this._doubleClickDelegate = null;
            }
            if (this._zoomDelegate) {
                this.remove_zoomed(this._zoomDelegate);
                this._zoomDelegate = null;
            }
            if (this._onCanvasStatusChangedDelegate) {
                cv.remove_statusChanged(this._onCanvasStatusChangedDelegate);
                delete this._onCanvasStatusChangedDelegate;
            }
            if (this._resizeDelegate) {
                cv.remove_workspaceSizeChanged(this._resizeDelegate);
                delete this._resizeDelegate;
            }
        }
        Aurigma.GraphicsMill.AjaxControls.CanvasViewer.callBaseMethod(this, 'dispose');
    },

    _refresh: function () {
        /// <summary>Refresh the control immediately.</summary>
        /// <protected />

        // Clear delayed refresh.
        if (this._refreshTimer) {
            window.clearTimeout(this._refreshTimer);
        }
        // Clear flag.
        this._needToRefresh = false;
    }
}

Aurigma.GraphicsMill.AjaxControls.CanvasViewer.registerClass("Aurigma.GraphicsMill.AjaxControls.CanvasViewer", Aurigma.GraphicsMill.BaseViewer);