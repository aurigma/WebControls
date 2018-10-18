// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.FileStorage
{
    internal interface ICleanableFileStorage : IFileStorage
    {
        Func<string, DateTime?> GetLastAccessTimeMethod { get; set; }
    }
}