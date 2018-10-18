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
    public class GridVObject : BaseRectangleVObject
    {
        public GridVObject()
            : this(0, 0, 0, 0, 0, 0)
        { }

        public GridVObject(float x, float y, int cols, int rows, float stepX, float stepY)
            : base(x, y, cols * stepX, rows * stepY)
        {
            Cols = cols;
            Rows = rows;
            StepX = stepX;
            StepY = stepY;
            FixedLineWidth = true;
            LineWidth = 1;
            VerticalLineColor = RgbColor.Black;
            HorizontalLineColor = RgbColor.Black;

            TextWrappingMode = TextWrappingMode.None;
        }

        public override RectangleF Bounds
        {
            get
            {
                var lineWidth = GetLineWidth();
                var rect = Rectangle;
                rect.Width += lineWidth;
                rect.Height += lineWidth;

                return rect.Bounds;
            }
        }

        public override bool Locked
        {
            get { return true; }
            set { }
        }

        public float LineWidth { get; set; }

        public bool FixedLineWidth { get; set; }

        public int Cols { get; set; }

        public int Rows { get; set; }

        public float StepX { get; set; }

        public float StepY { get; set; }

        private Color _verticalLineColor;

        public Color VerticalLineColor
        {
            get { return _verticalLineColor; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _verticalLineColor = value;
            }
        }

        private Color _horizontalLineColor;

        public Color HorizontalLineColor
        {
            get { return _horizontalLineColor; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _horizontalLineColor = value;
            }
        }

        internal override IEnumerable<Color> GetColors()
        {
            yield return HorizontalLineColor;
            yield return VerticalLineColor;
        }

        public override VObjectData GetVObjectData()
        {
            return new GridVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "GridVObjectData";
        }

        internal override void Draw(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var dpi = graphics.DpiX;

            var bounds = Bounds;
            var lineWidth = System.Math.Abs(GetLineWidth(dpi * graphics.Transform.Elements[0]));
            if (bounds.Width <= 0 || bounds.Height <= 0 || lineWidth <= 0)
                return;

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

            if (!VerticalLineColor.IsTransparent)
            {
                var verticalLineColor = ColorManagement.ConvertColor(colorManagement, VerticalLineColor, destImageParams);
                verticalLineColor = verticalLineColor.ScaleAlpha(Opacity);
                graphics.DrawPath(new Pen(verticalLineColor, lineWidth), paths[0]);
            }

            if (!HorizontalLineColor.IsTransparent)
            {
                var horizontalLineColor = ColorManagement.ConvertColor(colorManagement, HorizontalLineColor, destImageParams);
                horizontalLineColor = horizontalLineColor.ScaleAlpha(Opacity);
                graphics.DrawPath(new Pen(horizontalLineColor, lineWidth), paths[1]);
            }
        }

        private Path[] GetPaths()
        {
            var horizontalLineLength = Cols * StepX;
            var verticalLineLength = Rows * StepY;

            var left = ControlPoints[0].X;
            var top = ControlPoints[0].Y;

            var verticalPath = new Path();
            for (int i = 0; i <= Cols; i++)
            {
                var x = left + i * StepX;
                verticalPath.MoveTo(x, top);
                verticalPath.LineTo(x, verticalLineLength + top);
            }

            var horizonltalPath = new Path();
            for (int i = 0; i <= Rows; i++)
            {
                var y = top + i * StepY;
                horizonltalPath.MoveTo(left, y);
                horizonltalPath.LineTo(horizontalLineLength + left, y);
            }

            return new[] { verticalPath, horizonltalPath };
        }

        protected internal override Path GetPath()
        {
            var path = new Path();

            foreach (var p in GetPaths())
                path.DrawPath(p);

            return path;
        }

        private float GetLineWidth(float dpi = 72)
        {
            return FixedLineWidth ? LineWidth : LineWidth * dpi / 72f;
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}