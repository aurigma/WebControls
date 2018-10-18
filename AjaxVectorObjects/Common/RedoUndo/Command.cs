// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects.RedoUndo
{
    [Serializable]
    public abstract class Command
    {
        public abstract void Execute(ICanvas canvas);

        public abstract void UnExecute(ICanvas canvas);
    }
}