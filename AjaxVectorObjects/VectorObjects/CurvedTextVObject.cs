// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.AdvancedDrawing;
using Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Text;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using Path = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.Path;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class CurvedTextVObject : BaseTextVObject
    {
        public CurvedTextVObject(string text, Path path, string postScriptFontName = "ArialMT", float fontSize = 10)
            : base(text, RectangleF.Empty, postScriptFontName, fontSize)
        {
            TextMode = TextMode.Curved;
            FitToPath = false;
            Stretch = false;
            FitToPathStep = 1;

            TextPath = path;
            PathStart = 0f;
            PathEnd = 1f;
        }

        public CurvedTextVObject()
            : this("", null, null, -1)
        { }

        protected internal override void Transform_TransformChanged(object sender, EventArgs e)
        {
            base.Transform_TransformChanged(sender, e);

            // Apply transform to TextPath and clear
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

            _textPath.Transform(transform, ControlCenter);
            Transform.Clear(keepAngle: true);
            ActualAngle = Transform.Angle;
            ValidRect = false;
        }

        private void _path_PathChanged(object sender, EventArgs e)
        {
            ValidRect = false;
        }

        #region "Properties"

        private Path _textPath;

        public Path TextPath
        {
            get
            {
                return _textPath;
            }
            set
            {
                if (_textPath != null && _textPath.Equals(value))
                    return;

                _textPath = value ?? new Path();
                _textPath.PathChanged += _path_PathChanged;
                ValidRect = false;
            }
        }

        private float _pathEnd;
        private float _pathStart;

        public float PathStart
        {
            get { return _pathStart; }
            set
            {
                ValidRect = ValidRect && Utils.EqualsOfFloatNumbers(_pathStart, value);
                _pathStart = value;
            }
        }

        public float PathEnd
        {
            get { return _pathEnd; }
            set
            {
                ValidRect = ValidRect && Utils.EqualsOfFloatNumbers(_pathEnd, value);
                _pathEnd = value;
            }
        }

        public double ActualAngle { get; set; }

        private bool _fitToPath;

        public bool FitToPath
        {
            get { return _fitToPath; }
            set
            {
                ValidRect = ValidRect && _fitToPath == value;
                _fitToPath = value;
            }
        }

        private bool _stretch;

        public bool Stretch
        {
            get { return _stretch; }
            set
            {
                ValidRect = ValidRect && _stretch == value;
                _stretch = value;
            }
        }

        public float OriginalFontSize { get; set; }

        private const float _fitToPathTolerance = 2;
        private const float _fitToPathMinStep = 0.1f;

        private float _fitToPathStep = 1;

        public float FitToPathStep
        {
            get { return _fitToPathStep; }
            set { _fitToPathStep = System.Math.Max(_fitToPathMinStep, value); }
        }

        #endregion "Properties"

        protected internal override void UpdateSize()
        {
            if (ValidRect)
                return;

            RotatedRectangleF textRect;
            if (!TextPath.IsEmpty)
            {
                var dpi = Canvas != null ? 96 * Canvas.Zoom : 72;
                textRect = new RotatedRectangleF(MeasureText(dpi));
                textRect.Scale(72 / dpi, 72 / dpi);

                var firstPoint = TextPath.GetFirstPoint();

                // Move text rectangle to the text path's first point because GetBlackBox returns an empty rectangle (in location 0:0) when text is empty
                if (textRect.IsEmpty)
                {
                    textRect.CenterX = firstPoint.X;
                    textRect.CenterY = firstPoint.Y;
                }

                textRect.RotateAt(Angle, firstPoint);
            }
            else
                textRect = new RotatedRectangleF();

            Path = Path.CreateRectanglePath(textRect.ToRectangleF());
            Transform.Clear(keepAngle: true);
            ActualAngle = Transform.Angle;
            ValidRect = true;
        }

        private void FitTextToPath(float dpi)
        {
            if (!FitToPath)
                return;

            using (var bitmap = new Bitmap(1, 1, PixelFormat.Format32bppArgb, RgbColor.Transparent) { DpiX = dpi, DpiY = dpi })
            using (var graphics = bitmap.GetAdvancedGraphics())
            {
                var path = GetDrawingTextPath(dpi);
                var pathLength = path.ToAdvancedPath().GetLength();
                var font = CreateFont(graphics);
                var textLength = font.MeasureString(Text).Width;

                var tolerance = Common.ConvertPointsToPixelsFloat(dpi, _fitToPathTolerance);

                if (textLength - pathLength > tolerance)
                {
                    while (textLength - pathLength > tolerance)
                    {
                        Font.Size -= FitToPathStep;

                        font = CreateFont(graphics);
                        textLength = font.MeasureString(Text).Width;
                    }
                }
                else if (OriginalFontSize > 0 && OriginalFontSize > Font.Size)
                {
                    while (pathLength - textLength > tolerance && OriginalFontSize > Font.Size)
                    {
                        Font.Size += FitToPathStep;

                        font = CreateFont(graphics);
                        textLength = font.MeasureString(Text).Width;
                    }
                }
            }
        }

        protected override Text CreateAdvancedText(string text, Graphics graphics)
        {
            if (TextPath == null || TextPath.IsEmpty)
                throw new InvalidOperationException("Path for CurvedText cannot be empty");

            if (PathStart > PathEnd || Utils.EqualsOfFloatNumbers(PathStart, PathEnd))
                throw new InvalidOperationException("Start point of path must be less than end point");

            var dpi = graphics.DpiX;

            FitTextToPath(dpi);

            var font = CreateFont(graphics);
            var path = GetDrawingTextPath(dpi);

            var pathText = new PathText(text, font)
            {
                // CurveText doesn't support underline
                Alignment = VOAligmnentToAdvanced(Alignment),
                Stretch = Stretch,
                Tracking = Tracking,
                Leading = Utils.EqualsOfFloatNumbers(0, Leading) ? font.Size * 1.2f : Leading,
                AutoExtend = true
            };

            if (!Utils.EqualsOfFloatNumbers(1, HorizontalScale) || !Utils.EqualsOfFloatNumbers(1, VerticalScale))
            {
                path.Scale(1 / HorizontalScale, 1 / VerticalScale);
                pathText.Transform.Scale(HorizontalScale, VerticalScale);
            }

            pathText.Path = path.ToAdvancedPath();
            pathText.Start = PathStart;
            pathText.End = PathEnd;

            return pathText;
        }

        protected internal override RotatedRectangleF GetDrawingRectangle(float dpi = 72)
        {
            var rectangle = new RotatedRectangleF(MeasureText(dpi));
            rectangle.RotateAt(Angle, GetDrawingFirstPoint(dpi));

            return rectangle;
        }

        protected internal override void RotateText(Text text, float dpi)
        {
            if (Utils.EqualsOfFloatNumbers(0, Angle))
                return;

            text.Transform.RotateAt((float)Angle, GetDrawingFirstPoint(dpi).ToPointF(), MatrixOrder.Append);
        }

        private Math.PointF GetDrawingFirstPoint(float dpi = 72)
        {
            return Utils.EqualsOfFloatNumbers(72, dpi) ?
                new Math.PointF(TextPath.GetFirstPoint()) :
                new Math.PointF(TextPath.GetFirstPoint()).Scale(dpi / 72, dpi / 72);
        }

        private Path GetDrawingTextPath(float dpi = 72)
        {
            var path = (Path)TextPath.Clone();

            if (!Utils.EqualsOfFloatNumbers(Angle, 0))
                path.RotateAt(-Angle, path.GetFirstPoint());

            if (!Utils.EqualsOfFloatNumbers(72, dpi))
                path.Scale(dpi / 72, dpi / 72);

            return path;
        }

        protected override List<byte> GetBytes()
        {
            var bytes = base.GetBytes();
            bytes.AddRange(Encoding.UTF8.GetBytes(TextPath.ToSvgString()));
            bytes.AddRange(BitConverter.GetBytes(Stretch));
            bytes.AddRange(BitConverter.GetBytes(PathStart));
            bytes.AddRange(BitConverter.GetBytes(PathEnd));

            return bytes;
        }

        public override VObjectData GetVObjectData()
        {
            return new CurvedTextVObjectData(this);
        }

        public override string GetVObjectDataType()
        {
            return "CurvedTextVObjectData";
        }

        public override void Accept(IVObjectVisitor visitor)
        {
            visitor.Visit(this);
        }
    }
}