// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using Aurigma.GraphicsMill.Transforms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Xml;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;
using Rectangle = System.Drawing.Rectangle;
using SizeF = System.Drawing.SizeF;
using SMath = System.Math;
using SvgLib = Svg;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class SvgVObject : RectangleVObject, IPipelineExtender
    {
        private SvgLib.SvgDocument _svgDoc;

        public SvgVObject() :
            this(location: null, size: null)
        {
        }

        public SvgVObject(PointF location = null, SizeF? size = null)
        {
            IncludeBorder = true;
            BorderWidth = 0F;
            FillColor = RgbColor.Transparent;

            _strokeColor = RgbColor.Black;

            if (location != null)
                ChangeControlPoints(location.X, location.Y);

            if (size != null)
                ChangeControlPoints(null, null, ControlPoints[0].X + size.Value.Width, ControlPoints[0].Y + size.Value.Height);
        }

        public SvgVObject(XmlDocument doc, PointF location = null, SizeF? size = null)
            : this(location)
        {
            LoadSvg(doc, size);
        }

        public SvgVObject(string xml, PointF location = null, SizeF? size = null)
            : this(location)
        {
            LoadSvg(xml, size);
        }

        public SvgVObject(FileInfo file, PointF location = null, SizeF? size = null)
            : this(location)
        {
            LoadSvg(file, size);
        }

        public void LoadSvg(XmlDocument document, SizeF? size = null)
        {
            var defaultSize = new SizeF(MinDimension, MinDimension);

            if (document != null)
            {
                _svgDoc = SvgLib.SvgDocument.Open(document);

                if (_svgDoc.Width > 0 && _svgDoc.Height > 0)
                {
                    defaultSize.Width = _svgDoc.Width;
                    defaultSize.Height = _svgDoc.Height;
                }

                _strokeColor = System.Drawing.Color.Empty;
                var color = GetStrokeColorFromSvg(_svgDoc);
                if (!color.IsEmpty)
                    _strokeColor = new RgbColor(color);

                UpdateStrokeColor();
            }

            if (size.HasValue)
                defaultSize = size.Value;

            ChangeControlPoints(null, null, ControlPoints[0].X + defaultSize.Width, ControlPoints[0].Y + defaultSize.Height);
        }

        public void LoadSvg(string xml, SizeF? size = null)
        {
            var xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(xml);

            LoadSvg(xmlDoc, size);
        }

        public void LoadSvg(FileInfo file, SizeF? size = null)
        {
            var xmlDoc = new XmlDocument();

            using (var textReader = new StreamReader(file.FullName))

            using (var xmlReader = new XmlTextReader(textReader) { DtdProcessing = DtdProcessing.Ignore })
                xmlDoc.Load(xmlReader);

            LoadSvg(xmlDoc, size);
        }

        private System.Drawing.Color GetStrokeColorFromSvg(SvgLib.SvgElement el)
        {
            if (el is SvgLib.SvgVisualElement)
            {
                var stroke = (el as SvgLib.SvgVisualElement).Stroke;
                if (stroke != null)
                    return (stroke as SvgLib.SvgColourServer).Colour;
            }

            if (el.HasChildren())
            {
                foreach (var ch in el.Children)
                {
                    var result = GetStrokeColorFromSvg(ch);
                    if (!result.IsEmpty)
                        return result;
                }
            }

            return System.Drawing.Color.Empty;
        }

        private void UpdateStrokeColor(ColorManagement colorManagement = null)
        {
            if (_svgDoc != null)
            {
                UpdateStrokeColor(_svgDoc, colorManagement);
            }
        }

        private void UpdateStrokeColor(SvgLib.SvgElement el, ColorManagement colorManagement)
        {
            if (el is SvgLib.SvgCircle || el is SvgLib.SvgEllipse || el is SvgLib.SvgLine || el is SvgLib.SvgPath || el is SvgLib.SvgPolygon || el is SvgLib.SvgPolyline || el is SvgLib.SvgRectangle)
            {
                var stroke = (el as SvgLib.SvgVisualElement).Stroke;
                if (stroke != null)
                {
                    System.Drawing.Color color;
                    if (StrokeColor is RgbColor)
                    {
                        color = StrokeColor.ToGdiPlusColor();
                    }
                    else
                    {
                        colorManagement = colorManagement ?? GetColorManagement(true);
                        color = ColorManagement.GetPreviewColor(colorManagement, _strokeColor);
                    }

                    (stroke as SvgLib.SvgColourServer).Colour = color;
                }
            }

            if (el.HasChildren())
            {
                foreach (var ch in el.Children)
                    UpdateStrokeColor(ch, colorManagement);
            }
        }

        public string Svg
        {
            get
            {
                string result = string.Empty;
                if (_svgDoc != null)
                {
                    using (var strWriter = new StringWriter())
                    {
                        using (var xmlWriter = new XmlTextWriter(strWriter))
                        {
                            _svgDoc.WriteElement(xmlWriter);
                            xmlWriter.Close();
                        }
                        result = strWriter.ToString();
                        strWriter.Close();
                    }
                }

                return result;
            }
            set
            {
                if (value != null)
                {
                    LoadSvg(value);
                }
            }
        }

        private Color _strokeColor;

        public Color StrokeColor
        {
            get
            {
                return _strokeColor;
            }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                if (!value.Equals(_strokeColor))
                {
                    _strokeColor = value;
                    UpdateStrokeColor();
                }
            }
        }

        private string _source;

        public string Source
        {
            get
            {
                return _source;
            }
            set
            {
                if (value != null && !value.Equals(_source))
                {
                    _source = value;
                    var document = new XmlDocument();
                    document.Load(_source);
                    LoadSvg(document);
                }
            }
        }

        internal override IEnumerable<Color> GetColors()
        {
            foreach (var color in base.GetColors())
            {
                yield return color;
            }

            yield return StrokeColor;
        }

        public override VObjectData GetVObjectData()
        {
            return new SvgVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "SvgVObjectData";
        }

        private RotatedRectangleF GetDrawingRectangle(float dpi = 72)
        {
            return new RotatedRectangleF(GetImageRectangle(dpi), (float)Angle);
        }

        private Rectangle GetImageRectangle(float dpi)
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

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            base.Draw(graphics, destImageParams, colorManagement);

            var dpi = graphics.DpiX;
            var angle = (float)Angle;
            var center = GetDrawingRectangle(dpi).Center.ToPointF();

            var points = new[] { center };
            graphics.Transform.TransformPoints(points);
            center = points[0];

            graphics.Transform.RotateAt(angle, center, System.Drawing.Drawing2D.MatrixOrder.Append);

            var pipeline = GetSvgPipeline(destImageParams, colorManagement);
            pipeline.Add(new ScaleAlpha(Opacity));
            var location = GetImageRectangle(dpi).Location;
            graphics.DrawImage(pipeline, location.X, location.Y);
            pipeline.DisposeAllElements();

            graphics.Transform.RotateAt(-angle, center, System.Drawing.Drawing2D.MatrixOrder.Append);
        }

        private Pipeline GetSvgPipeline(IImageParams destImageParams, ColorManagement colorManagement, float scale = 1)
        {
            var dpi = destImageParams.DpiX * scale;
            var rect = GetImageRectangle(dpi);

            var svg = (SvgLib.SvgDocument)_svgDoc.Clone();

            if (((RectangleF)svg.ViewBox).IsEmpty)
                svg.Transforms.Add(new SvgLib.Transforms.SvgScale(rect.Width / svg.Width, rect.Height / svg.Height));

            svg.Width = rect.Width;
            svg.Height = rect.Height;
            svg.Ppi = (int)dpi;

            UpdateStrokeColor(svg, colorManagement);

            var bitmap = new Bitmap(svg.Draw());
            bitmap.DpiX = dpi;
            bitmap.DpiY = dpi;

            svg.Transforms.Clear();

            var pipeline = new Pipeline(bitmap);

            var colorConverter = ColorManagement.GetColorConverter(colorManagement, bitmap, destImageParams);
            if (colorConverter != null)
                pipeline.Add(colorConverter);

            return pipeline;
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
            pipeline.Add(GetImageCombiner(destImageParams, colorManagement, scale, deps));
        }

        public object GetLock()
        {
            return new object();
        }

        internal Combiner GetImageCombiner(IImageParams destImageParams, ColorManagement colorManagement, float scale, IEnumerable<IDisposable> deps)
        {
            var pipeline = GetSvgPipeline(destImageParams, colorManagement, scale);
            pipeline.Add(new ScaleAlpha(Opacity));

            if (!Angle.Equals(0))
            {
                var rotate = new MatrixTransform
                {
                    Matrix = Matrix.CreateRotate((float)Angle),
                    InterpolationMode = InterpolationMode.High,
                    BackgroundColor = ColorManagement.GetTransparentColor(destImageParams.PixelFormat)
                };

                pipeline.Add(rotate);
            }

            var imageLocation = GetDrawingRectangle(destImageParams.DpiX * scale).Bounds.Location;
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