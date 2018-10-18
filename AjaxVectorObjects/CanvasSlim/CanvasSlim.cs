// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg;
using Aurigma.GraphicsMill.Codecs;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class CanvasSlim : ICanvas
    {
        private readonly ISerializer _serializer = new SvgSerializer();
        private readonly JsonVOSerializer _jsonSerializer = new JsonVOSerializer();

        public CanvasSlim()
        {
            MaxJsonLength = 100 * 1024 * 1024; // 100 MB
            Layers = new LayerCollection(this);

            Tags = new Dictionary<string, object>();

            ScreenXDpi = 96F;
            ScreenYDpi = 96F;
            Zoom = 1;

            MultipleSelectionEnabled = false;
            MouseMoveTimeout = 100;
        }

        #region ColorManagement

        private readonly ColorManagement _colorManagement = new ColorManagement();

        public void Dispose()
        {
            _colorManagement.Dispose();
        }

        public ColorProfile RgbColorProfile
        {
            get { return _colorManagement.RgbColorProfile; }
            set { _colorManagement.RgbColorProfile = value; }
        }

        public string RgbColorProfileFileId
        {
            get { return _colorManagement.RgbColorProfileFileId; }
            set { _colorManagement.RgbColorProfileFileId = value; }
        }

        public ColorProfile CmykColorProfile
        {
            get { return _colorManagement.CmykColorProfile; }
            set { _colorManagement.CmykColorProfile = value; }
        }

        public string CmykColorProfileFileId
        {
            get { return _colorManagement.CmykColorProfileFileId; }
            set { _colorManagement.CmykColorProfileFileId = value; }
        }

        public ColorProfile GrayscaleColorProfile
        {
            get { return _colorManagement.GrayscaleColorProfile; }
            set { _colorManagement.GrayscaleColorProfile = value; }
        }

        public string GrayscaleColorProfileFileId
        {
            get { return _colorManagement.GrayscaleColorProfileFileId; }
            set { _colorManagement.GrayscaleColorProfileFileId = value; }
        }

        public bool PreviewColorManagementEnabled { get; set; }

        public bool PrintColorManagementEnabled { get; set; }

        public ColorSpace? PreviewTargetColorSpace
        {
            get { return _colorManagement.TargetColorSpace; }
            set { _colorManagement.TargetColorSpace = value; }
        }

        public ColorManagement GetColorManagement(bool isPreview)
        {
            return (isPreview && PreviewColorManagementEnabled || !isPreview && PrintColorManagementEnabled) ? _colorManagement : null;
        }

        #endregion ColorManagement

        public string Data
        {
            get
            {
                var colorManagement = GetColorManagement(true);
                if (colorManagement != null)
                    colorManagement.InitPreviewColorMap(GetColors());

                _jsonSerializer.ColorManagement = colorManagement;

                return _jsonSerializer.Serialize(new CanvasData(this));
            }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    var d = _jsonSerializer.Deserialize<CanvasData>(value);
                    d.ApplyState(this);
                }
            }
        }

        public IEnumerable<Color> GetColors()
        {
            return from layer in Layers from vObject in layer.VObjects from color in vObject.GetColors() select color;
        }

        public int MaxJsonLength { get; set; }

        public void Serialize(Stream stream)
        {
            _serializer.Serialize(this, stream);
        }

        public void Deserialize(Stream stream)
        {
            _serializer.Deserialize(stream, this);
        }

        public LayerCollection Layers { get; private set; }

        public float WorkspaceHeight { get; set; }

        public float WorkspaceWidth { get; set; }

        public float ScreenXDpi { get; set; }

        public float ScreenYDpi { get; set; }

        public float? TargetDpi { get; set; }

        public event EventHandler ZoomChanged
        {
            add { }
            remove { }
        }

        public float Zoom
        {
            get;

            set;
        }

        public Dictionary<string, object> Tags { get; private set; }

        public bool MultipleSelectionEnabled { get; set; }

        public int MouseMoveTimeout { get; set; }

        public bool DisableSmoothing { get; set; }

        /// <summary>
        /// Render canvas workspace to bitmap
        /// </summary>
        /// <param name="dpi">DPI</param>
        /// <param name="colorSpace">Color Space</param>
        /// <param name="backgroundColor">Background color for the rendered bitmap</param>
        /// <param name="isPreview"></param>
        /// <returns>Rendered Bitmap</returns>
        public Bitmap RenderWorkspace(float dpi, ColorSpace colorSpace, Color backgroundColor, bool isPreview)
        {
            return new Renderer().Render(this, dpi, colorSpace, backgroundColor, isPreview);
        }

        /// <summary>
        /// Render canvas workspace using pipeline
        /// </summary>
        /// <param name="writer">Image writer</param>
        /// <param name="dpi">DPI of the rendered image</param>
        /// <param name="colorSpace">Color space of the rendered image</param>
        /// <param name="backgroundColor">Background color for the rendered image</param>
        /// <param name="isPreview"></param>
        public void RenderWorkspace(PipelineElement writer, float dpi, ColorSpace colorSpace, Color backgroundColor, bool isPreview)
        {
            new Renderer().Render(writer, this, dpi, colorSpace, backgroundColor, isPreview);
        }

        public void RenderWorkspaceToPdf(PdfWriter writer, float dpi, ColorSpace colorSpace, Color backgroundColor, SizeF documentSize)
        {
            new Renderer().Render(writer, this, dpi, colorSpace, backgroundColor, false, documentSize);
        }
    }
}