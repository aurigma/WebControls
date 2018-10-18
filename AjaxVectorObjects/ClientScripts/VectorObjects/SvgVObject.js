// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.SvgVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.RectangleVObject);