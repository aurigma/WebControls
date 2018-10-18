// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Xml;

namespace Aurigma.Svg
{
    public class SvgReader
    {
        private ITypeResolver _typeResolver;
        private IAttributeReader _customAttributeReader;

        public SvgReader()
            : this(new TypeResolver(), null)
        {
        }

        public SvgReader(IAttributeReader attributeReader)
            : this(new TypeResolver(), attributeReader)
        {
        }

        public SvgReader(ITypeResolver typeResolver)
            : this(typeResolver, null)
        {
        }

        public SvgReader(ITypeResolver typeResolver, IAttributeReader attributeReader)
        {
            _typeResolver = typeResolver;
            _customAttributeReader = attributeReader;
        }

        public virtual void Read(SvgNode svgNode, XmlElement xmlElement)
        {
            var composite = svgNode as ISvgCompositeElement;
            if (composite != null)
            {
                composite.ReadContent(xmlElement, this);
            }
            else
            {
                ReadChildNodes(svgNode, xmlElement);
            }

            ReadAttributes(svgNode, xmlElement);
        }

        protected virtual void ReadChildNodes(SvgNode svgNode, XmlElement xmlElement)
        {
            foreach (XmlNode childNode in xmlElement.ChildNodes)
            {
                var childElement = childNode as XmlElement;
                if (childElement != null)
                {
                    var childSvgNode = CreateSvgNodeFromXml(childElement);
                    if (childSvgNode != null)
                    {
                        Read(childSvgNode, childElement);
                        svgNode.ChildNodes.Add(childSvgNode);
                    }
                }
            }
        }

        public virtual SvgNode CreateSvgNodeFromXml(XmlElement xmlElement)
        {
            SvgNode svgNode = null;
            var ns = xmlElement.NamespaceURI;
            var nodeName = xmlElement.LocalName;
            var typeAttr = xmlElement.GetAttribute("type", XmlNamespace.AurigmaSvg);
            Type type = _typeResolver.ResolveType(ns, nodeName, typeAttr);

            if (type != null)
            {
                svgNode = (SvgNode)Activator.CreateInstance(type);
            }

            return svgNode;
        }

        protected virtual void ReadAttributes(SvgNode svgNode, XmlElement xmlElement)
        {
            var attributes = svgNode.GetAttributes();
            if (attributes != null)
            {
                foreach (var svgAttribute in attributes)
                {
                    var xmlAttr = xmlElement.GetAttributeNode(svgAttribute.LocalName, svgAttribute.NamespaceUri);

                    if (xmlAttr == null &&
                        (svgAttribute.NamespaceUri == xmlElement.NamespaceURI ||
                        svgAttribute.NamespaceUri == XmlNamespace.Svg))
                    {
                        xmlAttr = xmlElement.GetAttributeNode(svgAttribute.LocalName);
                    }

                    if (xmlAttr != null)
                    {
                        svgAttribute.SetValue(xmlAttr.Value);
                    }
                }
            }

            if (_customAttributeReader != null)
            {
                _customAttributeReader.Read(svgNode, xmlElement);
            }
        }
    }
}