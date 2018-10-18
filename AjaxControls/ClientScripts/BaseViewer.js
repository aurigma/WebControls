// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
Type.registerNamespace("Aurigma.GraphicsMill");

Aurigma.GraphicsMill.UpdateStatus = function () {
    /// <summary>Specifies a current bitmap status.</summary>
    /// <field name="ready" type="Number" integer="true" static="true"><summary>The remote scripting method has been completed (or was not run yet), and you can freely get return value or exception details.</summary></field>
    /// <field name="refresh" type="Number" integer="true" static="true"><summary>The control updates a portion of image it displays (e.g. when user zoomed or scrolled it). The bitmap state is not changed while status is "refresh". </summary></field>
    /// <field name="busy" type="Number" integer="true" static="true"><summary>The remote scripting method is running (the bitmap state is changing). </summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.UpdateStatus.prototype = {
    ready: 0,
    refresh: 1,
    busy: 2
};
Aurigma.GraphicsMill.UpdateStatus.registerEnum("Aurigma.GraphicsMill.UpdateStatus");

Aurigma.GraphicsMill.ScrollBarsStyle = function () {
    /// <summary>Specifies values which specify when to display scroll bars at the control.</summary>
    /// <field name="always" type="Number" integer="true" static="true"><summary>Scroll bars are always displayed regardless of the control content dimensions. If control content is too small, scroll bars are disabled.</summary></field>
    /// <field name="auto" type="Number" integer="true" static="true"><summary>Scroll bars are displayed when control content is too large to fit the control client area. When content is too small, scroll bars are hidden.</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.ScrollBarsStyle.prototype = {
    always: 0,
    auto: 1
};
Aurigma.GraphicsMill.ScrollBarsStyle.registerEnum("Aurigma.GraphicsMill.ScrollBarsStyle");

