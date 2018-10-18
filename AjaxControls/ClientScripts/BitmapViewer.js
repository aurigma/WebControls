// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

Type.registerNamespace("Aurigma.GraphicsMill");

Aurigma.GraphicsMill.ImageLoadMode = function () {
    /// <summary>Specifies possible image loading modes for the BitmapViewer (class <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> and its descendants).</summary>
    /// <field name="entire" type="Number" integer="true" static="true"><summary>The whole image is loaded.</summary></field>
    /// <field name="adaptiveTile" type="Number" integer="true" static="true"><summary>Adaptive loading algorithm is used. It determines which parts of image should be loaded and loads corresponding tiles.</summary></field>
    /// <field name="regularTile" type="Number" integer="true" static="true"><summary>The image is cut into tiles of predefined size. And only visible tiles are loaded to the client browser.</summary></field>
    throw Error.notImplemented();
};
Aurigma.GraphicsMill.ImageLoadMode.prototype = {
    entire: 0,
    adaptiveTile: 1,
    regularTile: 2
};
Aurigma.GraphicsMill.ImageLoadMode.registerEnum("Aurigma.GraphicsMill.ImageLoadMode");

Aurigma.GraphicsMill.Bitmap = function (bitmapViewer) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.Aurigma.GraphicsMill.Bitmap" /> server-side object and gives an opportunity to get values of its primary properties in JavaScript.</summary>
    /// <seealso cref="T:Aurigma.Aurigma.GraphicsMill.Bitmap" />
    /// <constructor><exclude /></constructor>
    this._bv = bitmapViewer;
};
Aurigma.GraphicsMill.Bitmap.prototype = {
    get_bitsPerPixel: function () {
        /// <value type="Number" integer="true">The value which represents the number of bits per pixel.</value>
        /// <summary>Gets the number of bits per pixel.</summary>
        return (this.get_pixelFormat() & 0x0000FF00) >> 8;
    },

    get_colorSpace: function () {
        /// <value type="Aurigma.GraphicsMill.ColorSpace">The <see cref="T:J:Aurigma.GraphicsMill.ColorSpace" /> enumeration member that specifies color space of the current bitmap.</value>
        /// <summary>Gets a value which specifies color space of the current bitmap.</summary>
        if (this.get_isRgb()) {
            return Aurigma.GraphicsMill.ColorSpace.rgb;
        }
        else
            if (this.get_isCmyk()) {
                return Aurigma.GraphicsMill.ColorSpace.cmyk;
            }
            else
                if (this.get_isGrayScale()) {
                    return Aurigma.GraphicsMill.ColorSpace.grayScale;
                }
                else {
                    return Aurigma.GraphicsMill.ColorSpace.unknown;
                }
    },

    get_hasAlpha: function () {
        /// <value type="Boolean">The value which specifies whether current pixel format supports alpha channel or not.</value>
        /// <summary>Gets a value indicating if current pixel format supports alpha channel (information about opacity of pixels).</summary>
        return ((this.get_pixelFormat() & 0x40000) == 0x40000) || ((this.get_pixelFormat() & 0x80000) == 0x80000);
    },

    get_height: function () {
        /// <value type="Number" integer="true">The value which specifies current bitmap height in pixels.</value>
        /// <summary>Gets current bitmap height in pixels.</summary>
        return this._bv._bitmap$height;
    },

    get_horizontalResolution: function () {
        /// <value type="Number">The value which represents horizontal resolution of the bitmap in DPI.</value>
        /// <summary>Gets horizontal resolution of the bitmap in DPI.</summary>
        return this._bv._bitmap$horizontalResolution;
    },

    get_isCmyk: function () {
        /// <value type="Boolean">The value which specifies whether color space of current bitmap is CMYK or not.</value>
        /// <summary>Gets a value indicating if color space of current bitmap is CMYK.</summary>
        return (this.get_pixelFormat() & 0x14000000) == 0x14000000;
    },

    get_isEmpty: function () {
        /// <value type="Boolean">The value which specifies whether bitmap is empty or not.</value>
        /// <summary>Gets a value indicating if bitmap is empty (no bitmap data loaded).</summary>
        return (this._bv._bitmap$width < 1 || this._bv._bitmap$height < 1);
    },

    get_isExtended: function () {
        /// <value type="Boolean">The value which specifies whether current pixel format is extended (i.e. 16 bits per channel) or not.</value>
        /// <summary>Gets a value indicating if current pixel format is extended (i.e. 16 bits per channel).</summary>
        return (this.get_pixelFormat() & 0x100000) == 0x100000;
    },

    get_isGrayScale: function () {
        /// <value type="Boolean">The value which specifies whether color space of the current bitmap is grayscale or not.</value>
        /// <summary>Gets a value indicating if color space of current bitmap is grayscale.</summary>
        return (this.get_pixelFormat() & 0x12000000) == 0x12000000;
    },

    get_isIndexed: function () {
        /// <value type="Boolean">The value which specifies whether current bitmap is indexed (palette-based) or not.</value>
        /// <summary>Gets a value indicating if current bitmap is indexed (palette-based).</summary>
        return (this.get_pixelFormat() & 0x10000) == 0x10000;
    },

    get_isRgb: function () {
        /// <value type="Boolean">The vlue which specifies whether color space of current bitmap is RGB or not.</value>
        /// <summary>Gets a value indicating if color space of current bitmap is RGB.</summary>
        return (this.get_pixelFormat() & 0x1000000) == 0x1000000;
    },

    get_pixelFormat: function () {
        /// <value type="Number" integer="true">The value which represents pixel format of current bitmap.</value>
        /// <summary>Gets pixel format of the current bitmap.</summary>
        return this._bv._bitmap$pixelFormat;
    },

    get_verticalResolution: function () {
        /// <value type="Number">The value which represents vertical resolution of the bitmap in DPI.</value>
        /// <summary>Gets vertical resolution of the bitmap in DPI.</summary>
        return this._bv._bitmap$verticalResolution;
    },

    get_width: function () {
        /// <value type="Number" integer="true">The value which specifies current bitmap width in pixels.</value>
        /// <summary>Gets current bitmap width in pixels.</summary>
        return this._bv._bitmap$width;
    }
};
Aurigma.GraphicsMill.Bitmap.registerClass("Aurigma.GraphicsMill.Bitmap");

