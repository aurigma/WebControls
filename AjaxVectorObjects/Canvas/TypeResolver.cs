// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Web.Script.Serialization;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal class TypeResolver : JavaScriptTypeResolver
    {
        public override Type ResolveType(string id)
        {
            return Type.GetType(typeof(VObjectData).Namespace + "." + id);
        }

        public override string ResolveTypeId(Type type)
        {
            if (typeof(VObjectData).IsAssignableFrom(type))
            {
                return type.Name;
            }
            return null;
        }
    }
}