Aurigma.GraphicsMill.ZoomQuality = function () {
    /// <summary>Specifies zoom quality of the displayed image.</summary>
    /// <remarks>Zoom with higher quality requires more resources on the server-side than lower quality zoom.</remarks>
    /// <field name="low" type="Number" integer="true" static="true"><summary>Low quality.</summary></field>
    /// <field name="medium" type="Number" integer="true" static="true"><summary>Medium quality.</summary></field>
    /// <field name="high" type="Number" integer="true" static="true"><summary>High quality.</summary></field>
    /// <field name="shrinkHighStretchLow" type="Number" integer="true" static="true"><summary>This mode enables server-side high quality resize in the case when zoom value is lower than 1.0, otherwise the image is resized on the client.</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.ZoomQuality.prototype =
{
    low: 0,
    medium: 1,
    high: 2,
    shrinkHighStretchLow: 3
};
Aurigma.GraphicsMill.ZoomQuality.registerEnum("Aurigma.GraphicsMill.ZoomQuality");

Aurigma.GraphicsMill.ZoomMode = function () {
    /// <summary>Specifies zoom modes of the displayed image.</summary>
    /// <field name="none" type="Number" integer="true" static="true"><summary>Zoom modifier is specified only manually. Use <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoom" /> property. Also, you can use some zooming navigator controls.</summary></field>
    /// <field name="bestFit" type="Number" integer="true" static="true"><summary>Zoom modifier is calculated automatically so that entire image could fit the control. If image is smaller than the control client area, the image is stretched to occupy as much area as possible.</summary></field>
    /// <field name="bestFitShrinkOnly" type="Number" integer="true" static="true"><summary>Zoom modifier is calculated automatically so that entire image could fit the control. If image is smaller than the control client area, zooming modifier is set to 1 (i.e. no zoom).</summary></field>
    /// <field name="fitToWidth" type="Number" integer="true" static="true"><summary>Zoom modifier is calculated automatically so that the image width would be the same as the control client area width. If the image width is smaller than the control client area width, image is stretched.</summary></field>
    /// <field name="fitToHeight" type="Number" integer="true" static="true"><summary>Zoom modifier is calculated automatically so that the image height would be the same as the control client area height. If the image height is smaller than the control client area height, image is stretched.</summary></field>
    /// <field name="zoomControl" type="Number" integer="true" static="true"><summary>The control is resized to have the same client area as the image dimensions.</summary></field>
    /// <field name="fitToWidthShrinkOnly" type="Number" integer="true" static="true"><summary>Zoom modifier is calculated automatically so that the image width would be the same as the control client area width. If image width is smaller than the control client area, zooming modifier is set to 1 (i.e. no zoom).</summary></field>
    /// <field name="fitToHeightShrinkOnly" type="Number" integer="true" static="true"><summary>Zoom modifier is calculated automatically so that the image height would be the same as the control client area height. If image height is smaller than the control client area, zooming modifier is set to 1 (i.e. no zoom).</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.ZoomMode.prototype = {
    none: 0,
    bestFit: 1,
    bestFitShrinkOnly: 2,
    fitToWidth: 3,
    fitToHeight: 4,
    zoomControl: 5,
    fitToWidthShrinkOnly: 6,
    fitToHeightShrinkOnly: 7
};
Aurigma.GraphicsMill.ZoomMode.registerEnum("Aurigma.GraphicsMill.ZoomMode");

Aurigma.GraphicsMill.ViewportAlignment = function () {
    /// <summary>Specifies possible values for alignment of viewport.</summary>
    /// <field name="centerBottom" type="Number" integer="true" static="true"><summary>Viewport is positioned in the middle of the bottom side.</summary></field>
    /// <field name="centerCenter" type="Number" integer="true" static="true"><summary>Viewport is positioned in the center of the viewer.</summary></field>
    /// <field name="centerTop" type="Number" integer="true" static="true"><summary>Viewport is positioned in the middle of the top side.</summary></field>
    /// <field name="leftBottom" type="Number" integer="true" static="true"><summary>Viewport is positioned in the left bottom corner.</summary></field>
    /// <field name="leftCenter" type="Number" integer="true" static="true"><summary>Viewport is positioned in the middle of the left side.</summary></field>
    /// <field name="leftTop" type="Number" integer="true" static="true"><summary>Viewport is positioned in the left top corner.</summary></field>
    /// <field name="rightBottom" type="Number" integer="true" static="true"><summary>Viewport is positioned in the right bottom corner.</summary></field>
    /// <field name="rightCenter" type="Number" integer="true" static="true"><summary>Viewport is positioned in the middle of the right side.</summary></field>
    /// <field name="rightTop" type="Number" integer="true" static="true"><summary>Viewport is positioned in the right top corner.</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.ViewportAlignment.prototype =
{
    centerBottom: 5,
    centerCenter: 4,
    centerTop: 3,
    leftBottom: 2,
    leftCenter: 1,
    leftTop: 0,
    rightBottom: 8,
    rightCenter: 7,
    rightTop: 6
};
Aurigma.GraphicsMill.ViewportAlignment.registerEnum("Aurigma.GraphicsMill.ViewportAlignment");

Aurigma.GraphicsMill.JqueryMode = function () {
    /// <summary>Specifies possible values for source of JQuery library.</summary>
    /// <field name="BuiltIn" type="Number" integer="true" static="true"><summary>Use JQuery library included in control.</summary></field>
    /// <field name="External" type="Number" integer="true" static="true"><summary>Use window.JQuery</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.JqueryMode.prototype =
{
    BuiltIn: 0,
    External: 1
};
Aurigma.GraphicsMill.JqueryMode.registerEnum("Aurigma.GraphicsMill.JqueryMode");

Aurigma.GraphicsMill.ViewerClientSideOptions = function (viewer) {
    /// <summary>Exposes properties which configure automatic postback for individual events of the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> control.</summary>
    /// <remarks><para>Instances of the <see cref="T:J:Aurigma.GraphicsMill.ViewerClientSideOptions" /> class are returned by the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.clientSideOptions">BaseViewer.clientSideOptions</see> property.</para><para>Each property of this class enables or disables automatic postback for appropriate event. However if the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.autoPostBack">BaseViewer.autoPostBack</see> value is <b>true</b>, automatic postback occurs regardless of these properties values.</para></remarks>
    /// <seealso cref="T:Aurigma.Aurigma.GraphicsMill.AjaxControls.ViewerClientSideOptions" />
    /// <constructor><exclude /></constructor>
    this._v = viewer;
};

Aurigma.GraphicsMill.ViewerClientSideOptions.prototype = {
    get_postBackOnWorkspaceChanged: function () {
        /// <value type="Boolean">The <see cref="T:J:Boolean" /> value which turns automatic postback for the <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceChanged">BaseViewer.workspaceChanged</see> event on.</value>
        /// <summary>Gets/sets a value which turns automatic postback for the <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceChanged">BaseViewer.workspaceChanged</see> event on.</summary>
        /// <remarks><para>If <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.autoPostBack">BaseViewer.autoPostBack</see> is <b>true</b>, <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceChanged">BaseViewer.workspaceChanged</see> event fires regardless of the value of this property.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.ViewerClientSideOptions.PostBackOnWorkspaceChanged">ViewerClientSideOptions.PostBackOnWorkspaceChanged</see> server-side member.</para></remarks>
        return this._v._clientSideOptions$postBackOnWorkspaceChanged;
    },
    set_postBackOnWorkspaceChanged: function (v) {
        this._v._clientSideOptions$postBackOnWorkspaceChanged = v;
    },

    get_postBackOnWorkspaceClick: function () {
        /// <value type="Boolean">The <see cref="T:J:Boolean" /> value which turns automatic postback for the <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceClick">workspaceClick</see> event on.</value>
        /// <summary>Gets/sets a value which turns automatic postback for the <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceClick">workspaceClick</see> event on.</summary>
        /// <remarks><para>If <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.autoPostBack">BaseViewer.autoPostBack</see> is <b>true</b>, <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceClick">workspaceClick</see> event fires regardless of the value of this property.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.ViewerClientSideOptions.PostBackOnWorkspaceClick">ViewerClientSideOptions.PostBackOnWorkspaceClick</see> server-side member.</para></remarks>
        return this._v._clientSideOptions$postBackOnWorkspaceClick;
    },
    set_postBackOnWorkspaceClick: function (v) {
        this._v._clientSideOptions$postBackOnWorkspaceClick = v;
    }
};
Aurigma.GraphicsMill.ViewerClientSideOptions.registerClass("Aurigma.GraphicsMill.ViewerClientSideOptions");

Aurigma.GraphicsMill.BaseViewer = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer" /> server-side control and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>All the client-side classes intended to display some content in a browser are inherited from this class.</para><para><see cref="T:J:Aurigma.GraphicsMill.BaseViewer" /> is an abstract class which implements common functionality for content viewer controls. You cannot instantiate objects of this class directly.</para></remarks>
    /// <seealso cref="T:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer" />
    /// <constructor><exclude /></constructor>

    Aurigma.GraphicsMill.BaseViewer.initializeBase(this, [element]);

    //Begin of the fields populated during $create call
    this._autoPostBack = false;
    this._backColor = "#FFFFFF";
    this._clientSideOptions$postBackOnWorkspaceChanged = false;
    this._clientSideOptions$postBackOnWorkspaceClick = false;
    this._maxZoom = 16;
    this._minZoom = 0.1;
    this._navigator = "";
    this._rubberband = "";
    this._screenXDpi = 72;
    this._screenYDpi = 72;
    this._scrollBarsStyle = Aurigma.GraphicsMill.ScrollBarsStyle.always;
    this._scrollBarWidth = 17;
    this._scrollingPosition = new Aurigma.GraphicsMill.PointF(0, 0);
    this._viewportAlignment = Aurigma.GraphicsMill.ViewportAlignment.leftTop;
    this._jqueryMode = Aurigma.GraphicsMill.JqueryMode.BuiltIn;
    this._zoom = 1;
    this._zoomMode = Aurigma.GraphicsMill.ZoomMode.none,
    this._zoomQuality = Aurigma.GraphicsMill.ZoomQuality.shrinkHighStretchLow,
    this._bestFitWhiteSpacePc = 0,
    this._stateFieldId = "";
    this._needUpdateViewport = false;
    this._msTouchActionInitialValue = "";
    //Postback functions and fields
    this._workspaceClickPostBack = null;
    this._workspaceChangedPostBack = null;
    this._callback = null;
    this._workspaceChanged = false,
    this._workspaceClick = false,
    this._workspaceClickArgs = new Sys.UI.Point(0, 0);

    this._toolTip = "";
    this._accessKey = "";
    this._tabIndex = "";
    this._borderWidth = 0;
    //End of the fields populated during $create call

    this._callbackArgs = "";
    this._callbackContext = 0;

    this._status = Aurigma.GraphicsMill.UpdateStatus.ready;
    this._exceptionDescription = "";
    this._returnValue = "";

    this._clientSideOptions = new Aurigma.GraphicsMill.ViewerClientSideOptions(this);

    this._delayedRefreshTimeout = 1000;
    this._refreshTimer = null;
    this._contentElements = [];

    //Specify whether we need to refresh the image.
    this._needToRefresh = false;

    this._rulerEnabled = false;
    this._rulerWidth = 13;
    this._rulerScale = 1; // to translate points to inches for example.
    this._rulerOffsetX = 0;
    this._rulerOffsetY = 0;
    this._rulersOnScrollDelegate = null;
    this._rulersOnZoomDelegate = null;

    this._activeAjax = 0;

    this._pinchZoomEnabled = true;

    this._holderBounds = null;

    this._jquery = window.jQuery;

    this._contentCtxDimension = {};
    this._viewportLocation = {};

    this._jHolderElement = null;
    this._touchFlags = {};

    this._rulers = {};

    this._bodyCursor = null;
};

Aurigma.GraphicsMill.BaseViewer.prototype =
{
    //--------------------------------------------------------------------------
    //Private
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    get_contentWidth: function () {
        /// <summary>Gets a value that represents the width of the control's content taking into account its horizontal resolution and zoom value.</summary>
        /// <value type="Number">The width of the control's content.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ContentWidth">BaseViewer.ContentWidth</see> server-side member.</para></remarks>

        return this._holderBounds.width;
    },

    get_width: function () {
        /// <summary>Gets the width (in pixels) of the control area.</summary>
        /// <value type="Number">The width of the control area.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Width">BaseViewer.Width</see> server-side member.</para></remarks>

        return this._holderBounds.offsetWidth;
    },

    get_contentHeight: function () {
        /// <summary>Gets a value that represents the height of the control's content taking into account its vertical resolution and zoom value.</summary>
        /// <value type="Number">The height of the control's content.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ContentHeight">BaseViewer.ContentHeight</see> server-side member.</para></remarks>

        return this._holderBounds.height;
    },

    get_height: function () {
        /// <summary>Gets the height (in pixels) of the control area.</summary>
        /// <value type="Number">The height of the control area.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Height">BaseViewer.Height</see> server-side member.</para></remarks>

        return this._holderBounds.offsetHeight;
    },

    notifySizeChanged: function () {
        this._onResize();
    },

    _render: function () {
        var wsize = "width:" + this.get_contentWidth() + "px;height:" + this.get_contentHeight() + "px;";

        var sb = new Sys.StringBuilder();

        sb.append("\u003cdiv id=\"cvContent\" style=\"position:absolute; overflow: hidden;");
        if (!this.get_hasContent || this.get_hasContent()) sb.append(wsize);
        else sb.append("display:none;");

        var vl = this._getViewportLocation();
        sb.append("left:" + vl.x + "px;top:" + vl.y + "px");

        sb.append("\"\u003e");

        this._renderContent(sb);

        // close content.
        sb.append("\u003c/div\u003e");

        var layerIDs = ["cvRubberband", "cvNavigator"];
        for (var i = 0; i < layerIDs.length; i++) {
            var layerID = layerIDs[i];
            sb.append("\u003cdiv id=\"");
            sb.append(layerID);
            sb.append("\"");
            sb.append(" style=\" ");
            if (!this.get_hasContent || this.get_hasContent())
                sb.append(wsize);

            sb.append("position:absolute;left:0px;top:0px\"\u003e\u003c/div\u003e");
        }

        sb.append("\u003c/div\u003e");
        return sb.toString();
    },

    _clearElement: function (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
    },

    _rulersOnScroll: function () {
        if (!this._touchFlags.pinchStarted)
            this._updateRulersStyle();
    },

    _rulersOnZoom: function () {
        if (!this._touchFlags.pinchStarted) {
            this._drawRulers();
            this._updateRulersStyle();
        }
    },

    _rulersOnMouseMove: function (o, e) {
        // used to draw slide bars just when somebody move mouse over content but don't hold some object
        // and don't use setCapture
        if (this.get_rulerEnabled()) {
            var topSlideBar = this._rulers.topSlideBar;
            var leftSlideBar = this._rulers.leftSlideBar;

            if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice()) {
                if (!Aurigma.GraphicsMill.Utils.Platform.IsTouchIE())
                    return;
                else if (e.originalEvent.pointerType != e.originalEvent.MSPOINTER_TYPE_MOUSE) {
                    topSlideBar.style.left = "0px";
                    leftSlideBar.style.top = "0px";

                    return;
                }
            }

            var vl = this._getViewportLocation();
            var contentOffset = this._getElementPageCoord(this._contentCtx);

            var pageX = -1,
                pageY = -1;

            if (!isNaN(e.pageX) && !isNaN(e.pageY)) {
                pageX = e.pageX;
                pageY = e.pageY;
            }
            else if (e.originalEvent) {
                if (e.originalEvent.touches) {
                    pageX = e.originalEvent.touches[0].pageX;
                    pageY = e.originalEvent.touches[0].pageY;
                }
                else {
                    pageX = e.originalEvent.pageX;
                    pageY = e.originalEvent.pageY;
                }
            }

            var x = vl.x + pageX - contentOffset.left - this._scrollingPosition.x;
            var y = vl.y + pageY - contentOffset.top - this._scrollingPosition.y;
            topSlideBar.style.left = x + "px";
            leftSlideBar.style.top = y + "px";
        }
    },

    _initializeRulers: function () {
        // create Rulers.
        var el = this.get_element().parentNode;
        var doc = el.ownerDocument;

        var rulersStyle =
            {
                "z-index": "2",
                "-webkit-transform": "translate3d(0px, 0px, 0px)",
                "-moz-transform": "translate3d(0px, 0px, 0px)"
                //"transform": "translate3d(0px, 0px, 0px)"
            };

        var topRuller = doc.createElement("div");
        this._jquery(topRuller).css(rulersStyle);

        var fullTopRuller = doc.createElement("div");

        var leftRuller = doc.createElement("div");
        this._jquery(leftRuller).css(rulersStyle);

        var fullLeftRuller = doc.createElement("div");

        var whiteRect = doc.createElement("div");
        this._jquery(whiteRect).css("z-index", "2");

        var topSlideBar = doc.createElement("div");
        var leftSlideBar = doc.createElement("div");

        this._rulers.topRuller = topRuller;
        this._rulers.leftRuller = leftRuller;
        this._rulers.fullTopRuller = fullTopRuller;
        this._rulers.fullLeftRuller = fullLeftRuller;
        this._rulers.whiteRect = whiteRect;
        this._rulers.topSlideBar = topSlideBar;
        this._rulers.leftSlideBar = leftSlideBar;

        var id = this.get_element().id;
        topRuller.id = id + "_TopRuler";
        fullTopRuller.id = id + "_FullTopRuler";
        leftRuller.id = id + "_LeftRuler";
        fullLeftRuller.id = id + "_FullLeftRuler";
        whiteRect.id = id + "_WhiteRect";
        topSlideBar.id = id + "_TopSlideBar";
        leftSlideBar.id = id + "_LeftSlideBar";

        fullTopRuller = topRuller.appendChild(fullTopRuller);
        fullLeftRuller = leftRuller.appendChild(fullLeftRuller);
        topSlideBar = topRuller.appendChild(topSlideBar);
        leftSlideBar = leftRuller.appendChild(leftSlideBar);
        topRuller = el.appendChild(topRuller);
        leftRuller = el.appendChild(leftRuller);
        whiteRect = el.appendChild(whiteRect);

        topRuller.style.position =
            fullTopRuller.style.position =
                leftRuller.style.position =
                    fullLeftRuller.style.position =
                        whiteRect.style.position =
                            topSlideBar.style.position =
                                leftSlideBar.style.position = "absolute";

        leftSlideBar.style.width = topSlideBar.style.height = this.get_rulerWidth() + "px";
        leftSlideBar.style.height = topSlideBar.style.width = "1px";
        leftSlideBar.style.backgroundColor = topSlideBar.style.backgroundColor = "#ff0000";
        leftSlideBar.style.overflow = topSlideBar.style.overflow = "hidden";
        leftSlideBar.style.webkitTransform = topSlideBar.style.webkitTransform = "translate3d(0, 0, 0)";

        topRuller.style.overflow =
            leftRuller.style.overflow =
                whiteRect.style.overflow = "hidden";
        topRuller.style.visibility =
            leftRuller.style.visibility =
                whiteRect.style.visibility = "hidden";
        whiteRect.style.backgroundColor = "#909090";

        el.style.position = "relative";

        this._drawRulers();
        this._updateRulersStyle();

        if (!this._rulersOnScrollDelegate) {
            this._rulersOnScrollDelegate = Function.createDelegate(this, this._rulersOnScroll);
            this.add_scrolled(this._rulersOnScrollDelegate);
        }

        if (!this._rulersOnZoomDelegate) {
            this._rulersOnZoomDelegate = Function.createDelegate(this, this._rulersOnZoom);
            this.add_zoomed(this._rulersOnZoomDelegate);
        }

        this.add_mouseMove(Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._rulersOnMouseMove));
    },

    _disposeRulers: function () {
        if (this._rulersOnScrollDelegate) {
            this.remove_scrolled(this._rulersOnScrollDelegate);
            this._rulersOnScrollDelegate = null;
        }
        if (this._rulersOnZoomDelegate) {
            this.remove_zoomed(this._rulersOnZoomDelegate);
            this._rulersOnZoomDelegate = null;
        }
    },

    _updateRulersStyle: function () {
        // Set ruler style.

        var leftRuller = this._rulers.leftRuller;
        var topRuller = this._rulers.topRuller;
        var fullLeftRuller = this._rulers.fullLeftRuller;
        var fullTopRuller = this._rulers.fullTopRuller;
        var whiteRect = this._rulers.whiteRect;

        var width = this.get_width();
        var hight = this.get_height();
        var contentWidth = this.get_contentWidth();
        var contentHeight = this.get_contentHeight();
        var scrollBarWidth = this.get_scrollBarWidth();

        var leftRullerStyle = leftRuller.style;
        var topRullerStyle = topRuller.style;
        var fullTopRullerStyle = fullTopRuller.style;
        var fullLeftRullerStyle = fullLeftRuller.style;
        var whiteRectStyle = whiteRect.style;

        if (!this._rulerEnabled) {
            topRullerStyle.width = topRullerStyle.height = leftRullerStyle.width = leftRullerStyle.height = topRullerStyle.borderWidth = leftRullerStyle.borderWidth = whiteRectStyle.width = whiteRectStyle.height = "0px";
            leftRullerStyle.visibility = topRullerStyle.visibility = whiteRectStyle.visibility = "hidden";
        }
        else {
            leftRullerStyle.visibility = topRullerStyle.visibility = whiteRectStyle.visibility = "inherit";
            leftRullerStyle.backgroundColor = topRullerStyle.backgroundColor = "#ffffff";
            leftRullerStyle.borderRight = topRullerStyle.borderBottom = "1px solid black";

            var sbAlways = this.get_scrollBarsStyle() == Aurigma.GraphicsMill.ScrollBarsStyle.always;
            var sbAuto = this.get_scrollBarsStyle() == Aurigma.GraphicsMill.ScrollBarsStyle.auto;

            var isThisScrollBar = sbAlways || (sbAuto && (contentHeight > hight - this.get_rulerWidth()));
            var isThatScrollBar = sbAlways || (sbAuto && (contentWidth > width - this.get_rulerWidth()));
            isThisScrollBar = isThisScrollBar || (isThatScrollBar && sbAuto && (contentHeight > hight - this.get_rulerWidth() - scrollBarWidth));
            isThatScrollBar = isThatScrollBar || (isThisScrollBar && sbAuto && (contentWidth > width - this.get_rulerWidth() - scrollBarWidth));
            var rw = isThisScrollBar ? width - scrollBarWidth : width;
            var rh = isThatScrollBar ? hight - scrollBarWidth : hight;

            topRullerStyle.width = rw + "px";
            leftRullerStyle.height = rh + "px";

            fullTopRullerStyle.height = topRullerStyle.height = whiteRect.style.height = this._rulerWidth + "px";
            fullLeftRullerStyle.width = leftRullerStyle.width = whiteRect.style.width = this._rulerWidth + "px";

            // to get clear scroll we need rulers positioned in top-left corner.

            topRullerStyle.top = leftRullerStyle.top = topRullerStyle.left = leftRullerStyle.left = whiteRect.style.top = whiteRect.style.left = "0px";

            var sp = this.get_scrollingPosition();

            fullTopRullerStyle.left = -sp.x + "px";
            fullLeftRullerStyle.top = -sp.y + "px";
        }
    },

    _drawRulers: function () {
        if (this._rulerEnabled) {
            var doc = this.get_element().parentNode.ownerDocument;

            var fullLeftRuler = this._rulers.fullLeftRuller;
            var fullTopRuler = this._rulers.fullTopRuller;

            var axes = [
                {
                    controlLength: this.get_width(),
                    contentLength: this.get_contentWidth(),
                    viewportLocation: this._getViewportLocation().x,
                    factor: this.get_zoom() * this.get_actualSizeHorizontalScale(),
                    ruler: fullTopRuler
                },
                {
                    controlLength: this.get_height(),
                    contentLength: this.get_contentHeight(),
                    viewportLocation: this._getViewportLocation().y,
                    factor: this.get_zoom() * this.get_actualSizeHorizontalScale(),
                    ruler: fullLeftRuler
                }];

            var rulerOffsets = [this.get_rulerOffsetX(), this.get_rulerOffsetY()];

            var sw = this.get_scrollBarWidth();

            var sbAlways = this.get_scrollBarsStyle() == Aurigma.GraphicsMill.ScrollBarsStyle.always;
            var sbAuto = this.get_scrollBarsStyle() == Aurigma.GraphicsMill.ScrollBarsStyle.auto;
            var rulerScale = this.get_rulerScale();

            for (var i = 0; i < axes.length; i++) {
                axes[i].origin = axes[i].viewportLocation + rulerOffsets[i] * axes[i].factor;

                var isThisScrollBar = sbAlways || (sbAuto && (axes[1 - i].contentLength > axes[1 - i].controlLength - this.get_rulerWidth()));
                var isThatScrollBar = sbAlways || (sbAuto && (axes[i].contentLength > axes[i].controlLength - this.get_rulerWidth()));
                isThisScrollBar = isThisScrollBar || (isThatScrollBar && sbAuto && (axes[1 - i].contentLength > axes[1 - i].controlLength - this.get_rulerWidth() - sw));
                isThatScrollBar = isThatScrollBar || (isThisScrollBar && sbAuto && (axes[i].contentLength > axes[i].controlLength - this.get_rulerWidth() - sw));

                if (isThatScrollBar)
                    axes[i].rulerPixelLength = Math.max(axes[i].contentLength + this.get_rulerWidth(), axes[i].controlLength - (isThisScrollBar ? sw : 0));
                else
                    axes[i].rulerPixelLength = (isThisScrollBar) ? axes[i].controlLength - sw : axes[i].controlLength;

                axes[i].startWorkspaceLocation = -axes[i].origin;
                axes[i].endWorkspaceLocation = axes[i].startWorkspaceLocation + axes[i].rulerPixelLength;
                axes[i].startWorkspaceLocation /= axes[i].factor;
                axes[i].endWorkspaceLocation /= axes[i].factor;
                axes[i].startWorkspaceLocation *= rulerScale;
                axes[i].endWorkspaceLocation *= rulerScale;

                // generate division.
                var maxCutLength = 80; // pixels;
                var minCutLength = 4; // pixels;
                var currentDivision = 1;
                var tmp = (maxCutLength / axes[i].factor) * rulerScale;
                var size = 1;
                while (tmp > 10) {
                    tmp /= 10;
                    size *= 10;
                }
                if (tmp > 5) {
                    size = 5 * size;
                    currentDivision = 5;
                }
                else if (tmp > 2) {
                    size = 2 * size;
                    currentDivision = 2;
                }

                // generate first fragmentation (with numbers);
                var cuts = [{ location: 0, index: 0 }];
                var cur = 0;
                while (cur < axes[i].endWorkspaceLocation) {
                    cur += size;
                    cuts.push({ location: cur, index: 0 });
                }
                cur = 0;
                while (cur > axes[i].startWorkspaceLocation) {
                    cur -= size;
                    cuts.push({ location: cur, index: 0 });
                }

                // clear elements.
                this._clearElement(axes[i].ruler);

                // draw text.
                var j;
                for (j = 0; j < cuts.length; j++) {
                    var txt = doc.createElement("span");
                    var labelText = Math.abs(Math.round(cuts[j].location)).toString();
                    txt.innerHTML = (i == 1) ? labelText.split('').join('<br/>') : labelText;
                    txt.style.position = "absolute";
                    txt.style.fontSize = "9px";
                    txt.style.margin = "0px";
                    txt.style.padding = "0px";
                    txt.style.fontFamily = "Tahoma, Verdana, Arial;";
                    txt.style.backgroundColor = "#ffffff";
                    var offset = Math.round(cuts[j].location * axes[i].factor / rulerScale + axes[i].origin);
                    txt.style.top = (i == 0) ? "-1px" : offset + 2 + "px";
                    txt.style.left = (i == 1) ? "2px" : offset + 2 + "px";

                    axes[i].ruler.appendChild(txt);
                }

                // create other cuts.
                var currentIndex = 1;
                var divs = { 1: { newDiv: 5, fractions: 2 }, 2: { newDiv: 1, fractions: 2 }, 5: { newDiv: 1, fractions: 5 } };
                var c = divs[currentDivision];
                var newSize = size / c.fractions;
                while (newSize * axes[i].factor / rulerScale > minCutLength) {
                    var l = cuts.length - 1;
                    while (l >= 0) {
                        for (var k = 0; k < c.fractions - 1; k++) cuts.push({ index: currentIndex, location: cuts[l].location + newSize * (k + 1) });
                        l--;
                    }
                    currentIndex++;
                    c = divs[c.newDiv];
                    newSize = newSize / c.fractions;
                }

                var j;
                for (j = 0; j < cuts.length; j++) {
                    var cut = doc.createElement("div");
                    cut.style.position = "absolute";
                    cut.style.overflow = "hidden";
                    cut.style.backgroundColor = "#000000";
                    cut.style.padding = "0px";
                    cut.style.margin = "0px";
                    var offset = Math.round(cuts[j].location * axes[i].factor / rulerScale + axes[i].origin/* + this.get_rulerWidth()*/);
                    var rw = this.get_rulerWidth();
                    var cutWidth = Math.max(Math.ceil(rw / Math.pow(2, cuts[j].index)), 2);
                    cut.style.width = (i == 0) ? "1px" : cutWidth + "px";
                    cut.style.height = (i == 1) ? "1px" : cutWidth + "px";
                    cut.style.top = (i == 0) ? (rw - cutWidth) + "px" : offset + "px";
                    cut.style.left = (i == 1) ? (rw - cutWidth) + "px" : offset + "px";
                    cut.style.webkitTransform = "translate3d(0, 0, 0)";

                    axes[i].ruler.appendChild(cut);
                }
            }
        }
    },

    _generateCssWithPrefixes: function (prefixes, value) {
        var retVal = {};

        for (var i in prefixes)
            retVal[prefixes[i] + "transition"] = value;

        return retVal;
    },

    _getPageZoom: function () {
        return screen.deviceXDPI / screen.logicalXDPI;
    },

    _getActualScrollPosition: function () {
        /// <returns type="Sys.UI.Point" />

        var holder = this.get_element();

        var scrollLeft = holder.scrollLeft,
            scrollTop = holder.scrollTop;

        return new Aurigma.GraphicsMill.PointF(scrollLeft, scrollTop);
    },

    _getViewportLocation: function () {
        /// <returns type="Sys.UI.Point" />

        if (this.get_zoomMode() == Aurigma.GraphicsMill.ZoomMode.zoomControl)
            return new Sys.UI.Point(0, 0);

        var rullerWidth = this.get_rulerEnabled() ? this.get_rulerWidth() : 0;

        var elementBounds = this._holderBounds;

        var viewAreaWidth = elementBounds.width - rullerWidth;
        var viewAreaHeight = elementBounds.height - rullerWidth;

        var contentWidth = this.get_contentWidth();
        var contentHeight = this.get_contentHeight();

        var x, y;
        switch (this._viewportAlignment) {
            case Aurigma.GraphicsMill.ViewportAlignment.centerBottom:
            case Aurigma.GraphicsMill.ViewportAlignment.centerCenter:
            case Aurigma.GraphicsMill.ViewportAlignment.centerTop:
                x = Math.floor((viewAreaWidth - contentWidth) / 2);
                break;
            case Aurigma.GraphicsMill.ViewportAlignment.leftBottom:
            case Aurigma.GraphicsMill.ViewportAlignment.leftCenter:
            case Aurigma.GraphicsMill.ViewportAlignment.leftTop:
                x = 0;
                break;
            case Aurigma.GraphicsMill.ViewportAlignment.rightBottom:
            case Aurigma.GraphicsMill.ViewportAlignment.rightCenter:
            case Aurigma.GraphicsMill.ViewportAlignment.rightTop:
                x = viewAreaWidth - contentWidth;
                break;
        }
        ;

        switch (this._viewportAlignment) {
            case Aurigma.GraphicsMill.ViewportAlignment.centerCenter:
            case Aurigma.GraphicsMill.ViewportAlignment.leftCenter:
            case Aurigma.GraphicsMill.ViewportAlignment.rightCenter:
                y = Math.floor((viewAreaHeight - contentHeight) / 2);
                break;
            case Aurigma.GraphicsMill.ViewportAlignment.centerTop:
            case Aurigma.GraphicsMill.ViewportAlignment.leftTop:
            case Aurigma.GraphicsMill.ViewportAlignment.rightTop:
                y = 0;
                break;
            case Aurigma.GraphicsMill.ViewportAlignment.centerBottom:
            case Aurigma.GraphicsMill.ViewportAlignment.leftBottom:
            case Aurigma.GraphicsMill.ViewportAlignment.rightBottom:
                y = viewAreaHeight - contentHeight;
                break;
        }
        ;

        return new Sys.UI.Point(Math.max(rullerWidth, x + rullerWidth), Math.max(rullerWidth, y + rullerWidth));
    },

    ignoreDocumentClickOnce: function () {
        this._ignoreDocumentClickOnce = true;
    },

    _onDocumentClick: function (e) {
        if (this._ignoreDocumentClickOnce === true) {
            this._ignoreDocumentClickOnce = false;

            return;
        }

        this._raiseEvent("documentClick", e);
    },

    _onClick: function (e) {
        this._raiseEvent("click", e);
    },

    _onMouseDown: function (e) {
        this._raiseEvent("mouseDown", e);
    },

    _onMouseMove: function (e) {
        this._raiseEvent("mouseMove", e);
    },

    _onMouseUp: function (e) {
        this._raiseEvent("mouseUp", e);
    },

    _useWorkspaceCoords: function (e) {
        this._fixJqueryEvent(e);

        var pt = this.pageToWorkspacePoint(e.pageX, e.pageY);

        e.x = pt.x;
        e.y = pt.y;
    },

    _fixJqueryEvent: function (e) {
        //add pageX/Y and clientX/Y to jquery event
        var originalEvent = e.originalEvent;

        if (typeof e.type == "string" && e.type.indexOf("touch") !== -1)//touch event
        {
            var touch = originalEvent.touches.length > 0 ? originalEvent.touches[0] : originalEvent.changedTouches[0];

            e.pageX = touch.pageX;
            e.pageY = touch.pageY;
            e.clientX = touch.clientX;
            e.clientY = touch.clientY;
        }
        else {
            if (isNaN(e.pageX) || isNaN(e.pageY)) {
                e.pageX = originalEvent.pageX;
                e.pageY = originalEvent.pageY;
            }

            if (isNaN(e.clientX) || isNaN(e.clientY)) {
                e.clientX = originalEvent.clientX;
                e.clientY = originalEvent.clientY;
            }
        }
    },

    _onWorkspaceDoubleClick: function (e) {
        this._useWorkspaceCoords(e);
        var opt = { x: e.x, y: e.y };
        this._raiseEvent("workspaceDoubleClick", opt);
    },

    _onWorkspaceClick: function (e) {
        this._useWorkspaceCoords(e);
        var opt = { x: e.x, y: e.y };
        this._raiseEvent("workspaceClick", opt);

        this._workspaceClickArgs = new Aurigma.GraphicsMill.PointF(opt.x, opt.y);

        if (this.get_autoPostBack() || this.get_clientSideOptions().get_postBackOnWorkspaceClick())
            this._workspaceClickPostBack();
        else
            this._workspaceClick = true;
    },

    _onWorkspaceMouseDown: function (e) {
        if (this._isManyTouches(e))
            return;
        this._useWorkspaceCoords(e);

        this._raiseEvent("workspaceMouseDown", e);

        // Enable capture to handle mouse move events outside control
        if (!Aurigma.GraphicsMill.Utils.Platform.IsTouchIE()) {
            this._contentCtx.setCapture();
        }
    },

    _onWorkspaceMouseUp: function (e) {
        if (this._isManyTouches(e))
            return;

        this._useWorkspaceCoords(e);

        this._raiseEvent("workspaceMouseUp", e);

        // Disable capture
        this._contentCtx.releaseCapture();
    },

    _onWorkspaceMouseMove: function (e) {
        if (this._isManyTouches(e)) {
            //prevent browser pinch
            e.preventDefault();

            return;
        }

        this._useWorkspaceCoords(e);

        this._raiseEvent("workspaceMouseMove", e);
    },

    _saveState: function () {
        var s = new Object();
        this._serializeState(s);
        var state = Sys.Serialization.JavaScriptSerializer.serialize(s);
        $get(this._stateFieldId).value = state;
    },

    _callbackSuccess: function (message, context) {
        /// <param name="name" type="String" />
        /// <param name="context" type="String" />

        if (context == this._callbackContext) {
            eval(message);
            this._callbackComplete();

            if (this._needToRefresh) {
                this._updateViewport();
                this._refresh();
            }
        }
    },

    _callbackError: function (message, context) {
        /// <param name="name" type="String" />
        /// <param name="context" type="String" />

        this._exceptionDescription = message;
        this._callbackComplete();
    },

    _callbackComplete: function () {
        this._activeAjax--;

        //Change the viewer status.
        this._status = Aurigma.GraphicsMill.UpdateStatus.ready;
        this._raiseEvent("statusChanged");
    },

    //--------------------------------------------------------------------------
    //Protected
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Method
    //--------------------------------------------------------------------------

    /// <protected />
    _raiseEvent: function (name, args) {
        /// <param name="name" type="String" />
        /// <param name="args" />
        var h = this.get_events().getHandler(name);
        if (h) {
            if (args == undefined) args = Sys.EventArgs.Empty;
            h(this, args);
        }
    },

    /// <protected />
    _makeInactive: function (domElement) {
        /// <param name="e" domElement="true" />
        domElement.ondrag = function () {
            return false;
        };

        domElement.unselectable = "on";
    },

    /// <protected />
    _makeInactiveAll: function () {
        var el = this._contentElements;
        for (var i = 0; i < el.length; i++) this._makeInactive(el[i]);
    },

    /// <protected />
    _resizeContentElements: function () {
        var contentWidth = this.get_contentWidth();
        var contentHeight = this.get_contentHeight();

        var el = this._contentElements;
        for (var i = 0; i < el.length; i++) {
            el[i].style.width = contentWidth + "px";
            el[i].style.height = contentHeight + "px";
            if (el[i].tagName == "IMG") {
                el[i].width = contentWidth;
                el[i].height = contentHeight;
            }
        }

        this._contentCtxDimension.width = contentWidth;
        this._contentCtxDimension.height = contentHeight;

        this._holderBounds = this._getElementBounds(this.get_element());
    },

    _getElementBounds: function (element) {
        //when the element is placed in the hidden element ("display: none" style)
        //then clientWidth, clientHeight, offsetWidth, offsetHeight, offsetTop, offsetLeft are 0

        var hiddenElements = [];
        var jElement = this._jquery(element);

        //remove display:none style from parent elements
        while (jElement.length > 0 && jElement[0] != document) {
            if (jElement.css("display") == "none") {
                hiddenElements.push({
                    element: jElement,
                    display: jElement[0].style.display,
                    visibility: jElement[0].style.visibility
                });

                jElement[0].style.visibility = "hidden";
                jElement[0].style.display = "block";
            }

            jElement = jElement.parent();
        }

        //get element properties
        var width = element.clientWidth;
        var height = element.clientHeight;
        var offsetHeight = element.offsetHeight;
        var offsetWidth = element.offsetWidth;
        var offsetTop = element.offsetTop;
        var offsetLeft = element.offsetLeft;

        //restore display:none style
        for (var i = 0; i < hiddenElements.length; i++) {
            var hiddenElementBound = hiddenElements[i];

            hiddenElementBound.element[0].style.visibility = hiddenElementBound.visibility;
            hiddenElementBound.element[0].style.display = hiddenElementBound.display;
        }

        return {
            "width": width,
            "height": height,
            "offsetWidth": offsetWidth,
            "offsetHeight": offsetHeight,
            "offsetTop": offsetTop,
            "offsetLeft": offsetLeft
        };
    },

    _isManyTouches: function (jEvent) {
        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice()) {
            if (window.navigator.pointerEnabled) {
                if (!this._touchFlags.multiTouch && jEvent.originalEvent.isPrimary === false)
                    this._touchFlags.multiTouch = true;

                if (this._touchFlags.multiTouch)
                    return true;
            }
            else {
                var originalEvent = jEvent.originalEvent;

                if (typeof originalEvent.touches === "object" &&
                    originalEvent.touches !== null &&
                    typeof originalEvent.touches.length === "number" &&
                    originalEvent.touches.length > 1) {
                    return true;
                }
            }
        }
        return false;
    },

    /// <protected />
    _onTouch: function (e) {
        this._touchFlags.startZoom = this.get_zoom();
        this._touchFlags.multiTouch = e.gesture.touches.length > 1;
    },

    /// <protected />
    _onPinch: function (e, skipScrollToGestureCenter) {
        e.gesture.preventDefault();
        e.preventDefault();

        this._touchFlags.multiTouch = e.gesture.touches.length > 1;

        if (!this._touchFlags.pinchStarted) {
            this._touchFlags.pinchStarted = true;

            this._raiseEvent("pinchStart");
        }

        if (this.get_pinchZoomEnabled()) {
            var zoom = this._touchFlags.startZoom * e.gesture.scale;

            var zoomParams = {};

            if (skipScrollToGestureCenter)
                zoomParams.skipZoomToCenter = true;
            else {
                zoomParams.centerPageX = e.gesture.center.pageX;
                zoomParams.centerPageY = e.gesture.center.pageY;
            }

            this.set_zoom(zoom, zoomParams);
        }
    },

    /// <protected />
    _onRelease: function (e) {
        this._touchFlags.multiTouch = false;

        if (this._touchFlags.pinchStarted) {
            this._touchFlags.pinchStarted = false;

            this._raiseEvent("pinchStop");
        }
    },

    /// <protected />
    initialize: function () {
        /// <exclude />

        var style = document.createElement("style");
        style.id = "aurigmaStyles";
        style.type = "text/css";
        style.innerHTML = ".aurigmaNoSelect {" +
	        "-webkit-user-select: none;" +
	        "-moz-user-select: none;" +
	        "-ms-user-select: none;" +
	        "user-select: none;" +
	        "}";
        document.getElementsByTagName("head")[0].appendChild(style);

        if (this._jqueryMode === Aurigma.GraphicsMill.JqueryMode.BuiltIn) {
            this._jquery = Aurigma207b12f3449a482cb956bf29e1ebc1c9.jQuery;
        }
        else {
            if (typeof window.jQuery !== "function")
                throw new Error("jQuery not found");

            this._jquery = window.jQuery;
        }

        Aurigma.GraphicsMill.BaseViewer.callBaseMethod(this, 'initialize');

        var holderElement = this.get_element();

        this._holderBounds = this._getElementBounds(holderElement);

        this._jHolderElement = this._jquery(holderElement);

        holderElement.innerHTML = this._render();

        // Change border style.
        var border = this.get_element().parentNode;
        border.style.borderWidth = this._borderWidth + "px";

        this._makeInactive(holderElement);

        var contentElement = this._jquery(holderElement).find("#cvContent");

        this._contentElements.push(this._contentCtx = contentElement[0]);
        this._contentElements.push(this._rubberbandCtx = this._jquery(holderElement).find("#cvRubberband")[0]);
        this._contentElements.push(this._navigatorCtx = this._jquery(holderElement).find("#cvNavigator")[0]);

        this._addSetCapture(holderElement);

        //Init scrolling position
        var sp = this._scrollingPosition;
        this._scrollInitialized = true;

        holderElement.scrollLeft = sp.x;
        holderElement.scrollTop = sp.y;

        this._initializeRulers();
        var pointerStartEvents = "mousedown";
        var pointerMoveEvents = "mousemove";
        var pointerUpEvents = "mouseup";
        var pointerCancel = "";

        //gesture handling
        if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice()) {
            this._jHolderElement.hammer()
                .on("touch", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onTouch))
                .on("pinch", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onPinch))
                .on("release", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onRelease));

            if (window.navigator.pointerEnabled) {
                pointerStartEvents = "pointerdown";
                pointerMoveEvents = "pointermove";
                pointerUpEvents = "pointerup";
                pointerCancel = "pointerCancel";

                this._jHolderElement.css("touch-action", this._msTouchActionInitialValue);
            } else {
                pointerStartEvents = "mousedown touchstart";
                pointerMoveEvents = "mousemove touchmove";
                pointerUpEvents = "mouseup touchend";
                pointerCancel = "touchcancel";
            }
        }

        //mouse/touch events handling
        this._jquery(document).on("click", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onDocumentClick));

        this._jHolderElement
            .on("contextmenu", function (e) { e.preventDefault(); })
            .on("click", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onClick))
            .on(pointerStartEvents, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onMouseDown))
            .on(pointerMoveEvents, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onMouseMove))
            .on(pointerUpEvents, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onMouseUp))
            .on(pointerCancel, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onMouseUp))
            .on("scroll", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onScroll));

        var jqContentCtx = this._jquery(this._contentCtx);

        jqContentCtx
	        .on("click", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onWorkspaceClick))
	        .on("dblclick", Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onWorkspaceDoubleClick))
	        .on(pointerStartEvents, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onWorkspaceMouseDown))
	        .on(pointerMoveEvents, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onWorkspaceMouseMove))
	        .on(pointerUpEvents, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onWorkspaceMouseUp))
	        .on(pointerCancel, Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, this._onWorkspaceMouseUp));

        this._contentCtxDimension =
            {
                width: this.get_contentWidth(),
                height: this.get_contentHeight()
            };

        this._updateViewport();
        this._updateViewportAlignment();
        this._updateRulersStyle();

        this.add_pinchStart(Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, function () {
            this._rulers.topRuller.style.opacity =
                    this._rulers.leftRuller.style.opacity = 0.1;
        }));

        this.add_pinchStop(Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, function () {
            this._rulersOnZoom();

            this._rulers.topRuller.style.opacity =
                    this._rulers.leftRuller.style.opacity = 1;
        }));

        setInterval(Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, function () {
            var bounds = this._getElementBounds(this.get_element());

            if (bounds.width > 0 && bounds.width !== this._holderBounds.width || bounds.height > 0 && bounds.height !== this._holderBounds.height) {
                this._holderBounds = bounds;
                this._onResize();
            }
        }), 500);
    },

    /// <protected />
    _onScroll: function (e) {
        if (this._scrollInitialized) {
            this._scrollInitialized = false;
            return;
        }
        this._scrollingPosition = this._getActualScrollPosition();

        //Raise a client event.
        this._raiseEvent("scrolled");
    },

    /// <protected />
    _onResize: function (e) {
        this._updateViewport();
        this._updateViewportAlignment();
        this._updateRulersStyle();

        this._scrollingPosition = this._getActualScrollPosition();

        this._raiseEvent("onresize");
    },

    /// <protected />
    _updateViewport: function () {
        if (this.get_hasContent && !this.get_hasContent())
            return;

        var mode = this.get_zoomMode();

        //Update zoom and or the control size
        if (mode == Aurigma.GraphicsMill.ZoomMode.zoomControl) {
            var scrollBarWidth = (this.get_scrollBarsStyle() == Aurigma.GraphicsMill.ScrollBarsStyle.auto) ? 0 : this.get_scrollBarWidth();
            var el = this.get_element();
            var parent = el.parentNode;
            el.style.width = Math.round(this.get_contentWidth() + scrollBarWidth + rw) + "px";
            el.style.height = Math.round(this.get_contentHeight() + scrollBarWidth + rw) + "px";
            parent.style.width = Math.round(this.get_contentWidth() + scrollBarWidth + rw) + "px";
            parent.style.height = Math.round(this.get_contentHeight() + scrollBarWidth + rw) + "px";
        }
        else
            if (mode != Aurigma.GraphicsMill.ZoomMode.none)
                this._zoom = this.calculateZoomByZoomMode(mode);

        this._resizeContentElements();

        var vl = this._getViewportLocation();
        this._contentCtx.style.left = vl.x + "px";
        this._contentCtx.style.top = vl.y + "px";

        this._viewportLocation = vl;
        //Raise the client event
        this._raiseEvent("zoomed");
    },

    _addSetCapture: function (holderElement) {
        //polyfill for setCapture/releaseCapture

        var thisViewer = this;

        if (window.HTMLElement) {
            var element = window.HTMLElement.prototype;

            var capture = "click mousedown mouseup mousemove mouseover mouseout";

            if (!element.setCapture) {
                element.setCapture = function (retargetToElement, wnd) {
                    if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice())
                        return;

                    wnd = wnd || window;
                    var doc = wnd.document;

                    //It is incorrect implementation in the general case due to the fact that holderElement inherits preventing of selection,
                    //but there is not use cases that sensetive to it now.
                    doc.querySelector("body").classList.add("aurigmaNoSelect");

                    var self = this;
                    if (!this._capture) {
                        this._capture = function (e) {
                            var eventPath = Aurigma.GraphicsMill.Utils.getEventPath(e.originalEvent);
                            if (eventPath.indexOf(self) !== -1)
                                return;

                            var event = document.createEvent("MouseEvents");
                            var dx = 0, dy = 0;

                            event.initMouseEvent(e.type,
                                e.bubbles, e.cancelable, e.view, e.detail,
                                e.screenX, e.screenY, e.clientX + dx, e.clientY + dy,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                e.button, e.relatedTarget);
                            self.dispatchEvent(event);
                        };

                        thisViewer._jquery(doc).on(capture, this._capture);
                    }
                };

                element.releaseCapture = function (wind) {
                    if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice())
                        return;

                    var wnd = (wind) ? wind : window;
                    var doc = wnd.document;

                    doc.querySelector("body").classList.remove("aurigmaNoSelect");

                    if (this._stopPropagation)
                        thisViewer._jquery(holderElement).off(capture, this._stopPropagation);

                    if (this._capture)
                        thisViewer._jquery(wnd.document).off(capture, this._capture);

                    this._capture = null;
                };
            }
        }
    },

    _getElementPageCoord: function (domElement) {

        return this._jquery(domElement).offset();
    },

    _zoomToPagePoint: function (zoom, pageX, pageY) {
        var controlPt = this.pageToControlPoint(pageX, pageY);

        var workspacePt = this.pageToWorkspacePoint(pageX, pageY);

        this._setZoom(zoom);

        var contentPt = this.workspaceToContentPoint(workspacePt);

        var rulerWidth = this.get_rulerEnabled() ? this._rulerWidth : 0;

        var scroll =
            {
                x: Math.round(contentPt.x - controlPt.x + rulerWidth),
                y: Math.round(contentPt.y - controlPt.y + rulerWidth)
            };

        this.set_scrollingPosition(scroll);
    },

    _updateViewportAlignment: function () {
        var vl = this._getViewportLocation();
        this._contentCtx.style.left = vl.x + "px";
        this._contentCtx.style.top = vl.y + "px";
    },

    /// <protected />
    _serializeState: function (state) {
        state.ClientSideOptions_PostBackOnWorkspaceChanged = this._clientSideOptions$postBackOnWorkspaceChanged;
        state.ClientSideOptions_PostBackOnWorkspaceClick = this._clientSideOptions$postBackOnWorkspaceClick;
        state.ScrollingPosition = this._scrollingPosition.toPoint();
        state.ScrollingSize = this.get_scrollingSize();
        state.ScrollBarsStyle = this._scrollBarsStyle;
        state.ScrollBarWidth = this._scrollBarWidth;
        state.ViewportAlignment = this._viewportAlignment;
        state.Zoom = this._zoom;
        state.ZoomMode = this._zoomMode;
        state.Navigator = this._navigator;
        state.Rubberband = this._rubberband;
        state.WorkspaceChanged = this._workspaceChanged;
        state.WorkspaceClick = this._workspaceClick;
        state.WorkspaceClickArgs = this._workspaceClickArgs;
        state.RulerEnabled = this._rulerEnabled;
        state.RulerWidth = this._rulerWidth;
        state.RulerScale = this._rulerScale;
        state.RulerOffsetX = this._rulerOffsetX;
        state.RulerOffsetY = this._rulerOffsetY;
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Properties
    //--------------------------------------------------------------------------

    get_scrollingSize: function () {
        /// <value type="Sys.UI.Point">A scroll bar length.</value>
        /// <summary>Gets a scroll bar length (in other words, the right-bottom point of the image fragment which is out of the visible area).</summary>
        var holder = this.get_element();
        var w = holder.scrollWidth - holder.clientWidth;
        var h = holder.scrollHeight - holder.clientHeight;
        if (w < 0)
            w = 0;

        if (h < 0)
            h = 0;

        return new Sys.UI.Point(Math.round(w), Math.round(h));
    },

    get_contentCtx: function () {
        /// <value domElement="true" />
        /// <exclude />
        return this._contentCtx;
    },

    get_rubberbandCtx: function () {
        /// <value domElement="true" />
        /// <exclude />
        return this._rubberbandCtx;
    },

    get_navigatorCtx: function () {
        /// <value domElement="true" />
        /// <exclude />
        return this._navigatorCtx;
    },

    get_autoPostBack: function () {
        /// <value type="Boolean">The value which is <b>true</b> when a postback to the server automatically occurs whenever the user  navigates the content in the <see cref="T:J:Aurigma.GraphicsMill.BaseViewer" />, <b>false</b> otherwise.</value>
        /// <summary>Gets/sets a value indicating whether a postback to the server automatically occurs when the user zooms or scrolls the content.</summary>
        /// <remarks><para>If you want to disable automatic postback for certain events (e.g. <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.zoomed" />) and enable it for other ones (e.g. <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceClick" />), you can use the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.clientSideOptions" /> property. It exposes a boolean property for each event. </para><para>If <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.autoPostBack" /> is <b>true</b>, postback occurs regardless of values of properties of the <see cref="T:J:Aurigma.GraphicsMill.ViewerClientSideOptions" /> object returned by the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.clientSideOptions" /> property.</para><para>Default value is <b>false</b>.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.AutoPostBack">BaseViewer.AutoPostBack</see> server-side member.</para></remarks>
        return this._autoPostBack;
    },
    set_autoPostBack: function (v) {
        this._autoPostBack = v;
    },

    get_borderWidth: function () {
        /// <value type="Number" integer="true">The value which represents the width (in pixels) of the control border.</value>
        /// <summary>Gets the width (in pixels) of the control border.</summary>
        /// <remarks>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.BorderWidth">BaseViewer.BorderWidth</see> server-side member.</remarks>.
        return this._borderWidth;
    },

    get_clientSideOptions: function () {
        /// <value type="Aurigma.GraphicsMill.ViewerClientSideOptions"><see cref="T:J:Aurigma.GraphicsMill.ViewerClientSideOptions" /> class instance which provides an access to properties which configure automatic postback for individual events.</value>
        /// <summary>Gets values which configure automatic postback for individual events.</summary>
        /// <remarks><para>Automatic postback can be enabled for all events with the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.autoPostBack" /> property. However if you want to disable automatic postback for certain events (e.g. <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.zoomed" />) and enable it for the other ones (e.g. <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceClick" />), you can use this property. It exposes a boolean property for each event. </para><para>This property makes sense only if <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.autoPostBack" /> is <b>false</b>. If it is <b>true</b>, postback occurs regardless of values of properties of the <see cref="T:J:Aurigma.GraphicsMill.ViewerClientSideOptions" /> object.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ClientSideOptions">BaseViewer.ClientSideOptions</see> server-side member.</para></remarks>
        return this._clientSideOptions;
    },

    set_cursor: function (v, onBody) {
        /// <value type="Aurigma.GraphicsMill.Cursor" />
        this._contentCtx.style.cursor = Aurigma.GraphicsMill.Utils.cursorToCss(v);

        if (window != null) {
            v = onBody === true ? v : Aurigma.GraphicsMill.Cursor.defaultCursor;
            if (v === this._bodyCursor)
                return;

            window.document.querySelector("body").style.cursor = Aurigma.GraphicsMill.Utils.cursorToCss(v);
            this._bodyCursor = v;
        }
    },

    get_delayedRefreshTimeout: function () {
        /// <value type="Number" integer="true">The value which represents amount of milliseconds to wait before delayed refresh will be invoked.</value>
        /// <summary>Amount of milliseconds to wait before delayed refresh will be invoked.</summary>
        return this._delayedRefreshTimeout;
    },

    set_delayedRefreshTimeout: function (v) {
        this._delayedRefreshTimeout = v;
    },

    get_maxZoom: function () {
        /// <value type="Number">The number that specifies the maximum allowed zoom value.</value>
        /// <summary>Gets the maximum allowed zoom value.</summary>
        /// <remarks><para>Zoom values are measured in percents/100. It means that value = 1 specify 100% zoom (i.e. actual size), value = 10 means 1000% zoom (10x), value = 0,5 means 50% zoom (half), etc.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.MaxZoom">BaseViewer.MaxZoom</see> server-side member. </para></remarks>
        return this._maxZoom > 0 ? this._maxZoom : 2.5;
    },
    set_maxZoom: function (value) {
        this._maxZoom = value;
    },

    get_minZoom: function () {
        /// <value type="Number">The number that specifies the minimum allowed zoom value.</value>
        /// <summary>Gets the minimum allowed zoom value.</summary>
        /// <remarks><para>Zoom values are measured in percents/100. It means that value = 1 specify 100% zoom (i.e. actual size), value = 10 means 1000% zoom (10x), value = 0,5 means 50% zoom (half), etc. </para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.MinZoom">BaseViewer.MinZoom</see> server-side member. </para></remarks>
        return this._minZoom > 0 ? this._minZoom : 0.001;
    },
    set_minZoom: function (value) {
        this._minZoom = value;
    },

    get_navigator: function () {
        /// <value type="String">The value which contains an ID of the navigator control you need to attach.</value>
        /// <summary>Gets/sets the navigator control ID (i.e. value stored in the attribute <b>id</b> of the tag that inserts the control).</summary>
        /// <remarks><para>The following navigator controls are available:</para><list type="bullet"><item><term><see cref="T:J:Aurigma.GraphicsMill.ZoomInNavigator" /></term><description>left button clicks zoom the image in.</description></item><item><term><see cref="T:J:Aurigma.GraphicsMill.ZoomOutNavigator" /></term><description>left button clicks zoom the image out.</description></item><item><term><see cref="T:J:Aurigma.GraphicsMill.ZoomRectangleNavigator" /></term><description>user stretches the rectangle by mouse and when mouse button is released, it zooms selected rectangle in.</description></item><item><term><see cref="T:J:Aurigma.GraphicsMill.PanNavigator" /></term><description>when user presses the mouse button down and move the mouse, the image is panned until user releases the button.</description></item></list><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Navigator">BaseViewer.Navigator</see> server-side member.</para></remarks>
        return this._navigator;
    },
    set_navigator: function (v) {
        //Disconnect a navigator if any connected.
        var nid = this._navigator;
        var n = nid ? $find(nid) : null;
        if (n) n.disconnect();

        //Connect a new navigator
        if (v.get_id)
            v = v.get_id();
        this._navigator = v;
        if (v) {
            n = $find(v);
            if (n) {
                // A little hack.
                if (!this._initialized)
                    this.initialize();
                n.connect(this.get_element().id);
            }
        }

        //Update the rubberband
        var rid = this.get_rubberband();
        if (rid) {
            var r = $find(rid);

            if (r)
                r.update();
        }
    },

    get_rubberband: function () {
        /// <value type="String">The value which contains an ID of the rubberband control you need to attach.</value>
        /// <summary>Gets/sets the rubberband control ID (i.e. value stored in the attribute <b>id</b> of the tag that inserts the control).</summary>
        /// <remarks><para>Only the <see cref="T:J:Aurigma.GraphicsMill.RectangleRubberband" /> control is available.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Rubberband">BaseViewer.Rubberband</see> server-side member.</para></remarks>
        return this._rubberband;
    },

    set_rubberband: function (v) {
        //Disconnect a rubberband if any connected
        var rid = this._rubberband;
        var rubberband = rid ? $find(rid) : null;
        if (rubberband) {
            this._jHolderElement.css("-ms-touch-action", "pan-x pan-y");
            rubberband.disconnect();
        }

        //Connect a new rubberband
        if (v && v.get_id)
            v = v.get_id();
        this._rubberband = v;
        if (v) {
            rubberband = $find(v);
            if (rubberband) {
                // A little hack.
                if (!this._initialized)
                    this.initialize();

                //hack for touch devices
                if (Aurigma.GraphicsMill.Utils.Platform.IsTouchDevice())
                    rubberband.set_erasable(false);

                this._jHolderElement.css("-ms-touch-action", "none");
                rubberband.connect(this.get_element().id);
            }
        }
    },

    get_screenXDpi: function () {
        /// <value type="Number">The value representing horizontal resolution in DPI used to show content in the browser.</value>
        /// <summary>Gets a value representing horizontal resolution in DPI used to show content in the browser.</summary>
        /// <remarks><para>If the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" /> property is set to <b>true</b> the value of the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.screenXDpi" /> property is used to scale content width to its actual size. </para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ScreenXDpi">BaseViewer.ScreenXDpi</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BaseViewer.screenYDpi" />
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" />
        return this._screenXDpi;
    },

    get_screenYDpi: function () {
        /// <value type="Number">The value representing vertical resolution in DPI used to show content in the browser.</value>
        /// <summary>Gets a value representing vertical resolution in DPI used to show content in the browser.</summary>
        /// <remarks><para>If the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" /> property is set to <b>true</b> the value of the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.screenYDpi" /> property is used to scale content height to its actual size. </para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ScreenYDpi">BaseViewer.ScreenYDpi</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BaseViewer.screenXDpi" />
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" />
        return this._screenYDpi;
    },

    get_scrollBarsStyle: function () {
        /// <value type="Aurigma.GraphicsMill.ScrollBarsStyle">The <see cref="T:J:Aurigma.GraphicsMill.ScrollBarsStyle" /> enumeration member that specifies when to display scroll bars.</value>
        /// <summary>Gets a value that specifies whether to display scroll bars and whether to hide them automatically when the displayed content is less than the control size.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ScrollBarsStyle">BaseViewer.ScrollBarsStyle</see> server-side member.</para></remarks>
        return this._scrollBarsStyle;
    },

    get_scrollBarWidth: function () {
        /// <value type="Number" integer="true">The value that represents a scroll bar width (in pixels) in calculations.</value>
        /// <summary>Gets a value that represents a scroll bar width (in pixels) in calculations.</summary>
        /// <remarks><para>Since there is no simple way to determine the scroll bar width from the JavaScript (taking into account different platform, accessibility modes, etc) the estimated value is specified by this property.</para>
        /// <para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ScrollBarWidth">BaseViewer.ScrollBarWidth</see> server-side member.</para></remarks>
        return this._scrollBarWidth;
    },

    get_scrollingPosition: function () {
        /// <value type="Sys.UI.Point">The point that stores the position of the scroll bars.</value>
        /// <summary>Gets/sets the position of the scroll bars.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ScrollingPosition">BaseViewer.ScrollingPosition</see> server-side member.</para></remarks>
        this._scrollingPosition = this._getActualScrollPosition();
        return this._scrollingPosition.toPoint();
    },

    set_scrollingPosition: function (value) {
        var jHolder = this._jquery(this.get_element());

        jHolder.scrollLeft(value.x).scrollTop(value.y);

        var pt = this.get_scrollingPosition();
        this._scrollingPosition = new Aurigma.GraphicsMill.PointF(pt.x, pt.y);
        this._raiseEvent("scrolled");
    },

    get_viewportAlignment: function () {
        /// <value type="Aurigma.GraphicsMill.ViewportAlignment">The <see cref="T:J:Aurigma.GraphicsMill.ViewportAlignment" /> enumeration member that specifies content alignment in the control.</value>
        /// <summary>Gets/sets a value that specifies content alignment in the control.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ViewportAlignment">BaseViewer.ViewportAlignment</see> server-side member.</para></remarks>
        return this._viewportAlignment;
    },
    set_viewportAlignment: function (v) {
        this._viewportAlignment = v;
        this._updateViewportAlignment();
        this._drawRulers();
        this._updateRulersStyle();
    },

    get_zoom: function () {
        /// <value type="Number">The number that specifies the current zoom value.</value>
        /// <summary>Gets/sets the current zoom value.</summary>
        /// <remarks><para>Zoom values are measured in percents/100. It means that value = 1 specifies 100% zoom (i.e. actual size), value = 10 means 1000% zoom (10x), value = 0.5 means 50% zoom (half), etc.</para><note>If automatic zoom mode is used (i.e. <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoomMode" /> property is not <see cref="F:J:Aurigma.GraphicsMill.ZoomMode.none" />) the value of this property will be ignored.</note><para>Default value is 1.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Zoom">BaseViewer.Zoom</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoomMode" />
        return this._zoom;
    },
    set_zoom: function (zoom, params) {
        var zoomCenterX, zoomCenterY;

        if (!params) {
            var pageCoords = this._getElementPageCoord(this.get_element());

            var rulerWidth = this.get_rulerEnabled() ? this._rulerWidth : 0;

            var viewportWidth = this._holderBounds.width - rulerWidth,
                viewportHeight = this._holderBounds.height - rulerWidth;

            zoomCenterX = Math.round(pageCoords.left + rulerWidth + viewportWidth / 2);
            zoomCenterY = Math.round(pageCoords.top + rulerWidth + viewportHeight / 2);
        }
        else if (params.skipZoomToCenter) {
            this._setZoom(zoom);

            return;
        }
        else {
            zoomCenterX = params.centerPageX;
            zoomCenterY = params.centerPageY;
        }

        this._zoomToPagePoint(zoom, zoomCenterX, zoomCenterY);
    },

    _setZoom: function (value) {
        if (this._zoom == value && (this._zoomMode == Aurigma.GraphicsMill.ZoomMode.zoomControl || this._zoomMode == Aurigma.GraphicsMill.ZoomMode.none))
            return;

        this._zoom = Math.min(Math.max(value, this.get_minZoom()), this.get_maxZoom());

        if (this._zoomMode != Aurigma.GraphicsMill.ZoomMode.zoomControl)
            this._zoomMode = Aurigma.GraphicsMill.ZoomMode.none;

        this._updateViewport();
    },

    get_pinchZoomEnabled: function () {
        return this._pinchZoomEnabled;
    },

    set_pinchZoomEnabled: function (v) {
        this._pinchZoomEnabled = v;
    },

    get_rulerEnabled: function () {
        /// <summary>Gets or sets a value indicating whether to show the ruler.</summary>
        /// <value type="Boolean"><strong>true</strong> if the ruler is shown; otherwise <strong>false</strong>.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.RulerEnabled">BaseViewer.RulerEnabled</see> server-side member.</para></remarks>
        return this._rulerEnabled;
    },
    set_rulerEnabled: function (v) {
        var displayStatus = v ? "block" : "none";
        this._rulers.fullLeftRuller.style.display = displayStatus;
        this._rulers.fullTopRuller.style.display = displayStatus;
        this._rulers.leftRuller.style.display = displayStatus;
        this._rulers.topRuller.style.display = displayStatus;
        this._rulers.whiteRect.style.display = displayStatus;
        this._rulerEnabled = v;
        this.set_zoomMode(this.get_zoomMode());
    },

    get_rulerScale: function () {
        /// <summary>Gets or sets the ruler scale.</summary>
        /// <value type="Number">The the ruler scale.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.RulerScale">BaseViewer.RulerScale</see> server-side member.</para></remarks>
        return this._rulerScale;
    },
    set_rulerScale: function (v) {
        if (v <= 0) throw new Error('Ruler scale should be greater 0.');
        this._rulerScale = v;
        this._updateViewport();
    },

    get_rulerOffsetX: function () {
        /// <summary>Gets or sets the ruler offset on x-axis.</summary>
        /// <value type="Number">The the ruler offset.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.RulerOffsetX">BaseViewer.RulerOffsetX</see> server-side member.</para></remarks>
        return this._rulerOffsetX;
    },
    set_rulerOffsetX: function (v) {
        this._rulerOffsetX = v;
        this._updateViewport();
    },

    get_rulerOffsetY: function () {
        /// <summary>Gets or sets the ruler offset on y-axis.</summary>
        /// <value type="Number">The the ruler offset.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.RulerOffsetY">BaseViewer.RulerOffsetY</see> server-side member.</para></remarks>
        return this._rulerOffsetY;
    },
    set_rulerOffsetY: function (v) {
        this._rulerOffsetY = v;
        this._updateViewport();
    },

    get_rulerWidth: function () {
        /// <summary>Gets or sets the ruler width.</summary>
        /// <value type="Number">The the ruler width.</value>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.RulerWidth">BaseViewer.RulerWidth</see> server-side member.</para></remarks>
        return this._rulerWidth;
    },
    set_rulerWidth: function (v) {
        this._rulerWidth = v;
        this._updateViewport();
    },

    get_zoomMode: function () {
        /// <value type="Aurigma.GraphicsMill.ZoomMode"><see cref="T:J:Aurigma.GraphicsMill.ZoomMode" /> enumeration member that specifies the zooming behavior.</value>
        /// <summary>Gets/sets a value that specifies content zoom mode of the control (automatic or manual).</summary>
        /// <remarks><para>In manual zoom mode (i.e. if the value of this property is <see cref="F:J:Aurigma.GraphicsMill.ZoomMode.none" />) user can change the content zoom either by <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoom" /> property or using some zooming <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator">navigator</see>.</para><para>If automatic zoom (except <see cref="F:J:Aurigma.GraphicsMill.ZoomMode.zoomControl" />) mode is used and you attempt to change <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoom" /> value manually, <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoomMode" /> property will be set to <see cref="F:J:Aurigma.GraphicsMill.ZoomMode.none" />.</para><note>When you set some zooming navigator into the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator" /> property, this property is reset to <see cref="F:J:Aurigma.GraphicsMill.ZoomMode.none" />.</note><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ZoomMode">BaseViewer.ZoomMode</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoom" />
        return this._zoomMode;
    },
    set_zoomMode: function (v) {
        this._zoomMode = v;

        this._updateViewport();
    },

    get_bestFitWhiteSpacePc: function () {
        /// <summary>Gets or sets white space between content maximal demention and canvas</summary>
        /// <value type="Number">white space in percent (from 1 to 99)</value>
        return this._bestFitWhiteSpacePc * 100;
    },

    set_bestFitWhiteSpacePc: function (v) {
        if ((typeof v == "number" && !isNaN(v)) && v >= 0 && v < 99)
            this._bestFitWhiteSpacePc = v / 100;

        this.set_zoomMode(this.get_zoomMode());
    },

    get_zoomQuality: function () {
        /// <value type="Aurigma.GraphicsMill.ZoomQuality"><see cref="T:J:Aurigma.GraphicsMill.ZoomQuality" /> enumeration member which specifies which resize algorithm to use.</value>
        /// <summary>Gets a value that specifies a zoom quality.</summary>
        /// <remarks><para>The content can be zoomed with different quality (<see cref="F:J:Aurigma.GraphicsMill.ZoomQuality.high" />, <see cref="F:J:Aurigma.GraphicsMill.ZoomQuality.medium" />, <see cref="F:J:Aurigma.GraphicsMill.ZoomQuality.low" /> and <see cref="F:J:Aurigma.GraphicsMill.ZoomQuality.shrinkHighStretchLow" />). If it is zoomed with low quality, the performance is higher, and vice versa.</para></remarks>
        return this._zoomQuality;
    },

    get_status: function () {
        /// <value type="Aurigma.GraphicsMill.UpdateStatus">The value which represents current status of Viewer control.</value>
        /// <summary>Gets a current Viewer status.</summary>
        /// <remarks><para>It can be one of the following values:</para><list type="bullet"><item><term><see cref="F:J:Aurigma.GraphicsMill.UpdateStatus.ready" /></term><description> The remote scripting method has been completed (or was not run yet), and you can freely get return value or exception details.</description></item><item><term><see cref="F:J:Aurigma.GraphicsMill.UpdateStatus.busy" /></term><description> The remote scripting method is running (the viewer state is changing).</description></item><item><term><see cref="F:J:Aurigma.GraphicsMill.UpdateStatus.refresh" /></term><description> The control updates a portion of content it displays (e.g. when user zoomed or scrolled it).</description></item></list></remarks>
        return this._status;
    },

    get_exceptionDescription: function () {
        /// <value type="String">The value which represents description of exception which was thrown during calling remote scripting method.</value>
        /// <summary>When a remote scripting method fails, this method returns the exception description.</summary>
        /// <remarks><para>If the method succeeded, empty string returned.</para><para>To determine when the remote method is completed, use <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.statusChanged" /> event.</para></remarks>
        return this._exceptionDescription;
    },

    get_returnValue: function () {
        /// <value>The value returned by remote scripting method.</value>
        /// <summary>When a remote scripting method is completed, this method returns its return value.</summary>
        /// <remarks><para>To determine when the remote method is completed, use <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.statusChanged" /> event.</para></remarks>
        return this._returnValue;
    },
    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    calculateZoomByZoomMode: function (zoomMode) {
        //Workspace width/height
        var cw = this.get_workspaceWidth() * this.get_screenXDpi() / 72;
        var ch = this.get_workspaceHeight() * this.get_screenYDpi() / 72;

        var rw = this.get_rulerEnabled() ? this.get_rulerWidth() : 0;

        var bounds = this._holderBounds;
        var viewPortTotalRectangle = { width: bounds.offsetWidth - rw, height: bounds.offsetHeight - rw };

        //Content width/height
        var scw = cw;
        var sch = ch;

        //The horizontal zoom without the scroll bars
        var hzwsb = viewPortTotalRectangle.width / scw;
        //The vertical zoom without the scroll bars
        var vzwsb = viewPortTotalRectangle.height / sch;

        //Scroll bar width
        var s = this.get_scrollBarWidth();

        //The horizontal zoom with the scroll bars
        var hz = (viewPortTotalRectangle.width - s) / scw;
        //The vertical zoom with the scroll bars
        var vz = (viewPortTotalRectangle.height - s) / sch;

        var sbAlways = (this._scrollBarsStyle == Aurigma.GraphicsMill.ScrollBarsStyle.always);

        //Zoom
        var zoom = this.get_zoom();
        switch (zoomMode) {
            case Aurigma.GraphicsMill.ZoomMode.bestFit:
                if (this._bestFitWhiteSpacePc > 0) {
                    hzwsb = (viewPortTotalRectangle.width - (viewPortTotalRectangle.width * this._bestFitWhiteSpacePc)) / scw;
                    vzwsb = (viewPortTotalRectangle.height - (viewPortTotalRectangle.height * this._bestFitWhiteSpacePc)) / sch;

                    hz = (viewPortTotalRectangle.width - s - (viewPortTotalRectangle.width - s) * this._bestFitWhiteSpacePc) / scw;
                    vz = (viewPortTotalRectangle.height - s - (viewPortTotalRectangle.height - s) * this._bestFitWhiteSpacePc) / sch;
                }
                zoom = sbAlways ? Math.min(hz, vz) : Math.min(hzwsb, vzwsb);
                break;
            case Aurigma.GraphicsMill.ZoomMode.bestFitShrinkOnly:
                zoom = sbAlways ? Math.min(hz, vz) : Math.min(hzwsb, vzwsb);
                zoom = Math.min(1, zoom);
                break;
            case Aurigma.GraphicsMill.ZoomMode.fitToHeight:
                if (sbAlways)
                    zoom = vz;
                else
                    zoom = (Math.round(vzwsb * scw) <= viewPortTotalRectangle.width) ? vzwsb : vz;
                break;
            case Aurigma.GraphicsMill.ZoomMode.fitToHeightShrinkOnly:
                if (sbAlways)
                    zoom = Math.min(1, vz);
                else {
                    // We should use Math.min here instead of using it later.
                    // For example, if we have vzwsb a little more than 1 and vz a little less.
                    // With Math.min we get 1as result, without - vz;
                    zoom = (Math.round(Math.min(1, vzwsb) * scw) <= viewPortTotalRectangle.width) ? Math.min(1, vzwsb) : Math.min(1, vz);
                }
                break;
            case Aurigma.GraphicsMill.ZoomMode.fitToWidth:
                if (sbAlways)
                    zoom = hz;
                else
                    zoom = (Math.round(hzwsb * sch) <= viewPortTotalRectangle.height) ? hzwsb : hz;
                break;
            case Aurigma.GraphicsMill.ZoomMode.fitToWidthShrinkOnly:
                if (sbAlways)
                    zoom = Math.min(1, hz);
                else
                    zoom = (Math.round(Math.min(1, hzwsb) * sch) <= viewPortTotalRectangle.height) ? Math.min(1, hzwsb) : Math.min(1, hz);

                break;
        }
        return Math.min(Math.max(zoom, this._minZoom), this._maxZoom);
    },

    clearRenderCtx: function (ctx) {
        /// <param name="ctx" domElement="true" />
        /// <exclude />
        while (ctx.childNodes.length > 0)
            ctx.removeChild(ctx.childNodes[0]);
    },

    workspaceToContentPoint: function (point) {
        return this.controlToContentPoint(this.workspaceToControlPoint(point));
    },

    controlToContentPoint: function (point) {
        /// <param name="point" type="Sys.UI.Point"></param>
        /// <returns type="Sys.UI.Point"></returns>
        /// <exclude />
        var vl = this._getViewportLocation();
        var sp = this._getActualScrollPosition();

        var pt = new Aurigma.GraphicsMill.PointF(0, 0);

        pt.x = point.x - vl.x + sp.x;
        pt.y = point.y - vl.y + sp.y;

        return pt.round();
    },

    controlToPagePoint: function (point) {
        /// <param name="point" type="Sys.UI.Point"></param>
        /// <returns type="Sys.UI.Point"></returns>
        /// <exclude />
        var pageCoords = this._getElementPageCoord(this.get_element());

        var pageX = point.x + pageCoords.left;
        var pageY = point.y + pageCoords.top;

        return new Sys.UI.Point(Math.round(pageX), Math.round(pageY));
    },

    contentToControlPoint: function (point) {
        /// <param name="point" type="Sys.UI.Point"></param>
        /// <returns type="Sys.UI.Point"></returns>
        /// <exclude />
        var vl = this._getViewportLocation();
        var sp = this._getActualScrollPosition();

        var pt = new Aurigma.GraphicsMill.PointF(0, 0);

        pt.x = point.x + vl.x - sp.x;
        pt.y = point.y + vl.y - sp.y;

        return pt.round();
    },

    controlToContentRectangle: function (rect) {
        /// <param name="rect" type="Aurigma.GraphicsMill.Rectangle"></param>
        /// <returns type="Aurigma.GraphicsMill.Rectangle"></returns>
        /// <exclude />
        var pt1 = new Aurigma.GraphicsMill.PointF(rect.x, rect.y);
        var pt2 = new Aurigma.GraphicsMill.PointF(rect.x + rect.width, rect.y + rect.height);
        pt1 = this.controlToContentPoint(pt1);
        pt2 = this.controlToContentPoint(pt2);
        return new Aurigma.GraphicsMill.Rectangle(pt1.x, pt1.y, pt2.x - pt1.x, pt2.y - pt1.y);
    },

    contentToControlRectangle: function (rect) {
        /// <param name="rect" type="Aurigma.GraphicsMill.Rectangle"></param>
        /// <returns type="Aurigma.GraphicsMill.Rectangle"></returns>
        /// <exclude />
        var pt1 = new Aurigma.GraphicsMill.PointF(rect.x, rect.y);
        var pt2 = new Aurigma.GraphicsMill.PointF(rect.x + rect.width, rect.y + rect.height);
        pt1 = this.contentToControlPoint(pt1);
        pt2 = this.contentToControlPoint(pt2);
        return new Aurigma.GraphicsMill.Rectangle(pt1.x, pt1.y, pt2.x - pt1.x, pt2.y - pt1.y);
    },

    workspaceToControlPoint: function (point) {
        /// <summary>Translates coordinates from the workspace-related coordinate system to the control-related one.</summary>
        /// <param name="point" type="Sys.UI.Point">Coordinates in the workspace coordinate system.</param>
        /// <returns type="Aurigma.GraphicsMill.PointF">Coordinates in the control coordinate system.</returns>
        /// <remarks><para>The <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> allows to handle two coordinate systems: workspace-related and control-related and provides the <see cref="M:J:Aurigma.GraphicsMill.BaseViewer.workspaceToControlPoint" /> method to translate the point from the workspace-related coordinate system to the control-related one.</para><para>The workspace-related coordinate system represents logical coordinates of the image loaded in the control and allows to work with it regardless of zoom, scroll or alignment. The control-related one is used to measure parameters of standard control events (e.g. position of the mouse pointer).</para><para>This method corresponds to <see cref="M:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.WorkspaceToControl(System.Drawing.PointF)">BaseViewer.WorkspaceToControl(System.Drawing.PointF)</see> server-side member.</para></remarks>
        /// <seealso cref="M:J:Aurigma.GraphicsMill.BaseViewer.controlToWorkspacePoint" />
        var z = this.get_zoom();
        var pt = new Sys.UI.Point(Math.round(point.x * z * this._screenXDpi / 72), Math.round(point.y * z * this._screenYDpi / 72));
        return this.contentToControlPoint(pt).toPoint();
    },

    controlToWorkspacePoint: function (point) {
        /// <summary>Translates coordinates from the control-related coordinate system to the workspace-related one.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.PointF">Coordinates in the control coordinate system.</param>
        /// <returns type="Sys.UI.Point">Coordinates in the workspace coordinate system.</returns>
        /// <remarks><para>The <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> allows to handle two coordinate systems: workspace-related and control-related and provides the <see cref="M:J:Aurigma.GraphicsMill.BaseViewer.controlToWorkspacePoint" /> method to translate the point from the control-related coordinate system to the workspace-related one.</para><para>The workspace-related coordinate system represents logical coordinates of the image loaded in the control and allows to work with it regardless of zoom, scroll or alignment. The control-related one is used to measure parameters of standard control events (e.g. position of the mouse pointer).</para><para>This method corresponds to <see cref="M:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ControlToWorkspace(System.Drawing.PointF)">BaseViewer.ControlToWorkspace(System.Drawing.PointF)</see> server-side member.</para></remarks>
        /// <seealso cref="M:J:Aurigma.GraphicsMill.BaseViewer.workspaceToControlPoint" />
        var z = this.get_zoom();
        var pt = this.controlToContentPoint(point);
        return new Aurigma.GraphicsMill.PointF(pt.x / (z * this._screenXDpi / 72), pt.y / (z * this._screenYDpi / 72));
    },

    workspaceToControlRectangle: function (rect) {
        /// <summary>Translates rectangle coordinates from the workspace-related coordinate system to the control-related one.</summary>
        /// <param name="rect" type="Aurigma.GraphicsMill.Rectangle">Rectangle coordinates in the workspace coordinate system.</param>
        /// <returns type="Aurigma.GraphicsMill.Rectangle">Rectangle coordinates in the control coordinate system.</returns>
        /// <remarks><para>The <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> allows to handle two coordinate systems: workspace-related and control-related and provides the <see cref="M:J:Aurigma.GraphicsMill.BaseViewer.workspaceToControlRectangle" /> method to translate the rectangle from the workspace-related coordinate system to the control-related one.</para><para>The workspace-related coordinate system represents logical coordinates of the image loaded in the control and allows to work with it regardless of zoom, scroll or alignment. The control-related one is used to measure parameters of standard control events (e.g. position of the mouse pointer).</para><para>This method corresponds to <see cref="M:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.WorkspaceToControl(System.Drawing.RectangleF)">BaseViewer.WorkspaceToControl(System.Drawing.RectangleF)</see> server-side member.</para></remarks>
        /// <seealso cref="M:J:Aurigma.GraphicsMill.BaseViewer.controlToWorkspaceRectangle" />
        var z = this.get_zoom();
        var hs = this._screenXDpi / 72 * z;
        var vs = this._screenYDpi / 72 * z;
        var newRect = new Aurigma.GraphicsMill.Rectangle(Math.round(rect.x * hs), Math.round(rect.y * vs), Math.round(rect.width * hs), Math.round(rect.height * vs));
        return this.contentToControlRectangle(newRect);
    },

    pageToControlPoint: function (pageX, pageY) {
        /// <summary>Translates coordinates from the page-related coordinate system to the control-related one.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.PointF">Coordinates in the page coordinate system.</param>
        /// <returns type="Sys.UI.Point">Coordinates in the workspace coordinate system.</returns>

        var pageCoords = this._getElementPageCoord(this.get_element());

        var holderX = pageX - pageCoords.left;
        var holderY = pageY - pageCoords.top;

        return new Sys.UI.Point(Math.round(holderX), Math.round(holderY));
    },

    pageToWorkspacePoint: function (pageX, pageY) {
        /// <summary>Translates coordinates from the page-related coordinate system to the workspace-related one.</summary>
        /// <param name="point" type="Aurigma.GraphicsMill.PointF">Coordinates in the page coordinate system.</param>
        /// <returns type="Sys.UI.Point">Coordinates in the workspace coordinate system.</returns>

        return this.controlToWorkspacePoint(this.pageToControlPoint(pageX, pageY));
    },

    controlToWorkspaceRectangle: function (rect) {
        /// <summary>Translates rectangle coordinates from the control-related coordinate system to the workspace-related one.</summary>
        /// <param name="rect" type="Aurigma.GraphicsMill.Rectangle">Rectangle coordinates in the control coordinate system.</param>
        /// <returns type="Aurigma.GraphicsMill.Rectangle">Rectangle coordinates in the workspace coordinate system.</returns>
        /// <remarks><para>The <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> allows to handle two coordinate systems: workspace-related and control-related and provides the <see cref="M:J:Aurigma.GraphicsMill.BaseViewer.controlToWorkspaceRectangle" /> method to translate the rectangle from the control-related coordinate system to the workspace-related one.</para><para>The workspace-related coordinate system represents logical coordinates of the image loaded in the control and allows to work with it regardless of zoom, scroll or alignment. The control-related one is used to measure parameters of standard control events (e.g. position of the mouse pointer).</para><para>This method corresponds to <see cref="M:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.ControlToWorkspace(System.Drawing.RectangleF)">BaseViewer.ControlToWorkspace(System.Drawing.RectangleF)</see> server-side member.</para></remarks>
        /// <seealso cref="M:J:Aurigma.GraphicsMill.BaseViewer.workspaceToControlRectangle" />
        var z = this.get_zoom();
        var hs = 1 / (z * this._screenXDpi / 72);
        var vs = 1 / (z * this._screenYDpi / 72);
        var newRect = this.controlToContentRectangle(rect);
        return new Aurigma.GraphicsMill.Rectangle(newRect.x * hs, newRect.y * vs, newRect.width * hs, newRect.height * vs);
    },

    invokeRemoteMethod: function (name, args) {
        /// <param name="name" type="String">The name of the remote method which should be run on the server.</param>
        /// <param name="args" type="Array" mayBeNull="true">The array of arguments. The first element of the array is passed into the first argument, the second element - into the second one, etc. Number of array items should be the same as a number of arguments.</param>
        /// <returns type="Boolean">The <see cref="T:J:Boolean" /> value which specifies whether the method was run successfully.</returns>
        /// <summary>Runs the specified remote method on the server.</summary>
        if (this._status == Aurigma.GraphicsMill.UpdateStatus.busy)
            return false;

        this._status = (name == "__Refresh") ? Aurigma.GraphicsMill.UpdateStatus.refresh : Aurigma.GraphicsMill.UpdateStatus.busy;

        this._raiseEvent("statusChanged");

        this._callbackContext++;

        this._activeAjax++;

        this._callbackArgs = Sys.Serialization.JavaScriptSerializer.serialize(
            [name, args]);

        // A little HACK :)
        // We call not documented function from ASP.NET.
        this._raiseInvokingCallbackRequest();
        this._saveState();
        __theFormPostData = "";
        __theFormPostCollection = new Array();
        WebForm_InitCallback();
        this._callback();

        return true;
    },

    abort: function () {
        /// <summary>Cancels all remote methods.</summary>
        if (this._status == Aurigma.GraphicsMill.UpdateStatus.busy) {
            this._callbackContext++;
            this._exceptionDescription = Aurigma.GraphicsMill.UpdateStatus.ready;
            this._status = Aurigma.GraphicsMill.UpdateStatus.ready;
        }
    },

    dispose: function () {
        /// <summary>Releases all resources.</summary>
        /// <remarks>This method corresponds to <see cref="M:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Dispose" /> server-side member.</remarks>
        this._disposeRulers();
        Sys.Application.removeComponent(this);
    },

    delayedRefresh: function () {
        /// <summary>Indicates that the control needs to be refreshed. The actual refreshing is applied when the user does not update the control state (such as scroll position, zoom value) in one second.</summary>
        if (this._refreshTimer)
            window.clearTimeout(this._refreshTimer);

        var onTimeout = Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, function () {
            
            this._refreshTimer = null;

            this.refresh();
        });

        this._refreshTimer = window.setTimeout(onTimeout, this._delayedRefreshTimeout);
    },

    refresh: function () {
        /// <summary>Refreshes the control immediately.</summary>
        if (this._status == Aurigma.GraphicsMill.UpdateStatus.busy)
            this._needToRefresh = true;
        else {
            this._needToRefresh = false;
            this._refresh();
        }
    },

    //--------------------------------------------------------------------------
    //Events
    //--------------------------------------------------------------------------

    _raiseInvokingCallbackRequest: function () {
        var handler = this.get_events().getHandler("invokingCallbackRequest");
        if (handler) handler(this);
    },

    add_onResize: function (h) {
        this.get_events().addHandler("onresize", h);
    },
    remove_onResize: function (h) {
        this.get_events().removeHandler("onresize", h);
    },

    add_invokingCallbackRequest: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Occurs before the callback is initiated by this control.</summary>
        this.get_events().addHandler("invokingCallbackRequest", h);
    },
    remove_invokingCallbackRequest: function (h) {
        this.get_events().removeHandler("invokingCallbackRequest", h);
    },

    add_workspaceChanged: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Occurs when the content of the associated workspace is replaced.</summary>
        /// <remarks><para>This event corresponds to <see cref="E:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.WorkspaceChanged">BaseViewer.WorkspaceChanged</see> server-side member.</para></remarks>
        this.get_events().addHandler("workspaceChanged", h);
    },
    remove_workspaceChanged: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("workspaceChanged", h);
    },

    add_scrolled: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when scroll position of the control is changed.</summary>
        /// <remarks><para>This event corresponds to <see cref="E:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Scrolled">BaseViewer.Scrolled</see> server-side member.</para></remarks>
        this.get_events().addHandler("scrolled", h);
    },
    remove_scrolled: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("scrolled", h);
    },

    add_statusChanged: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when status (see <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.status" /> property) is updated. </summary>
        /// <remarks><para>Using this method you can determine when the remote scripting method was stopped. To do it, this event handler should analyze the value returned with the <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.status"/> property. If it is <see cref="F:J:Aurigma.GraphicsMill.UpdateStatus.ready" />, the remote method has been completed. If it is <see cref="F:J:Aurigma.GraphicsMill.UpdateStatus.busy"/>, the remote method has been started. If it is <see cref="F:J:Aurigma.GraphicsMill.UpdateStatus.refresh"/>, the bitmap is not modified, but the control is downloading a portion of the image (e.g. when user zoomed or scrolled content).</para></remarks>
        this.get_events().addHandler("statusChanged", h);
    },
    remove_statusChanged: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("statusChanged", h);
    },

    add_pinchStart: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the content is start zooming by pinch gesture.</summary>
        this.get_events().addHandler("pinchStart", h);
    },
    remove_pinchStart: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("pinchStart", h);
    },

    add_pinchStop: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the content zooming by pinch gesture.</summary>
        this.get_events().addHandler("pinchStop", h);
    },
    remove_pinchStop: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("pinchStop", h);
    },

    add_zoomed: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the content is zoomed in the control.</summary>
        /// <remarks><para>This event corresponds to <see cref="E:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.Zoomed">BaseViewer.Zoomed</see> server-side member.</para></remarks>
        this.get_events().addHandler("zoomed", h);
    },
    remove_zoomed: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("zoomed", h);
    },

    add_click: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the control is clicked.</summary>
        this.get_events().addHandler("click", h);
    },
    remove_click: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("click", h);
    },

    add_mouseDown: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the user clicks the control with either mouse button. </summary>
        this.get_events().addHandler("mouseDown", h);
    },
    remove_mouseDown: function (h, d) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("mouseDown", h);
    },

    add_mouseMove: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the user moves the mouse over the control.</summary>
        this.get_events().addHandler("mouseMove", h);
    },
    remove_mouseMove: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("mouseMove", h);
    },

    add_mouseUp: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the user releases a mouse button while the mouse is over the control.</summary>
        this.get_events().addHandler("mouseUp", h);
    },
    remove_mouseUp: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("mouseUp", h);
    },

    add_workspaceClick: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the content displayed in the control is clicked.</summary>
        /// <remarks><para>Position of the mouse pointer is measured in the coordinates of the workspace and can be used to determine a point of the content selected by mouse click.</para><para>This event corresponds to <see cref="E:Aurigma.Aurigma.GraphicsMill.AjaxControls.BaseViewer.WorkspaceClick">BaseViewer.WorkspaceClick</see> server-side member.</para></remarks>
        this.get_events().addHandler("workspaceClick", h);
    },
    remove_workspaceClick: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("workspaceClick", h);
    },

    add_workspaceDoubleClick: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Occurs when a mouse button is double clicked in the content displayed by this viewer control.</summary>
        /// <remarks>Position of the mouse pointer is measured in the coordinates of the workspace and can be used to determine a point of the content selected by mouse click.</remarks>
        this.get_events().addHandler("workspaceDoubleClick", h);
    },

    remove_workspaceDoubleClick: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("workspaceDoubleClick", h);
    },

    add_workspaceMouseDown: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Occurs when a mouse button is clicked in the content displayed by this viewer control.</summary>
        /// <remarks>Position of the mouse pointer is measured in the coordinates of the workspace and can be used to determine a point of the content selected by mouse click.</remarks>
        this.get_events().addHandler("workspaceMouseDown", h);
    },
    remove_workspaceMouseDown: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("workspaceMouseDown", h);
    },

    add_workspaceMouseMove: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the user moves the mouse over the content of control.</summary>
        this.get_events().addHandler("workspaceMouseMove", h);
    },

    remove_workspaceMouseMove: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("workspaceMouseMove", h);
    },

    add_workspaceMouseUp: function (h) {
        /// <param name="h" type="Function" />
        /// <summary>Fires when the user releases a mouse button while the mouse is over the content of control.</summary>
        this.get_events().addHandler("workspaceMouseUp", h);
    },
    remove_workspaceMouseUp: function (h) {
        /// <param name="h" type="Function" />
        this.get_events().removeHandler("workspaceMouseUp", h);
    }
};
Aurigma.GraphicsMill.BaseViewer.registerClass("Aurigma.GraphicsMill.BaseViewer", Sys.UI.Control, Sys.IDisposable);

