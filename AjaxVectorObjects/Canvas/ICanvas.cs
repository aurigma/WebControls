// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface ICanvas : IDisposable
    {
        #region Color Management

        ColorProfile RgbColorProfile { get; set; }
        string RgbColorProfileFileId { get; set; }
        ColorProfile CmykColorProfile { get; set; }
        string CmykColorProfileFileId { get; set; }
        ColorProfile GrayscaleColorProfile { get; set; }
        string GrayscaleColorProfileFileId { get; set; }
        bool PreviewColorManagementEnabled { get; set; }
        bool PrintColorManagementEnabled { get; set; }
        ColorSpace? PreviewTargetColorSpace { get; set; }

        ColorManagement GetColorManagement(bool isPreview);

        #endregion Color Management

        #region Serialization

        string Data { get; set; }
        int MaxJsonLength { get; set; }

        IEnumerable<Color> GetColors();

        void Serialize(Stream stream);

        void Deserialize(Stream stream);

        #endregion Serialization

        LayerCollection Layers { get; }

        float WorkspaceHeight { get; set; }
        float WorkspaceWidth { get; set; }

        float ScreenXDpi { get; }
        float ScreenYDpi { get; }
        float? TargetDpi { get; set; }

        event EventHandler ZoomChanged;

        float Zoom { get; }

        Dictionary<string, object> Tags { get; }

        bool MultipleSelectionEnabled { get; set; }
        int MouseMoveTimeout { get; set; }
        bool DisableSmoothing { get; set; }

        /// <summary>
        /// Render canvas workspace
        /// </summary>
        /// <param name="dpi">DPI of the rendered bitmap</param>
        /// <param name="colorSpace">Color space of the rendered bitmap</param>
        /// <param name="backgroundColor">Background color for the rendered bitmap</param>
        /// <param name="isPreview"></param>
        /// <returns>Rendered bitmap</returns>
        Bitmap RenderWorkspace(float dpi, ColorSpace colorSpace, Color backgroundColor, bool isPreview = false);

        /// <summary>
        /// Render canvas workspace using pipeline.
        /// </summary>
        /// <param name="writer">Image writer</param>
        /// <param name="dpi">DPI of the rendered bitmap</param>
        /// <param name="colorSpace">Color space of the rendered bitmap</param>
        /// <param name="backgroundColor">Background color for the rendered bitmap</param>
        /// <param name="isPreview"></param>
        void RenderWorkspace(PipelineElement writer, float dpi, ColorSpace colorSpace, Color backgroundColor, bool isPreview = false);

        void RenderWorkspaceToPdf(PdfWriter writer, float dpi, ColorSpace colorSpace, Color backgroundColor, SizeF documentSize);
    }
}