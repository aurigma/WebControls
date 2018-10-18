// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using Path = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path;
using Pen = Aurigma.GraphicsMill.AdvancedDrawing.Pen;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;
using SolidBrush = Aurigma.GraphicsMill.AdvancedDrawing.SolidBrush;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ShapeVObject : BaseRectangleVObject
    {
        public ShapeVObject()
            : this(null)
        {
        }

        public ShapeVObject(Path path)
            : this(path, 0)
        {
        }

        public ShapeVObject(Path path, float angle)
        {
            Path = path;
            Angle = angle;
            FillColor = new RgbColor(112, 112, 112, 255);
            BorderColor = new RgbColor(0, 0, 0, 255);
            BorderWidth = 1F;
            FixedBorderWidth = false;
        }

        private Path _path;

        public Path Path
        {
            get
            {
                return _path;
            }
            set
            {
                _path = value ?? new Path();
                _path.PathChanged += (sender, args) => UpdateControlPoints();

                UpdateControlPoints();
            }
        }

        private Color _borderColor;

        public Color BorderColor
        {
            get { return _borderColor; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _borderColor = value;
            }
        }

        private Color _fillColor;

        public Color FillColor
        {
            get { return _fillColor; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _fillColor = value;
            }
        }

        public float BorderWidth { get; set; }

        public bool FixedBorderWidth { get; set; }

        private void UpdateControlPoints()
        {
            if (Path == null)
                return;

            var bounds = Path.ToAdvancedPath().GetBounds();
            ControlPoints = new[] { new PointF(bounds.Left, bounds.Top), new PointF(bounds.Right, bounds.Bottom) };
        }

        internal override IEnumerable<Color> GetColors()
        {
            yield return FillColor;
            yield return BorderColor;
        }

        public override RectangleF Bounds
        {
            get
            {
                var rectangle = GetTransformedPath().ToAdvancedPath().GetBounds();
                rectangle.X -= BorderWidth / 2;
                rectangle.Y -= BorderWidth / 2;
                rectangle.Width += BorderWidth;
                rectangle.Height += BorderWidth;

                return rectangle;
            }
        }

        protected internal float GetBorderWidth(float dpi = 72)
        {
            return FixedBorderWidth || Utils.EqualsOfFloatNumbers(dpi, 72) ? Common.ConvertPixelsToPoints(dpi, BorderWidth) : BorderWidth;
        }

        internal Path GetTransformedPath()
        {
            var path = (Path)_path.Clone();
            path.Transform(Transform, ControlCenter);
            return path;
        }

        protected internal Drawer GetShapeDrawer(IImageParams destImageParams, ColorManagement colorManagement, float scale)
        {
            var drawer = new Drawer();
            drawer.Draw += (sender, e) =>
            {
                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    e.Graphics.Transform.Scale(scale, scale);

                FillShape(e.Graphics, destImageParams, colorManagement);
                StrokeShape(e.Graphics, destImageParams, colorManagement);

                if (!Utils.EqualsOfFloatNumbers(scale, 1))
                    e.Graphics.Transform.Scale(1 / scale, 1 / scale);
            };

            return drawer;
        }

        protected internal override AdvancedDrawing.Path GetPath()
        {
            return GetTransformedPath().ToAdvancedPath();
        }

        protected internal void FillShape(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            if (FillColor.IsTransparent)
                return;

            using (var path = GetDrawingPath(graphics.DpiX))
            {
                var fillColor = ColorManagement.ConvertColor(colorManagement, FillColor, destImageParams);
                fillColor = fillColor.ScaleAlpha(Opacity);
                graphics.FillPath(new SolidBrush(fillColor), path);
            }
        }

        protected internal void StrokeShape(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var bounds = Bounds;
            if (bounds.Width <= 0 || bounds.Height <= 0)
                return;

            var dpi = graphics.DpiX;
            var borderWidth = GetBorderWidth(dpi * graphics.Transform.Elements[0]);

            if (Utils.EqualsOfFloatNumbers(0, borderWidth))
                return;

            using (var path = GetDrawingPath(dpi))
            {
                var borderColor = ColorManagement.ConvertColor(colorManagement, BorderColor, destImageParams);
                borderColor = borderColor.ScaleAlpha(Opacity);
                graphics.DrawPath(new Pen(borderColor, borderWidth), path);
            }
        }

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            FillShape(graphics, destImageParams, colorManagement);
            StrokeShape(graphics, destImageParams, colorManagement);
        }

        public override VObjectData GetVObjectData()
        {
            return new ShapeVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "ShapeVObjectData";
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}