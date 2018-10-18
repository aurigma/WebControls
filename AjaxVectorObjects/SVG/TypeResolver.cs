// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.Svg;
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.Svg
{
    public class TypeResolver : Aurigma.Svg.TypeResolver, ITypeResolver
    {
        public override string ResolveTypeAttribute(Type type)
        {
            string str = base.ResolveTypeAttribute(type);
            if (str == type.AssemblyQualifiedName)
            {
                str = type.Name;
            }
            return str;
        }

        public override Type ResolveType(string nodeNamespace, string nodeName, string typeName)
        {
            Type t = null;
            if (!string.IsNullOrEmpty(typeName))
            {
                t = Type.GetType(typeof(TypeResolver).Namespace + "." + typeName, false, false);
            }

            if (t == null)
            {
                t = base.ResolveType(nodeNamespace, nodeName, typeName);
            }

            return t;
        }
    }
}