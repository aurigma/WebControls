// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill");

Aurigma.GraphicsMill.ResizeMode = function () {
    /// <summary>Specifies possible resize modes for the rectangle rubberband (class <see cref="T:J:Aurigma.GraphicsMill.RectangleRubberband" /> and its descendants).</summary>
    /// <field name="none" type="Number" integer="true" static="true"><summary>User cannot resize the rectangle. However you can still update <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.rectangle" /> property.</summary></field>
    /// <field name="proportional" type="Number" integer="true" static="true"><summary>User can resize the rectangle only with fixed aspect ratio.</summary></field>
    /// <field name="arbitrary" type="Number" integer="true" static="true"><summary>User can resize the rectangle without keeping the aspect ratio.</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.ResizeMode.prototype = {
    none: 0,
    proportional: 1,
    arbitrary: 2
};
Aurigma.GraphicsMill.ResizeMode.registerEnum("Aurigma.GraphicsMill.ResizeMode");

Aurigma.GraphicsMill.UserInputController = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.UserInputController" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>All the client-side classes intended to manage user input (such as mouse events) of the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control are inherited from this class.</para><para><see cref="T:Aurigma.GraphicsMill.AjaxControls.UserInputController" /> class is an abstract one, you cannot instantiate it directly.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.UserInputController" />
    Aurigma.GraphicsMill.UserInputController.initializeBase(this, [element]);
    this._viewer = null;
}
Aurigma.GraphicsMill.UserInputController.prototype = {
    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    connect: function (id) {
        /// <param name="id" type="String">The <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> to connect to.</param>
        /// <summary>Connects this user input controller (navigator or rubberband) to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        this._viewer = $find(id);
    },

    disconnect: function () {
        /// <summary>Disconnects this user input controller (navigator or rubberband) from the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        if (this._viewer) {
            this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.defaultCursor);
            this._viewer = null;
        }
    },

    dispose: function () {
        /// <summary>Disposes control.</summary>
        Aurigma.GraphicsMill.UserInputController.callBaseMethod(this, "dispose");
        this.disconnect();
    }
};
//Just rmeove next line. IDisposable is already implemented in base class
Aurigma.GraphicsMill.UserInputController.registerClass("Aurigma.GraphicsMill.UserInputController", Sys.UI.Control, Sys.IDisposable);

// The base class for the ZoomIn and ZoomOut controllers.
Aurigma.GraphicsMill.ZoomNavigator = function (element) {
    /// <summary>Base class for all navigators which allows to zoom some content in or out.</summary>
    Aurigma.GraphicsMill.ZoomNavigator.initializeBase(this, [element]);
}
Aurigma.GraphicsMill.ZoomNavigator.prototype = {
    _onWorkspaceClick: function (s, e) {
        var c = this._viewer.workspaceToControlPoint(new Aurigma.GraphicsMill.PointF(e.x, e.y));
        c = this._viewer.controlToContentPoint(c);
        var w = this._viewer.get_width();
        var h = this._viewer.get_height();
        this._viewer.set_zoom(this._viewer.get_zoom() * this._zoomK, { skipZoomToCenter: true });
        c.x = Math.round(c.x * this._zoomK - w / 2);
        c.y = Math.round(c.y * this._zoomK - h / 2);
        this._viewer.set_scrollingPosition(c);
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    connect: function (id) {
        /// <param name="id" type="String">The <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> to connect to.</param>
        /// <summary>Connects this zoom navigator to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        Aurigma.GraphicsMill.ZoomNavigator.callBaseMethod(this, "connect", [id]);

        this._viewer.set_cursor(this._cursor);

        //Attach event handlers
        this._workspaceClickDelegate = Function.createDelegate(this, this._onWorkspaceClick)
        this._viewer.add_workspaceClick(this._workspaceClickDelegate);
    },

    disconnect: function () {
        /// <summary>Disconnects this zoom navigator controller from the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        if (this._viewer) {
            //Detach event handlers
            if (this._workspaceClickDelegate) {
                this._viewer.remove_workspaceClick(this._workspaceClickDelegate);
                this._workspaceClickDelegate = null;
            }
        }
        Aurigma.GraphicsMill.ZoomNavigator.callBaseMethod(this, "disconnect");
    }
};
Aurigma.GraphicsMill.ZoomNavigator.registerClass("Aurigma.GraphicsMill.ZoomNavigator", Aurigma.GraphicsMill.UserInputController);

Aurigma.GraphicsMill.ZoomInNavigator = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.ZoomInNavigator" /> server-side control.</summary>
    /// <remarks><para>This class represents a navigator which is used to zoom the content displayed in the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control in by the mouse click.</para>
    /// <para>When this navigator is attached to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" />, it is working in the following way: when the left button of the mouse is clicked, it zooms the content in. You can attach this navigator from client-side code using the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator">BaseViewer.navigator</see> property.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.ZoomInNavigator" />
    Aurigma.GraphicsMill.ZoomInNavigator.initializeBase(this, [element]);

    this._zoomK = 1.5;
    this._cursor = Aurigma.GraphicsMill.Cursor.zoomIn;
};
Aurigma.GraphicsMill.ZoomInNavigator.registerClass("Aurigma.GraphicsMill.ZoomInNavigator", Aurigma.GraphicsMill.ZoomNavigator);

Aurigma.GraphicsMill.ZoomOutNavigator = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.ZoomOutNavigator" /> server-side control.</summary>
    /// <remarks><para>This class represents a navigator which is used to zoom the content displayed in the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control out by the mouse click.</para>
    /// <para>When this navigator is attached to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" />, it is working in the following way: when the left button of the mouse is clicked, it zooms the content out. You can attach this navigator from client-side code using the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator">BaseViewer.navigator</see> property.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.ZoomOutNavigator" />
    Aurigma.GraphicsMill.ZoomOutNavigator.initializeBase(this, [element]);

    this._zoomK = 0.667;
    this._cursor = Aurigma.GraphicsMill.Cursor.zoomOut;
};
Aurigma.GraphicsMill.ZoomOutNavigator.registerClass("Aurigma.GraphicsMill.ZoomOutNavigator", Aurigma.GraphicsMill.ZoomNavigator);

Aurigma.GraphicsMill.PanNavigator = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.PanNavigator" /> server-side control.</summary>
    /// <remarks><para>This class represents a navigator which is used to pan the content inside the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</para>
    /// <para>When this navigator is attached to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" />, it is working in the following way:</para><list type="number"><item><description>When the left button of the mouse is pressed down, it captures the control.</description></item><item><description>When control is captured and the mouse is moved, the content is panned together with mouse pointer. The callback from the server occurred only if user stops moving at least for one second.</description></item><item><description>When the left button of the mouse is released, the mouse control is dismissed.</description></item></list>
    /// <para>You can attach this navigator from client-side code using the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator">BaseViewer.navigator</see> property.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.PanNavigator" />
    Aurigma.GraphicsMill.PanNavigator.initializeBase(this, [element]);

    this._panned = false;
}

