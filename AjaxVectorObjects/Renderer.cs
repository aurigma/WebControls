// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Resources;
using Aurigma.GraphicsMill.Codecs;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using PointF = System.Drawing.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class Renderer
    {
        public Bitmap Render(ICanvas canvas, float dpi, ColorSpace colorSpace, Color backgroundColor, bool isPreview = false)
        {
            var workspace = new SizeF(canvas.WorkspaceWidth, canvas.WorkspaceHeight);
            var colorManagement = canvas.GetColorManagement(isPreview);

            return RenderLayers(canvas.Layers, workspace, dpi, colorSpace, backgroundColor, isPreview, colorManagement, canvas.TargetDpi);
        }

        public Bitmap RenderLayers(
            IEnumerable<Layer> layers,
            SizeF workspace,
            float dpi = 300f,
            ColorSpace colorSpace = ColorSpace.Rgb,
            Color backgroundColor = null,
            bool isPreview = false,
            ColorManagement colorManagement = null,
            float? targetDpi = null)
        {
            var bitmap = new Bitmap();
            RenderLayers(bitmap, layers, workspace, dpi, colorSpace, backgroundColor, isPreview, workspace, colorManagement, targetDpi);
            return bitmap;
        }

        public void Render(PipelineElement writer, ICanvas canvas, float dpi, ColorSpace colorSpace, Color backgroundColor, bool isPreview = false, SizeF documentSize = new SizeF())
        {
            var workspace = new SizeF(canvas.WorkspaceWidth, canvas.WorkspaceHeight);
            var colorManagement = canvas.GetColorManagement(isPreview);

            RenderLayers(writer, canvas.Layers, workspace, dpi, colorSpace, backgroundColor, isPreview, documentSize, colorManagement, canvas.TargetDpi);
        }

        public void RenderLayers(PipelineElement writer,
            IEnumerable<Layer> layers,
            SizeF workspace,
            float dpi = 300f,
            ColorSpace colorSpace = ColorSpace.Rgb,
            Color backgroundColor = null,
            bool isPreview = false,
            SizeF document = new SizeF(),
            ColorManagement colorManagement = null,
            float? targetDpi = null
            )
        {
            if (workspace.Width <= 0 || workspace.Height <= 0)
                throw new ArgumentException(null, "workspace");

            if (dpi <= 0)
                throw new ArgumentOutOfRangeException("dpi", dpi, Exceptions.DpiOutOfRange);

            colorSpace = colorSpace == ColorSpace.Unknown ? ColorSpace.Rgb : colorSpace;

            if (colorSpace != ColorSpace.Cmyk && colorSpace != ColorSpace.Grayscale && colorSpace != ColorSpace.Rgb)
                throw new ArgumentException(null, "colorSpace");

            // Turn on proofing if (colorManagement != null && isPreview)
            var initialTargetColorSpace = colorManagement != null ? colorManagement.TargetColorSpace : null;
            if (colorManagement != null)
            {
                colorManagement.TargetColorSpace = isPreview ? new ColorSpace?(colorSpace) : null;
                colorSpace = isPreview ? ColorSpace.Rgb : colorSpace;
            }

            backgroundColor = backgroundColor ?? ColorManagement.GetWhiteColor(colorSpace);

            var format = ColorManagement.GetPixelFormat(colorSpace);
            var profile = ColorManagement.GetProfile(colorManagement, colorSpace, isPreview);

            var pixelSize = new Size(
                Common.ConvertPointsToPixels(dpi, workspace.Width),
                Common.ConvertPointsToPixels(dpi, workspace.Height));

            var pdfWriter = writer as PdfWriter;
            if (pdfWriter != null)
            {
                var docWidth = pixelSize.Width;
                var docHeight = pixelSize.Height;
                var scale = 1f;
                var offset = PointF.Empty;
                if (!document.IsEmpty)
                {
                    docWidth = Common.ConvertPointsToPixels(dpi, document.Width);
                    docHeight = Common.ConvertPointsToPixels(dpi, document.Height);

                    var scaleX = docWidth / (float)pixelSize.Width;
                    var scaleY = docHeight / (float)pixelSize.Height;

                    scale = System.Math.Min(scaleX, scaleY);
                    if (Utils.EqualsOfFloatNumbers(scaleX, scaleY, 0.001f))
                    {
                        scale = (float)System.Math.Round(scale, 2);
                        docWidth = Common.ConvertPointsToPixels(dpi, workspace.Width * scale);
                        docHeight = Common.ConvertPointsToPixels(dpi, workspace.Height * scale);
                    }
                    else
                    {
                        offset.X = (docWidth - pixelSize.Width * scale) / 2f;
                        offset.Y = (docHeight - pixelSize.Height * scale) / 2f;
                    }
                }

                pdfWriter.AddPage(docWidth, docHeight, dpi, dpi, backgroundColor, profile);
                using (var graphics = pdfWriter.GetGraphics())
                {
                    var path = new Path();
                    path.DrawRectangle(0, 0, pixelSize.Width, pixelSize.Height);

                    graphics.Transform.Scale(scale, scale, MatrixOrder.Append);
                    graphics.Transform.Translate(offset.X, offset.Y, MatrixOrder.Append);
                    graphics.ClippingPaths.Add(path);

                    var vObjects = GetVObjects(layers, workspace).ToArray();

                    using (var imageParams = new ImageGenerator(pixelSize, format, backgroundColor) { DpiX = dpi, DpiY = dpi, ColorProfile = profile })
                    {
                        if (colorManagement != null)
                            colorManagement.InitColorMap(from v in vObjects from c in v.GetColors() select c, imageParams);

                        DrawVObjects(vObjects, graphics, imageParams, colorManagement);
                    }

                    graphics.ClippingPaths.Remove(path);
                    graphics.Transform.Translate(-offset.X, -offset.Y, MatrixOrder.Append);
                    graphics.Transform.Scale(1 / scale, 1 / scale, MatrixOrder.Append);
                }
            }
            else
            {
                var vObjectGroups = new List<List<VObject>>();
                List<VObject> currentVObjectGroup = null;
                List<VObject> currentImageVObjectGroup = null;

                var vObjects = GetVObjects(layers, workspace).ToArray();

                foreach (var vObject in vObjects)
                {
                    if (vObject is IPipelineExtender)
                    {
                        if (currentVObjectGroup != null)
                        {
                            vObjectGroups.Add(currentVObjectGroup);
                            currentVObjectGroup = null;
                        }

                        if (currentImageVObjectGroup == null)
                            currentImageVObjectGroup = new List<VObject>();

                        currentImageVObjectGroup.Add(vObject);
                    }
                    else
                    {
                        if (currentImageVObjectGroup != null)
                        {
                            vObjectGroups.Add(currentImageVObjectGroup);
                            currentImageVObjectGroup = null;
                        }

                        if (currentVObjectGroup == null)
                            currentVObjectGroup = new List<VObject>();

                        currentVObjectGroup.Add(vObject);
                    }
                }

                if (currentVObjectGroup != null)
                    vObjectGroups.Add(currentVObjectGroup);

                if (currentImageVObjectGroup != null)
                    vObjectGroups.Add(currentImageVObjectGroup);

                var pipeline = new Pipeline();
                var deps = new List<IDisposable>();

                var scale = dpi / targetDpi ?? 1;

                try
                {
                    var bitmapGenerator = new ImageGenerator(pixelSize.Width, pixelSize.Height, format, backgroundColor)
                    {
                        DpiX = dpi / scale,
                        DpiY = dpi / scale,
                        ColorProfile = profile
                    };

                    if (colorManagement != null)
                        colorManagement.InitColorMap(from v in vObjects from c in v.GetColors() select c, bitmapGenerator);

                    pipeline.Add(bitmapGenerator);

                    foreach (var group in vObjectGroups)
                    {
                        if (group.Count == 0)
                            break;

                        if (group.FirstOrDefault() is IPipelineExtender)
                        {
                            foreach (var vObject in group)
                            {
                                IEnumerable<IDisposable> vObjectDeps;
                                ((IPipelineExtender)vObject).ExtendPipeline(pipeline, bitmapGenerator, colorManagement, scale, out vObjectDeps);
                                deps.AddRange(vObjectDeps);
                            }
                        }
                        else
                        {
                            var groupVObjects = group.ToArray();
                            var drawer = new Drawer();
                            drawer.Draw += (sender, e) =>
                            {
                                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                                    e.Graphics.Transform.Scale(scale, scale);

                                DrawVObjects(groupVObjects, e.Graphics, bitmapGenerator, colorManagement);

                                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                                    e.Graphics.Transform.Scale(1 / scale, 1 / scale);
                            };
                            pipeline.Add(drawer);
                        }
                    }

                    // Check if writer support pixel format with or without alpha.
                    if (!writer.IsPixelFormatSupported(bitmapGenerator.PixelFormat) &&
                        writer.IsPixelFormatSupported(PixelFormat.DiscardAlpha(bitmapGenerator.PixelFormat)))
                    {
                        pipeline.Add(new RemoveAlpha(backgroundColor));
                    }

                    if (!Utils.EqualsOfFloatNumbers(scale, 1))
                        pipeline.Add(new ResolutionModifier(dpi, dpi));

                    pipeline.Add(writer);
                    pipeline.Run();
                }
                finally
                {
                    pipeline.Remove(writer);
                    pipeline.DisposeAllElements();

                    if (deps != null)
                        foreach (var dep in deps)
                            dep.Dispose();

                    if (colorManagement != null)
                        colorManagement.TargetColorSpace = initialTargetColorSpace;
                }
            }

            if (colorManagement != null)
                colorManagement.TargetColorSpace = initialTargetColorSpace;
        }

        private static void DrawVObjects(IEnumerable<VObject> vObjects, Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            foreach (var vObject in vObjects)
                vObject.Draw(graphics, destImageParams, colorManagement);
        }

        private static IEnumerable<VObject> GetVObjects(IEnumerable<Layer> layers, SizeF workspace)
        {
            var bounds = new RectangleF(0, 0, workspace.Width, workspace.Height);
            return layers.Where(l => l.Visible).SelectMany(layer => layer.VObjects.Where(vo => vo.Visible && !vo.Permissions.NoPrint && bounds.IntersectsWith(vo.Bounds)));
        }
    }
}