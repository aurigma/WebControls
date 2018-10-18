// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Logger;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.Codecs;
using Aurigma.GraphicsMill.Codecs.Psd;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.IO;
using System.Net;
using CombineMode = Aurigma.GraphicsMill.Transforms.CombineMode;
using InterpolationMode = Aurigma.GraphicsMill.Transforms.InterpolationMode;
using Matrix = Aurigma.GraphicsMill.Transforms.Matrix;
using Rectangle = System.Drawing.Rectangle;
using RectangleF = System.Drawing.RectangleF;
using Size = System.Drawing.Size;
using SMath = System.Math;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{    
    public class ImageVObject : ContentVObject, IPipelineExtender
    {
        private readonly ILogger _logger = Configuration.Logger;
        private readonly ResizeInterpolationMode _resizeInterpolationMode = ResizeInterpolationMode.High;

        private bool _takeIntoAccountImageDpi = true;
        private string _remoteUrl;

        public ImageVObject()
            : this(false)
        { }

        public ImageVObject(bool takeIntoAccountImageDpi)
            : this(takeIntoAccountImageDpi, new PointF(0, 0))
        {
        }

        public ImageVObject(bool takeIntoAccountImageDpi, PointF location)
            : this(takeIntoAccountImageDpi, location, (float)0.1, (float)0.1)
        {
        }

        public ImageVObject(bool takeIntoAccountImageDpi, PointF location, float width, float height)
            : base(new RectangleF(location.X, location.Y, width, height))
        {
            NeedToDownloadImage = false;
            TakeIntoAccountImageDpi = takeIntoAccountImageDpi;
        }

        public ImageVObject(Bitmap bitmap)
            : this(bitmap, false)
        { }

        public ImageVObject(Bitmap bitmap, bool takeIntoAccountImageDpi)
            : this(bitmap, takeIntoAccountImageDpi, new PointF(0, 0))
        { }

        public ImageVObject(Bitmap bitmap, bool takeIntoAccountImageDpi, PointF location, float width, float height)
            : this(takeIntoAccountImageDpi, location, width, height)
        {
            Bitmap = bitmap;
        }

        public ImageVObject(Bitmap bitmap, bool takeIntoAccountImageDpi, PointF location)
            : this(bitmap,
            takeIntoAccountImageDpi,
            location,
            Common.ConvertPixelsToPoints(bitmap.DpiX, bitmap.Width),
            Common.ConvertPixelsToPoints(bitmap.DpiY, bitmap.Height))
        {
        }

        public ImageVObject(FileInfo imageFile, bool takeIntoAccountImageDpi = false)
            : this(takeIntoAccountImageDpi)
        {
            LoadImage(imageFile, true, true);
        }

        public ImageVObject(FileInfo imageFile, bool takeIntoAccountImageDpi, bool preserveAspectRatio, PointF location, float width, float height)
            : this(takeIntoAccountImageDpi, location, width, height)
        {
            LoadImage(imageFile, false, preserveAspectRatio);
        }

        public ImageVObject(string storageId, bool takeIntoAccountImageDpi = false)
            : this(takeIntoAccountImageDpi)
        {
            LoadImage(storageId, true, true);
        }

        public ImageVObject(string storageId, bool takeIntoAccountImageDpi, bool preserveAspectRatio, PointF location, float width, float height)
            : this(takeIntoAccountImageDpi, location, width, height)
        {
            LoadImage(storageId, false, preserveAspectRatio);
        }

        public ImageVObject(Uri imageUri, bool takeIntoAccountImageDpi)
            : this(takeIntoAccountImageDpi)
        {
            // if download to cache then set size the same as image
            LoadImageFromRemoteUrl(imageUri, true, true);
        }

        public ImageVObject(Uri imageUri)
            : this(imageUri, true)
        { }

        /// <summary>
        /// Get or set bitmap. If no cached image bitmap property return null.
        /// It is original loaded bitmap, transforms are not applied.
        /// </summary>
        public Bitmap Bitmap
        {
            get
            {
                if (Configuration.FileCache.FileExists(SourceFileId))
                {
                    try
                    {
                        using (var sourceStream = Configuration.FileCache.GetReadStream(SourceFileId, true))
                            return new Bitmap(sourceStream);
                    }
                    catch (GMException ex)
                    {
                        _logger.Warning(string.Format("Unable read source image with file id {0}", SourceFileId), ex);
                    }
                    catch (FileStorageException ex)
                    {
                        _logger.Error(string.Format("Unable get source image file with id {0} from storage", SourceFileId), ex);
                    }
                }

                return null;
            }

            set
            {
                if (value != null)
                {
                    LoadImage(value);
                }
                else
                {
                    SourceFileId = null;
                    SourceImageWidth = 0;
                    SourceImageHeight = 0;
                }

                _remoteUrl = null;
                OnChanged();
            }
        }

        /// <summary>
        /// Get url to the remote image. If local source set then return null.
        /// </summary>
        public string RemoteUrl
        {
            get
            {
                return string.IsNullOrEmpty(SourceFileId) ? _remoteUrl : null;
            }

            set { _remoteUrl = value; }
        }

        /// <summary>
        /// Load image from file to ImageVObject.
        /// </summary>
        /// <param name="sourceImage">Image file</param>
        /// <param name="actualSize">If true, set size of ImageVObject the same as size of loaded image.</param>
        /// <param name="preserveAspectRatio">If true, decrease width or height of ImageVObject to save aspect ratio of loaded image.
        /// Not applicable if actualSize parameter is true.</param>
        /// <param name="allowImageFileDelete">If true image file can be moved or removed</param>
        public void LoadImage(FileInfo sourceImage, bool actualSize, bool preserveAspectRatio, bool allowImageFileDelete = false)
        {
            var storageFileId = Configuration.FileCache.AddFile(sourceImage.FullName, true);

            try
            {
                if (allowImageFileDelete)
                    sourceImage.Delete();
            }
            catch (Exception ex)
            {
                _logger.Warning(string.Format("Unable to delete {0} file.", sourceImage.Name), ex);
            }

            LoadImage(storageFileId, actualSize, preserveAspectRatio);
        }

        public void LoadImage(string storageFileId, bool actualSize, bool preserveAspectRatio)
        {
            SourceFileId = storageFileId;

            Size size;
            float hres, vres;

            Common.GetImageSize(storageFileId, out size, out hres, out vres);

            SourceImageWidth = size.Width;
            SourceImageHeight = size.Height;
            SourceImageHorizontalResolution = hres;
            SourceImageVerticalResolution = vres;

            _remoteUrl = null;

            if (actualSize)
            {
                float xDpi = 72, yDpi = 72;

                if (Canvas != null)
                {
                    xDpi = Canvas.ScreenXDpi;
                    yDpi = Canvas.ScreenYDpi;
                }

                var r = Rectangle;
                if (TakeIntoAccountImageDpi)
                {
                    r.Width = Common.ConvertPixelsToPoints(hres, size.Width);
                    r.Height = Common.ConvertPixelsToPoints(vres, size.Height);
                }
                else
                {
                    r.Width = Common.ConvertPixelsToPoints(xDpi, size.Width);
                    r.Height = Common.ConvertPixelsToPoints(yDpi, size.Height);
                }

                // change control points so we can reset transform and get image with properly aspect ratio
                ChangeControlPoints(0, 0, r.Width, r.Height);
                Rectangle = r;
            }
            else if (preserveAspectRatio)
            {
                double width, height;
                if (TakeIntoAccountImageDpi)
                {
                    width = Common.ConvertPixelsToPoints(SourceImageHorizontalResolution, SourceImageWidth.Value);
                    height = Common.ConvertPixelsToPoints(SourceImageVerticalResolution, SourceImageHeight.Value);
                }
                else
                {
                    width = SourceImageWidth.Value;
                    height = SourceImageHeight.Value;
                }

                var r = Rectangle;
                var dx = width / r.Width;
                var dy = height / r.Height;
                var d = dx > dy ? dx : dy;
                r.Width = (float)(width / d);
                r.Height = (float)(height / d);

                // change control points so we can reset transform and get image with properly aspect ratio
                ChangeControlPoints(0, 0, r.Width, r.Height);
                Rectangle = r;
            }
            else
            {
                OnChanged();
            }
        }

        public void LoadImage(PipelineElement reader, float opacity = 1, FileFormat fileFormat = FileFormat.Tiff, bool actualSize = false, bool preserveAspectRatio = false)
        {
            string storageId;
            using (var stream = new MemoryStream())
            using (var writer = ImageWriter.Create(fileFormat, stream))
            {
                if (writer is TiffWriter)
                    (writer as TiffWriter).Compression = CompressionType.Zip;

                var pipeline = new Pipeline(reader);

                if (!Utils.EqualsOfFloatNumbers(opacity, 1f))
                {
                    var scaleAlpha = new ScaleAlpha(opacity);
                    pipeline.Add(scaleAlpha);
                }

                pipeline.Add(writer);

                pipeline.Run();
                pipeline.Remove(reader);
                pipeline.DisposeAllElements();

                stream.Position = 0;

                storageId = Configuration.FileCache.AddFile(Common.GetImageExtension(fileFormat), stream, true);
            }

            LoadImage(storageId, actualSize, preserveAspectRatio);
        }

        public void LoadImage(FileInfo imageFile, bool actualSize)
        {
            LoadImage(imageFile, actualSize, true);
        }

        /// <summary>
        /// Load image from stream to ImageVObject.
        /// </summary>
        /// <param name="imageStream">Image stream</param>
        /// <param name="actualSize">If true, set size of ImageVObject the same as size of loaded image.</param>
        /// <param name="preserveAspectRatio">If true, decrease width or height to save aspect ratio of loaded image. Not applicable if actualSize parameter is true.</param>
        public void LoadImage(Stream imageStream, bool actualSize, bool preserveAspectRatio)
        {
            if (imageStream.CanSeek)
            {
                var extension = Common.GetImageExtension(imageStream);

                var fileStorageId = Configuration.FileCache.AddFile(extension, imageStream, true);

                LoadImage(fileStorageId, actualSize, preserveAspectRatio);
            }
            else
            {
                var tempFilePath = Common.GetTempFilePath("tmp");

                try
                {
                    using (var tempFileStream = new FileStream(tempFilePath, FileMode.CreateNew, FileAccess.Write))
                        Common.CopyStream(imageStream, tempFileStream);

                    LoadImage(new FileInfo(tempFilePath), actualSize, preserveAspectRatio, allowImageFileDelete: true);
                }
                finally
                {
                    if (File.Exists(tempFilePath))
                        File.Delete(tempFilePath);
                }
            }
        }

        public bool TakeIntoAccountImageDpi
        {
            get { return _takeIntoAccountImageDpi; }
            internal set { _takeIntoAccountImageDpi = value; }
        }

        /// <summary>
        /// Load image from URL to ImageVObject.
        /// </summary>
        /// <param name="imageUri">URL to image</param>
        /// <param name="actualSize">If true, set size of ImageVObject the same as size of loaded image.
        /// Not applicable if downloadToCache is false.</param>
        /// <param name="preserveAspectRatio">If true, decrease width or height to save aspect ratio of loaded image. Not applicable if actualSize parameter is true or downloadToCache is false.</param>
        public void LoadImageFromRemoteUrl(Uri imageUri, bool actualSize, bool preserveAspectRatio)
        {
            NeedToDownloadImage = false;

            try
            {
                if (Configuration.Instance.AllowDownloadImageToCache)
                {
                    var client = new WebClient();

                    try
                    {
                        var webStream = client.OpenRead(imageUri);

                        LoadImage(webStream, actualSize, preserveAspectRatio);
                    }
                    catch (WebException ex)
                    {
                        throw ExceptionFactory.BadRequest(imageUri.AbsoluteUri, ex);
                    }
                }
                else
                    throw ExceptionFactory.DownloadDeny();
            }
            catch (Exception ex)
            {
                throw ExceptionFactory.CanNotDownloadImage(ex);
            }
        }

        public void Update(bool actualSize, bool preserveAspectRatio, string sourceUrl = null)
        {
            if (NeedToDownloadImage && sourceUrl != null)
            {
                Uri imageUri;
                try
                {
                    imageUri = new Uri(sourceUrl);
                }
                catch (UriFormatException ex)
                {
                    throw ExceptionFactory.SourceFormat(ex);
                }

                LoadImageFromRemoteUrl(imageUri, actualSize, preserveAspectRatio);

                NeedToDownloadImage = false;
            }
            else if (SourceFileId != null)
            {
                LoadImage(SourceFileId, actualSize, preserveAspectRatio);
            }
        }

        internal bool NeedToDownloadImage { get; set; }

        public bool IsLocalImage
        {
            get
            {
                return !string.IsNullOrEmpty(SourceFileId);
            }
        }

        internal int? SourceImageWidth { get; set; }

        internal int? SourceImageHeight { get; set; }

        internal float SourceImageHorizontalResolution { get; set; }

        internal float SourceImageVerticalResolution { get; set; }

        public string SourceFileId { get; set; }

        public override VObjectData GetVObjectData()
        {
            return new ImageVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "ImageVObjectData";
        }

        protected internal override RotatedRectangleF GetDrawingRectangle(float dpi = 72)
        {
            return new RotatedRectangleF(GetImageRectangle(dpi), (float)Angle);
        }

        internal Rectangle GetImageRectangle(float dpi)
        {
            var rect = Rectangle.ToRectangleF();
            var mul = dpi / 72f;
            var values = new[] { rect.X * mul, rect.Y * mul, rect.Width * mul, rect.Height * mul };

            // BUG 0015690
            for (int i = 0; i < values.Length; i++)
            {
                var v = SMath.Round(values[i]);
                if (SMath.Abs(v - values[i]) < 0.01f)
                {
                    values[i] = (float)v;
                }
            }

            int x = (int)SMath.Floor(values[0]);
            int y = (int)SMath.Floor(values[1]);
            int width = (int)SMath.Ceiling(values[2]);
            int height = (int)SMath.Ceiling(values[3]);

            return new Rectangle(x, y, width, height);
        }

        protected internal override void DrawContent(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            if (!Configuration.FileCache.FileExists(SourceFileId))
                return;

            using (var stream = Configuration.FileCache.GetReadStream(SourceFileId, true))
            using (var reader = ImageReader.Create(stream))
            {
                IImageParams firstElement;
                var psdReader = reader as PsdReader;
                if (psdReader != null)
                    firstElement = psdReader.MergedImageFrame;
                else
                    firstElement = reader;

                var pipeline = new Pipeline((PipelineElement)firstElement);

                if (!Utils.EqualsOfFloatNumbers(graphics.DpiX, firstElement.DpiX) ||
                    !Utils.EqualsOfFloatNumbers(graphics.DpiY, firstElement.DpiY))
                    pipeline.Add(new ResolutionModifier(graphics.DpiX, graphics.DpiY));

                var imageRect = GetImageRectangle(graphics.DpiX);
                if (firstElement.Width != imageRect.Width || firstElement.Height != imageRect.Height)
                    pipeline.Add(new Resize(imageRect.Width, imageRect.Height, _resizeInterpolationMode));

                var colorConverter = ColorManagement.GetColorConverter(colorManagement, firstElement, destImageParams);
                if (colorConverter != null)
                    pipeline.Add(colorConverter);

                pipeline.Add(new ScaleAlpha(Opacity));

                var dpi = graphics.DpiX;
                var angle = (float)Angle;
                var center = GetDrawingRectangle(dpi).Center.ToPointF();

                var points = new[] { center };
                graphics.Transform.TransformPoints(points);
                center = points[0];

                graphics.Transform.RotateAt(angle, center, MatrixOrder.Append);

                var location = imageRect.Location;
                graphics.DrawImage(pipeline, location.X, location.Y, Opacity);

                graphics.Transform.RotateAt(-angle, center, MatrixOrder.Append);
            }
        }

        public bool CanExtendPipeline
        {
            get
            {
                return true;
            }
        }

        public void ExtendPipeline(Pipeline pipeline, IImageParams destImageParams, ColorManagement colorManagement, float scale, out IEnumerable<IDisposable> deps)
        {
            deps = new List<IDisposable>();

            pipeline.Add(GetShapeDrawer(destImageParams, colorManagement, scale));

            var scaleAlpha = new ScaleAlpha(Opacity);
            var combiner = GetImageCombiner(destImageParams, colorManagement, scale, deps, scaleAlpha);
            if (combiner != null)
                pipeline.Add(combiner);
        }

        internal Combiner GetImageCombiner(IImageParams destImageParams, ColorManagement colorManagement, float scale, IEnumerable<IDisposable> deps, ScaleAlpha alpha)
        {
            if (!Configuration.FileCache.FileExists(SourceFileId))
                return null;

            var imageStream = Configuration.FileCache.GetReadStream(SourceFileId, true);
            ((IList)deps).Add(imageStream);

            var reader = ImageReader.Create(imageStream);
            ((IList)deps).Add(reader);

            IImageParams firstElement;
            var psdReader = reader as PsdReader;
            if (psdReader != null)
                firstElement = psdReader.MergedImageFrame;
            else
                firstElement = reader;

            var pipeline = new Pipeline((PipelineElement)firstElement);

            var dpi = destImageParams.DpiX * scale;
            var imageRect = GetImageRectangle(dpi);

            if (firstElement.Width != imageRect.Width || firstElement.Height != imageRect.Height)
            {
                pipeline.Add(new Resize(imageRect.Width, imageRect.Height, _resizeInterpolationMode));
            }

            if (alpha != null)
                pipeline.Add(alpha);

            // Convert color of image
            var colorConverter = ColorManagement.GetColorConverter(colorManagement, firstElement, destImageParams);
            if (colorConverter != null)
                pipeline.Add(colorConverter);

            if (!Angle.Equals(0))
            {
                // Don't rotate bitmap without alpha channel.
                if (!firstElement.PixelFormat.HasAlpha)
                {
                    // Add alpha channel if scaleAlpha or color conversion does not add it
                    if (alpha == null && (colorConverter == null || !colorConverter.DestinationPixelFormat.HasAlpha))
                        pipeline.Add(new SetAlpha(1));
                }

                var rotate = new MatrixTransform
                {
                    Matrix = Matrix.CreateRotate((float)Angle),
                    InterpolationMode = InterpolationMode.High,
                    BackgroundColor = ColorManagement.GetTransparentColor(destImageParams.PixelFormat)
                };

                pipeline.Add(rotate);
            }

            var imageLocation = GetDrawingRectangle(dpi).Bounds.Location;
            var imageCombiner = new Combiner(CombineMode.AlphaOverlay, pipeline, true)
            {
                X = (int)imageLocation.X,
                Y = (int)imageLocation.Y
            };

            return imageCombiner;
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}