Aurigma.GraphicsMill.PanNavigator.prototype = {
    _onMouseDown: function (s, e) {
        this._prevPoint = this._viewer.workspaceToControlPoint(new Aurigma.GraphicsMill.PointF(e.x, e.y));
        if (this._panned == true) {
            var ctx = this._viewer.get_contentCtx();
            if (ctx.releaseCapture)
                ctx.releaseCapture();
        }
        if (this._panned == false) {
            this._panned = true;

            this._startScroll = this._viewer.get_scrollingPosition();
            this._startPoint = { x: e.clientX, y: e.clientY };

            if (!this._mouseMoveDelegate) {
                this._mouseMoveDelegate = Function.createDelegate(this, this._onMouseMove)
            }
            this._viewer.add_workspaceMouseMove(this._mouseMoveDelegate);
            // don't change cursor in webkit browsers. it changes the cursor position also.
            if (navigator.userAgent.toLowerCase().indexOf('webkit') == -1)
                this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.move);
            // if for Safary.
            var ctx;
            if ((ctx = this._viewer.get_contentCtx()) && ctx.setCapture) {
                ctx.setCapture();
            }
        }

        if (e.preventDefault) {
            e.preventDefault();
        }
    },

    _onMouseMove: function (s, e) {
        if (this._panned) {
            //Change the scroll position

            var sp = {};
            sp.x = this._startScroll.x + (this._startPoint.x - e.clientX);
            sp.y = this._startScroll.y + (this._startPoint.y - e.clientY);

            this._viewer.set_scrollingPosition(sp);
        }
        if (e.preventDefault)
            e.preventDefault();

        if (e.stopPropagation)
            e.stopPropagation();
    },

    _onMouseUp: function (s, e) {
        this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.pan);
        if (this._panned) {
            this._panned = false;

            this._viewer.remove_workspaceMouseMove(this._mouseMoveDelegate);

            var ctx;
            if ((ctx = this._viewer.get_contentCtx()) && ctx.releaseCapture) {
                ctx.releaseCapture();
            }
        }
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    connect: function (id) {
        /// <param name="id" type="String">The <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> to connect to.</param>
        /// <summary>Connects this pan navigator to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        Aurigma.GraphicsMill.PanNavigator.callBaseMethod(this, "connect", [id]);

        this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.pan);

        this._mouseDownDelegate = Function.createDelegate(this, this._onMouseDown)
        this._viewer.add_workspaceMouseDown(this._mouseDownDelegate);
        this._mouseUpDelegate = Function.createDelegate(this, this._onMouseUp)
        this._viewer.add_workspaceMouseUp(this._mouseUpDelegate);
    },

    disconnect: function () {
        /// <summary>Disconnects this pan navigator controller from the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        if (this._viewer) {
            //Detach event handlers
            if (this._mouseDownDelegate) {
                this._viewer.remove_workspaceMouseDown(this._mouseDownDelegate);
                this._mouseDownDelegate = null;
            }
            if (this._mouseMoveDelegate) {
                this._viewer.remove_workspaceMouseMove(this._mouseMoveDelegate);
                this._mouseMoveDelegate = null;
            }
            if (this._mouseUpDelegate) {
                this._viewer.remove_workspaceMouseUp(this._mouseUpDelegate);
                this._mouseUpDelegate = null;
            }
        }

        Aurigma.GraphicsMill.PanNavigator.callBaseMethod(this, "disconnect");
    }
};
Aurigma.GraphicsMill.PanNavigator.registerClass("Aurigma.GraphicsMill.PanNavigator", Aurigma.GraphicsMill.UserInputController);

// The base class for the RectangleRubberband and ZoomRectangleNavigator
Aurigma.GraphicsMill.RectangleController = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.RectangleController" /> server-side class and gives an opportunity to obtain access to its primary members in JavaScript. This is a base class for all the navigators and rubberbands which should display a rectangle.</summary>
    /// <remarks><para>This class implements the functionality for displaying a rectangle rubberband. You can change the rectangle appearance using <see cref="P:J:Aurigma.GraphicsMill.RectangleController.outlineColor" />, <see cref="P:J:Aurigma.GraphicsMill.RectangleController.outlineWidth" />, and <see cref="P:J:Aurigma.GraphicsMill.RectangleController.outlineStyle" /> client-side properties.</para>
    /// <para>This class allows to specify whether to display a mask which shadows the image out of the rectangle. The mask can be customized by <see cref="P:J:Aurigma.GraphicsMill.RectangleController.maskColor" /> and <see cref="P:J:Aurigma.GraphicsMill.RectangleController.maskOpacity" /> client-side properties.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.RectangleController" />
    Aurigma.GraphicsMill.RectangleController.initializeBase(this, [element]);

    this._gripBorderWidth = 1;

    //Begin of the fields populated during $create call
    this._outlineWidth = 1;
    this._stateFieldId = "";
    this._maskColorRed = 0;
    this._maskColorGreen = 0;
    this._maskColorBlue = 0;
    this._maskOpacity = 50;
    //End of the fields populated during $create call

    this._cursors = {
        TL: Aurigma.GraphicsMill.Cursor.sizeNW,
        TR: Aurigma.GraphicsMill.Cursor.sizeNE,
        BL: Aurigma.GraphicsMill.Cursor.sizeSW,
        BR: Aurigma.GraphicsMill.Cursor.sizeSE,
        T: Aurigma.GraphicsMill.Cursor.sizeN,
        B: Aurigma.GraphicsMill.Cursor.sizeS,
        L: Aurigma.GraphicsMill.Cursor.sizeW,
        R: Aurigma.GraphicsMill.Cursor.sizeE,
        inside: Aurigma.GraphicsMill.Cursor.move
    };

    //The control which is currently being dragged.
    this._draggedControl = null;
    this._prevOffset = null;

    //Whether to handle the user input
    this._handleInput = true;

    this._totalMaskingTimer = null;
};

