// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Globalization;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoText : SvgVoContent, ISvgCompositeElement
    {
        private SvgText _text = new SvgText();

        private string _textColor;

        private bool _oldItalic;

        private FontSettings _font;

        public string Text { get; set; }

        public System.Drawing.Color TextColor { get; set; }

        public FontSettings Font
        {
            get
            {
                if (_font == null)
                {
                    var fontFamily = !string.IsNullOrEmpty(_text.FontFamily) ? _text.FontFamily : "Arial";
                    var bold = !string.IsNullOrEmpty(_text.FontWeight) && _text.FontWeight.Contains("bold");
                    _font = FontService.FindSuitableFont(fontFamily, bold, _oldItalic, _text.FontStyle);
                }

                _font.Size = _text.FontSize;

                return _font;
            }
            set
            {
                _font = value;
            }
        }

        public TextAlignment Alignment { get; set; }

        public bool Underline { get; set; }

        public float Tracking { get; set; }

        public float Leading { get; set; }

        public bool IsRichText { get; set; }

        public float VerticalScale { get; set; }

        public float HorizontalScale { get; set; }

        private const string _underlineDecoration = "underline";

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            if (baseAttributes != null)
            {
                foreach (var attr in baseAttributes)
                {
                    yield return attr;
                }
            }

            yield return
                new SvgAttribute("alignment", TextAlignment.Left.ToString().ToLowerInvariant(), XmlNamespace.AurigmaVectorObjects,
                    () => Alignment.ToString().ToLowerInvariant(),
                    v => Alignment = SvgAttribute.ParseEnumAttribute<TextAlignment>(v));

            yield return
                new SvgAttribute("text-color", "", XmlNamespace.AurigmaVectorObjects,
                    () => _textColor,
                    v => _textColor = v);

            yield return
                new SvgAttribute("font-postscript-name", "", XmlNamespace.AurigmaVectorObjects,
                    () => _font.PostScriptName,
                    v =>
                    {
                        if (_font == null)
                            _font = new FontSettings();
                        _font.PostScriptName = v;
                    });

            yield return
                new SvgAttribute("font-fauxbold", bool.FalseString, XmlNamespace.AurigmaVectorObjects,
                    () => _font.FauxBold.ToString(CultureInfo.InvariantCulture),
                    v =>
                    {
                        if (_font == null)
                            _font = new FontSettings();
                        _font.FauxBold = SvgAttribute.ParseBooleanAttribute(v);
                    });

            yield return
                new SvgAttribute("font-fauxitalic", bool.FalseString, XmlNamespace.AurigmaVectorObjects,
                    () => _font.FauxItalic.ToString(CultureInfo.InvariantCulture),
                    v =>
                    {
                        if (_font == null)
                            _font = new FontSettings();
                        _font.FauxItalic = SvgAttribute.ParseBooleanAttribute(v);
                    });

            yield return
                new SvgAttribute("tracking", "0",
                    () => Tracking.ToString(CultureInfo.InvariantCulture),
                    v => Tracking = SvgAttribute.ParseFloatAttribute(v));

            yield return
                new SvgAttribute("leading", "0",
                    () => Leading.ToString(CultureInfo.InvariantCulture),
                    v => Leading = SvgAttribute.ParseFloatAttribute(v));

            yield return
                new SvgAttribute("is-rich-text", bool.FalseString,
                    () => IsRichText.ToString(),
                    v => IsRichText = SvgAttribute.ParseBooleanAttribute(v));

            yield return
                new SvgAttribute("vertical-scale", "0",
                    () => VerticalScale.ToString(CultureInfo.InvariantCulture),
                    v => VerticalScale = SvgAttribute.ParseFloatAttribute(v));

            yield return
                new SvgAttribute("horizontal-scale", "0",
                    () => HorizontalScale.ToString(CultureInfo.InvariantCulture),
                    v => HorizontalScale = SvgAttribute.ParseFloatAttribute(v));

            yield return
                new SvgAttribute("italic", bool.FalseString,
                    null,
                    v => _oldItalic = SvgAttribute.ParseBooleanAttribute(v));
        }

        protected virtual void WriteText(SvgText text)
        {
            text.Text = Text;
            text.X = X;
            text.Y = Y;
            text.Fill = TextColor;

            text.FontFamily = "Arial";
            text.FontSize = _font.Size;
            text.FontStyle = "Regular";

            text.TextDecoration = Underline ? _underlineDecoration : null;
            text.Transform = new Matrix();
            text.Transform.Translate(StrokeWidth / 2, GetFontHeight());
        }

        protected virtual void ReadText(SvgText text)
        {
            Text = text.Text;
            TextColor = text.Fill;

            Underline = text.TextDecoration != null && text.TextDecoration.Contains(_underlineDecoration);
        }

        internal void SetTextColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            TextColor = preview;
            _textColor = serializer.Serialize(color);
        }

        internal Color GetTextColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_textColor) ? serializer.Deserialize<Color>(_textColor) : new RgbColor(TextColor);
        }

        protected float GetFontHeight()
        {
            return _text.FontSize * 72 / 96;
        }

        #region ISvgCompositeElement Members

        public new void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            base.WriteContent(xmlElement, svgWriter);

            WriteText(_text);

            var xml = svgWriter.CreateXmlElementFromSvg(_text);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_text, xml);
        }

        public new void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            base.ReadContent(xmlElement, svgReader);

            _text = null;
            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null)
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    svgReader.Read(svgNode, childElement);
                    if (svgNode is SvgText)
                        _text = svgNode as SvgText;
                }

                if (_text != null)
                    break;
            }

            if (_text != null)
                ReadText(_text);
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoText);
        }

        #endregion ISvgCompositeElement Members
    }
}