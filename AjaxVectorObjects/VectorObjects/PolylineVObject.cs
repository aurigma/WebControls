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

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PolylineVObject : BaseRectangleVObject
    {
        public PolylineVObject()
            : this(new PointF[] { })
        {
        }

        public PolylineVObject(PointF[] points)
        {
            Color = new RgbColor(255, 255, 61, 255);
            Width = 10F;
            ControlPoints = points;

            TextWrappingMode = TextWrappingMode.None;
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

        internal override IEnumerable<Color> GetColors()
        {
            yield return Color;
        }

        public override VObjectData GetVObjectData()
        {
            return new PolylineVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "PolylineVObjectData";
        }

        public override RectangleF Bounds
        {
            get
            {
                return GetPath().ToGdiPlusGraphicsPath().GetBounds();
            }
        }

        public void InsertPoint(PointF point, int index)
        {
            if (index < 0 || index > ControlPoints.Length)
                throw ExceptionFactory.ArgumentOutOfRangeException("index");

            var actualPoints = new List<PointF>(GetPoints());
            actualPoints.Insert(index, point);

            // change original points to actual points and reset transform
            ControlPoints = actualPoints.ToArray();

            // OnChanged() will be fired in Transform property
            Transform = new Transform();
        }

        public IEnumerable<PointF> GetPoints()
        {
            var center = ControlCenter;
            foreach (PointF p in ControlPoints)
            {
                yield return GetActualPointFromControlPoint(p, center);
            }
        }

        public void AddPoint(PointF point)
        {
            InsertPoint(point, ControlPoints.Length);
        }

        public void SetPoint(PointF point, int index)
        {
            if (index < 0 || index >= ControlPoints.Length)
                throw ExceptionFactory.ArgumentOutOfRangeException("index");

            var actualPoints = new List<PointF>(GetPoints());
            actualPoints[index] = point;
            ControlPoints = actualPoints.ToArray();
            Transform = new Transform();
            OnChanged();
        }

        public PointF GetPoint(int index)
        {
            if (index < 0 || index > ControlPoints.Length)
                throw ExceptionFactory.ArgumentOutOfRangeException("index");

            return GetActualPointFromControlPoint(ControlPoints[index]);
        }

        public void RemovePoint(int index)
        {
            if (index < 0 || index > ControlPoints.Length)
                throw ExceptionFactory.ArgumentOutOfRangeException("index");

            var newArray = new PointF[ControlPoints.Length - 1];
            Array.Copy(ControlPoints, newArray, index);
            Array.Copy(ControlPoints, index + 1, newArray, index, ControlPoints.Length - index - 1);

            ControlPoints = newArray;
        }

        public int PointsCount
        {
            get { return ControlPoints.Length; }
        }

        private PointF GetActualPointFromControlPoint(PointF point)
        {
            return GetActualPointFromControlPoint(point, ControlCenter);
        }

        private PointF GetActualPointFromControlPoint(PointF point, PointF center)
        {
            var p = point.Clone();
            var transform = Transform;
            p.Translate(-center.X, -center.Y);
            p.Scale(transform.ScaleX, transform.ScaleY);
            p.Rotate(transform.Angle);
            p.Translate(transform.TranslateX, transform.TranslateY);
            p.Translate(center.X, center.Y);
            return p;
        }

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            var dpi = graphics.DpiX;
            var width = Width;

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

            for (var i = 1; i < points.Length; i++)
                path.LineTo(points[i].ToPointF());

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

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}