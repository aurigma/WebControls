// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls
{
    internal class WebImageLoader
    {
        private List<RectangleF> _tiles;
        private BitmapViewer _bitmapViewer;
        private Guid _filePrefix;
        private string _fileExtension;

        private WriterSettings _encoderOptions;

        private float _zoom100Threshold;

        private bool _useZoom100Threshold;

        static private float s_eps = 0.0001f;

        public WebImageLoader(BitmapViewer bitmapViewer)
        {
            _tiles = new List<RectangleF>();
            _bitmapViewer = bitmapViewer;
            _filePrefix = Guid.NewGuid();

            _encoderOptions = bitmapViewer.GetBrowserImageFormatEncoderOptions();
            _fileExtension = bitmapViewer.GetCacheFileExtension();

            // Zoom
            _zoom100Threshold = Math.Max(1 / BitmapViewer.ActualSizeHorizontalScale,
                1 / BitmapViewer.ActualSizeVerticalScale);

            _useZoom100Threshold = ((BitmapViewer.ZoomQuality == ZoomQuality.Low)
                || (BitmapViewer.ZoomQuality == ZoomQuality.ShrinkHighStretchLow))
                && (BitmapViewer.Zoom - _zoom100Threshold > s_eps);
        }

        public string GetJavaScript()
        {
            System.Globalization.NumberFormatInfo format = Common.GetNumberFormat();

            var js = new System.Text.StringBuilder();

            var fileCache = FileCache.GetInstance();
            var t = Guid.NewGuid().ToString();
            var baseName = _filePrefix + "_" + t + _fileExtension;
            baseName = fileCache.GetRelativePublicCachePath(baseName).Replace(t, "{0}");

            var zoom = _useZoom100Threshold ? _zoom100Threshold.ToString(format) : BitmapViewer.Zoom.ToString(format);

            js.Append("function(){return {baseName:\"" + baseName + "\",zoom:"
                + zoom + ",tiles:[");

            for (int i = 0; i < _tiles.Count; i++)
            {
                RectangleF tile = _tiles[i];

                if (i > 0)
                {
                    js.Append(",");
                }
                js.Append("{");
                js.Append(String.Format(format, "x:{0:F3},y:{1:F3},w:{2:F3},h:{3:F3}", tile.X, tile.Y, tile.Width, tile.Height));
                js.Append("}");
            }
            js.Append("]};}");
            return js.ToString();
        }

        public void GenerateTiles()
        {
            if (BitmapViewer.HasContent)
            {
                switch (BitmapViewer.ImageLoadMode)
                {
                    case ImageLoadMode.RegularTile:
                        int tileSize = BitmapViewer.TileSize;

                        int width = _bitmapViewer.ContentWidth;
                        int height = _bitmapViewer.ContentHeight;

                        int rowCount = (height - 1) / tileSize + 1;
                        int columnCount = (width - 1) / tileSize + 1;

                        float zoom = _bitmapViewer.Zoom;
                        float vs = _bitmapViewer.ActualSizeVerticalScale;
                        float hs = _bitmapViewer.ActualSizeHorizontalScale;

                        var bounds = new List<RectangleF>();

                        for (int i = 0; i < rowCount; i++)
                            for (int j = 0; j < columnCount; j++)
                            {
                                int columnWidth = (j == columnCount - 1) ? width - (tileSize * (columnCount - 1)) : tileSize;
                                int rowHeight = (i == rowCount - 1) ? height - (tileSize * (rowCount - 1)) : tileSize;

                                var tileBounds = new RectangleF(j * tileSize / (zoom * hs), i * tileSize / (zoom * vs), columnWidth / (zoom * hs), rowHeight / (zoom * vs));

                                bounds.Add(tileBounds);
                            }

                        AddTiles(bounds);

                        break;

                    case ImageLoadMode.AdaptiveTile:

                        var viewportBounds = BitmapViewer.ViewportBounds;

                        if (!viewportBounds.IsEmpty)
                            AddTiles(new[] { viewportBounds });

                        break;

                    case ImageLoadMode.Entire:
                        AddTiles(new[] { new RectangleF(0, 0, BitmapViewer.SourceImageParams.Width, BitmapViewer.SourceImageParams.Height) });
                        break;
                }
            }
        }

        private void AddTiles(IEnumerable<RectangleF> boundsForSourceResolution)
        {
            int resizedWidth, resizedHeight;

            var readChain = new List<PipelineElement>();

            var reader = ImageReader.Create(GetSourceFilename());
            readChain.Add(reader);

            if (!_useZoom100Threshold)
            {
                var resize = new Resize(_bitmapViewer.ContentWidth, _bitmapViewer.ContentHeight, BitmapViewer.InterpolationMode);
                readChain.Last().Receivers.Add(resize);
                readChain.Add(resize);

                resizedWidth = _bitmapViewer.ContentWidth;
                resizedHeight = _bitmapViewer.ContentHeight;
            }
            else
            {
                resizedWidth = reader.Width;
                resizedHeight = reader.Height;
            }

            var pipelines = new List<Pipeline>();

            var zoom = _bitmapViewer.Zoom;
            var hs = _bitmapViewer.ActualSizeHorizontalScale;
            var vs = _bitmapViewer.ActualSizeVerticalScale;

            foreach (var bound in boundsForSourceResolution)
            {
                if (bound.X < 0 || bound.Y < 0)
                    continue;

                Rectangle tileBound;

                if (!_useZoom100Threshold)
                    tileBound = Rectangle.Round(new RectangleF(bound.X * zoom * hs, bound.Y * zoom * vs, bound.Width * zoom * hs, bound.Height * zoom * vs));
                else
                    tileBound = Rectangle.Round(bound);

                if (tileBound.X + tileBound.Width > resizedWidth || tileBound.Y + tileBound.Height > resizedHeight)
                {
                    tileBound.Width = resizedWidth - tileBound.X;

                    tileBound.Height = resizedHeight - tileBound.Y;
                }

                if (tileBound.Width == 0 || tileBound.Height == 0)
                    continue;

                var pipeline = CreateTilePipeline(tileBound);
                pipelines.Add(pipeline);
                readChain.Last().Receivers.Add(pipeline.Build());

                _tiles.Add(bound);
            }

            if (readChain.Last().Receivers.Count > 0)
                Pipeline.Run(reader);

            foreach (var pipeline in pipelines)
                pipeline.DisposeAllElements();

            foreach (var element in readChain)
                element.Dispose();
        }

        private Pipeline CreateTilePipeline(Rectangle boundsOnResizedImage)
        {
            var tilePipeline = new Pipeline();

            var fileCache = FileCache.GetInstance();

            var fileName = _filePrefix + "_" + _tiles.Count + _fileExtension;

            fileCache.RegisterPublicTempFileName(fileName, false);

            tilePipeline.Add(new Crop(boundsOnResizedImage));

            if ((_bitmapViewer.SourceImageParams.ColorProfile != null && _bitmapViewer.SourceImageParams.ColorProfile.ColorSpace == ColorSpace.Cmyk)
                || _bitmapViewer.SourceImageParams.PixelFormat.HasAlpha)
            {
                var cc = new Transforms.ColorConverter(PixelFormat.Format24bppRgb)
                {
                    ColorManagementEngine =
                                     ColorManagementEngine.LittleCms,
                    DestinationProfile = ColorProfile.FromSrgb()
                };

                tilePipeline.Add(cc);
            }

            tilePipeline.Add(ImageWriter.Create(fileCache.GetAbsolutePublicCachePath(fileName), _encoderOptions));

            return tilePipeline;
        }

        public void GenerateRefreshTiles(RectangleF[] tiles)
        {
            if (BitmapViewer.HasContent)
                AddTiles(tiles);
        }

        protected BitmapViewer BitmapViewer
        {
            get
            {
                return _bitmapViewer;
            }
        }

        private string GetSourceFilename()
        {
            return FileCache.GetInstance().GetAbsolutePrivateCachePath(_bitmapViewer.SourceCacheFilename);
        }
    }
}