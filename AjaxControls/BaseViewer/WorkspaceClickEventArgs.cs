// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System;

namespace Aurigma.GraphicsMill.AjaxControls
{
    public sealed class WorkspaceClickEventArgs : EventArgs
    {
        private double _x;
        private double _y;

        public WorkspaceClickEventArgs(double x, double y)
        {
            this._x = x;
            this._y = y;
        }

        public double X
        {
            get
            {
                return _x;
            }
        }

        public double Y
        {
            get
            {
                return _y;
            }
        }
    }
}