Aurigma.GraphicsMill.RectangleController.prototype = {
    //--------------------------------------------------------------------------
    //Private
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    _erase: function () {
        this.set_p_rectangle(new Aurigma.GraphicsMill.Rectangle(0, 0, -1, -1));
    },

    _createRect: function (width, height, color) {
        /// <summary>Create a rectangle</summary>
        /// <param name="width" type="Number" ineteger="true" />
        /// <param name="height" type="Number" ineteger="true" />
        /// <param name="color" type="String" />
        /// <returns domElement="true" />
        var d = document.createElement("div");
        var s = d.style;
        if (color != null) {
            s.backgroundColor = color;
        }
        s.position = "absolute";
        
        s.zIndex = 1000;
        s.width = width + "px";
        s.height = height + "px";
        d.ondrag = function () {
            return false;
        };
        d.unselectable = "on";
        return d;
    },

    _createGrip: function (visible) {
        /// <summary>Create a grip</summary>
        /// <param name="visible" type="String" />
        /// <returns domElement="true" />
        var size = this.get_p_gripSize();

        var grip = this._createRect(size, size, "rgb(42, 240, 58)");
        this._viewer._jquery(grip).css(
            {
                "display": visible ? "block" : "none",
                "opacity": "0.5",
                "border": this._gripBorderWidth + "px #EEE solid"
            });

        return grip;
    },

    _createMask: function () {
        var mask = this._createRect(1, 1, null);
        this._viewer._jquery(mask).css(
            {
                "top": "0px",
                "left": "0px",
                "border-color": String.format("rgba({0},{1},{2},{3})", this._maskColorRed, this._maskColorGreen, this._maskColorBlue, parseFloat(this._maskOpacity) / 100.0),
                "border-style": "solid",
                "-webkit-transform": "translate3d(0,0,0)",
                "-moz-transform": "translate3d(0,0,0)",
                //"transform": "translate3d(0,0,0)",
                "visibility": "hidden"
            });

        return mask;
    },

    _createIE68Mask: function () {
        /// <summary>Create a mask element</summary>
        /// <returns domElement="true" />
        var maskElement = document.createElement("div");

        var style = maskElement.style;
        style.fontSize = "0px";
        style.position = "absolute";
        style.backgroundColor = String.format("rgb({0},{1},{2})", this._maskColorRed, this._maskColorGreen, this._maskColorBlue);
        style.filter = "alpha(opacity=" + this._maskOpacity.toString() + ")";
        style.opacity = (this._maskOpacity / 100).toString();

        maskElement.ondrag = function () {
            return false;
        };

        maskElement.unselectable = "on";
        return maskElement;
    },

    _delayedMasking: function (onMask) {
        if (this._totalMaskingTimer)
            clearTimeout(this._totalMaskingTimer);

        this._totalMaskingTimer = setTimeout(onMask, 150);
    },

    _hideMask: function () {
        if ((Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 9 || Sys.Browser.documentMode < 9))
            || Aurigma.GraphicsMill.Utils.Platform.IsNativeAndroidBrowser())
            this._topMask.style.display = this._bottomMask.style.display = this._leftMask.style.display = this._rightMask.style.display = "none";
        else
            this._viewer._jquery(this._mask).css("visibility", "hidden");
    },

    _update: function (full) {
        /// <param name="full" type="Boolean">Specifies whether to make update the layout completely (including the mask).</param>
        if (!this._viewer)
            return;

        var rectangle = this.get_p_rectangle();
        var resizeMode = this.get_p_resizeMode();

        var newRect = new Aurigma.GraphicsMill.Rectangle(0, 0, this._viewer.get_workspaceWidth(), this._viewer.get_workspaceHeight()).intersect(rectangle);
        if (this.get_p_resizeMode() == Aurigma.GraphicsMill.ResizeMode.proportional) {
            if (newRect.width * this.get_p_ratio() > newRect.height)
                newRect.width = newRect.height / this.get_p_ratio();

            if (newRect.height / this.get_p_ratio() > newRect.width)
                newRect.height = this.get_p_ratio() * newRect.width;
        }
        this.set_p_rectangle(newRect.round());
        rectangle = this.get_p_rectangle();

        var gripsVisible = this.get_p_gripsVisible();
        var isRectangleReal = rectangle.width >= 0 && rectangle.height >= 0;
        var rectangleDisplay = isRectangleReal ? "block" : "none";
        this._rect.style.display = rectangleDisplay;
        if (full && !this._draggedControl) {
            var gripsDisplay = isRectangleReal && gripsVisible && (resizeMode != Aurigma.GraphicsMill.ResizeMode.none) ? "block" : "none";
            this._topLeftGrip.style.display = this._topRightGrip.style.display = this._bottomLeftGrip.style.display = this._bottomRightGrip.style.display = gripsDisplay;
            this._leftGrip.style.display = this._rightGrip.style.display = this._topGrip.style.display = this._bottomGrip.style.display = gripsDisplay;

            if (isRectangleReal && !this.get_p_maskVisible())
                this._hideMask();
        }
        if (!isRectangleReal)
            return;

        var topLeftCorner = this._viewer.workspaceToContentPoint(new Sys.UI.Point(rectangle.x, rectangle.y));

        var bottomRightCorner = this._viewer.workspaceToContentPoint(new Sys.UI.Point(rectangle.x + rectangle.width, rectangle.y + rectangle.height));

        var maximumCorner = this._viewer.workspaceToContentPoint(new Sys.UI.Point(this._viewer.get_workspaceWidth(), this._viewer.get_workspaceHeight()));

        var outlineWidth = this.get_outlineWidth();
        var rectangleStyle = this._rect.style;

        var rectangleWidth = Math.max(bottomRightCorner.x - topLeftCorner.x, 0);
        var rectangleHeight = Math.max(bottomRightCorner.y - topLeftCorner.y, 0);

        rectangleStyle.width = rectangleWidth + "px";
        rectangleStyle.height = rectangleHeight + "px";

        rectangleStyle.display = "block";
        rectangleStyle.left = topLeftCorner.x + "px";
        rectangleStyle.top = topLeftCorner.y + "px";

        if (gripsVisible && (!Aurigma.GraphicsMill.Utils.Platform.IsAndroid() || (Aurigma.GraphicsMill.Utils.Platform.IsAndroid() && full))) {
            var gripsSize = this.get_p_gripSize() + this._gripBorderWidth * 2,
                halfGripsSize = Math.round(gripsSize / 2);
            var gripLedge = Math.max(Math.floor((gripsSize - outlineWidth) / 2), 0);

            var topLeftGripX = topLeftCorner.x - gripLedge;

            var topLeftGripY = topLeftCorner.y - gripLedge;

            var bottomRightGripX = bottomRightCorner.x - gripsSize + gripLedge;

            var bottomRightGripY = bottomRightCorner.y - gripsSize + gripLedge;

            var rectCenter = new Sys.UI.Point(Math.round((topLeftCorner.x + bottomRightCorner.x) / 2), Math.round((topLeftCorner.y + bottomRightCorner.y) / 2));

            this._jLeftGrips.css("left", topLeftGripX + "px");

            this._jTopGrips.css("top", topLeftGripY + "px");

            this._jRightGrips.css("left", bottomRightGripX + "px");

            this._jBottomGrips.css("top", bottomRightGripY + "px");

            this._jHorizCenterGrips.css("top", (rectCenter.y - halfGripsSize) + "px");
            this._jVertCenterGrips.css("left", (rectCenter.x - halfGripsSize) + "px");
        }

        //Update the grips and mask if the complete update is requested.
        if (full) {
            if (this.get_p_maskVisible()) {
                //mask whole content

                if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 9 || Sys.Browser.documentMode < 9)
                    || Aurigma.GraphicsMill.Utils.Platform.IsNativeAndroidBrowser()) {
                    var topMaskStyle = this._topMask.style,
                        bottomMaskStyle = this._bottomMask.style,
                        leftMaskStyle = this._leftMask.style,
                        rightMaskStyle = this._rightMask.style;

                    //Update the size
                    topMaskStyle.left = bottomMaskStyle.left = leftMaskStyle.left = topMaskStyle.top = "0px";
                    topMaskStyle.width = bottomMaskStyle.width = maximumCorner.x + "px";
                    topMaskStyle.height = topLeftCorner.y + "px";

                    bottomMaskStyle.top = bottomRightCorner.y + "px";
                    bottomMaskStyle.height = (maximumCorner.y - bottomRightCorner.y) + "px";

                    leftMaskStyle.top = rightMaskStyle.top = topLeftCorner.y + "px";
                    leftMaskStyle.width = topLeftCorner.x + "px";
                    leftMaskStyle.height = rightMaskStyle.height = (bottomRightCorner.y - topLeftCorner.y) + "px";

                    rightMaskStyle.left = bottomRightCorner.x + "px";
                    rightMaskStyle.width = (maximumCorner.x - bottomRightCorner.x) + "px";

                    //Hide mask elements if the width or height < 1
                    topMaskStyle.display = topLeftCorner.y > 0 ? "block" : "none";
                    bottomMaskStyle.display = maximumCorner.y > bottomRightCorner.y ? "block" : "none";
                    leftMaskStyle.display = topLeftCorner.x > 0 ? "block" : "none";
                    rightMaskStyle.display = maximumCorner.x > bottomRightCorner.x ? "block" : "none";
                }
                else
                    this._viewer._jquery(this._mask).css(
                        {
                            "left": 0 + "px",
                            "top": 0 + "px",
                            "width": rectangleWidth,
                            "height": rectangleHeight,
                            "border-left-width": topLeftCorner.x + "px",
                            "border-top-width": topLeftCorner.y + "px",
                            "border-right-width": this._viewer._contentCtxDimension.width - (topLeftCorner.x + rectangleWidth) + "px",
                            "border-bottom-width": this._viewer._contentCtxDimension.height - (topLeftCorner.y + rectangleHeight) + "px",
                            "visibility": "visible"
                        });
            }
        }
    },

    _changeCursor: function (control) {
        /// <summary>Change the cursor</summary>
        /// <param name="control" type="String">The control area the cursor is changing for.</param>
        var c = this._cursors[control];
        if (c == undefined) {
            c = Aurigma.GraphicsMill.Cursor.defaultCursor;
        }
        this._viewer.set_cursor(c);
    },

    _hitTest: function (workspaceOffset, gripSize) {
        /// <summary>Check whether the user has clicked on the control area.</summary>
        // /// <param name="offset" type="Sys.UI.Point">The point at the scrollable area</param>
        /// <param name="offset" type="Aurigma.GraphicsMill.PointF">Workspace point.</param>
        /// <returns type="String">The name of the control area which has been hit (TL = top left, TR = top right, etc).</returns>

        var contentOffset = this._viewer.workspaceToContentPoint(workspaceOffset);

        var resizeMode = this.get_p_resizeMode();
        var rectangleOfRB = this.get_p_rectangle();

        if (isNaN(gripSize))
            gripSize = this.get_p_gripSize();

        var halfGripSize = gripSize / 2;

        var toplLeftCorner = this._viewer.workspaceToContentPoint(new Sys.UI.Point(rectangleOfRB.x, rectangleOfRB.y));

        var bottomRightCorner = this._viewer.workspaceToContentPoint(new Sys.UI.Point(rectangleOfRB.x + rectangleOfRB.width, rectangleOfRB.y + rectangleOfRB.height));

        var e1 = contentOffset.x >= toplLeftCorner.x,
            e2 = contentOffset.x <= bottomRightCorner.x,
            e3 = contentOffset.y >= toplLeftCorner.y,
            e4 = contentOffset.y <= bottomRightCorner.y;

        if (resizeMode != Aurigma.GraphicsMill.ResizeMode.none) {
            var c1 = contentOffset.x >= toplLeftCorner.x - halfGripSize,
                c2 = contentOffset.x <= toplLeftCorner.x + halfGripSize,
                c3 = contentOffset.y >= toplLeftCorner.y - halfGripSize,
                c4 = contentOffset.y <= toplLeftCorner.y + halfGripSize;

            if (c1 && c2 && c3 && c4)
                return "TL";

            var c5 = contentOffset.x >= bottomRightCorner.x - halfGripSize,
                c6 = contentOffset.x <= bottomRightCorner.x + halfGripSize;

            if (c5 && c6 && c3 && c4)
                return "TR";

            var c7 = contentOffset.y >= bottomRightCorner.y - halfGripSize,
                c8 = contentOffset.y <= bottomRightCorner.y + halfGripSize;

            if (c1 && c2 && c7 && c8)
                return "BL";

            if (c5 && c6 && c7 && c8)
                return "BR";

            if (resizeMode == Aurigma.GraphicsMill.ResizeMode.arbitrary) {
                if (this.get_p_gripsVisible()) {
                    var cc = new Sys.UI.Point(Math.round((toplLeftCorner.x + bottomRightCorner.x) / 2), Math.round((toplLeftCorner.y + bottomRightCorner.y) / 2));
                    var d1 = contentOffset.x >= cc.x - halfGripSize,
                        d2 = contentOffset.x <= cc.x + halfGripSize;

                    if (d1 && d2 && c3 && c4)
                        return "T";

                    if (d1 && d2 && c7 && c8)
                        return "B";

                    var d3 = contentOffset.y >= cc.y - halfGripSize,
                        d4 = contentOffset.y <= cc.y + halfGripSize;

                    if (c1 && c2 && d3 && d4)
                        return "L";

                    if (c5 && c6 && d3 && d4)
                        return "R";
                }
                else {
                    if (e1 && e2 && c3 && c4)
                        return "T";

                    if (e1 && e2 && c7 && c8)
                        return "B";

                    if (c1 && c2 && e3 && e4)
                        return "L";

                    if (c5 && c6 && e3 && e4)
                        return "R";
                }
            }
        }
        if (this.get_p_movable() && e1 && e2 && e3 && e4)
            return "inside";

        return null;
    },

    _onWorkspaceMouseDown: function (s, e) {
        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchIE()) {
            this._panningData.initialEvent = e;
            this._panningData.initialCurrentLeft = this._viewer._jHolderElement.scrollLeft();
            this._panningData.initialCurrentTop = this._viewer._jHolderElement.scrollTop();
        }

        if (!this._handleInput)
            return;

        this._startOffset = this._viewer.workspaceToContentPoint(new Aurigma.GraphicsMill.PointF(e.x, e.y));
        if (this._draggedControl)
            if (this._viewer.get_contentCtx().releaseCapture)
                this._viewer.get_contentCtx().releaseCapture();

        var isTouchPointer = false;

        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchIE())
            isTouchPointer = !(e.originalEvent.pointerType == e.originalEvent.MSPOINTER_TYPE_MOUSE);
        else
            if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice())
                isTouchPointer = true;

        if (isTouchPointer)
            this._draggedControl = this._hitTest(new Aurigma.GraphicsMill.PointF(e.x, e.y), this.get_p_touchHideGripSize());
        else
            this._draggedControl = this._hitTest(new Aurigma.GraphicsMill.PointF(e.x, e.y));

        if (this.get_p_erasable() && !this._draggedControl) {
            this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.cross);
            this._draggedControl = "BR";

            this._startRectangle = new Aurigma.GraphicsMill.Rectangle(Math.round(e.x), Math.round(e.y), 0, 0);
            this._update(false);

            return;
        }
        else {
            this._changeCursor(this._draggedControl);
            var rectangleOfRB = this.get_p_rectangle();
            switch (this._draggedControl) {
                case "TL":
                    rectangleOfRB.y = rectangleOfRB.y + rectangleOfRB.height;
                    rectangleOfRB.height = -rectangleOfRB.height;
                    rectangleOfRB.x = rectangleOfRB.x + rectangleOfRB.width;
                    rectangleOfRB.width = -rectangleOfRB.width;
                    break;

                case "T":
                case "TR":
                    rectangleOfRB.y = rectangleOfRB.y + rectangleOfRB.height;
                    rectangleOfRB.height = -rectangleOfRB.height;
                    break;

                case "L":
                case "BL":
                    rectangleOfRB.x = rectangleOfRB.x + rectangleOfRB.width;
                    rectangleOfRB.width = -rectangleOfRB.width;
                    break;
            }

            this._startRectangle = rectangleOfRB;

            if (this._draggedControl && e.preventDefault)
                e.preventDefault();
        }
    },

    _onWorkspaceMouseMove: function (s, e) {
        if (!this._handleInput)
            return;

        var offsetWorkspace = new Aurigma.GraphicsMill.PointF(e.x, e.y);
        var offsetContent = this._viewer.workspaceToContentPoint(offsetWorkspace);
        if (this._draggedControl) {
            //hide the mask and the grips
            if (this.get_p_maskVisible())
                this._hideMask();

            if (this.get_p_gripsVisible() && Aurigma.GraphicsMill.Utils.Platform.IsAndroid())
                this._topLeftGrip.style.display = this._topRightGrip.style.display = this._bottomLeftGrip.style.display = this._bottomRightGrip.style.display = this._leftGrip.style.display = this._rightGrip.style.display = this._topGrip.style.display = this._bottomGrip.style.display = "none";

            var startRectangle = this._startRectangle.clone();
            var workspaceWidth = this._viewer.get_workspaceWidth();
            var workspaceHeight = this._viewer.get_workspaceHeight();
            if (this._draggedControl == "inside") {
                var controlDiff = this._viewer.contentToControlPoint(new Sys.UI.Point(offsetContent.x - this._startOffset.x, offsetContent.y - this._startOffset.y));
                var workspaceDiff = this._viewer.controlToWorkspacePoint(controlDiff);
                startRectangle.x = Math.min(Math.max(startRectangle.x += workspaceDiff.x, 0), workspaceWidth - startRectangle.width);
                startRectangle.y = Math.min(Math.max(startRectangle.y += workspaceDiff.y, 0), workspaceHeight - startRectangle.height);
            }
            else {
                function sign(v) {
                    if (v > 0)
                        return 1;
                    else
                        return -1;
                }

                var dx = offsetWorkspace.x - startRectangle.x,
                    dy = offsetWorkspace.y - startRectangle.y;

                var ratio = this.get_p_ratio();
                var isProportionalResize = (this.get_p_resizeMode() == Aurigma.GraphicsMill.ResizeMode.proportional);
                var proportionalDy = isProportionalResize ? Math.abs(Math.round(dx * ratio)) * sign(dy) : dy;

                switch (this._draggedControl) {
                    case "TL": case "TR": case "BL": case "BR":
                        startRectangle.width = dx;
                        startRectangle.height = proportionalDy;
                        break;

                    case "T": case "B":
                        startRectangle.height = proportionalDy;
                        break;

                    case "L": case "R":
                        startRectangle.width = dx;
                }

                //Fit to the bounds
                var c1 = startRectangle.x + startRectangle.width > workspaceWidth;
                var c2 = startRectangle.x + startRectangle.width < 0;

                if (c1)
                    startRectangle.width = workspaceWidth - startRectangle.x;

                if (c2)
                    startRectangle.width = -startRectangle.x;

                if ((c1 || c2) && isProportionalResize)
                    startRectangle.height = Math.abs(Math.round(startRectangle.width * ratio)) * sign(startRectangle.height);

                c1 = startRectangle.y + startRectangle.height > workspaceHeight;
                c2 = startRectangle.y + startRectangle.height < 0;

                if (c1)
                    startRectangle.height = workspaceHeight - startRectangle.y;

                if (c2)
                    startRectangle.height = -startRectangle.y;

                if ((c1 || c2) && isProportionalResize)
                    startRectangle.width = Math.abs(Math.round(startRectangle.height / ratio)) * sign(startRectangle.width);

                if (startRectangle.width < 0) {
                    startRectangle.x += startRectangle.width;
                    startRectangle.width = -startRectangle.width;
                }

                if (startRectangle.height < 0) {
                    startRectangle.y += startRectangle.height;
                    startRectangle.height = -startRectangle.height;
                }
            }

            this.set_p_rectangle(startRectangle.round());

            var h = this.get_events().getHandler("rectangleChanging");
            if (h) {
                h(this, Sys.EventArgs.Empty);
            }

            this._update(false);

            if (e.preventDefault)
                e.preventDefault();
        }
        else {
            var control = this._hitTest(offsetWorkspace);

            this._changeCursor(control);

            if (control === null && Aurigma.GraphicsMill.Utils.Platform.IsTouchIE() && this._panningData.initialEvent) {
                var xDiff = this._panningData.initialCurrentLeft + (this._panningData.initialEvent.pageX - e.pageX);
                var yDiff = this._panningData.initialCurrentTop + (this._panningData.initialEvent.pageY - e.pageY);

                this._viewer.set_scrollingPosition({ x: xDiff, y: yDiff });
            }
        }
        this._prevOffset = offsetWorkspace;
    },

    _onZoomed: function () {
        this._update(true);
    },

    _onWorkspaceChanged: function () {
        var sr = this.get_p_rectangle();
        if (sr.width >= 0 && sr.height >= 0) {
            var cw = this._viewer.get_workspaceWidth();
            var ch = this._viewer.get_workspaceHeight();
            if (sr.x >= cw || sr.y >= ch) {
                this._erase();
            }
            else {
                sr.width = Math.min(cw - sr.x, sr.width);
                sr.height = Math.min(ch - sr.y, sr.height);
                this.set_p_rectangle(sr.round());
            }
        }
        else {
            this._erase();
        }
        this._update(true);
    },

    _saveState: function () {
        var s = new Object();
        this._serializeState(s);
        var state = Sys.Serialization.JavaScriptSerializer.serialize(s);
        $get(this._stateFieldId).value = state;
    },

    //--------------------------------------------------------------------------
    //Protected
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    _serializeState: function (state) {
        /// <protected />
        state.OutlineWidth = this._outlineWidth;
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Properties
    //--------------------------------------------------------------------------

    get_maskColor: function () {
        /// <value type="String">The value which represents the color of the mask in form rgb(0,0,0)</value>
        /// <summary>Gets/sets the color of the mask.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.MaskColor">RectangleRubberband.MaskColor</see> server-side member.</para></remarks>
        return String.format("rgb({0},{1},{2})", this._maskColorRed, this._maskColorGreen, this._maskColorBlue);
    },

    set_maskColor: function (rgbString) {
        var rgbArray = rgbString.split('(')[1].split(',');
        var red = parseInt(rgbArray[0]),
            green = parseInt(rgbArray[1]),
            blue = parseInt(rgbArray[2]);

        if (isNaN(red) || isNaN(green) || isNaN(blue)) {
            if (window.console)
                console.error(rgbString + " is incorrect value");

            return;
        }

        this._maskColorRed = red;
        this._maskColorGreen = green;
        this._maskColorBlue = blue;

        if (this._viewer) {
            if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 9 || Sys.Browser.documentMode < 9)) {
                this._topMask.style.backgroundColor = this._leftMask.style.backgroundColor =
                    this._bottomMask.style.backgroundColor = this._rightMask.style.backgroundColor = String.format("rgb({0},{1},{2})", this._maskColorRed, this._maskColorGreen, this._maskColorBlue);
            }
            else
                this._viewer._jquery(this._mask).css("border-color", String.format("rgba({0},{1},{2},{3})", this._maskColorRed, this._maskColorGreen, this._maskColorBlue, parseFloat(this._maskOpacity) / 100.0));
        }
    },

    get_maskOpacity: function () {
        /// <value type="Number" integer="true">The value which represents the opacity of the mask. Should lie between 0 and 100 inclusive.</value>
        /// <summary>Gets/sets the opacity of the mask.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.MaskOpacity">RectangleRubberband.MaskOpacity</see> server-side member.</para></remarks>
        return this._maskOpacity;
    },

    set_maskOpacity: function (v) {
        if (this._maskOpacity != v) {
            this._maskOpacity = v;
            if (this._viewer) {
                if (Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 9 || Sys.Browser.documentMode < 9)) {
                    var masks = new Array(this._topMask, this._bottomMask, this._leftMask, this._rightMask);
                    for (var i = 0; i < 4; i++) {
                        var st = masks[i].style;
                        st.filter = "alpha(opacity=" + this._maskOpacity.toString() + ")";
                        st.MozOpacity = (this._maskOpacity / 100).toString();
                        st.opacity = (this._maskOpacity / 100).toString();
                    }
                }
                else {
                    this._viewer._jquery(this._mask).css("border-color", String.format("rgba({0},{1},{2},{3})", this._maskColorRed, this._maskColorGreen, this._maskColorBlue, parseFloat(v) / 100.0));
                }
            }
        }
    },

    get_outlineWidth: function () {
        /// <value type="Number" integer="true">The rectangle outline width.</value>
        /// <summary>Gets/sets the rectangle outline width.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleController.OutlineWidth">RectangleController.OutlineWidth</see> server-side member.</para></remarks>
        return this._outlineWidth;
    },
    set_outlineWidth: function (v) {
        if (this._outlineWidth != v) {
            this._outlineWidth = v;
            if (this._viewer) {
                this._rect.style.borderWidth = v + "px";
                this._update(true);
            }
        }
    },

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    connect: function (id) {
        /// <param name="id" type="String">The <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> to connect to.</param>
        /// <summary>Connects this rectangle controller to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        Aurigma.GraphicsMill.RectangleController.callBaseMethod(this, "connect", [id]);

        var renderCtx = this._getRenderCtx();

        //Create a mask
        if ((Sys.Browser.agent === Sys.Browser.InternetExplorer && (Sys.Browser.version < 9 || Sys.Browser.documentMode < 9))
            || Aurigma.GraphicsMill.Utils.Platform.IsNativeAndroidBrowser()) //android browser have bad support of semitransparent border
        {
            renderCtx.appendChild(this._topMask = this._createIE68Mask());
            renderCtx.appendChild(this._bottomMask = this._createIE68Mask());
            renderCtx.appendChild(this._leftMask = this._createIE68Mask());
            renderCtx.appendChild(this._rightMask = this._createIE68Mask());
        }
        else
            renderCtx.appendChild(this._mask = this._createMask());

        //Create a rectangle
        this._rect = this._createRect(1, 1, null);
        this._rect.style.WebkitTransform = "translate3d(0,0,0)";
        this._rect.style.MozTransform = "translate3d(0,0,0)";
        //this._rect.style.transform = "translate3d(0,0,0)";
        renderCtx.appendChild(this._rect);

        //create outline
        var rectBorderStyle =
            {
                "position": "absolute",
                "opacity": "0.4",
                "font-size": "0",
                "background-color": "white",
                "-webkit-transform": "translate3d(0,0,0)",
                "-moz-transform": "translate3d(0,0,0)"
                //"transform": "translate3d(0,0,0)"
            };
        var rectHBorderStyle =
            {
                "height": /*"1px"*/this.get_outlineWidth() + "px",
                "width": "100%",
                "background-image": "url(data:image/gif;base64,R0lGODlhCAABAPcAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yH5BAEAAP8ALAAAAAAIAAEAAAgJAP8J/BegYICAADs=)"
            };
        var rectVBorderStyle =
            {
                "height": "100%",
                "width": /*"1px"*/this.get_outlineWidth() + "px",
                "background-image": "url(data:image/gif;base64,R0lGODlhAQAIAPcAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yH5BAEAAP8ALAAAAAABAAgAAAgJAP8J/BegYICAADs=)"
            };
        var rectRightBorderStyle = { "right": 0 },
            bottomBorderStyle = { "bottom": 0 },
            topBorderStyle = { "top": 0 },
            leftBorderStyle = { "left": 0 };

        var jRect = this._viewer._jquery(this._rect);

        this._viewer._jquery('<div id="top"/>').css(rectBorderStyle).css(rectHBorderStyle).css(topBorderStyle).appendTo(jRect);
        this._viewer._jquery('<div id="bottom"/>').css(rectBorderStyle).css(rectHBorderStyle).css(bottomBorderStyle).appendTo(jRect);
        this._viewer._jquery('<div id="left"/>').css(rectBorderStyle).css(rectVBorderStyle).css(leftBorderStyle).appendTo(jRect);
        this._viewer._jquery('<div id="right"/>').css(rectBorderStyle).css(rectVBorderStyle).css(rectRightBorderStyle).appendTo(jRect);

        var resizeMode = this.get_p_resizeMode();

        //Create corner grips.
        var cornerGripsVisible = (resizeMode != Aurigma.GraphicsMill.ResizeMode.none && this.get_p_gripsVisible());
        renderCtx.appendChild(this._topLeftGrip = this._createGrip(cornerGripsVisible));
        renderCtx.appendChild(this._topRightGrip = this._createGrip(cornerGripsVisible));
        renderCtx.appendChild(this._bottomLeftGrip = this._createGrip(cornerGripsVisible));
        renderCtx.appendChild(this._bottomRightGrip = this._createGrip(cornerGripsVisible));

        //Create size grips
        var sizeGripsVisible = (resizeMode == Aurigma.GraphicsMill.ResizeMode.arbitrary && this.get_p_gripsVisible());
        renderCtx.appendChild(this._leftGrip = this._createGrip(sizeGripsVisible));
        renderCtx.appendChild(this._rightGrip = this._createGrip(sizeGripsVisible));
        renderCtx.appendChild(this._topGrip = this._createGrip(sizeGripsVisible));
        renderCtx.appendChild(this._bottomGrip = this._createGrip(sizeGripsVisible));

        this._jLeftGrips = this._viewer._jquery([this._topLeftGrip, this._bottomLeftGrip, this._leftGrip]);
        this._jTopGrips = this._viewer._jquery([this._topLeftGrip, this._topRightGrip, this._topGrip]);
        this._jRightGrips = this._viewer._jquery([this._bottomRightGrip, this._topRightGrip, this._rightGrip]);
        this._jBottomGrips = this._viewer._jquery([this._bottomRightGrip, this._bottomLeftGrip, this._bottomGrip]);
        this._jVertCenterGrips = this._viewer._jquery([this._bottomGrip, this._topGrip]);
        this._jHorizCenterGrips = this._viewer._jquery([this._rightGrip, this._leftGrip]);

        //Update the layout
        this._update(true);

        //Attach event handlers
        this._workspaceChangedDelegate = Function.createDelegate(this, this._onWorkspaceChanged);
        this._viewer.add_workspaceChanged(this._workspaceChangedDelegate);

        this._workspaceMouseDownDelegate = Function.createDelegate(this, this._onWorkspaceMouseDown);
        this._viewer.add_workspaceMouseDown(this._workspaceMouseDownDelegate);

        this._workspaceMouseMoveDelegate = Function.createDelegate(this, this._onWorkspaceMouseMove);
        this._viewer.add_workspaceMouseMove(this._workspaceMouseMoveDelegate);

        this._workspaceMouseUpDelegate = Function.createDelegate(this, this._onWorkspaceMouseUp);
        this._viewer.add_workspaceMouseUp(this._workspaceMouseUpDelegate);

        this._zoomedDelegate = Function.createDelegate(this, this._onZoomed);
        this._viewer.add_zoomed(this._zoomedDelegate);
    },

    disconnect: function () {
        /// <summary>Disconnects this rectangle controller from the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        if (this._viewer) {
            this._viewer.clearRenderCtx(this._getRenderCtx());

            this._topMask = this._bottomMask = this._leftMask = this._rightMask = null;

            this._rect = null;

            this._topLeftGrip = this._topRightGrip = this._bottomLeftGrip = this._bottomRightGrip = this._leftGrip = this._rightGrip = this._topGrip = this._bottomGrip = null;
            this._jLeftGrips = this._jTopGrips = this._jRightGrips = this._jBottomGrips = this._jVertCenterGrips = this._jHorizCenterGrips = null;

            //Detach event handlers
            this._viewer.remove_workspaceChanged(this._workspaceChangedDelegate);
            this._viewer.remove_workspaceMouseDown(this._workspaceMouseDownDelegate);
            this._viewer.remove_workspaceMouseMove(this._workspaceMouseMoveDelegate);
            this._viewer.remove_workspaceMouseUp(this._workspaceMouseUpDelegate);
            this._viewer.remove_zoomed(this._zoomedDelegate);
        }

        Aurigma.GraphicsMill.RectangleController.callBaseMethod(this, "disconnect");
    }
};
Aurigma.GraphicsMill.RectangleController.registerClass("Aurigma.GraphicsMill.RectangleController", Aurigma.GraphicsMill.UserInputController);

