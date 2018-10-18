// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System.Xml;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class VoAttributeReader : IAttributeReader
    {
        private readonly string _voNamespace = XmlNamespace.AurigmaVectorObjects;

        #region IAttributeReader Members

        public void Read(SvgNode svgNode, XmlElement xmlElement)
        {
            var attributes = xmlElement.Attributes;
            foreach (var a in attributes)
            {
                var xmlAttr = a as XmlAttribute;
                if (xmlAttr == null)
                {
                    continue;
                }

                if (xmlAttr.NamespaceURI == _voNamespace)
                {
                    var svgAttr = new SvgVoAttribute(xmlAttr.LocalName, xmlAttr.Value);
                    svgNode.CustomAttributes.Add(svgAttr);
                }
            }
        }

        #endregion IAttributeReader Members
    }
}