// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//

namespace Aurigma.GraphicsMill.AjaxControls
{
    public class RectangleEventArgs : System.EventArgs
    {
        private System.Drawing.RectangleF _rectangle;

        public RectangleEventArgs(System.Drawing.RectangleF rectangle)
        {
            _rectangle = rectangle;
        }

        public System.Drawing.RectangleF Rectangle
        {
            get
            {
                return _rectangle;
            }
        }
    }
}