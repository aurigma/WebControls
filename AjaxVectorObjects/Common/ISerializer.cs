// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.IO;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public interface ISerializer
    {
        void Deserialize(Stream stream, ICanvas canvas);

        void Serialize(ICanvas canvas, Stream stream);
    }
}