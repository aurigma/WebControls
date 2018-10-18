// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Xml;

namespace Aurigma.Svg
{
    public class SvgText : SvgGraphicElement, ISvgCompositeElement
    {
        private readonly string _name = "text";

        public SvgText()
        {
            Fill = Color.Black;
        }

        public override string LocalName
        {
            get { return _name; }
        }

        public override string Name
        {
            get { return _name; }
        }

        public string Text { get; set; }

        public float X { get; set; }

        public float Y { get; set; }

        public Color Fill { get; set; }

        public string TextAnchor { get; set; }

        public string FontFamily { get; set; }

        public string FontStyle { get; set; }

        public string FontWeight { get; set; }

        public float FontSize { get; set; }

        public string TextDecoration { get; set; }

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

            var ci = CultureInfo.InvariantCulture;

            yield return new SvgAttribute("x", "0",
                () => X.ToString(ci),
                value => X = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("y", "0",
                () => Y.ToString(ci),
                value => Y = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("fill",
                () => Fill.A == 0 ? "none" : ColorTranslator.ToSvg(Fill),
                v => Fill = SvgAttribute.ParseColorAttribute(v, Fill.A)
            );

            yield return new SvgAttribute("fill-opacity", "1",
                () => ((double)Fill.A / 255).ToString(ci),
                v => Fill = SvgAttribute.ParseOpacityAttribute(v, Fill)
            );

            yield return new SvgAttribute("text-anchor",
                () => TextAnchor,
                value => TextAnchor = value
            );

            yield return new SvgAttribute("font-family",
                () => FontFamily,
                value => FontFamily = value
            );

            yield return new SvgAttribute("font-style",
                () => FontStyle,
                value => FontStyle = value
            );

            yield return new SvgAttribute("font-weight",
                () => FontWeight,
                value => FontWeight = value
            );

            yield return new SvgAttribute("font-size",
                () => FontSize.ToString(ci),
                value => FontSize = SvgAttribute.ParseFloatAttribute(value)
            );

            yield return new SvgAttribute("text-decoration",
                () => TextDecoration,
                value => TextDecoration = value
            );
        }

        #region ISvgCompositeElement Members

        public void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            xmlElement.InnerText = Text;
        }

        public void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            Text = xmlElement.InnerText;
        }

        #endregion ISvgCompositeElement Members
    }
}