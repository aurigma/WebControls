// Copyright (c) 2018 Aurigma Inc. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for full license information.
//
using System.Web.UI;

namespace Aurigma.GraphicsMill.AjaxControls
{
    [System.Drawing.ToolboxBitmap(typeof(ZoomRectangleNavigator), "Resources.ZoomRectangleNavigator.bmp")]
    [NonVisualControl]
    public class ZoomRectangleNavigator : RectangleController, INavigator
    {
        public ZoomRectangleNavigator() : base()
        {
            _resizeMode = ResizeMode.Proportional;
            _movable = false;
            _erasable = true;

            ScriptClassName = "Aurigma.GraphicsMill.ZoomRectangleNavigator";
        }
    }
}