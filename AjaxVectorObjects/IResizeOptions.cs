// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using Aurigma.GraphicsMill.Codecs;
using System.Drawing;
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface IResizeOptions
    {
        ColorManagement ColorManagement { get; }
        Size Size { get; }
        FileFormat FileFormat { get; }
        PixelFormat PixelFormat { get; }
        Transforms.ResizeMode ResizeMode { get; }
        string ThumbnailId { get; }

        Stream GetSourceImageReadStream();
    }
}