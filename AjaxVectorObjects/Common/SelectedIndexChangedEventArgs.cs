// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls.VectorObjects
{
    public class SelectedIndexChangedEventArgs : EventArgs
    {
        public int OldIndex { get; private set; }
        public int NewIndex { get; private set; }

        public SelectedIndexChangedEventArgs(int oldIndex, int newIndex)
        {
            this.OldIndex = oldIndex;
            this.NewIndex = newIndex;
        }
    }
}