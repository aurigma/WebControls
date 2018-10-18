// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ItemRemovedEventArgs<T> : EventArgs
    {
        public int Index { get; private set; }
        public T Item { get; private set; }

        public ItemRemovedEventArgs(int index, T item)
        {
            this.Index = index;
            this.Item = item;
        }
    }
}