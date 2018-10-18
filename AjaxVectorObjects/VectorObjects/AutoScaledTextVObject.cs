// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class AutoScaledTextVObject : BaseTextVObject
    {
        public AutoScaledTextVObject(string text, RectangleF rectangle, string postScriptFontName = "ArialMT")
            : base(text, rectangle, postScriptFontName, -1)
        {
            TextMode = TextMode.AutoScaled;
        }

        public AutoScaledTextVObject() : this("", new RectangleF(0, 0, 10, 10), null)
        {
        }

        public override float VerticalScale
        {
            get { return base.VerticalScale; }
            set { }
        }

        public override float HorizontalScale
        {
            get { return base.HorizontalScale; }
            set { }
        }

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

            var plainText = new PlainText(text, font)
            {
                Alignment = VOAligmnentToAdvanced(Alignment),
                Underline = Underline,
                Tracking = Tracking,
                Leading = Utils.EqualsOfFloatNumbers(0, Leading) ? font.Size * 1.2f : Leading,
                Paragraph = { OverlapLines = true },
                Vertical = IsVertical
            };

            var rectangle = MeasureText(graphics.DpiX);
            var blackbox = plainText.GetBlackBox();

            var horizontalScale = !Utils.EqualsOfFloatNumbers(blackbox.Width, 0) ? (rectangle.Width - RenderingMargin * 2) / blackbox.Width : 1f;
            var verticalScale = !Utils.EqualsOfFloatNumbers(blackbox.Height, 0) ? (rectangle.Height - RenderingMargin * 2) / blackbox.Height : 1f;

            float alignmentShift = 0;
            if (Alignment != TextAlignment.Left)
            {
                alignmentShift = !IsVertical ? rectangle.Width - blackbox.Width : rectangle.Height - blackbox.Height;
                alignmentShift -= RenderingMargin * 2;
                if (Alignment == TextAlignment.Center)
                {
                    alignmentShift /= 2;
                }
            }

            if (!IsVertical)
                plainText.Transform.Translate(rectangle.X - blackbox.X + alignmentShift, rectangle.Y - blackbox.Y * verticalScale);
            else
                plainText.Transform.Translate(rectangle.X - blackbox.X * horizontalScale, rectangle.Y - blackbox.Y + alignmentShift);

            if (!Utils.EqualsOfFloatNumbers(1, horizontalScale) || !Utils.EqualsOfFloatNumbers(1, verticalScale))
                plainText.Transform.Scale(horizontalScale, verticalScale);

            return plainText;
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

            bytes.AddRange(BitConverter.GetBytes(rectangle.Width));
            bytes.AddRange(BitConverter.GetBytes(rectangle.Height));
            bytes.AddRange(BitConverter.GetBytes(IsVertical));

            return bytes;
        }

        public override VObjectData GetVObjectData()
        {
            return new AutoScaledTextVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "AutoScaledTextVObjectData";
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}