Aurigma.GraphicsMill.RectangleRubberband = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband" /> server-side control and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>This class represents the rectangular rubberband and can be used to draw a rectangle on the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control surface.
    /// Depending on this control properties you can resize (see <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> property) or move (see <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.movable" /> property) this rectangle by the mouse.
    /// This way this rubberband is extremely useful to make a rectangular selection on the bitmap.</para>
    /// <para>To get or set the rectangle (selection) programmatically, you can use property <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.rectangle" />. It will return the rectangle displayed at the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control in coordinates of the content associated with it.</para>
    /// <para>The rectangle can be resized either arbitrary, or only increase or decrease the width and height equally (i.e. preserving the rectangle proportion). It is specified by the <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> property. The required aspect ratio is specified with the <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.ratio" /> property.</para>
    /// <para>You can specify whether to display a mask which shadows the image out of the rectangle. It is convenient when you use this rubberband together with the <see cref="T:Aurigma.GraphicsMill.Transforms.Crop" /> transform. Use <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.maskVisible" /> property for it.</para>
    /// <para>You can attach this control to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> using its property <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.rubberband">BaseViewer.rubberband</see> form the client-side code.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband" />
    Aurigma.GraphicsMill.RectangleRubberband.initializeBase(this, [element]);

    //Begin of the fields populated during $create call
    this._autoPostBack = false;
    this._erasable = true;
    this._gripSize = 9;
    this._touchHideGripSize = 33;
    this._gripsVisible = false;
    this._maskVisible = false;
    this._movable = true;
    this._ratio = 1;
    this._rectangle = new Aurigma.GraphicsMill.Rectangle(0, 0, -1, -1);
    this._resizeMode = Aurigma.GraphicsMill.ResizeMode.arbitrary;
    //Postback functions and fields
    this._rectangleChangedPostBack = null;
    this._rectangleChanged = false;
    //End of the fields populated during $create call

    this._panningData =
        {
            initialEvent: null
        };
};

