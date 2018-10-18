// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using AdvancedTextAlignment = Aurigma.GraphicsMill.AdvancedDrawing.TextAlignment;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class BoundedTextVObject : BaseTextVObject
    {
        public BoundedTextVObject(string text, RectangleF rectangle, string postScriptFontName = "ArialMT", float fontSize = 10)
            : base(text, rectangle, postScriptFontName, fontSize)
        {
            TextMode = TextMode.Bounded;

            WrappingRectangles = new List<RotatedRectangleF>();
            WrappingMargin = 7;

            ParagraphSettings = new ParagraphSettings();
            VerticalAlignment = TextVerticalAlignment.Top;
        }

        public BoundedTextVObject()
            : this("", new RectangleF(0, 0, 10, 10), null, -1)
        {
        }

        public List<RotatedRectangleF> WrappingRectangles { get; internal set; }

        public float WrappingMargin { get; set; }

        public ParagraphSettings ParagraphSettings { get; set; }

        public TextVerticalAlignment VerticalAlignment { get; set; }

        private bool _isVertical;

        public bool IsVertical
        {
            get { return _isVertical; }
            set
            {
                ValidRect = ValidRect && _isVertical == value;
                _isVertical = value;
            }
        }

        protected override Text CreateAdvancedText(string text, Graphics graphics)
        {
            var font = CreateFont(graphics);

            var dpi = graphics.DpiX;
            var rect = GetDrawingRectangle(dpi);
            rect.Width -= RenderingMargin * 2;
            rect.Height -= RenderingMargin * 2;

            var boundedText = new BoundedText(text, font, rect.ToRectangleF())
            {
                Alignment = VOAligmnentToAdvanced(Alignment),
                Underline = Underline,
                Tracking = Tracking,
                Leading = Utils.EqualsOfFloatNumbers(0, Leading) ? font.Size * 1.2f : Leading,
                Paragraph =
                {
                    FirstLineIndent = ParagraphSettings.FirstLineIndent,
                    SpaceAfter = ParagraphSettings.SpaceAfter,
                    SpaceBefore = ParagraphSettings.SpaceBefore,
                    OverlapLines = true
                },
                Vertical = IsVertical
            };

            if (!Utils.EqualsOfFloatNumbers(1, HorizontalScale) || !Utils.EqualsOfFloatNumbers(1, VerticalScale))
            {
                var rectangle = new RotatedRectangleF(boundedText.Rectangle);
                rectangle.Scale(1 / HorizontalScale, 1 / VerticalScale);

                boundedText.Rectangle = rectangle.ToRectangleF();
                boundedText.Transform.Scale(HorizontalScale, VerticalScale);
            }

            if (!string.IsNullOrEmpty(text))
                ExtendRectangle(boundedText, graphics);

            var rectHeight = rect.Height;
            var textHeight = boundedText.GetBlackBox().Height;

            var verticalOffset = 0f;
            switch (VerticalAlignment)
            {
                case TextVerticalAlignment.Center:
                    verticalOffset = (rectHeight - textHeight) / 2 - RenderingMargin;
                    break;

                case TextVerticalAlignment.Bottom:
                    verticalOffset = rectHeight - textHeight - RenderingMargin;
                    break;
            }

            if (verticalOffset > 0)
            {
                if (!Utils.EqualsOfFloatNumbers(1, VerticalScale))
                    verticalOffset *= 1 / VerticalScale;

                var rectangle = boundedText.Rectangle;
                rectangle.Y += verticalOffset;
                rectangle.Height -= verticalOffset;

                boundedText.Rectangle = rectangle;
            }

            var wrappingPath = GetWrappingPath(dpi);
            if (wrappingPath.Points.Count > 0)
                boundedText.WrappingPaths.Add(wrappingPath);

            return boundedText;
        }

        protected Path GetWrappingPath(float dpi = 72)
        {
            var rectangle = Rectangle;
            var path = new Path();
            foreach (var r in WrappingRectangles.Where(r => !r.IsEmpty && rectangle.IntersectsWith(r)))
            {
                var rectToWrap = r.Clone();
                rectToWrap.Width += WrappingMargin * 2;
                rectToWrap.Height += WrappingMargin * 2;

                path.DrawPath(rectToWrap.GetPath());
            }

            if (path.Points.Count > 0)
            {
                using (var matrix = new Matrix())
                {
                    if (!Utils.EqualsOfFloatNumbers(Angle, 0))
                        matrix.RotateAt(-(float)Angle, rectangle.Center.ToPointF());

                    if (!Utils.EqualsOfFloatNumbers(1, HorizontalScale) || !Utils.EqualsOfFloatNumbers(1, VerticalScale))
                        matrix.Scale(1 / HorizontalScale, 1 / VerticalScale, MatrixOrder.Append);

                    if (!Utils.EqualsOfFloatNumbers(dpi, 72))
                        matrix.Scale(dpi / 72, dpi / 72, MatrixOrder.Append);

                    path.ApplyTransform(matrix);
                }
            }

            return path;
        }

        private void ExtendRectangle(BoundedText text, Graphics graphics, int recursionLevel = 0)
        {
            const int maxRecursionLevel = 20;
            if (!text.GetBlackBox().IsEmpty || recursionLevel >= maxRecursionLevel)
                return;

            // Calculate increment for the rectangle dimensions. It must be a positive even integer.
            var increment = (int)(System.Math.Min(graphics.Width, graphics.Height) * 0.1f);
            if (increment % 2 == 1)
                increment += 1;
            increment = System.Math.Max(increment, Common.ConvertPointsToPixels(graphics.DpiX, 2));

            // Create an extended rectangle and move its top-left corner in accordance with the alignment
            var rect = new RectangleF(text.Rectangle.X, text.Rectangle.Y, text.Rectangle.Width + increment, text.Rectangle.Height + increment);
            if (text.Alignment == AdvancedTextAlignment.Center)
                rect.X -= increment / 2f;
            else if (text.Alignment == AdvancedTextAlignment.Right)
                rect.X -= increment;

            text.Rectangle = rect;
            ExtendRectangle(text, graphics, ++recursionLevel);
        }

        protected internal override RectangleF MeasureText(float dpi = 72, bool includeMargins = true)
        {
            if (Text == null || string.IsNullOrEmpty(Text.Trim()))
                return RectangleF.Empty;

            var mul = dpi / 72;
            var rect = Rectangle.ToRectangleF();
            rect.X = (float)System.Math.Ceiling(rect.X * mul);
            rect.Y = (float)System.Math.Ceiling(rect.Y * mul);
            rect.Width = (float)System.Math.Ceiling(rect.Width * mul);
            rect.Height = (float)System.Math.Ceiling(rect.Height * mul);

            return rect;
        }

        protected override List<byte> GetBytes()
        {
            var bytes = base.GetBytes();
            var rectangle = Rectangle;
            var wrappingPath = GetWrappingPath();

            if (wrappingPath.Points.Count == 0)
            {
                bytes.AddRange(BitConverter.GetBytes(rectangle.Width));
                bytes.AddRange(BitConverter.GetBytes(rectangle.Height));
            }
            else
            {
                bytes.AddRange(BitConverter.GetBytes(rectangle.CenterX));
                bytes.AddRange(BitConverter.GetBytes(rectangle.CenterY));
                bytes.AddRange(BitConverter.GetBytes(rectangle.Angle));

                foreach (var point in wrappingPath.Points)
                {
                    bytes.AddRange(BitConverter.GetBytes((int)point.Type));
                    bytes.AddRange(BitConverter.GetBytes(point.X));
                    bytes.AddRange(BitConverter.GetBytes(point.Y));
                }
            }

            if (IsRichText)
            {
                bytes.AddRange(BitConverter.GetBytes(ParagraphSettings.FirstLineIndent));
                bytes.AddRange(BitConverter.GetBytes(ParagraphSettings.SpaceAfter));
                bytes.AddRange(BitConverter.GetBytes(ParagraphSettings.SpaceBefore));
            }

            bytes.AddRange(BitConverter.GetBytes((int)VerticalAlignment));
            bytes.AddRange(BitConverter.GetBytes(IsVertical));

            return bytes;
        }

        public override VObjectData GetVObjectData()
        {
            return new BoundedTextVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "BoundedTextVObjectData";
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}