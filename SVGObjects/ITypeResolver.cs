// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.Svg
{
    public interface ITypeResolver
    {
        Type ResolveType(string nodeNamespace, string nodeName, string typeName);

        string ResolveTypeAttribute(Type type);

        string GetPrefix(string namespaceUri);
    }
}