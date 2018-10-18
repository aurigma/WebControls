// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoDashLine : SvgLine, ISvgCompositeElement
    {
        private readonly string _name = "g";
        private SvgLine _line1 = new SvgLine();
        private SvgLine _line2 = new SvgLine();

        private string _altColor;

        public override string LocalName
        {
            get { return _name; }
        }

        public override string Name
        {
            get { return _name; }
        }

        public System.Drawing.Color AltStroke { get; set; }

        public float AltDashWidth { get; set; }

        public float DashWidth { get; set; }

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            foreach (var attr in baseAttributes)
            {
                if (attr.NamespaceUri == XmlNamespace.Svg)
                {
                    if (attr.LocalName == "x1" || attr.LocalName == "y1" ||
                        attr.LocalName == "x2" || attr.LocalName == "y2" ||
                        attr.LocalName == "stroke" || attr.LocalName == "stroke-width" ||
                        attr.LocalName == "stroke-dashoffset" || attr.LocalName == "stroke-dasharray")
                    {
                        continue;
                    }
                }

                yield return attr;
            }

            yield return new SvgVoAttribute("alt-stroke", AltStroke);
            yield return new SvgVoAttribute("dash-width", DashWidth);
            yield return new SvgVoAttribute("alt-dash-width", AltDashWidth);

            yield return new SvgAttribute("alt-color", "", XmlNamespace.AurigmaVectorObjects,
                () => _altColor,
                v => _altColor = v
            );
        }

        internal void SetAltColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            AltStroke = preview;
            _altColor = serializer.Serialize(color);
        }

        internal Color GetAltColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_altColor) ? serializer.Deserialize<Color>(_altColor) : new RgbColor(AltStroke);
        }

        #region ISvgCompositeElement Members

        public void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            foreach (var line in new SvgLine[] { _line1, _line2 })
            {
                line.X1 = X1;
                line.Y1 = Y1;
                line.X2 = X2;
                line.Y2 = Y2;
                line.StrokeWidth = StrokeWidth;
            }

            _line1.Stroke = Stroke;
            _line2.Stroke = AltStroke;

            _line1.StrokeDashArray = new List<float>() { DashWidth, AltDashWidth };
            _line2.StrokeDashArray = new List<float>() { AltDashWidth, DashWidth };

            _line2.StrokeDashOffset = DashWidth;

            var xml = svgWriter.CreateXmlElementFromSvg(_line1);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_line1, xml);

            xml = svgWriter.CreateXmlElementFromSvg(_line2);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_line2, xml);
        }

        public void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            _line1 = null;
            _line2 = null;

            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null)
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    svgReader.Read(svgNode, childElement);
                    if (svgNode is SvgLine)
                    {
                        if (_line1 == null)
                            _line1 = svgNode as SvgLine;
                        else
                            _line2 = svgNode as SvgLine;
                    }
                }

                if (_line1 != null && _line2 != null)
                    break;
            }

            if (_line1 != null && _line2 != null)
            {
                X1 = _line1.X1;
                Y1 = _line1.Y1;
                X2 = _line1.X2;
                Y2 = _line1.Y2;
                StrokeWidth = _line1.StrokeWidth;
                Stroke = _line1.Stroke;
                AltStroke = _line2.Stroke;
                DashWidth = _line1.StrokeDashArray[0];
                AltDashWidth = _line1.StrokeDashArray[1];
            }
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoDashLine);
        }

        #endregion ISvgCompositeElement Members
    }
}