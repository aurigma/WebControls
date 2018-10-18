// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.ComponentModel;
using System.Drawing;
using SMath = System.Math;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math
{
    public class RotatedRectangleF
    {
        public RotatedRectangleF()
        {
            CenterX = 0;
            CenterY = 0;
            Width = 2;
            Height = 2;
            Angle = 0;
        }

        public RotatedRectangleF(float centerX, float centerY, float width, float height, float angle)
        {
            CenterX = centerX;
            CenterY = centerY;
            Width = width;
            Height = height;
            Angle = angle;
        }

        public RotatedRectangleF(RectangleF rect, float angle = 0)
            : this(rect.X + rect.Width / 2, rect.Y + rect.Height / 2, rect.Width, rect.Height, angle)
        {
        }

        public RectangleF Bounds
        {
            get
            {
                using (var path = GetPath().ToGdiPlusGraphicsPath())
                {
                    return path.GetBounds();
                }
            }
        }

        public AdvancedDrawing.Path GetPath()
        {
            var path = new AdvancedDrawing.Path();
            path.DrawRectangle(ToRectangleF());

            if (Angle != 0)
            {
                using (var m = new System.Drawing.Drawing2D.Matrix())
                {
                    m.RotateAt(Angle, Center.ToPointF());
                    path.ApplyTransform(m);
                }
            }

            return path;
        }

        public PointF Center
        {
            get { return new PointF(CenterX, CenterY); }

            set
            {
                CenterX = value.X;
                CenterY = value.Y;
            }
        }

        [DefaultValue("0")]
        public float CenterX { get; set; }

        [DefaultValue("0")]
        public float CenterY { get; set; }

        [DefaultValue("2")]
        public float Width { get; set; }

        [DefaultValue("2")]
        public float Height { get; set; }

        /// <summary>
        /// Angle of rotation in degrees.
        /// </summary>
        [DefaultValue("0")]
        public float Angle { get; set; }

        /// <summary>
        /// Get or set the coordinates of upper-left corner of this rectangle
        /// </summary>
        public PointF Location
        {
            get
            {
                return GetLeftTopEdge();
            }
            set
            {
                var p = Location;
                CenterX = CenterX + (value.X - p.X);
                CenterY = CenterY + (value.Y - p.Y);
            }
        }

        public void RotateAt(double angle, PointF center)
        {
            Center = Center.RotateAt(angle, center);
            Angle = (float)angle;
        }

        public void Scale(float scaleX, float scaleY)
        {
            Center = Center.Scale(scaleX, scaleY);
            Width *= scaleX;
            Height *= scaleY;
        }

        public static bool AreEqual(RotatedRectangleF rect1, RotatedRectangleF rect2, double tolerance = 0)
        {
            return Utils.EqualsOfFloatNumbers(rect1.CenterX, rect2.CenterX, tolerance) &&
                   Utils.EqualsOfFloatNumbers(rect1.CenterY, rect2.CenterY, tolerance) &&
                   Utils.EqualsOfFloatNumbers(rect1.Width, rect2.Width, tolerance) &&
                   Utils.EqualsOfFloatNumbers(rect1.Height, rect2.Height, tolerance) &&
                   Utils.EqualsOfFloatNumbers(rect1.Angle, rect2.Angle, tolerance);
        }

        public override bool Equals(object obj)
        {
            var equals = object.ReferenceEquals(this, obj) ||
                object.ReferenceEquals(obj, null) && object.ReferenceEquals(this, null);

            if (!equals)
            {
                var rect = obj as RotatedRectangleF;
                equals = rect != null && AreEqual(this, rect);
            }
            return equals;
        }

        public override int GetHashCode()
        {
            unchecked // Overflow is fine
            {
                // http://stackoverflow.com/questions/263400/what-is-the-best-algorithm-for-an-overridden-system-object-gethashcode/263416#263416
                int hash = 17;
                hash = hash * 23 + CenterX.GetHashCode();
                hash = hash * 23 + CenterY.GetHashCode();
                hash = hash * 23 + Width.GetHashCode();
                hash = hash * 23 + Height.GetHashCode();
                hash = hash * 23 + Angle.GetHashCode();

                return hash;
            }
        }

        public bool IsEmpty
        {
            get { return Width == 0 && Height == 0; }
        }

        public RectangleF ToRectangleF()
        {
            return new RectangleF(CenterX - Width / 2, CenterY - Height / 2, Width, Height);
        }

        public override string ToString()
        {
            var ci = System.Globalization.CultureInfo.InvariantCulture;
            return string.Format("{{ CenterX={0}, CenterY={1}, Width={2}, Height={3}, Angle={4} }}",
                CenterX.ToString("r", ci), CenterY.ToString("r", ci),
                Width.ToString("r", ci), Height.ToString("r", ci),
                Angle.ToString("r", ci));
        }

        public RotatedRectangleF Clone()
        {
            return new RotatedRectangleF(CenterX, CenterY, Width, Height, Angle);
        }

        public bool IntersectsWith(RotatedRectangleF rect)
        {
            var thisRect = Clone();
            var otherRect = rect.Clone();

            if (Angle != 0)
            {
                var angle = thisRect.Angle;
                thisRect.Angle = 0;

                var center = otherRect.Center;
                center.RotateAt(-angle, thisRect.Center);
                otherRect.Center = center;
                otherRect.Angle -= angle;
            }

            var thisEdges = new PointF[] { thisRect.GetLeftTopEdge(), thisRect.GetRigthTopEdge(), thisRect.GetRightBottomEdge(), thisRect.GetLeftBottomEdge() };
            var otherEdges = new PointF[] { otherRect.GetLeftTopEdge(), otherRect.GetRigthTopEdge(), otherRect.GetRightBottomEdge(), otherRect.GetLeftBottomEdge() };

            var firstProjectionIntersection = CheckProjectionIntersection(thisEdges, otherEdges);

            var secondProjectionIntersection = true;
            if (firstProjectionIntersection && Angle != rect.Angle)
            {
                thisRect = Clone();
                otherRect = rect.Clone();

                var angle = otherRect.Angle;
                otherRect.Angle = 0;

                var center = thisRect.Center;
                center.RotateAt(-angle, otherRect.Center);
                thisRect.Center = center;
                thisRect.Angle -= angle;

                thisEdges = new PointF[] { thisRect.GetLeftTopEdge(), thisRect.GetRigthTopEdge(), thisRect.GetRightBottomEdge(), thisRect.GetLeftBottomEdge() };
                otherEdges = new PointF[] { otherRect.GetLeftTopEdge(), otherRect.GetRigthTopEdge(), otherRect.GetRightBottomEdge(), otherRect.GetLeftBottomEdge() };

                secondProjectionIntersection = CheckProjectionIntersection(thisEdges, otherEdges);
            }

            return firstProjectionIntersection && secondProjectionIntersection;
        }

        private bool CheckProjectionIntersection(PointF[] points0, PointF[] points1)
        {
            float x00, x01, y00, y01;
            GetProjections(points0, out x00, out x01, out y00, out y01);

            float x10, x11, y10, y11;
            GetProjections(points1, out x10, out x11, out y10, out y11);

            return x00 <= x11 && x01 >= x10 && y00 <= y11 && y01 >= y10;
        }

        private void GetProjections(PointF[] points, out float x0, out float x1, out float y0, out float y1)
        {
            x0 = x1 = points[0].X;
            y0 = y1 = points[0].Y;

            for (int i = 1; i < points.Length; i++)
            {
                x0 = SMath.Min(x0, points[i].X);
                x1 = SMath.Max(x1, points[i].X);
                y0 = SMath.Min(y0, points[i].Y);
                y1 = SMath.Max(y1, points[i].Y);
            }
        }

        private PointF GetLeftTopEdge()
        {
            var p = new PointF(-Width / 2, -Height / 2);
            p.Rotate(Angle);
            p.Translate(CenterX, CenterY);
            return p;
        }

        private PointF GetRigthTopEdge()
        {
            var p = new PointF(Width / 2, -Height / 2);
            p.Rotate(Angle);
            p.Translate(CenterX, CenterY);
            return p;
        }

        private PointF GetRightBottomEdge()
        {
            var p = new PointF(Width / 2, Height / 2);
            p.Rotate(Angle);
            p.Translate(CenterX, CenterY);
            return p;
        }

        private PointF GetLeftBottomEdge()
        {
            var p = new PointF(-Width / 2, Height / 2);
            p.Rotate(Angle);
            p.Translate(CenterX, CenterY);
            return p;
        }
    }
}