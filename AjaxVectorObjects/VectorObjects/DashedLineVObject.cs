// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using SMath = System.Math;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class DashedLineVObject : LineVObject
    {
        public DashedLineVObject()
        { }

        public DashedLineVObject(PointF p1, PointF p2)
            : this(p1.X, p1.Y, p2.X, p2.Y)
        { }

        public DashedLineVObject(float x1, float y1, float x2, float y2)
            : base(x1, y1, x2, y2)
        {
            AltColor = RgbColor.Transparent;
            DashWidth = 3;
            AltDashWidth = 3;
        }

        public float DashWidth { get; set; }

        private Color _altColor;

        public Color AltColor
        {
            get { return _altColor; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _altColor = value;
            }
        }

        public float AltDashWidth { get; set; }

        internal override IEnumerable<Color> GetColors()
        {
            foreach (var color in base.GetColors())
            {
                yield return color;
            }

            yield return AltColor;
        }

        public override VObjectData GetVObjectData()
        {
            return new DashedLineVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "DashedLineVObjectData";
        }

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            var dpi = graphics.DpiX;

            var width = GetWidth(dpi * graphics.Transform.Elements[0]);
            if (width > 0)
            {
                var paths = GetPaths();
                if (!Utils.EqualsOfFloatNumbers(dpi, 72))
                {
                    using (var matrix = new Matrix())
                    {
                        matrix.Scale(dpi / 72, dpi / 72, MatrixOrder.Append);
                        paths[0].ApplyTransform(matrix);
                        paths[1].ApplyTransform(matrix);
                    }
                }

                if (!Color.IsTransparent)
                {
                    var color = ColorManagement.ConvertColor(colorManagement, Color, destImageParams);
                    color = color.ScaleAlpha(Opacity);
                    graphics.DrawPath(new Pen(color, width), paths[0]);
                }

                if (!AltColor.IsTransparent)
                {
                    var altColor = ColorManagement.ConvertColor(colorManagement, AltColor, destImageParams);
                    altColor = altColor.ScaleAlpha(Opacity);
                    graphics.DrawPath(new Pen(altColor, width), paths[1]);
                }
            }
        }

        private Path[] GetPaths()
        {
            var path = new Path();
            var altPath = new Path();

            var p0 = Point0;
            var p1 = Point1;

            var lineWidth = p1.X - p0.X;
            var lineHeight = p1.Y - p0.Y;
            var lineLength = SMath.Sqrt(SMath.Pow(lineWidth, 2) + SMath.Pow(lineHeight, 2));
            var sin = lineHeight / lineLength;
            var cos = lineWidth / lineLength;

            var dashCount = (int)SMath.Ceiling(lineLength / (DashWidth + AltDashWidth));
            var point = p0.Clone();
            for (var i = 0; i < dashCount; i++)
            {
                path.MoveTo(point.ToPointF());
                point.Translate(DashWidth * cos, DashWidth * sin);

                if (SMath.Abs(point.X - p0.X) <= SMath.Abs(lineWidth) && SMath.Abs(point.Y - p0.Y) <= SMath.Abs(lineHeight))
                {
                    path.LineTo(point.ToPointF());

                    altPath.MoveTo(point.ToPointF());
                    point.Translate(AltDashWidth * cos, AltDashWidth * sin);

                    if (SMath.Abs(point.X - p0.X) <= SMath.Abs(lineWidth) && SMath.Abs(point.Y - p0.Y) <= SMath.Abs(lineHeight))
                        altPath.LineTo(point.ToPointF());
                    else
                        altPath.LineTo(p1.ToPointF());
                }
                else
                    path.LineTo(p1.ToPointF());
            }

            return new[] { path, altPath };
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}