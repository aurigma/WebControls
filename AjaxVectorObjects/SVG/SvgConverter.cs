// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.Svg;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using Path = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgConverter
    {
        private BaseArchive _fileStorage;
        private JsonVOSerializer _serializer = new JsonVOSerializer();

        public SvgConverter(BaseArchive fileStorage)
        {
            _fileStorage = fileStorage;
        }

        internal SvgConverter()
        {
        }

        public SvgDocument ToSvg(ICanvas canvas)
        {
            var svgDoc = new SvgDocument();

            svgDoc.Width = canvas.WorkspaceWidth * canvas.ScreenXDpi / 72;
            svgDoc.Height = canvas.WorkspaceHeight * canvas.ScreenYDpi / 72;
            svgDoc.ViewBox = new RectangleF(0, 0, canvas.WorkspaceWidth, canvas.WorkspaceHeight);

            svgDoc.CustomAttributes.Add(new SvgVoAttribute("print-color-management-enabled", canvas.PrintColorManagementEnabled));
            svgDoc.CustomAttributes.Add(new SvgVoAttribute("preview-color-management-enabled", canvas.PreviewColorManagementEnabled));
            if (canvas.PreviewTargetColorSpace.HasValue)
                svgDoc.CustomAttributes.Add(new SvgVoAttribute("preview-target-color-space", canvas.PreviewTargetColorSpace.Value.ToString()));

            if (canvas.Tags != null)
                svgDoc.CustomAttributes.Add(new SvgVoAttribute("tags", _serializer.Serialize(canvas.Tags)));

            var colorManagement = canvas.GetColorManagement(true);
            if (colorManagement != null)
            {
                colorManagement.InitPreviewColorMap(canvas.GetColors());
                _serializer.ColorManagement = colorManagement;
            }

            // Create child items
            foreach (var layer in canvas.Layers)
            {
                svgDoc.ChildNodes.Add(ToSvg(layer));
            }

            return svgDoc;
        }

        private SvgVoLayer ToSvg(Layer layer)
        {
            var svgLayer = new SvgVoLayer();
            svgLayer.ID = layer.UniqueId;
            svgLayer.Display = layer.Visible ? Display.Inline : Display.None;

            var customAttrs = svgLayer.CustomAttributes;
            if (layer.Locked)
                customAttrs.Add(new SvgVoAttribute("locked", layer.Locked));

            if (!string.IsNullOrEmpty(layer.Name))
                customAttrs.Add(new SvgVoAttribute("name", layer.Name));

            if (layer.Region != null)
                customAttrs.Add(new SvgVoAttribute("region", _serializer.Serialize(layer.Region)));

            foreach (var vObject in layer.VObjects)
            {
                var svg = ToSvg(vObject);
                if (svg != null)
                    svgLayer.ChildNodes.Add(svg);
            }

            return svgLayer;
        }

        internal SvgElement ToSvg(VObject vObject)
        {
            if (vObject is GridVObject)
            {
                var svg = new SvgVoGrid();
                WriteGridAttributes(svg, vObject as GridVObject);
                return svg;
            }
            else if (vObject is PolylineVObject)
            {
                var svg = new SvgPolyline();
                WritePolylineAttributes(svg, vObject as PolylineVObject);
                return svg;
            }
            else if (vObject is DashedLineVObject)
            {
                var svg = new SvgVoDashLine();
                WriteDashLineAttributes(svg, vObject as DashedLineVObject);
                return svg;
            }
            else if (vObject is LineVObject)
            {
                var svg = new SvgLine();
                WriteLineAttributes(svg, vObject as LineVObject);
                return svg;
            }
            else if (vObject is EllipseVObject)
            {
                var svg = new SvgEllipse();
                WriteEllipseAttributes(svg, vObject as EllipseVObject);
                return svg;
            }
            else if (vObject is SvgVObject)
            {
                var svg = new SvgVoSvg();
                WriteSvgAttributes(svg, vObject as SvgVObject);
                return svg;
            }
            else if (vObject is ImageVObject)
            {
                var svg = new SvgVoImage();
                WriteImageAttributes(svg, vObject as ImageVObject);
                return svg;
            }
            else if (vObject is PlainTextVObject)
            {
                var svg = new SvgVoPlainText();
                WritePlainTextAttributes(svg, vObject as PlainTextVObject);
                return svg;
            }
            else if (vObject is CurvedTextVObject)
            {
                var svg = new SvgVoCurvedText();
                WriteCurvedTextAttributes(svg, vObject as CurvedTextVObject);
                return svg;
            }
            else if (vObject is PathBoundedTextVObject)
            {
                var svg = new SvgVoPathBoundedText();
                WritePathBoundedTextAttributes(svg, vObject as PathBoundedTextVObject);
                return svg;
            }
            else if (vObject is BoundedTextVObject)
            {
                var svg = new SvgVoBoundedText();
                WriteBoundedTextAttributes(svg, vObject as BoundedTextVObject);
                return svg;
            }
            else if (vObject is AutoScaledTextVObject)
            {
                var svg = new SvgVoAutoScaledText();
                WriteAutoScaledTextAttributes(svg, vObject as AutoScaledTextVObject);
                return svg;
            }
            else if (vObject is PlaceholderVObject)
            {
                var svg = new SvgVoPlaceholder();
                WritePlaceholderAttributes(svg, vObject as PlaceholderVObject);
                return svg;
            }
            else if (vObject is RectangleVObject)
            {
                var svg = new SvgVoRectangle();
                WriteRectangleAttributes(svg, vObject as RectangleVObject);
                return svg;
            }
            else if (vObject is ShapeVObject)
            {
                var svg = new SvgVoShape();
                WriteShapeAttributes(svg, vObject as ShapeVObject);
                return svg;
            }
            else
                return null;
        }

        public void FromSvg(ICanvas canvas, SvgDocument svgDoc)
        {
            canvas.Layers.Clear();

            foreach (var attr in svgDoc.CustomAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects)
                {
                    switch (attr.LocalName)
                    {
                        case "print-color-management-enabled":
                            canvas.PrintColorManagementEnabled = attr.GetValue() == "true";
                            break;

                        case "preview-color-management-enabled":
                            canvas.PreviewColorManagementEnabled = attr.GetValue() == "true";
                            break;

                        case "preview-target-color-space":
                            ColorSpace value;
                            if (Common.TryParseEnum(attr.GetValue(), out value) && value != ColorSpace.Unknown)
                                canvas.PreviewTargetColorSpace = value;
                            break;

                        case "tags":
                            var tags = _serializer.Deserialize<Dictionary<string, object>>(attr.GetValue());
                            foreach (var key in tags.Keys)
                                canvas.Tags[key] = tags[key];
                            break;
                    }
                }
            }

            foreach (var childSvgNode in svgDoc.ChildNodes)
            {
                var svgLayerNode = childSvgNode as SvgVoLayer;
                if (svgLayerNode == null)
                    continue;

                var layer = FromSvg(svgLayerNode);
                canvas.Layers.Add(layer);
            }

            canvas.WorkspaceWidth = svgDoc.ViewBox.Width;
            canvas.WorkspaceHeight = svgDoc.ViewBox.Height;
        }

        private Layer FromSvg(SvgVoLayer svgLayer)
        {
            var layer = new Layer();
            layer.UniqueId = svgLayer.ID;
            layer.Visible = svgLayer.Display != Display.None;

            foreach (var attr in svgLayer.CustomAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "locked")
                    layer.Locked = attr.GetValue() == "true";

                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "name")
                    layer.Name = attr.GetValue();

                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "region")
                    layer.Region = _serializer.Deserialize<RectangleF?>(attr.GetValue());
            }

            foreach (var childSvgNode in svgLayer.ChildNodes)
            {
                var vObject = FromSvg(childSvgNode as SvgElement);
                if (vObject != null)
                    layer.VObjects.Add(vObject);
            }

            return layer;
        }

        internal VObject FromSvg(SvgElement svg)
        {
            if (svg is SvgVoGrid)
            {
                var vObject = new GridVObject();
                ReadGridAttributes(vObject, svg as SvgVoGrid);
                return vObject;
            }
            else if (svg is SvgPolyline)
            {
                var vObject = new PolylineVObject();
                ReadPolylineAttributes(vObject, svg as SvgPolyline);
                return vObject;
            }
            else if (svg is SvgVoDashLine)
            {
                var vObject = new DashedLineVObject();
                ReadDashLineAttributes(vObject, svg as SvgVoDashLine);
                return vObject;
            }
            else if (svg is SvgLine)
            {
                var vObject = new LineVObject();
                ReadLineAttributes(vObject, svg as SvgLine);
                return vObject;
            }
            else if (svg is SvgEllipse)
            {
                var vObject = new EllipseVObject();
                ReadEllipseAttributes(vObject, svg as SvgEllipse);
                return vObject;
            }
            else if (svg is SvgVoSvg)
            {
                var vObject = new SvgVObject();
                ReadSvgAttributes(vObject, svg as SvgVoSvg);
                return vObject;
            }
            else if (svg is SvgVoImage)
            {
                var vObject = new ImageVObject();
                ReadImageAttributes(vObject, svg as SvgVoImage);
                return vObject;
            }
            else if (svg is SvgVoPlainText)
            {
                var vObject = new PlainTextVObject();
                ReadPlainTextAttributes(vObject, svg as SvgVoPlainText);
                return vObject;
            }
            else if (svg is SvgVoCurvedText)
            {
                var vObject = new CurvedTextVObject();
                ReadCurvedTextAttributes(vObject, svg as SvgVoCurvedText);
                return vObject;
            }
            else if (svg is SvgVoAutoScaledText)
            {
                var vObject = new AutoScaledTextVObject();
                ReadAutoScaledTextAttributes(vObject, svg as SvgVoAutoScaledText);
                return vObject;
            }
            else if (svg is SvgVoPathBoundedText)
            {
                var vObject = new PathBoundedTextVObject();
                ReadPathBoundedTextAttributes(vObject, svg as SvgVoPathBoundedText);
                return vObject;
            }
            else if (svg is SvgVoBoundedText)
            {
                var vObject = new BoundedTextVObject();
                ReadBoundedTextAttributes(vObject, svg as SvgVoBoundedText);
                return vObject;
            }
            else if (svg is SvgVoPlaceholder)
            {
                var vObject = new PlaceholderVObject();
                ReadPlaceholderAttributes(vObject, (SvgVoPlaceholder)svg);
                return vObject;
            }
            else if (svg is SvgVoRectangle)
            {
                var vObject = new RectangleVObject();
                ReadRectangleAttributes(vObject, (SvgVoRectangle)svg);
                return vObject;
            }
            else if (svg is SvgVoShape)
            {
                var vObject = new ShapeVObject();
                ReadShapeAttributes(vObject, (SvgVoShape)svg);
                return vObject;
            }
            else
                return null;
        }

        private void WriteGridAttributes(SvgVoGrid svg, GridVObject vObject)
        {
            WriteBaseRectangleVObjectAttributes(svg, vObject);

            var cm = vObject.GetColorManagement(true);
            svg.SetVerticalLineColor(vObject.VerticalLineColor, ColorManagement.GetPreviewColor(cm, vObject.VerticalLineColor), _serializer);
            svg.SetHorizontalLineColor(vObject.HorizontalLineColor, ColorManagement.GetPreviewColor(cm, vObject.HorizontalLineColor), _serializer);

            svg.StrokeWidth = vObject.LineWidth;

            svg.Cols = vObject.Cols;
            svg.Rows = vObject.Rows;
            svg.StepX = vObject.StepX;
            svg.StepY = vObject.StepY;

            var rect = vObject.Rectangle.ToRectangleF();
            svg.X = rect.X;
            svg.Y = rect.Y;
            svg.FixedStrokeWidth = vObject.FixedLineWidth;
        }

        private void ReadGridAttributes(GridVObject vObject, SvgVoGrid svg)
        {
            ReadBaseRectangleVObjectAttributes(vObject, svg);

            vObject.ControlPoints = new[]
            {
                new PointF(svg.X, svg.Y),
                new PointF(svg.X + svg.Cols * svg.StepX, svg.Y + svg.Rows * svg.StepY)
            };

            vObject.VerticalLineColor = svg.GetVerticalLineColor(_serializer);
            vObject.HorizontalLineColor = svg.GetHorizontalLineColor(_serializer);

            vObject.LineWidth = svg.StrokeWidth;

            vObject.Cols = svg.Cols;
            vObject.Rows = svg.Rows;
            vObject.StepX = svg.StepX;
            vObject.StepY = svg.StepY;
            vObject.FixedLineWidth = svg.FixedStrokeWidth;
        }

        private void WritePolylineAttributes(SvgPolyline svg, PolylineVObject vObject)
        {
            WriteBaseRectangleVObjectAttributes(svg, vObject);

            var points = svg.Points;
            foreach (var p in vObject.GetPoints())
            {
                points.Add(p.ToPoint());
            }

            var cm = vObject.GetColorManagement(true);
            svg.Stroke = ColorManagement.GetPreviewColor(cm, vObject.Color);
            svg.CustomAttributes.Add(new SvgVoAttribute("color", _serializer.Serialize(vObject.Color)));

            svg.StrokeWidth = vObject.Width;
            svg.Fill = RgbColor.Transparent;
        }

        private void ReadPolylineAttributes(PolylineVObject vObject, SvgPolyline svg)
        {
            ReadBaseRectangleVObjectAttributes(vObject, svg);

            var controlPoints = new PointF[svg.Points.Count];
            for (int i = 0; i < controlPoints.Length; i++)
            {
                var p = svg.Points[i];
                controlPoints[i] = new PointF(p.X, p.Y);
            }
            vObject.ControlPoints = controlPoints;

            vObject.Width = svg.StrokeWidth;

            string color = null;
            foreach (var attr in svg.CustomAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "color")
                {
                    color = attr.GetValue();
                    break;
                }
            }
            vObject.Color = !string.IsNullOrEmpty(color) ? _serializer.Deserialize<Color>(color) : new RgbColor(svg.Stroke);
        }

        private void WriteDashLineAttributes(SvgVoDashLine svg, DashedLineVObject vObject)
        {
            WriteLineAttributes(svg, vObject);

            var cm = vObject.GetColorManagement(true);
            svg.SetAltColor(vObject.AltColor, ColorManagement.GetPreviewColor(cm, vObject.AltColor), _serializer);

            svg.AltDashWidth = vObject.AltDashWidth;
            svg.DashWidth = vObject.DashWidth;
        }

        private void ReadDashLineAttributes(DashedLineVObject vObject, SvgVoDashLine svg)
        {
            ReadLineAttributes(vObject, svg);

            vObject.AltColor = svg.GetAltColor(_serializer);
            vObject.AltDashWidth = svg.AltDashWidth;
            vObject.DashWidth = svg.DashWidth;
        }

        private void WriteLineAttributes(SvgLine svg, LineVObject vObject)
        {
            WriteBaseRectangleVObjectAttributes(svg, vObject);

            var cm = vObject.GetColorManagement(true);
            svg.Stroke = ColorManagement.GetPreviewColor(cm, vObject.Color);
            svg.CustomAttributes.Add(new SvgVoAttribute("color", _serializer.Serialize(vObject.Color)));

            svg.StrokeWidth = vObject.Width;
            svg.X1 = vObject.Point0.X;
            svg.Y1 = vObject.Point0.Y;
            svg.X2 = vObject.Point1.X;
            svg.Y2 = vObject.Point1.Y;

            if (vObject.FixedWidth)
            {
                svg.CustomAttributes.Add(new SvgVoAttribute("fixed-width", vObject.FixedWidth));
            }
        }

        private void ReadLineAttributes(LineVObject vObject, SvgLine svg)
        {
            ReadBaseRectangleVObjectAttributes(vObject, svg);

            vObject.Width = svg.StrokeWidth;
            vObject.ControlPoints = new[]
            {
                new PointF(svg.X1, svg.Y1),
                new PointF(svg.X2, svg.Y2)
            };

            string color = null;
            foreach (var attr in svg.CustomAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "fixed-width")
                {
                    vObject.FixedWidth = attr.GetValue() == "true";
                }
                else if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "color")
                {
                    color = attr.GetValue();
                }
            }
            vObject.Color = !string.IsNullOrEmpty(color) ? _serializer.Deserialize<Color>(color) : new RgbColor(svg.Stroke);
        }

        private void WriteEllipseAttributes(SvgEllipse svg, EllipseVObject vObject)
        {
            WriteBaseRectangleVObjectAttributes(svg, vObject);

            var rect = vObject.Rectangle;
            svg.Cx = rect.CenterX;
            svg.Cy = rect.CenterY;
            svg.Rx = rect.Width / 2;
            svg.Ry = rect.Height / 2;
            var m = new Matrix();
            m.RotateAt(rect.Angle, new System.Drawing.PointF(rect.CenterX, rect.CenterY));
            svg.Transform = m;

            svg.StrokeWidth = vObject.BorderWidth;

            var cm = vObject.GetColorManagement(true);
            svg.Stroke = ColorManagement.GetPreviewColor(cm, vObject.BorderColor);
            svg.CustomAttributes.Add(new SvgVoAttribute("border-color", _serializer.Serialize(vObject.BorderColor)));
            svg.Fill = ColorManagement.GetPreviewColor(cm, vObject.FillColor);
            svg.CustomAttributes.Add(new SvgVoAttribute("fill-color", _serializer.Serialize(vObject.FillColor)));

            if (vObject.FixedBorderWidth)
            {
                svg.CustomAttributes.Add(new SvgVoAttribute("fixed-border-width", vObject.FixedBorderWidth));
            }
        }

        private void ReadEllipseAttributes(EllipseVObject vObject, SvgEllipse svg)
        {
            ReadBaseRectangleVObjectAttributes(vObject, svg);

            using (var advPath = new AdvancedDrawing.Path())
            {
                advPath.DrawEllipse(svg.Cx - svg.Rx, svg.Cy - svg.Ry, svg.Rx * 2, svg.Ry * 2);
                vObject.Path = Path.FromAdvancedPath(advPath);
            }
            vObject.Angle = svg.Transform != null ? Utils.GetAngle(svg.Transform.Elements[0], svg.Transform.Elements[1]) : 0;

            vObject.BorderWidth = svg.StrokeWidth;

            string borderColor = null;
            string fillColor = null;
            foreach (var attr in svg.CustomAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "fixed-border-width")
                {
                    vObject.FixedBorderWidth = attr.GetValue() == "true";
                }
                else if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "border-color")
                {
                    borderColor = attr.GetValue();
                }
                else if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects && attr.LocalName == "fill-color")
                {
                    fillColor = attr.GetValue();
                }
            }
            vObject.BorderColor = !string.IsNullOrEmpty(borderColor) ? _serializer.Deserialize<Color>(borderColor) : new RgbColor(svg.Stroke);
            vObject.FillColor = !string.IsNullOrEmpty(fillColor) ? _serializer.Deserialize<Color>(fillColor) : new RgbColor(svg.Fill);
        }

        private void WriteSvgAttributes(SvgVoSvg svg, SvgVObject vObject)
        {
            WriteRectangleAttributes(svg, vObject);

            svg.Svg = vObject.Svg;

            var cm = vObject.GetColorManagement(true);
            svg.SetStrokeColor(vObject.StrokeColor, ColorManagement.GetPreviewColor(cm, vObject.StrokeColor), _serializer);
        }

        private void ReadSvgAttributes(SvgVObject vObject, SvgVoSvg svg)
        {
            vObject.Svg = svg.Svg;
            vObject.StrokeColor = svg.GetStrokeColor(_serializer);

            ReadRectangleAttributes(vObject, svg);
        }

        private void WriteImageAttributes(SvgVoImage svg, ImageVObject vObject)
        {
            WriteContentAttributes(svg, vObject);

            var fileId = vObject.SourceFileId;
            if (fileId != null && Configuration.FileCache.FileExists(fileId))
            {
                if (!_fileStorage.FileExists(fileId))
                    using (var fileStream = Configuration.FileCache.GetReadStream(fileId, true))
                        _fileStorage.AddFileWithId(fileId, fileStream);

                svg.Src = fileId;
            }
        }

        private void ReadImageAttributes(ImageVObject vObject, SvgVoImage svg)
        {
            ReadContentAttributes(vObject, svg);

            var internalStorageImageId = svg.Src;
            if (internalStorageImageId != null && _fileStorage.FileExists(internalStorageImageId))
            {
                string vObjectStorageId = internalStorageImageId;
                using (var imageStream = _fileStorage.GetReadStream(internalStorageImageId))
                    Configuration.FileCache.AddFileWithId(vObjectStorageId, imageStream, true);

                vObject.LoadImage(vObjectStorageId, false, false);
            }
        }

        private void WritePlainTextAttributes(SvgVoPlainText svg, PlainTextVObject vObject)
        {
            WriteTextAttributes(svg, vObject);

            svg.BaselineLocation = vObject.BaselineLocation;
            svg.IsVertical = vObject.IsVertical;
        }

        private void ReadPlainTextAttributes(PlainTextVObject vObject, SvgVoPlainText svg)
        {
            ReadTextAttributes(vObject, svg);

            vObject.BaselineLocation = svg.BaselineLocation;
            vObject.IsVertical = svg.IsVertical;
        }

        private void WriteCurvedTextAttributes(SvgVoCurvedText svg, CurvedTextVObject vObject)
        {
            WriteTextAttributes(svg, vObject);

            svg.Path = vObject.TextPath;
            svg.FitToPath = vObject.FitToPath;
            svg.Stretch = vObject.Stretch;
            svg.OriginalFontSize = vObject.OriginalFontSize;
            svg.FitToPathStep = vObject.FitToPathStep;
            svg.PathStart = vObject.PathStart;
            svg.PathEnd = vObject.PathEnd;
        }

        private void ReadCurvedTextAttributes(CurvedTextVObject vObject, SvgVoCurvedText svg)
        {
            ReadTextAttributes(vObject, svg);

            vObject.TextPath = svg.Path;
            vObject.FitToPath = svg.FitToPath;
            vObject.Stretch = svg.Stretch;
            vObject.OriginalFontSize = Utils.EqualsOfFloatNumbers(svg.OriginalFontSize, 0) ? vObject.Font.Size : svg.OriginalFontSize;
            vObject.FitToPathStep = svg.FitToPathStep;
            vObject.PathStart = svg.PathStart;
            vObject.PathEnd = svg.PathEnd;
        }

        private void WriteBoundedTextAttributes(SvgVoBoundedText svg, BoundedTextVObject vObject)
        {
            WriteTextAttributes(svg, vObject);

            svg.WrappingRectanglesJson = _serializer.Serialize(vObject.WrappingRectangles);
            svg.WrappingMargin = vObject.WrappingMargin;
            svg.ParagraphSettingsJson = _serializer.Serialize(vObject.ParagraphSettings);
            svg.VerticalAlignment = vObject.VerticalAlignment;
            svg.IsVertical = vObject.IsVertical;
        }

        private void ReadBoundedTextAttributes(BoundedTextVObject vObject, SvgVoBoundedText svg)
        {
            ReadTextAttributes(vObject, svg);

            vObject.WrappingRectangles = _serializer.Deserialize<List<RotatedRectangleF>>(svg.WrappingRectanglesJson);
            vObject.WrappingMargin = svg.WrappingMargin;
            vObject.ParagraphSettings = _serializer.Deserialize<ParagraphSettings>(svg.ParagraphSettingsJson);
            vObject.VerticalAlignment = svg.VerticalAlignment;
            vObject.IsVertical = svg.IsVertical;
        }

        private void WritePathBoundedTextAttributes(SvgVoPathBoundedText svg, PathBoundedTextVObject vObject)
        {
            WriteBoundedTextAttributes(svg, vObject);

            svg.BoundingPathsJson = vObject.BoundingPaths != null ? _serializer.Serialize(vObject.BoundingPaths.Select(p => p.ToSvgString())) : null;
        }

        private void ReadPathBoundedTextAttributes(PathBoundedTextVObject vObject, SvgVoPathBoundedText svg)
        {
            vObject.BoundingPaths = svg.BoundingPathsJson != null ? _serializer.Deserialize<string[]>(svg.BoundingPathsJson).Select(Path.FromSvgString).ToArray() : null;

            ReadBoundedTextAttributes(vObject, svg);
        }

        private void WriteAutoScaledTextAttributes(SvgVoAutoScaledText svg, AutoScaledTextVObject vObject)
        {
            WriteTextAttributes(svg, vObject);

            svg.IsVertical = vObject.IsVertical;
        }

        private void ReadAutoScaledTextAttributes(AutoScaledTextVObject vObject, SvgVoAutoScaledText svg)
        {
            ReadTextAttributes(vObject, svg);

            vObject.IsVertical = svg.IsVertical;
        }

        private void WriteTextAttributes(SvgVoText svg, BaseTextVObject vObject)
        {
            WriteContentAttributes(svg, vObject);

            var cm = vObject.GetColorManagement(true);
            svg.SetTextColor(vObject.TextColor, ColorManagement.GetPreviewColor(cm, vObject.TextColor), _serializer);

            svg.Text = vObject.Text;

            svg.Font = new FontSettings(vObject.Font);

            svg.Underline = vObject.Underline;
            svg.Alignment = vObject.Alignment;
            svg.Tracking = vObject.Tracking;
            svg.Leading = vObject.Leading;
            svg.IsRichText = vObject.IsRichText;
            svg.VerticalScale = vObject.VerticalScale;
            svg.HorizontalScale = vObject.HorizontalScale;
        }

        private void ReadTextAttributes(BaseTextVObject vObject, SvgVoText svg)
        {
            ReadContentAttributes(vObject, svg);

            vObject.TextColor = svg.GetTextColor(_serializer);

            vObject.Text = svg.Text;

            svg.Font.CopyTo(vObject.Font);

            vObject.Underline = svg.Underline;
            vObject.SetInternalAlignment(svg.Alignment);
            vObject.Tracking = svg.Tracking;
            vObject.Leading = svg.Leading;
            vObject.IsRichText = svg.IsRichText;
            vObject.VerticalScale = svg.VerticalScale;
            vObject.HorizontalScale = svg.HorizontalScale;
        }

        private void WriteContentAttributes(SvgVoContent svg, ContentVObject vObject)
        {
            WriteRectangleAttributes(svg, vObject);

            svg.MaskColor = vObject.MaskColor;
        }

        private void ReadContentAttributes(ContentVObject vObject, SvgVoContent svg)
        {
            ReadRectangleAttributes(vObject, svg);

            vObject.MaskColor = svg.MaskColor;
        }

        private void WritePlaceholderAttributes(SvgVoPlaceholder svg, PlaceholderVObject vObject)
        {
            WriteShapeAttributes(svg, vObject);

            svg.ShowMaskedContent = vObject.ShowMaskedContent;
            svg.IsStubContent = vObject.IsStubContent;

            if (vObject.IsEmptyContent)
                return;

            var content = (ContentVObject)vObject.Content.Clone();
            content.UniqueId = vObject.Content.UniqueId;
            content.Layer = vObject.Layer;

            svg.Content = ToSvg(content) as SvgVoContent;
        }

        private void ReadPlaceholderAttributes(PlaceholderVObject vObject, SvgVoPlaceholder svg)
        {
            ReadShapeAttributes(vObject, svg);

            vObject.ShowMaskedContent = svg.ShowMaskedContent;
            vObject.IsStubContent = svg.IsStubContent;

            vObject.Content = FromSvg(svg.Content) as ContentVObject;
        }

        private void WriteRectangleAttributes(SvgVoRectangle svg, RectangleVObject vObject)
        {
            WriteBaseRectangleVObjectAttributes(svg, vObject);

            var rect = vObject.Rectangle;
            svg.X = rect.CenterX - rect.Width / 2;
            svg.Y = rect.CenterY - rect.Height / 2;
            svg.Width = rect.Width;
            svg.Height = rect.Height;
            var m = new Matrix();
            m.RotateAt(rect.Angle, new System.Drawing.PointF(rect.CenterX, rect.CenterY));
            svg.Transform = m;

            var cm = vObject.GetColorManagement(true);
            svg.SetFillColor(vObject.FillColor, ColorManagement.GetPreviewColor(cm, vObject.FillColor), _serializer);
            svg.SetBorderColor(vObject.BorderColor, ColorManagement.GetPreviewColor(cm, vObject.BorderColor), _serializer);
            svg.StrokeWidth = vObject.BorderWidth;
            svg.FixedBorderWidth = vObject.FixedBorderWidth;
        }

        private void ReadRectangleAttributes(RectangleVObject vObject, SvgVoRectangle svg)
        {
            ReadBaseRectangleVObjectAttributes(vObject, svg);

            vObject.Path = Path.CreateRectanglePath(svg.X, svg.Y, svg.Width, svg.Height);
            vObject.Angle = svg.Transform != null ? Utils.GetAngle(svg.Transform.Elements[0], svg.Transform.Elements[1]) : 0;

            vObject.FillColor = svg.GetFillColor(_serializer);
            vObject.BorderColor = svg.GetBorderColor(_serializer);
            vObject.BorderWidth = svg.StrokeWidth;
            vObject.FixedBorderWidth = svg.FixedBorderWidth;
        }

        private void WriteShapeAttributes(SvgVoShape svg, ShapeVObject vObject)
        {
            WriteBaseRectangleVObjectAttributes(svg, vObject);

            var rect = vObject.Rectangle;
            vObject.Angle = 0;
            svg.Path = vObject.GetTransformedPath().ToPathCommands();
            vObject.Angle = rect.Angle;

            var m = new Matrix();
            m.RotateAt(rect.Angle, new System.Drawing.PointF(rect.CenterX, rect.CenterY));
            svg.Transform = m;

            var cm = vObject.GetColorManagement(true);
            svg.SetFillColor(vObject.FillColor, ColorManagement.GetPreviewColor(cm, vObject.FillColor), _serializer);
            svg.SetBorderColor(vObject.BorderColor, ColorManagement.GetPreviewColor(cm, vObject.BorderColor), _serializer);
            svg.StrokeWidth = vObject.BorderWidth;
            svg.FixedBorderWidth = vObject.FixedBorderWidth;
        }

        private void ReadShapeAttributes(ShapeVObject vObject, SvgVoShape svg)
        {
            ReadBaseRectangleVObjectAttributes(vObject, svg);

            vObject.Path = Path.FromPathCommands(svg.Path);
            vObject.Angle = svg.Transform != null ? Utils.GetAngle(svg.Transform.Elements[0], svg.Transform.Elements[1]) : 0;

            vObject.FillColor = svg.GetFillColor(_serializer);
            vObject.BorderColor = svg.GetBorderColor(_serializer);
            vObject.BorderWidth = svg.StrokeWidth;
            vObject.FixedBorderWidth = svg.FixedBorderWidth;
        }

        private void WriteBaseRectangleVObjectAttributes(SvgElement svg, BaseRectangleVObject vObject)
        {
            WriteVObjectAttributes(svg, vObject);

            svg.CustomAttributes.Add(new SvgVoAttribute("text-wrapping-mode", vObject.TextWrappingMode.ToString().ToLowerInvariant()));
            svg.CustomAttributes.Add(new SvgVoAttribute("opacity", vObject.Opacity));
        }

        private void ReadBaseRectangleVObjectAttributes(BaseRectangleVObject vObject, SvgElement svg)
        {
            ReadVObjectAttributes(vObject, svg);

            foreach (var attr in svg.CustomAttributes.Where(attr => attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects))
            {
                switch (attr.LocalName)
                {
                    case "text-wrapping-mode":
                        vObject.TextWrappingMode = SvgAttribute.ParseEnumAttribute(attr.GetValue(),
                            TextWrappingMode.None);
                        break;

                    case "opacity":
                        vObject.Opacity = SvgAttribute.ParseFloatAttribute(attr.GetValue(), 1.0f);
                        break;
                }
            }
        }

        private void WriteVObjectAttributes(SvgElement svg, VObject vObject)
        {
            svg.Display = vObject.Visible ? Display.Inline : Display.None;
            svg.ID = vObject.UniqueId;

            if (vObject.Locked)
                svg.CustomAttributes.Add(new SvgVoAttribute("locked", vObject.Locked));

            if (!string.IsNullOrEmpty(vObject.Name))
                svg.CustomAttributes.Add(new SvgVoAttribute("name", vObject.Name));

            if (vObject.Tag != null)
                svg.CustomAttributes.Add(new SvgVoAttribute("tag", _serializer.Serialize(vObject.Tag)));

            if (vObject.Permissions != null)
                svg.CustomAttributes.Add(new SvgVoAttribute("permissions", _serializer.Serialize(vObject.Permissions)));
        }

        private void ReadVObjectAttributes(VObject vObject, SvgElement svg)
        {
            vObject.Visible = svg.Display != Display.None;
            vObject.UniqueId = svg.ID;

            foreach (var attr in svg.CustomAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.AurigmaVectorObjects)
                {
                    switch (attr.LocalName)
                    {
                        case "locked":
                            vObject.Locked = attr.GetValue() == "true";
                            break;

                        case "name":
                            vObject.Name = attr.GetValue();
                            break;

                        case "tag":
                            vObject.Tag = _serializer.Deserialize<object>(attr.GetValue());
                            break;

                        case "permissions":
                            vObject.Permissions = _serializer.Deserialize<Permission>(attr.GetValue());
                            break;
                    }
                }
            }
        }
    }
}