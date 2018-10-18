// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;
using SPointF = System.Drawing.PointF;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class PlainTextVObject : BaseTextVObject
    {
        public PlainTextVObject(string text, SPointF baselineLocation, TextAlignment alignment, string postScriptFontName = "ArialMT", float fontSize = 10)
            : base(text, RectangleF.Empty, postScriptFontName, fontSize)
        {
            TextMode = TextMode.Plain;

            SetInternalAlignment(alignment);
            _baselineLocation = baselineLocation;
        }

        public PlainTextVObject(string text, PointF baselineLocation, TextAlignment alignment, string postScriptFontName, float fontSize)
            : this(text, baselineLocation.ToPointF(), alignment, postScriptFontName, fontSize)
        {
        }

        public PlainTextVObject()
            : this("", SPointF.Empty, TextAlignment.Left, null, -1)
        {
        }

        protected internal override void Transform_TransformChanged(object sender, EventArgs e)
        {
            base.Transform_TransformChanged(sender, e);

            // Apply transform to BaselineLocation and clear
            var transform = Transform.Clone();
            transform.Update(angle: Transform.Angle - ActualAngle);

            if (transform.IsEmpty)
                return;

            if (!ValidRect)
            {
                // Update size using actual transform
                var tmpTransform = Transform.Clone();
                Transform.Update(1, 1, 0, 0, ActualAngle);
                UpdateSize();
                Transform.Copy(tmpTransform);
            }

            _baselineLocation = new PointF(BaselineLocation).Transform(transform, ControlCenter).ToPointF();
            Transform.Clear(keepAngle: true);
            ActualAngle = Transform.Angle;
            ValidRect = false;
        }

        #region "Properties"

        private SPointF _baselineLocation;

        public SPointF BaselineLocation
        {
            get
            {
                return _baselineLocation;
            }
            set
            {
                if (Utils.EqualsOfPointF(_baselineLocation, value))
                    return;

                if (ValidRect)
                    Transform.Translate(value.X - _baselineLocation.X, value.Y - _baselineLocation.Y);
                else
                    _baselineLocation = value;
            }
        }

        public double ActualAngle { get; set; }

        public override TextAlignment Alignment
        {
            get
            {
                return base.Alignment;
            }
            set
            {
                if (base.Alignment == value)
                    return;

                var rect = Rectangle;
                var angle = rect.Angle;
                var center = rect.Center;

                rect.Angle = 0;

                var point = new PointF(BaselineLocation);
                point.RotateAt(-angle, center);

                switch (value)
                {
                    case TextAlignment.Center:
                        point.X = rect.CenterX;
                        break;

                    case TextAlignment.Right:
                        point.X = rect.Location.X + rect.Width;
                        break;

                    default:
                        point.X = rect.Location.X;
                        break;
                }

                point.RotateAt(angle, center);
                _baselineLocation = point.ToPointF();

                SetInternalAlignment(value);
            }
        }

        private bool _isVertical;

        public bool IsVertical
        {
            get
            {
                return _isVertical;
            }
            set
            {
                ValidRect = ValidRect && _isVertical == value;
                _isVertical = value;
            }
        }

        #endregion "Properties"

        protected internal override void UpdateSize()
        {
            if (ValidRect)
                return;

            var dpi = Canvas != null ? 96 * Canvas.Zoom : 72;
            var textRect = new RotatedRectangleF(MeasureText(dpi));
            textRect.Scale(72 / dpi, 72 / dpi);

            // Move text rectangle to the baseline location because GetBlackBox returns an empty rectangle (in location 0:0) when text is empty
            if (textRect.IsEmpty)
            {
                textRect.CenterX = BaselineLocation.X;
                textRect.CenterY = BaselineLocation.Y;
            }

            textRect.RotateAt(Angle, new PointF(BaselineLocation));

            Path = Math.Path.CreateRectanglePath(textRect.ToRectangleF());
            Transform.Clear(keepAngle: true);
            ActualAngle = Angle;

            ValidRect = true;
        }

        protected override Text CreateAdvancedText(string text, Graphics graphics)
        {
            var font = CreateFont(graphics);
            var dpi = graphics.DpiX;
            var location = GetDrawingBaselineLocation(dpi);

            var plainText = new PlainText(text, font)
            {
                Alignment = VOAligmnentToAdvanced(Alignment),
                Underline = Underline,
                Tracking = Tracking,
                Leading = Utils.EqualsOfFloatNumbers(0, Leading) ? font.Size * 1.2f : Leading,
                Paragraph = { OverlapLines = true },
                Vertical = IsVertical
            };

            if (!Utils.EqualsOfFloatNumbers(1, HorizontalScale) || !Utils.EqualsOfFloatNumbers(1, VerticalScale))
            {
                location.Scale(1 / HorizontalScale, 1 / VerticalScale);
                plainText.Transform.Scale(HorizontalScale, VerticalScale);
            }

            plainText.Position = location.ToPointF();

            return plainText;
        }

        protected internal override RotatedRectangleF GetDrawingRectangle(float dpi = 72)
        {
            var rectangle = new RotatedRectangleF(MeasureText(dpi));
            rectangle.RotateAt(Angle, GetDrawingBaselineLocation(dpi));

            return rectangle;
        }

        protected internal override void RotateText(Text text, float dpi)
        {
            if (Utils.EqualsOfFloatNumbers(0, Angle))
                return;

            text.Transform.RotateAt((float)Angle, GetDrawingBaselineLocation(dpi).ToPointF(), MatrixOrder.Append);
        }

        protected override List<byte> GetBytes()
        {
            var bytes = base.GetBytes();

            bytes.AddRange(BitConverter.GetBytes(IsVertical));

            return bytes;
        }

        private PointF GetDrawingBaselineLocation(float dpi = 72)
        {
            return Utils.EqualsOfFloatNumbers(72, dpi) ?
                new PointF(BaselineLocation) :
                new PointF(BaselineLocation).Scale(dpi / 72, dpi / 72);
        }

        public override VObjectData GetVObjectData()
        {
            return new PlainTextVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "PlainTextVObjectData";
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}