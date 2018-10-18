// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [ToolboxBitmap(typeof(BitmapViewer), "Resources.BitmapViewer.bmp")]
    [DefaultEvent("WorkspaceChanged")]
    public class BitmapViewer : BaseViewer, ICallBackDataHandler
    {
        /// <summary>
        /// Private structure for control state deserialization
        /// </summary>
        private struct BitmapViewerState
        {
            public string Source_FileName;

            public bool ScaleToActualSize;

            public static BitmapViewerState Empty
            {
                get
                {
                    BitmapViewerState instance;

                    instance.Source_FileName = "";
                    instance.ScaleToActualSize = false;

                    return instance;
                }
            }
        }

        private static float s_eps = 0.0001f;

        private readonly IFileCache _fileCache;

        private BrowserImageFormat _browserImageFormat;
        private int _browserJpegQuality;
        private ImageLoadMode _imageLoadMode;
        private bool _previewImageEnabled;
        private int _previewImageResizeRatio;
        private int _tileSize;
        private bool _bitmapChanged;
        private bool _scaleToActualSize;
        private BitmapViewerState _postedState;

        private bool _firstBitmapAccess;
        private Bitmap _bitmap;
        private IImageParams _imageParams;
        private string _sourceCacheFilename;
        private string _sourceImageFilename;

        public BitmapViewer()
        {
            _browserImageFormat = BrowserImageFormat.Auto;
            _browserJpegQuality = 70;
            _firstBitmapAccess = true;
            _imageLoadMode = ImageLoadMode.AdaptiveTile;
            _previewImageResizeRatio = 8;
            _previewImageEnabled = true;
            _tileSize = 300;
            _postedState = BitmapViewerState.Empty;

            _fileCache = FileCache.GetInstance();

            if (!DesignMode)
                _bitmapChanged = false;

            ScriptFiles.Add("BitmapViewer");
            ScriptClassName = "Aurigma.GraphicsMill.BitmapViewer";
        }

        #region Public members

        [Browsable(false)]
        public IImageParams SourceImageParams
        {
            private set { _imageParams = value; }
            get { return _imageParams ?? (_imageParams = new Bitmap()); }
        }

        public bool DisableRefresh = false;

        public string SourceImageFilename
        {
            get { return _sourceImageFilename; }
            set
            {
                _sourceImageFilename = value;
                SourceCacheFilename = SaveSourceFileToCache(_sourceImageFilename, Path.GetExtension(_sourceImageFilename));
            }
        }

        [Browsable(false)]
        public Bitmap Bitmap
        {
            get
            {
                try
                {
                    if (!string.IsNullOrEmpty(SourceCacheFilename) && _firstBitmapAccess)
                        _bitmap = new Bitmap(_fileCache.GetAbsolutePrivateCachePath(SourceCacheFilename));
                }
                finally
                {
                    _firstBitmapAccess = false;
                }

                return _bitmap;
            }
            set
            {
                _bitmap = value;
                SourceCacheFilename = SaveBitmapToCache(_bitmap);
            }
        }

        internal string SourceCacheFilename
        {
            get { return _sourceCacheFilename; }
            set
            {
                _sourceCacheFilename = value;

                using (var reader = ImageReader.Create(_fileCache.GetAbsolutePrivateCachePath(_sourceCacheFilename)))
                {
                    SourceImageParams = ImageParams.Create(reader);
                }

                OnWorkspaceChanged();

                _bitmapChanged = true;

                UpdateViewport();
            }
        }

        [Browsable(true)]
        [ResDescription("BitmapViewer_BrowserImageFormat")]
        [DefaultValue(BrowserImageFormat.Auto)]
        public BrowserImageFormat BrowserImageFormat
        {
            get
            {
                return _browserImageFormat;
            }

            set
            {
                _browserImageFormat = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BitmapViewer_BrowserJpegQuality")]
        [DefaultValue(70)]
        public int BrowserJpegQuality
        {
            get
            {
                return _browserJpegQuality;
            }
            set
            {
                if (value < 0 || value > 100)
                {
                    throw new ArgumentOutOfRangeException("value",
                        Resources.Messages.JpegQualityIsOutOfRange);
                }
                _browserJpegQuality = value;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override float WorkspaceHeight
        {
            get
            {
                if (HasContent)
                {
                    if (_scaleToActualSize)
                        return Common.ConvertPixelsToPoints(SourceImageParams.DpiY, SourceImageParams.Height);
                    else
                        return Common.ConvertPixelsToPoints(ScreenYDpi, SourceImageParams.Height);
                }
                else
                {
                    return 0F;
                }
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override float WorkspaceWidth
        {
            get
            {
                if (HasContent)
                {
                    if (ScaleToActualSize)
                        return Common.ConvertPixelsToPoints(SourceImageParams.DpiX, SourceImageParams.Width);
                    else
                        return Common.ConvertPixelsToPoints(ScreenXDpi, SourceImageParams.Width);
                }
                else
                {
                    return 0F;
                }
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public bool HasContent
        {
            get
            {
                return SourceCacheFilename != null && File.Exists(_fileCache.GetAbsolutePrivateCachePath(SourceCacheFilename));
            }
        }

        [Browsable(true)]
        [DefaultValue(false)]
        [ResDescription("BaseViewer_ScaleToActualSize")]
        public bool ScaleToActualSize
        {
            get
            {
                return _scaleToActualSize;
            }
            set
            {
                _scaleToActualSize = value;

                UpdateViewport();
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override float ActualSizeHorizontalScale
        {
            get
            {
                if (!HasContent || !ScaleToActualSize)
                {
                    return 1.0f;
                }

                float resX = SourceImageParams.DpiX;
                return resX > s_eps ? ScreenXDpi / resX : 1.0f;
            }
        }

        [Browsable(true)]
        [ResDescription("BitmapViewer_ImageLoadMode")]
        [DefaultValue(ImageLoadMode.RegularTile)]
        public ImageLoadMode ImageLoadMode
        {
            get
            {
                return _imageLoadMode;
            }
            set
            {
                _imageLoadMode = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BitmapViewer_PreviewImageEnabled")]
        [DefaultValue(true)]
        public bool PreviewImageEnabled
        {
            get
            {
                return _previewImageEnabled;
            }
            set
            {
                _previewImageEnabled = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BitmapViewer_PreviewImageResizeRatio")]
        [DefaultValue(8)]
        public int PreviewImageResizeRatio
        {
            get
            {
                return _previewImageResizeRatio;
            }

            set
            {
                if (value < 1 || value > 500)
                {
                    throw new ArgumentOutOfRangeException(Resources.Messages.PreviewImageResizeRatioOutOfRange);
                }
                _previewImageResizeRatio = value;
            }
        }

        [Browsable(true)]
        [ResDescription("BitmapViewer_TileSize")]
        [DefaultValue(300)]
        public int TileSize
        {
            get
            {
                return _tileSize;
            }
            set
            {
                if (value < 20)
                {
                    throw new ArgumentOutOfRangeException(Resources.Messages.TileSizeOutOfRange);
                }
                _tileSize = value;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override float ActualSizeVerticalScale
        {
            get
            {
                if (!HasContent || !ScaleToActualSize)
                {
                    return 1.0f;
                }

                float resY = SourceImageParams.DpiY;
                return resY > s_eps ? ScreenYDpi / resY : 1.0f;
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override int ContentHeight
        {
            get
            {
                if (HasContent)
                {
                    return (int)(Math.Round(SourceImageParams.Height * Zoom * ActualSizeVerticalScale));
                }
                else
                {
                    return 0;
                }
            }
        }

        [Browsable(false)]
        [DesignerSerializationVisibility(DesignerSerializationVisibility.Hidden)]
        public override int ContentWidth
        {
            get
            {
                if (HasContent)
                {
                    return (int)(Math.Round(SourceImageParams.Width * Zoom * ActualSizeHorizontalScale));
                }
                else
                {
                    return 0;
                }
            }
        }

        #endregion Public members

        #region Protected members

        protected override bool LoadPostData(string postDataKey, System.Collections.Specialized.NameValueCollection postCollection)
        {
            var baseLoadPostData = base.LoadPostData(postDataKey, postCollection);

            var state = postCollection[GetStateFieldId()];

            if (string.IsNullOrEmpty(state))
                return false;

            _postedState = new JavaScriptSerializer().Deserialize<BitmapViewerState>(state);

            if (string.IsNullOrEmpty(_postedState.Source_FileName))
                return false;

            _scaleToActualSize = _postedState.ScaleToActualSize;
            SourceCacheFilename = _postedState.Source_FileName;

            return baseLoadPostData;
        }

        protected override void InitScriptDescriptor(ScriptControlDescriptor descriptor)
        {
            descriptor.AddProperty("scaleToActualSize", ScaleToActualSize);

            if (HasContent)
            {
                descriptor.AddProperty("_backgroundFileName", SavePreviewImage());
                descriptor.AddProperty("_source$fileName", SourceCacheFilename);
                descriptor.AddProperty("_bitmap$height", SourceImageParams.Height);
                descriptor.AddProperty("_bitmap$width", SourceImageParams.Width);
                descriptor.AddProperty("_bitmap$horizontalResolution", SourceImageParams.DpiX);
                descriptor.AddProperty("_bitmap$verticalResolution", SourceImageParams.DpiY);
                descriptor.AddProperty("_bitmap$pixelFormat", (int)SourceImageParams.PixelFormat);
            }
            else
            {
                descriptor.AddProperty("_backgroundFileName", "");
                descriptor.AddProperty("_source$fileName", "");
                descriptor.AddProperty("_bitmap$width", 0);
                descriptor.AddProperty("_bitmap$height", 0);
                descriptor.AddProperty("_bitmap$horizontalResolution", 0);
                descriptor.AddProperty("_bitmap$verticalResolution", 0);
                descriptor.AddProperty("_bitmap$pixelFormat", (int)PixelFormat.FormatUnknown);
            }

            descriptor.AddProperty("_previewImageEnabled", PreviewImageEnabled);
            descriptor.AddProperty("_imageLoadMode", ImageLoadMode);
            descriptor.AddProperty("_disableRefresh", DisableRefresh);

            if (!DelayedTileLoad)
            {
                descriptor.AddScriptProperty("_initTiles", GetImageTileJavaScript());
                descriptor.AddProperty("_needToRefresh", false);
            }
            else
            {
                descriptor.AddProperty("_needToRefresh", true);
            }
            base.InitScriptDescriptor(descriptor);
        }

        private string _callbackResult;

        private string GetCallBackExecutionCodes(Control cl)
        {
            string result = "";
            if ((cl is ICallBackDataHandler) && (cl != this))
                result += ((ICallBackDataHandler)cl).GetCallBackExecutionCode();
            for (int i = 0; i < cl.Controls.Count; i++)
            {
                result += GetCallBackExecutionCodes(cl.Controls[i]);
            }
            return result;
        }

        protected override string GetCallbackResult()
        {
            return GetCallBackExecutionCodes(Page) + _callbackResult;
        }

        protected string GetState()
        {
            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();
            StringBuilder code = new StringBuilder();
            string v = "$find(\"" + ClientID + "\")";
            string needToRefresh = v + "._needToRefresh=false;";
            
            // Check what was changed and whether we need to sync state on client and server
            if (_bitmapChanged)
            {
                if (HasContent)
                {
                    UpdateViewport();

                    // Here we add some parameters of BaseViewer.
                    code.Append(v + "._scrollingPosition=new Aurigma.GraphicsMill.PointF(" +
                        ScrollingPosition.X.ToString(format) + "," + ScrollingPosition.Y.ToString(format) + ");");
                    code.Append(v + "._zoom=" + Zoom.ToString(format) + ";");
                    code.Append(v + "._zoomMode=" + Convert.ToInt32(ZoomMode, format).ToString(format) + ";");

                    code.Append(v + "._synchronizeState(\"");
                    code.Append(SourceCacheFilename);
                    code.Append("\",");
                    code.Append(SourceImageParams.Width.ToString(format));
                    code.Append(",");
                    code.Append(SourceImageParams.Height.ToString(format));
                    code.Append(",");
                    code.Append(SourceImageParams.DpiX.ToString(format));
                    code.Append(",");
                    code.Append(SourceImageParams.DpiY.ToString(format));
                    code.Append(",");
                    code.Append(((int)SourceImageParams.PixelFormat).ToString(format));
                    code.Append(",\"");
                    code.Append(SavePreviewImage());
                    code.Append("\",");

                    if (DelayedTileLoad)
                    {
                        code.Append("null);");
                        needToRefresh = v + "._needToRefresh=true;";
                    }
                    else
                    {
                        code.Append(GetImageTileJavaScript());
                        code.Append(");");
                    }
                }
                else
                {
                    code.Append(v + "._synchronizeState(\"\",0,0,0,0,");
                    code.Append(((int)PixelFormat.FormatUnknown).ToString(format));
                    code.Append(",\"\",null);");
                }
            }
            code.Append(needToRefresh);
            return code.ToString();
        }

        protected override void RaiseCallbackEvent(string eventArgument)
        {
            var format = Common.GetNumberFormat();

            var jss = new System.Web.Script.Serialization.JavaScriptSerializer();

            var callbackArgs = (object[])(jss.DeserializeObject(eventArgument));

            var methodName = (string)(callbackArgs[0]);
            var methodArgs = (object[])(callbackArgs[1]);

            if (methodName == "__Refresh")
            {
                string tileJavaScript;

                if (ImageLoadMode == ImageLoadMode.AdaptiveTile)
                {
                    var tiles = new List<RectangleF>();

                    if (methodArgs != null)
                    {
                        for (var i = 0; i < methodArgs.Length; i += 4)
                        {
                            var tile = new RectangleF(Convert.ToSingle(methodArgs[i], format),
                                                      Convert.ToSingle(methodArgs[i + 1], format),
                                                      Convert.ToSingle(methodArgs[i + 2], format),
                                                      Convert.ToSingle(methodArgs[i + 3], format));
                            tiles.Add(tile);
                        }
                    }
                    tileJavaScript = GetRefreshImageTileJavaScript(tiles.ToArray());
                }
                else
                {
                    tileJavaScript = GetImageTileJavaScript();
                }

                _callbackResult = "if(this._needToClearTiles()){this._clearTiles();};var tiles=" + tileJavaScript +
                    ";this._addTiles(tiles());this._webImageLoader.showPrecreatedTiles();this._needToRefresh=false;";
            }
            else
            {
                // Process all other callbacks except Refresh
                _bitmapChanged = false;

                // Try to find method first of all in NamingContainer, next in BindingContainer and to the end
                // into Parent element.

                // Get type of instance
                var objectType = NamingContainer.GetType();
                var methodContainer = NamingContainer;

                // Get specified method
                var methodInfo = objectType.GetMethod(methodName);

                if (methodInfo == null)
                {
                    objectType = BindingContainer.GetType();
                    methodContainer = BindingContainer;
                    methodInfo = objectType.GetMethod(methodName);
                }

                if (methodInfo == null)
                {
                    objectType = Parent.GetType();
                    methodContainer = Parent;
                    methodInfo = objectType.GetMethod(methodName);
                }

                var returnValue = InvokeRemoteScriptingMethod(methodContainer, methodName,
                    methodArgs);

                var code = new StringBuilder();

                var v = "$find(\"" + ClientID + "\")";
                code.Append(v + "._returnValue=" + jss.Serialize(returnValue) + ";");

                code.Append(GetState());

                _callbackResult = code.ToString();
            }
        }

        protected override void Dispose(bool disposing)
        {
            try
            {
                if (disposing)
                {
                    if (_bitmap != null)
                    {
                        _bitmap.Dispose();
                        _bitmap = null;
                    }
                }
            }
            finally
            {
                base.Dispose(disposing);
            }
        }

        #endregion Protected members

        #region Private memebrs

        internal WriterSettings GetBrowserImageFormatEncoderOptions()
        {
            switch (BrowserImageFormat)
            {
                case BrowserImageFormat.Png:
                    {
                        return new PngSettings();
                    }
                case BrowserImageFormat.Jpeg:
                    {
                        return new JpegSettings(BrowserJpegQuality, false, false);
                    }
                default:
                    {
                        // Select either PNG or Jpeg base on color depth.
                        return SourceImageParams.PixelFormat.IsIndexed
                            ? (WriterSettings)new PngSettings()
                            : new JpegSettings(BrowserJpegQuality, false, false);
                    }
            }
        }

        internal string GetCacheFileExtension()
        {
            var options = GetBrowserImageFormatEncoderOptions();
            return options is PngSettings ? ".png" : ".jpg";
        }

        private string SavePreviewImage()
        {
            if (!_previewImageEnabled)
                return "";

            var fileName = _fileCache.GetPublicTempFileName(".jpg");

            var width = (int)(Math.Max(SourceImageParams.Width * ActualSizeHorizontalScale / _previewImageResizeRatio, 1));
            var height = (int)(Math.Max(SourceImageParams.Height * ActualSizeVerticalScale / _previewImageResizeRatio, 1));

            var pipeline = new Pipeline
                               {
                                   ImageReader.Create(_fileCache.GetAbsolutePrivateCachePath(SourceCacheFilename)),
                                   new Resize(width, height, ResizeInterpolationMode.Anisotropic9)
                               };

            if ((SourceImageParams.ColorProfile != null && SourceImageParams.PixelFormat.ColorSpace != ColorSpace.Rgb) ||
                SourceImageParams.PixelFormat.HasAlpha)
            {
                var cc = new Transforms.ColorConverter(PixelFormat.Format24bppRgb)
                {
                    ColorManagementEngine = ColorManagementEngine.LittleCms,
                    DestinationProfile = ColorProfile.FromSrgb()
                };

                pipeline.Add(cc);
            }

            pipeline.Add(new JpegWriter(_fileCache.GetAbsolutePublicCachePath(fileName), 60));
            pipeline.Run();
            pipeline.DisposeAllElements();

            return _fileCache.GetRelativePublicCachePath(fileName);
        }

        private string GetImageTileJavaScript()
        {
            var webImageLoader = new WebImageLoader(this);

            webImageLoader.GenerateTiles();

            return webImageLoader.GetJavaScript();
        }

        private string GetRefreshImageTileJavaScript(RectangleF[] tiles)
        {
            var webImageLoader = new WebImageLoader(this);

            if (ImageLoadMode == ImageLoadMode.AdaptiveTile)
            {
                webImageLoader.GenerateRefreshTiles(tiles);
            }

            return webImageLoader.GetJavaScript();
        }

        private string SaveSourceFileToCache(string sourceImageFilePath, string extension)
        {
            if (!File.Exists(sourceImageFilePath))
                throw new FileNotFoundException("Cannot find the file specified", sourceImageFilePath);

            var fileName = Common.CalculateMD5(new FileInfo(sourceImageFilePath)) + extension;
            _fileCache.RegisterPrivateTempFileName(fileName, false);

            var filePath = _fileCache.GetAbsolutePrivateCachePath(fileName);
            if (!File.Exists(filePath))
                File.Copy(sourceImageFilePath, filePath);

            return fileName;
        }

        private string SaveBitmapToCache(Bitmap bitmap)
        {
            string tempFilePath = null;

            try
            {
                tempFilePath = Path.GetTempFileName();
                bitmap.Save(tempFilePath, new TiffSettings(CompressionType.Zip));

                return SaveSourceFileToCache(tempFilePath, ".tiff");
            }
            finally
            {
                if (tempFilePath != null && File.Exists(tempFilePath))
                    File.Delete(tempFilePath);
            }
        }

        #endregion Private memebrs

        #region Internal members

        // Returns whether we can calculate viewport size on server side
        internal bool DelayedTileLoad
        {
            get
            {
                bool flexibleSize = (Width.Type != UnitType.Pixel)
                    || (Height.Type != UnitType.Pixel);

                if (ZoomMode == ZoomMode.None || ZoomMode == ZoomMode.ZoomControl)
                {
                    if (_imageLoadMode == ImageLoadMode.AdaptiveTile)
                    {
                        return flexibleSize;
                    }

                    return false;
                }

                // For _imageLoadMode equals AdaptiveTile or RegularTile;
                // we can calculate tile coverage if control size is not flexible
                return flexibleSize;
            }
        }

        #endregion Internal members

        #region ICallBackDataHandler Members

        string ICallBackDataHandler.GetCallBackExecutionCode()
        {
            return GetState();
        }

        #endregion ICallBackDataHandler Members
    }
}