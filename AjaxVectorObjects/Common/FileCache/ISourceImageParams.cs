// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileCache
{
    public interface ISourceImageParams : IImageParams
    {
        FileFormat FileFormat { get; }
    }
}