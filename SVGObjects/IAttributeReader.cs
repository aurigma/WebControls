﻿// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Xml;

namespace Aurigma.Svg
{
    public interface IAttributeReader
    {
        void Read(SvgNode svgNode, XmlElement xmlElement);
    }
}