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
using System.Web;
using AdvancedTextAlignment = Aurigma.GraphicsMill.AdvancedDrawing.TextAlignment;
using Font = Aurigma.GraphicsMill.AdvancedDrawing.Font;
using Graphics = Aurigma.GraphicsMill.AdvancedDrawing.Graphics;
using Path = Aurigma.GraphicsMill.AdvancedDrawing.Path;
using PointF = Aurigma.GraphicsMill.AjaxControls.VectorObjects.Math.PointF;
using SolidBrush = Aurigma.GraphicsMill.AdvancedDrawing.SolidBrush;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public abstract class BaseTextVObject : ContentVObject
    {
        protected BaseTextVObject(string text, RectangleF rectangle, string postScriptFontName, float fontSize)
            : base(rectangle)
        {
            Text = text ?? string.Empty;

            Font = new ProtectedFontSettings(this)
            {
                PostScriptName = string.IsNullOrEmpty(postScriptFontName) ? "ArialMT" : postScriptFontName,
                Size = fontSize > 0 ? fontSize : 20.0F,
                FauxBold = false,
                FauxItalic = false
            };

            TextColor = RgbColor.Black;
            Underline = false;

            Tracking = 0;
            Leading = 0;

            _verticalScale = 1;
            _horizontalScale = 1;
            _alignment = TextAlignment.Left;

            Permissions.AllowArbitraryResize = false;
            Permissions.AllowProportionalResize = false;
        }

        protected BaseTextVObject()
            : this("", RectangleF.Empty, null, -1)
        { }

        internal override IEnumerable<Color> GetColors()
        {
            foreach (var color in base.GetColors())
            {
                yield return color;
            }

            yield return TextColor;
        }

        #region "Properties"

        protected internal const int RenderingMargin = 1;

        protected internal TextMode TextMode { get; set; }

        protected internal bool ValidRect { get; set; }

        internal string CurrentFileId { get; set; }

        public bool IsRichText { get; set; }

        private string _text;

        public string Text
        {
            get
            {
                return _text;
            }
            set
            {
                ValidRect = ValidRect && _text == value;
                _text = value;
            }
        }

        public readonly IFontSettings Font;

        private Color _textColor;

        public Color TextColor
        {
            get { return _textColor; }
            set
            {
                if (value.PixelFormat.IsExtended)
                    throw new NotSupportedException("16-bit colors are not supported.");

                _textColor = value;
            }
        }

        private bool _underline;

        public bool Underline
        {
            get
            {
                return _underline;
            }
            set
            {
                ValidRect = ValidRect && _underline == value;
                _underline = value;
            }
        }

        private TextAlignment _alignment;

        public virtual TextAlignment Alignment
        {
            get
            {
                return _alignment;
            }
            set
            {
                ValidRect = ValidRect && _alignment == value;
                _alignment = value;
            }
        }

        internal void SetInternalAlignment(TextAlignment value)
        {
            _alignment = value;
        }

        private float _tracking;

        public float Tracking
        {
            get
            {
                return _tracking;
            }
            set
            {
                ValidRect = ValidRect && Utils.EqualsOfFloatNumbers(_tracking, value);
                _tracking = value;
            }
        }

        private float _leading;

        public float Leading
        {
            get
            {
                return _leading;
            }
            set
            {
                ValidRect = ValidRect && Utils.EqualsOfFloatNumbers(_leading, value);
                _leading = value;
            }
        }

        private float _verticalScale;

        public virtual float VerticalScale
        {
            get { return _verticalScale; }
            set
            {
                value = !Utils.EqualsOfFloatNumbers(0, value) ? value : 1;
                ValidRect = ValidRect && Utils.EqualsOfFloatNumbers(_verticalScale, value);
                _verticalScale = value;
            }
        }

        private float _horizontalScale;

        public virtual float HorizontalScale
        {
            get { return _horizontalScale; }
            set
            {
                value = !Utils.EqualsOfFloatNumbers(0, value) ? value : 1;
                ValidRect = ValidRect && Utils.EqualsOfFloatNumbers(_horizontalScale, value);
                _horizontalScale = value;
            }
        }

        internal override PointF[] ControlPoints
        {
            get
            {
                UpdateSize();
                return base.ControlPoints;
            }
            set
            {
                base.ControlPoints = value;
            }
        }

        public override RectangleF Bounds
        {
            get
            {
                UpdateSize();
                return base.Bounds;
            }
        }

        #endregion "Properties"

        protected internal virtual void UpdateSize()
        {
            ValidRect = true;
        }

        protected internal override void DrawContent(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            if (Text != null && !string.IsNullOrEmpty(Text.Trim()) && !TextColor.IsTransparent)
                DrawText(graphics, destImageParams, colorManagement);
        }

        internal void DrawText(Graphics graphics, IImageParams destImageParams, ColorManagement colorManagement)
        {
            var text = CreateText(graphics);

            var color = ColorManagement.ConvertColor(colorManagement, TextColor, destImageParams);
            color = color.ScaleAlpha(Opacity);
            text.Brush = new SolidBrush(color);

            RotateText(text, graphics.DpiX);

            graphics.DrawText(text);
        }

        protected internal virtual void RotateText(Text text, float dpi)
        {
            if (Utils.EqualsOfFloatNumbers(Angle, 0))
                return;

            var center = GetDrawingRectangle(dpi).Center.ToPointF();
            text.Transform.RotateAt((float)Angle, center, MatrixOrder.Append);
        }

        private Text CreateText(Graphics graphics)
        {
            try
            {
                return CreateAdvancedText(Utils.EqualsOfFloatNumbers(Opacity, 1) ?
                    Text.TrimEnd() :
                    Common.ProcessSpanStyles(Text.TrimEnd(), stylesDict => ApplyOpacityToRichText(stylesDict, Opacity)), graphics);
            }
            catch (GMException ex)
            {
                if (!(ex is UnknownTagException) && !(ex is InvalidStyleValueException) && !(ex is UnknownStyleNameException))
                    throw;

                Configuration.Logger.Warning(string.Format("Invalid rich text value in text vObject (Name - {0}, Id - {1})", Name, UniqueId), ex);

                return CreateAdvancedText(HttpUtility.HtmlEncode(Text), graphics);
            }
        }

        private static bool ApplyOpacityToRichText(IDictionary<string, string> styleDict, float opacity)
        {
            if (!styleDict.ContainsKey("color") || Utils.EqualsOfFloatNumbers(opacity, 0))
                return false;

            var color = Common.ParseGmXmlColor(styleDict["color"]).ScaleAlpha(opacity);

            styleDict["color"] = Common.ConvertToGmXmlColor(color);

            return true;
        }

        protected abstract Text CreateAdvancedText(string text, Graphics graphics);

        protected Font CreateFont(Graphics graphics)
        {
            lock (Configuration.Instance.FontRegistry)
                graphics.FontRegistry = new CustomFontRegistry(Configuration.Instance.FontRegistry);

            var gmFont = graphics.CreateFont(Font.PostScriptName, Font.Size);

            gmFont.FauxBold = Font.FauxBold;
            gmFont.FauxItalic = Font.FauxItalic;

            return gmFont;
        }

        protected AdvancedTextAlignment VOAligmnentToAdvanced(TextAlignment alignment)
        {
            switch (alignment)
            {
                case TextAlignment.Center:
                    return AdvancedTextAlignment.Center;

                case TextAlignment.Right:
                    return AdvancedTextAlignment.Right;

                default:
                    return AdvancedTextAlignment.Left;
            }
        }

        protected internal virtual RectangleF MeasureText(float dpi = 72, bool includeMargins = true)
        {
            if (Text == null || string.IsNullOrEmpty(Text.Trim()))
                return RectangleF.Empty;

            var scale = dpi / TargetDpi ?? 1;
            using (var bitmap = new Bitmap(1, 1, PixelFormat.Format32bppArgb, RgbColor.Transparent))
            {
                bitmap.DpiX = dpi / scale;
                bitmap.DpiY = dpi / scale;
                using (var graphics = bitmap.GetAdvancedGraphics())
                {
                    var text = CreateText(graphics);
                    text.Brush = new SolidBrush(RgbColor.Black);

                    var margin = includeMargins ? RenderingMargin : 0;
                    var blackBox = text.GetBlackBox();
                    return new RectangleF(
                        blackBox.X * scale - margin,
                        blackBox.Y * scale - margin,
                        blackBox.Width * scale + margin * 2,
                        blackBox.Height * scale + margin * 2);
                }
            }
        }

        protected internal override Path GetDrawingPath(float dpi = 72)
        {
            var border = GetBorderWidth(dpi);
            border = Common.ConvertPointsToPixelsFloat(dpi, border);
            var rect = GetDrawingRectangle(dpi);
            rect.Width += border;
            rect.Height += border;

            return rect.GetPath();
        }

        protected internal override RotatedRectangleF GetDrawingRectangle(float dpi = 72)
        {
            return new RotatedRectangleF(MeasureText(dpi), (float)Angle);
        }

        internal string GetMD5(float dpi)
        {
            var bytes = GetBytes();
            bytes.AddRange(BitConverter.GetBytes(dpi));

            var color = ColorManagement.GetPreviewColor(GetColorManagement(true), TextColor);
            bytes.AddRange(BitConverter.GetBytes(color.ToInt32()));

            if (TargetDpi.HasValue)
                bytes.AddRange(BitConverter.GetBytes(TargetDpi.Value));

            return AjaxControls.Common.CalculateMD5(bytes.ToArray());
        }

        protected virtual List<byte> GetBytes()
        {
            var s = Text + Font.PostScriptName;
            var bytes = new List<byte>(Encoding.UTF8.GetByteCount(s));
            bytes.AddRange(Encoding.UTF8.GetBytes(s));

            bytes.AddRange(BitConverter.GetBytes(Font.Size));
            bytes.AddRange(BitConverter.GetBytes(Font.FauxBold));
            bytes.AddRange(BitConverter.GetBytes(Font.FauxItalic));
            bytes.AddRange(BitConverter.GetBytes(Underline));
            bytes.AddRange(BitConverter.GetBytes((int)Alignment));
            bytes.AddRange(BitConverter.GetBytes((int)TextMode));
            bytes.AddRange(BitConverter.GetBytes(Tracking));
            bytes.AddRange(BitConverter.GetBytes(Leading));
            bytes.AddRange(BitConverter.GetBytes(VerticalScale));
            bytes.AddRange(BitConverter.GetBytes(HorizontalScale));

            return bytes;
        }

        #region Nested types

        public interface IFontSettings
        {
            string PostScriptName { get; set; }

            float Size { get; set; }

            bool FauxBold { get; set; }

            bool FauxItalic { get; set; }
        }

        protected class ProtectedFontSettings : IFontSettings
        {
            private readonly BaseTextVObject _textVObject;

            public ProtectedFontSettings(BaseTextVObject textVObject)
            {
                _textVObject = textVObject;
            }

            private string _postScriptName;

            public string PostScriptName
            {
                get { return _postScriptName; }
                set
                {
                    if (value == _postScriptName)
                        return;

                    _textVObject.ValidRect = false;
                    _postScriptName = value;
                }
            }

            private float _size;

            public float Size
            {
                get { return _size; }
                set
                {
                    _textVObject.ValidRect = _textVObject.ValidRect && Utils.EqualsOfFloatNumbers(_size, value);
                    _size = value;
                }
            }

            private bool _fauxBold;

            public bool FauxBold
            {
                get { return _fauxBold; }
                set
                {
                    if (value == _fauxBold)
                        return;

                    _textVObject.ValidRect = false;
                    _fauxBold = value;
                }
            }

            private bool _fauxItalic;

            public bool FauxItalic
            {
                get { return _fauxItalic; }
                set
                {
                    if (value == _fauxItalic)
                        return;

                    _textVObject.ValidRect = false;
                    _fauxItalic = value;
                }
            }
        }

        #endregion Nested types
    }
}