Aurigma.GraphicsMill.RectangleRubberband.prototype = {
    //--------------------------------------------------------------------------
    //Internal
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Properties
    //--------------------------------------------------------------------------

    get_p_autoPostBack: function () {
        /// <value type="Boolean" />
        /// <exclude />
        return this._autoPostBack;
    },
    set_p_autoPostBack: function (value) {
        this._autoPostBack = value;
    },

    get_p_erasable: function () {
        /// <value type="Boolean" />
        /// <exclude />
        return this._erasable;
    },
    set_p_erasable: function (v) {
        this._erasable = v;
    },

    get_p_gripSize: function () {
        /// <value type="Number" integer="true" />
        /// <exclude />
        return this._gripSize;
    },
    set_p_gripSize: function (v) {
        this._gripSize = v;
    },

    get_p_touchHideGripSize: function () {
        /// <value type="Number" integer="true" />
        /// <exclude />
        return this._touchHideGripSize;
    },
    set_p_touchHideGripSize: function (value) {
        this._touchHideGripSize = value;
    },

    get_p_gripsVisible: function () {
        /// <value type="Boolean" />
        /// <exclude />
        return this._gripsVisible;
    },
    set_p_gripsVisible: function (v) {
        this._gripsVisible = v;
    },

    get_p_maskVisible: function () {
        /// <value type="Boolean" />
        /// <exclude />
        return this._maskVisible;
    },
    set_p_maskVisible: function (v) {
        this._maskVisible = v;
    },

    get_p_movable: function () {
        /// <value type="Boolean" />
        /// <exclude />
        return this._movable;
    },
    set_p_movable: function (v) {
        this._movable = v;
    },

    get_p_ratio: function () {
        /// <value type="Number" />
        /// <exclude />
        return this._ratio;
    },
    set_p_ratio: function (v) {
        this._ratio = v;
    },

    get_p_rectangle: function () {
        /// <value type="Aurigma.GraphicsMill.Rectangle" />
        /// <exclude />
        return this._rectangle.clone();
    },
    set_p_rectangle: function (v) {
        this._rectangle = v.clone();
    },

    get_p_resizeMode: function () {
        /// <value type="Aurigma.GraphicsMill.ResizeMode"/>
        /// <exclude />
        return this._resizeMode;
    },
    set_p_resizeMode: function (v) {
        this._resizeMode = v;
    },

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    //Override the mouse down event handler on the scrollable area
    _onWorkspaceMouseUp: function (s, e) {
        this._panningData.initialEvent = null;

        if (!this._handleInput)
            return;

        if (this._viewer.get_contentCtx().releaseCapture)
            this._viewer.get_contentCtx().releaseCapture();

        if (this._draggedControl) {
            this._draggedControl = null;

            var control = this._hitTest(new Aurigma.GraphicsMill.PointF(e.x, e.y));
            this._changeCursor(control);
            var h = this.get_events().getHandler("rectangleChanged");
            if (h)
                h(this, Sys.EventArgs.Empty);

            this._update(true);

            //Raise the server event
            if (this.get_p_autoPostBack()) {
                this._rectangleChangedPostBack();
            }
            else {
                this._rectangleChanged = true;
            }
        }
    },

    _getRenderCtx: function () {
        return this._viewer.get_rubberbandCtx();
    },

    //--------------------------------------------------------------------------
    //Protected
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    _serializeState: function (state) {
        /// <protected />
        Aurigma.GraphicsMill.RectangleRubberband.callBaseMethod(this, "_serializeState", [state]);

        state.AutoPostBack = this._autoPostBack;
        state.Erasable = this._erasable;
        state.GripSize = this._gripSize;
        state.GripsVisible = this._gripsVisible;
        state.MaskVisible = this._maskVisible;
        state.MaskOpacity = this._maskOpacity;
        state.MaskColor = this._maskColor;
        state.Movable = this._movable;
        state.Ratio = this._ratio;
        state.Rectangle = this._rectangle;
        state.ResizeMode = this._resizeMode;
        state.RectangleChanged = this._rectangleChanged;
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Properties
    //--------------------------------------------------------------------------

    get_autoPostBack: function () {
        /// <value type="Boolean">The value which is <b>true</b> when a postback to the server automatically occurs whenever the user  stops changing the rectangle; <b>false</b> otherwise.</value>
        /// <summary>Gets/sets a value indicating whether a postback to the server automatically occurs when the user stops modifying the rectangle.</summary>
        /// <remarks><para>Default value is <b>false</b>.</para>
        /// <para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.AutoPostBack">RectangleRubberband.AutoPostBack</see> server-side member.</para></remarks>
        return this.get_p_autoPostBack();
    },
    set_autoPostBack: function (v) {
        this.set_p_autoPostBack(v)
    },

    get_erasable: function () {
        /// <value type="Boolean">The value that specifies whether the rubberband is erased (discarded) when user clicks by a mouse out of this rectangle.</value>
        /// <summary>Gets/sets a value that specifies whether the rubberband can be erased (discarded) when user clicks by a mouse out of this rectangle.</summary>
        /// <remarks><para>Default value is <b>true</b>.</para>
        /// <para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.Erasable">RectangleRubberband.Erasable</see> server-side member.</para></remarks>
        return this.get_p_erasable();
    },
    set_erasable: function (v) {
        this.set_p_erasable(v);
    },

    get_gripSize: function () {
        /// <value type="Number" integer="true">The size of the grips.</value>
        /// <summary>Gets/sets the grip size.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.GripSize">RectangleRubberband.GripSize</see> server-side member.</para></remarks>
        return this.get_p_gripSize();
    },
    set_gripSize: function (v) {
        if (v != this.get_p_gripSize()) {
            this.set_p_gripSize(v);
            this._update(true);
        }
    },

    get_gripsVisible: function () {
        /// <value type="Boolean">The value which shows or hides the grips on the rectangle.</value>
        /// <summary>Gets/sets a value which shows or hides the grips on the rectangle.</summary>
        /// <remarks><para>When grips are shown, user can resize the rectangle by dragging them. When grips are hidden, user can resize the rectangle by dragging any point of the rectangle border.</para><para>Number of the grips depends on the rubberband <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" />:</para><list type="bullet"><item><description>When the arbitrary resize is enabled (<see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> = <see cref="F:J:Aurigma.GraphicsMill.ResizeMode.arbitrary" />), eight grips are displayed: four for each rectangle corner, and four for each rectangle edge (in the center at the edge). </description></item><item><description>When the resize with only fixed proportions is enabled (<see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> = <see cref="F:J:Aurigma.GraphicsMill.ResizeMode.proportional" />), there are four grips for each rectangle corner is available. </description></item><item><description>When the resize is disabled (<see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> = <see cref="F:J:Aurigma.GraphicsMill.ResizeMode.none" />), no grips are displayed regardless of the <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.gripsVisible" /> value.</description></item></list>
        /// <para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.GripsVisible">RectangleRubberband.GripsVisible</see> server-side member.</para></remarks>
        return this.get_p_gripsVisible();
    },
    set_gripsVisible: function (v) {
        if (v != this.get_p_gripsVisible()) {
            this.set_p_gripsVisible(v);
            this._update(true);
        }
    },

    get_maskVisible: function () {
        /// <value type="Boolean">The value which is <b>true</b> when mask should be displayed; otherwise, <b>false</b>.</value>
        /// <summary>Gets/sets a value which specifies whether to display a mask out of the rectangle.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.MaskVisible">RectangleRubberband.MaskVisible</see> server-side member.</para></remarks>
        return this.get_p_maskVisible();
    },
    set_maskVisible: function (v) {
        if (v != this.get_p_maskVisible()) {
            this.set_p_maskVisible(v);
            this._update(true);
        }
    },

    get_movable: function () {
        /// <value type="Boolean">The value which specifies whether the rubberband rectangle can be dragged on the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</value>
        /// <summary>Gets/sets a value which specifies whether the rubberband rectangle can be dragged on the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.Movable">RectangleRubberband.Movable</see> server-side member.</para></remarks>
        return this.get_p_movable();
    },
    set_movable: function (v) {
        this.set_p_movable(v);
    },

    get_ratio: function () {
        /// <value type="Number">The aspect ratio of the rubberband rectangle which should be preserved when <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> is <see cref="F:J:Aurigma.GraphicsMill.ResizeMode.proportional" />.</value>
        /// <summary>Gets/sets the aspect ratio of the rubberband rectangle which should be preserved when <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.resizeMode" /> is <see cref="F:J:Aurigma.GraphicsMill.ResizeMode.proportional" />.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.Ratio">RectangleRubberband.Ratio</see> server-side member.</para></remarks>
        return this.get_p_ratio();
    },
    set_ratio: function (v) {
        this.set_p_ratio(v);
    },

    get_rectangle: function () {
        /// <value type="Aurigma.GraphicsMill.Rectangle">The <see cref="T:J:Aurigma.GraphicsMill.Rectangle" /> object represented the rubberband rectangle.</value>
        /// <summary>Gets/sets the rubberband rectangle.</summary>
        /// <remarks><para>Rectangle values (left, top, width and height) are measured in the coordinates of the workspace associated with the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> where it is displayed. </para>
        /// <para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.Rectangle">RectangleRubberband.Rectangle</see> server-side member.</para></remarks>
        return this.get_p_rectangle();
    },

    set_rectangle: function (v) {
        if (!v.equals(this.get_p_rectangle)) {
            this.set_p_rectangle(v);
            this._update(true);
        }
    },

    get_resizeMode: function () {
        /// <value type="Aurigma.GraphicsMill.ResizeMode">The <see cref="T:J:Aurigma.GraphicsMill.ResizeMode" /> enumeration member that specifies an allowed resize mode for the rubberband rectangle.</value>
        /// <summary>Gets/sets the allowed resize mode for the rubberband rectangle.</summary>
        /// <remarks><para>When <see cref="F:J:Aurigma.GraphicsMill.ResizeMode.proportional" /> resize mode is used, you can specify the required aspect ratio of the rectangle using <see cref="P:J:Aurigma.GraphicsMill.RectangleRubberband.ratio" /> property. </para>
        /// <para>This property corresponds to <see cref="P:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.ResizeMode">RectangleRubberband.ResizeMode</see> server-side member.</para></remarks>
        return this.get_p_resizeMode();
    },
    set_resizeMode: function (v) {
        if (v != this.get_p_resizeMode()) {
            this.set_p_resizeMode(v);
            this._update(true);
        }
    },

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    connect: function (id) {
        /// <param name="id" type="String">The <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> to connect to.</param>
        /// <summary>Connects this rectangle rubberband to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        Aurigma.GraphicsMill.RectangleRubberband.callBaseMethod(this, "connect", [id]);
        this.update();
    },

    erase: function () {
        /// <summary>Erases (discards) the rubberband from the control.</summary>
        /// <remarks><para>This method corresponds to <see cref="M:Aurigma.GraphicsMill.AjaxControls.RectangleRubberband.Erase">RectangleRubberband.Erase</see> server-side member.</para></remarks>
        if (this.get_p_erasable()) {
            this._erase();
            this._update(true);
        }
    },

    update: function () {
        /// <summary>Updates the control.</summary>
        this._handleInput = (this._viewer.get_navigator() == "");
        this._update(true);
    },

    //--------------------------------------------------------------------------
    //Events
    //--------------------------------------------------------------------------

    add_rectangleChanged: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the rubberband rectangle is modified (mouse button is released).</summary>
        this.get_events().addHandler("rectangleChanged", h);
    },
    remove_rectangleChanged: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("rectangleChanged", h);
    },

    add_rectangleChanging: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the rubberband rectangle is modified (mouse button isn't released).</summary>
        this.get_events().addHandler("rectangleChanging", h);
    },
    remove_rectangleChanging: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("rectangleChanging", h);
    }
};
Aurigma.GraphicsMill.RectangleRubberband.registerClass("Aurigma.GraphicsMill.RectangleRubberband", Aurigma.GraphicsMill.RectangleController);

