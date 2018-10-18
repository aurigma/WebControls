// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Xml;

namespace Aurigma.Svg
{
    public class SvgWriter
    {
        private ITypeResolver _typeResolver;
        private XmlDocument _xmlDocument;

        public SvgWriter(XmlDocument xmlDocument)
            : this(xmlDocument, new TypeResolver())
        { }

        public SvgWriter(XmlDocument xmlDocument, ITypeResolver typeResolver)
        {
            _xmlDocument = xmlDocument;
            _typeResolver = typeResolver;
        }

        public virtual void Write(SvgNode svgNode, XmlElement xmlElement)
        {
            WriteAttributes(svgNode, xmlElement);

            var composite = svgNode as ISvgCompositeElement;
            if (composite != null)
            {
                composite.WriteContent(xmlElement, this);
            }
            else
            {
                WriteChildNodes(svgNode, xmlElement);
            }
        }

        protected virtual void WriteChildNodes(SvgNode svgNode, XmlElement xmlElement)
        {
            var childNodes = svgNode.ChildNodes;
            if (childNodes != null)
            {
                foreach (var childNode in svgNode.ChildNodes)
                {
                    var childElement = CreateXmlElementFromSvg(childNode);
                    if (childElement != null)
                    {
                        xmlElement.AppendChild(childElement);
                        Write(childNode, childElement);
                    }
                }
            }
        }

        protected virtual void WriteAttributes(SvgNode svgNode, XmlElement xmlElement)
        {
            var topParentNode = xmlElement;
            while (topParentNode.ParentNode as XmlElement != null)
            {
                topParentNode = topParentNode.ParentNode as XmlElement;
            }

            var prefix = xmlElement.GetPrefixOfNamespace(XmlNamespace.AurigmaSvg);
            if (string.IsNullOrEmpty(prefix))
            {
                topParentNode.SetAttribute("xmlns:aursvg", XmlNamespace.AurigmaSvg);
            }

            var type = _typeResolver.ResolveTypeAttribute(svgNode.GetType());
            if (!string.IsNullOrEmpty(type))
            {
                xmlElement.SetAttributeNode("type", XmlNamespace.AurigmaSvg).Value = type;
            }

            var attributes = svgNode.GetAttributes();
            if (attributes != null)
            {
                foreach (var attr in attributes)
                {
                    var value = attr.GetValue();
                    if (attr.DefaultValue != value && !string.IsNullOrEmpty(value))
                    {
                        XmlAttribute attrNode;
                        if (attr.NamespaceUri == XmlNamespace.Svg)
                        {
                            attrNode = _xmlDocument.CreateAttribute(attr.LocalName);
                        }
                        else
                        {
                            prefix = xmlElement.GetPrefixOfNamespace(attr.NamespaceUri);
                            if (string.IsNullOrEmpty(prefix))
                            {
                                prefix = _typeResolver.GetPrefix(attr.NamespaceUri);
                                if (!string.IsNullOrEmpty(prefix))
                                {
                                    topParentNode.SetAttribute("xmlns:" + prefix, attr.NamespaceUri);
                                }
                            }
                            attrNode = _xmlDocument.CreateAttribute(attr.LocalName, attr.NamespaceUri);
                        }
                        attrNode.Value = value;
                        xmlElement.Attributes.Append(attrNode);
                    }
                }
            }
        }

        public virtual XmlElement CreateXmlElementFromSvg(SvgNode svgNode)
        {
            var element = _xmlDocument.CreateElement(svgNode.LocalName, svgNode.NamespaceURI);
            return element;
        }
    }
}