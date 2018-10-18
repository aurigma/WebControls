// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class ItemMovedEventArgs<T> : EventArgs
    {
        public int OldIndex { get; private set; }
        public int NewIndex { get; private set; }
        public T Item { get; private set; }

        public ItemMovedEventArgs(int oldIndex, int newIndex, T item)
        {
            this.OldIndex = oldIndex;
            this.NewIndex = newIndex;
            this.Item = item;
        }
    }
}