/// <summary>The BitmapViewer class is a client-side wrapper for Aurigma.Aurigma.GraphicsMill.WebControls.BitmapViewer</summary>
Aurigma.GraphicsMill.BitmapViewer = function (element) {
    /// <summary>This client-side class corresponds to the <see cref="T:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer" /> server-side control and gives an opportunity to obtain access to its primary members in JavaScript.</summary>
    /// <remarks><para>Using this client-side class you can access the bitmap displayed on the page. It is convenient when you need to calculate some values in JavaScript which depend on the displayed bitmap parameters.
    /// Parameters of the displayed bitmap can be got with <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.bitmap" /> property, which returns an instance of the client-side <see cref="T:J:Aurigma.GraphicsMill.Bitmap" /> class. </para>
    /// <para>The displayed bitmap can be aligned in different ways inside the control with client-side <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.viewportAlignment" /> property. </para>
    /// <para>Also you can resize the displayed image manually or automatically with <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoom" /> and <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.zoomMode" /> client-side properties. </para>
    /// <para>The position of scroll bars can be changed in JavaScript programmatically. Current scroll bars position is specified with <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.scrollingPosition" /> property. </para>
    /// <para>To attach rubberbands and navigators to the control in JavaScript you should use <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.rubberband" /> and <see cref="P:J:Aurigma.GraphicsMill.BaseViewer.navigator" /> properties. </para>
    /// <para>You can add control event listeners (such as <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceClick" />, <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.workspaceChanged" />, <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.scrolled" /> and <see cref="E:J:Aurigma.GraphicsMill.BaseViewer.zoomed" />) in JavaScript.</para></remarks>
    /// <seealso cref="T:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer" />
    /// <constructor><exclude /></constructor>
    Aurigma.GraphicsMill.BitmapViewer.initializeBase(this, [element]);

    //Begin of the fields populated during $create call

    this._backgroundFileName = "";
    this._source$fileName = "";
    this._bitmap$width = -1;
    this._bitmap$height = -1;
    this._bitmap$horizontalResolution = 0;
    this._bitmap$verticalResolution = 0;
    this._bitmap$pixelFormat = 0;
    this._imageLoadMode = Aurigma.GraphicsMill.ImageLoadMode.regularTile;
    this._initTiles = null;
    this._previewImageEnabled = true;
    this._disableRefresh = false;
    //End of the fields populated during $create call

    this._tiles = [];
    this._countOfNotLoadedTiles = 0;
    this._webImageLoader = null;
    this._bitmap = new Aurigma.GraphicsMill.Bitmap(this);
    this._eps = 0.0001;
    this._scaleToActualSize = false;
};
Aurigma.GraphicsMill.BitmapViewer.prototype = {
    //--------------------------------------------------------------------------
    //Private
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    _synchronizeState: function (fileName, width, height, horizontalResolution, verticalResolution, pixelFormat, backgroundFileName, tiles) {
        /// <param name="fileName" type="String">The name of the file used to save the persistence.</param>
        /// <param name="width" type="Number" integer="true">The bitmap width.</param>
        /// <param name="height" type="Number" integer="true">The bitmap height.</param>
        /// <param name="pixelFormat" type="Number" integer="true">The bitmap pixel format.</param>
        /// <param name="backgroundFileName">The name of the background file (used for preview.)</param>
        this._source$fileName = fileName;
        this._bitmap$width = width;
        this._bitmap$height = height;
        this._bitmap$horizontalResolution = horizontalResolution;
        this._bitmap$verticalResolution = verticalResolution;
        this._bitmap$pixelFormat = pixelFormat;

        this._clearTiles();

        // Update scrolling position.
        var sp = this.get_scrollingPosition();
        var ss = this.get_scrollingSize();
        if (ss.x < sp.x)
            sp.x = ss.x;
        if (ss.y < sp.y)
            sp.y = ss.y;
        this.set_scrollingPosition(sp);

        //Check whether the bitmap is empty
        if (width > 0 && height > 0) {
            //The width and height of the scrollable area
            var w = this.get_contentWidth();
            var h = this.get_contentHeight();

            this._resizeContentElements();
            this._updateViewportAlignment();

            //Display the low resolution preview image if enabled.
            if (this._previewImageEnabled) {
                //Resize the background image
                this._background.width = w;
                this._background.height = h;
                this._background.src = backgroundFileName;
                this._background.style.display = "block";
            }

            this._contentCtx.style.display = "block";

            //Build tiles
            if (tiles) {
                this._addTiles(tiles());
                this._webImageLoader.showPrecreatedTiles();
            }
        }
        else {
            this._contentCtx.style.display = "none";
        }

        //Raise the client event
        this._raiseEvent("workspaceChanged");

        //Raise the server event
        if (this.get_autoPostBack() || this.get_clientSideOptions().get_postBackOnWorkspaceChanged()) {
            this._workspaceChangedPostBack();
        }
        else {
            this._workspaceChanged = true;
        }
    },

    _addTiles: function (tilesData) {
        for (var i = 0; i < tilesData.tiles.length; i++) {
            var tileData = tilesData.tiles[i];

            //Add the tile
            var workspaceRectangle = new Aurigma.GraphicsMill.Rectangle(tileData.x, tileData.y, tileData.w, tileData.h);
            var contentRectangle = this.controlToContentRectangle(this.workspaceToControlRectangle(workspaceRectangle).round());
            var url = String.format(tilesData.baseName, i);

            var tileImg = document.createElement("img");
            tileImg.galleryImg = "no";

            tileImg.width = contentRectangle.width;
            tileImg.height = contentRectangle.height;
            tileImg.style.position = "absolute";
            tileImg.style.left = contentRectangle.x + "px";
            tileImg.style.top = contentRectangle.y + "px";

            tileImg.display = "none";

            tileImg.ondrag = function () {
                return false;
            };

            this._countOfNotLoadedTiles++;

            tileImg.onload = Aurigma.GraphicsMill.Utils.createBoundedWrapper(this, function () {
                this._countOfNotLoadedTiles--;
            });

            this._tilesCtx.appendChild(tileImg);

            this._tiles.push({ location: workspaceRectangle, zoom: tilesData.zoom, url: url, img: tileImg });
        }
    },

    _clearTiles: function () {
        while (this._tilesCtx.childNodes.length > 0) {
            this._tilesCtx.removeChild(this._tilesCtx.childNodes[0]);
        }
        this._tiles = [];
    },

    //Check whether we need to clear old tiles
    _needToClearTiles: function () {
        //Check whether we need to do client size zoom only
        var zoom100Threshold = Math.max(1 / this.get_actualSizeHorizontalScale(), 1 / this.get_actualSizeVerticalScale());
        var zq = this.get_zoomQuality();
        var z = this.get_zoom();
        var useZoom100Threshold = ((zq == Aurigma.GraphicsMill.ZoomQuality.low) || (zq == Aurigma.GraphicsMill.ZoomQuality.shrinkHighStretchLow)) && (z - zoom100Threshold > -this._eps);

        //Required tile zoom
        var rz = useZoom100Threshold ? zoom100Threshold : z;

        for (var i = 0; i < this._tiles.length; i++) {
            var tile = this._tiles[i];
            if (Math.abs(tile.zoom - rz) > this._eps) {
                return true;
            }
        }
        return false;
    },

    //--------------------------------------------------------------------------
    //Protected
    //--------------------------------------------------------------------------

    _onTouch: function (e) {
        this._touchFlags.startZoom = this.get_zoom();
        this._touchFlags.firstPinchDetected = false;
        this._touchFlags.currentRubberband = this.get_rubberband();

        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, '_onTouch', [e]);
    },

    _onPinch: function (e) {
        if (!this._touchFlags.firstPinchDetected && Aurigma.GraphicsMill.Utils.Platform.IsIos() && this.get_pinchZoomEnabled()) {
            var holder = this.get_element();

            this._touchFlags.webkitOverflowScrolling = holder.style["-webkit-overflow-scrolling"];

            if (this._touchFlags.currentRubberband != null && this._touchFlags.currentRubberband != "")
                this.set_rubberband(null);

            holder.style["-webkit-overflow-scrolling"] = "";
        }

        this._touchFlags.firstPinchDetected = true;

        var skipScrollToGestureCenter = Aurigma.GraphicsMill.Utils.Platform.IsTouchIE() ? true : false;

        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, '_onPinch', [e, skipScrollToGestureCenter]);
    },

    /// <protected />
    _onRelease: function (e) {
        if (Aurigma.GraphicsMill.Utils.Platform.IsIos()) {
            this.get_element().style["-webkit-overflow-scrolling"] = this._touchFlags.webkitOverflowScrolling;

            if (this._touchFlags.currentRubberband != null && this._touchFlags.currentRubberband != "")
                this.set_rubberband(this._touchFlags.currentRubberband);
        }

        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, '_onRelease', [e]);
    },

    //--------------------------------------------------------------------------
    //Methods
    //--------------------------------------------------------------------------

    initialize: function () {
        /// <protected />
        /// <exclude />
        this._webImageLoader = new Aurigma.GraphicsMill.WebImageLoader(this);
        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, "initialize");

        var el = this._contentElements;
        el.push(this._imageCtx = this._jquery(this.get_element()).find("#cvImage")[0]);
        if (this._previewImageEnabled) {
            var backround = this._jquery(this.get_element()).find("#Background");

            el.push(this._background = backround[0]);
        }

        el.push(this._tilesCtx = this._jquery(this.get_element()).find("#Tiles")[0]);

        this._makeInactiveAll();
        if (this._initTiles) {
            this._addTiles(this._initTiles());
            this._webImageLoader.showPrecreatedTiles();
        }
        else if (this.get_hasContent()) {
            this._updateViewport();
            this._refresh();
        }
    },

    delayedRefresh: function () {
        if (this._disableRefresh)
            return;

        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, "delayedRefresh");
    },

    _onScroll: function (e) {
        /// <protected />
        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, "_onScroll");

        if (this._imageLoadMode == Aurigma.GraphicsMill.ImageLoadMode.regularTile)
            this._webImageLoader.showPrecreatedTiles();

        if (this._imageLoadMode == Aurigma.GraphicsMill.ImageLoadMode.adaptiveTile)
            this.delayedRefresh();
    },

    _onResize: function (e) {
        /// <protected />
        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, "_onResize");

        if (this._imageLoadMode == Aurigma.GraphicsMill.ImageLoadMode.regularTile) {
            this._webImageLoader.showPrecreatedTiles();
        }

        //For some specific zoom modes we should reload tiles
        this.delayedRefresh();
    },

    _updateViewport: function () {
        /// <protected />
        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, "_updateViewport");

        //Resize and reposition the tiles
        for (var i = 0; i < this._tiles.length; i++) {
            var tile = this._tiles[i];
            var wl = this.workspaceToControlRectangle(tile.location).round();
            wl = this.controlToContentRectangle(wl);
            tile.img.width = wl.width;
            tile.img.height = wl.height;
            tile.img.style.left = wl.x + "px";
            tile.img.style.top = wl.y + "px";
        }

        if (this._imageLoadMode == Aurigma.GraphicsMill.ImageLoadMode.regularTile) {
            this._webImageLoader.showPrecreatedTiles();
        }

        this.delayedRefresh();
    },

    _serializeState: function (state) {
        /// <protected />
        Aurigma.GraphicsMill.BitmapViewer.callBaseMethod(this, "_serializeState", [state]);
        state.Source_FileName = this._source$fileName;
        state.ScaleToActualSize = this._scaleToActualSize;
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

        if (this.get_width() <= 1 || this.get_height() <= 1)
            return;

        var args = null;

        if (this._imageLoadMode == Aurigma.GraphicsMill.ImageLoadMode.adaptiveTile) {
            var tileCoverage = this._webImageLoader.getTileCoverage();
            if (tileCoverage) {
                args = [];
                for (var i = 0; i < tileCoverage.length; i++) {
                    var tc = tileCoverage[i];
                    args.push(Aurigma.GraphicsMill.Utils.round3(tc.x));
                    args.push(Aurigma.GraphicsMill.Utils.round3(tc.y));
                    args.push(Aurigma.GraphicsMill.Utils.round3(tc.width));
                    args.push(Aurigma.GraphicsMill.Utils.round3(tc.height));
                }
            }
            else {
                return;
            }
        }
        else if (!this._needToClearTiles() && (this._tiles.length > 0)) {
            return;
        }

        this.invokeRemoteMethod("__Refresh", args);
    },

    _renderContent: function (sb) {
        /// <protected />
        var hc = this.get_hasContent();

        var wsize = "width:" + this.get_contentWidth() + "px;height:" + this.get_contentHeight() + "px;";
        var pos = "position:absolute;left:0px;top:0px;";

        sb.append("\u003cdiv id=\"cvImage\" style=\"");
        if (hc) {
            sb.append(wsize);
        }
        sb.append(pos + "\"\u003e");

        if (this._previewImageEnabled) {
            sb.append("\u003cimg id=\"Background\"");
            if (hc) {
                sb.append(" src=\"" + this._backgroundFileName + "\"");
            }
            sb.append(" alt=\"\" style=\"");
            if (hc) {
                sb.append(wsize);
            }
            sb.append(pos + "\" /\u003e");
        }

        sb.append("\u003cdiv id=\"Tiles\" style=\"");
        if (hc) {
            sb.append(wsize);
        }
        sb.append(pos + "\"\u003e");

        sb.append("\u003c/div\u003e");
    },

    //--------------------------------------------------------------------------
    //Public
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    //Properties
    //--------------------------------------------------------------------------

    get_countOfNotLoadedTiles: function () {
        return this._countOfNotLoadedTiles;
    },

    get_workspaceHeight: function () {
        /// <value type="Number" integer="true">The value which represents height (in pixels) of bitmap loaded in <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" />.</value>
        /// <summary>Gets a value which represents height (in pixels) of bitmap loaded in <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" />.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.WorkspaceHeight">BitmapViewer.WorkspaceHeight</see> server-side member.</para></remarks>
        if (this.get_scaleToActualSize()) {
            return this._bitmap.get_height() * 72 / this._bitmap.get_verticalResolution();
        } else {
            return this._bitmap.get_height() * 72 / this.get_screenYDpi();
        }
    },

    get_workspaceWidth: function () {
        /// <value type="Number" integer="true">The value which represents width of bitmap loaded in <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" />.</value>
        /// <summary>Gets a value which represents width of bitmap loaded in <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" />.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.WorkspaceWidth">BitmapViewer.WorkspaceWidth</see> server-side member.</para></remarks>
        if (this.get_scaleToActualSize()) {
            return this._bitmap.get_width() * 72 / this._bitmap.get_horizontalResolution();
        } else {
            return this._bitmap.get_width() * 72 / this.get_screenXDpi();
        }
    },

    get_bitmap: function () {
        /// <value type="Aurigma.GraphicsMill.Bitmap">The bitmap which should be displayed in the control.</value>
        /// <summary>Gets the bitmap which is displayed in the control.</summary>
        return this._bitmap;
    },

    get_imageLoadMode: function () {
        /// <value type="Aurigma.GraphicsMill.ImageLoadMode">The <see cref="T:J:Aurigma.GraphicsMill.ImageLoadMode" /> enumeration member that specifies how the image is loaded to a browser.</value>
        /// <summary>Gets a value that specifies how the image is loaded to a browser.</summary>
        /// <remarks><para>The following load modes are available:</para><list type="bullet"><item><term><see cref="F:J:Aurigma.GraphicsMill.ImageLoadMode.entire" /></term><description>Whole original image is loaded including all invisible parts.</description></item><item><term><see cref="F:J:Aurigma.GraphicsMill.ImageLoadMode.adaptiveTile" /></term><description>First of all, the control loads image fragment actually visible in the client area. Then, if an user scrolls the image it loads necessary parts of an original image which are visible but not loaded yet.</description></item><item><term><see cref="F:J:Aurigma.GraphicsMill.ImageLoadMode.regularTile" /></term><description>In this mode the original image is divided into square tiles. The control loads square fragments of the original image for corresponding tiles which are visible but not loaded yet.</description></item></list>
        /// <para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.ImageLoadMode">BitmapViewer.ImageLoadMode</see> server-side member.</para></remarks>
        return this._imageLoadMode;
    },

    get_hasContent: function () {
        /// <value type="Boolean">The value indicating if the viewer contains a bitmap.</value>
        /// <summary>Gets a value indicating if the viewer contains a bitmap.</summary>
        /// <remarks><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.HasContent">BitmapViewer.HasContent</see> server-side member.</para></remarks>
        return !this.get_bitmap().get_isEmpty();
    },

    get_scaleToActualSize: function () {
        /// <value type="Boolean">The value that specifies whether to take into account the image resolution (DPI) during displaying.</value>
        /// <summary>Get/sets a value that specifies whether to take into account the image resolution (DPI) during displaying.</summary>
        /// <remarks><para>The <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> supports displaying image in its physical size. Actual physical size of the image is measured in metrical units (inches, centimeters) and depends on image resolution. To apply this functionality you should set <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" /> property to <b>true</b>. In this mode the control takes into account the resolution of the image, that allows you to display it in actual physical size when image resolution differs from monitor resolution. Also, this feature is useful for images with different vertical and horizontal resolutions, e.g. faxes.</para>
        /// <note>When the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" /> is <b>true</b> the <see cref="T:J:Aurigma.GraphicsMill.BitmapViewer" /> will resize the image in memory before displaying it. Therefore it may cause unnecessary performance overhead if you do not care about physical resolution. That is why we recommend to use this feature only when it is actually needed.</note><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.ScaleToActualSize">BitmapViewer.ScaleToActualSize</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.actualSizeVerticalScale" />
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.actualSizeHorizontalScale" />
        return this._scaleToActualSize;
    },

    set_scaleToActualSize: function (v) {
        this._scaleToActualSize = v;
    },

    get_actualSizeHorizontalScale: function () {
        /// <value type="Number">The value which represents the ratio of screen horizontal resolution to the image resolution.</value>
        /// <summary>Gets a value which represents the ratio of screen horizontal resolution to the image resolution.</summary>
        /// <remarks><para>This property is used to determine how strong the image width was resized to be scaled to its actual size.</para><para>If the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" /> property is set to <b>false</b> the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.actualSizeHorizontalScale" /> property will be equal to 1.0.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.ActualSizeHorizontalScale">BitmapViewer.ActualSizeHorizontalScale</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.actualSizeVerticalScale" />
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" />
        if (!this.get_scaleToActualSize()) {
            return 1;
        }

        var xDpi = this.get_bitmap().get_horizontalResolution();
        return xDpi > this._eps ? this.get_screenXDpi() / xDpi : 1;
    },

    get_actualSizeVerticalScale: function () {
        /// <value type="Number">The value which represents the ratio of screen vertical resolution to the image resolution.</value>
        /// <summary>Gets a value which represents the ratio of screen vertical resolution to the image resolution.</summary>
        /// <remarks><para>This property is used to determine how strong the image height was resized to be scaled to its actual size.</para><para>If the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" /> property is set to <b>false</b> the <see cref="P:J:Aurigma.GraphicsMill.BitmapViewer.actualSizeVerticalScale" /> property will be equal to 1.0.</para><para>This property corresponds to <see cref="P:Aurigma.Aurigma.GraphicsMill.AjaxControls.BitmapViewer.ActualSizeVerticalScale">BitmapViewer.ActualSizeVerticalScale</see> server-side member.</para></remarks>
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.actualSizeHorizontalScale" />
        /// <seealso cref="P:J:Aurigma.GraphicsMill.BitmapViewer.scaleToActualSize" />
        if (!this.get_scaleToActualSize()) {
            return 1;
        }

        var yDpi = this.get_bitmap().get_verticalResolution();
        return yDpi > this._eps ? this.get_screenYDpi() / yDpi : 1;
    },

    get_contentHeight: function () {
        /// <exclude />
        /// <returns type="Number" integer="true"/>
        return Math.round(this._bitmap.get_height() * this.get_zoom() * this.get_actualSizeVerticalScale());
    },

    get_contentWidth: function () {
        /// <exclude />
        /// <returns type="Number" integer="true"/>
        return Math.round(this._bitmap.get_width() * this.get_zoom() * this.get_actualSizeHorizontalScale());
    }
};
Aurigma.GraphicsMill.BitmapViewer.registerClass("Aurigma.GraphicsMill.BitmapViewer", Aurigma.GraphicsMill.BaseViewer);

