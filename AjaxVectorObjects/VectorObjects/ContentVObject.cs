// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using RectangleF = System.Drawing.RectangleF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public abstract class ContentVObject : RectangleVObject
    {
        protected ContentVObject()
            : this(new RectangleF(0, 0, MinDimension, MinDimension))
        {
        }

        protected ContentVObject(RectangleF rectangle)
            : base(rectangle)
        {
            IncludeBorder = true;
            BorderWidth = 0f;
            FillColor = RgbColor.Transparent;
            MaskColor = new RgbColor(0, 0, 0, 204);
        }

        public RgbColor MaskColor { get; set; }

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            base.Draw(graphics, destImageParams, colorManagement);

            DrawContent(graphics, destImageParams, colorManagement);
        }

        protected internal abstract RotatedRectangleF GetDrawingRectangle(float dpi = 72);

        protected internal abstract void DrawContent(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement);
    }
}