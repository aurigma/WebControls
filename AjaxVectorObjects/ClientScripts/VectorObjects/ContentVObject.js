// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject);