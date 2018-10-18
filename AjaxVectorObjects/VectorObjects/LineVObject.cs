// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using RectangleF = System.Drawing.RectangleF;
using SMath = System.Math;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class LineVObject : BaseRectangleVObject
    {
        public LineVObject(float x1, float y1, float x2, float y2)
        {
            ControlPoints = new[] { new PointF(x1, y1), new PointF(x2, y2) };
            Color = RgbColor.Black;
            Width = 4;

            TextWrappingMode = TextWrappingMode.None;
        }

        public LineVObject(PointF p1, PointF p2)
            : this(p1.X, p1.Y, p2.X, p2.Y)
        {
        }

        public LineVObject()
            : this(0, 0, 0, 0)
        {
        }

        internal override IEnumerable<Color> GetColors()
        {
            yield return Color;
        }

        public override VObjectData GetVObjectData()
        {
            return new LineVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "LineVObjectData";
        }

        private Color _color;

        public Color Color
        {
            get { return _color; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _color = value;
            }
        }

        public float Width { get; set; }

        public bool FixedWidth { get; set; }

        public override RectangleF Bounds
        {
            get
            {
                using (var pen = new System.Drawing.Pen(System.Drawing.Color.Black, 1))
                    return GetPath().ToGdiPlusGraphicsPath().GetBounds(null, pen);
            }
        }

        public PointF Point0
        {
            get
            {
                return GetActualPoint(ControlPoints[0]);
            }
            set
            {
                var bounds = ControlBounds;
                if (Utils.EqualsOfFloatNumbers(bounds.Width, 0) || Utils.EqualsOfFloatNumbers(bounds.Height, 0))
                {
                    var p1 = GetActualPoint(ControlPoints[1]);
                    ControlPoints = new[] { value.Clone(), p1 };
                    Transform = new Transform();
                }
                else
                {
                    SetTransformByPoints(ControlPoints[0], value, ControlPoints[1]);
                }
            }
        }

        public PointF Point1
        {
            get
            {
                return GetActualPoint(ControlPoints[1]);
            }
            set
            {
                var bounds = ControlBounds;
                if (Utils.EqualsOfFloatNumbers(bounds.Width, 0) || Utils.EqualsOfFloatNumbers(bounds.Height, 0))
                {
                    var p0 = GetActualPoint(ControlPoints[0]);
                    ControlPoints = new[] { p0, value.Clone() };
                    Transform = new Transform();
                }
                else
                {
                    SetTransformByPoints(ControlPoints[1], value, ControlPoints[0]);
                }
            }
        }

        private void SetTransformByPoints(PointF controlPoint1, PointF actualPoint1, PointF controlPoint2)
        {
            var controlCenter = ControlCenter;
            var actualPoint2 = GetActualPoint(controlPoint2);
            var newCenter = new PointF((actualPoint2.X + actualPoint1.X) / 2,
                (actualPoint2.Y + actualPoint1.Y) / 2);

            var translateX = newCenter.X - controlCenter.X;
            var translateY = newCenter.Y - controlCenter.Y;

            var p1 = new PointF(controlPoint1).Translate(-controlCenter.X, -controlCenter.Y);
            var p2 = new PointF(actualPoint1).Translate(-translateX, -translateY).
                Translate(-controlCenter.X, -controlCenter.Y);
            var cosAngle = (p1.X * p2.X + p1.Y * p2.Y) / SMath.Sqrt((p1.X * p1.X + p1.Y * p1.Y) * (p2.X * p2.X + p2.Y * p2.Y));
            cosAngle = SMath.Max(-1, SMath.Min(1, cosAngle));
            var angle = Utils.ConvertRadianToDegree(SMath.Acos(cosAngle));
            p2.Rotate(-angle);
            Transform = new Transform(p2.X / p1.X, p2.Y / p1.Y, translateX, translateY, angle);
        }

        private PointF GetActualPoint(PointF controlPoint)
        {
            var controlCenter = ControlCenter;
            var transform = Transform;

            var point = controlPoint.Clone();
            point.Translate(-controlCenter.X, -controlCenter.Y);
            point.Scale(transform.ScaleX, transform.ScaleY);
            point.Rotate(transform.Angle);
            point.Translate(transform.TranslateX, transform.TranslateY);
            point.Translate(controlCenter.X, controlCenter.Y);
            return point;
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
                var color = ColorManagement.ConvertColor(colorManagement, Color, destImageParams);
                color = color.ScaleAlpha(Opacity);
                graphics.DrawPath(new Pen(color, width), GetDrawingPath(dpi));
            }
        }

        protected internal override Path GetPath()
        {
            var points = ControlPoints;
            var path = new Path();
            path.MoveTo(points[0].ToPointF());
            path.LineTo(points[1].ToPointF());

            var transform = Transform;
            if (!transform.IsEmpty)
            {
                using (var matrix = new Matrix())
                {
                    var bounds = ControlBounds;

                    matrix.Translate(-bounds.X - bounds.Width / 2, -bounds.Y - bounds.Height / 2);
                    matrix.Scale((float)transform.ScaleX, (float)transform.ScaleY, MatrixOrder.Append);
                    matrix.Rotate((float)transform.Angle, MatrixOrder.Append);
                    matrix.Translate(bounds.X + bounds.Width / 2, bounds.Y + bounds.Height / 2, MatrixOrder.Append);
                    matrix.Translate((float)transform.TranslateX, (float)transform.TranslateY, MatrixOrder.Append);

                    path.ApplyTransform(matrix);
                }
            }

            return path;
        }

        protected internal float GetWidth(float dpi = 72)
        {
            return FixedWidth ? Common.ConvertPixelsToPoints(dpi, Width) : Width;
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}