// WORKAROUND for ASP.NET 2.0 client script bug.
// To allow ClientCallback into OnComplete function of another ClientCallback following code was applied.
// This code is used into invokeRemoteMethod of BaseViewer.
// More details: http://forums.microsoft.com/MSDN/ShowPost.aspx?PostID=705049&SiteID=1

Sys.Application.add_load(function (e, t) {
    if (t.get_isPartialLoad()) return;
    WebForm_CallbackComplete = function () {
        // SyncFix: the original version uses "i" as global thereby resulting in javascript errors when "i" is used elsewhere in consuming pages
        for (var i = 0; i < __pendingCallbacks.length; i++) {
            callbackObject = __pendingCallbacks[i];
            if (callbackObject && callbackObject.xmlRequest && (callbackObject.xmlRequest.readyState == 4)) {
                // the callback should be executed after releasing all resources
                // associated with this request.
                // Originally if the callback gets executed here and the callback
                // routine makes another ASP.NET ajax request then the pending slots and
                // pending callbacks array gets messed up since the slot is not released
                // before the next ASP.NET request comes.
                // FIX: This statement has been moved below
                // WebForm_ExecuteCallback(callbackObject);
                if (!__pendingCallbacks[i].async) __synchronousCallBackIndex = -1;
                __pendingCallbacks[i] = null;

                var callbackFrameID = "__CALLBACKFRAME" + i;
                var xmlRequestFrame = document.getElementById(callbackFrameID);
                if (xmlRequestFrame) xmlRequestFrame.parentNode.removeChild(xmlRequestFrame);

                // SyncFix: the following statement has been moved down from above;
                WebForm_ExecuteCallback(callbackObject);
            }
        }
    };
});

if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();