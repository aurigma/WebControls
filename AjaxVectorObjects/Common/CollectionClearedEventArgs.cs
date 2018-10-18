// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class CollectionClearedEventArgs<T> : EventArgs
    {
        public T[] Items { get; private set; }

        public CollectionClearedEventArgs(T[] items)
        {
            this.Items = items;
        }
    }
}