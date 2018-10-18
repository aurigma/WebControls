// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Drawing;
using System.Globalization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math
{
    public class PointF : ICloneable
    {
        public PointF()
        {
        }

        public PointF(float x, float y)
        {
            X = x;
            Y = y;
        }

        public PointF(PointF pt)
        {
            X = pt.X;
            Y = pt.Y;
        }

        public PointF(System.Drawing.PointF pt)
        {
            X = pt.X;
            Y = pt.Y;
        }

        public float X { get; set; }

        public float Y { get; set; }

        /// <summary>
        /// Rotate point
        /// </summary>
        /// <param name="angle">Angle in degrees</param>
        /// <returns>Point itself</returns>
        public PointF Rotate(float angle)
        {
            return Rotate((double)angle);
        }

        internal PointF Rotate(double angle)
        {
            return RotateAt(angle, new PointF(0, 0));
        }

        internal PointF RotateAt(double angle, PointF center)
        {
            angle = Utils.ConvertDegreeToRadian(angle);
            var pt = new PointF(X, Y);
            X = (float)(System.Math.Cos(angle) * (pt.X - center.X) - System.Math.Sin(angle) * (pt.Y - center.Y) + center.X);
            Y = (float)(System.Math.Sin(angle) * (pt.X - center.X) + System.Math.Cos(angle) * (pt.Y - center.Y) + center.Y);
            return this;
        }

        public PointF Translate(float x, float y)
        {
            return Translate(x, (double)y);
        }

        internal PointF Translate(double x, double y)
        {
            X = (float)(x + X);
            Y = (float)(y + Y);
            return this;
        }

        public PointF Scale(float scaleX, float scaleY)
        {
            return Scale(scaleX, (double)scaleY);
        }

        internal PointF Scale(double scaleX, double scaleY)
        {
            X = (float)(scaleX * X);
            Y = (float)(scaleY * Y);
            return this;
        }

        internal PointF Transform(Transform transform, PointF center)
        {
            Translate(-center.X, -center.Y);
            Scale(transform.ScaleX, transform.ScaleY);
            Rotate(transform.Angle);
            Translate(transform.TranslateX, transform.TranslateY);
            Translate(center.X, center.Y);

            return this;
        }

        public double Distance(PointF point)
        {
            return System.Math.Sqrt((X - point.X) * (X - point.X) + (Y - point.Y) * (Y - point.Y));
        }

        public Point ToPoint()
        {
            return new Point(Convert.ToInt32(X), Convert.ToInt32(Y));
        }

        public System.Drawing.PointF ToPointF()
        {
            return new System.Drawing.PointF(X, Y);
        }

        public PointF Clone()
        {
            return new PointF(this);
        }

        public static bool AreEqualValues(PointF p1, PointF p2, double tolerance = 0.0001)
        {
            if (ReferenceEquals(p1, p2))
            {
                return true;
            }

            if (!ReferenceEquals(p1, null) && !ReferenceEquals(p2, null))
            {
                return Utils.EqualsOfFloatNumbers(p1.X, p2.X, tolerance) && Utils.EqualsOfFloatNumbers(p1.Y, p2.Y, tolerance);
            }

            return false;
        }

        public bool IsEmpty
        {
            get
            {
                return (Utils.EqualsOfFloatNumbers(X, 0) && Utils.EqualsOfFloatNumbers(Y, 0));
            }
        }

        public bool Equals(PointF p, double tolerance = 0.0001)
        {
            return AreEqualValues(this, p, tolerance);
        }

        public override string ToString()
        {
            return string.Format(CultureInfo.InvariantCulture, "{{X={0}, Y={1}}}", X, Y);
        }

        #region ICloneable Members

        object ICloneable.Clone()
        {
            var p = Clone();
            return p;
        }

        #endregion ICloneable Members
    }
}