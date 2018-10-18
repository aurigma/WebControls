// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    [Flags]
    public enum VObjectAction
    {
        None = 0,
        DragX = 1,
        ArbitraryResize = 2,
        ProportionalResize = 4,
        Rotate = 8,
        DragY = 16,

        // composite states
        Drag = DragX | DragY,

        Resize = ArbitraryResize | ProportionalResize,
        All = Drag | Resize | Rotate
    }
}