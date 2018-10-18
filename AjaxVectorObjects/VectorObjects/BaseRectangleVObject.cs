// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System.Drawing;
using System.Drawing.Drawing2D;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public abstract class BaseRectangleVObject : VObject
    {
        protected static readonly float MinDimension = 0.001F;

        protected BaseRectangleVObject(float left, float top, float width, float height)
        {
            ControlPoints = new[] { new PointF(left, top), new PointF(left + width, top + height) };
            TextWrappingMode = TextWrappingMode.None;
        }

        protected BaseRectangleVObject(RectangleF rectangle)
            : this(rectangle.Left, rectangle.Top, rectangle.Width, rectangle.Height)
        {
        }

        protected BaseRectangleVObject()
            : this(0, 0, 0, 0)
        {
        }

        public RotatedRectangleF Rectangle
        {
            get
            {
                var controlBounds = ControlBounds;
                var transform = Transform;

                var size = new PointF(controlBounds.Width, controlBounds.Height);
                size.Scale(transform.ScaleX, transform.ScaleY);

                var center = ControlCenter;
                center.Translate(transform.TranslateX, transform.TranslateY);

                return new RotatedRectangleF(center.X, center.Y, size.X, size.Y, (float)transform.Angle);
            }
            set
            {
                var controlBounds = ControlBounds;
                var center = ControlCenter;

                double scaleX = Utils.EqualsOfFloatNumbers(controlBounds.Width, 0) ? 0 : value.Width / controlBounds.Width;
                double scaleY = Utils.EqualsOfFloatNumbers(controlBounds.Height, 0) ? 0 : value.Height / controlBounds.Height;
                double angle = value.Angle;
                double translateX = value.CenterX - center.X;
                double translateY = value.CenterY - center.Y;

                Transform = new Transform(scaleX, scaleY, translateX, translateY, angle);
            }
        }

        public double Angle
        {
            get
            {
                return Transform.Angle;
            }
            set
            {
                Transform.Angle = value;
            }
        }

        public float Height
        {
            get
            {
                return Rectangle.Height;
            }
            set
            {
                var r = Rectangle;
                r.Height = value;
                Rectangle = r;
            }
        }

        public float Width
        {
            get
            {
                return Rectangle.Width;
            }
            set
            {
                var r = Rectangle;
                r.Width = value;
                Rectangle = r;
            }
        }

        public PointF Location
        {
            get
            {
                return Rectangle.Location;
            }
            set
            {
                var r = Rectangle;
                r.Location = value;
                Rectangle = r;
            }
        }

        private float _opacity = 1;

        public float Opacity
        {
            get { return _opacity; }
            set
            {
                value = System.Math.Max(0, System.Math.Min(value, 1));
                if (!Utils.EqualsOfFloatNumbers(_opacity, value))
                {
                    _opacity = value;
                }
            }
        }

        public override RectangleF Bounds
        {
            get
            {
                return Rectangle.Bounds;
            }
        }

        internal PointF ControlCenter
        {
            get
            {
                var r = ControlBounds;
                var centerX = (r.Left + r.Right) / 2;
                var centerY = (r.Top + r.Bottom) / 2;
                return new PointF(centerX, centerY);
            }
        }

        internal virtual RectangleF ControlBounds
        {
            get
            {
                var cp = ControlPoints;
                var rect = RectangleF.FromLTRB(cp[0].X, cp[0].Y, cp[1].X, cp[1].Y);
                return rect;
            }
        }

        public TextWrappingMode TextWrappingMode { get; set; }

        protected internal virtual Path GetPath()
        {
            return Rectangle.GetPath();
        }

        protected internal virtual Path GetDrawingPath(float dpi = 72)
        {
            var path = GetPath();

            if (!Utils.EqualsOfFloatNumbers(dpi, 72))
            {
                using (var matrix = new Matrix())
                {
                    matrix.Scale(dpi / 72, dpi / 72, MatrixOrder.Append);
                    path.ApplyTransform(matrix);
                }
            }

            return path;
        }
    }
}