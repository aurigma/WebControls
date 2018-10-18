// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;
using System.Collections.Generic;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    internal interface IPipelineExtender
    {
        bool CanExtendPipeline { get; }

        void ExtendPipeline(Pipeline pipeline, IImageParams destImageParams, ColorManagement colorManagement, float scale, out IEnumerable<IDisposable> deps);
    }
}