// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using RectangleF = System.Drawing.RectangleF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class EllipseVObject : ShapeVObject
    {
        public EllipseVObject(RectangleF rectangle)
            : this(rectangle.Left, rectangle.Top, rectangle.Width, rectangle.Height)
        {
        }

        public EllipseVObject()
            : this(0, 0, MinDimension, MinDimension)
        {
        }

        public EllipseVObject(float left, float top, float width, float height)
        {
            using (var path = new Path())
            {
                path.DrawEllipse(left, top, width, height);
                Path = Math.Path.FromAdvancedPath(path);
            }
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}