/// <summary>Zoom image to fit it in the selected rectangle area.</summary>
Aurigma.GraphicsMill.ZoomRectangleNavigator = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.GraphicsMill.AjaxControls.ZoomRectangleNavigator" /> server-side control.</summary>
    /// <remarks><para>This class represents a navigator which is used to zoom the content displayed in the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control by selecting necessary portion of the content by the mouse.</para>
    /// <para>When this navigator is attached to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" />, it is working in the following way:</para><list type="number"><item><description>When the left button of the mouse is pressed down, it captures the mouse control.</description></item><item><description>When control is captured and the mouse is moved, the selection rectangle is displayed and stretched.</description></item><item><description>When the left button of the mouse is released, the control zooms the content so that the selected portion occupies as much control client area as aspect ratio allows.</description></item></list>
    /// <para>You can attach this navigator from client-side code using the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator">BaseViewer.navigator</see> property.</para></remarks>
    /// <seealso cref="T:Aurigma.GraphicsMill.AjaxControls.ZoomRectangleNavigator" />
    Aurigma.GraphicsMill.ZoomRectangleNavigator.initializeBase(this, [element]);

    this._ratio = 1;
    this._rectangle = new Aurigma.GraphicsMill.Rectangle(0, 0, -1, -1);
}
Aurigma.GraphicsMill.ZoomRectangleNavigator.prototype = {
    //--------------------------------------------------------------------------
    //Internal
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Properties
    //--------------------------------------------------------------------------

    get_p_autoPostBack: function () {
        /// <exclude />
        return false;
    },

    get_p_erasable: function () {
        /// <exclude />
        return true;
    },

    get_p_gripSize: function () {
        /// <exclude />
        return 0;
    },

    get_p_gripsVisible: function () {
        /// <exclude />
        return false;
    },

    get_p_maskVisible: function () {
        /// <exclude />
        return false;
    },

    get_p_movable: function () {
        /// <exclude />
        return false;
    },

    get_p_ratio: function () {
        /// <exclude />
        return this._ratio;
    },
    get_p_rectangle: function () {
        /// <exclude />
        return this._rectangle.clone();
    },
    set_p_ratio: function (v) {
        this._ratio = v;
    },
    set_p_rectangle: function (v) {
        this._rectangle = v.clone();
    },

    get_p_resizeMode: function () {
        /// <exclude />
        return Aurigma.GraphicsMill.ResizeMode.proportional;
    },

    _getRenderCtx: function () {
        return this._viewer.get_navigatorCtx();
    },

    // Override the mouse down event handler on the scrollable area event handler.
    _onWorkspaceMouseUp: function (s, e) {
        if (this._draggedControl) {
            this._draggedControl = null;
            this._viewer.set_cursor(Aurigma.GraphicsMill.Cursor.defaultCursor);

            //Calculate a zoom and scrolling values
            var r = this.get_p_rectangle();
            this._erase();

            var w = this._viewer.get_width();
            var h = this._viewer.get_height();
            var newZ = w / r.width;
            this._viewer.set_zoom(newZ, { skipZoomToCenter: true });
            var z = this._viewer.get_zoom();

            // Put to center of viewer.
            var px = parseInt((w - r.width * z) / 2);
            if (Math.round(r.x * z) - px < 0) {
                px = 0;
            }
            else {
                px = Math.round(r.x * z) - px;
            }

            var py = parseInt((h - r.height * z) / 2);
            if (Math.round(r.y * z) - py < 0) {
                py = 0;
            }
            else {
                py = Math.round(r.y * z) - py;
            }

            this._viewer.set_scrollingPosition(new Sys.UI.Point(px, py));
            if (this._viewer.get_contentCtx().releaseCapture)
                this._viewer.get_contentCtx().releaseCapture();
        }
    },

    //--------------------------------------------------------------------------
    //Protected
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    /// <protected />
    _saveState: function () {
        var state = Sys.Serialization.JavaScriptSerializer.serialize({
            "OutlineWidth": this._outlineWidth
        });
        $get(this._stateFieldId).value = state;
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    connect: function (id) {
        /// <param name="id" type="String">The <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> to connect to.</param>
        /// <summary>Connects this zoom rectangle navigator to the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
        Aurigma.GraphicsMill.ZoomRectangleNavigator.callBaseMethod(this, "connect", [id]);

        //Calculate a ratio of the rectangle
        //var r = this._viewer.controlToWorkspaceRectangle(new Aurigma.GraphicsMill.Rectangle(0, 0, this._viewer.get_width(), this._viewer.get_height()));
        var r = this._viewer.workspaceToControlRectangle(new Aurigma.GraphicsMill.Rectangle(0, 0, this._viewer.get_width(), this._viewer.get_height()));

        this._ratio = r.height / r.width;
    }
};
Aurigma.GraphicsMill.ZoomRectangleNavigator.registerClass("Aurigma.GraphicsMill.ZoomRectangleNavigator", Aurigma.GraphicsMill.RectangleController);

if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();