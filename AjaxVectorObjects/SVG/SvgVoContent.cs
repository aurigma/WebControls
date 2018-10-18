// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Collections.Generic;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class SvgVoContent : SvgVoRectangle, ISvgCompositeElement
    {
        private readonly string _name = "g";
        private SvgRect _rect = new SvgRect();

        public override string Name
        {
            get { return _name; }
        }

        public override string LocalName
        {
            get { return _name; }
        }

        public System.Drawing.Color MaskColor { get; set; }

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

            yield return new SvgAttribute("content-mask", "", XmlNamespace.AurigmaVectorObjects,
                () => Common.ConvertToWebColor(MaskColor),
                v => MaskColor = Common.ParseWebColor(v)
            );
        }

        #region ISvgCompositeElement Members

        public void WriteContent(XmlElement xmlElement, SvgWriter svgWriter)
        {
            _rect.Width = Width + StrokeWidth;
            _rect.Height = Height + StrokeWidth;
            _rect.X = X - StrokeWidth / 2;
            _rect.Y = Y - StrokeWidth / 2;
            _rect.Fill = Fill;
            _rect.Stroke = Stroke;
            _rect.StrokeWidth = StrokeWidth;

            var xml = svgWriter.CreateXmlElementFromSvg(_rect);
            xmlElement.AppendChild(xml);
            svgWriter.Write(_rect, xml);
        }

        public void ReadContent(XmlElement xmlElement, SvgReader svgReader)
        {
            Transform = SvgAttribute.ParseTransformAttribute(xmlElement.GetAttribute("transform"));

            _rect = null;
            foreach (var node in xmlElement.ChildNodes)
            {
                var childElement = node as XmlElement;
                if (childElement != null)
                {
                    var svgNode = svgReader.CreateSvgNodeFromXml(childElement);
                    svgReader.Read(svgNode, childElement);
                    if (svgNode is SvgRect)
                        _rect = svgNode as SvgRect;
                }

                if (_rect != null)
                    break;
            }

            if (_rect != null)
            {
                X = _rect.X + _rect.StrokeWidth / 2;
                Y = _rect.Y + _rect.StrokeWidth / 2;
                Width = _rect.Width - _rect.StrokeWidth;
                Height = _rect.Height - _rect.StrokeWidth;
                Fill = _rect.Fill;
                Stroke = _rect.Stroke;
                StrokeWidth = _rect.StrokeWidth;
            }
            else
                throw new SvgParseException(Resources.Exceptions.CanNotParseSvgVoContent);
        }

        #endregion ISvgCompositeElement Members
    }
}