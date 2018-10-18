// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoSvg : SvgVoRectangle, ISvgCompositeElement
    {
        private readonly string _name = "g";
        private SvgRect _rect = new SvgRect();

        private string _strokeColor;

        public override string Name
        {
            get { return _name; }
        }

        public override string LocalName
        {
            get { return _name; }
        }

        public string Svg { get; set; }

        public override IEnumerable<SvgAttribute> GetAttributes()
        {
            var baseAttributes = base.GetAttributes();
            if (baseAttributes != null)
            {
                foreach (var attr in baseAttributes)
                {
                    // Skip rect attributes
                    if (attr.NamespaceUri == XmlNamespace.Svg)
                    {
                        if (attr.LocalName == "x" || attr.LocalName == "y" || attr.LocalName == "width" || attr.LocalName == "height" ||
                            attr.LocalName == "stroke-width" || attr.LocalName == "stroke" || attr.LocalName == "stroke-opacity" ||
                            attr.LocalName == "fill" || attr.LocalName == "fill-opacity")
                            continue;
                    }

                    yield return attr;
                }
            }

            yield return new SvgAttribute("stroke-color", "", XmlNamespace.AurigmaVectorObjects,
                () => _strokeColor,
                v => _strokeColor = v
            );
        }

        internal void SetStrokeColor(Color color, RgbColor preview, JsonVOSerializer serializer)
        {
            Stroke = preview;
            _strokeColor = serializer.Serialize(color);
        }

        internal Color GetStrokeColor(JsonVOSerializer serializer)
        {
            return !string.IsNullOrEmpty(_strokeColor) ? serializer.Deserialize<Color>(_strokeColor) : new RgbColor(Stroke);
        }

        #region ISvgCompositeElement Members

        public void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            _rect.Width = Width;
            _rect.Height = Height;
            _rect.X = X;
            _rect.Y = Y;
            _rect.Fill = Fill;
            _rect.Stroke = Stroke;
            _rect.StrokeWidth = StrokeWidth;

            var xml = svgWriter.CreateXmlElementFromSvg(_rect);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_rect, xml);

            var doc = new XmlDocument();
            doc.LoadXml(Svg);
            xml = (XmlElement)xmlElement.OwnerDocument.ImportNode(doc.DocumentElement, true);
            xmlElement.AppendChild(xml);
        }

        public void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            _rect = null;
            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null)
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    if (svgNode is SvgRect)
                    {
                        svgReader.Read(svgNode, childElement);
                        _rect = svgNode as SvgRect;
                    }
                    else if (childElement.Name == "svg")
                    {
                        Svg = childElement.OuterXml;
                    }
                }

                if (_rect != null && Svg != null)
                    break;
            }

            if (_rect != null && Svg != null)
            {
                X = _rect.X;
                Y = _rect.Y;
                Width = _rect.Width;
                Height = _rect.Height;
                Fill = _rect.Fill;
                Stroke = _rect.Stroke;
                StrokeWidth = _rect.StrokeWidth;
            }
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoSvg);
        }

        #endregion ISvgCompositeElement Members
    }
}