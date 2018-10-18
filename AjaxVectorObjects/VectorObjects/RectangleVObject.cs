// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System.Drawing.Drawing2D;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using RectangleF = System.Drawing.RectangleF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class RectangleVObject : ShapeVObject
    {
        public RectangleVObject(RectangleF rectangle)
            : this(rectangle.Left, rectangle.Top, rectangle.Width, rectangle.Height)
        {
        }

        public RectangleVObject()
            : this(0, 0, MinDimension, MinDimension)
        {
        }

        public RectangleVObject(float left, float top, float width, float height)
        {
            Path = Math.Path.CreateRectanglePath(left, top, width, height);
        }

        protected internal bool IncludeBorder = false;

        public override RectangleF Bounds
        {
            get
            {
                if (!IncludeBorder)
                    return base.Bounds;

                var rectangle = base.Bounds;
                rectangle.X -= BorderWidth / 2;
                rectangle.Y -= BorderWidth / 2;
                rectangle.Width += BorderWidth;
                rectangle.Height += BorderWidth;
                return rectangle;
            }
        }

        internal void ChangeControlPoints(float? x1 = null, float? y1 = null, float? x2 = null, float? y2 = null)
        {
            var rectangle = ControlBounds;
            if (x1.HasValue)
                rectangle.X = x1.Value;
            if (y1.HasValue)
                rectangle.Y = y1.Value;
            if (x2.HasValue)
                rectangle.Width = x2.Value - rectangle.X;
            if (y2.HasValue)
                rectangle.Height = y2.Value - rectangle.Y;

            Path = Math.Path.CreateRectanglePath(rectangle);
        }

        protected internal override Path GetDrawingPath(float dpi = 72)
        {
            if (!IncludeBorder)
                return base.GetDrawingPath(dpi);

            var rect = Rectangle;
            var border = FixedBorderWidth && !Utils.EqualsOfFloatNumbers(dpi, 72) ? BorderWidth * 72f / dpi : BorderWidth;
            rect.Width += border;
            rect.Height += border;

            var path = rect.GetPath();

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

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}