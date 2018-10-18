// Copyright (c) 2018 Aurigma Inc. All rights reserved.
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

Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject.registerClass("Aurigma.GraphicsMill.AjaxControls.VectorObjects.ImageVObject", Aurigma.GraphicsMill.AjaxControls.VectorObjects.ContentVObject);