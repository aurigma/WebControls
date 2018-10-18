// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;

namespace Aurigma.Svg
{
    public class TypeResolver : ITypeResolver
    {
        private static Dictionary<string, Type> _defaultSvgNodesMap;

        static TypeResolver()
        {
            _defaultSvgNodesMap = new Dictionary<string, Type>()
            {
                { "defs", typeof(SvgDefs) },
                { "svg", typeof(SvgDocument) },
                { "ellipse", typeof(SvgEllipse) },
                { "g", typeof(SvgGroup) },
                { "image", typeof(SvgImage) },
                { "line", typeof(SvgLine) },
                { "polyline", typeof(SvgPolyline) },
                { "rect", typeof(SvgRect) },
                { "text", typeof(SvgText) },
                { "path", typeof(SvgPath) }
            };
        }

        public virtual Type ResolveType(string nodeNamespace, string nodeName, string typeName)
        {
            Type t = null;
            if (!string.IsNullOrEmpty(typeName))
            {
                t = Type.GetType(typeName, true, false);
            }
            else if (string.IsNullOrEmpty(nodeNamespace) ||
                nodeNamespace == XmlNamespace.Svg)
            {
                // Default matching
                if (!_defaultSvgNodesMap.TryGetValue(nodeName, out t))
                {
                    t = null;
                }
            }

            return t;
        }

        public virtual string ResolveTypeAttribute(Type type)
        {
            foreach (var p in _defaultSvgNodesMap)
            {
                if (p.Value == type)
                {
                    // Default type, no type attribute required.
                    return null;
                }
            }
            return type.AssemblyQualifiedName;
        }

        public virtual string GetPrefix(string namespaceUri)
        {
            switch (namespaceUri)
            {
                case XmlNamespace.Svg:
                    return "";

                case XmlNamespace.AurigmaSvg:
                    return XmlNamespace.AurigmaSvgPrefix;

                case XmlNamespace.Xlink:
                    return XmlNamespace.XlinkPrefix;

                case XmlNamespace.AurigmaVectorObjects:
                    return XmlNamespace.AurigmaVectorObjectsPrefix;

                default:
                    return null;
            }
        }
    }
}