Aurigma.GraphicsMill.WebImageLoader = function (bitmapViewer) {
    /// <exclude />
    this._bv = bitmapViewer;
};
Aurigma.GraphicsMill.WebImageLoader.prototype = {
    showPrecreatedTiles: function () {
        /// <summary>Shows created but not loaded to the client images</summary>
        var bv = this._bv;
        if (bv.get_imageLoadMode() == Aurigma.GraphicsMill.ImageLoadMode.regularTile) {
            var sp = bv.get_scrollingPosition();
            var lt = bv.controlToWorkspacePoint(bv.contentToControlPoint(new Sys.UI.Point(sp.x, sp.y)));
            var rb = bv.controlToWorkspacePoint(bv.contentToControlPoint(new Sys.UI.Point(sp.x + bv.get_width(), sp.y + bv.get_height())));

            for (var i = 0; i < bv._tiles.length; i++) {
                var tileData = bv._tiles[i];
                if (!tileData.loaded) {
                    var loc = tileData.location;
                    if (loc.x + loc.width >= lt.x && loc.x <= rb.x &&
						loc.y + loc.height >= lt.y && loc.y <= rb.y) {
                        this._showTile(tileData);
                    }
                }
            }
        }
        else {
            for (var i = 0; i < bv._tiles.length; i++) {
                var tileData = bv._tiles[i];

                if (!tileData.loaded)
                    this._showTile(tileData);
            }
        }
    },

    getTileCoverage: function () {
        /// <summary>Returns a minimum coverage with the tiles for the current viewport.</summary>
        /// <returns type="Array[Aurigma.GraphicsMill.Rectangle]">The minimum coverage with the tiles for the current viewport.</value>

        var bv = this._bv;

        if (bv.get_imageLoadMode() != Aurigma.GraphicsMill.ImageLoadMode.adaptiveTile) {
            return null;
        }

        //Compare a and b
        function compare(a, b) {
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
        }

        //Creates a copy of the given array, removes duplicates, and returns it.
        function removeDuplicates(a) {
            var b = [];
            b.push(a.shift());
            while (a.length > 0) {
                var v = a.shift();
                if (v != b[b.length - 1]) {
                    b.push(v);
                }
            }
            return b;
        }

        //ScrollingPosition
        var sp = bv.get_scrollingPosition();

        //Current viewport
        var winw = bv.get_width();
        var winh = bv.get_height();
        winw = Math.min(winw, bv.get_contentWidth() - sp.x);
        winh = Math.min(winh, bv.get_contentHeight() - sp.y);
        var win = new Aurigma.GraphicsMill.Rectangle(sp.x, sp.y, winw, winh);

        if (bv._needToClearTiles()) {
            var rect = bv.contentToControlRectangle(win);
            return [bv.controlToWorkspaceRectangle(rect)];
        }

        //Array of x and y coordinates of the tiles.
        var xc = [];
        var yc = [];

        //Add the current window cooordinates
        xc.push(win.x);
        xc.push(win.x + win.width);
        yc.push(win.y);
        yc.push(win.y + win.height);

        //Add the existing tiles
        for (var i = 0; i < bv._tiles.length; i++) {
            var tile = bv._tiles[i];
            //X, Y
            var wl = bv.workspaceToControlRectangle(tile.location).round();
            wl = bv.controlToContentRectangle(wl);

            if (wl.x > win.x && wl.x < win.x + win.width)
                xc.push(wl.x);

            if (wl.x + wl.width > win.x && wl.x + wl.width < win.x + win.width)
                xc.push(wl.x + wl.width);

            if (wl.y > win.y && wl.y < win.y + win.height)
                yc.push(wl.y);

            if (wl.y + wl.height > win.y && wl.y + wl.height < win.y + win.height)
                yc.push(wl.y + wl.height);
        }

        //Remove the duplicates of x and y coordinates
        xc = removeDuplicates(xc.sort(compare));
        yc = removeDuplicates(yc.sort(compare));

        //Create an empty matrix
        var m = [];
        for (var i = 0; i < yc.length - 1; i++) {
            m[i] = [];
            for (var j = 0; j < xc.length - 1; j++) {
                m[i][j] = 0;
            }
        }

        //Fill the elements of the matrix which correspond the
        //tiles which are correctly loaded with 1. To do this
        //we need to find the edges of the visible portion of the
        //screen
        for (var k = 0; k < bv._tiles.length; k++) {
            var x1 = -1, x2 = -1, y1 = -1, y2 = -1;

            var wl = bv.workspaceToControlRectangle(bv._tiles[k].location).round();
            wl = bv.controlToContentRectangle(wl);

            //Right border
            for (var j = 0; j <= xc.length - 2; j++) {
                if (wl.x <= xc[j]) {
                    x1 = j;
                    break;
                }
            }
            //Left border
            for (var j = xc.length - 1; j >= 1; j--) {
                if (wl.x + wl.width >= xc[j]) {
                    x2 = j - 1;
                    break;
                }
            }
            //Top border
            for (var j = 0; j <= yc.length - 2; j++) {
                if (wl.y <= yc[j]) {
                    y1 = j;
                    break;
                }
            }
            // Bottom border
            for (var j = yc.length - 1; j >= 1; j--) {
                if (wl.y + wl.height >= yc[j]) {
                    y2 = j - 1;
                    break;
                }
            }
            //Fill view region with 1
            if (x1 != -1 && x2 != -1 && y1 != -1) {
                for (var i = y1; i <= y2; i++) {
                    for (var j = x1; j <= x2; j++) {
                        m[i][j] = 1;
                    }
                }
            }
        }

        //Minimum and maximum x and y coordinates which we need to close.
        //These coordinates specify the "rectangle of interest".
        var minX = 0, maxX = xc.length - 2, minY = 0, maxY = yc.length - 2;

        //Automatically crop the "rectangle of interest"
        //Go from the left side
        while (minX <= maxX) {
            var s = 0;
            for (var i = minY; i <= maxY; i++) {
                s += m[i][minX];
            }
            if (s == maxY - minY + 1) {
                minX++;
            }
            else {
                break;
            }
        }
        //Go from the right side
        while (minX <= maxX) {
            var s = 0;
            for (var i = minY; i <= maxY; i++) {
                s += m[i][maxX];
            }
            if (s == maxY - minY + 1) {
                maxX--;
            }
            else {
                break;
            }
        }
        //Go from the top
        while (minY <= maxY) {
            var s = 0;
            for (var i = minX; i <= maxX; i++) {
                s += m[minY][i];
            }
            if (s == maxX - minX + 1) {
                minY++;
            }
            else {
                break;
            }
        }
        //Go from the bottom
        while (minY <= maxY) {
            var s = 0;
            for (var i = minX; i <= maxX; i++) {
                s += m[maxY][i];
            }
            if (s == maxX - minX + 1) {
                maxY--;
            }
            else {
                break;
            }
        }

        //If this condition is true, then it means that there is no
        //need to load any extra tiles, because the
        //"rectangle of interest" is fully covered.
        if (minX > maxX || minY > maxY) {
            return null;
        }

        //Calculate the total number of the matrix cells
        //bounded to the "rectangle of interest" which are
        //already covered.
        var f = 0;
        for (var i = minY; i <= maxY; i++) {
            for (var j = minX; j <= maxX; j++) {
                f += m[i][j];
            }
        }

        //The maximum number of areas it makes sense to load.
        //If we load too much areas (more than 3 in our case),
        //we will gain no optimization benefits, and therefore
        //it would be better to update entire visible area.
        var maxAreas = 3;

        //Array of new scrollable areas to load
        var areas = [];

        //The total number of the cells in the "rectangle of interest"
        //(i.e. the portion of the matrix which corresponds to the
        //visible part of the image).
        var maxF = (maxX - minX + 1) * (maxY - minY + 1);

        //Here we calculate the areas which would cover the
        //"rectangle of interest" in the sub-optimal way.
        while (f < maxF && areas.length < maxAreas) {
            //Select the start point to grow the area
            var sX = -1, sY = -1;

            //In corners
            //Top left corner
            if (m[minY][minX] == 0) {
                sX = minX;
                sY = minY;
            }
                //Bottom left corner
            else if (m[maxY][minX] == 0) {
                sX = minX;
                sY = maxY;
            }
                //Top right corner
            else if (m[minY][maxX] == 0) {
                sX = maxX;
                sY = minY;
            }
                //Bottom right corner
            else if (m[maxY][maxX] == 0) {
                sX = maxX;
                sY = maxY;
            }
            else {
                //On borders
                //Top border
                for (var i = minX; i <= maxX; i++) {
                    if (m[minY][i] == 0) {
                        sX = i;
                        sY = minY;
                        break;
                    }
                }
                if (sX == -1) {
                    //bottom border
                    for (var i = minX; i <= maxX; i++) {
                        if (m[maxY][i] == 0) {
                            sX = i;
                            sY = maxY;
                            break;
                        }
                    }
                    if (sX == -1) {
                        //left border
                        for (var i = minY; i <= maxY; i++) {
                            if (m[i][minX] == 0) {
                                sX = minX;
                                sY = i;
                                break;
                            }
                        }
                        if (sX == -1) {
                            //right border
                            for (var i = minY; i <= maxY; i++) {
                                if (m[i][maxX] == 0) {
                                    sX = maxX;
                                    sY = i;
                                    break;
                                }
                            }
                            if (sX == -1) {
                                //Inside of the rectangle from the first uncovered cell
                                for (var i = minY + 1; i <= maxY - 1; i++) {
                                    for (var j = minX + 1; j <= maxY - 1; j++) {
                                        if (m[i][j] == 0) {
                                            sX = j;
                                            sY = i;
                                            break;
                                        }
                                    }
                                    if (sX != -1) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            
            var a = { x1: sX, y1: sY, x2: sX, y2: sY };
            m[sY][sX] = 1; 
            f++;
            
            while (a.y1 > minY) {
                var s = 0;
                for (var i = a.x1; i <= a.x2; i++) {
                    s += m[a.y1 - 1][i];
                }
                if (s == 0) {
                    a.y1--;
                    f += a.x2 - a.x1 + 1;
                    for (var i = a.x1; i <= a.x2; i++) {
                        m[a.y1][i] = 1;
                    }
                }
                else {
                    break;
                }
            }
            //Left
            while (a.x1 > minX) {
                var s = 0;
                for (var i = a.y1; i <= a.y2; i++) {
                    s += m[i][a.x1 - 1];
                }
                if (s == 0) {
                    a.x1--;
                    f += a.y2 - a.y1 + 1;
                    for (var i = a.y1; i <= a.y2; i++) {
                        m[i][a.x1] = 1;
                    }
                }
                else {
                    break;
                }
            }
            //Down
            while (a.y2 < maxY) {
                var s = 0;
                for (var i = a.x1; i <= a.x2; i++) {
                    s += m[a.y2 + 1][i];
                }
                if (s == 0) {
                    a.y2++;
                    f += a.x2 - a.x1 + 1;
                    for (var i = a.x1; i <= a.x2; i++) {
                        m[a.y2][i] = 1;
                    }
                }
                else {
                    break;
                }
            }
            //Right
            while (a.x2 < maxX) {
                var s = 0;
                for (var i = a.y1; i <= a.y2; i++) {
                    s += m[i][a.x2 + 1];
                }
                if (s == 0) {
                    a.x2++;
                    f += a.y2 - a.y1 + 1;
                    for (var i = a.y1; i <= a.y2; i++) {
                        m[i][a.x2] = 1;
                    }
                }
                else {
                    break;
                }
            }
            areas.push(a);
        }

        //Analyze the results

        //If we have not selected the start point, it means that we
        //no optimal coverage found and we need to reload the entire
        //portion of the image.
        if (f != maxF) {
            var rect = new Aurigma.GraphicsMill.Rectangle(xc[minX], yc[minY], xc[maxX + 1] - xc[minX], yc[maxY + 1] - yc[minY]);
            rect = bv.contentToControlRectangle(rect);
            return [bv.controlToWorkspaceRectangle(rect)];
        }

        //Otherwise we can return the optimal coverage (in fact it is
        //a rough estimation of the optimal coverage, however it is
        //enough for our needs).
        var result = [];
        for (var j = 0; j < areas.length; j++) {
            var a = areas[j];
            //Resolve the problem with the floating point calculation.
            if (xc[a.x2 + 1] - xc[a.x1] > 0.5 && yc[a.y2 + 1] - yc[a.y1] > 0.5) {
                var rect = new Aurigma.GraphicsMill.Rectangle(xc[a.x1], yc[a.y1], xc[a.x2 + 1] - xc[a.x1], yc[a.y2 + 1] - yc[a.y1]);
                rect = bv.contentToControlRectangle(rect);
                result.push(bv.controlToWorkspaceRectangle(rect));
            }
        }

        return result;
    },

    _showTile: function (tile) {
        var img = tile.img;
        img.style.display = "block";
        img.src = tile.url;
        tile.loaded = true;
    }
};
Aurigma.GraphicsMill.WebImageLoader.registerClass("Aurigma.GraphicsMill.WebImageLoader");

if (typeof (Sys) !== 'undefined') Sys.Application.notifyScriptLoaded();